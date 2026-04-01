import { NextRequest } from "next/server";
import { prisma } from "@chatbot/db";
import { chatRequestSchema, getMessageCredits, calculateMessageCredits } from "@chatbot/shared";
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

    // Fetch active products for this agent
    const agentProducts = await prisma.product.findMany({
      where: { agentId, isActive: true },
    });

    // Validate API key if agent has one
    const apiKey = req.headers.get("x-api-key");
    if (agent.apiKey && apiKey !== agent.apiKey) {
      return Response.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Domain whitelist check
    if (agent.allowedDomains && agent.allowedDomains.length > 0) {
      const sourceUrl = req.headers.get("referer") || req.headers.get("origin");
      if (sourceUrl) {
        try {
          const sourceHost = new URL(sourceUrl).hostname;
          const allowed = agent.allowedDomains.some((d: string) => {
            const domain = d.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
            return sourceHost === domain || sourceHost.endsWith("." + domain);
          });
          if (!allowed) {
            return Response.json({ error: "Domain not allowed" }, { status: 403 });
          }
        } catch {}
      }
    }

    // Lazy credit reset: if creditsResetAt has passed, reset credits now
    if (agent.org.creditsResetAt && new Date() > agent.org.creditsResetAt && agent.org.plan !== "FREE") {
      const nextReset = new Date();
      nextReset.setMonth(nextReset.getMonth() + 1);
      await prisma.organization.update({
        where: { id: agent.orgId },
        data: { creditsUsed: 0, creditsResetAt: nextReset },
      });
      agent.org.creditsUsed = 0;
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
        const { retriever, classifyQuery, buildDrawerFilter } = await import("@chatbot/ai");

        // Enrich search query with recent conversation context for follow-up questions
        // "comment l'installer ?" alone won't match, but with "proxy" from earlier it will
        const lastUserMessages = conversationHistory.slice(-4)
          .filter((m) => m.role === "user")
          .map((m) => m.content);
        const searchQuery = lastUserMessages.length > 0
          ? message + " " + lastUserMessages.join(" ")
          : message;

        // Drawer system: classify the query and build a Pinecone filter
        const drawerResult = classifyQuery(searchQuery);
        const drawerFilter = buildDrawerFilter(drawerResult);
        let searchResults = await retriever.search(agentId, searchQuery, 10, drawerFilter);

        // Fallback: if drawer filter returned 0 results, search without filter
        if (searchResults.length === 0 && drawerFilter) {
          searchResults = await retriever.search(agentId, searchQuery, 10);
        }

        if (searchResults.length > 0) {
          const chunkIds = searchResults.map((r) => r.chunkId);
          const dbChunks = await prisma.chunk.findMany({
            where: { pineconeId: { in: chunkIds } },
            include: { source: { select: { name: true, url: true } } },
          });
          const chunkMap = new Map(dbChunks.map((c) => [c.pineconeId, c]));

          const MIN_CHUNK_SCORE = 0.15;
          const allMatched = searchResults
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
            .filter((c) => c!.score >= MIN_CHUNK_SCORE) as typeof contextChunks;

          // Dynamic filtering: drop chunks scoring < 50% of the best match
          const topScore = allMatched[0]?.score ?? 0;
          const relativeThreshold = topScore * 0.5;
          // If top chunk is very relevant (>0.7), fewer chunks needed (answer is concentrated)
          const maxChunks = topScore > 0.7 ? 3 : 5;
          contextChunks = allMatched
            .filter((c) => c.score >= relativeThreshold)
            .slice(0, maxChunks);
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

      // Use words from current message + recent conversation for better matching
      // This helps follow-up questions like "comment l'installer ?" match context from earlier messages
      const recentContext = conversationHistory.slice(-4).map((m) => m.content).join(" ");
      const fullQueryText = (message + " " + recentContext).toLowerCase();
      const queryWords = fullQueryText.split(/\s+/).filter((w) => w.length > 2);
      const uniqueWords = [...new Set(queryWords)];

      const keywordMatches = allChunks
        .map((chunk) => {
          const content = chunk.content.toLowerCase();
          const score = uniqueWords.reduce((s, word) => s + (content.includes(word) ? 1 : 0), 0);
          return { content: chunk.content, sourceName: chunk.source.name, sourceUrl: chunk.source.url ?? undefined, score };
        })
        .filter((c) => c.score > 0)
        .sort((a, b) => b.score - a.score);

      // Apply relative threshold: drop chunks scoring < 50% of the best
      const topKeywordScore = keywordMatches[0]?.score ?? 0;
      const keywordThreshold = topKeywordScore * 0.5;
      contextChunks = keywordMatches
        .filter((c) => c.score >= keywordThreshold)
        .slice(0, topKeywordScore > 3 ? 3 : 5);
    }

    // Note: we no longer block with fallback message. The LLM always responds,
    // using available docs when relevant. The prompt instructs it to stay honest
    // when it doesn't have the info, but it still tries to help.

    // ── LLM Generation ──
    const sources = contextChunks.map((c) => ({ title: c.sourceName, url: c.sourceUrl }));

    console.log(`[Chat] Agent: ${agent.name}, Model: ${agent.model}, StrictMode: ${agent.strictMode}, Chunks: ${contextChunks.length}, OPENROUTER_API_KEY: ${!!process.env.OPENROUTER_API_KEY}`);

    if (process.env.OPENROUTER_API_KEY) {
      try {
        const { buildSystemPrompt, compressHistory, allocateTokenBudget, matchProducts, llmGateway } = await import("@chatbot/ai");

        // Match products by keywords
        const matchedProducts = matchProducts(message, agentProducts);

        // Compress history first: last 2 raw, older assistant messages truncated
        const compressedHistory = compressHistory(conversationHistory.slice(-5));

        // Build base system prompt (without docs, to measure its size)
        const baseSystemPrompt = buildSystemPrompt({
          agentName: agent.name,
          fallbackMessage: agent.fallbackMessage,
          contextDocs: "",
          strictMode: agent.strictMode,
        });

        // Apply token budget: allocate tokens across components by priority
        const budget = allocateTokenBudget({
          systemPrompt: baseSystemPrompt,
          customInstructions: agent.systemPrompt || undefined,
          chunks: contextChunks,
          history: compressedHistory,
          userMessage: message,
        });

        // Rebuild system prompt with budgeted chunks and instructions
        const contextDocs = budget.chunks
          .map((c) => `[${c.sourceName}]\n${c.content}`)
          .join("\n\n");

        const systemMessage = buildSystemPrompt({
          agentName: agent.name,
          fallbackMessage: agent.fallbackMessage,
          customPrompt: budget.customInstructions || undefined,
          contextDocs: contextDocs || "Aucun document disponible.",
          strictMode: agent.strictMode,
          promotedProducts: matchedProducts.length > 0
            ? matchedProducts.map((p) => ({
                name: p.name,
                description: p.description,
                url: p.url,
                price: p.price,
              }))
            : undefined,
        });

        const messages = [
          { role: "system" as const, content: systemMessage },
          ...budget.history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
          { role: "user" as const, content: message },
        ];

        const llmStream = await llmGateway.streamChat({
          model: agent.model,
          messages,
          maxTokens: Math.max(agent.maxTokensResponse, 4096),
          temperature: agent.temperature,
        });

        const startTime = Date.now();

        // Create a pass-through that collects the full response and usage
        let fullResponse = "";
        let tokenUsage: { input_tokens: number; output_tokens: number } | null = null;
        const encoder = new TextEncoder();

        const responseStream = new ReadableStream({
          async start(controller) {
            // Send sources FIRST (Perplexity-style: show what we're searching)
            if (sources.length > 0) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ searching: sources })}\n\n`));
            }

            const reader = llmStream.getReader();
            const decoder = new TextDecoder();

            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value, { stream: true });

                // Parse SSE events, forward tokens, capture usage
                const lines = text.split("\n");
                for (const line of lines) {
                  if (line.startsWith("data: ")) {
                    try {
                      const data = JSON.parse(line.slice(6));
                      if (data.token) {
                        fullResponse += data.token;
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: data.token })}\n\n`));
                      }
                      if (data.usage) {
                        tokenUsage = data.usage;
                      }
                    } catch {}
                  }
                }
              }

              // Send final sources
              if (sources.length > 0) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ sources })}\n\n`));
              }

              // Send matched products
              if (matchedProducts.length > 0) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ products: matchedProducts })}\n\n`));
                // Log impressions (fire-and-forget)
                prisma.productEvent.createMany({
                  data: matchedProducts.map((p) => ({
                    productId: p.id,
                    agentId: agent.id,
                    conversationId: conversation!.id,
                    eventType: "impression",
                    visitorId,
                  })),
                }).catch(console.error);
              }

              // Calculate real credits from token usage, fallback to flat rate
              const actualCredits = tokenUsage
                ? calculateMessageCredits(agent.model, tokenUsage.input_tokens, tokenUsage.output_tokens)
                : creditsNeeded;

              const latencyMs = Date.now() - startTime;

              // Save assistant message with real token counts
              const assistantMsg = await prisma.message.create({
                data: {
                  conversationId: conversation!.id,
                  role: "ASSISTANT",
                  content: fullResponse,
                  model: agent.model,
                  creditsUsed: actualCredits,
                  tokensInput: tokenUsage?.input_tokens ?? null,
                  tokensOutput: tokenUsage?.output_tokens ?? null,
                  latencyMs,
                  sources: sources.length > 0 ? sources : undefined,
                },
              });

              // Deduct real credits
              await prisma.organization.update({
                where: { id: agent.orgId },
                data: { creditsUsed: { increment: actualCredits } },
              });
              await prisma.creditLog.create({
                data: {
                  orgId: agent.orgId,
                  agentId: agent.id,
                  action: "MESSAGE_AI",
                  credits: actualCredits,
                  metadata: {
                    model: agent.model,
                    messageId: assistantMsg.id,
                    inputTokens: tokenUsage?.input_tokens,
                    outputTokens: tokenUsage?.output_tokens,
                  },
                },
              });
              const updatedConv = await prisma.conversation.update({
                where: { id: conversation!.id },
                data: { messageCount: { increment: 1 }, creditsUsed: { increment: actualCredits } },
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

              // Send done event with real credits
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                done: true,
                conversationId: conversation!.id,
                messageId: assistantMsg.id,
                creditsUsed: actualCredits,
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
        console.error("[Chat] LLM UNAVAILABLE - using fallback.", err instanceof Error ? err.message : err, "| Model:", agent.model, "| OPENROUTER_API_KEY:", !!process.env.OPENROUTER_API_KEY);
      }
    }

    // ── Fallback: use agent's configured fallback message (no raw doc dump) ──
    return streamSimpleResponse(agent.fallbackMessage, [], conversation.id, agent, creditsNeeded, message);
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
