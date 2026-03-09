'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, TrendingUp, Zap, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { authClient } from '@/lib/auth-client'
import { useLanguage } from '@/lib/i18n/LanguageContext'

function useTypewriter(text: string, speed = 50, delay = 300) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    const timeout = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, speed, delay])

  return { displayed, done }
}

function ScoreRing({ score, label, color, delay }: { score: number; label: string; color: string; delay: string }) {
  const circumference = 2 * Math.PI * 36
  const filled = (score / 10) * circumference

  return (
    <div className="flex flex-col items-center gap-2 animate-fade-up" style={{ animationDelay: delay }}>
      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="3" className="text-surface-600" />
          <circle
            cx="40" cy="40" r="36" fill="none"
            stroke={color} strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - filled}
            className="animate-score-fill"
            style={{ animationDelay: delay }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg sm:text-xl font-bold font-heading" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className="text-[11px] sm:text-xs text-text-muted font-medium">{label}</span>
    </div>
  )
}

export function Hero() {
  const { data: session, isPending } = authClient.useSession()
  const isLoggedIn = !isPending && !!session
  const { t, locale } = useLanguage()

  const line1 = useTypewriter(t.hero.headlinePre, 55, 400)
  const line2 = useTypewriter(t.hero.headlineAccent, 60, 400 + t.hero.headlinePre.length * 55 + 100)
  const line3 = useTypewriter(t.hero.headlinePost, 45, 400 + t.hero.headlinePre.length * 55 + 100 + t.hero.headlineAccent.length * 60 + 200)

  return (
    <section className="relative pt-32 pb-20 sm:pb-28 px-4 overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-amber/6 rounded-full blur-[100px] pointer-events-none" style={{ animation: 'pulse-glow 5s ease-in-out infinite' }} />
      <div className="absolute top-60 right-1/4 w-[400px] h-[400px] bg-[#00FF87]/4 rounded-full blur-[100px] pointer-events-none" style={{ animation: 'pulse-glow 7s ease-in-out infinite 2s' }} />

      <div className="relative max-w-6xl mx-auto">
        {/* Text content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber/20 bg-amber/5 backdrop-blur-sm px-4 py-1.5 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
            <span className="text-xs font-medium text-amber">{t.hero.badge}</span>
          </div>

          {/* Headline with typewriter */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-heading tracking-tight leading-[1.08] mb-6 min-h-[2.2em] sm:min-h-[2.4em]">
            {line1.displayed}
            <span className="gradient-text-amber text-glow-amber">{line2.displayed}</span>
            {line2.done && <br />}
            {line3.displayed}
            {!line3.done && (
              <span className="inline-block w-[3px] h-[0.85em] bg-amber ms-1 align-middle rounded-full" style={{ animation: 'blink 0.8s step-end infinite' }} />
            )}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 animate-fade-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
            {t.hero.subheading}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            {isLoggedIn ? (
              <Link href="/app">
                <Button size="lg">
                  {t.hero.ctaDashboard}
                  <ArrowRight size={18} className={locale === 'ar' ? 'rotate-180' : ''} />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button size="lg">
                    {t.hero.ctaStart}
                    <ArrowRight size={18} className={locale === 'ar' ? 'rotate-180' : ''} />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="secondary" size="lg">
                    {t.hero.ctaHow}
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>

        {/* Product showcase card */}
        <div className="mt-16 sm:mt-20 max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: '0.45s' }}>
          <div className="relative rounded-3xl border border-surface-500/60 bg-surface-800/60 backdrop-blur-xl overflow-hidden glow-amber">
            {/* Subtle top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent" />

            {/* Card header */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-surface-500/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber/10 flex items-center justify-center">
                  <Sparkles size={16} className="text-amber" />
                </div>
                <div>
                  <p className="text-sm font-semibold font-heading">{t.hero.cardTitle}</p>
                  <p className="text-[11px] text-text-muted">{t.hero.cardFile}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 border border-success/20 px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[11px] font-medium text-success">{t.hero.cardStatus}</span>
                </span>
              </div>
            </div>

            {/* Scores row */}
            <div className="px-5 sm:px-8 py-6 sm:py-8">
              <div className="flex items-center justify-center gap-6 sm:gap-12 mb-8">
                <ScoreRing score={8.5} label={t.hero.scoreHook} color="#5B9A6B" delay="0.6s" />
                <ScoreRing score={7.2} label={t.hero.scoreVisual} color="#C8FF00" delay="0.75s" />
                <ScoreRing score={9.1} label={t.hero.scoreCta} color="#5B9A6B" delay="0.9s" />
              </div>

              {/* Insights row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="group rounded-2xl bg-surface-700/50 border border-surface-500/50 p-4 hover:border-amber/20 transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.95s' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-amber/10 flex items-center justify-center">
                      <Zap size={12} className="text-amber" />
                    </div>
                    <span className="text-[11px] font-semibold text-amber uppercase tracking-wider">{t.hero.fixItLabel}</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {t.hero.fixItText}<span className="text-text-primary font-medium">{t.hero.fixItSuggestion}</span>
                  </p>
                </div>

                <div className="group rounded-2xl bg-surface-700/50 border border-surface-500/50 p-4 hover:border-success/20 transition-all duration-300 animate-fade-up" style={{ animationDelay: '1.05s' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-success/10 flex items-center justify-center">
                      <TrendingUp size={12} className="text-success" />
                    </div>
                    <span className="text-[11px] font-semibold text-success uppercase tracking-wider">{t.hero.verdictLabel}</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {t.hero.verdictText}<span className="text-text-primary font-medium">{t.hero.verdictHighlight}</span>{t.hero.verdictEnd}
                  </p>
                </div>

                <div className="group rounded-2xl bg-surface-700/50 border border-surface-500/50 p-4 hover:border-surface-500 transition-all duration-300 animate-fade-up" style={{ animationDelay: '1.15s' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-surface-500/50 flex items-center justify-center">
                      <Eye size={12} className="text-text-muted" />
                    </div>
                    <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">{t.hero.personasLabel}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {['S', 'M', 'P', 'J'].map((initial, i) => (
                      <div
                        key={initial}
                        className="w-6 h-6 rounded-full bg-surface-500 border border-surface-500/50 flex items-center justify-center text-[10px] font-medium text-text-muted"
                        style={{ marginLeft: i > 0 ? '-4px' : 0, zIndex: 4 - i }}
                      >
                        {initial}
                      </div>
                    ))}
                    <span className="text-[10px] text-text-muted ms-1.5">{t.hero.personasMore}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-500/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
