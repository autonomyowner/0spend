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
      color: 'text-amber',
      bg: 'bg-amber/8 border-amber/10',
    },
    {
      label: 'Avg Score',
      value: stats ? String(stats.avgScore) : '—',
      change: stats ? 'Across all tests' : '',
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/8 border-success/10',
    },
    {
      label: 'Completed',
      value: stats ? String(stats.completedCount) : '—',
      change: 'Successful analyses',
      icon: DollarSign,
      color: 'text-amber',
      bg: 'bg-amber/8 border-amber/10',
    },
    {
      label: 'Fix-Its Generated',
      value: stats ? String(stats.fixItsCount) : '—',
      change: 'Actionable suggestions',
      icon: Wrench,
      color: 'text-text-muted',
      bg: 'bg-surface-500/30 border-surface-500/30',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {items.map((s) => (
        <Card key={s.label} className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-6 hover:border-surface-500 transition-all duration-300">
          <div className={`w-10 h-10 rounded-2xl ${s.bg} border flex items-center justify-center flex-shrink-0`}>
            <s.icon size={18} className={s.color} />
          </div>
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-bold font-heading leading-tight">{s.value}</p>
            <p className="text-xs sm:text-sm font-medium text-text-primary mt-0.5">{s.label}</p>
            <p className="text-[11px] sm:text-xs text-text-muted mt-1 hidden sm:block">{s.change}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
