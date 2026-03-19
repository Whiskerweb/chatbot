import { NextRequest } from "next/server";
import { prisma } from "@chatbot/db";
import { chatRequestSchema } from "@chatbot/shared";
import { getMessageCredits } from "@chatbot/shared";

export async function POST(req: NextRequest) {
  try {
    const agentId = req.headers.get("x-agent-id");
    if (!agentId) {
      return new Response(
        JSON.stringify({ error: "Missing x-agent-id header" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid request", details: parsed.error.flatten() }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { message, conversationId, visitorId, metadata } = parsed.data;

    // Get agent and org
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      include: { org: true },
    });

    if (!agent || !agent.isActive) {
      return new Response(
        JSON.stringify({ error: "Agent not found or inactive" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check credits
    const creditsNeeded = getMessageCredits(agent.model);
    if (agent.org.creditsUsed + creditsNeeded > agent.org.creditsTotal) {
      return new Response(
        JSON.stringify({ error: "CREDITS_EXHAUSTED", message: "Revenez bientôt, le chatbot est temporairement indisponible." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          agentId,
          visitorId,
          visitorMeta: metadata ?? undefined,
          channel: "WIDGET",
        },
      });
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "USER",
        content: message,
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { messageCount: { increment: 1 } },
    });

    // Get conversation history
    const history = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const conversationHistory = history.reverse().map((m) => ({
      role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
      content: m.content,
    }));

    // For now, return a simple SSE stream with a placeholder response
    // In production, this will call the RAG pipeline
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const responseText = agent.fallbackMessage;

        // Simulate streaming
        const words = responseText.split(" ");
        for (const word of words) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ token: word + " " })}\n\n`)
          );
          await new Promise((r) => setTimeout(r, 50));
        }

        // Save assistant message
        const assistantMessage = await prisma.message.create({
          data: {
            conversationId: conversation!.id,
            role: "ASSISTANT",
            content: responseText,
            model: agent.model,
            creditsUsed: creditsNeeded,
          },
        });

        // Deduct credits
        await prisma.organization.update({
          where: { id: agent.orgId },
          data: { creditsUsed: { increment: creditsNeeded } },
        });

        await prisma.creditLog.create({
          data: {
            orgId: agent.orgId,
            agentId: agent.id,
            action: "MESSAGE_AI",
            credits: creditsNeeded,
            metadata: { model: agent.model, messageId: assistantMessage.id },
          },
        });

        await prisma.conversation.update({
          where: { id: conversation!.id },
          data: {
            messageCount: { increment: 1 },
            creditsUsed: { increment: creditsNeeded },
          },
        });

        // Send done event
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              done: true,
              conversationId: conversation!.id,
              messageId: assistantMessage.id,
              creditsUsed: creditsNeeded,
            })}\n\n`
          )
        );
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-agent-id",
    },
  });
}
