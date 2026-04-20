import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { prisma } from "@chatbot/db";

export const dynamic = "force-dynamic";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL?.replace(/\/$/, "");

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  const appBase = APP_URL || origin;
  const authBase = AUTH_URL || origin;

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await ensureOrgExists(user);
      }
      return NextResponse.redirect(`${appBase}${next}`);
    }
  }

  return NextResponse.redirect(`${authBase}/sign-in?error=auth_failed`);
}

async function ensureOrgExists(user: { id: string; email?: string; user_metadata?: Record<string, any> }) {
  const existingMember = await prisma.member.findFirst({
    where: { clerkUserId: user.id },
  });

  if (existingMember) return;

  const name = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Mon Organisation";
  const slug = (user.email?.split("@")[0] ?? "org").replace(/[^a-z0-9]/g, "-") + "-" + Date.now().toString(36);

  const org = await prisma.organization.create({
    data: {
      name: `${name}'s Workspace`,
      slug,
      creditsResetAt: new Date(),
    },
  });

  await prisma.member.create({
    data: {
      orgId: org.id,
      clerkUserId: user.id,
      email: user.email ?? "",
      name: name,
      role: "OWNER",
    },
  });
}
