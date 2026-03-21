import type { ComponentType } from "react";
import { AgentIllustration } from "./agent-illustration";
import { SourcesIllustration } from "./sources-illustration";
import { AnalyticsIllustration } from "./analytics-illustration";
import { WidgetIllustration } from "./widget-illustration";
import { ApiIllustration } from "./api-illustration";
import { SecurityIllustration } from "./security-illustration";
import { IndexingIllustration } from "./indexing-illustration";

export { AgentIllustration } from "./agent-illustration";
export { SourcesIllustration } from "./sources-illustration";
export { AnalyticsIllustration } from "./analytics-illustration";
export { WidgetIllustration } from "./widget-illustration";
export { ApiIllustration } from "./api-illustration";
export { SecurityIllustration } from "./security-illustration";
export { IndexingIllustration } from "./indexing-illustration";

/* Keys match featureTabs[].id in page.tsx */
export const illustrationMap: Record<string, ComponentType> = {
  agent: AgentIllustration,
  sources: IndexingIllustration,
  analytics: AnalyticsIllustration,
  widget: WidgetIllustration,
  api: ApiIllustration,
};
