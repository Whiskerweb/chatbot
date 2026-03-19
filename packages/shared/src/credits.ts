import type { CreditActionType, LLMModelType } from "./types";

// Credits per AI message by model
export const MODEL_CREDITS: Record<LLMModelType, number> = {
  GPT4O_MINI: 1,
  CLAUDE_HAIKU: 1,
  GEMINI_FLASH: 1,
  GPT4O: 3,
  CLAUDE_SONNET: 3,
  GEMINI_PRO: 3,
  CLAUDE_OPUS: 5,
  GROK: 3,
};

// Credits for other actions
export const ACTION_CREDITS: Record<CreditActionType, number> = {
  MESSAGE_AI: 0, // depends on model, see MODEL_CREDITS
  INDEXING: 2, // per web page
  REINDEX: 1, // 50% reduction
  SYNC: 1, // per page
  EXPORT: 5,
  WEBHOOK: 2,
  TRANSLATION: 1,
  AI_SUGGESTION: 3,
};

// PDF indexing: 1 credit per page
export const PDF_CREDITS_PER_PAGE = 1;

// DOCX/TXT/MD indexing: 1 credit per 1000 words
export const TEXT_CREDITS_PER_1000_WORDS = 1;

export function getMessageCredits(model: LLMModelType): number {
  return MODEL_CREDITS[model] ?? 1;
}

export function getIndexingCredits(
  type: "web_page" | "pdf_page" | "text_words",
  count: number
): number {
  switch (type) {
    case "web_page":
      return count * ACTION_CREDITS.INDEXING;
    case "pdf_page":
      return count * PDF_CREDITS_PER_PAGE;
    case "text_words":
      return Math.ceil(count / 1000) * TEXT_CREDITS_PER_1000_WORDS;
  }
}
