'use client'

import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function SocialProof() {
  const ref = useReveal()
  const { t } = useLanguage()

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-16">
      <div ref={ref} className="max-w-6xl mx-auto reveal">

        <div className="mb-16">
          <div className="axm-tag">{t.socialProof.badge}</div>
          <h2 className="axm-section-h2 max-w-2xl">
            {t.socialProof.headlinePre}
            <em>{t.socialProof.headlineAccent}</em>
          </h2>
        </div>

        {/* Proof Bar */}
        <div className="flex flex-wrap items-center gap-x-10 gap-y-3 mb-14 py-5 px-6 rounded-2xl border border-surface-500/40 bg-surface-800/30">
          {t.socialProof.proofBar.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber/60" />
              <span className="text-sm text-text-muted font-heading font-bold uppercase tracking-wide">{item}</span>
            </div>
          ))}
        </div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-surface-500">
          {t.socialProof.testimonials.map((testimonial, i) => (
            <div key={i} className="group bg-bg p-8 flex flex-col hover:bg-surface-800/60 transition-all duration-300">
              <div className="inline-flex items-center gap-2 border border-amber/20 bg-amber/5 rounded-full px-3 py-1 mb-6 self-start">
                <span className="text-xs font-heading font-bold text-amber uppercase tracking-wider">{testimonial.metric}</span>
              </div>

              <blockquote className="font-serif text-lg leading-relaxed text-text-primary mb-6 flex-1"
                style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300 }}>
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-5 border-t border-surface-500/40">
                <div className="w-9 h-9 rounded-full bg-amber/8 border border-amber/15 flex items-center justify-center text-amber text-sm font-heading font-bold">
                  {testimonial.name[0]}
                </div>
                <div>
                  <p className="text-sm font-heading font-bold tracking-wide">{testimonial.name}</p>
                  <p className="text-xs text-text-muted">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured In */}
        <div className="mt-16 pt-12 border-t border-surface-500">
          <p className="axm-tag justify-center">{t.socialProof.featuredIn}</p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {t.socialProof.featuredLogos.map((logo, i) => (
              <span key={i} className="font-heading font-bold text-base text-text-faint/50 tracking-widest uppercase select-none hover:text-text-muted transition-colors duration-300">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
