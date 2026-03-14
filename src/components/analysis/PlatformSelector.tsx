'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'
import { Globe, Facebook, Instagram, Music, Search, Linkedin, Youtube, AtSign } from 'lucide-react'
import { type LucideIcon } from 'lucide-react'

const PLATFORMS: { id: string; icon: LucideIcon }[] = [
  { id: 'generic', icon: Globe },
  { id: 'facebook', icon: Facebook },
  { id: 'instagram', icon: Instagram },
  { id: 'tiktok', icon: Music },
  { id: 'google_ads', icon: Search },
  { id: 'linkedin', icon: Linkedin },
  { id: 'youtube', icon: Youtube },
  { id: 'x', icon: AtSign },
]

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
        {PLATFORMS.map((p) => {
          const Icon = p.icon
          const isActive = value === p.id
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-amber/10 border border-amber/40 text-amber'
                  : 'bg-surface-700/60 backdrop-blur-sm border border-surface-500/60 text-text-muted hover:border-amber/20 hover:bg-amber/[0.02]'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-amber' : 'text-text-muted'} />
              <span>{platformLabels[p.id as keyof typeof platformLabels]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
