'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { PRICING_TIERS } from '@/lib/constants'
import { cn } from '@/lib/cn'
import { useReveal } from '@/hooks/useReveal'
import { authClient } from '@/lib/auth-client'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function Pricing() {
  const ref = useReveal()
  const { data: session, isPending } = authClient.useSession()
  const isLoggedIn = !isPending && !!session
  const { t } = useLanguage()

  return (
    <section id="pricing" className="relative py-24 sm:py-32 px-4 sm:px-16 border-t border-surface-500">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div ref={ref} className="relative max-w-6xl mx-auto reveal">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
          <div>
            <div className="axm-tag">{t.pricing.badge}</div>
            <h2 className="axm-section-h2">
              {t.pricing.headlinePre}
              <em>{t.pricing.headlineAccent}</em>
              {t.pricing.headlinePost}
            </h2>
          </div>
          <p className="text-text-muted text-sm max-w-xs leading-relaxed">
            {t.pricing.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-surface-500 max-w-4xl mx-auto">
          {PRICING_TIERS.map((tier, idx) => {
            const tierT = t.pricing.tiers[idx]
            return (
              <div
                key={tier.name}
                className={cn(
                  'relative flex flex-col p-8 transition-all duration-300',
                  tier.popular
                    ? 'bg-surface-700/80'
                    : 'bg-bg hover:bg-surface-800/60'
                )}
              >
                {/* Top accent line */}
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber to-transparent" />
                )}

                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-amber px-4 py-1 text-xs font-heading font-bold text-black uppercase tracking-wider">
                      {t.pricing.mostPopular}
                    </span>
                  </div>
                )}

                {/* Tier name + desc */}
                <div className="mb-7">
                  <span className="text-xs font-heading font-bold text-text-muted uppercase tracking-widest mb-2 block">{tierT.name}</span>
                  <p className="text-xs text-text-muted leading-relaxed">{tierT.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span className="font-heading font-black text-5xl leading-none" style={{ letterSpacing: '-0.02em' }}>${tier.price}</span>
                    <span className="text-text-muted text-sm mb-1.5">{t.pricing.perMonth}</span>
                  </div>
                  {tier.popular && (
                    <p className="text-xs text-amber mt-1.5 font-medium">{t.pricing.earlyBird}</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {tierT.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm">
                      <div className="w-4 h-4 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={10} className="text-amber" />
                      </div>
                      <span className="text-text-muted leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href={isLoggedIn ? '/app' : '/sign-up'}>
                  <button className={cn(
                    'w-full py-3 px-6 rounded-xl font-heading font-bold text-sm uppercase tracking-wide transition-all duration-300 cursor-none',
                    tier.popular
                      ? 'bg-amber text-black hover:bg-amber/90'
                      : 'border border-surface-500 text-text-muted hover:border-amber/30 hover:text-white'
                  )}>
                    {isLoggedIn ? t.pricing.ctaDashboard : tierT.cta}
                  </button>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
          {t.pricing.trustBadges.map((badge, i) => (
            <span key={i} className="flex items-center gap-2.5">
              <span className="w-1 h-1 rounded-full bg-amber/40" />
              <span className="text-xs text-text-muted font-heading tracking-wide uppercase">{badge}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
