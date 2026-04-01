export interface ProductInput {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl?: string | null;
  price?: string | null;
  ctaText: string;
  keywords: string[];
  displayMode: string;
}

export interface ProductMatch {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
  price?: string;
  ctaText: string;
  displayMode: string;
  matchScore: number;
}

/**
 * Matches products to a user message based on keyword overlap.
 * Returns top 2 matching products sorted by score.
 */
export function matchProducts(
  userMessage: string,
  products: ProductInput[]
): ProductMatch[] {
  const lower = userMessage.toLowerCase();
  const words = lower.split(/\s+/);

  const matches: ProductMatch[] = [];

  for (const product of products) {
    let score = 0;
    for (const keyword of product.keywords) {
      const kw = keyword.toLowerCase();
      // Multi-word keywords: check phrase inclusion
      // Single-word: check if any word contains it
      if (kw.includes(" ") ? lower.includes(kw) : words.some((w) => w.includes(kw))) {
        score++;
      }
    }

    if (score > 0) {
      matches.push({
        id: product.id,
        name: product.name,
        description: product.description,
        url: product.url,
        imageUrl: product.imageUrl ?? undefined,
        price: product.price ?? undefined,
        ctaText: product.ctaText,
        displayMode: product.displayMode,
        matchScore: score,
      });
    }
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 2);
}
