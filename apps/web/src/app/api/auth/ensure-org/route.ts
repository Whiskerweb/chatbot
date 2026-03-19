import { createClient } from "@/lib/supabase/server";
import { prisma } from "@chatbot/db";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user already has a member record
  const existingMember = await prisma.member.findFirst({
    where: { clerkUserId: user.id },
  });

  if (existingMember) {
    return NextResponse.json({ orgId: existingMember.orgId });
  }

  // Create org + member
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

  return NextResponse.json({ orgId: org.id });
}
