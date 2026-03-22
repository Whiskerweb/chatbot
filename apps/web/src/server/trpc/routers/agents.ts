import { z } from "zod";
import crypto from "crypto";
import { router, protectedProcedure } from "../init";
import { prisma } from "@chatbot/db";
import { createAgentSchema, updateAgentSchema } from "@chatbot/shared";
import { TRPCError } from "@trpc/server";
import { getPlanConfig } from "@chatbot/shared";

export const agentsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return prisma.agent.findMany({
      where: { orgId: ctx.orgId },
      include: {
        _count: { select: { sources: true, conversations: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const agent = await prisma.agent.findFirst({
        where: { id: input.id, orgId: ctx.orgId },
        include: {
          _count: { select: { sources: true, conversations: true, leads: true } },
        },
      });
      if (!agent) throw new TRPCError({ code: "NOT_FOUND" });
      return agent;
    }),

  create: protectedProcedure
    .input(createAgentSchema)
    .mutation(async ({ ctx, input }) => {
      // Check plan limit
      const org = await prisma.organization.findUniqueOrThrow({ where: { id: ctx.orgId } });
      const plan = getPlanConfig(org.plan);
      const agentCount = await prisma.agent.count({ where: { orgId: ctx.orgId } });

      if (agentCount >= plan.maxAgents) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Votre plan ${plan.name} est limité à ${plan.maxAgents} agent(s). Passez au plan supérieur.`,
        });
      }

      const slug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      return prisma.agent.create({
        data: {
          orgId: ctx.orgId,
          name: input.name,
          slug,
          description: input.description,
          model: input.model as any,
          temperature: input.temperature,
          apiKey: crypto.randomBytes(24).toString("hex"),
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string() }).merge(updateAgentSchema))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const agent = await prisma.agent.findFirst({
        where: { id, orgId: ctx.orgId },
      });
      if (!agent) throw new TRPCError({ code: "NOT_FOUND" });

      return prisma.agent.update({
        where: { id },
        data: data as any,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const agent = await prisma.agent.findFirst({
        where: { id: input.id, orgId: ctx.orgId },
      });
      if (!agent) throw new TRPCError({ code: "NOT_FOUND" });

      // Delete agent (cascade will handle sources, chunks, conversations, etc.)
      await prisma.agent.delete({ where: { id: input.id } });
      return { success: true };
    }),

  duplicate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const agent = await prisma.agent.findFirst({
        where: { id: input.id, orgId: ctx.orgId },
      });
      if (!agent) throw new TRPCError({ code: "NOT_FOUND" });

      return prisma.agent.create({
        data: {
          orgId: agent.orgId,
          name: `${agent.name} (copie)`,
          slug: `${agent.slug}-copy-${Date.now()}`,
          description: agent.description,
          model: agent.model,
          temperature: agent.temperature,
          systemPrompt: agent.systemPrompt,
          strictMode: agent.strictMode,
          fallbackMessage: agent.fallbackMessage,
          maxTokensResponse: agent.maxTokensResponse,
          primaryColor: agent.primaryColor,
          avatarUrl: agent.avatarUrl,
          welcomeMessage: agent.welcomeMessage,
          suggestedQuestions: agent.suggestedQuestions,
          position: agent.position,
          leadCaptureEnabled: agent.leadCaptureEnabled,
          escalationEnabled: agent.escalationEnabled,
          escalationAfter: agent.escalationAfter,
          escalationEmail: agent.escalationEmail,
          escalationSlackUrl: agent.escalationSlackUrl,
          widgetConfig: agent.widgetConfig ?? undefined,
        },
      });
    }),

  regenerateApiKey: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const agent = await prisma.agent.findFirst({
        where: { id: input.id, orgId: ctx.orgId },
      });
      if (!agent) throw new TRPCError({ code: "NOT_FOUND" });

      return prisma.agent.update({
        where: { id: input.id },
        data: { apiKey: crypto.randomBytes(24).toString("hex") },
      });
    }),

  getStats: protectedProcedure
    .input(z.object({ id: z.string(), period: z.enum(["7d", "30d", "90d"]).optional().default("30d") }))
    .query(async ({ ctx, input }) => {
      const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
      const days = daysMap[input.period];
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const [conversations, messages, credits] = await Promise.all([
        prisma.conversation.count({ where: { agentId: input.id, createdAt: { gte: since } } }),
        prisma.message.count({ where: { conversation: { agentId: input.id }, createdAt: { gte: since } } }),
        prisma.creditLog.aggregate({
          where: { agentId: input.id, createdAt: { gte: since } },
          _sum: { credits: true },
        }),
      ]);

      return {
        conversations,
        messages,
        creditsUsed: credits._sum.credits ?? 0,
      };
    }),
});
