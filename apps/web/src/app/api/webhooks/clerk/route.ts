import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@chatbot/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.type;

    switch (eventType) {
      case "organization.created": {
        const org = body.data;
        await prisma.organization.create({
          data: {
            name: org.name,
            slug: org.slug,
            clerkOrgId: org.id,
            creditsResetAt: new Date(new Date().setDate(1)), // 1st of next month
          },
        });
        break;
      }

      case "organization.updated": {
        const org = body.data;
        await prisma.organization.updateMany({
          where: { clerkOrgId: org.id },
          data: { name: org.name, slug: org.slug },
        });
        break;
      }

      case "organizationMembership.created": {
        const membership = body.data;
        const org = await prisma.organization.findFirst({
          where: { clerkOrgId: membership.organization.id },
        });
        if (org) {
          await prisma.member.create({
            data: {
              orgId: org.id,
              clerkUserId: membership.public_user_data.user_id,
              email: membership.public_user_data.identifier ?? "",
              name: `${membership.public_user_data.first_name ?? ""} ${membership.public_user_data.last_name ?? ""}`.trim(),
              role: membership.role === "org:admin" ? "ADMIN" : "MEMBER",
            },
          });
        }
        break;
      }

      case "organizationMembership.deleted": {
        const membership = body.data;
        const org = await prisma.organization.findFirst({
          where: { clerkOrgId: membership.organization.id },
        });
        if (org) {
          await prisma.member.deleteMany({
            where: {
              orgId: org.id,
              clerkUserId: membership.public_user_data.user_id,
            },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
