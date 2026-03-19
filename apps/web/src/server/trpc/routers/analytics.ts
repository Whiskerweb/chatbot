import { z } from "zod";
import { router, protectedProcedure } from "../init";
import { prisma } from "@chatbot/db";

export const analyticsRouter = router({
  overview: protectedProcedure
    .input(z.object({ period: z.enum(["7d", "30d", "90d"]).optional().default("30d") }))
    .query(async ({ ctx, input }) => {
      const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
      const days = daysMap[input.period];
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const previousSince = new Date(Date.now() - days * 2 * 24 * 60 * 60 * 1000);

      const [
        conversations,
        prevConversations,
        messages,
        prevMessages,
        leads,
        prevLeads,
        org,
      ] = await Promise.all([
        prisma.conversation.count({ where: { agent: { orgId: ctx.orgId }, createdAt: { gte: since } } }),
        prisma.conversation.count({ where: { agent: { orgId: ctx.orgId }, createdAt: { gte: previousSince, lt: since } } }),
        prisma.message.count({ where: { conversation: { agent: { orgId: ctx.orgId } }, createdAt: { gte: since } } }),
        prisma.message.count({ where: { conversation: { agent: { orgId: ctx.orgId } }, createdAt: { gte: previousSince, lt: since } } }),
        prisma.lead.count({ where: { agent: { orgId: ctx.orgId }, createdAt: { gte: since } } }),
        prisma.lead.count({ where: { agent: { orgId: ctx.orgId }, createdAt: { gte: previousSince, lt: since } } }),
        prisma.organization.findUniqueOrThrow({ where: { id: ctx.orgId } }),
      ]);

      const calcChange = (current: number, previous: number) =>
        previous === 0 ? 0 : Math.round(((current - previous) / previous) * 100);

      // Calculate deflection rate (conversations resolved without human = no HUMAN messages)
      const totalResolved = await prisma.conversation.count({
        where: { agent: { orgId: ctx.orgId }, createdAt: { gte: since }, resolved: true },
      });
      const escalated = await prisma.conversation.count({
        where: { agent: { orgId: ctx.orgId }, createdAt: { gte: since }, escalated: true },
      });
      const deflectionRate = conversations > 0 ? Math.round(((conversations - escalated) / conversations) * 100) : 0;

      return {
        conversations: { total: conversations, vsPrevious: calcChange(conversations, prevConversations) },
        messages: { total: messages, vsPrevious: calcChange(messages, prevMessages) },
        deflectionRate: { value: deflectionRate, vsPrevious: 0 },
        leadsCapture: { total: leads, vsPrevious: calcChange(leads, prevLeads) },
        creditsUsed: {
          total: org.creditsUsed,
          remaining: org.creditsTotal - org.creditsUsed,
          projectedEnd: Math.round(org.creditsTotal > 0 ? (org.creditsUsed / Math.max(1, days)) * 30 : 0),
        },
      };
    }),

  topQuestions: protectedProcedure
    .input(z.object({ agentId: z.string().optional(), limit: z.number().optional().default(20) }))
    .query(async ({ ctx, input }) => {
      const where: any = {};
      if (input.agentId) {
        where.agentId = input.agentId;
      } else {
        // Get all agent IDs for this org
        const agents = await prisma.agent.findMany({ where: { orgId: ctx.orgId }, select: { id: true } });
        where.agentId = { in: agents.map((a) => a.id) };
      }
      where.answered = true;

      return prisma.topQuestion.findMany({
        where,
        orderBy: { count: "desc" },
        take: input.limit,
      });
    }),

  unanswered: protectedProcedure
    .input(z.object({ agentId: z.string().optional(), limit: z.number().optional().default(20) }))
    .query(async ({ ctx, input }) => {
      const where: any = { answered: false };
      if (input.agentId) {
        where.agentId = input.agentId;
      } else {
        const agents = await prisma.agent.findMany({ where: { orgId: ctx.orgId }, select: { id: true } });
        where.agentId = { in: agents.map((a) => a.id) };
      }

      return prisma.topQuestion.findMany({
        where,
        orderBy: { count: "desc" },
        take: input.limit,
      });
    }),

  credits: protectedProcedure
    .input(z.object({ period: z.enum(["7d", "30d", "90d"]).optional().default("30d") }))
    .query(async ({ ctx, input }) => {
      const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
      const days = daysMap[input.period];
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      return prisma.creditLog.findMany({
        where: { orgId: ctx.orgId, createdAt: { gte: since } },
        orderBy: { createdAt: "asc" },
      });
    }),
});
