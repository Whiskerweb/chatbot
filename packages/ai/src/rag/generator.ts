import { llmGateway } from "../llm/gateway";
import { buildSystemPrompt } from "../llm/prompts";
import { retriever } from "./retriever";
import { reranker } from "./reranker";
import { prisma } from "@chatbot/db";
import type { LLMModel } from "@chatbot/db";

interface GenerateOptions {
  agentId: string;
  question: string;
  conversationHistory: { role: "user" | "assistant"; content: string }[];
  model: LLMModel;
  systemPrompt: string;
  strictMode: boolean;
  fallbackMessage: string;
  agentName: string;
  maxTokens: number;
  temperature: number;
}

interface GenerateResult {
  stream: ReadableStream;
  sources: { chunkId: string; sourceId: string; title?: string; url?: string; score: number }[];
  tokensInput?: number;
  tokensOutput?: number;
}

export const generator = {
  async generate(options: GenerateOptions): Promise<GenerateResult> {
    // 1. Retrieve relevant chunks
    const searchResults = await retriever.search(options.agentId, options.question, 10);

    // 2. Get chunk contents from DB
    const chunkIds = searchResults.map((r) => r.chunkId);
    const chunks = await prisma.chunk.findMany({
      where: { id: { in: chunkIds } },
      include: { source: { select: { name: true, url: true } } },
    });

    const chunkMap = new Map(chunks.map((c) => [c.id, c]));
    const orderedChunks = searchResults
      .map((r) => ({ ...r, chunk: chunkMap.get(r.chunkId) }))
      .filter((r) => r.chunk);

    // 3. Rerank
    const documents = orderedChunks.map((r) => r.chunk!.content);
    const reranked = await reranker.rerank(options.question, documents, 5);

    const topChunks = reranked.map((r) => orderedChunks[r.index]);

    // 4. Strict mode check
    if (options.strictMode && topChunks.length > 0) {
      const maxScore = Math.max(...topChunks.map((c) => c.score));
      if (maxScore < 0.3) {
        // Return fallback as a stream
        const fallbackStream = new ReadableStream({
          start(controller) {
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({ token: options.fallbackMessage })}\n\n`
              )
            );
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({ done: true })}\n\n`
              )
            );
            controller.close();
          },
        });
        return { stream: fallbackStream, sources: [] };
      }
    }

    // 5. Build context
    const contextDocs = topChunks
      .map((c) => {
        const source = c.chunk!.source;
        return `[Source: ${source.name}${source.url ? ` - ${source.url}` : ""}]\n${c.chunk!.content}`;
      })
      .join("\n\n---\n\n");

    const systemMessage = buildSystemPrompt({
      agentName: options.agentName,
      fallbackMessage: options.fallbackMessage,
      customPrompt: options.systemPrompt,
      contextDocs,
    });

    // 6. Build messages
    const messages = [
      { role: "system" as const, content: systemMessage },
      ...options.conversationHistory.slice(-5),
      { role: "user" as const, content: options.question },
    ];

    // 7. Stream response from LLM
    const stream = await llmGateway.streamChat({
      model: options.model,
      messages,
      maxTokens: options.maxTokens,
      temperature: options.temperature,
    });

    const sources = topChunks.map((c) => ({
      chunkId: c.chunkId,
      sourceId: c.sourceId,
      title: c.chunk!.source.name,
      url: c.chunk!.source.url ?? undefined,
      score: c.score,
    }));

    return { stream, sources };
  },
};
