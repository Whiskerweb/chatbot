import { z } from "zod";
import { router, protectedProcedure } from "../init";
import { prisma } from "@chatbot/db";
import { addWebsiteSchema, addRawTextSchema } from "@chatbot/shared";
import { TRPCError } from "@trpc/server";
import { indexWebsite, indexRawText, reindexSource, deleteSourceData } from "@/lib/indexing";

export const sourcesRouter = router({
  list: protectedProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify agent belongs to org
      const agent = await prisma.agent.findFirst({
        where: { id: input.agentId, orgId: ctx.orgId },
      });
      if (!agent) throw new TRPCError({ code: "NOT_FOUND" });

      return prisma.source.findMany({
        where: { agentId: input.agentId },
        orderBy: { createdAt: "desc" },
      });
    }),

  addWebsite: protectedProcedure
    .input(addWebsiteSchema)
    .mutation(async ({ ctx, input }) => {
      const agent = await prisma.agent.findFirst({
        where: { id: input.agentId, orgId: ctx.orgId },
      });
      if (!agent) throw new TRPCError({ code: "NOT_FOUND" });

      const source = await prisma.source.create({
        data: {
          agentId: input.agentId,
          type: "WEBSITE",
          name: new URL(input.url).hostname,
          url: input.url,
          status: "PENDING",
        },
      });

      // Fire-and-forget indexation
      indexWebsite(source.id, input.agentId, agent.orgId, input.url).catch(console.error);

      return source;
    }),

  addRawText: protectedProcedure
    .input(addRawTextSchema)
    .mutation(async ({ ctx, input }) => {
      const agent = await prisma.agent.findFirst({
        where: { id: input.agentId, orgId: ctx.orgId },
      });
      if (!agent) throw new TRPCError({ code: "NOT_FOUND" });

      const source = await prisma.source.create({
        data: {
          agentId: input.agentId,
          type: "TEXT_RAW",
          name: input.title,
          status: "PENDING",
        },
      });

      // Fire-and-forget indexation
      indexRawText(source.id, input.agentId, agent.orgId, input.title, input.content).catch(console.error);

      return source;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const source = await prisma.source.findFirst({
        where: { id: input.id, agent: { orgId: ctx.orgId } },
      });
      if (!source) throw new TRPCError({ code: "NOT_FOUND" });

      await deleteSourceData(input.id, source.agentId);
      await prisma.source.delete({ where: { id: input.id } });
      return { success: true };
    }),

  reindex: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const source = await prisma.source.findFirst({
        where: { id: input.id, agent: { orgId: ctx.orgId } },
      });
      if (!source) throw new TRPCError({ code: "NOT_FOUND" });

      // Fire-and-forget reindexation
      reindexSource(input.id, source.agentId, ctx.orgId).catch(console.error);
      return { success: true };
    }),

  getStatus: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const source = await prisma.source.findFirst({
        where: { id: input.id, agent: { orgId: ctx.orgId } },
        select: { status: true, pagesCount: true, chunksCount: true, indexError: true, lastIndexedAt: true },
      });
      if (!source) throw new TRPCError({ code: "NOT_FOUND" });
      return source;
    }),
});
