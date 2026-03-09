import { cn } from '@/lib/cn'

interface ScoreGaugeProps {
  score: number
  max?: number
  size?: number
  className?: string
  label?: string
}

export function ScoreGauge({ score, max = 10, size = 120, className, label }: ScoreGaugeProps) {
  const pct = score / max
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - pct)
  const color = pct >= 0.7 ? '#5B9A6B' : pct >= 0.4 ? '#C8FF00' : '#D4645C'

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1C1C1C"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center" style={{ marginTop: size * 0.25 }}>
        <span className="text-2xl font-bold font-heading" style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-text-muted">/ {max}</span>
      </div>
      {label && <span className="text-sm text-text-muted">{label}</span>}
    </div>
  )
}
