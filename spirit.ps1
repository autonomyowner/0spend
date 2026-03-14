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
# To force stop: Ctrl+C then run:  Get-Process *claude* | Stop-Process -Force
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

# Cleanup function
function Stop-Spirit {
    Write-Host ""
    Write-Host "  Stopping Spirit... killing claude..." -ForegroundColor Red
    Get-Process | Where-Object { $_.ProcessName -like "*claude*" -or $_.ProcessName -like "*node*claude*" } | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "  Spirit stopped after $SessionNum sessions." -ForegroundColor Yellow
    Write-Host "  Check docs/spirit-log.md for details." -ForegroundColor DarkGray
    exit 0
}

# Register cleanup on script exit
Register-EngineEvent PowerShell.Exiting -Action { Stop-Spirit } -ErrorAction SilentlyContinue | Out-Null

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
Write-Host "  |  Ctrl+C to stop. If stuck run:                     |" -ForegroundColor Red
Write-Host "  |  Get-Process *claude* | Stop-Process -Force        |" -ForegroundColor Red
Write-Host "  +===================================================+" -ForegroundColor Yellow
Write-Host ""

try {
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
- Read docs/spirit-brain.md FIRST - this is your memory
- Skim CLAUDE.md for design system rules only
- Read docs/spirit-log.md (last entry only)
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
  - What worked? What failed? New patterns? New ideas?
  - This is how you evolve. Your brain gets smarter every session.

RULES:
- Full autonomy: edit any file, add features, change schema, deploy
- Design system: black bg, amber #C8FF00, glassmorphism, rounded-xl, DM Sans / Instrument Sans
- Think outside the box. Invent. Don't just copy competitors.
- BE EFFICIENT. Build fast, ship fast.
"@

        # Run claude directly with pipe (this works on Windows)
        claude -p $Prompt --dangerously-skip-permissions --max-turns $MaxTurns 2>&1 | Tee-Object -FilePath "$ProjectDir\docs\spirit-session-$SessionNum.log"

        Write-Host ""
        Write-Host "  Session #$SessionNum completed at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Green

        if ($SessionNum -lt $MaxSessions) {
            Write-Host "  Cooling down for ${PauseBetweenSessions}s... (Ctrl+C to stop)" -ForegroundColor DarkGray
            Start-Sleep -Seconds $PauseBetweenSessions
            Write-Host ""
        }
    }
}
finally {
    # Always cleanup claude processes on exit
    Get-Process | Where-Object { $_.ProcessName -like "*claude*" } | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host ""
    Write-Host "  +===================================================+" -ForegroundColor Yellow
    Write-Host "  |  Spirit stopped. $SessionNum sessions ran.                 |" -ForegroundColor Yellow
    Write-Host "  |  Check docs/spirit-log.md for details.             |" -ForegroundColor Yellow
    Write-Host "  +===================================================+" -ForegroundColor Yellow
}
