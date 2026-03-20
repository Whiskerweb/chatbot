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

/** @deprecated Use getStripe() instead — kept for backward compat */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
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
