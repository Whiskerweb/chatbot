import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@chatbot/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const agent = await prisma.agent.findFirst({
      where: {
        OR: [
          { slug: params.slug },
          { id: params.slug },
        ],
        isActive: true,
      },
      select: {
        id: true,
        apiKey: true,
        name: true,
        primaryColor: true,
        avatarUrl: true,
        welcomeMessage: true,
        suggestedQuestions: true,
        position: true,
        leadCaptureEnabled: true,
        leadCaptureFields: true,
        escalationEnabled: true,
        widgetConfig: true,
      },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json(agent, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
