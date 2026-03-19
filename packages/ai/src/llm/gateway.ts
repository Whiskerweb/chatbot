import OpenAI from "openai";
import type { LLMModel } from "@prisma/client";

interface ChatOptions {
  model: LLMModel;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  maxTokens: number;
  temperature: number;
  apiKey?: string; // BYOK
}

// Map our model enum to actual provider model IDs
const MODEL_MAP: Record<LLMModel, { provider: "openai" | "anthropic" | "google"; model: string }> = {
  GPT4O_MINI: { provider: "openai", model: "gpt-4o-mini" },
  GPT4O: { provider: "openai", model: "gpt-4o" },
  CLAUDE_HAIKU: { provider: "anthropic", model: "claude-haiku-4-5-20251001" },
  CLAUDE_SONNET: { provider: "anthropic", model: "claude-sonnet-4-6-20250514" },
  CLAUDE_OPUS: { provider: "anthropic", model: "claude-opus-4-6-20250610" },
  GEMINI_FLASH: { provider: "google", model: "gemini-2.0-flash" },
  GEMINI_PRO: { provider: "google", model: "gemini-2.5-pro-preview-06-05" },
  GROK: { provider: "openai", model: "grok-3" }, // xAI uses OpenAI-compat API
};

export const llmGateway = {
  async streamChat(options: ChatOptions): Promise<ReadableStream> {
    const modelConfig = MODEL_MAP[options.model];

    // For now, route everything through OpenAI-compatible API
    // Anthropic and Google will need their own SDK calls
    if (modelConfig.provider === "openai" || modelConfig.provider === "google") {
      return streamOpenAI(options, modelConfig.model);
    }

    if (modelConfig.provider === "anthropic") {
      return streamAnthropic(options, modelConfig.model);
    }

    throw new Error(`Unsupported provider: ${modelConfig.provider}`);
  },
};

async function streamOpenAI(options: ChatOptions, model: string): Promise<ReadableStream> {
  const openai = new OpenAI({
    apiKey: options.apiKey || process.env.OPENAI_API_KEY,
  });

  const stream = await openai.chat.completions.create({
    model,
    messages: options.messages,
    max_tokens: options.maxTokens,
    temperature: options.temperature,
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content;
        if (token) {
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ token })}\n\n`
            )
          );
        }
      }
      controller.enqueue(
        new TextEncoder().encode(`data: ${JSON.stringify({ done: true })}\n\n`)
      );
      controller.close();
    },
  });
}

async function streamAnthropic(options: ChatOptions, model: string): Promise<ReadableStream> {
  const apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;

  // Extract system message
  const systemMsg = options.messages.find((m) => m.role === "system");
  const userMessages = options.messages.filter((m) => m.role !== "system");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: options.maxTokens,
      temperature: options.temperature,
      system: systemMsg?.content ?? "",
      messages: userMessages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
      stream: true,
    }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "content_block_delta") {
                const token = parsed.delta?.text;
                if (token) {
                  controller.enqueue(
                    new TextEncoder().encode(
                      `data: ${JSON.stringify({ token })}\n\n`
                    )
                  );
                }
              }
            } catch {
              // skip non-JSON lines
            }
          }
        }
      }
      controller.enqueue(
        new TextEncoder().encode(`data: ${JSON.stringify({ done: true })}\n\n`)
      );
      controller.close();
    },
  });
}
