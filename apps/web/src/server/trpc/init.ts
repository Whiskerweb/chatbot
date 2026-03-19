import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { prisma } from "@chatbot/db";

export interface Context {
  userId: string | null;
  orgId: string | null;
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId || !ctx.orgId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // Verify org membership
  const member = await prisma.member.findFirst({
    where: { orgId: ctx.orgId, clerkUserId: ctx.userId },
  });

  if (!member) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not a member of this organization" });
  }

  return next({
    ctx: {
      userId: ctx.userId,
      orgId: ctx.orgId,
      member,
    },
  });
});
