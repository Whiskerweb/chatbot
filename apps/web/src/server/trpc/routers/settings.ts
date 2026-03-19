import { z } from "zod";
import { router, protectedProcedure } from "../init";
import { prisma } from "@chatbot/db";
import { TRPCError } from "@trpc/server";

export const settingsRouter = router({
  getOrg: protectedProcedure.query(async ({ ctx }) => {
    return prisma.organization.findUniqueOrThrow({
      where: { id: ctx.orgId },
      select: {
        id: true,
        name: true,
        slug: true,
        plan: true,
        creditsTotal: true,
        creditsUsed: true,
        creditsResetAt: true,
        createdAt: true,
      },
    });
  }),

  updateOrg: protectedProcedure
    .input(z.object({ name: z.string().min(1).optional(), slug: z.string().min(1).optional() }))
    .mutation(async ({ ctx, input }) => {
      // Only OWNER or ADMIN can update
      if (!["OWNER", "ADMIN"].includes(ctx.member.role)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return prisma.organization.update({
        where: { id: ctx.orgId },
        data: input,
      });
    }),

  getMembers: protectedProcedure.query(async ({ ctx }) => {
    return prisma.member.findMany({
      where: { orgId: ctx.orgId },
      orderBy: { createdAt: "asc" },
    });
  }),

  updateMember: protectedProcedure
    .input(z.object({
      memberId: z.string(),
      role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!["OWNER", "ADMIN"].includes(ctx.member.role)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return prisma.member.update({
        where: { id: input.memberId },
        data: { role: input.role },
      });
    }),

  removeMember: protectedProcedure
    .input(z.object({ memberId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.member.role !== "OWNER") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      // Can't remove yourself
      if (input.memberId === ctx.member.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot remove yourself" });
      }
      await prisma.member.delete({ where: { id: input.memberId } });
      return { success: true };
    }),
});
