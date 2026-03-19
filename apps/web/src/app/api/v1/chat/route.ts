import { NextRequest } from "next/server";
import { prisma } from "@chatbot/db";
import { chatRequestSchema, getMessageCredits } from "@chatbot/shared";

export async function POST(req: NextRequest) {
  try {
    const agentId = req.headers.get("x-agent-id");
    if (!agentId) {
      return Response.json({ error: "Missing x-agent-id header" }, { status: 400 });
    }

    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const { message, conversationId, visitorId, metadata } = parsed.data;

    // Get agent and org
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      include: { org: true },
    });

    if (!agent || !agent.isActive) {
      return Response.json({ error: "Agent not found or inactive" }, { status: 404 });
    }

    // Check credits
    const creditsNeeded = getMessageCredits(agent.model);
    if (agent.org.creditsUsed + creditsNeeded > agent.org.creditsTotal) {
      return Response.json(
        { error: "CREDITS_EXHAUSTED", message: "Revenez bientôt, le chatbot est temporairement indisponible." },
        { status: 429 }
      );
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
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
      data: { conversationId: conversation.id, role: "USER", content: message },
    });
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { messageCount: { increment: 1 } },
    });

    // Get conversation history for context
    const history = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Try to find relevant chunks from the agent's sources
    const chunks = await prisma.chunk.findMany({
      where: { source: { agentId } },
      take: 5,
      include: { source: { select: { name: true, url: true } } },
    });

    // Build response
    let responseText: string;
    let sourcesUsed: { title: string; url?: string }[] = [];

    if (chunks.length > 0) {
      // Simple keyword matching (works without LLM)
      const queryWords = message.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const scoredChunks = chunks.map(chunk => {
        const content = chunk.content.toLowerCase();
        const score = queryWords.reduce((s, word) => s + (content.includes(word) ? 1 : 0), 0);
        return { chunk, score };
      }).filter(c => c.score > 0).sort((a, b) => b.score - a.score);

      if (scoredChunks.length > 0) {
        const bestChunk = scoredChunks[0].chunk;
        // Take a relevant excerpt (first 500 chars)
        const excerpt = bestChunk.content.slice(0, 500);
        responseText = `D'après notre documentation :\n\n${excerpt}${bestChunk.content.length > 500 ? "..." : ""}\n\n[Source: ${bestChunk.source.name}]`;
        sourcesUsed = [{ title: bestChunk.source.name, url: bestChunk.source.url ?? undefined }];
      } else {
        responseText = agent.fallbackMessage;
      }
    } else if (agent.strictMode) {
      responseText = agent.fallbackMessage;
    } else {
      responseText = `Merci pour votre question. Je n'ai pas encore de documentation indexée pour y répondre. Veuillez contacter notre équipe pour plus d'informations.`;
    }

    // Try using real LLM if API key is available
    if (process.env.OPENAI_API_KEY && chunks.length > 0) {
      try {
        const { generator } = await import("@chatbot/ai");
        const result = await generator.generate({
          agentId,
          question: message,
          conversationHistory: history.reverse().map(m => ({
            role: m.role === "USER" ? "user" as const : "assistant" as const,
            content: m.content,
          })),
          model: agent.model,
          systemPrompt: agent.systemPrompt,
          strictMode: agent.strictMode,
          fallbackMessage: agent.fallbackMessage,
          agentName: agent.name,
          maxTokens: agent.maxTokensResponse,
          temperature: agent.temperature,
        });

        // Save and return the streaming response
        // For now, fall through to the simple response below
        // TODO: Wire up streaming properly when LLM keys are configured
      } catch (err) {
        // Fall back to simple response
        console.warn("LLM call failed, using simple response:", err);
      }
    }

    const startTime = Date.now();

    // Stream the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Stream word by word for a natural feel
        const words = responseText.split(" ");
        for (const word of words) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: word + " " })}\n\n`));
          await new Promise(r => setTimeout(r, 30));
        }

        // Send sources
        if (sourcesUsed.length > 0) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ sources: sourcesUsed })}\n\n`));
        }

        const latencyMs = Date.now() - startTime;

        // Save assistant message
        const assistantMessage = await prisma.message.create({
          data: {
            conversationId: conversation!.id,
            role: "ASSISTANT",
            content: responseText,
            model: agent.model,
            creditsUsed: creditsNeeded,
            latencyMs,
            sources: sourcesUsed.length > 0 ? sourcesUsed : undefined,
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
          data: { messageCount: { increment: 1 }, creditsUsed: { increment: creditsNeeded } },
        });

        // Send done
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          done: true,
          conversationId: conversation!.id,
          messageId: assistantMessage.id,
          creditsUsed: creditsNeeded,
        })}\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
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
