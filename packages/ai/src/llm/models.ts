import type { LLMModel } from "@chatbot/db";

interface ModelInfo {
  id: LLMModel;
  name: string;
  provider: string;
  creditsPerMessage: number;
  contextWindow: number;
  description: string;
}

export const MODELS: Record<LLMModel, ModelInfo> = {
  GPT4O_MINI: {
    id: "GPT4O_MINI",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    creditsPerMessage: 1,
    contextWindow: 128000,
    description: "Rapide et économique, idéal pour les questions simples",
  },
  GPT4O: {
    id: "GPT4O",
    name: "GPT-4o",
    provider: "OpenAI",
    creditsPerMessage: 3,
    contextWindow: 128000,
    description: "Puissant et polyvalent",
  },
  CLAUDE_HAIKU: {
    id: "CLAUDE_HAIKU",
    name: "Claude Haiku",
    provider: "Anthropic",
    creditsPerMessage: 1,
    contextWindow: 200000,
    description: "Rapide et précis, excellent rapport qualité/prix",
  },
  CLAUDE_SONNET: {
    id: "CLAUDE_SONNET",
    name: "Claude Sonnet",
    provider: "Anthropic",
    creditsPerMessage: 3,
    contextWindow: 200000,
    description: "Excellent pour l'analyse et la rédaction",
  },
  CLAUDE_OPUS: {
    id: "CLAUDE_OPUS",
    name: "Claude Opus",
    provider: "Anthropic",
    creditsPerMessage: 5,
    contextWindow: 200000,
    description: "Le plus puissant, pour les tâches complexes",
  },
  GEMINI_FLASH: {
    id: "GEMINI_FLASH",
    name: "Gemini Flash",
    provider: "Google",
    creditsPerMessage: 1,
    contextWindow: 1000000,
    description: "Ultra-rapide avec une grande fenêtre de contexte",
  },
  GEMINI_PRO: {
    id: "GEMINI_PRO",
    name: "Gemini Pro",
    provider: "Google",
    creditsPerMessage: 3,
    contextWindow: 1000000,
    description: "Performant avec contexte étendu",
  },
  GROK: {
    id: "GROK",
    name: "Grok",
    provider: "xAI",
    creditsPerMessage: 3,
    contextWindow: 131072,
    description: "Modèle xAI, bon pour les réponses directes",
  },
};
