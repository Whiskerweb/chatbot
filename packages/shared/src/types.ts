export type PlanType = "FREE" | "STARTER" | "PRO" | "GROWTH";

export type CreditActionType =
  | "MESSAGE_AI"
  | "INDEXING"
  | "REINDEX"
  | "SYNC"
  | "EXPORT"
  | "WEBHOOK"
  | "TRANSLATION"
  | "AI_SUGGESTION";

export type LLMModelType =
  | "GPT4O_MINI"
  | "GPT4O"
  | "CLAUDE_HAIKU"
  | "CLAUDE_SONNET"
  | "CLAUDE_OPUS"
  | "GEMINI_FLASH"
  | "GEMINI_PRO"
  | "GROK";

export interface CreditCost {
  action: CreditActionType;
  credits: number;
  description: string;
}

export interface PlanConfig {
  name: string;
  slug: PlanType;
  price: number;
  creditsPerMonth: number;
  maxAgents: number;
  maxSources: number;
  maxMembers: number;
  models: LLMModelType[];
  features: {
    liveChat: boolean;
    whiteLabel: boolean;
    whiteLabelPrice?: number;
    autoSync: "none" | "weekly" | "daily" | "4x_daily" | "realtime";
    api: boolean;
    mcp: boolean;
    sdk: boolean;
    byok: boolean;
    aiAnalytics: boolean;
    logRetentionDays: number;
    support: "community" | "email_48h" | "chat_24h" | "priority" | "dedicated";
  };
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  visitorId: string;
  metadata?: {
    pageUrl?: string;
    referrer?: string;
    country?: string;
    device?: string;
  };
}

export interface ChatSource {
  title: string;
  url?: string;
  score: number;
  chunkId: string;
  sourceId: string;
}

export interface AnalyticsOverview {
  conversations: { total: number; vsPrevious: number; trend: number[] };
  messages: { total: number; vsPrevious: number };
  deflectionRate: { value: number; vsPrevious: number };
  leadsCapture: { total: number; vsPrevious: number };
  creditsUsed: { total: number; remaining: number; projectedEnd: number };
}
