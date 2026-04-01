import { Pinecone } from "@pinecone-database/pinecone";
import { embedder } from "./embedder";

let _pinecone: Pinecone | null = null;

function getPinecone(): Pinecone {
  if (!_pinecone) {
    _pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY ?? "",
    });
  }
  return _pinecone;
}

interface RetrievalResult {
  chunkId: string;
  sourceId: string;
  score: number;
  pageUrl?: string;
  title?: string;
}

export const retriever = {
  async search(
    agentId: string,
    query: string,
    topK: number = 10,
    filter?: Record<string, any>
  ): Promise<RetrievalResult[]> {
    const queryEmbedding = await embedder.embed(query);
    const index = getPinecone().index(process.env.PINECONE_INDEX ?? "chatbot");

    const results = await index.namespace(`agent_${agentId}`).query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
      ...(filter ? { filter } : {}),
    });

    return (results.matches ?? []).map((match) => ({
      chunkId: match.metadata?.chunkId as string,
      sourceId: match.metadata?.sourceId as string,
      score: match.score ?? 0,
      pageUrl: match.metadata?.pageUrl as string | undefined,
      title: match.metadata?.title as string | undefined,
    }));
  },

  async upsert(
    agentId: string,
    vectors: {
      id: string;
      values: number[];
      metadata: Record<string, string>;
    }[]
  ): Promise<void> {
    const index = getPinecone().index(process.env.PINECONE_INDEX ?? "chatbot");

    // Pinecone recommends batches of 100
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await index.namespace(`agent_${agentId}`).upsert(batch);
    }
  },

  async deleteBySource(agentId: string, sourceId: string): Promise<void> {
    const index = getPinecone().index(process.env.PINECONE_INDEX ?? "chatbot");
    await index.namespace(`agent_${agentId}`).deleteMany({
      filter: { sourceId: { $eq: sourceId } },
    });
  },

  async deleteNamespace(agentId: string): Promise<void> {
    const index = getPinecone().index(process.env.PINECONE_INDEX ?? "chatbot");
    await index.namespace(`agent_${agentId}`).deleteAll();
  },
};
