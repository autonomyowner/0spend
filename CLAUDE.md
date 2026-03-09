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

**Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS 4 + Convex + Better-Auth + Claude Sonnet 4 + Gemini 2.5 Flash (via OpenRouter)

### Routing (`src/app/`)

```
/                          → Landing page (9 composed sections)
/sign-in                   → Sign in (email + optional Google OAuth)
/sign-up                   → Sign up (email + optional Google OAuth)
/app                       → Dashboard (auth-protected)
/app/analyze               → Upload creative (image/video/landing page) → select personas → run AI analysis
/app/personas              → Persona grid + create custom
/app/results               → All completed test results
/app/results/[testId]      → Tabbed results (overview, feedback, debate, heatmap, benchmarks)
/api/auth/[...all]         → Better-Auth API routes
```

Auth protection: `src/app/app/layout.tsx` checks `useConvexAuth()` and redirects to `/sign-in`.

### Data Layer — Convex

9 tables in `convex/schema.ts`: `users`, `personas`, `creatives`, `tests`, `personaFeedbacks`, `debates`, `heatmaps`, `fixIts`, `benchmarks`. All result tables indexed by `testId`.

Key Convex files:
- `convex/ai/analyze.ts` — `runAnalysis` (image) + `runVideoAnalysis` (video) actions: full AI pipeline (vision → metrics → personas → debate → fix-its → heatmap → benchmarks)
- `convex/ai/gemini.ts` — Gemini 2.5 Flash via OpenRouter (`callGemini`, `callGeminiJSON`). Used for video analysis (supports `video_url` with base64 data URLs). Videos must be fetched from Convex storage and converted to `data:video/mp4;base64,...` format — OpenRouter Gemini doesn't accept direct URLs.
- `convex/ai/screenshot.ts` — `captureScreenshot` action: captures landing page via ScreenshotOne API → uploads to Convex storage → creates creative record. Then normal image analysis runs on it.
- `convex/ai/prompts.ts` — Image prompts + video-specific prompts (`VIDEO_VISION_EXTRACTION_PROMPT`, `VIDEO_METRIC_SCORING_PROMPT`, `videoPersonaSimulationPrompt`, `VIDEO_HEATMAP_PROMPT`). Text-only steps (debate, fix-its, benchmarks) reuse image prompts.
- `convex/ai/utils.ts` — Shared `parseJSON<T>()` utility (used by both Claude and Gemini callers)
- `convex/ai/analyzeHelpers.ts` — Internal queries: `getCreative`, `getPersonasByIds`
- `convex/auth.ts` — Better-Auth instance, `getAuthenticatedAppUser()` helper (try-catch wrapped, returns null if unauthenticated)
- `convex/tests.ts` — `createTest`/`completeTest`/`failTest` (internal), `listUserTests`/`getTest` (public)
- `convex/results.ts` — Save mutations (internal), get queries (public) for each result type

### AI Pipeline

**Image analysis:** Uses `@anthropic-ai/sdk` pointed at **OpenRouter** (`https://openrouter.ai/api`), model `anthropic/claude-sonnet-4`. Max tokens: 2048.

**Video analysis:** Uses `google/gemini-2.5-flash` via OpenRouter REST API (`/api/v1/chat/completions`). Visual steps (vision, metrics, personas, heatmap) use Gemini with video. Text-only steps (debate, fix-its, benchmarks) use Claude for better reasoning. Video heatmap has fallback zones if Gemini returns empty response. Videos are sent as base64 data URLs.

**Landing page analysis:** ScreenshotOne API captures full-page screenshot → stored in Convex → analyzed as image via normal `runAnalysis`.

API key env var: `OPENROUTER_API_KEY` (works for both Claude and Gemini). Persona simulations run in parallel batches of 4.

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

### Color Palette

**Surfaces (dark to light):**
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` / `--color-surface-900` | `#000000` | Page background |
| `--color-surface-800` | `#080808` | Sidebar, deep card base |
| `--color-surface-700` | `#0E0E0E` | Card backgrounds |
| `--color-surface-600` | `#141414` | Hover states |
| `--color-surface-500` | `#1C1C1C` | Borders, dividers |

**Accent:**
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-amber` | `#C8FF00` | Primary accent (lime-green) |
| `--color-amber-glow` | `#C8FF0040` | Glow shadows (25% opacity) |
| `--color-amber-dim` | `#C8FF0015` | Subtle backgrounds (8% opacity) |

**CTA Gradient:** `from-[#FAFF00] via-[#C8FF00] to-[#00FF87]` with black text.

**Semantic:**
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#5B9A6B` | Score ≥7, positive states |
| `--color-danger` | `#D4645C` | Score <5, errors, destructive |

**Score colors:** green (`#5B9A6B`) ≥7, amber (`#C8FF00`) ≥5, red (`#D4645C`) <5.

**Text:**
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-text-primary` | `#FFFFFF` | Headings, body text |
| `--color-text-muted` | `#777777` | Secondary/descriptive text |
| `--color-text-faint` | `#3A3A3A` | Disabled, placeholder |

### Typography

| Role | Font | CSS Variable |
|------|------|-------------|
| Headings | **Instrument Sans** | `--font-heading` |
| Body | **DM Sans** | `--font-body` |

Google Fonts loaded in `src/app/layout.tsx`.

### UI Patterns

**Custom utilities:** `glow-amber`, `glow-amber-strong`, `gradient-text-amber`, `text-glow-amber`, `grid-bg`, `noise-overlay`.

**Animations:** `animate-fade-up`, `animate-fade-in`, `animate-score-fill`, `animate-slide-in-right` — all use `cubic-bezier(0.16, 1, 0.3, 1)` easing. Scroll-reveal via `.reveal` class + `useReveal()` hook (`src/hooks/useReveal.ts`).

**Glassmorphism pattern:** `bg-surface-800/60 backdrop-blur-sm border border-surface-500/60` for cards. Use `/50` or `/60` opacity suffixes on backgrounds and borders — never fully opaque.

**Hover states:** Subtle amber glow overlay (`bg-amber/[0.02]`) + icon color shift to `text-amber/80` with `duration-300`.

**Auth-aware CTAs:** Landing page CTAs (Hero, Pricing, CTA section) check `authClient.useSession()` and show "Go to Dashboard" linking to `/app` when logged in.

**Mobile bottom nav:** `src/components/layout/BottomNav.tsx` — fixed bottom nav bar on mobile (`lg:hidden`) replacing Quick Actions. Layout adds `pb-28 lg:pb-6` padding.

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
- `SCREENSHOTONE_API_KEY` — For landing page screenshot capture

## Production

- **Frontend:** https://10xspend.vercel.app
- **Convex prod:** `hallowed-frog-658` deployment
- **Convex dev:** `quiet-cobra-437` deployment
- Deploy Convex: `npx convex deploy --yes`
- Deploy Vercel: `npx vercel --prod`
