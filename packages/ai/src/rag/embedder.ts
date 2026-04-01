import OpenAI from "openai";

const EMBEDDING_DIMENSIONS = 1024;

export const embedder = {
  async embed(text: string): Promise<number[]> {
    return (await embedBatchInternal([text]))[0];
  },

  async embedBatch(texts: string[]): Promise<number[][]> {
    return embedBatchInternal(texts);
  },
};

async function embedBatchInternal(texts: string[]): Promise<number[][]> {
  // If OpenAI API key available, use real embeddings
  if (process.env.OPENAI_API_KEY) {
    return embedWithOpenAI(texts);
  }
  // Fallback: hash-based embedding
  return texts.map((text) => hashEmbed(text, EMBEDDING_DIMENSIONS));
}

async function embedWithOpenAI(texts: string[]): Promise<number[][]> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  // OpenAI supports batch embedding (up to 2048 inputs)
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
    dimensions: 1024, // Match current Pinecone index dimensions
  });

  return response.data
    .sort((a, b) => a.index - b.index)
    .map((d) => Array.from(d.embedding));
}

/**
 * Simple deterministic embedding based on character/word hashing.
 * Not as good as neural embeddings but works offline and is free.
 * Produces consistent vectors so similar texts get similar embeddings.
 */
function hashEmbed(text: string, dimensions: number): number[] {
  const normalized = text.toLowerCase().replace(/[^\w\s]/g, "").trim();
  const words = normalized.split(/\s+/).filter((w) => w.length > 2);
  const vector = new Float64Array(dimensions);

  // Character n-gram hashing for fine-grained similarity
  for (let i = 0; i < normalized.length - 2; i++) {
    const trigram = normalized.slice(i, i + 3);
    const hash = simpleHash(trigram);
    const idx = Math.abs(hash) % dimensions;
    vector[idx] += hash > 0 ? 1 : -1;
  }

  // Word-level hashing for semantic-level features
  for (const word of words) {
    const hash = simpleHash(word);
    const idx = Math.abs(hash) % dimensions;
    vector[idx] += (hash > 0 ? 1 : -1) * 2; // Words weighted more than trigrams
  }

  // Word bigram hashing for phrase-level features
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = words[i] + " " + words[i + 1];
    const hash = simpleHash(bigram);
    const idx = Math.abs(hash) % dimensions;
    vector[idx] += (hash > 0 ? 1 : -1) * 3;
  }

  // L2 normalize
  let norm = 0;
  for (let i = 0; i < dimensions; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm) || 1;

  const result: number[] = [];
  for (let i = 0; i < dimensions; i++) {
    result.push(vector[i] / norm);
  }
  return result;
}

function simpleHash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return hash;
}
