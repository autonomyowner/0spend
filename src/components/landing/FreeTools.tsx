'use client'

import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function FreeTools() {
  const ref = useReveal()
  const { t } = useLanguage()

  return (
    <section className="relative py-24 sm:py-32 px-4">
      <div ref={ref} className="max-w-5xl mx-auto reveal">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-amber uppercase tracking-wider mb-3">{t.freeTools.badge}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading tracking-tight">
            {t.freeTools.headlinePre}
            <span className="gradient-text-amber">{t.freeTools.headlineAccent}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {t.freeTools.items.map((item, i) => (
            <Link
              key={i}
              href="/sign-up"
              className="group relative rounded-2xl bg-surface-800/50 backdrop-blur-sm border border-surface-500/50 p-6 sm:p-7 flex flex-col hover:border-amber/20 transition-all duration-300"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-amber/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber/20 bg-amber/5 px-3 py-1 mb-4">
                  <span className="text-[11px] font-semibold text-amber uppercase tracking-wider">Free</span>
                </div>
                <h3 className="text-base font-semibold font-heading mb-2 group-hover:text-white transition-colors">{item.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
