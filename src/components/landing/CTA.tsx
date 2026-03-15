'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useReveal } from '@/hooks/useReveal'
import { authClient } from '@/lib/auth-client'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function CTA() {
  const ref = useReveal()
  const { data: session, isPending } = authClient.useSession()
  const isLoggedIn = !isPending && !!session
  const { t, locale } = useLanguage()

  return (
    <section className="relative py-24 sm:py-32 px-4">
      <div ref={ref} className="max-w-3xl mx-auto text-center reveal">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading tracking-tight mb-5">
            {t.cta.headlinePre}
            <span className="gradient-text-amber">{t.cta.headlineAccent}</span>
          </h2>
          <p className="text-text-muted text-base sm:text-lg max-w-xl mx-auto mb-10">
            {t.cta.description}
          </p>
          {isLoggedIn ? (
            <Link href="/app">
              <Button size="lg">
                {t.cta.ctaDashboard}
                <ArrowRight size={18} className={locale === 'ar' ? 'rotate-180' : ''} />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/sign-up">
                <Button size="lg">
                  {t.cta.ctaStart}
                  <ArrowRight size={18} className={locale === 'ar' ? 'rotate-180' : ''} />
                </Button>
              </Link>
              <p className="text-xs text-text-muted mt-5">{t.cta.noCreditCard}</p>
              <p className="text-xs text-amber/70 mt-2">{t.cta.spotsRemaining}</p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
