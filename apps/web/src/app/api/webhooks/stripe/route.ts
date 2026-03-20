import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@chatbot/db";
import { getPlanConfig } from "@chatbot/shared";
import { stripe, getPlanSlugFromPriceId } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event;

    // Verify signature if webhook secret is configured
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      // Fallback for development (no webhook secret configured yet)
      console.warn("STRIPE_WEBHOOK_SECRET not set — skipping signature verification");
      event = JSON.parse(body);
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orgId = session.metadata?.orgId;
        const planSlug = session.metadata?.plan;

        if (orgId && planSlug) {
          const planConfig = getPlanConfig(planSlug);
          await prisma.organization.update({
            where: { id: orgId },
            data: {
              plan: planSlug as any,
              creditsTotal: planConfig.creditsPerMonth,
              stripeCustomerId: session.customer,
              stripeSubId: session.subscription,
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const org = await prisma.organization.findFirst({
          where: { stripeSubId: subscription.id },
        });

        if (org) {
          // Get the price ID from the subscription items
          const priceId = subscription.items?.data?.[0]?.price?.id;
          if (priceId) {
            const planSlug = getPlanSlugFromPriceId(priceId);
            if (planSlug) {
              const planConfig = getPlanConfig(planSlug);
              await prisma.organization.update({
                where: { id: org.id },
                data: {
                  plan: planSlug as any,
                  creditsTotal: planConfig.creditsPerMonth,
                },
              });
            }
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const org = await prisma.organization.findFirst({
          where: { stripeSubId: subscription.id },
        });
        if (org) {
          await prisma.organization.update({
            where: { id: org.id },
            data: {
              plan: "FREE",
              creditsTotal: 100,
              stripeSubId: null,
            },
          });
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        const org = await prisma.organization.findFirst({
          where: { stripeCustomerId: invoice.customer as string },
        });
        if (org) {
          // Reset credits on renewal
          await prisma.organization.update({
            where: { id: org.id },
            data: {
              creditsUsed: 0,
              creditsResetAt: new Date(),
            },
          });

          await prisma.invoice.create({
            data: {
              orgId: org.id,
              stripeInvoiceId: invoice.id,
              amount: invoice.amount_paid,
              status: "paid",
              pdfUrl: invoice.invoice_pdf,
            },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
