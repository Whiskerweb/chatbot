import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return _stripe;
}

export function getPlanPriceMap(): Record<string, string> {
  return {
    STARTER: process.env.STRIPE_PRICE_STARTER!,
    PRO: process.env.STRIPE_PRICE_PRO!,
    GROWTH: process.env.STRIPE_PRICE_GROWTH!,
  };
}

export function getPlanSlugFromPriceId(priceId: string): string | null {
  for (const [slug, id] of Object.entries(getPlanPriceMap())) {
    if (id === priceId) return slug;
  }
  return null;
}
