'use client'

import { ProgressBar } from '@/components/ui/ProgressBar'
import { Card } from '@/components/ui/Card'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface MetricScore {
  label: string
  value: number
  max: number
  confidence?: string
}

interface ScoreBreakdownProps {
  metrics?: MetricScore[]
  overallScore?: number
}

function ConfidenceBadge({ confidence }: { confidence?: string }) {
  if (!confidence) return null
  const colors: Record<string, string> = {
    high: 'bg-success/15 text-success border-success/20',
    medium: 'bg-amber/10 text-amber border-amber/20',
    low: 'bg-surface-500/30 text-text-muted border-surface-500',
  }
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded-md border ${colors[confidence] || colors.low}`}>
      {confidence}
    </span>
  )
}

export function ScoreBreakdown({ metrics, overallScore }: ScoreBreakdownProps) {
  const { t } = useLanguage()
  const displayMetrics = metrics || []
  const overall = overallScore ?? (displayMetrics.length > 0
    ? displayMetrics.reduce((sum, m) => sum + m.value, 0) / displayMetrics.length
    : 0)

  if (displayMetrics.length === 0) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <p className="text-sm text-text-muted">{t.app.scoreBreakdown.loading}</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-6 mb-6">
        {/* Big score */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg width="112" height="112" className="-rotate-90">
            <circle cx="56" cy="56" r="48" fill="none" stroke="#1C1C1C" strokeWidth={8} />
            <circle
              cx="56"
              cy="56"
              r="48"
              fill="none"
              stroke={overall >= 7 ? '#5B9A6B' : overall >= 5 ? '#C8FF00' : '#D4645C'}
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 48}
              strokeDashoffset={2 * Math.PI * 48 * (1 - overall / 10)}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-heading" style={{ color: overall >= 7 ? '#5B9A6B' : overall >= 5 ? '#C8FF00' : '#D4645C' }}>
              {overall.toFixed(1)}
            </span>
            <span className="text-xs text-text-muted">{t.app.scoreBreakdown.outOf}</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold font-heading mb-1">{t.app.scoreBreakdown.overallScore}</h3>
          <p className="text-sm text-text-muted">
            {overall >= 8 ? t.app.scoreBreakdown.excellent : overall >= 7 ? t.app.scoreBreakdown.strong : overall >= 5 ? t.app.scoreBreakdown.decent : t.app.scoreBreakdown.significant}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {displayMetrics.map((m) => (
          <div key={m.label} className="flex items-center gap-2">
            <div className="flex-1">
              <ProgressBar
                label={m.label}
                value={m.value}
                max={m.max}
              />
            </div>
            <ConfidenceBadge confidence={m.confidence} />
          </div>
        ))}
      </div>
    </Card>
  )
}
