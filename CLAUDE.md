# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Next.js dev server with Turbopack (http://localhost:3000)
npm run build        # Next.js production build
npx convex dev       # Convex dev server (generates types, syncs schema) — run in separate terminal
npx convex deploy    # Deploy Convex functions to production
```

No test runner, linter, or formatter is configured.

## Architecture

**Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS 4 + Convex + Better-Auth + Claude Sonnet 4 (via OpenRouter)

### Routing (`src/app/`)

```
/                          → Landing page (9 composed sections)
/sign-in                   → Sign in (email + optional Google OAuth)
/sign-up                   → Sign up (email + optional Google OAuth)
/app                       → Dashboard (auth-protected)
/app/analyze               → Upload creative → select personas → run AI analysis
/app/personas              → Persona grid + create custom
/app/results               → All completed test results
/app/results/[testId]      → Tabbed results (overview, feedback, debate, heatmap, benchmarks)
/api/auth/[...all]         → Better-Auth API routes
```

Auth protection: `src/app/app/layout.tsx` checks `useConvexAuth()` and redirects to `/sign-in`.

### Data Layer — Convex

9 tables in `convex/schema.ts`: `users`, `personas`, `creatives`, `tests`, `personaFeedbacks`, `debates`, `heatmaps`, `fixIts`, `benchmarks`. All result tables indexed by `testId`.

Key Convex files:
- `convex/ai/analyze.ts` — `runAnalysis` action: full AI pipeline (vision → metrics → personas → debate → fix-its → heatmap → benchmarks)
- `convex/ai/prompts.ts` — 7 prompt templates (exports: `VISION_EXTRACTION_PROMPT`, `METRIC_SCORING_PROMPT`, `personaSimulationPrompt`, `AGENT_DEBATE_PROMPT`, `FIX_IT_PROMPT`, `HEATMAP_PROMPT`, `BENCHMARK_PROMPT`)
- `convex/ai/analyzeHelpers.ts` — Internal queries: `getCreative`, `getPersonasByIds`
- `convex/auth.ts` — Better-Auth instance, `getAuthenticatedAppUser()` helper (try-catch wrapped, returns null if unauthenticated)
- `convex/tests.ts` — `createTest`/`completeTest`/`failTest` (internal), `listUserTests`/`getTest` (public)
- `convex/results.ts` — Save mutations (internal), get queries (public) for each result type

### AI Pipeline

Uses `@anthropic-ai/sdk` pointed at **OpenRouter** (`https://openrouter.ai/api/v1`), model `anthropic/claude-sonnet-4`. API key env var: `OPENROUTER_API_KEY`. Max tokens: 2048. Persona simulations run in parallel batches of 4.

### Authentication

Better-Auth with `@convex-dev/better-auth`. Email/password always enabled. Google OAuth conditional (only if `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are set).

- `src/lib/auth-client.ts` — No `baseURL` (same-origin `/api/auth/*` avoids CORS)
- `src/lib/auth-server.ts` — `convexBetterAuthNextJs()` with convexUrl/convexSiteUrl
- `src/hooks/useCurrentUser.ts` — `useCurrentUser()` and `useConvexAuth()` hooks
- No middleware — auth is client-side only (Better-Auth best practice)

### Path Alias

`@/` → `./src/` (configured in `tsconfig.json`).

## Design System

**Theme:** Pure black background, lime/yellow-green (`#C8FF00`) accent (named `amber` in tokens), white text. Defined in `src/app/globals.css` under `@theme {}` (Tailwind v4).

Key tokens: `--color-bg: #000`, `--color-surface-800: #080808`, `--color-surface-500: #1C1C1C`, `--color-amber: #C8FF00`, `--color-success: #5B9A6B`, `--color-danger: #D4645C`.

**Custom utilities:** `glow-amber`, `glow-amber-strong`, `gradient-text-amber`, `text-glow-amber`, `grid-bg`, `noise-overlay`.

**CTA gradient:** `from-[#FAFF00] via-[#C8FF00] to-[#00FF87]` with black text.

**Score colors:** green (`#5B9A6B`) ≥7, amber (`#C8FF00`) ≥5, red (`#D4645C`) <5.

**Fonts:** Instrument Sans (headings via `--font-heading`), DM Sans (body via `--font-body`) — Google Fonts in `src/app/layout.tsx`.

## Environment Variables

**`.env.local` (Next.js side):**
- `NEXT_PUBLIC_CONVEX_URL` — Convex cloud URL
- `NEXT_PUBLIC_CONVEX_SITE_URL` — Convex HTTP site URL
- `CONVEX_SITE_URL` — Same (server-side)
- `CONVEX_DEPLOYMENT` — Auto-set by `npx convex dev`

**Convex dashboard (`npx convex env set`):**
- `OPENROUTER_API_KEY` — OpenRouter API key for AI analysis
- `BETTER_AUTH_SECRET` — Generate with `openssl rand -base64 32`
- `SITE_URL` — Frontend URL (e.g., `http://localhost:3000` or production URL)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Optional Google OAuth

## Production

- **Frontend:** https://10xspend.vercel.app
- **Convex prod:** `hallowed-frog-658` deployment
- **Convex dev:** `quiet-cobra-437` deployment
- Deploy Convex: `npx convex deploy --yes`
- Deploy Vercel: `npx vercel --prod`
