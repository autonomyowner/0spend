'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { PRICING_TIERS } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
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
    <section id="pricing" className="relative py-24 sm:py-32 px-4 grid-bg">
      <div ref={ref} className="max-w-6xl mx-auto reveal">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-amber uppercase tracking-wider mb-3">{t.pricing.badge}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading tracking-tight mb-5">
            {t.pricing.headlinePre}
            <span className="gradient-text-amber">{t.pricing.headlineAccent}</span>
            {t.pricing.headlinePost}
          </h2>
          <p className="text-text-muted text-base sm:text-lg max-w-2xl mx-auto">
            {t.pricing.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {PRICING_TIERS.map((tier, idx) => {
            const tierT = t.pricing.tiers[idx]
            return (
              <div
                key={tier.name}
                className={cn(
                  'group relative rounded-3xl border p-7 sm:p-8 flex flex-col transition-all duration-300',
                  tier.popular
                    ? 'bg-surface-700/60 backdrop-blur-sm border-amber/30 glow-amber-strong hover:border-amber/50'
                    : 'bg-surface-800/60 backdrop-blur-sm border-surface-500/60 hover:border-amber/15'
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#FAFF00] via-[#C8FF00] to-[#00FF87] px-4 py-1 text-xs font-semibold text-black">
                      {t.pricing.mostPopular}
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold font-heading mb-1">{tierT.name}</h3>
                  <p className="text-sm text-text-muted">{tierT.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold font-heading">${tier.price}</span>
                  <span className="text-text-muted text-sm">{t.pricing.perMonth}</span>
                  {tier.popular && (
                    <p className="text-xs text-amber mt-1.5">{t.pricing.earlyBird}</p>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {tierT.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-sm">
                      <div className="w-5 h-5 rounded-full bg-amber/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={12} className="text-amber/70" />
                      </div>
                      <span className="text-text-primary">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={isLoggedIn ? '/app' : '/sign-up'}>
                  <Button
                    variant={tier.popular ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    {isLoggedIn ? t.pricing.ctaDashboard : tierT.cta}
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-12">
          {t.pricing.trustBadges.map((badge, i) => (
            <span key={i} className="flex items-center gap-4">
              {i > 0 && <span className="text-text-faint/30 hidden sm:inline">·</span>}
              <span className="text-xs text-text-muted">{badge}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
