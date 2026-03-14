import { Image, Film, Globe } from 'lucide-react'
import { cn } from '@/lib/cn'

const formats = [
  { id: 'image', label: 'Image', icon: Image, desc: 'Static ad creatives' },
  { id: 'video', label: 'Video', icon: Film, desc: 'TikTok, Reels, YouTube' },
  { id: 'landing_page', label: 'Landing Page', icon: Globe, desc: 'Analyze any URL' },
] as const

interface FormatSelectorProps {
  value: string
  onChange: (format: string) => void
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold font-heading mb-3">Creative Format</h3>
      <div className="grid grid-cols-3 gap-2">
        {formats.map((f) => (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-xl border p-3 text-sm font-medium transition-all duration-200 cursor-pointer',
              value === f.id
                ? 'border-amber/40 bg-amber/5 text-amber'
                : 'border-surface-500/60 bg-surface-700/60 backdrop-blur-sm text-text-muted hover:border-amber/20 hover:bg-amber/[0.02] hover:text-text-primary'
            )}
          >
            <f.icon size={20} />
            <span>{f.label}</span>
            <span className="text-[10px] text-text-muted font-normal">{f.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
