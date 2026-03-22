import { NextRequest } from "next/server";
import { prisma } from "@chatbot/db";
import { chatRequestSchema, getMessageCredits } from "@chatbot/shared";
import { rateLimit } from "@/lib/rate-limit";
import { triggerEscalation } from "@/lib/escalation";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting per IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const ipLimit = rateLimit(`ip:${ip}`, 30, 60_000);
    if (!ipLimit.success) {
      return Response.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const agentId = req.headers.get("x-agent-id");
    if (!agentId) {
      return Response.json({ error: "Missing x-agent-id header" }, { status: 400 });
    }

    // Rate limiting per agent
    const agentLimit = rateLimit(`agent:${agentId}`, 200, 60_000);
    if (!agentLimit.success) {
      return Response.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const { message, conversationId, visitorId, metadata } = parsed.data;

    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      include: { org: true },
    });

    if (!agent || !agent.isActive) {
      return Response.json({ error: "Agent not found or inactive" }, { status: 404 });
    }

    // Validate API key if agent has one
    const apiKey = req.headers.get("x-api-key");
    if (agent.apiKey && apiKey !== agent.apiKey) {
      return Response.json({ error: "Invalid API key" }, { status: 401 });
    }

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
      if (conversation && conversation.visitorId !== visitorId) {
        return Response.json({ error: "Session mismatch" }, { status: 403 });
      }
    }
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { agentId, visitorId, visitorMeta: metadata ?? undefined, channel: "WIDGET" },
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

    // Get conversation history
    const historyMsgs = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    const conversationHistory = historyMsgs.reverse().map((m) => ({
      role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
      content: m.content,
    }));

    // ── RAG Pipeline ──
    let contextChunks: { content: string; sourceName: string; sourceUrl?: string; score: number }[] = [];
    let usePinecone = !!process.env.PINECONE_API_KEY && !!process.env.OPENAI_API_KEY;

    if (usePinecone) {
      try {
        const { retriever } = await import("@chatbot/ai");
        const searchResults = await retriever.search(agentId, message, 10);

        if (searchResults.length > 0) {
          const chunkIds = searchResults.map((r) => r.chunkId);
          const dbChunks = await prisma.chunk.findMany({
            where: { pineconeId: { in: chunkIds } },
            include: { source: { select: { name: true, url: true } } },
          });
          const chunkMap = new Map(dbChunks.map((c) => [c.pineconeId, c]));

          contextChunks = searchResults
            .map((r) => {
              const dbChunk = chunkMap.get(r.chunkId);
              if (!dbChunk) return null;
              return {
                content: dbChunk.content,
                sourceName: dbChunk.source.name,
                sourceUrl: dbChunk.source.url ?? undefined,
                score: r.score,
              };
            })
            .filter(Boolean)
            .slice(0, 5) as typeof contextChunks;
        }
      } catch (err) {
        console.warn("Pinecone search failed, falling back to DB search:", err);
        usePinecone = false;
      }
    }

    // Fallback: DB keyword search if no Pinecone results
    if (contextChunks.length === 0) {
      const allChunks = await prisma.chunk.findMany({
        where: { source: { agentId } },
        include: { source: { select: { name: true, url: true } } },
        take: 50,
      });

      const queryWords = message.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
      contextChunks = allChunks
        .map((chunk) => {
          const content = chunk.content.toLowerCase();
          const score = queryWords.reduce((s, word) => s + (content.includes(word) ? 1 : 0), 0);
          return { content: chunk.content, sourceName: chunk.source.name, sourceUrl: chunk.source.url ?? undefined, score };
        })
        .filter((c) => c.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    }

    // Strict mode check
    if (agent.strictMode && contextChunks.length === 0) {
      return streamSimpleResponse(agent.fallbackMessage, [], conversation.id, agent, creditsNeeded, message);
    }

    if (agent.strictMode && contextChunks.length > 0 && contextChunks[0].score < 0.3 && usePinecone) {
      return streamSimpleResponse(agent.fallbackMessage, [], conversation.id, agent, creditsNeeded, message);
    }

    // ── LLM Generation ──
    const sources = contextChunks.map((c) => ({ title: c.sourceName, url: c.sourceUrl }));

    console.log(`[Chat] Agent: ${agent.name}, Model: ${agent.model}, StrictMode: ${agent.strictMode}, Chunks found: ${contextChunks.length}, OpenAI key: ${!!process.env.OPENAI_API_KEY}`);

    if (process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY) {
      try {
        const { buildSystemPrompt } = await import("@chatbot/ai");
        const { llmGateway } = await import("@chatbot/ai");

        const contextDocs = contextChunks
          .map((c) => `[Source: ${c.sourceName}${c.sourceUrl ? ` - ${c.sourceUrl}` : ""}]\n${c.content}`)
          .join("\n\n---\n\n");

        const systemMessage = buildSystemPrompt({
          agentName: agent.name,
          fallbackMessage: agent.fallbackMessage,
          customPrompt: agent.systemPrompt || undefined,
          contextDocs: contextDocs || "Aucun document disponible.",
          strictMode: agent.strictMode,
        });

        const messages = [
          { role: "system" as const, content: systemMessage },
          ...conversationHistory.slice(-5),
          { role: "user" as const, content: message },
        ];

        const llmStream = await llmGateway.streamChat({
          model: agent.model,
          messages,
          maxTokens: agent.maxTokensResponse,
          temperature: agent.temperature,
        });

        const startTime = Date.now();

        // Create a pass-through that collects the full response
        let fullResponse = "";
        const encoder = new TextEncoder();

        const responseStream = new ReadableStream({
          async start(controller) {
            const reader = llmStream.getReader();
            const decoder = new TextDecoder();

            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Pass through the SSE data
                const text = decoder.decode(value, { stream: true });
                controller.enqueue(value);

                // Extract tokens for saving
                const lines = text.split("\n");
                for (const line of lines) {
                  if (line.startsWith("data: ")) {
                    try {
                      const data = JSON.parse(line.slice(6));
                      if (data.token) fullResponse += data.token;
                    } catch {}
                  }
                }
              }

              // Send sources
              if (sources.length > 0) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ sources })}\n\n`));
              }

              const latencyMs = Date.now() - startTime;

              // Save assistant message
              const assistantMsg = await prisma.message.create({
                data: {
                  conversationId: conversation!.id,
                  role: "ASSISTANT",
                  content: fullResponse,
                  model: agent.model,
                  creditsUsed: creditsNeeded,
                  latencyMs,
                  sources: sources.length > 0 ? sources : undefined,
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
                  metadata: { model: agent.model, messageId: assistantMsg.id },
                },
              });
              const updatedConv = await prisma.conversation.update({
                where: { id: conversation!.id },
                data: { messageCount: { increment: 1 }, creditsUsed: { increment: creditsNeeded } },
              });

              // Check escalation threshold
              if (
                agent.escalationEnabled &&
                agent.escalationAfter &&
                updatedConv.messageCount >= agent.escalationAfter &&
                updatedConv.status !== "ESCALATED"
              ) {
                await prisma.conversation.update({
                  where: { id: conversation!.id },
                  data: { status: "ESCALATED" },
                });
                triggerEscalation({
                  agent: {
                    id: agent.id,
                    name: agent.name,
                    escalationEmail: agent.escalationEmail,
                    escalationSlackUrl: agent.escalationSlackUrl,
                  },
                  conversation: {
                    id: conversation!.id,
                    visitorName: updatedConv.visitorName,
                    visitorEmail: updatedConv.visitorEmail,
                    messageCount: updatedConv.messageCount,
                  },
                  lastMessage: message,
                }).catch(console.error);
              }

              // Send done event
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                done: true,
                conversationId: conversation!.id,
                messageId: assistantMsg.id,
                creditsUsed: creditsNeeded,
              })}\n\n`));
              controller.close();
            } catch (err) {
              console.error("Stream error:", err);
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`));
              controller.close();
            }
          },
        });

        return new Response(responseStream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (err) {
        console.error("LLM call failed, falling back to simple response. Error:", err instanceof Error ? err.message : err, "\nModel:", agent.model, "\nAPI Key set:", !!process.env.OPENAI_API_KEY);
      }
    }

    // ── Fallback: simple response without LLM ──
    let responseText: string;
    if (contextChunks.length > 0) {
      const best = contextChunks[0];
      const excerpt = best.content.slice(0, 500);
      responseText = `D'après notre documentation :\n\n${excerpt}${best.content.length > 500 ? "..." : ""}\n\n[Source: ${best.sourceName}]`;
    } else {
      responseText = agent.fallbackMessage;
    }

    return streamSimpleResponse(responseText, sources, conversation.id, agent, creditsNeeded, message);
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function streamSimpleResponse(
  text: string,
  sources: { title: string; url?: string }[],
  conversationId: string,
  agent: any,
  creditsNeeded: number,
  userMessage?: string
) {
  const startTime = Date.now();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const words = text.split(" ");
      for (const word of words) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: word + " " })}\n\n`));
        await new Promise((r) => setTimeout(r, 30));
      }

      if (sources.length > 0) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ sources })}\n\n`));
      }

      const latencyMs = Date.now() - startTime;

      const assistantMsg = await prisma.message.create({
        data: {
          conversationId,
          role: "ASSISTANT",
          content: text,
          model: agent.model,
          creditsUsed: creditsNeeded,
          latencyMs,
          sources: sources.length > 0 ? sources : undefined,
        },
      });

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
          metadata: { model: agent.model, messageId: assistantMsg.id },
        },
      });
      const updatedConv = await prisma.conversation.update({
        where: { id: conversationId },
        data: { messageCount: { increment: 1 }, creditsUsed: { increment: creditsNeeded } },
      });

      // Check escalation threshold
      if (
        agent.escalationEnabled &&
        agent.escalationAfter &&
        updatedConv.messageCount >= agent.escalationAfter &&
        updatedConv.status !== "ESCALATED" &&
        userMessage
      ) {
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { status: "ESCALATED" },
        });
        triggerEscalation({
          agent: {
            id: agent.id,
            name: agent.name,
            escalationEmail: agent.escalationEmail,
            escalationSlackUrl: agent.escalationSlackUrl,
          },
          conversation: {
            id: conversationId,
            visitorName: updatedConv.visitorName,
            visitorEmail: updatedConv.visitorEmail,
            messageCount: updatedConv.messageCount,
          },
          lastMessage: userMessage,
        }).catch(console.error);
      }

      controller.enqueue(encoder.encode(`data: ${JSON.stringify({
        done: true, conversationId, messageId: assistantMsg.id, creditsUsed: creditsNeeded,
      })}\n\n`));
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
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-agent-id, x-api-key",
    },
  });
}
