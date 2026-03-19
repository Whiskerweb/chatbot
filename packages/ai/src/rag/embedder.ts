import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.moonshot.cn/v1",
});

const EMBEDDING_MODEL = "moonshot-v1-embedding";
const EMBEDDING_DIMENSIONS = 1024;

export const embedder = {
  async embed(text: string): Promise<number[]> {
    const response = await client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });
    // Moonshot returns variable dimensions, truncate/pad to our target
    const embedding = response.data[0].embedding;
    return normalizeEmbedding(embedding, EMBEDDING_DIMENSIONS);
  },

  async embedBatch(texts: string[]): Promise<number[][]> {
    // Moonshot may not support batch, do one by one
    const results: number[][] = [];
    for (const text of texts) {
      const embedding = await embedder.embed(text);
      results.push(embedding);
    }
    return results;
  },
};

function normalizeEmbedding(embedding: number[], targetDim: number): number[] {
  if (embedding.length === targetDim) return embedding;
  if (embedding.length > targetDim) return embedding.slice(0, targetDim);
  // Pad with zeros if shorter
  return [...embedding, ...new Array(targetDim - embedding.length).fill(0)];
}
