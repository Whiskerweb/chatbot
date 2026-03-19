import { Worker, Job } from "bullmq";
import { getRedisConnection } from "../connection";
import type { IndexingJobData } from "../queues";
import { prisma } from "@chatbot/db";

export function startIndexingWorker() {
  const connection = getRedisConnection();
  if (!connection) return null;

  const worker = new Worker<IndexingJobData>(
    "indexing",
    async (job: Job<IndexingJobData>) => {
      const { type, sourceId, orgId, agentId } = job.data;

      switch (type) {
        case "crawl-website":
          await handleCrawlWebsite(job.data);
          break;
        case "parse-file":
          await handleParseFile(job.data);
          break;
        case "chunk-and-embed":
          await handleChunkAndEmbed(job.data);
          break;
        case "delete-source":
          await handleDeleteSource(job.data);
          break;
      }
    },
    {
      connection,
      concurrency: 3,
    }
  );

  worker.on("failed", (job, err) => {
    console.error(`Indexing job ${job?.id} failed:`, err);
  });

  return worker;
}

async function handleCrawlWebsite(data: IndexingJobData) {
  const { sourceId, url, maxDepth = 3, maxPages = 100 } = data;

  await prisma.source.update({
    where: { id: sourceId },
    data: { status: "INDEXING" },
  });

  try {
    const { crawlWebsite } = await import("@chatbot/ai/src/crawlers/website");
    const results = await crawlWebsite({ url: url!, maxDepth, maxPages });

    await prisma.source.update({
      where: { id: sourceId },
      data: { pagesCount: results.length },
    });

    // Queue chunk-and-embed jobs for each page
    const { indexingQueue } = await import("../queues");
    for (const page of results) {
      await indexingQueue?.add("chunk-and-embed", {
        type: "chunk-and-embed",
        sourceId,
        orgId: data.orgId,
        agentId: data.agentId,
        rawText: page.text,
        metadata: { pageUrl: page.url, pageTitle: page.title },
      });
    }
  } catch (error) {
    await prisma.source.update({
      where: { id: sourceId },
      data: { status: "FAILED", indexError: String(error) },
    });
    throw error;
  }
}

async function handleParseFile(data: IndexingJobData) {
  const { sourceId } = data;

  await prisma.source.update({
    where: { id: sourceId },
    data: { status: "INDEXING" },
  });

  // TODO: Download from R2, parse based on fileType, queue chunk-and-embed
  console.log(`Parse file job for source ${sourceId} - implementation pending R2 setup`);
}

async function handleChunkAndEmbed(data: IndexingJobData) {
  const { sourceId, rawText, metadata, agentId, orgId } = data;
  if (!rawText) return;

  try {
    const { chunker } = await import("@chatbot/ai/src/rag/chunker");
    const { embedder } = await import("@chatbot/ai/src/rag/embedder");
    const { retriever } = await import("@chatbot/ai/src/rag/retriever");

    // 1. Chunk
    const chunks = chunker.chunk(rawText);

    // 2. Embed
    const texts = chunks.map((c) => c.content);
    const embeddings = await embedder.embedBatch(texts);

    // 3. Save chunks to DB and Pinecone
    const vectors = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const pineconeId = `${sourceId}_${i}`;

      await prisma.chunk.create({
        data: {
          sourceId,
          content: chunk.content,
          tokenCount: chunk.tokenCount,
          metadata: { ...chunk.metadata, ...metadata },
          pineconeId,
        },
      });

      vectors.push({
        id: pineconeId,
        values: embeddings[i],
        metadata: {
          sourceId,
          chunkId: pineconeId,
          pageUrl: metadata?.pageUrl ?? "",
          title: metadata?.pageTitle ?? "",
        },
      });
    }

    await retriever.upsert(agentId, vectors);

    // 4. Update source
    const totalChunks = await prisma.chunk.count({ where: { sourceId } });
    await prisma.source.update({
      where: { id: sourceId },
      data: {
        status: "INDEXED",
        chunksCount: totalChunks,
        lastIndexedAt: new Date(),
        indexError: null,
      },
    });

    // 5. Debit credits
    const { getIndexingCredits } = await import("@chatbot/shared");
    const credits = getIndexingCredits("web_page", 1);
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
        metadata: { sourceId },
      },
    });
  } catch (error) {
    await prisma.source.update({
      where: { id: sourceId },
      data: { status: "FAILED", indexError: String(error) },
    });
    throw error;
  }
}

async function handleDeleteSource(data: IndexingJobData) {
  const { sourceId, agentId } = data;

  try {
    const { retriever } = await import("@chatbot/ai/src/rag/retriever");
    await retriever.deleteBySource(agentId, sourceId);
    await prisma.chunk.deleteMany({ where: { sourceId } });
    await prisma.source.delete({ where: { id: sourceId } });
  } catch (error) {
    console.error(`Failed to delete source ${sourceId}:`, error);
    throw error;
  }
}
