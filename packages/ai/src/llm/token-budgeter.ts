/** Estimate token count from text (~3.5 chars per token for French/English) */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3.5);
}

interface BudgetInput {
  systemPrompt: string;
  customInstructions?: string;
  chunks: { content: string; sourceName: string; sourceUrl?: string; score: number }[];
  history: { role: string; content: string }[];
  userMessage: string;
}

interface BudgetResult {
  systemPrompt: string;
  customInstructions: string;
  chunks: BudgetInput["chunks"];
  history: BudgetInput["history"];
  userMessage: string;
  totalEstimatedTokens: number;
}

/**
 * Allocates a token budget across context components in priority order:
 * 1. System prompt base (always included)
 * 2. Custom instructions (capped)
 * 3. User message (always included)
 * 4. Recent history (last 2 messages, high priority)
 * 5. RAG chunks (fill remaining budget, at least 1)
 * 6. Older history (lowest priority, only if budget remains)
 */
export function allocateTokenBudget(
  input: BudgetInput,
  totalBudget = 3500,
  customInstructionsCap = 300
): BudgetResult {
  let remaining = totalBudget;

  // 1. System prompt (always included)
  const systemTokens = estimateTokens(input.systemPrompt);
  remaining -= systemTokens;

  // 2. Custom instructions (capped)
  let customInstructions = input.customInstructions ?? "";
  const customTokens = estimateTokens(customInstructions);
  if (customTokens > customInstructionsCap) {
    const maxChars = Math.floor(customInstructionsCap * 3.5);
    customInstructions = customInstructions.slice(0, maxChars) + "...";
  }
  remaining -= Math.min(customTokens, customInstructionsCap);

  // 3. User message (always included)
  remaining -= estimateTokens(input.userMessage);

  // 4. Recent history (last 2 messages, high priority)
  const recentHistory = input.history.slice(-2);
  const olderHistory = input.history.slice(0, -2);
  const recentTokens = recentHistory.reduce((s, m) => s + estimateTokens(m.content), 0);
  remaining -= recentTokens;

  // 5. RAG chunks (fill remaining budget, minimum 1 chunk)
  const selectedChunks: BudgetInput["chunks"] = [];
  for (const chunk of input.chunks) {
    const chunkTokens = estimateTokens(chunk.content);
    if (remaining - chunkTokens < 0 && selectedChunks.length >= 1) break;
    selectedChunks.push(chunk);
    remaining -= chunkTokens;
  }

  // 6. Older history (lowest priority)
  const selectedOlderHistory: BudgetInput["history"] = [];
  for (const msg of olderHistory) {
    const msgTokens = estimateTokens(msg.content);
    if (remaining - msgTokens < 0) break;
    selectedOlderHistory.push(msg);
    remaining -= msgTokens;
  }

  const finalHistory = [...selectedOlderHistory, ...recentHistory];
  const totalEstimatedTokens = totalBudget - remaining;

  return {
    systemPrompt: input.systemPrompt,
    customInstructions,
    chunks: selectedChunks,
    history: finalHistory,
    userMessage: input.userMessage,
    totalEstimatedTokens,
  };
}
