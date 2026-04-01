import { z } from "zod";
import { router, protectedProcedure } from "../init";
import { prisma } from "@chatbot/db";
import { getPlanConfig, PLANS } from "@chatbot/shared";
import { getStripe, PLAN_PRICE_MAP } from "@/lib/stripe";
import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";

export const billingRouter = router({
  getUsage: protectedProcedure.query(async ({ ctx }) => {
    const org = await prisma.organization.findUniqueOrThrow({ where: { id: ctx.orgId } });
    const plan = getPlanConfig(org.plan);

    return {
      creditsUsed: org.creditsUsed,
      creditsTotal: org.creditsTotal,
      creditsRemaining: org.creditsTotal - org.creditsUsed,
      usagePercent: Math.round((org.creditsUsed / Math.max(1, org.creditsTotal)) * 100),
      resetAt: org.creditsResetAt,
      plan: plan.name,
    };
  }),

  getPlans: protectedProcedure.query(async () => {
    return Object.values(PLANS);
  }),

  getCurrentPlan: protectedProcedure.query(async ({ ctx }) => {
    const org = await prisma.organization.findUniqueOrThrow({ where: { id: ctx.orgId } });
    const plan = getPlanConfig(org.plan);

    return {
      ...plan,
      stripeSubId: org.stripeSubId,
      creditsUsed: org.creditsUsed,
      creditsTotal: org.creditsTotal,
      resetAt: org.creditsResetAt,
    };
  }),

  createCheckout: protectedProcedure
    .input(z.object({ plan: z.enum(["STARTER", "PRO", "GROWTH"]) }))
    .mutation(async ({ ctx, input }) => {
      const org = await prisma.organization.findUniqueOrThrow({ where: { id: ctx.orgId } });

      const priceId = PLAN_PRICE_MAP[input.plan];
      if (!priceId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Plan invalide" });
      }

      // If already subscribed, redirect to portal instead
      if (org.stripeSubId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Vous avez déjà un abonnement. Utilisez le portail pour changer de plan.",
        });
      }

      // Traaaction: read click ID from cookie for affiliate attribution
      const store = await cookies();
      const clickId = store.get("trac_click_id")?.value || "";

      const sessionParams: Record<string, unknown> = {
        mode: "subscription" as const,
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: {
          orgId: org.id,
          plan: input.plan,
          tracCustomerExternalId: ctx.userId,
          tracClickId: clickId,
        },
        client_reference_id: clickId || undefined,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
        allow_promotion_codes: true,
        subscription_data: {
          metadata: {
            orgId: org.id,
            plan: input.plan,
            tracCustomerExternalId: ctx.userId,
            tracClickId: clickId,
          },
        },
      };

      // Reuse existing Stripe customer if available
      if (org.stripeCustomerId) {
        (sessionParams as any).customer = org.stripeCustomerId;
      } else {
        (sessionParams as any).customer_email = ctx.member.email;
      }

      const session = await getStripe().checkout.sessions.create(sessionParams as any);

      return { url: session.url };
    }),

  createPortal: protectedProcedure.mutation(async ({ ctx }) => {
    const org = await prisma.organization.findUniqueOrThrow({ where: { id: ctx.orgId } });

    if (!org.stripeCustomerId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Aucun abonnement actif. Choisissez d'abord un plan.",
      });
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: org.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    });

    return { url: session.url };
  }),

  getCreditLogs: protectedProcedure
    .input(z.object({
      page: z.number().optional().default(1),
      limit: z.number().optional().default(50),
      action: z.string().optional(),
      agentId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { page, limit, action, agentId } = input;
      const where: any = { orgId: ctx.orgId };
      if (action) where.action = action;
      if (agentId) where.agentId = agentId;

      const [items, total] = await Promise.all([
        prisma.creditLog.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.creditLog.count({ where }),
      ]);

      return { items, total, page, limit };
    }),

  getInvoices: protectedProcedure.query(async ({ ctx }) => {
    return prisma.invoice.findMany({
      where: { orgId: ctx.orgId },
      orderBy: { createdAt: "desc" },
    });
  }),
});
