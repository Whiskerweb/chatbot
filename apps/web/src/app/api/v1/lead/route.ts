import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@chatbot/db";
import { leadSchema } from "@chatbot/shared";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { agentId, conversationId, email, name, phone, customFields } = parsed.data;

    const agent = await prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const lead = await prisma.lead.create({
      data: {
        agentId,
        conversationId,
        email,
        name,
        phone,
        customFields: customFields ?? undefined,
      },
    });

    // Update conversation with visitor email if provided
    if (conversationId) {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { visitorEmail: email, visitorName: name },
      });
    }

    return NextResponse.json(
      { success: true, leadId: lead.id },
      {
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
