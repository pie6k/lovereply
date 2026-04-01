import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";

const analysisSchema = z.object({
  tryingToCommunicate: z.string().describe("What she/he is trying to communicate"),
  needs: z.string().describe("What she/he needs from you"),
  whatToAvoid: z.string().describe("What to avoid in your response"),
  replies: z
    .array(z.string())
    .length(3)
    .describe("3 suggested replies that are supportive and loving"),
});

export type Analysis = z.infer<typeof analysisSchema>;

export const analyzeRouter = router({
  analyze: publicProcedure
    .input(
      z.object({
        message: z.string().min(1),
        pronoun: z.enum(["she", "he"]),
      })
    )
    .mutation(async ({ input }) => {
      const { object } = await generateObject({
        model: anthropic("claude-sonnet-4-20250514"),
        schema: analysisSchema,
        prompt: `You are a relationship communication expert. Someone received the following message from their partner (${input.pronoun === "she" ? "her" : "him"}):

"${input.message}"

Analyze this message and provide:
1. What ${input.pronoun} is trying to communicate (the underlying message beyond the words)
2. What ${input.pronoun} needs (emotionally, practically)
3. What to avoid when replying (common mistakes that would make things worse)
4. 3 suggested replies that are supportive, loving, and emotionally intelligent. Keep them natural and conversational — not robotic or overly formal.

IMPORTANT: Detect the language of the pasted message. Your ENTIRE response — all analysis, tips, and suggested replies — MUST be in that same language. If the message is in Polish, respond in Polish. If in Spanish, respond in Spanish. Match the language exactly.`,
      });

      return object;
    }),
});
