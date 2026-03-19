import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../init";
import { prisma } from "@chatbot/db";
import { isFeatureAvailable } from "@chatbot/shared";

// Helper: get agent filter for org (with optional single agent)
async function getAgentFilter(orgId: string, agentId?: string) {
  if (agentId) return { agentId };
  const agents = await prisma.agent.findMany({ where: { orgId }, select: { id: true } });
  return { agentId: { in: agents.map((a) => a.id) } };
}

export const analyticsRouter = router({
  overview: protectedProcedure
    .input(z.object({
      period: z.enum(["7d", "30d", "90d"]).optional().default("30d"),
      agentId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
      const days = daysMap[input.period];
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const previousSince = new Date(Date.now() - days * 2 * 24 * 60 * 60 * 1000);

      const agentWhere = input.agentId
        ? { agentId: input.agentId }
        : { agent: { orgId: ctx.orgId } };
      const agentWherePrev = agentWhere;

      const [
        conversations,
        prevConversations,
        messages,
        prevMessages,
        leads,
        prevLeads,
        org,
      ] = await Promise.all([
        prisma.conversation.count({ where: { ...agentWhere, createdAt: { gte: since } } }),
        prisma.conversation.count({ where: { ...agentWherePrev, createdAt: { gte: previousSince, lt: since } } }),
        prisma.message.count({ where: { conversation: agentWhere, createdAt: { gte: since } } }),
        prisma.message.count({ where: { conversation: agentWherePrev, createdAt: { gte: previousSince, lt: since } } }),
        prisma.lead.count({ where: { ...(input.agentId ? { agentId: input.agentId } : { agent: { orgId: ctx.orgId } }), createdAt: { gte: since } } }),
        prisma.lead.count({ where: { ...(input.agentId ? { agentId: input.agentId } : { agent: { orgId: ctx.orgId } }), createdAt: { gte: previousSince, lt: since } } }),
        prisma.organization.findUniqueOrThrow({ where: { id: ctx.orgId } }),
      ]);

      const calcChange = (current: number, previous: number) =>
        previous === 0 ? 0 : Math.round(((current - previous) / previous) * 100);

      const escalated = await prisma.conversation.count({
        where: { ...agentWhere, createdAt: { gte: since }, escalated: true },
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
        plan: org.plan as string,
      };
    }),

  topQuestions: protectedProcedure
    .input(z.object({ agentId: z.string().optional(), limit: z.number().optional().default(20) }))
    .query(async ({ ctx, input }) => {
      const filter = await getAgentFilter(ctx.orgId, input.agentId);
      return prisma.topQuestion.findMany({
        where: { ...filter, answered: true },
        orderBy: { count: "desc" },
        take: input.limit,
      });
    }),

  unanswered: protectedProcedure
    .input(z.object({ agentId: z.string().optional(), limit: z.number().optional().default(20) }))
    .query(async ({ ctx, input }) => {
      const filter = await getAgentFilter(ctx.orgId, input.agentId);
      return prisma.topQuestion.findMany({
        where: { ...filter, answered: false },
        orderBy: { count: "desc" },
        take: input.limit,
      });
    }),

  credits: protectedProcedure
    .input(z.object({
      period: z.enum(["7d", "30d", "90d"]).optional().default("30d"),
      agentId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
      const days = daysMap[input.period];
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      return prisma.creditLog.findMany({
        where: {
          orgId: ctx.orgId,
          createdAt: { gte: since },
          ...(input.agentId ? { agentId: input.agentId } : {}),
        },
        orderBy: { createdAt: "asc" },
      });
    }),

  conversationsTrend: protectedProcedure
    .input(z.object({
      period: z.enum(["7d", "30d", "90d"]).optional().default("30d"),
      agentId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
      const days = daysMap[input.period];
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const agentWhere = input.agentId
        ? { agentId: input.agentId }
        : { agent: { orgId: ctx.orgId } };

      const result: Array<{ date: string; count: number }> = [];

      for (let i = 0; i < days; i++) {
        const dayStart = new Date(since.getTime() + i * 24 * 60 * 60 * 1000);
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

        const count = await prisma.conversation.count({
          where: { ...agentWhere, createdAt: { gte: dayStart, lt: dayEnd } },
        });

        result.push({ date: dayStart.toISOString().split("T")[0], count });
      }

      return result;
    }),

  channelDistribution: protectedProcedure
    .input(z.object({
      period: z.enum(["7d", "30d", "90d"]).optional().default("30d"),
      agentId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
      const days = daysMap[input.period];
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const agentWhere = input.agentId
        ? { agentId: input.agentId }
        : { agent: { orgId: ctx.orgId } };

      const groups = await prisma.conversation.groupBy({
        by: ["channel"],
        _count: { _all: true },
        where: { ...agentWhere, createdAt: { gte: since } },
      });

      return groups.map((g) => ({ channel: g.channel, count: g._count._all }));
    }),

  satisfactionStats: protectedProcedure
    .input(z.object({
      period: z.enum(["7d", "30d", "90d"]).optional().default("30d"),
      agentId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
      const days = daysMap[input.period];
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const agentWhere = input.agentId
        ? { agentId: input.agentId }
        : { agent: { orgId: ctx.orgId } };

      const conversations = await prisma.conversation.findMany({
        where: { ...agentWhere, createdAt: { gte: since }, rating: { not: null } },
        select: { rating: true },
      });

      const total = conversations.length;
      const sum = conversations.reduce((acc, c) => acc + (c.rating ?? 0), 0);
      const average = total > 0 ? Math.round((sum / total) * 10) / 10 : 0;

      const distribution: Array<{ rating: number; count: number }> = [];
      for (let r = 1; r <= 5; r++) {
        distribution.push({ rating: r, count: conversations.filter((c) => c.rating === r).length });
      }

      return { average, total, distribution };
    }),

  questionCategories: protectedProcedure
    .input(z.object({ agentId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const org = await prisma.organization.findUniqueOrThrow({ where: { id: ctx.orgId } });

      if (!isFeatureAvailable(org.plan, "aiAnalytics")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "AI Analytics nécessite un plan Starter ou supérieur",
        });
      }

      const agents = await prisma.agent.findMany({ where: { orgId: ctx.orgId }, select: { id: true } });
      const agentIds = input.agentId ? [input.agentId] : agents.map((a) => a.id);

      return prisma.questionCategory.findMany({
        where: { agentId: { in: agentIds } },
        orderBy: { count: "desc" },
      });
    }),

  // NEW: Credit breakdown by action type
  creditBreakdown: protectedProcedure
    .input(z.object({
      period: z.enum(["7d", "30d", "90d"]).optional().default("30d"),
      agentId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
      const days = daysMap[input.period];
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const groups = await prisma.creditLog.groupBy({
        by: ["action"],
        _sum: { credits: true },
        where: {
          orgId: ctx.orgId,
          createdAt: { gte: since },
          ...(input.agentId ? { agentId: input.agentId } : {}),
        },
      });

      return groups.map((g) => ({
        action: g.action,
        credits: g._sum.credits ?? 0,
      }));
    }),

  // NEW: Message performance metrics (latency, feedback, tokens)
  messagePerformance: protectedProcedure
    .input(z.object({
      period: z.enum(["7d", "30d", "90d"]).optional().default("30d"),
      agentId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
      const days = daysMap[input.period];
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const convWhere = input.agentId
        ? { agentId: input.agentId }
        : { agent: { orgId: ctx.orgId } };

      // Latency stats
      const latencyMessages = await prisma.message.findMany({
        where: {
          role: "ASSISTANT",
          conversation: convWhere,
          createdAt: { gte: since },
          latencyMs: { not: null },
        },
        select: { latencyMs: true },
      });

      const avgLatencyMs = latencyMessages.length > 0
        ? Math.round(latencyMessages.reduce((sum, m) => sum + (m.latencyMs ?? 0), 0) / latencyMessages.length)
        : 0;

      // Feedback stats
      const feedbackMessages = await prisma.message.findMany({
        where: {
          conversation: convWhere,
          createdAt: { gte: since },
          feedbackScore: { not: null },
        },
        select: { feedbackScore: true },
      });

      const feedbackTotal = feedbackMessages.length;
      const feedbackPositive = feedbackMessages.filter((m) => m.feedbackScore === 5 || m.feedbackScore === 1).length;
      const feedbackPositiveCount = feedbackMessages.filter((m) => m.feedbackScore === 5).length;
      const feedbackPositiveRate = feedbackTotal > 0
        ? Math.round((feedbackPositiveCount / feedbackTotal) * 100)
        : 0;

      // Token stats
      const tokenMessages = await prisma.message.findMany({
        where: {
          role: "ASSISTANT",
          conversation: convWhere,
          createdAt: { gte: since },
          tokensOutput: { not: null },
        },
        select: { tokensOutput: true },
      });

      const avgTokensOutput = tokenMessages.length > 0
        ? Math.round(tokenMessages.reduce((sum, m) => sum + (m.tokensOutput ?? 0), 0) / tokenMessages.length)
        : 0;

      return { avgLatencyMs, feedbackPositiveRate, feedbackTotal, avgTokensOutput };
    }),

  // NEW: Model usage distribution
  modelUsage: protectedProcedure
    .input(z.object({
      period: z.enum(["7d", "30d", "90d"]).optional().default("30d"),
      agentId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
      const days = daysMap[input.period];
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const convWhere = input.agentId
        ? { agentId: input.agentId }
        : { agent: { orgId: ctx.orgId } };

      const messages = await prisma.message.findMany({
        where: {
          role: "ASSISTANT",
          conversation: convWhere,
          createdAt: { gte: since },
          model: { not: null },
        },
        select: { model: true, latencyMs: true, tokensOutput: true, creditsUsed: true },
      });

      // Group by model
      const byModel = new Map<string, { count: number; totalLatency: number; latencyCount: number; totalTokens: number; tokenCount: number; totalCredits: number }>();

      for (const msg of messages) {
        const model = msg.model!;
        const entry = byModel.get(model) ?? { count: 0, totalLatency: 0, latencyCount: 0, totalTokens: 0, tokenCount: 0, totalCredits: 0 };
        entry.count++;
        if (msg.latencyMs != null) { entry.totalLatency += msg.latencyMs; entry.latencyCount++; }
        if (msg.tokensOutput != null) { entry.totalTokens += msg.tokensOutput; entry.tokenCount++; }
        entry.totalCredits += msg.creditsUsed;
        byModel.set(model, entry);
      }

      return Array.from(byModel.entries()).map(([model, data]) => ({
        model,
        count: data.count,
        avgLatencyMs: data.latencyCount > 0 ? Math.round(data.totalLatency / data.latencyCount) : 0,
        avgTokens: data.tokenCount > 0 ? Math.round(data.totalTokens / data.tokenCount) : 0,
        totalCredits: data.totalCredits,
      })).sort((a, b) => b.count - a.count);
    }),
});
