import { prisma } from "@chatbot/db";
import { getIndexingCredits } from "@chatbot/shared";

// Dynamically import heavy modules only when needed (avoids loading Pinecone/etc at build time)
async function getChunker() {
  const { chunker } = await import("@chatbot/ai");
  return chunker;
}

async function getEmbedder() {
  const { embedder } = await import("@chatbot/ai");
  return embedder;
}

async function getRetriever() {
  const { retriever } = await import("@chatbot/ai");
  return retriever;
}

async function getCrawler() {
  const mod = await import("@chatbot/ai/src/crawlers/website");
  return mod.crawlWebsite;
}

interface ChunkAndEmbedResult {
  chunksCreated: number;
  creditsUsed: number;
}

export async function chunkAndEmbed(
  sourceId: string,
  agentId: string,
  orgId: string,
  text: string,
  metadata: { pageUrl?: string; pageTitle?: string } = {}
): Promise<ChunkAndEmbedResult> {
  // 1. Chunk the text
  const chunker = await getChunker();
  const chunks = chunker.chunk(text);
  if (chunks.length === 0) return { chunksCreated: 0, creditsUsed: 0 };

  // 2. Generate embeddings
  let embeddings: number[][] | null = null;
  try {
    if (process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY) {
      const embedder = await getEmbedder();
      embeddings = await embedder.embedBatch(chunks.map((c) => c.content));
    }
  } catch (err) {
    console.warn("Embedding failed, storing chunks without vectors:", err);
  }

  // 3. Save chunks to DB and optionally upsert to Pinecone
  const vectors: { id: string; values: number[]; metadata: Record<string, string> }[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const pineconeId = `${sourceId}_${Date.now()}_${i}`;

    await prisma.chunk.create({
      data: {
        sourceId,
        content: chunk.content,
        tokenCount: chunk.tokenCount,
        metadata: { ...chunk.metadata, ...metadata },
        pineconeId,
      },
    });

    if (embeddings && embeddings[i]) {
      vectors.push({
        id: pineconeId,
        values: embeddings[i],
        metadata: {
          sourceId,
          chunkId: pineconeId,
          pageUrl: metadata.pageUrl ?? "",
          title: metadata.pageTitle ?? "",
        },
      });
    }
  }

  // 4. Upsert to Pinecone if we have vectors
  if (vectors.length > 0 && process.env.PINECONE_API_KEY) {
    try {
      const retriever = await getRetriever();
      await retriever.upsert(agentId, vectors);
    } catch (err) {
      console.warn("Pinecone upsert failed:", err);
    }
  }

  return { chunksCreated: chunks.length, creditsUsed: 0 };
}

export async function indexWebsite(
  sourceId: string,
  agentId: string,
  orgId: string,
  url: string,
  maxDepth: number = 3,
  maxPages: number = 100
): Promise<void> {
  try {
    // Update status to INDEXING
    await prisma.source.update({
      where: { id: sourceId },
      data: { status: "INDEXING", indexError: null },
    });

    // Crawl the website
    const crawlWebsite = await getCrawler();
    const pages = await crawlWebsite({ url, maxDepth, maxPages });

    if (pages.length === 0) {
      await prisma.source.update({
        where: { id: sourceId },
        data: { status: "FAILED", indexError: "Aucune page trouvée à cette URL" },
      });
      return;
    }

    let totalChunks = 0;
    let totalCredits = 0;

    // Process each page
    for (const page of pages) {
      const result = await chunkAndEmbed(sourceId, agentId, orgId, page.text, {
        pageUrl: page.url,
        pageTitle: page.title,
      });
      totalChunks += result.chunksCreated;
    }

    // Calculate credits: 2 per web page
    totalCredits = getIndexingCredits("web_page", pages.length);

    // Update source status
    await prisma.source.update({
      where: { id: sourceId },
      data: {
        status: "INDEXED",
        pagesCount: pages.length,
        chunksCount: totalChunks,
        lastIndexedAt: new Date(),
        creditsConsumed: totalCredits,
        indexError: null,
      },
    });

    // Deduct credits
    await prisma.organization.update({
      where: { id: orgId },
      data: { creditsUsed: { increment: totalCredits } },
    });

    await prisma.creditLog.create({
      data: {
        orgId,
        agentId,
        action: "INDEXING",
        credits: totalCredits,
        metadata: { sourceId, pagesCount: pages.length, chunksCount: totalChunks },
      },
    });

    console.log(`Indexed website ${url}: ${pages.length} pages, ${totalChunks} chunks, ${totalCredits} credits`);
  } catch (error) {
    console.error(`Failed to index website ${url}:`, error);
    await prisma.source.update({
      where: { id: sourceId },
      data: {
        status: "FAILED",
        indexError: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function indexRawText(
  sourceId: string,
  agentId: string,
  orgId: string,
  title: string,
  content: string
): Promise<void> {
  try {
    await prisma.source.update({
      where: { id: sourceId },
      data: { status: "INDEXING", indexError: null },
    });

    const result = await chunkAndEmbed(sourceId, agentId, orgId, content, {
      pageTitle: title,
    });

    // Credits: 1 per 1000 words
    const wordCount = content.split(/\s+/).length;
    const credits = getIndexingCredits("text_words", wordCount);

    await prisma.source.update({
      where: { id: sourceId },
      data: {
        status: "INDEXED",
        pagesCount: 1,
        chunksCount: result.chunksCreated,
        lastIndexedAt: new Date(),
        creditsConsumed: credits,
        indexError: null,
      },
    });

    await prisma.organization.update({
      where: { id: orgId },
      data: { creditsUsed: { increment: credits } },
    });

    await prisma.creditLog.create({
      data: {
        orgId,
        agentId,
        action: "INDEXING",
        credits,
        metadata: { sourceId, chunksCount: result.chunksCreated },
      },
    });

    console.log(`Indexed text "${title}": ${result.chunksCreated} chunks, ${credits} credits`);
  } catch (error) {
    console.error(`Failed to index text "${title}":`, error);
    await prisma.source.update({
      where: { id: sourceId },
      data: {
        status: "FAILED",
        indexError: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function indexFile(
  sourceId: string,
  agentId: string,
  orgId: string,
  fileName: string,
  fileBuffer: Buffer,
  fileType: string
): Promise<void> {
  try {
    await prisma.source.update({
      where: { id: sourceId },
      data: { status: "INDEXING", indexError: null },
    });

    let text = "";
    let pageCount = 1;

    switch (fileType) {
      case "pdf": {
        const { parsePDF } = await import("@chatbot/ai/src/parsers/pdf");
        const result = await parsePDF(fileBuffer);
        text = result.text;
        pageCount = result.pageCount;
        break;
      }
      case "docx": {
        const { parseDocx } = await import("@chatbot/ai/src/parsers/docx");
        const result = await parseDocx(fileBuffer);
        text = result.text;
        break;
      }
      case "html": {
        const { parseHTML } = await import("@chatbot/ai/src/parsers/html");
        const result = parseHTML(fileBuffer.toString("utf-8"));
        text = result.text;
        break;
      }
      case "md": {
        const { parseMarkdown } = await import("@chatbot/ai/src/parsers/markdown");
        const result = parseMarkdown(fileBuffer.toString("utf-8"));
        text = result.text;
        break;
      }
      case "txt":
      case "csv":
        text = fileBuffer.toString("utf-8");
        break;
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }

    if (!text.trim()) {
      await prisma.source.update({
        where: { id: sourceId },
        data: { status: "FAILED", indexError: "Le fichier ne contient pas de texte exploitable" },
      });
      return;
    }

    const result = await chunkAndEmbed(sourceId, agentId, orgId, text, {
      pageTitle: fileName,
    });

    // Credits based on file type
    let credits: number;
    if (fileType === "pdf") {
      credits = getIndexingCredits("pdf_page", pageCount);
    } else {
      const wordCount = text.split(/\s+/).length;
      credits = getIndexingCredits("text_words", wordCount);
    }

    await prisma.source.update({
      where: { id: sourceId },
      data: {
        status: "INDEXED",
        pagesCount: pageCount,
        chunksCount: result.chunksCreated,
        lastIndexedAt: new Date(),
        creditsConsumed: credits,
        indexError: null,
      },
    });

    await prisma.organization.update({
      where: { id: orgId },
      data: { creditsUsed: { increment: credits } },
    });

    await prisma.creditLog.create({
      data: {
        orgId,
        agentId,
        action: "INDEXING",
        credits,
        metadata: { sourceId, fileName, fileType, chunksCount: result.chunksCreated },
      },
    });

    console.log(`Indexed file "${fileName}": ${result.chunksCreated} chunks, ${credits} credits`);
  } catch (error) {
    console.error(`Failed to index file "${fileName}":`, error);
    await prisma.source.update({
      where: { id: sourceId },
      data: {
        status: "FAILED",
        indexError: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function deleteSourceData(
  sourceId: string,
  agentId: string
): Promise<void> {
  // Delete from Pinecone
  if (process.env.PINECONE_API_KEY) {
    try {
      const retriever = await getRetriever();
      await retriever.deleteBySource(agentId, sourceId);
    } catch (err) {
      console.warn("Pinecone delete failed:", err);
    }
  }

  // Delete chunks from DB
  await prisma.chunk.deleteMany({ where: { sourceId } });
}

export async function reindexSource(
  sourceId: string,
  agentId: string,
  orgId: string
): Promise<void> {
  const source = await prisma.source.findUnique({ where: { id: sourceId } });
  if (!source) throw new Error("Source not found");

  // Delete old data
  await deleteSourceData(sourceId, agentId);

  // Re-index based on type
  switch (source.type) {
    case "WEBSITE":
      if (source.url) {
        await indexWebsite(sourceId, agentId, orgId, source.url);
      }
      break;
    case "TEXT_RAW":
      // For raw text, we'd need the original content which we don't store separately
      // The chunks are the content, so we can't re-index without the original
      await prisma.source.update({
        where: { id: sourceId },
        data: { status: "FAILED", indexError: "Cannot reindex raw text — please add it again" },
      });
      break;
    default:
      await prisma.source.update({
        where: { id: sourceId },
        data: { status: "FAILED", indexError: `Reindex not supported for type ${source.type}` },
      });
  }
}
