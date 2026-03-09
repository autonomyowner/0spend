'use client'

import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function SocialProof() {
  const ref = useReveal()
  const { t } = useLanguage()

  return (
    <section className="relative py-24 sm:py-32 px-4">
      <div ref={ref} className="max-w-6xl mx-auto reveal">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-amber uppercase tracking-wider mb-3">{t.socialProof.badge}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading tracking-tight mb-5">
            {t.socialProof.headlinePre}
            <span className="gradient-text-amber">{t.socialProof.headlineAccent}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {t.socialProof.testimonials.map((testimonial, i) => (
            <div key={i} className="group relative rounded-2xl bg-surface-800/50 backdrop-blur-sm border border-surface-500/50 p-7 flex flex-col hover:border-amber/15 transition-all duration-300">
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-amber/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative flex flex-col flex-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber/20 bg-amber/5 px-3 py-1 mb-5 self-start">
                  <span className="text-xs font-semibold text-amber">{testimonial.metric}</span>
                </div>
                <p className="text-sm text-text-primary leading-relaxed mb-6 flex-1">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-5 border-t border-surface-500/40">
                  <div className="w-9 h-9 rounded-full bg-amber/8 border border-amber/10 flex items-center justify-center text-amber text-sm font-semibold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-xs text-text-muted">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
