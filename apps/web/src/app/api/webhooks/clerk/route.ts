import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@chatbot/db";

// This webhook can be triggered by Supabase Auth hooks
// or called manually after user signup to create the org + member
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, user } = body;

    switch (type) {
      case "user.created": {
        // Create default organization for new user
        const slug = (user.email?.split("@")[0] ?? "org") + "-" + Date.now();
        const org = await prisma.organization.create({
          data: {
            name: user.user_metadata?.name ?? user.email ?? "Mon Organisation",
            slug,
            creditsResetAt: new Date(),
          },
        });

        await prisma.member.create({
          data: {
            orgId: org.id,
            clerkUserId: user.id, // using Supabase user.id here
            email: user.email ?? "",
            name: user.user_metadata?.name ?? "",
            role: "OWNER",
          },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Auth webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
