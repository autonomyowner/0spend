'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'

const tabs = ['Persona Scoring', 'Agent Debate', 'Attention Map']

const personas = [
  { name: 'Sarah K.', role: 'Impulse Buyer, 24', score: 8.7, color: '#5B9A6B', comment: 'Love the urgency! The countdown timer and bold CTA really pull me in.' },
  { name: 'Marcus D.', role: 'Enterprise CTO, 42', score: 5.3, color: '#D4645C', comment: 'Too flashy. Where are the specs? I need ROI data, not hype.' },
  { name: 'Priya L.', role: 'Budget-Conscious Mom, 35', score: 7.1, color: '#C8FF00', comment: 'Good value proposition, but the fine print is hard to read on mobile.' },
]

const debate = [
  { agent: 'Buyer Agent', color: '#C8FF00', text: 'The hook is strong — "50% Off" immediately communicates value. The social proof badges add credibility.' },
  { agent: 'Skeptic Agent', color: '#D4645C', text: 'But the discount feels generic. Every brand does 50% off. Where\'s the differentiation? And the small text undermines trust.' },
  { agent: 'Buyer Agent', color: '#C8FF00', text: 'Fair point on differentiation, but the CTA placement is excellent. Above the fold, high contrast, action-oriented verb.' },
  { agent: 'Verdict', color: '#5B9A6B', text: '7.2/10 — Ship with tweaks: add unique value prop above the fold, increase fine print font size by 2px.' },
]

const heatmapZones = [
  { label: 'Headline', attention: 92, x: 10, y: 5, w: 80, h: 15 },
  { label: 'Hero Image', attention: 78, x: 5, y: 22, w: 90, h: 30 },
  { label: 'CTA Button', attention: 85, x: 25, y: 55, w: 50, h: 12 },
  { label: 'Fine Print', attention: 23, x: 15, y: 70, w: 70, h: 8 },
  { label: 'Footer', attention: 12, x: 5, y: 82, w: 90, h: 15 },
]

function getHeatColor(attention: number) {
  if (attention >= 80) return 'bg-danger/40 border-danger/30'
  if (attention >= 50) return 'bg-amber/30 border-amber/20'
  return 'bg-success/20 border-success/10'
}

export function DemoPreview() {
  const [active, setActive] = useState(0)

  return (
    <section className="relative py-24 px-4 grid-bg">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-amber uppercase tracking-wider mb-3">Live Demo</p>
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-5">
            See It in{' '}
            <span className="gradient-text-amber">Action</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-1 mb-8">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActive(i)}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
                active === i
                  ? 'bg-amber/10 text-amber border border-amber/20'
                  : 'text-text-muted hover:text-text-primary border border-transparent'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-2xl bg-surface-800 border border-surface-500 p-8 min-h-[400px]">
          {active === 0 && (
            <div className="space-y-4">
              {personas.map((p) => (
                <div key={p.name} className="flex items-start gap-4 p-4 rounded-xl bg-surface-700 border border-surface-500">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0" style={{ backgroundColor: p.color + '20', color: p.color }}>
                    {p.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium text-sm">{p.name}</span>
                        <span className="text-text-muted text-xs ml-2">{p.role}</span>
                      </div>
                      <span className="text-sm font-bold font-heading" style={{ color: p.color }}>{p.score}/10</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-600 overflow-hidden mb-2">
                      <div className="h-full rounded-full" style={{ width: `${p.score * 10}%`, backgroundColor: p.color }} />
                    </div>
                    <p className="text-text-muted text-xs">{p.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {active === 1 && (
            <div className="space-y-4">
              {debate.map((d, i) => (
                <div
                  key={i}
                  className={cn(
                    'p-4 rounded-xl border',
                    d.agent === 'Verdict' ? 'bg-success/5 border-success/20' : 'bg-surface-700 border-surface-500'
                  )}
                >
                  <span className="text-xs font-semibold mb-1 block" style={{ color: d.color }}>
                    {d.agent}
                  </span>
                  <p className="text-sm text-text-primary leading-relaxed">{d.text}</p>
                </div>
              ))}
            </div>
          )}

          {active === 2 && (
            <div className="relative w-full aspect-[4/5] max-w-sm mx-auto rounded-xl bg-surface-700 border border-surface-500 overflow-hidden">
              {heatmapZones.map((zone) => (
                <div
                  key={zone.label}
                  className={cn(
                    'absolute rounded-lg border flex items-center justify-center transition-all',
                    getHeatColor(zone.attention)
                  )}
                  style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.w}%`,
                    height: `${zone.h}%`,
                  }}
                >
                  <div className="text-center">
                    <span className="text-xs font-medium text-text-primary block">{zone.label}</span>
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
