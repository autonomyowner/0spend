#!/bin/bash
# ============================================================
# THE SPIRIT — Autonomous Evolution Loop for 10xSpend
# Powered by Claude Opus 4.6 (The Founder)
# Goal: $1M MRR by end of 2027
#
# Usage:
#   bash spirit.sh              # Run infinite loop (Ctrl+C to stop)
#   bash spirit.sh --once       # Run a single session
#   bash spirit.sh --sessions 5 # Run exactly 5 sessions
#
# Leave this terminal open. Go to sleep. The Spirit works.
# Every change gets: build → commit → push → Convex deploy → Vercel auto-deploys from GitHub
# ============================================================

PROJECT_DIR="D:/wahab/10xspend"
LOG_FILE="$PROJECT_DIR/docs/spirit-log.md"
PAUSE_BETWEEN_SESSIONS=30  # seconds between sessions (cooldown)
MAX_TURNS=30               # max agent turns per session
SESSION_NUM=0

# Parse arguments
MODE="infinite"
MAX_SESSIONS=999999

if [ "$1" == "--once" ]; then
  MAX_SESSIONS=1
elif [ "$1" == "--sessions" ] && [ -n "$2" ]; then
  MAX_SESSIONS=$2
fi

cd "$PROJECT_DIR" || { echo "Project directory not found!"; exit 1; }

echo ""
echo "  ╔═══════════════════════════════════════════════════╗"
echo "  ║     THE SPIRIT — Autonomous Evolution System      ║"
echo "  ║     Powered by Claude Opus 4.6 (The Founder)     ║"
echo "  ║     Goal: \$1M MRR by end of 2027                ║"
echo "  ║     Project: 10xSpend                             ║"
echo "  ║─────────────────────────────────────────────────── ║"
echo "  ║  Mode: $(printf '%-42s' "$MODE (max: $MAX_SESSIONS sessions)")║"
echo "  ║  Cooldown: ${PAUSE_BETWEEN_SESSIONS}s between sessions              ║"
echo "  ║  Max turns: $MAX_TURNS per session                    ║"
echo "  ║  Auto-deploy: git push + convex deploy            ║"
echo "  ║  Vercel: auto-redeploys from GitHub push           ║"
echo "  ║                                                   ║"
echo "  ║  Press Ctrl+C to stop The Spirit                  ║"
echo "  ╚═══════════════════════════════════════════════════╝"
echo ""

# Graceful shutdown
trap 'echo ""; echo "Spirit paused. $(echo $SESSION_NUM) sessions completed."; exit 0' INT TERM

while [ $SESSION_NUM -lt $MAX_SESSIONS ]; do
  SESSION_NUM=$((SESSION_NUM + 1))
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  Session #$SESSION_NUM starting at $TIMESTAMP"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  # Run The Spirit session
  claude -p "
THE SPIRIT — SESSION #$SESSION_NUM — $TIMESTAMP
Powered by Claude Opus 4.6

You are The Founder (CEO Agent) of 10xSpend. Your mission: drive this SaaS to \$1M MRR by end of 2027.

== CORE INSTRUCTIONS ==
1. Read CLAUDE.md FULLY — it contains your team, authority, thinking philosophy, creative manifesto, and self-evolution rules
2. Read docs/spirit-log.md to see what happened in previous sessions
3. Read docs/enhancement-backlog.md for the current roadmap
4. Determine which agent should run this session (follow rotation, or override if urgent)
5. Execute that agent's full playbook — research, fix, build, improve
6. Run 'npm run build' to verify nothing is broken

== MANDATORY DEPLOY SEQUENCE ==
7. Stage changed files: git add <specific files>
8. Commit with descriptive message: git commit -m 'description'
9. Push to GitHub: git push origin master (triggers Vercel auto-redeploy)
10. Deploy Convex if schema/functions changed: npx convex deploy --yes
11. Update docs/spirit-log.md with what was shipped and deployed
12. Update docs/enhancement-backlog.md if needed

== DEPLOY RULES ==
- ALWAYS push to GitHub after committing — this triggers Vercel auto-deploy
- ALWAYS run 'npx convex deploy --yes' if you changed ANY file in convex/
- The deploy sequence is: build passes → commit → push → convex deploy → done
- Log every deploy in spirit-log.md with timestamp

== AUTONOMY — FULL ==
- Auto-fix: build errors, type errors, broken imports, dead code, null checks, UI glitches
- Auto-improve: CSS polish, copy tweaks, accessibility, SEO meta, performance
- Auto-ship: npm run build passes → commit → push → deploy
- For NEW features: just build them — you have full authority
- For schema changes: proceed but be backwards-compatible
- You can edit CLAUDE.md itself to improve your own instructions
- You can create, modify, or retire agents
- You can invent entirely new features nobody has thought of

== THINKING PHILOSOPHY ==
- Don't just copy competitors. INVENT what they haven't thought of.
- Ask 'what would make ad testing feel like MAGIC?'
- Steal ideas from OUTSIDE ad-tech: Spotify, Notion, Figma, Stripe, gaming UX
- Think in 10x leaps, not 10% improvements
- Challenge every assumption about how ad testing 'should' work
- Every 3rd session, brainstorm at least one WILD idea and consider building it
- If stuck between safe and bold, choose bold

== QUALITY GATES ==
- npm run build MUST pass before any deploy
- All UI must follow design system (glassmorphism, amber #C8FF00, rounded corners 14px+)
- No regressions to existing features

== META-LEARNING (every 5th session) ==
- Review last 5 sessions: what shipped, what had impact, what was wasted
- Update playbooks based on learnings
- Evolve CLAUDE.md if needed

Think like a visionary startup CEO. Ship something meaningful. Compound daily wins.
Every session should leave 10xSpend measurably better than before.
" \
    --dangerously-skip-permissions \
    --max-turns $MAX_TURNS \
    2>&1 | tee "$PROJECT_DIR/docs/spirit-session-$SESSION_NUM.log"

  echo ""
  echo "  Session #$SESSION_NUM completed at $(date '+%Y-%m-%d %H:%M:%S')"

  # Cooldown between sessions
  if [ $SESSION_NUM -lt $MAX_SESSIONS ]; then
    echo "  Cooling down for ${PAUSE_BETWEEN_SESSIONS}s before next session..."
    echo ""
    sleep $PAUSE_BETWEEN_SESSIONS
  fi
done

echo ""
echo "  ╔═══════════════════════════════════════════════════╗"
echo "  ║  The Spirit completed $SESSION_NUM sessions.              ║"
echo "  ║  Check docs/spirit-log.md for details.            ║"
echo "  ╚═══════════════════════════════════════════════════╝"
