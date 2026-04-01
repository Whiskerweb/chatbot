import { z } from "zod";
import { router, protectedProcedure } from "../init";
import { prisma } from "@chatbot/db";
import { addProductSchema, updateProductSchema } from "@chatbot/shared";
import { TRPCError } from "@trpc/server";

export const productsRouter = router({
  list: protectedProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const agent = await prisma.agent.findFirst({
        where: { id: input.agentId, orgId: ctx.orgId },
      });
      if (!agent) throw new TRPCError({ code: "NOT_FOUND" });

      const products = await prisma.product.findMany({
        where: { agentId: input.agentId },
        orderBy: { createdAt: "desc" },
      });

      // Attach analytics counts
      const productIds = products.map((p) => p.id);
      const events = await prisma.productEvent.groupBy({
        by: ["productId", "eventType"],
        where: { productId: { in: productIds } },
        _count: true,
      });

      const analyticsMap = new Map<string, { impressions: number; clicks: number }>();
      for (const e of events) {
        const entry = analyticsMap.get(e.productId) ?? { impressions: 0, clicks: 0 };
        if (e.eventType === "impression") entry.impressions = e._count;
        if (e.eventType === "click") entry.clicks = e._count;
        analyticsMap.set(e.productId, entry);
      }

      return products.map((p) => ({
        ...p,
        analytics: analyticsMap.get(p.id) ?? { impressions: 0, clicks: 0 },
      }));
    }),

  create: protectedProcedure
    .input(addProductSchema)
    .mutation(async ({ ctx, input }) => {
      const agent = await prisma.agent.findFirst({
        where: { id: input.agentId, orgId: ctx.orgId },
      });
      if (!agent) throw new TRPCError({ code: "NOT_FOUND" });

      return prisma.product.create({
        data: {
          agentId: input.agentId,
          name: input.name,
          description: input.description,
          url: input.url,
          imageUrl: input.imageUrl || null,
          price: input.price || null,
          ctaText: input.ctaText,
          keywords: input.keywords,
          displayMode: input.displayMode as any,
        },
      });
    }),

  update: protectedProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      const product = await prisma.product.findUnique({
        where: { id: input.id },
        include: { agent: { select: { orgId: true } } },
      });
      if (!product || product.agent.orgId !== ctx.orgId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const { id, ...data } = input;
      return prisma.product.update({
        where: { id },
        data: {
          ...data,
          imageUrl: data.imageUrl || null,
          displayMode: data.displayMode as any,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const product = await prisma.product.findUnique({
        where: { id: input.id },
        include: { agent: { select: { orgId: true } } },
      });
      if (!product || product.agent.orgId !== ctx.orgId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await prisma.product.delete({ where: { id: input.id } });
      return { success: true };
    }),

  toggleActive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const product = await prisma.product.findUnique({
        where: { id: input.id },
        include: { agent: { select: { orgId: true } } },
      });
      if (!product || product.agent.orgId !== ctx.orgId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return prisma.product.update({
        where: { id: input.id },
        data: { isActive: !product.isActive },
      });
    }),

  generateKeywords: protectedProcedure
    .input(z.object({ description: z.string().min(1).max(1000) }))
    .mutation(async ({ input }) => {
      try {
        const { llmGateway } = await import("@chatbot/ai");

        const stream = await llmGateway.streamChat({
          model: "GPT4O_MINI",
          messages: [
            {
              role: "system",
              content: "Tu génères des mots-clés pour un produit. Retourne UNIQUEMENT un JSON array de strings, rien d'autre. Exemple: [\"mot1\", \"mot2\"]",
            },
            {
              role: "user",
              content: `Génère 5-10 mots-clés pertinents pour ce produit:\n${input.description}`,
            },
          ],
          maxTokens: 200,
          temperature: 0.3,
        });

        // Collect full response
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          const lines = text.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.token) fullText += data.token;
              } catch {}
            }
          }
        }

        // Extract JSON array from response
        const match = fullText.match(/\[[\s\S]*?\]/);
        if (match) {
          const keywords = JSON.parse(match[0]) as string[];
          return keywords.filter((k) => typeof k === "string" && k.length > 0).slice(0, 10);
        }

        return [];
      } catch (err) {
        console.error("Failed to generate keywords:", err);
        return [];
      }
    }),
});
