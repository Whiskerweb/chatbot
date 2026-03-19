import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const embedder = {
  async embed(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  },

  async embedBatch(texts: string[]): Promise<number[][]> {
    // OpenAI supports batch embedding
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
    });
    return response.data
      .sort((a, b) => a.index - b.index)
      .map((d) => d.embedding);
  },
};
