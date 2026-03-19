import type { Context } from "./init";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@chatbot/db";

export async function createContext(opts: { headers: Headers }): Promise<Context> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { userId: null, orgId: null };
  }

  // Find the member's org
  const member = await prisma.member.findFirst({
    where: { clerkUserId: user.id },
    select: { orgId: true },
  });

  return {
    userId: user.id,
    orgId: member?.orgId ?? null,
  };
}
