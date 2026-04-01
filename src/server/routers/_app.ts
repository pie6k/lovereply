import { router } from "../trpc";
import { analyzeRouter } from "./analyze";
import { apiKeyRouter } from "./apiKey";

export const appRouter = router({
  analyze: analyzeRouter,
  apiKey: apiKeyRouter,
});

export type AppRouter = typeof appRouter;
