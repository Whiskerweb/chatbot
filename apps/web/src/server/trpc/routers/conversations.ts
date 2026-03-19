import { z } from "zod";
import { router, protectedProcedure } from "../init";
import { prisma } from "@chatbot/db";
import { paginationSchema } from "@chatbot/shared";
import { TRPCError } from "@trpc/server";

export const conversationsRouter = router({
  list: protectedProcedure
    .input(z.object({
      agentId: z.string().optional(),
      status: z.enum(["ACTIVE", "CLOSED", "ESCALATED"]).optional(),
      channel: z.enum(["WIDGET", "API", "SLACK", "WHATSAPP", "TELEGRAM", "DISCORD"]).optional(),
    }).merge(paginationSchema))
    .query(async ({ ctx, input }) => {
      const { page, limit, ...filters } = input;
      const where: any = {
        agent: { orgId: ctx.orgId },
      };
      if (filters.agentId) where.agentId = filters.agentId;
      if (filters.status) where.status = filters.status;
      if (filters.channel) where.channel = filters.channel;

      const [items, total] = await Promise.all([
        prisma.conversation.findMany({
          where,
          include: {
            agent: { select: { name: true, primaryColor: true } },
            messages: { orderBy: { createdAt: "desc" }, take: 1 },
          },
          orderBy: { updatedAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.conversation.count({ where }),
      ]);

      return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const conversation = await prisma.conversation.findFirst({
        where: { id: input.id, agent: { orgId: ctx.orgId } },
        include: {
          agent: { select: { name: true, primaryColor: true } },
          messages: { orderBy: { createdAt: "asc" } },
        },
      });
      if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });
      return conversation;
    }),

  close: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const conversation = await prisma.conversation.findFirst({
        where: { id: input.id, agent: { orgId: ctx.orgId } },
      });
      if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });

      return prisma.conversation.update({
        where: { id: input.id },
        data: { status: "CLOSED", resolved: true },
      });
    }),

  reply: protectedProcedure
    .input(z.object({ conversationId: z.string(), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const conversation = await prisma.conversation.findFirst({
        where: { id: input.conversationId, agent: { orgId: ctx.orgId } },
      });
      if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });

      const message = await prisma.message.create({
        data: {
          conversationId: input.conversationId,
          role: "HUMAN",
          content: input.content,
          memberName: ctx.member.name,
        },
      });

      await prisma.conversation.update({
        where: { id: input.conversationId },
        data: { messageCount: { increment: 1 } },
      });

      return message;
    }),

  search: protectedProcedure
    .input(z.object({ query: z.string().min(1) }).merge(paginationSchema))
    .query(async ({ ctx, input }) => {
      const { page, limit, query } = input;
      return prisma.conversation.findMany({
        where: {
          agent: { orgId: ctx.orgId },
          messages: { some: { content: { contains: query, mode: "insensitive" } } },
        },
        include: {
          agent: { select: { name: true } },
          messages: { orderBy: { createdAt: "desc" }, take: 1 },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      });
    }),
});
