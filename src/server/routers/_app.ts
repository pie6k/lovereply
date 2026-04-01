import { router } from "../trpc";
import { analyzeRouter } from "./analyze";

export const appRouter = router({
  analyze: analyzeRouter,
});

export type AppRouter = typeof appRouter;
