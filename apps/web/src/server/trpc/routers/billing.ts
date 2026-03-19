import { z } from "zod";
import { router, protectedProcedure } from "../init";
import { prisma } from "@chatbot/db";
import { getPlanConfig, PLANS } from "@chatbot/shared";

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
