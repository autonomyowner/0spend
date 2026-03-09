'use client'

import { ProgressBar } from '@/components/ui/ProgressBar'
import { Card } from '@/components/ui/Card'

interface MetricScore {
  label: string
  value: number
  max: number
}

interface ScoreBreakdownProps {
  metrics?: MetricScore[]
  overallScore?: number
}

export function ScoreBreakdown({ metrics, overallScore }: ScoreBreakdownProps) {
  const displayMetrics = metrics || []
  const overall = overallScore ?? (displayMetrics.length > 0
    ? displayMetrics.reduce((sum, m) => sum + m.value, 0) / displayMetrics.length
    : 0)

  if (displayMetrics.length === 0) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <p className="text-sm text-text-muted">Scores loading...</p>
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
            <span className="text-xs text-text-muted">/ 10</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold font-heading mb-1">Overall Score</h3>
          <p className="text-sm text-text-muted">
            {overall >= 8 ? 'Excellent — ship it!' : overall >= 7 ? 'Strong creative with minor improvements.' : overall >= 5 ? 'Decent but needs work.' : 'Significant improvements needed.'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {displayMetrics.map((m) => (
          <ProgressBar
            key={m.label}
            label={m.label}
            value={m.value}
            max={m.max}
          />
        ))}
      </div>
    </Card>
  )
}
