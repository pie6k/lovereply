import { z } from "zod";
import { createAnthropic } from "@ai-sdk/anthropic";
import { streamObject } from "ai";
import { decryptApiKey } from "@/server/crypto";

export const analysisSchema = z.object({
  replies: z
    .array(z.string())
    .length(3)
    .describe("3 suggested replies that are supportive and loving"),
  tryingToCommunicate: z
    .string()
    .describe("What she/he is trying to communicate"),
  needs: z.string().describe("What she/he needs from you"),
  whatToAvoid: z.string().describe("What to avoid in your response"),
});

export type Analysis = z.infer<typeof analysisSchema>;

export async function POST(req: Request) {
  const body = await req.json();
  const { message, pronoun, encryptedKey } = body;

  if (!message || !pronoun) {
    return new Response("Missing fields", { status: 400 });
  }

  let apiKey: string | undefined;
  if (encryptedKey) {
    try {
      apiKey = decryptApiKey(encryptedKey);
    } catch {
      return new Response("Invalid key", { status: 400 });
    }
  }

  const provider = createAnthropic({ apiKey });

  const result = streamObject({
    model: provider("claude-sonnet-4-20250514"),
    schema: analysisSchema,
    prompt: `You are a relationship communication expert. Someone received the following message from their partner (${pronoun === "she" ? "her" : "him"}):

"${message}"

Analyze this message and provide:
1. 3 suggested replies that are supportive, loving, and emotionally intelligent. Keep them natural and conversational — not robotic or overly formal. GENERATE THESE FIRST.
2. What ${pronoun} is trying to communicate (the underlying message beyond the words)
3. What ${pronoun} needs (emotionally, practically)
4. What to avoid when replying (common mistakes that would make things worse)

IMPORTANT: Detect the language of the pasted message. Your ENTIRE response — all analysis, tips, and suggested replies — MUST be in that same language. If the message is in Polish, respond in Polish. If in Spanish, respond in Spanish. Match the language exactly.

FORMATTING: In the analysis fields (tryingToCommunicate, needs, whatToAvoid), wrap the most important words or short phrases in **bold** using markdown syntax. Use bold sparingly — only 2-4 key words/phrases per field to highlight what matters most. Do NOT use bold in the reply suggestions.`,
  });

  return result.toTextStreamResponse();
}
