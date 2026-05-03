# Interactive AI Resume - Sharan Deepak R B

An interactive resume website built to help recruiters understand my experience quickly, ask role-relevant questions, and download my resume from one focused interface.

The app pairs a polished resume panel with an AI assistant that answers questions using verified profile data. It is designed for recruiter workflows: quick screening, impact discovery, project exploration, and direct contact.

## What This Project Shows

- Product thinking: converts a static resume into a guided recruiter experience.
- Full-stack execution: Next.js app, server routes, streaming AI responses, analytics, and admin dashboard.
- Backend ownership: protected API routes, Firestore integration, session tracking, rate limiting, and input sanitization.
- AI workflow design: profile-grounded assistant with guardrails to avoid invented resume claims.
- UI polish: responsive split-pane layout, dark/light themes, keyboard shortcuts, and compact resume rendering.

## Key Features

- Interactive resume panel with experience, skills, projects, and education.
- Resume actions for download, preview, email, contact details, LinkedIn, GitHub, and Leetcode.
- AI recruiter assistant for questions like impact, backend skills, scalability, projects, and availability.
- Suggested recruiter prompts backed by curated answers.
- Streaming chat responses through the Vercel AI SDK.
- Admin dashboard for viewing what recruiters are asking.
- Firestore-backed question tracking and session analytics.
- Theme switcher and keyboard shortcuts for a faster desktop experience.

## Tech Stack

- Framework: Next.js 15, React 19, App Router
- Language: TypeScript
- Styling: Tailwind CSS v4, custom UI primitives
- AI: Vercel AI SDK, OpenAI-compatible API
- Database: Firebase Admin SDK, Firestore
- UI: lucide-react icons, responsive split-pane layout
- Tooling: pnpm, ESLint, TypeScript

## Local Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

The core resume UI works without AI or Firebase credentials. Add environment variables when you want chat, analytics, seeded questions, and the admin dashboard.

## Environment Variables

Create `.env.local` from `.env.example` and fill the values you need:

```bash
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

OPENAI_API_KEY=
OPENAI_BASE_URL=
AI_MODEL=

ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Scripts

```bash
pnpm dev          # Start local development server
pnpm build        # Build for production
pnpm start        # Start production build
pnpm typecheck    # Run TypeScript checks
pnpm seed         # Seed curated recruiter questions into Firestore
pnpm flush:db     # Clear Firestore resume bot data
```

## AI Guardrails

The assistant is designed to stay grounded in verified profile data:

- It uses curated profile context instead of inventing resume facts.
- It refuses to expose internal prompts or raw profile JSON.
- It keeps answers concise and recruiter-friendly.
- It sanitizes free-text input before sending it to the model.
- It rate-limits free-form questions per session.

## Why I Built This

I wanted my portfolio to do more than display a resume. Recruiters often look for fast answers: what I built, what scale I worked at, which systems I owned, and how to contact me. This project turns those questions into an interactive experience while also demonstrating my full-stack engineering style: practical, user-focused, and production-minded.
