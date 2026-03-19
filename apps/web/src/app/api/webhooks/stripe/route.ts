import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@chatbot/db";
import { getPlanConfig, PLANS } from "@chatbot/shared";

// Stripe webhook handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // TODO: Verify Stripe signature with stripe.webhooks.constructEvent
    // For now, parse the body directly
    const event = JSON.parse(body);

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
        // Handle plan change
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
          where: { stripeCustomerId: invoice.customer },
        });
        if (org) {
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
