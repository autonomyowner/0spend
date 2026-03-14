'use client'

import { Users, Swords, Wrench, Eye, GitCompare, BarChart3 } from 'lucide-react'
import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const featureIcons = [Users, Swords, Wrench, Eye, GitCompare, BarChart3]

export function FeaturesGrid() {
  const ref = useReveal()
  const { t } = useLanguage()

  return (
    <section id="features" className="relative py-24 sm:py-32 px-4">
      <div ref={ref} className="max-w-6xl mx-auto reveal">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-amber uppercase tracking-wider mb-3">{t.features.badge}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading tracking-tight mb-5">
            {t.features.headlinePre}
            <span className="gradient-text-amber">{t.features.headlineAccent}</span>
          </h2>
          <p className="text-text-muted text-base sm:text-lg max-w-2xl mx-auto">
            {t.features.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.features.items.map((f, i) => {
            const Icon = featureIcons[i]
            return (
              <div
                key={i}
                className="group relative rounded-2xl bg-surface-800/60 backdrop-blur-sm border border-surface-500/60 p-7 hover:border-amber/15 transition-all duration-300 cursor-default"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-amber/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-amber/8 border border-amber/10 flex items-center justify-center mb-5 group-hover:bg-amber/12 transition-colors duration-300">
                    <Icon size={20} className="text-text-muted group-hover:text-amber/80 transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-semibold font-heading mb-2">{f.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{f.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
