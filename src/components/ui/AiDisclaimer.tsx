import { Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/cn'

interface AiDisclaimerProps {
  text: string
  severity?: 'info' | 'warning'
  className?: string
}

export function AiDisclaimer({ text, severity = 'info', className }: AiDisclaimerProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 px-4 py-3 rounded-xl text-[11px] leading-relaxed',
        severity === 'warning'
          ? 'bg-amber/[0.04] border border-amber/10 text-text-muted'
          : 'bg-surface-800/40 border border-surface-500/30 text-text-faint',
        className
      )}
    >
      {severity === 'warning' ? (
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber/40" />
      ) : (
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-text-faint" />
      )}
      <span>{text}</span>
    </div>
  )
}
