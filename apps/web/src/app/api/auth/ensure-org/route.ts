import { createClient } from "@/lib/supabase/server";
import { prisma } from "@chatbot/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const TRAAACTION_PUBLIC_KEY =
  process.env.TRAAACTION_PUBLIC_KEY ?? "pk_OIe8Q70sI3QqNYAMa4Xun2um";
const TRAAACTION_TRACK_URL =
  process.env.TRAAACTION_TRACK_URL ?? "https://track.helloclaudia.fr";

async function trackTraaactionLead(user: { id: string; email: string }) {
  try {
    const clickId = (await cookies()).get("trac_click_id")?.value;
    await fetch(`${TRAAACTION_TRACK_URL}/api/v1/track/lead`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TRAAACTION_PUBLIC_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerExternalId: user.id,
        customerEmail: user.email,
        clickId,
        eventName: "sign_up",
      }),
    });
  } catch (e) {
    console.error("[Traaaction] lead track failed:", e);
  }
}

export async function POST() {
  try {
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

    trackTraaactionLead({ id: user.id, email: user.email ?? "" });

    return NextResponse.json({ orgId: org.id });
  } catch (error) {
    console.error("[ensure-org] Error:", error);
    return NextResponse.json(
      { error: "Failed to ensure organization" },
      { status: 500 }
    );
  }
}
