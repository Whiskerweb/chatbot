import { z } from "zod";
import { widgetConfigSchema } from "./widget-config";

export const createAgentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  model: z.enum(["GPT4O_MINI", "GPT4O", "CLAUDE_HAIKU", "CLAUDE_SONNET", "CLAUDE_OPUS", "GEMINI_FLASH", "GEMINI_PRO", "GROK"]).optional(),
  temperature: z.number().min(0).max(1).optional(),
});

export const updateAgentSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  model: z.enum(["GPT4O_MINI", "GPT4O", "CLAUDE_HAIKU", "CLAUDE_SONNET", "CLAUDE_OPUS", "GEMINI_FLASH", "GEMINI_PRO", "GROK"]).optional(),
  temperature: z.number().min(0).max(1).optional(),
  systemPrompt: z.string().max(5000).optional(),
  strictMode: z.boolean().optional(),
  fallbackMessage: z.string().max(500).optional(),
  maxTokensResponse: z.number().min(100).max(4096).optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  avatarUrl: z.string().url().optional(),
  welcomeMessage: z.string().max(500).optional(),
  suggestedQuestions: z.array(z.string().max(200)).max(5).optional(),
  position: z.enum(["BOTTOM_RIGHT", "BOTTOM_LEFT", "FULL_PAGE"]).optional(),
  leadCaptureEnabled: z.boolean().optional(),
  leadCaptureFields: z.array(z.object({
    field: z.string(),
    required: z.boolean(),
  })).optional(),
  escalationEnabled: z.boolean().optional(),
  escalationAfter: z.number().min(1).max(10).optional(),
  escalationEmail: z.string().email().optional(),
  escalationSlackUrl: z.string().url().optional(),
  allowedDomains: z.array(z.string().min(1).max(253)).max(10).optional(),
  isActive: z.boolean().optional(),
  widgetConfig: widgetConfigSchema.optional(),
  productDisplayMode: z.enum(["INLINE_LINK", "PRODUCT_CARD", "BOTH"]).optional(),
});

export const addWebsiteSchema = z.object({
  agentId: z.string(),
  url: z.string().url(),
  maxDepth: z.number().min(1).max(5).optional().default(3),
  maxPages: z.number().min(1).max(500).optional().default(100),
});

export const addRawTextSchema = z.object({
  agentId: z.string(),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(100000),
});

const httpUrlSchema = z.string().url().refine(
  (url) => /^https?:\/\//i.test(url),
  { message: "Only http/https URLs allowed" }
);

export const addProductSchema = z.object({
  agentId: z.string(),
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  url: httpUrlSchema,
  imageUrl: httpUrlSchema.optional().or(z.literal("")),
  price: z.string().max(50).optional(),
  ctaText: z.string().max(50).optional().default("Voir le produit"),
  keywords: z.array(z.string().min(1).max(50)).min(1).max(30),
  displayMode: z.enum(["INLINE_LINK", "PRODUCT_CARD", "BOTH"]).optional().default("BOTH"),
});

export const updateProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(1000).optional(),
  url: httpUrlSchema.optional(),
  imageUrl: httpUrlSchema.optional().or(z.literal("")),
  price: z.string().max(50).optional(),
  ctaText: z.string().max(50).optional(),
  keywords: z.array(z.string().min(1).max(50)).min(1).max(30).optional(),
  displayMode: z.enum(["INLINE_LINK", "PRODUCT_CARD", "BOTH"]).optional(),
  isActive: z.boolean().optional(),
});

export const chatRequestSchema = z.object({
  message: z.string().min(1).max(5000),
  conversationId: z.string().nullable().optional(),
  visitorId: z.string().min(1),
  metadata: z.object({
    pageUrl: z.string().optional(),
    referrer: z.string().optional(),
    country: z.string().optional(),
    device: z.string().optional(),
  }).optional(),
});

export const feedbackSchema = z.object({
  messageId: z.string(),
  score: z.enum(["1", "5"]).transform(Number),
});

export const leadSchema = z.object({
  agentId: z.string(),
  conversationId: z.string().optional(),
  email: z.string().email(),
  name: z.string().optional(),
  phone: z.string().optional(),
  customFields: z.record(z.string()).optional(),
});

export const paginationSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(20),
});

export const periodSchema = z.object({
  period: z.enum(["7d", "30d", "90d", "custom"]).optional().default("30d"),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});
