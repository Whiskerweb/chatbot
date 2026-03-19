interface RerankResult {
  index: number;
  score: number;
}

export const reranker = {
  async rerank(
    query: string,
    documents: string[],
    topN: number = 5
  ): Promise<RerankResult[]> {
    // If Cohere API key is available, use Cohere rerank
    if (process.env.COHERE_API_KEY) {
      return rerankerCohere(query, documents, topN);
    }
    // Fallback: return documents in original order (already sorted by vector similarity)
    return documents.slice(0, topN).map((_, index) => ({
      index,
      score: 1 - index * 0.1,
    }));
  },
};

async function rerankerCohere(
  query: string,
  documents: string[],
  topN: number
): Promise<RerankResult[]> {
  const response = await fetch("https://api.cohere.ai/v1/rerank", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "rerank-multilingual-v3.0",
      query,
      documents,
      top_n: topN,
    }),
  });

  const data = await response.json();
  return (data.results ?? []).map((r: { index: number; relevance_score: number }) => ({
    index: r.index,
    score: r.relevance_score,
  }));
}
