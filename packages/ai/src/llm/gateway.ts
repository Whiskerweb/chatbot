import OpenAI from "openai";
import type { LLMModel } from "@chatbot/db";

interface ChatOptions {
  model: LLMModel;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  maxTokens: number;
  temperature: number;
  apiKey?: string; // BYOK
}

// Map our model enum to OpenRouter model IDs
const MODEL_MAP: Record<LLMModel, string> = {
  GPT4O_MINI: "openai/gpt-4o-mini",
  GPT4O: "openai/gpt-4o",
  CLAUDE_HAIKU: "anthropic/claude-3-haiku",
  CLAUDE_SONNET: "anthropic/claude-sonnet-4",
  CLAUDE_OPUS: "anthropic/claude-opus-4",
  GEMINI_FLASH: "google/gemini-2.0-flash-001",
  GEMINI_PRO: "google/gemini-2.5-pro-preview",
  GROK: "x-ai/grok-3",
};

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

export interface ChatResult {
  content: string;
  usage?: { inputTokens: number; outputTokens: number };
}

function getClient(apiKey?: string): OpenAI {
  return new OpenAI({
    apiKey: apiKey || process.env.OPENROUTER_API_KEY!,
    baseURL: OPENROUTER_BASE_URL,
  });
}

export const llmGateway = {
  async streamChat(options: ChatOptions): Promise<ReadableStream> {
    const model = MODEL_MAP[options.model];
    const client = getClient(options.apiKey);

    const stream = await client.chat.completions.create({
      model,
      messages: options.messages,
      max_tokens: options.maxTokens,
      temperature: options.temperature,
      stream: true,
      stream_options: { include_usage: true },
    });

    return new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of stream) {
          const token = chunk.choices[0]?.delta?.content;
          if (token) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ token })}\n\n`)
            );
          }
          if (chunk.usage) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({
                usage: {
                  input_tokens: chunk.usage.prompt_tokens,
                  output_tokens: chunk.usage.completion_tokens,
                },
              })}\n\n`)
            );
          }
        }
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
        );
        controller.close();
      },
    });
  },

  async chat(options: ChatOptions): Promise<ChatResult> {
    const model = MODEL_MAP[options.model];
    const client = getClient(options.apiKey);

    const response = await client.chat.completions.create({
      model,
      messages: options.messages,
      max_tokens: options.maxTokens,
      temperature: options.temperature,
    });

    return {
      content: response.choices[0]?.message?.content ?? "",
      usage: response.usage
        ? { inputTokens: response.usage.prompt_tokens, outputTokens: response.usage.completion_tokens }
        : undefined,
    };
  },
};
