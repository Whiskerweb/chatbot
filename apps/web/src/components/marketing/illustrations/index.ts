import type { ComponentType } from "react";
import { AgentIllustration } from "./agent-illustration";
import { SourcesIllustration } from "./sources-illustration";
import { AnalyticsIllustration } from "./analytics-illustration";
import { WidgetIllustration } from "./widget-illustration";
import { ApiIllustration } from "./api-illustration";
import { SecurityIllustration } from "./security-illustration";

export { AgentIllustration } from "./agent-illustration";
export { SourcesIllustration } from "./sources-illustration";
export { AnalyticsIllustration } from "./analytics-illustration";
export { WidgetIllustration } from "./widget-illustration";
export { ApiIllustration } from "./api-illustration";
export { SecurityIllustration } from "./security-illustration";

export const illustrationMap: Record<string, ComponentType> = {
  "agent-ia": AgentIllustration,
  "sources-rag": SourcesIllustration,
  "analytics": AnalyticsIllustration,
  "widget": WidgetIllustration,
  "api-integrations": ApiIllustration,
  "securite": SecurityIllustration,
};
