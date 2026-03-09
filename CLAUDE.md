# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start Next.js dev server with Turbopack (http://localhost:3000)
npm run build        # Next.js production build (type-check + static generation)
npm run start        # Serve production build
npx convex dev       # Start Convex dev server (generates types, syncs schema)
npx convex deploy    # Deploy Convex functions to production
```

No test runner, linter, or formatter is configured.

## Architecture

**Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS 4 + Convex (real-time DB) + Better-Auth + Claude Sonnet 4.6

### Routing (App Router — `src/app/`)

```
/                          → Landing page (9 composed sections)
/sign-in                   → Sign in (email + Google OAuth)
/sign-up                   → Sign up (email + Google OAuth)
/app                       → Dashboard (auth-protected)
/app/analyze               → Upload creative → select personas → run AI analysis
/app/personas              → Persona grid + create custom
/app/results               → All completed test results
/app/results/[testId]      → Tabbed results detail (overview, feedback, debate, heatmap, benchmarks)
/api/auth/[...all]         → Better-Auth API routes
```

Auth-protected routes use `src/app/app/layout.tsx` which checks `useConvexAuth()` and redirects to `/sign-in` if unauthenticated.

### Component Organization

- `src/components/ui/` — Reusable primitives (Button, Card, Input, Modal, Badge, Tabs, DropZone, ProgressBar, ScoreGauge, Avatar)
- `src/components/landing/` — Landing page sections (Navbar, Hero, HowItWorks, FeaturesGrid, DemoPreview, SocialProof, Pricing, CTA, Footer)
- `src/components/layout/` — Sidebar, TopBar (used by `src/app/app/layout.tsx`)
- `src/components/dashboard/` — StatsRow, ScoreChart, RecentTests, QuickActions (all accept data props)
- `src/components/analysis/` — UploadZone, FormatSelector
- `src/components/personas/` — PersonaGrid, PersonaCard, CreatePersonaModal
- `src/components/results/` — ScoreBreakdown, PersonaFeedbackCard, AgentDebateView, AttentionHeatmap, FixItSuggestions, CompetitiveBenchmark (all accept data props)
- `src/components/providers/` — ConvexClientProvider (wraps ConvexBetterAuthProvider)

### Data Layer — Convex

Real-time database with 9 tables defined in `convex/schema.ts`:

| Table | Purpose |
|-------|---------|
| `users` | User accounts (email, name, plan) |
| `personas` | AI personas (preset + custom, traits, role) |
| `creatives` | Uploaded ad creatives (storageId, metadata) |
| `tests` | Analysis test runs (status, overallScore, metrics) |
| `personaFeedbacks` | Per-persona AI feedback (score, sentiment, reaction) |
| `debates` | Agent debate exchanges (buyer vs skeptic) |
| `heatmaps` | Attention zones with positions |
| `fixIts` | AI fix-it suggestions with impact levels |
| `benchmarks` | Competitive benchmark entries |

**Convex files:**
- `convex/schema.ts` — Full schema with indexes
- `convex/users.ts` — `viewer` query, `ensureUser` mutation
- `convex/creatives.ts` — Upload URL generation, save, list, get URL
- `convex/tests.ts` — Create/complete/fail (internal), list/get (public)
- `convex/results.ts` — Save mutations (internal), get queries (public) for all result types
- `convex/personas.ts` — List (presets + custom), create, getByIds
- `convex/dashboard.ts` — Stats, recentTests, scoreTrend aggregation queries
- `convex/seed.ts` — Seed 10 preset personas
- `convex/ai/analyze.ts` — Main AI analysis pipeline (Convex action)
- `convex/ai/analyzeHelpers.ts` — Internal queries for the pipeline
- `convex/ai/prompts.ts` — 7 prompt templates for Claude

### AI Analysis Pipeline (`convex/ai/analyze.ts`)

Single Convex action that runs the full analysis:
1. Fetch creative image → convert to base64
2. Create test record (status: "running")
3. Vision extraction (Claude with image)
4. Metric scoring (5 metrics, 1-10 scale)
5. Persona simulations (parallel, batches of 4)
6. Agent debate (buyer vs skeptic with verdict)
7. Fix-it suggestions (with image)
8. Attention heatmap (with image)
9. Benchmarks generation
10. Mark test complete with overall score

### Authentication — Better-Auth + Convex

- `convex/auth.ts` — Better-Auth instance with email + Google OAuth, `getAuthenticatedAppUser()` helper (try-catch wrapped)
- `convex/http.ts` — HTTP router with auth routes
- `src/lib/auth-client.ts` — Frontend auth client (no baseURL, uses same-origin `/api/auth/*`)
- `src/lib/auth-server.ts` — Server-side auth utilities
- `src/hooks/useCurrentUser.ts` — `useCurrentUser()` and `useConvexAuth()` hooks

### Utilities

- `src/lib/cn.ts` — `clsx` + `tailwind-merge` wrapper
- `src/lib/constants.ts` — BRAND config, NAV_LINKS, APP_NAV, PRICING_TIERS
- `src/hooks/useMediaQuery.ts` — responsive breakpoint hook
- `src/hooks/useLocalStorage.ts` — persistent state hook
- `src/hooks/useUploadCreative.ts` — Convex file upload hook

### Path Alias

`@/` maps to `./src/` (configured in `tsconfig.json`).

## Design System

**Theme:** Pure black background with yellow-green gradient accents, white text.

The theme is defined as CSS custom properties in `src/app/globals.css` under `@theme {}` (Tailwind v4 syntax). Key tokens:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#000000` | Page background |
| `--color-surface-800` | `#080808` | Card/panel backgrounds |
| `--color-surface-500` | `#1C1C1C` | Borders |
| `--color-amber` | `#C8FF00` | Brand accent (lime yellow-green) |
| `--color-text-primary` | `#FFFFFF` | Body text |
| `--color-text-muted` | `#777777` | Secondary text |

Despite the variable name `amber`, the actual color is lime/yellow-green (`#C8FF00`). All components reference this via Tailwind classes like `text-amber`, `bg-amber/10`, `border-amber/20`.

**Custom Tailwind utilities** (defined in `globals.css`): `glow-amber`, `glow-amber-strong`, `gradient-text-amber`, `text-glow-amber`, `grid-bg`, `noise-overlay`.

**Primary CTA buttons** use a gradient: `from-[#FAFF00] via-[#C8FF00] to-[#00FF87]` with black text.

**Score color coding:** green (`#5B9A6B`) for >=7, amber (`#C8FF00`) for >=5, red (`#D4645C`) for <5.

**Charts** (Recharts): ScoreChart uses area chart, CompetitiveBenchmark uses bar chart.

**Fonts:** Instrument Sans (headings), DM Sans (body) — loaded via Google Fonts in `src/app/layout.tsx`.

## Environment Variables

**`.env.local` (Next.js):**
- `NEXT_PUBLIC_CONVEX_URL` — Convex deployment URL
- `NEXT_PUBLIC_CONVEX_SITE_URL` — Convex HTTP actions URL
- `CONVEX_SITE_URL` — Same as above (server-side)

**Convex dashboard env vars:**
- `BETTER_AUTH_SECRET` — Auth secret key
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth
- `SITE_URL` — Frontend URL (e.g., `http://localhost:3000`)
- `ANTHROPIC_API_KEY` — Claude API key for AI analysis

## Setup

```bash
npm install
npx convex dev --once --configure=new   # First time: create Convex project + generate types
npx convex env set ANTHROPIC_API_KEY "sk-..."
npx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
npx convex env set SITE_URL "http://localhost:3000"
# Update .env.local with real Convex URLs from the output above
npm run dev   # In one terminal
npx convex dev  # In another terminal
```
