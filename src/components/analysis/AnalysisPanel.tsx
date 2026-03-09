import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'

interface AnalysisPanelProps {
  running: boolean
  done: boolean
}

const metrics = [
  { label: 'Hook Strength', value: 8.5 },
  { label: 'Visual Clarity', value: 7.2 },
  { label: 'CTA Power', value: 9.1 },
  { label: 'Brand Alignment', value: 7.8 },
  { label: 'Emotional Impact', value: 6.9 },
]

export function AnalysisPanel({ running, done }: AnalysisPanelProps) {
  if (!running && !done) return null

  return (
    <div className="rounded-xl bg-surface-700 border border-surface-500 p-6">
      {running && !done && (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="w-10 h-10 rounded-full border-2 border-amber border-t-transparent animate-spin" />
          <p className="text-sm text-text-primary font-medium">Analyzing with 8 AI personas...</p>
          <p className="text-xs text-text-muted">This usually takes 5-10 seconds</p>
        </div>
      )}

      {done && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold font-heading">Quick Results</h3>
            <Badge variant="success">8.2 / 10</Badge>
          </div>

          <div className="space-y-3">
            {metrics.map((m) => (
              <ProgressBar
                key={m.label}
                label={m.label}
                value={m.value}
                max={10}
              />
            ))}
          </div>

          <div className="rounded-xl bg-surface-600 border border-surface-500 p-4">
            <p className="text-xs font-semibold text-amber mb-1">Top Fix-It</p>
            <p className="text-sm text-text-primary">
              Headline could be 40% shorter. Try: <span className="text-amber">"50% Off — Today Only"</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
