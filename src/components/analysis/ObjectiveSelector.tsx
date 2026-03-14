'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'
import { Crosshair, Megaphone, HelpCircle, Smartphone, ClipboardList } from 'lucide-react'
import { type LucideIcon } from 'lucide-react'

const OBJECTIVES: { id: string; icon: LucideIcon }[] = [
  { id: 'conversion', icon: Crosshair },
  { id: 'awareness', icon: Megaphone },
  { id: 'consideration', icon: HelpCircle },
  { id: 'app_installs', icon: Smartphone },
  { id: 'lead_gen', icon: ClipboardList },
]

interface ObjectiveSelectorProps {
  value: string
  onChange: (objective: string) => void
}

export function ObjectiveSelector({ value, onChange }: ObjectiveSelectorProps) {
  const { t } = useLanguage()
  const objectiveLabels = t.app.analyze.objectives

  return (
    <div>
      <h3 className="text-sm font-semibold font-heading mb-2">{t.app.analyze.objective}</h3>
      <p className="text-xs text-text-muted mb-3">{t.app.analyze.objectiveDesc}</p>
      <div className="flex flex-wrap gap-2">
        {OBJECTIVES.map((o) => {
          const Icon = o.icon
          const isActive = value === o.id
          return (
            <button
              key={o.id}
              onClick={() => onChange(o.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-amber/10 border border-amber/40 text-amber'
                  : 'bg-surface-700/60 backdrop-blur-sm border border-surface-500/60 text-text-muted hover:border-amber/20 hover:bg-amber/[0.02]'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-amber' : 'text-text-muted'} />
              <span>{objectiveLabels[o.id as keyof typeof objectiveLabels]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
