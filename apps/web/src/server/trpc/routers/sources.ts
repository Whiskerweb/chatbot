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

  getPages: protectedProcedure
    .input(z.object({ sourceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const source = await prisma.source.findFirst({
        where: { id: input.sourceId, agent: { orgId: ctx.orgId } },
      });
      if (!source) throw new TRPCError({ code: "NOT_FOUND" });

      const chunks = await prisma.chunk.findMany({
        where: { sourceId: input.sourceId },
        select: { metadata: true, tokenCount: true },
      });

      // Group by pageUrl
      const pageMap = new Map<string, { pageUrl: string; pageTitle: string; chunksCount: number; totalTokens: number }>();

      for (const chunk of chunks) {
        const meta = chunk.metadata as Record<string, string> | null;
        const pageUrl = meta?.pageUrl ?? "unknown";
        const pageTitle = meta?.pageTitle ?? meta?.headingPath ?? pageUrl;

        const existing = pageMap.get(pageUrl);
        if (existing) {
          existing.chunksCount++;
          existing.totalTokens += chunk.tokenCount;
        } else {
          pageMap.set(pageUrl, {
            pageUrl,
            pageTitle,
            chunksCount: 1,
            totalTokens: chunk.tokenCount,
          });
        }
      }

      return Array.from(pageMap.values()).sort((a, b) => b.chunksCount - a.chunksCount);
    }),

  deletePage: protectedProcedure
    .input(z.object({ sourceId: z.string(), pageUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const source = await prisma.source.findFirst({
        where: { id: input.sourceId, agent: { orgId: ctx.orgId } },
      });
      if (!source) throw new TRPCError({ code: "NOT_FOUND" });

      // Find chunks for this page
      const chunks = await prisma.chunk.findMany({
        where: { sourceId: input.sourceId },
        select: { id: true, pineconeId: true, metadata: true },
      });

      const chunksToDelete = chunks.filter((c) => {
        const meta = c.metadata as Record<string, string> | null;
        return meta?.pageUrl === input.pageUrl;
      });

      if (chunksToDelete.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No chunks found for this page" });
      }

      // Delete from Pinecone
      if (process.env.PINECONE_API_KEY) {
        try {
          const { retriever } = await import("@chatbot/ai");
          // Use retriever which already has Pinecone configured
          for (const chunk of chunksToDelete) {
            try {
              await retriever.deleteBySource(source.agentId, chunk.pineconeId);
            } catch {}
          }
        } catch (err) {
          console.warn("Pinecone page delete failed:", err);
        }
      }

      // Delete from DB
      await prisma.chunk.deleteMany({
        where: { id: { in: chunksToDelete.map((c) => c.id) } },
      });

      // Update source counts
      const remainingChunks = await prisma.chunk.count({ where: { sourceId: input.sourceId } });
      const remainingPages = await prisma.chunk.findMany({
        where: { sourceId: input.sourceId },
        select: { metadata: true },
        distinct: ["metadata"],
      });

      const uniquePages = new Set(
        remainingPages.map((c) => (c.metadata as Record<string, string> | null)?.pageUrl ?? "unknown")
      );

      await prisma.source.update({
        where: { id: input.sourceId },
        data: {
          chunksCount: remainingChunks,
          pagesCount: uniquePages.size,
        },
      });

      return { success: true, deletedChunks: chunksToDelete.length };
    }),
});
