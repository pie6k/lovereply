# LoveReply

Understand what your partner is really saying and reply with love.

Paste a message from your partner and get back context that helps you reply in a supportive and loving way — what they're trying to communicate, what they need, what to avoid, and 3 suggested replies.

**Live at [lovereply.ai](https://lovereply.ai)**

## How it works

1. Paste a message from your partner
2. Get AI-powered analysis: what they mean, what they need, what to avoid
3. Pick from 3 suggested loving replies (click to copy)

Responses stream in progressively — reply suggestions appear first, then the deeper analysis.

## Sharing with your partner

Visit `/share` to generate an encrypted link. Your partner opens it and can use LoveReply immediately — no setup needed on their end. Raw API keys never appear in shareable links.

## Routes

- `/` — main app with she/he toggle
- `/she`, `/he` — pronoun-specific versions
- `/reply/[encoded]` — shareable result page (re-generates on each visit)
- `/share` — generate a link for your partner
- `/privacy`, `/terms` — legal pages

## Tech stack

- **Next.js 16** (App Router) + **TypeScript**
- **styled-components** for styling (SSR-compatible)
- **tRPC** + **Zod** for type-safe API calls
- **Vercel AI SDK** with `streamObject` for progressive streaming
- **Anthropic Claude** (Sonnet) for analysis
- **AES-256-GCM** encryption for API key handling
- WebGL shader animation (based on [Ether by nimitz](https://www.shadertoy.com/view/MsjSW3))

## Setup

```bash
corepack enable
yarn install
```

Create `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
ENCRYPTION_SECRET=<64-char hex string>
```

Generate an encryption secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run the dev server:

```bash
yarn dev
```

## Deploy to Vercel

Set these environment variables in your Vercel project:

- `ANTHROPIC_API_KEY`
- `ENCRYPTION_SECRET`
- `ENABLE_EXPERIMENTAL_COREPACK` = `1`

Connect the repo and deploy. That's it.

## License

MIT
