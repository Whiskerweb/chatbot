import OpenAI from "openai";
import type { LLMModel } from "@chatbot/db";

interface ChatOptions {
  model: LLMModel;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  maxTokens: number;
  temperature: number;
  apiKey?: string; // BYOK
}

// Map our model enum to actual provider model IDs
const MODEL_MAP: Record<LLMModel, { provider: "openai" | "anthropic" | "moonshot"; model: string }> = {
  GPT4O_MINI: { provider: "moonshot", model: "moonshot-v1-8k" },
  GPT4O: { provider: "moonshot", model: "moonshot-v1-32k" },
  CLAUDE_HAIKU: { provider: "moonshot", model: "moonshot-v1-8k" },
  CLAUDE_SONNET: { provider: "moonshot", model: "moonshot-v1-32k" },
  CLAUDE_OPUS: { provider: "moonshot", model: "moonshot-v1-128k" },
  GEMINI_FLASH: { provider: "moonshot", model: "moonshot-v1-8k" },
  GEMINI_PRO: { provider: "moonshot", model: "moonshot-v1-32k" },
  GROK: { provider: "moonshot", model: "moonshot-v1-32k" },
};

export const llmGateway = {
  async streamChat(options: ChatOptions): Promise<ReadableStream> {
    const modelConfig = MODEL_MAP[options.model];

    // Route through Moonshot (OpenAI-compatible API)
    return streamMoonshot(options, modelConfig.model);
  },
};

async function streamMoonshot(options: ChatOptions, model: string): Promise<ReadableStream> {
  const client = new OpenAI({
    apiKey: options.apiKey || process.env.OPENAI_API_KEY,
    baseURL: "https://api.moonshot.cn/v1",
  });

  const stream = await client.chat.completions.create({
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
