import { Image, Film, Layers, Globe } from 'lucide-react'
import { cn } from '@/lib/cn'

const formats = [
  { id: 'image', label: 'Image', icon: Image },
  { id: 'video', label: 'Video', icon: Film },
  { id: 'carousel', label: 'Carousel', icon: Layers },
  { id: 'landing-page', label: 'Landing Page', icon: Globe },
] as const

interface FormatSelectorProps {
  value: string
  onChange: (format: string) => void
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold font-heading mb-3">Creative Format</h3>
      <div className="grid grid-cols-2 gap-2">
        {formats.map((f) => (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={cn(
              'flex items-center gap-2.5 rounded-xl border p-3 text-sm font-medium transition-all duration-200 cursor-pointer',
              value === f.id
                ? 'border-amber/40 bg-amber/5 text-amber'
                : 'border-surface-500 bg-surface-700 text-text-muted hover:border-amber/20 hover:text-text-primary'
            )}
          >
            <f.icon size={18} />
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}
