import type { CreditActionType, LLMModelType } from "./types";

// Credits per AI message by model (used as fallback/estimate before streaming)
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

// ── Token-based credit pricing ──
// StepFun 3.5 Flash: $0.10/M input, $0.30/M output
// All models in UI are branding — single API model in production
export const TOKEN_CREDIT_RATE = {
  inputPer1K: 0.074,   // $0.10/M → 0.074 credits per 1K input tokens
  outputPer1K: 0.221,  // $0.30/M → 0.221 credits per 1K output tokens
};

// Calculate credits from actual token usage (model-agnostic, single tier)
export function calculateMessageCredits(
  _model: LLMModelType,
  inputTokens: number,
  outputTokens: number,
): number {
  const raw = (inputTokens / 1000) * TOKEN_CREDIT_RATE.inputPer1K
            + (outputTokens / 1000) * TOKEN_CREDIT_RATE.outputPer1K;
  return Math.max(1, Math.ceil(raw));
}

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
