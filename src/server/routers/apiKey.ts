import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { encryptApiKey } from "../crypto";

export const apiKeyRouter = router({
  encrypt: publicProcedure
    .input(z.object({ key: z.string().startsWith("sk-ant-") }))
    .mutation(({ input }) => {
      return { encryptedKey: encryptApiKey(input.key) };
    }),
});
