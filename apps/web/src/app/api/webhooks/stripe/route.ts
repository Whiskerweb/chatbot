import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@chatbot/db";
import { getPlanConfig } from "@chatbot/shared";
import { getStripe, getPlanSlugFromPriceId } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Webhook signature verification is REQUIRED
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("[Stripe] STRIPE_WEBHOOK_SECRET is not set — rejecting webhook");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

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
              creditsUsed: 0,
              creditsResetAt: new Date(),
              stripeCustomerId: session.customer as string,
              stripeSubId: session.subscription as string,
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

        // Idempotency: check if this invoice was already processed
        const existingInvoice = await prisma.invoice.findUnique({
          where: { stripeInvoiceId: invoice.id },
        });
        if (existingInvoice) {
          return NextResponse.json({ received: true });
        }

        const org = await prisma.organization.findFirst({
          where: { stripeCustomerId: invoice.customer as string },
        });
        if (org) {
          // Reset credits on renewal
          const nextReset = new Date();
          nextReset.setMonth(nextReset.getMonth() + 1);

          await prisma.organization.update({
            where: { id: org.id },
            data: {
              creditsUsed: 0,
              creditsResetAt: nextReset,
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

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const org = await prisma.organization.findFirst({
          where: { stripeCustomerId: invoice.customer as string },
        });
        if (org) {
          // After payment failure, Stripe retries automatically (3 attempts over ~3 weeks)
          // Log the failure for monitoring
          console.warn(`[Stripe] Payment failed for org ${org.id} (${org.name}), invoice ${invoice.id}`);

          // If this is the final attempt (subscription will be cancelled by Stripe),
          // the customer.subscription.deleted event will handle the downgrade
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Stripe] Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
