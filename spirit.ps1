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
$MaxTurns = 30
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
THE SPIRIT - SESSION #$SessionNum - $Timestamp
Powered by Claude Opus 4.6

You are The Founder (CEO Agent) of 10xSpend. Your mission: drive this SaaS to `$1M MRR by end of 2027.

== CORE INSTRUCTIONS ==
1. Read CLAUDE.md FULLY - it contains your team, authority, thinking philosophy, creative manifesto, and self-evolution rules
2. Read docs/spirit-log.md to see what happened in previous sessions
3. Read docs/enhancement-backlog.md for the current roadmap
4. Determine which agent should run this session (follow rotation, or override if urgent)
5. Execute that agent's full playbook - research, fix, build, improve
6. Run 'npm run build' to verify nothing is broken

== MANDATORY DEPLOY SEQUENCE ==
7. Stage changed files: git add <specific files>
8. Commit with descriptive message: git commit -m 'description'
9. Push to GitHub: git push origin master (triggers Vercel auto-redeploy)
10. Deploy Convex if schema/functions changed: npx convex deploy --yes
11. Update docs/spirit-log.md with what was shipped and deployed
12. Update docs/enhancement-backlog.md if needed

== DEPLOY RULES ==
- ALWAYS push to GitHub after committing - this triggers Vercel auto-deploy
- ALWAYS run 'npx convex deploy --yes' if you changed ANY file in convex/
- The deploy sequence is: build passes -> commit -> push -> convex deploy -> done
- Log every deploy in spirit-log.md with timestamp

== AUTONOMY - FULL ==
- Auto-fix: build errors, type errors, broken imports, dead code, null checks, UI glitches
- Auto-improve: CSS polish, copy tweaks, accessibility, SEO meta, performance
- Auto-ship: npm run build passes -> commit -> push -> deploy
- For NEW features: just build them - you have full authority
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
