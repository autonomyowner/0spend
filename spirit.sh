#!/bin/bash
# ============================================================
# THE SPIRIT — Autonomous Evolution Loop for 10xSpend
# Goal: $1M MRR by end of 2027
#
# Usage:
#   bash spirit.sh              # Run infinite loop (Ctrl+C to stop)
#   bash spirit.sh --once       # Run a single session
#   bash spirit.sh --sessions 5 # Run exactly 5 sessions
#
# Leave this terminal open. Go to sleep. The Spirit works.
# ============================================================

PROJECT_DIR="D:/wahab/10xspend"
LOG_FILE="$PROJECT_DIR/docs/spirit-log.md"
PAUSE_BETWEEN_SESSIONS=30  # seconds between sessions (cooldown)
MAX_TURNS=25               # max agent turns per session
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
echo "  ║         THE SPIRIT — Autonomous Evolution         ║"
echo "  ║         Goal: \$1M MRR by end of 2027             ║"
echo "  ║         Project: 10xSpend                         ║"
echo "  ║─────────────────────────────────────────────────── ║"
echo "  ║  Mode: $(printf '%-42s' "$MODE (max: $MAX_SESSIONS sessions)")║"
echo "  ║  Cooldown: ${PAUSE_BETWEEN_SESSIONS}s between sessions              ║"
echo "  ║  Max turns: $MAX_TURNS per session                    ║"
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

You are The Founder (CEO Agent) of 10xSpend. Your mission: drive this SaaS to \$1M MRR by end of 2027.

INSTRUCTIONS:
1. Read CLAUDE.md to understand the full Spirit system, your team, and your authority
2. Read docs/spirit-log.md to see what happened in previous sessions
3. Read docs/enhancement-backlog.md for the current roadmap
4. Determine which agent should run this session (follow rotation, or override if urgent)
5. Execute that agent's full playbook — research, fix, build, improve
6. Run 'npm run build' to verify nothing is broken
7. If build passes: commit changes with descriptive message, push to git
8. If build passes and changes are significant: deploy (npx convex deploy --yes)
9. Update docs/spirit-log.md with a detailed entry for this session
10. Update docs/enhancement-backlog.md if needed

AUTONOMY RULES:
- Auto-fix: build errors, type errors, broken imports, dead code, null checks, UI glitches
- Auto-improve: CSS polish, copy tweaks, accessibility, SEO meta, performance
- Auto-ship: if npm run build passes → commit → push → deploy
- For NEW features: just build them — you have full authority
- For schema changes: proceed but be backwards-compatible

QUALITY GATES:
- npm run build MUST pass before any deploy
- All UI must follow design system (glassmorphism, amber #C8FF00, rounded corners 14px+)
- No regressions to existing features

Think like a startup CEO. Every action should move the MRR needle.
Ship something meaningful every session. Compound daily wins.
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
