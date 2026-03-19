import OpenAI from "openai";
import type { LLMModel } from "@chatbot/db";

interface ChatOptions {
  model: LLMModel;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  maxTokens: number;
  temperature: number;
  apiKey?: string; // BYOK
}

// Map our model enum to Kimi/Moonshot model IDs
const MODEL_MAP: Record<LLMModel, string> = {
  GPT4O_MINI: "moonshot-v1-8k",
  GPT4O: "kimi-k2-turbo-preview",
  CLAUDE_HAIKU: "moonshot-v1-8k",
  CLAUDE_SONNET: "kimi-k2-turbo-preview",
  CLAUDE_OPUS: "kimi-k2.5",
  GEMINI_FLASH: "moonshot-v1-8k",
  GEMINI_PRO: "kimi-k2-turbo-preview",
  GROK: "kimi-k2-turbo-preview",
};

const MOONSHOT_BASE_URL = "https://kimi.moonshot.cn/v1";

export const llmGateway = {
  async streamChat(options: ChatOptions): Promise<ReadableStream> {
    const model = MODEL_MAP[options.model];
    return streamMoonshot(options, model);
  },
};

async function streamMoonshot(options: ChatOptions, model: string): Promise<ReadableStream> {
  const client = new OpenAI({
    apiKey: options.apiKey || process.env.OPENAI_API_KEY,
    baseURL: MOONSHOT_BASE_URL,
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
