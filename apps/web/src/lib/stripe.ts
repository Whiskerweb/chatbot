import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const PLAN_PRICE_MAP: Record<string, string> = {
  STARTER: process.env.STRIPE_PRICE_STARTER!,
  PRO: process.env.STRIPE_PRICE_PRO!,
  GROWTH: process.env.STRIPE_PRICE_GROWTH!,
};

export function getPlanSlugFromPriceId(priceId: string): string | null {
  for (const [slug, id] of Object.entries(PLAN_PRICE_MAP)) {
    if (id === priceId) return slug;
  }
  return null;
}
