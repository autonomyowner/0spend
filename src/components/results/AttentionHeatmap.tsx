import { cn } from '@/lib/cn'
import { Card } from '@/components/ui/Card'

interface HeatmapZone {
  label: string
  attention: number
  x: number
  y: number
  w: number
  h: number
}

interface AttentionHeatmapProps {
  zones?: HeatmapZone[]
}

function getHeatColor(attention: number) {
  if (attention >= 80) return 'bg-danger/40 border-danger/30'
  if (attention >= 50) return 'bg-amber/30 border-amber/20'
  if (attention >= 25) return 'bg-success/20 border-success/15'
  return 'bg-surface-600 border-surface-500'
}

export function AttentionHeatmap({ zones }: AttentionHeatmapProps) {
  if (!zones || zones.length === 0) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <p className="text-sm text-text-muted">Heatmap loading...</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-sm font-semibold font-heading mb-4">Attention Heatmap</h3>
      <p className="text-xs text-text-muted mb-6">
        Zone-based attention analysis showing where viewers focus. Red = high attention, yellow = moderate, green = low.
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Heatmap */}
        <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-xl bg-surface-700 border border-surface-500 overflow-hidden">
          {zones.map((zone) => (
            <div
              key={zone.label}
              className={cn(
                'absolute rounded-lg border flex items-center justify-center transition-all hover:opacity-80',
                getHeatColor(zone.attention)
              )}
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.w}%`,
                height: `${zone.h}%`,
              }}
            >
              <div className="text-center">
                <span className="text-xs font-medium text-text-primary block">{zone.label}</span>
                <span className="text-xs text-text-muted">{zone.attention}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="space-y-3 flex-1">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Attention Breakdown</h4>
          {[...zones]
            .sort((a, b) => b.attention - a.attention)
            .map((zone) => (
              <div key={zone.label} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text-primary">{zone.label}</span>
                    <span className={cn(
                      'text-sm font-bold font-heading',
                      zone.attention >= 80 ? 'text-danger' : zone.attention >= 50 ? 'text-amber' : 'text-text-muted'
                    )}>
                      {zone.attention}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-600 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        zone.attention >= 80 ? 'bg-danger' : zone.attention >= 50 ? 'bg-amber' : 'bg-success'
                      )}
                      style={{ width: `${zone.attention}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Card>
  )
}
