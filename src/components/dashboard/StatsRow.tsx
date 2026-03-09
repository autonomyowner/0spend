import { FlaskConical, TrendingUp, DollarSign, Wrench } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface StatsRowProps {
  stats?: {
    testCount: number
    avgScore: number
    completedCount: number
    fixItsCount: number
  }
}

export function StatsRow({ stats }: StatsRowProps) {
  const items = [
    {
      label: 'Tests Run',
      value: stats ? String(stats.testCount) : '—',
      change: stats ? `${stats.completedCount} completed` : '',
      icon: FlaskConical,
    },
    {
      label: 'Avg Score',
      value: stats ? String(stats.avgScore) : '—',
      change: stats ? 'Across all tests' : '',
      icon: TrendingUp,
    },
    {
      label: 'Money Saved',
      value: stats
        ? `$${(stats.completedCount * 150).toLocaleString()}`
        : '—',
      change: 'Est. wasted spend prevented',
      icon: DollarSign,
    },
    {
      label: 'Fix-Its Generated',
      value: stats ? String(stats.fixItsCount) : '—',
      change: 'Actionable suggestions',
      icon: Wrench,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((s) => (
        <Card key={s.label} className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center flex-shrink-0">
            <s.icon size={20} className="text-text-muted" />
          </div>
          <div>
            <p className="text-2xl font-bold font-heading">{s.value}</p>
            <p className="text-sm font-medium text-text-primary mt-0.5">{s.label}</p>
            <p className="text-xs text-text-muted mt-1">{s.change}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
