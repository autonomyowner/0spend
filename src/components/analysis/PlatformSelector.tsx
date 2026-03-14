'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'

const PLATFORMS = [
  { id: 'generic', icon: '🌐' },
  { id: 'facebook', icon: '📘' },
  { id: 'instagram', icon: '📷' },
  { id: 'tiktok', icon: '🎵' },
  { id: 'google_ads', icon: '🔍' },
  { id: 'linkedin', icon: '💼' },
  { id: 'youtube', icon: '▶️' },
  { id: 'x', icon: '𝕏' },
] as const

interface PlatformSelectorProps {
  value: string
  onChange: (platform: string) => void
}

export function PlatformSelector({ value, onChange }: PlatformSelectorProps) {
  const { t } = useLanguage()
  const platformLabels = t.app.analyze.platforms

  return (
    <div>
      <h3 className="text-sm font-semibold font-heading mb-2">{t.app.analyze.platform}</h3>
      <p className="text-xs text-text-muted mb-3">{t.app.analyze.platformDesc}</p>
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              value === p.id
                ? 'bg-amber/10 border border-amber/40 text-amber'
                : 'bg-surface-700 border border-surface-500 text-text-muted hover:border-amber/20'
            }`}
          >
            <span>{p.icon}</span>
            <span>{platformLabels[p.id as keyof typeof platformLabels]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
