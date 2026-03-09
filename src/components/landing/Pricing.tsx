import Link from 'next/link'
import { Check } from 'lucide-react'
import { PRICING_TIERS } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 px-4 grid-bg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-amber uppercase tracking-wider mb-3">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-5">
            Simple,{' '}
            <span className="gradient-text-amber">Transparent</span>{' '}
            Pricing
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Start free. Scale when you're ready. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                'relative rounded-2xl border p-8 flex flex-col',
                tier.popular
                  ? 'bg-surface-700 border-amber/40 glow-amber-strong'
                  : 'bg-surface-800 border-surface-500'
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#FAFF00] via-[#C8FF00] to-[#00FF87] px-3 py-1 text-xs font-semibold text-black">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold font-heading mb-1">{tier.name}</h3>
                <p className="text-sm text-text-muted">{tier.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold font-heading">${tier.price}</span>
                <span className="text-text-muted text-sm">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={16} className="text-text-muted mt-0.5 flex-shrink-0" />
                    <span className="text-text-primary">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button
                  variant={tier.popular ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  {tier.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
