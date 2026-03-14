# ============================================================
# THE SPIRIT — Autonomous Evolution Loop for 10xSpend
# Powered by Claude Opus 4.6 (The Founder)
# Goal: $1M MRR by end of 2027
#
# Usage:
#   .\spirit.ps1              # Run infinite loop (Ctrl+C to stop)
#   .\spirit.ps1 -Once        # Run a single session
#   .\spirit.ps1 -Sessions 5  # Run exactly 5 sessions
#
# Leave this terminal open. Go to sleep. The Spirit works.
# ============================================================

param(
    [switch]$Once,
    [int]$Sessions = 0
)

$ProjectDir = "D:\wahab\10xspend"
$PauseBetweenSessions = 30
$MaxTurns = 75
$SessionNum = 0

if ($Once) {
    $MaxSessions = 1
} elseif ($Sessions -gt 0) {
    $MaxSessions = $Sessions
} else {
    $MaxSessions = 999999
}

Set-Location $ProjectDir

Write-Host ""
Write-Host "  +===================================================+" -ForegroundColor Yellow
Write-Host "  |     THE SPIRIT - Autonomous Evolution System       |" -ForegroundColor Yellow
Write-Host "  |     Powered by Claude Opus 4.6 (The Founder)      |" -ForegroundColor Yellow
Write-Host "  |     Goal: `$1M MRR by end of 2027                 |" -ForegroundColor Yellow
Write-Host "  |     Project: 10xSpend                              |" -ForegroundColor Yellow
Write-Host "  |---------------------------------------------------|" -ForegroundColor DarkGray
Write-Host "  |  Max sessions: $MaxSessions" -ForegroundColor Cyan
Write-Host "  |  Cooldown: ${PauseBetweenSessions}s between sessions" -ForegroundColor Cyan
Write-Host "  |  Max turns: $MaxTurns per session" -ForegroundColor Cyan
Write-Host "  |  Auto-deploy: git push + convex deploy             |" -ForegroundColor Green
Write-Host "  |  Vercel: auto-redeploys from GitHub push           |" -ForegroundColor Green
Write-Host "  |                                                    |" -ForegroundColor DarkGray
Write-Host "  |  Press Ctrl+C to stop The Spirit                   |" -ForegroundColor Red
Write-Host "  +===================================================+" -ForegroundColor Yellow
Write-Host ""

while ($SessionNum -lt $MaxSessions) {
    $SessionNum++
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

    Write-Host "==================================================" -ForegroundColor DarkGray
    Write-Host "  Session #$SessionNum starting at $Timestamp" -ForegroundColor White
    Write-Host "==================================================" -ForegroundColor DarkGray
    Write-Host ""

    $Prompt = @"
SESSION #$SessionNum | $Timestamp

You are The Founder of 10xSpend (AI ad testing SaaS). Goal: `$1M MRR by 2027. You have FULL autonomy.

STEP 1 - LOAD YOUR BRAIN (be fast, skim don't deep-read):
- Read docs/spirit-brain.md FIRST — this is your memory, your accumulated wisdom
- Skim CLAUDE.md for design system rules only (you already know the Spirit system)
- Read docs/spirit-log.md (last entry only) to see what was done last
- Read docs/enhancement-backlog.md for the roadmap

STEP 2 - PICK ONE THING AND BUILD IT:
Pick the single highest-impact improvement from the backlog or invent something new. Don't research for more than 2-3 turns. Spend most turns BUILDING.

Ideas if stuck:
- Build the next backlog item (A/B comparison, fatigue prediction, ad library)
- Improve AI prompts for richer analysis output
- Add a feature NO competitor has (chat with personas, auto-fix ads, shareable result cards)
- Fix bugs, polish UI, improve performance
- Steal an idea from Spotify/Notion/Figma and adapt it

STEP 3 - SHIP IT:
- npm run build (must pass)
- git add <files> && git commit -m 'description' && git push origin master
- npx convex deploy --yes (if convex/ files changed)

STEP 4 - LOG AND LEARN:
- Append to docs/spirit-log.md what you shipped
- Update docs/enhancement-backlog.md
- UPDATE docs/spirit-brain.md with learnings from this session:
  - What worked? Add to "What Works"
  - What failed or was slow? Add to "What Doesn't Work" or "Failed Experiments"
  - Discover a pattern? Add to "Patterns Discovered"
  - Learn something technical? Add to "Technical Learnings"
  - Have a new product idea? Add to "Ideas Parking Lot"
  - Improved a prompt? Note what changed in "Prompt Engineering Notes"
  - This is how you evolve. Your brain gets smarter every session.

RULES:
- Full autonomy: edit any file, add features, change schema, deploy
- Design system: black bg, amber #C8FF00, glassmorphism, rounded-xl, DM Sans / Instrument Sans
- Think outside the box. Invent. Don't just copy competitors.
- BE EFFICIENT. Don't waste turns reading files you don't need. Build fast, ship fast.
"@

    claude -p $Prompt --dangerously-skip-permissions --max-turns $MaxTurns 2>&1 | Tee-Object -FilePath "$ProjectDir\docs\spirit-session-$SessionNum.log"

    Write-Host ""
    Write-Host "  Session #$SessionNum completed at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Green

    if ($SessionNum -lt $MaxSessions) {
        Write-Host "  Cooling down for ${PauseBetweenSessions}s before next session..." -ForegroundColor DarkGray
        Write-Host ""
        Start-Sleep -Seconds $PauseBetweenSessions
    }
}

Write-Host ""
Write-Host "  +===================================================+" -ForegroundColor Yellow
Write-Host "  |  The Spirit completed $SessionNum sessions.                 |" -ForegroundColor Yellow
Write-Host "  |  Check docs/spirit-log.md for details.             |" -ForegroundColor Yellow
Write-Host "  +===================================================+" -ForegroundColor Yellow
