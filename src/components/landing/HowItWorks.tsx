'use client'

import { Upload, Users, BarChart3, ChevronRight, ChevronLeft } from 'lucide-react'
import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const stepIcons = [Upload, Users, BarChart3]

export function HowItWorks() {
  const ref = useReveal()
  const { t, locale } = useLanguage()
  const Chevron = locale === 'ar' ? ChevronLeft : ChevronRight

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 px-4 grid-bg">
      <div ref={ref} className="max-w-6xl mx-auto reveal">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-amber uppercase tracking-wider mb-3">{t.howItWorks.badge}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading tracking-tight mb-5">
            {t.howItWorks.headlinePre}
            <span className="gradient-text-amber">{t.howItWorks.headlineAccent}</span>
          </h2>
          <p className="text-text-muted text-base sm:text-lg max-w-2xl mx-auto">
            {t.howItWorks.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.howItWorks.steps.map((step, i) => {
            const Icon = stepIcons[i]
            return (
              <div key={i} className="relative group">
                {/* Connecting arrow (desktop) */}
                {i < t.howItWorks.steps.length - 1 && (
                  <div className="hidden md:flex absolute top-12 -right-3 z-10 w-6 h-6 items-center justify-center rtl:-left-3 rtl:right-auto">
                    <Chevron size={16} className="text-amber/30" />
                  </div>
                )}

                <div className="relative rounded-2xl bg-surface-800/60 backdrop-blur-sm border border-surface-500/60 p-7 sm:p-8 hover:border-amber/20 hover:bg-surface-700/40 transition-all duration-300 h-full cursor-default overflow-hidden">
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl bg-amber/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Large background number */}
                  <div className="absolute -bottom-4 -right-2 text-[100px] font-bold font-heading text-surface-600/50 leading-none pointer-events-none select-none group-hover:text-amber/10 transition-colors duration-500">
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-amber/8 border border-amber/10 flex items-center justify-center group-hover:bg-amber/12 transition-colors duration-300">
                        <Icon size={22} className="text-text-muted group-hover:text-amber/80 transition-colors duration-300" />
                      </div>
                      <span className="text-xs font-mono text-amber/60 font-semibold tracking-wider">STEP {String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="text-lg font-semibold font-heading mb-2.5">{step.title}</h3>
                    <p className="text-text-muted text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
