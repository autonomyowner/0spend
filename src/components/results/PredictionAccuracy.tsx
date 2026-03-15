'use client'

import { Card } from '@/components/ui/Card'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { CheckCircle2 } from 'lucide-react'

interface PredictionResult {
  metric: string
  value: number
  unit: string
}

interface ActualResult {
  metric: string
  value: number
  unit: string
}

interface PredictionAccuracyProps {
  predictions: PredictionResult[]
  actuals: ActualResult[]
  totalSpend?: number
  totalRevenue?: number
  impressions?: number
  notes?: string
}

function formatValue(value: number, unit: string): string {
  if (unit === '$') return `$${value.toFixed(2)}`
  if (unit === 'x') return `${value.toFixed(1)}x`
  if (unit === '%') return `${value.toFixed(1)}%`
  return `${value}`
}

function getAccuracyColor(diffPercent: number): string {
  const abs = Math.abs(diffPercent)
  if (abs <= 10) return '#5B9A6B'
  if (abs <= 25) return '#C8FF00'
  return '#D4645C'
}

export function PredictionAccuracy({
  predictions,
  actuals,
  totalSpend,
  totalRevenue,
  impressions,
  notes,
}: PredictionAccuracyProps) {
  const { t } = useLanguage()

  const actualMap = new Map(actuals.map((a) => [a.metric, a]))

  const comparisons = predictions
    .filter((p) => actualMap.has(p.metric))
    .map((p) => {
      const actual = actualMap.get(p.metric)!
      const diff = actual.value - p.value
      const diffPercent = p.value !== 0 ? (diff / p.value) * 100 : 0
      return {
        metric: p.metric,
        predicted: p.value,
        actual: actual.value,
        unit: p.unit,
        diff,
        diffPercent,
      }
    })

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-4 h-4 text-success" />
        <h4 className="text-sm font-semibold font-heading">{t.app.actualResults.submitted}</h4>
      </div>

      <div className="space-y-3">
        {comparisons.map((c) => {
          const color = getAccuracyColor(c.diffPercent)
          const absDiff = Math.abs(c.diffPercent)

          return (
            <div
              key={c.metric}
              className="flex items-center gap-4 p-3 rounded-xl bg-surface-800/40 border border-surface-500/30"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{c.metric}</p>
                <div className="flex items-baseline gap-3">
                  <div>
                    <span className="text-[10px] text-text-faint">{t.app.actualResults.predicted}: </span>
                    <span className="text-sm text-text-muted">{formatValue(c.predicted, c.unit)}</span>
                  </div>
                  <span className="text-text-faint">&rarr;</span>
                  <div>
                    <span className="text-[10px] text-text-faint">{t.app.actualResults.actual}: </span>
                    <span className="text-sm font-semibold text-text-primary">{formatValue(c.actual, c.unit)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span
                  className="text-sm font-bold font-heading"
                  style={{ color }}
                >
                  {absDiff <= 10
                    ? t.app.actualResults.close
                    : `${absDiff.toFixed(0)}% ${t.app.actualResults.off}`}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Optional campaign data */}
      {(totalSpend || totalRevenue || impressions) && (
        <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-surface-500/30">
          {totalSpend != null && (
            <div>
              <p className="text-[10px] text-text-faint">{t.app.actualResults.totalSpend}</p>
              <p className="text-sm text-text-primary">${totalSpend.toLocaleString()}</p>
            </div>
          )}
          {totalRevenue != null && (
            <div>
              <p className="text-[10px] text-text-faint">{t.app.actualResults.totalRevenue}</p>
              <p className="text-sm text-text-primary">${totalRevenue.toLocaleString()}</p>
            </div>
          )}
          {impressions != null && (
            <div>
              <p className="text-[10px] text-text-faint">{t.app.actualResults.impressions}</p>
              <p className="text-sm text-text-primary">{impressions.toLocaleString()}</p>
            </div>
          )}
        </div>
      )}

      {notes && (
        <div className="mt-3 pt-3 border-t border-surface-500/30">
          <p className="text-[10px] text-text-faint mb-1">{t.app.actualResults.notes}</p>
          <p className="text-xs text-text-muted">{notes}</p>
        </div>
      )}
    </Card>
  )
}
