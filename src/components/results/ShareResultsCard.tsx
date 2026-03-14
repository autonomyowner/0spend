'use client'

import { useState, useRef, useCallback } from 'react'
import { Share2, Download, Link2, Check, X } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface MetricScore {
  label: string
  value: number
  max: number
}

interface ShareResultsCardProps {
  testName: string
  overallScore?: number
  metrics?: MetricScore[]
  platform?: string
  personaCount: number
  open: boolean
  onClose: () => void
}

function getScoreColor(score: number): string {
  if (score >= 7) return '#5B9A6B'
  if (score >= 5) return '#C8FF00'
  return '#D4645C'
}

function getScoreLabel(score: number): string {
  if (score >= 8) return 'Excellent'
  if (score >= 7) return 'Strong'
  if (score >= 5) return 'Decent'
  return 'Needs Work'
}

export function ShareResultsCard({
  testName,
  overallScore,
  metrics,
  platform,
  personaCount,
  open,
  onClose,
}: ShareResultsCardProps) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const score = overallScore ?? 0
  const scoreColor = getScoreColor(score)
  const displayMetrics = (metrics || []).slice(0, 5)

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = window.location.href
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return

    const canvas = document.createElement('canvas')
    const scale = 2 // Retina
    const width = 600
    const height = 440
    canvas.width = width * scale
    canvas.height = height * scale
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.scale(scale, scale)

    // Background
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.roundRect(0, 0, width, height, 24)
    ctx.fill()

    // Subtle grid pattern
    ctx.strokeStyle = 'rgba(200, 255, 0, 0.03)'
    ctx.lineWidth = 0.5
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Border
    ctx.strokeStyle = 'rgba(28, 28, 28, 0.8)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(0.5, 0.5, width - 1, height - 1, 24)
    ctx.stroke()

    // Amber glow at top
    const glowGrad = ctx.createRadialGradient(width / 2, 0, 0, width / 2, 0, 200)
    glowGrad.addColorStop(0, 'rgba(200, 255, 0, 0.08)')
    glowGrad.addColorStop(1, 'rgba(200, 255, 0, 0)')
    ctx.fillStyle = glowGrad
    ctx.fillRect(0, 0, width, 200)

    // Brand header
    ctx.font = '600 11px "DM Sans", sans-serif'
    ctx.fillStyle = 'rgba(200, 255, 0, 0.6)'
    ctx.textAlign = 'left'
    ctx.fillText('0SPEND', 32, 40)

    ctx.font = '400 10px "DM Sans", sans-serif'
    ctx.fillStyle = 'rgba(119, 119, 119, 1)'
    ctx.textAlign = 'right'
    ctx.fillText(t.app.share.aiAdTesting, width - 32, 40)

    // Divider
    ctx.strokeStyle = 'rgba(28, 28, 28, 0.8)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(32, 54)
    ctx.lineTo(width - 32, 54)
    ctx.stroke()

    // Test name
    ctx.textAlign = 'left'
    ctx.font = '700 20px "Instrument Sans", "DM Sans", sans-serif'
    ctx.fillStyle = '#FFFFFF'
    const maxNameWidth = width - 64
    let displayName = testName
    while (ctx.measureText(displayName).width > maxNameWidth && displayName.length > 0) {
      displayName = displayName.slice(0, -1)
    }
    if (displayName !== testName) displayName += '...'
    ctx.fillText(displayName, 32, 84)

    // Platform + persona badges
    let badgeX = 32
    if (platform && platform !== 'generic') {
      ctx.font = '500 10px "DM Sans", sans-serif'
      const platformLabel = platform.replace('_', ' ').toUpperCase()
      const pWidth = ctx.measureText(platformLabel).width + 16
      ctx.fillStyle = 'rgba(200, 255, 0, 0.08)'
      ctx.beginPath()
      ctx.roundRect(badgeX, 94, pWidth, 22, 6)
      ctx.fill()
      ctx.strokeStyle = 'rgba(200, 255, 0, 0.15)'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.roundRect(badgeX, 94, pWidth, 22, 6)
      ctx.stroke()
      ctx.fillStyle = 'rgba(200, 255, 0, 0.7)'
      ctx.fillText(platformLabel, badgeX + 8, 109)
      badgeX += pWidth + 8
    }

    // Persona count badge
    ctx.font = '500 10px "DM Sans", sans-serif'
    const personaLabel = `${personaCount} personas`
    const pcWidth = ctx.measureText(personaLabel).width + 16
    ctx.fillStyle = 'rgba(28, 28, 28, 0.6)'
    ctx.beginPath()
    ctx.roundRect(badgeX, 94, pcWidth, 22, 6)
    ctx.fill()
    ctx.strokeStyle = 'rgba(28, 28, 28, 0.8)'
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.roundRect(badgeX, 94, pcWidth, 22, 6)
    ctx.stroke()
    ctx.fillStyle = 'rgba(119, 119, 119, 1)'
    ctx.fillText(personaLabel, badgeX + 8, 109)

    // Score circle
    const circleX = width - 90
    const circleY = 88
    const circleR = 36

    // Background ring
    ctx.strokeStyle = 'rgba(28, 28, 28, 1)'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2)
    ctx.stroke()

    // Score arc
    ctx.strokeStyle = scoreColor
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(
      circleX,
      circleY,
      circleR,
      -Math.PI / 2,
      -Math.PI / 2 + (Math.PI * 2 * score) / 10
    )
    ctx.stroke()
    ctx.lineCap = 'butt'

    // Glow effect on score arc
    ctx.shadowColor = scoreColor
    ctx.shadowBlur = 12
    ctx.strokeStyle = scoreColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(
      circleX,
      circleY,
      circleR,
      -Math.PI / 2,
      -Math.PI / 2 + (Math.PI * 2 * score) / 10
    )
    ctx.stroke()
    ctx.shadowBlur = 0

    // Score number
    ctx.textAlign = 'center'
    ctx.font = '700 22px "Instrument Sans", "DM Sans", sans-serif'
    ctx.fillStyle = scoreColor
    ctx.fillText(score.toFixed(1), circleX, circleY + 3)
    ctx.font = '400 9px "DM Sans", sans-serif'
    ctx.fillStyle = 'rgba(119, 119, 119, 1)'
    ctx.fillText('/ 10', circleX, circleY + 16)

    // Metrics section
    ctx.textAlign = 'left'
    const metricsStartY = 140

    // Divider
    ctx.strokeStyle = 'rgba(28, 28, 28, 0.8)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(32, metricsStartY)
    ctx.lineTo(width - 32, metricsStartY)
    ctx.stroke()

    // Metric rows
    const metricRowH = 42
    displayMetrics.forEach((m, i) => {
      const y = metricsStartY + 20 + i * metricRowH

      // Label
      ctx.font = '400 12px "DM Sans", sans-serif'
      ctx.fillStyle = 'rgba(119, 119, 119, 1)'
      ctx.fillText(m.label, 32, y + 6)

      // Value
      const mColor = getScoreColor(m.value)
      ctx.font = '600 14px "DM Sans", sans-serif'
      ctx.fillStyle = mColor
      ctx.textAlign = 'right'
      ctx.fillText(`${m.value.toFixed(1)}`, width - 32, y + 6)
      ctx.textAlign = 'left'

      // Bar background
      const barX = 32
      const barW = width - 64
      const barY = y + 14
      const barH = 4
      ctx.fillStyle = 'rgba(28, 28, 28, 1)'
      ctx.beginPath()
      ctx.roundRect(barX, barY, barW, barH, 2)
      ctx.fill()

      // Bar fill
      const fillW = barW * (m.value / m.max)
      ctx.fillStyle = mColor
      ctx.beginPath()
      ctx.roundRect(barX, barY, fillW, barH, 2)
      ctx.fill()

      // Bar glow
      ctx.shadowColor = mColor
      ctx.shadowBlur = 6
      ctx.fillStyle = mColor
      ctx.beginPath()
      ctx.roundRect(barX, barY, fillW, barH, 2)
      ctx.fill()
      ctx.shadowBlur = 0
    })

    // Footer
    const footerY = height - 40

    // Divider
    ctx.strokeStyle = 'rgba(28, 28, 28, 0.8)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(32, footerY - 12)
    ctx.lineTo(width - 32, footerY - 12)
    ctx.stroke()

    // Score label
    ctx.font = '600 11px "DM Sans", sans-serif'
    ctx.fillStyle = scoreColor
    ctx.textAlign = 'left'
    ctx.fillText(getScoreLabel(score).toUpperCase(), 32, footerY + 4)

    // URL
    ctx.font = '400 10px "DM Sans", sans-serif'
    ctx.fillStyle = 'rgba(119, 119, 119, 0.5)'
    ctx.textAlign = 'right'
    ctx.fillText('10xspend.vercel.app', width - 32, footerY + 4)

    // Download
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `${testName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-results.png`
    link.href = dataUrl
    link.click()
  }, [testName, score, scoreColor, displayMetrics, platform, personaCount, t])

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${testName} — ${score.toFixed(1)}/10`,
          text: `My ad scored ${score.toFixed(1)}/10 on 0spend AI Ad Testing! ${getScoreLabel(score)}.`,
          url: window.location.href,
        })
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink()
    }
  }, [testName, score, handleCopyLink])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative w-full max-w-lg rounded-2xl bg-surface-800/90 backdrop-blur-sm border border-surface-500/60 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold font-heading">{t.app.share.shareResults}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Card Preview */}
        <div
          ref={cardRef}
          className="relative rounded-2xl bg-black border border-surface-500/60 p-6 overflow-hidden mb-5"
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(200,255,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,1) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />

          {/* Amber glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(200,255,0,0.08) 0%, transparent 70%)',
            }}
          />

          <div className="relative">
            {/* Brand */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold text-amber/60 tracking-wider">0SPEND</span>
              <span className="text-[10px] text-text-muted">{t.app.share.aiAdTesting}</span>
            </div>

            <div className="h-px bg-surface-500/60 mb-4" />

            {/* Test name + Score */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold font-heading truncate mb-2">{testName}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {platform && platform !== 'generic' && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber/8 text-amber/70 border border-amber/15">
                      {platform.replace('_', ' ')}
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-600/60 text-text-muted border border-surface-500/60">
                    {personaCount} personas
                  </span>
                </div>
              </div>

              {/* Score circle */}
              <div className="relative w-[72px] h-[72px] flex-shrink-0">
                <svg width="72" height="72" className="-rotate-90">
                  <circle cx="36" cy="36" r="30" fill="none" stroke="#1C1C1C" strokeWidth={5} />
                  <circle
                    cx="36"
                    cy="36"
                    r="30"
                    fill="none"
                    stroke={scoreColor}
                    strokeWidth={5}
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 30}
                    strokeDashoffset={2 * Math.PI * 30 * (1 - score / 10)}
                    style={{
                      filter: `drop-shadow(0 0 6px ${scoreColor}40)`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold font-heading" style={{ color: scoreColor }}>
                    {score.toFixed(1)}
                  </span>
                  <span className="text-[9px] text-text-muted">/ 10</span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            {displayMetrics.length > 0 && (
              <>
                <div className="h-px bg-surface-500/60 mb-3" />
                <div className="space-y-2.5">
                  {displayMetrics.map((m) => {
                    const mColor = getScoreColor(m.value)
                    return (
                      <div key={m.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-text-muted">{m.label}</span>
                          <span className="text-xs font-semibold" style={{ color: mColor }}>
                            {m.value.toFixed(1)}
                          </span>
                        </div>
                        <div className="h-1 rounded-full bg-surface-500/50 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${(m.value / m.max) * 100}%`,
                              backgroundColor: mColor,
                              boxShadow: `0 0 8px ${mColor}40`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* Footer */}
            <div className="h-px bg-surface-500/60 mt-4 mb-3" />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold" style={{ color: scoreColor }}>
                {getScoreLabel(score).toUpperCase()}
              </span>
              <span className="text-[10px] text-text-faint">10xspend.vercel.app</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber/10 border border-amber/30 text-amber text-sm font-medium hover:bg-amber/15 transition-all duration-200 cursor-pointer"
          >
            <Download size={16} />
            {t.app.share.downloadCard}
          </button>
          <button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-700/60 border border-surface-500/60 text-text-primary text-sm font-medium hover:border-amber/20 hover:bg-amber/[0.02] transition-all duration-200 cursor-pointer"
          >
            {copied ? <Check size={16} className="text-success" /> : <Link2 size={16} />}
            {copied ? t.app.share.linkCopied : t.app.share.copyLink}
          </button>
          {'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="p-2.5 rounded-xl bg-surface-700/60 border border-surface-500/60 text-text-muted hover:text-amber hover:border-amber/20 transition-all duration-200 cursor-pointer"
              aria-label="Share"
            >
              <Share2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
