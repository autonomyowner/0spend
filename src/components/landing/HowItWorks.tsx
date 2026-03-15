'use client'

import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function HowItWorks() {
  const ref = useReveal()
  const { t } = useLanguage()

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 px-4 sm:px-16">
      <div ref={ref} className="max-w-6xl mx-auto reveal">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="axm-tag">{t.howItWorks.badge}</div>
            <h2 className="axm-section-h2">
              {t.howItWorks.headlinePre}
              <em>{t.howItWorks.headlineAccent}</em>
            </h2>
          </div>
          <p className="text-text-muted text-sm sm:text-base max-w-xs leading-relaxed">
            {t.howItWorks.description}
          </p>
        </div>

        {/* Service rows */}
        <div className="border-t border-surface-500">
          {t.howItWorks.steps.map((step, i) => (
            <div key={i} className="axm-row group">
              <span className="axm-row-num">0{i + 1}</span>
              <h3 className="axm-row-title">{step.title}</h3>
              <p className="axm-row-desc">{step.description}</p>
              <span className="axm-row-arr">↗</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
