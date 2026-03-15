'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const personaScores = [8.7, 5.3, 7.1]
const personaColors = ['#5B9A6B', '#D4645C', '#C8FF00']
const debateColors = ['#C8FF00', '#D4645C', '#C8FF00', '#5B9A6B']

const heatmapPositions = [
  { attention: 92, x: 10, y: 5, w: 80, h: 15 },
  { attention: 78, x: 5, y: 22, w: 90, h: 30 },
  { attention: 85, x: 25, y: 55, w: 50, h: 12 },
  { attention: 23, x: 15, y: 70, w: 70, h: 8 },
  { attention: 12, x: 5, y: 82, w: 90, h: 15 },
]

function getHeatColor(attention: number) {
  if (attention >= 80) return 'bg-danger/30 border-danger/20'
  if (attention >= 50) return 'bg-amber/20 border-amber/15'
  return 'bg-success/15 border-success/10'
}

export function DemoPreview() {
  const [active, setActive] = useState(0)
  const ref = useReveal()
  const { t } = useLanguage()

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-16" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(200,255,0,0.02) 50%, transparent 100%)' }}>
      <div ref={ref} className="max-w-5xl mx-auto reveal">

        <div className="mb-12">
          <div className="axm-tag">{t.demo.badge}</div>
          <h2 className="axm-section-h2">
            {t.demo.headlinePre}
            <em>{t.demo.headlineAccent}</em>
          </h2>
        </div>

        {/* Tabs — Axiom style */}
        <div className="flex gap-0 mb-8 border-b border-surface-500">
          {t.demo.tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'px-6 py-3 text-sm font-heading font-bold uppercase tracking-wider transition-all duration-250 cursor-none relative',
                active === i
                  ? 'text-amber'
                  : 'text-text-muted hover:text-white'
              )}
            >
              {tab}
              {active === i && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber" />
              )}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div className="rounded-2xl bg-surface-800/50 border border-surface-500/50 p-6 sm:p-8 min-h-[400px]">
          {active === 0 && (
            <div className="space-y-4">
              {t.demo.personas.map((p, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-surface-700/40 border border-surface-500/40 hover:border-surface-500 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-heading font-bold flex-shrink-0 border"
                    style={{ backgroundColor: personaColors[i] + '12', color: personaColors[i], borderColor: personaColors[i] + '25' }}>
                    {p.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-heading font-bold text-sm tracking-wide">{p.name}</span>
                        <span className="text-text-muted text-xs ml-2">{p.role}</span>
                      </div>
                      <span className="text-sm font-bold font-heading" style={{ color: personaColors[i] }}>{personaScores[i]}/10</span>
                    </div>
                    <div className="h-1 rounded-full bg-surface-600 overflow-hidden mb-2">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${personaScores[i] * 10}%`, backgroundColor: personaColors[i] }} />
                    </div>
                    <p className="text-text-muted text-xs leading-relaxed">{p.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {active === 1 && (
            <div className="space-y-4">
              {t.demo.debate.map((d, i) => (
                <div key={i} className={cn('p-4 rounded-xl border transition-all duration-300',
                  d.agent === t.demo.debate[3].agent
                    ? 'bg-success/5 border-success/20'
                    : 'bg-surface-700/40 border-surface-500/40'
                )}>
                  <span className="text-xs font-heading font-bold mb-2 block uppercase tracking-wider" style={{ color: debateColors[i] }}>
                    {d.agent}
                  </span>
                  <p className="text-sm text-text-primary leading-relaxed">{d.text}</p>
                </div>
              ))}
            </div>
          )}

          {active === 2 && (
            <div className="relative w-full aspect-[4/5] max-w-sm mx-auto rounded-xl bg-surface-700/40 border border-surface-500/40 overflow-hidden">
              {heatmapPositions.map((zone, i) => (
                <div key={i} className={cn('absolute rounded-lg border flex items-center justify-center transition-all duration-300 hover:scale-[1.02]', getHeatColor(zone.attention))}
                  style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w}%`, height: `${zone.h}%` }}>
                  <div className="text-center">
                    <span className="text-xs font-heading font-bold text-text-primary block">{t.demo.heatmapZones[i].label}</span>
                    <span className="text-xs text-text-muted">{zone.attention}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
