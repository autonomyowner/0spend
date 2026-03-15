'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Sparkles, TrendingUp, Zap, Eye } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useLanguage } from '@/lib/i18n/LanguageContext'

/* ── Text Scramble ── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'

function ScrambleText({ text, trigger }: { text: string; trigger: boolean }) {
  const upper = text.toUpperCase()
  const [display, setDisplay] = useState(upper)

  useEffect(() => {
    if (!trigger) return
    let frame = 0
    const total = 28
    const id = setInterval(() => {
      setDisplay(
        upper.split('').map((ch, i) => {
          if (ch === ' ') return ' '
          if (frame > (i / upper.length) * total + 7) return ch
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join('')
      )
      frame++
      if (frame > total + 14) clearInterval(id)
    }, 38)
    return () => clearInterval(id)
  }, [trigger, upper])

  return <>{display}</>
}

/* ── Score Ring ── */
function ScoreRing({ score, label, color, delay }: { score: number; label: string; color: string; delay: string }) {
  const circumference = 2 * Math.PI * 36
  const filled = (score / 10) * circumference
  return (
    <div className="flex flex-col items-center gap-2 animate-fade-up" style={{ animationDelay: delay }}>
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="#1C1C1C" strokeWidth="3" />
          <circle cx="40" cy="40" r="36" fill="none" stroke={color} strokeWidth="3.5"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference - filled}
            className="animate-score-fill" style={{ animationDelay: delay }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold font-heading" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider">{label}</span>
    </div>
  )
}

/* ── Magnetic Button ── */
function MagBtn({ href, children, variant = 'outline' }: { href: string; children: React.ReactNode; variant?: 'outline' | 'fill' }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    ref.current!.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`
  }
  const onLeave = () => { if (ref.current) ref.current.style.transform = '' }
  return (
    <a ref={ref} href={href}
      onMouseMove={onMove} onMouseLeave={onLeave}
      className={variant === 'fill'
        ? 'axm-mag-btn bg-amber text-black border-amber hover:bg-amber/90'
        : 'axm-mag-btn'
      }
    >
      {children}
    </a>
  )
}

export function Hero() {
  const [ready, setReady] = useState(false)
  const { data: session, isPending } = authClient.useSession()
  const isLoggedIn = !isPending && !!session
  const { t } = useLanguage()

  useEffect(() => { const t = setTimeout(() => setReady(true), 350); return () => clearTimeout(t) }, [])

  return (
    <section className="axm-hero pt-32 pb-16 px-6 sm:px-16">
      {/* Ambient glow orbs */}
      <div className="absolute top-32 left-1/4 w-[600px] h-[600px] bg-amber/[0.05] rounded-full blur-[120px] pointer-events-none" style={{ animation: 'pulse-glow 6s ease-in-out infinite' }} />
      <div className="absolute top-60 right-1/4 w-[400px] h-[400px] bg-[#00FF87]/[0.03] rounded-full blur-[100px] pointer-events-none" style={{ animation: 'pulse-glow 8s ease-in-out infinite 2s' }} />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto">
        {/* Hero text — left aligned, editorial */}
        <div style={{ opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(10px)', transition: 'opacity 0.6s 0.15s, transform 0.6s 0.15s' }}>
          <div className="axm-tag">AI Ad Intelligence Platform — {new Date().getFullYear()}</div>
        </div>

        <h1 className="axm-hero-h1">
          <span className="axm-hero-line" style={{ opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(50px)', transition: 'opacity 0.9s 0.3s cubic-bezier(0.19,1,0.22,1), transform 0.9s 0.3s cubic-bezier(0.19,1,0.22,1)' }}>
            <ScrambleText text="ANALYZE" trigger={ready} />
          </span>
          <span className="axm-hero-line axm-hero-line--stroke" style={{ opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(50px)', transition: 'opacity 0.9s 0.45s cubic-bezier(0.19,1,0.22,1), transform 0.9s 0.45s cubic-bezier(0.19,1,0.22,1)' }}>
            <ScrambleText text="YOUR ADS" trigger={ready} />
          </span>
        </h1>

        {/* Foot row */}
        <div className="flex items-end justify-between mt-8 mb-12"
          style={{ opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(16px)', transition: 'opacity 0.8s 0.65s, transform 0.8s 0.65s' }}>
          <div className="max-w-sm">
            <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-7">
              {t.hero.subheading}
            </p>
            {/* Scarcity badge */}
            <div className="inline-flex items-center gap-2 border border-amber/25 bg-amber/5 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
              <span className="text-xs text-amber font-medium">{t.hero.scarcity}</span>
            </div>
            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-4">
              {isLoggedIn ? (
                <MagBtn href="/app" variant="fill">{t.hero.ctaDashboard} <span className="axm-mag-btn-arr">↗</span></MagBtn>
              ) : (
                <>
                  <MagBtn href="/sign-up" variant="fill">{t.hero.ctaStart} <span className="axm-mag-btn-arr">↗</span></MagBtn>
                  <MagBtn href="#how-it-works">{t.hero.ctaHow}</MagBtn>
                </>
              )}
            </div>
            {!isLoggedIn && (
              <p className="text-xs text-text-muted mt-4">{t.hero.freeAnalyses}</p>
            )}
          </div>

          {/* Scroll indicator */}
          <div className="hidden sm:flex flex-col items-center gap-2 text-xs text-text-muted tracking-widest uppercase font-heading">
            <div className="axm-scroll-track"><div className="axm-scroll-thumb" /></div>
            <span>Scroll</span>
          </div>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center gap-x-10 gap-y-3 py-5 px-6 rounded-2xl border border-surface-500/40 bg-surface-800/30 backdrop-blur-sm max-w-xl mb-14"
          style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.8s 0.8s' }}>
          {[
            { value: '10K+', label: 'Ads Analyzed' },
            { value: '8', label: 'Platforms' },
            { value: '<60s', label: 'Analysis Time' },
            { value: '6', label: 'AI Personas' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className="text-xl font-bold font-heading gradient-text-amber">{s.value}</span>
              <span className="text-[11px] text-text-muted">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Product showcase card */}
        <div className="max-w-3xl animate-fade-up" style={{ animationDelay: '0.9s' }}>
          <div className="relative rounded-2xl border border-surface-500/60 bg-surface-800/60 backdrop-blur-xl overflow-hidden glow-amber">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent" />

            {/* Card header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-500/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber/10 flex items-center justify-center">
                  <Sparkles size={15} className="text-amber" />
                </div>
                <div>
                  <p className="text-sm font-bold font-heading tracking-wide">{t.hero.cardTitle}</p>
                  <p className="text-[11px] text-text-muted">{t.hero.cardFile}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 border border-success/20 px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[11px] font-medium text-success">{t.hero.cardStatus}</span>
              </span>
            </div>

            {/* Scores */}
            <div className="px-6 py-6">
              <div className="flex items-center justify-center gap-10 mb-7">
                <ScoreRing score={8.5} label={t.hero.scoreHook} color="#5B9A6B" delay="0.7s" />
                <ScoreRing score={7.2} label={t.hero.scoreVisual} color="#C8FF00" delay="0.85s" />
                <ScoreRing score={9.1} label={t.hero.scoreCta} color="#5B9A6B" delay="1s" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-surface-700/60 border border-surface-500/60 p-4 hover:border-amber/20 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-lg bg-amber/10 flex items-center justify-center"><Zap size={11} className="text-amber" /></div>
                    <span className="text-[10px] font-bold text-amber uppercase tracking-wider">{t.hero.fixItLabel}</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">{t.hero.fixItText}<span className="text-white font-medium">{t.hero.fixItSuggestion}</span></p>
                </div>
                <div className="rounded-xl bg-surface-700/60 border border-surface-500/60 p-4 hover:border-success/20 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-lg bg-success/10 flex items-center justify-center"><TrendingUp size={11} className="text-success" /></div>
                    <span className="text-[10px] font-bold text-success uppercase tracking-wider">{t.hero.verdictLabel}</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">{t.hero.verdictText}<span className="text-white font-medium">{t.hero.verdictHighlight}</span>{t.hero.verdictEnd}</p>
                </div>
                <div className="rounded-xl bg-surface-700/60 border border-surface-500/60 p-4 hover:border-surface-500 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-lg bg-surface-500/50 flex items-center justify-center"><Eye size={11} className="text-text-muted" /></div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t.hero.personasLabel}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {['S', 'M', 'P', 'J'].map((init, i) => (
                      <div key={init} className="w-6 h-6 rounded-full bg-surface-500 border border-surface-500/50 flex items-center justify-center text-[9px] font-medium text-text-muted" style={{ marginLeft: i > 0 ? '-4px' : 0 }}>
                        {init}
                      </div>
                    ))}
                    <span className="text-[10px] text-text-muted ml-2">{t.hero.personasMore}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ghost text */}
      <div className="axm-hero-ghost" aria-hidden>10X</div>
    </section>
  )
}
