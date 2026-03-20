import type { PlanConfig, LLMModelType } from "./types";

const BASIC_MODELS: LLMModelType[] = ["GPT4O_MINI", "CLAUDE_HAIKU", "GEMINI_FLASH"];
const MID_MODELS: LLMModelType[] = [...BASIC_MODELS, "GPT4O", "CLAUDE_SONNET", "GEMINI_PRO"];
const ALL_MODELS: LLMModelType[] = [...MID_MODELS, "CLAUDE_OPUS", "GROK"];

export const PLANS: Record<string, PlanConfig> = {
  FREE: {
    name: "Free",
    slug: "FREE",
    price: 0,
    creditsPerMonth: 100,
    maxAgents: 1,
    maxSources: 30,
    maxMembers: 1,
    models: BASIC_MODELS,
    features: {
      liveChat: false,
      whiteLabel: false,
      autoSync: "none",
      api: false,
      mcp: false,
      sdk: false,
      byok: false,
      aiAnalytics: false,
      customDomain: false,
      logRetentionDays: 7,
      support: "community",
    },
  },
  STARTER: {
    name: "Starter",
    slug: "STARTER",
    price: 29,
    creditsPerMonth: 3000,
    maxAgents: 3,
    maxSources: 500,
    maxMembers: 2,
    models: MID_MODELS,
    features: {
      liveChat: true,
      whiteLabel: false,
      autoSync: "weekly",
      api: true,
      mcp: false,
      sdk: false,
      byok: false,
      aiAnalytics: true,
      customDomain: false,
      logRetentionDays: 30,
      support: "email_48h",
    },
  },
  PRO: {
    name: "Pro",
    slug: "PRO",
    price: 79,
    creditsPerMonth: 15000,
    maxAgents: 10,
    maxSources: 5000,
    maxMembers: 5,
    models: ALL_MODELS,
    features: {
      liveChat: true,
      whiteLabel: true,
      whiteLabelPrice: 49,
      autoSync: "daily",
      api: true,
      mcp: true,
      sdk: false,
      byok: true,
      aiAnalytics: true,
      customDomain: false,
      logRetentionDays: 90,
      support: "chat_24h",
    },
  },
  GROWTH: {
    name: "Growth",
    slug: "GROWTH",
    price: 199,
    creditsPerMonth: 50000,
    maxAgents: 25,
    maxSources: 15000,
    maxMembers: 15,
    models: ALL_MODELS,
    features: {
      liveChat: true,
      whiteLabel: true,
      autoSync: "4x_daily",
      api: true,
      mcp: true,
      sdk: false,
      byok: true,
      aiAnalytics: true,
      customDomain: true,
      logRetentionDays: 365,
      support: "priority",
    },
  },
};

export function getPlanConfig(plan: string): PlanConfig {
  return PLANS[plan] ?? PLANS.FREE;
}

export function canUseModel(plan: string, model: LLMModelType): boolean {
  const config = getPlanConfig(plan);
  return config.models.includes(model);
}

export function isFeatureAvailable(plan: string, feature: keyof PlanConfig["features"]): boolean {
  const config = getPlanConfig(plan);
  return !!config.features[feature];
}
