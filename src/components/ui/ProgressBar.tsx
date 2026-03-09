import { cn } from '@/lib/cn'

interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  className?: string
  label?: string
  showValue?: boolean
}

export function ProgressBar({ value, max = 100, color, className, label, showValue = true }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100)
  const barColor = color || (pct >= 70 ? 'bg-success' : pct >= 40 ? 'bg-amber' : 'bg-danger')

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-text-muted">{label}</span>}
          {showValue && <span className="text-text-primary font-medium">{value}/{max}</span>}
        </div>
      )}
      <div className="h-2 rounded-full bg-surface-600 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
