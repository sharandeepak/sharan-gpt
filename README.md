# Resume Bot — Sharan Deepak R B

A two‑pane interactive resume site. Left: the actual resume PDF and contact actions. Right: a streaming AI assistant that answers HR questions using only Sharan's verified profile and a curated Q&A bank in Firestore. Also includes a password‑gated `/admin` page that surfaces what recruiters are asking.

Built with Next.js 15 (App Router), TypeScript, Tailwind v4, shadcn‑style primitives, the Vercel AI SDK, AI Elements–style chat composition, and Firebase Admin for Firestore.

## Getting started

```bash
pnpm install        # or npm install / yarn
cp .env.example .env.local
# fill in FIREBASE_*, OPENAI_API_KEY (or AI_GATEWAY_API_KEY), ADMIN_PASSWORD
pnpm dev
```

Open `http://localhost:3000`.

The site works without Firebase or OpenAI keys: chips fall back to a static set, the chat composer disables itself with a clear notice, and the admin page tells you what's missing. Add the keys to enable each feature.

## Replacing the resume

Drop your real PDF at `public/resume.pdf` (overwriting the seeded one) and update `data/profile.json` with your facts. The chat assistant only sees `profile.json` and the curated Firestore answers, so anything missing from those won't be invented.

## Seed the curated questions

```bash
pnpm seed
```

Writes ten suggested HR questions and their curated answers to the Firestore collection `suggested_questions`. Re‑running is idempotent (uses a deterministic id per question).

## Folder layout

```
app/
  page.tsx               two-pane layout
  admin/page.tsx         password-gated dashboard
  api/
    chat/                streaming free-form chat
    suggested-questions/ curated Q&A fetch
    track-question/      analytics writes (server-only)
    admin/login/         session cookie
    admin/data/          analytics aggregation for the dashboard
components/
  Resume*, Chat*, Theme*, Admin*, ui/, ai/
lib/
  firebase-admin.ts      server-only Firestore client
  profile.ts             chunked retrieval over profile.json
  rate-limit.ts          in-memory token bucket
  sanitize.ts            input length + prompt-injection guard
  session.ts             sessionId helpers (client) + cookie helpers (server)
  themes.ts              theme metadata for the switcher
data/
  profile.json
  profile_summary.md
public/
  resume.pdf
scripts/
  seed-suggested-questions.ts
```

## Firestore schema

`suggested_questions/{id}`

```ts
{
  id: string;
  question: string;
  answer: string;
  category: 'overview' | 'skills' | 'impact' | 'projects' | 'contact' | 'tools';
  priority: number;        // smaller = shown earlier
  isActive: boolean;
  createdAt: Timestamp;    // serverTimestamp
  updatedAt: Timestamp;    // serverTimestamp
}
```

`chat_logs/{auto}`

```ts
{
  sessionId: string;
  source: 'suggested_question' | 'free_text';
  question: string;
  response: string;
  matchedSuggestedQuestionId: string | null;
  userAgent: string;
  pagePath: string;
  theme: string;
  createdAt: Timestamp;
}
```

`chat_sessions/{sessionId}`

```ts
{
  sessionId: string;
  firstSeenAt: Timestamp;
  lastSeenAt: Timestamp;
  totalQuestions: number;
  suggestedQuestionClicks: number;
  freeTextQuestions: number;
  userAgent: string;
  referrer: string;
}
```

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Cmd/Ctrl + K` | Focus the chat input |
| `Cmd/Ctrl + D` | Download the resume |
| `Esc` | Close theme switcher / blur chat |

## Security notes

- Firebase Admin credentials live only in server routes. The client never imports `firebase-admin`.
- All analytics writes go through `/api/track-question`. The browser never writes to Firestore directly.
- `/admin` is gated by `ADMIN_PASSWORD` via a signed `admin_session` cookie.
- Free‑text chat input is capped at 1500 characters and stripped of obvious system‑prompt injection markers before being forwarded to the model.
- A simple in‑memory token bucket allows ten free‑form questions per session per minute.

## Deploy

Vercel is the path of least resistance: every env var listed in `.env.example` maps cleanly to a Vercel env. `FIREBASE_PRIVATE_KEY` should be pasted with `\n` sequences intact (Vercel will display them collapsed; the runtime expands them).
