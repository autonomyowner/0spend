'use client'

import { Card } from '@/components/ui/Card'
import { AiDisclaimer } from '@/components/ui/AiDisclaimer'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { TrendingUp, TrendingDown, Minus, DollarSign, MousePointerClick, Eye, Target, BarChart3 } from 'lucide-react'

interface Prediction {
  metric: string
  value: number
  unit: string
  benchmarkAvg: number
  benchmarkTop: number
  percentile: number
  reasoning: string
}

interface PredictedPerformanceProps {
  predictions?: Prediction[]
  overallVerdict?: string
  spendEfficiency?: string
  confidence?: string
}

const metricIcons: Record<string, typeof TrendingUp> = {
  'CTR': MousePointerClick,
  'Conversion Rate': Target,
  'CPM': DollarSign,
  'ROAS': BarChart3,
  'Scroll-Stop Rate': Eye,
}

function getPercentileColor(percentile: number): string {
  if (percentile >= 75) return '#5B9A6B'
  if (percentile >= 50) return '#C8FF00'
  if (percentile >= 25) return '#D4645C'
  return '#D4645C'
}

function getPercentileLabel(percentile: number, t: any): string {
  if (percentile >= 90) return t.app.predictions.exceptional
  if (percentile >= 75) return t.app.predictions.aboveAvg
  if (percentile >= 50) return t.app.predictions.average
  if (percentile >= 25) return t.app.predictions.belowAvg
  return t.app.predictions.poor
}

function getTrendIcon(value: number, benchmarkAvg: number, metric: string) {
  // CPM: lower is better
  if (metric === 'CPM') {
    if (value < benchmarkAvg * 0.9) return <TrendingUp className="w-4 h-4 text-success" />
    if (value > benchmarkAvg * 1.1) return <TrendingDown className="w-4 h-4 text-danger" />
    return <Minus className="w-4 h-4 text-text-muted" />
  }
  // Others: higher is better
  if (value > benchmarkAvg * 1.1) return <TrendingUp className="w-4 h-4 text-success" />
  if (value < benchmarkAvg * 0.9) return <TrendingDown className="w-4 h-4 text-danger" />
  return <Minus className="w-4 h-4 text-text-muted" />
}

function formatValue(value: number, unit: string): string {
  if (unit === '$') return `$${value.toFixed(2)}`
  if (unit === 'x') return `${value.toFixed(1)}x`
  if (unit === '%') return `${value.toFixed(1)}%`
  return `${value}`
}

function PercentileBar({ percentile, color }: { percentile: number; color: string }) {
  return (
    <div className="relative h-1.5 w-full rounded-full bg-surface-500/50 overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${percentile}%`,
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}40`,
        }}
      />
      {/* Marker for 50th percentile */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-text-faint" />
    </div>
  )
}

export function PredictedPerformance({
  predictions,
  overallVerdict,
  spendEfficiency,
  confidence,
}: PredictedPerformanceProps) {
  const { t } = useLanguage()

  if (!predictions || predictions.length === 0) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <p className="text-sm text-text-muted">{t.app.predictions.loading}</p>
      </Card>
    )
  }

  const confidenceColors: Record<string, string> = {
    high: 'bg-success/15 text-success border-success/20',
    medium: 'bg-amber/10 text-amber border-amber/20',
    low: 'bg-surface-500/30 text-text-muted border-surface-500',
  }

  return (
    <div className="space-y-6">
      {/* Verdict card */}
      {overallVerdict && (
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-semibold font-heading mb-2">{t.app.predictions.verdict}</h3>
              <p className="text-sm text-text-primary leading-relaxed">{overallVerdict}</p>
              {spendEfficiency && (
                <p className="text-xs text-text-muted mt-3 leading-relaxed p-3 rounded-xl bg-surface-800/60 backdrop-blur-sm border border-surface-500/60">
                  <DollarSign className="w-3.5 h-3.5 inline-block mr-1 text-amber/70" />
                  {spendEfficiency}
                </p>
              )}
            </div>
            {confidence && (
              <span className={`text-[10px] px-2 py-1 rounded-lg border whitespace-nowrap ${confidenceColors[confidence] || confidenceColors.low}`}>
                {confidence} {t.app.predictions.confidence}
              </span>
            )}
          </div>
        </Card>
      )}

      {/* AI Disclaimer */}
      <AiDisclaimer text={t.app.disclaimers.predictionsWarning} severity="warning" />

      {/* Metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {predictions.map((p) => {
          const Icon = metricIcons[p.metric] || BarChart3
          const color = getPercentileColor(p.percentile)
          const label = getPercentileLabel(p.percentile, t)

          return (
            <Card key={p.metric} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <span className="text-xs font-medium text-text-muted">{p.metric}</span>
                </div>
                {getTrendIcon(p.value, p.benchmarkAvg, p.metric)}
              </div>

              <div className="mb-3">
                <span className="text-2xl font-bold font-heading" style={{ color }}>
                  {formatValue(p.value, p.unit)}
                </span>
              </div>

              {/* Benchmark comparison */}
              <div className="flex items-center gap-3 text-[10px] text-text-muted mb-3">
                <span>{t.app.predictions.avg}: {formatValue(p.benchmarkAvg, p.unit)}</span>
                <span className="text-text-faint">|</span>
                <span>{t.app.predictions.top}: {formatValue(p.benchmarkTop, p.unit)}</span>
              </div>

              {/* Percentile bar */}
              <div className="mb-2">
                <PercentileBar percentile={p.percentile} color={color} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color }}>{label}</span>
                <span className="text-[10px] text-text-faint">{p.percentile}{t.app.predictions.percentileSuffix}</span>
              </div>

              {/* Reasoning */}
              <p className="text-[11px] text-text-muted mt-3 leading-relaxed border-t border-surface-500/40 pt-3">
                {p.reasoning}
              </p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
