'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'

const OBJECTIVES = [
  { id: 'conversion', icon: '🎯' },
  { id: 'awareness', icon: '📢' },
  { id: 'consideration', icon: '🤔' },
  { id: 'app_installs', icon: '📱' },
  { id: 'lead_gen', icon: '📋' },
] as const

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
        {OBJECTIVES.map((o) => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              value === o.id
                ? 'bg-amber/10 border border-amber/40 text-amber'
                : 'bg-surface-700 border border-surface-500 text-text-muted hover:border-amber/20'
            }`}
          >
            <span>{o.icon}</span>
            <span>{objectiveLabels[o.id as keyof typeof objectiveLabels]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
