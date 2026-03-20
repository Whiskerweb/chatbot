/**
 * Script one-shot pour créer les produits et prix Stripe.
 * Usage: npx tsx scripts/stripe-setup.ts
 *
 * Après exécution, copie les STRIPE_PRICE_* dans ton .env
 */

import Stripe from "stripe";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../.env") });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

const PLANS = [
  {
    slug: "STARTER",
    name: "Claudia Starter",
    description: "3 000 crédits/mois, 3 agents, 500 sources",
    priceMonthly: 2900, // in cents
  },
  {
    slug: "PRO",
    name: "Claudia Pro",
    description: "15 000 crédits/mois, 10 agents, 5 000 sources",
    priceMonthly: 7900,
  },
  {
    slug: "GROWTH",
    name: "Claudia Growth",
    description: "50 000 crédits/mois, 25 agents, 15 000 sources",
    priceMonthly: 19900,
  },
];

async function main() {
  console.log("Creating Stripe products and prices...\n");

  const results: Record<string, string> = {};

  for (const plan of PLANS) {
    // Check if product already exists
    const existingProducts = await stripe.products.search({
      query: `metadata["planSlug"]:"${plan.slug}"`,
    });

    let product: Stripe.Product;

    if (existingProducts.data.length > 0) {
      product = existingProducts.data[0];
      console.log(`Product "${plan.name}" already exists (${product.id})`);
    } else {
      product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: { planSlug: plan.slug },
      });
      console.log(`Created product "${plan.name}" (${product.id})`);
    }

    // Check if price already exists
    const existingPrices = await stripe.prices.list({
      product: product.id,
      active: true,
    });

    const matchingPrice = existingPrices.data.find(
      (p) => p.unit_amount === plan.priceMonthly && p.recurring?.interval === "month"
    );

    let price: Stripe.Price;

    if (matchingPrice) {
      price = matchingPrice;
      console.log(`Price for "${plan.name}" already exists (${price.id})`);
    } else {
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.priceMonthly,
        currency: "usd",
        recurring: { interval: "month" },
        metadata: { planSlug: plan.slug },
      });
      console.log(`Created price for "${plan.name}": ${price.id}`);
    }

    results[plan.slug] = price.id;
  }

  console.log("\n--- Add these to your .env file ---\n");
  for (const [slug, priceId] of Object.entries(results)) {
    console.log(`STRIPE_PRICE_${slug}=${priceId}`);
  }
  console.log("\n--- Done! ---");
}

main().catch(console.error);
