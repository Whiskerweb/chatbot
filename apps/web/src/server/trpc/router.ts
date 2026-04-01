import { router } from "./init";
import { agentsRouter } from "./routers/agents";
import { sourcesRouter } from "./routers/sources";
import { conversationsRouter } from "./routers/conversations";
import { analyticsRouter } from "./routers/analytics";
import { billingRouter } from "./routers/billing";
import { settingsRouter } from "./routers/settings";
import { productsRouter } from "./routers/products";

export const appRouter = router({
  agents: agentsRouter,
  sources: sourcesRouter,
  conversations: conversationsRouter,
  analytics: analyticsRouter,
  billing: billingRouter,
  settings: settingsRouter,
  products: productsRouter,
});

export type AppRouter = typeof appRouter;
