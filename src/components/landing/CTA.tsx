'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useReveal } from '@/hooks/useReveal'
import { authClient } from '@/lib/auth-client'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function CTA() {
  const ref = useReveal()
  const { data: session, isPending } = authClient.useSession()
  const isLoggedIn = !isPending && !!session
  const { t, locale } = useLanguage()

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setSubmitting(true)
    // Simulate brief delay for UX
    await new Promise(r => setTimeout(r, 800))
    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <section className="relative py-24 sm:py-32 px-4">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber/6 rounded-full blur-[120px] pointer-events-none" />

      <div ref={ref} className="relative max-w-6xl mx-auto reveal">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: CTA copy */}
          <div>
            <p className="text-sm font-medium text-amber uppercase tracking-wider mb-4">Get Started</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading tracking-tight mb-5">
              {t.cta.headlinePre}
              <span className="gradient-text-amber">{t.cta.headlineAccent}</span>
            </h2>
            <p className="text-text-muted text-base sm:text-lg mb-8 leading-relaxed max-w-md">
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
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link href="/sign-up">
                  <Button size="lg">
                    {t.cta.ctaStart}
                    <ArrowRight size={18} className={locale === 'ar' ? 'rotate-180' : ''} />
                  </Button>
                </Link>
              </div>
            )}

            {!isLoggedIn && (
              <div className="mt-5 space-y-1">
                <p className="text-xs text-text-muted">{t.cta.noCreditCard}</p>
                <p className="text-xs text-amber/70">{t.cta.spotsRemaining}</p>
              </div>
            )}
          </div>

          {/* Right: Contact form with CEO profile bubble */}
          <div className="relative">
            <div className="rounded-2xl bg-surface-800/60 backdrop-blur-sm border border-surface-500/60 p-7 sm:p-8">
              {/* Top gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent rounded-t-2xl" />

              {/* CEO profile bubble / header */}
              <div className="flex items-center gap-4 mb-7">
                <div className="relative shrink-0">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-amber/10 border-2 border-amber/25 flex items-center justify-center text-amber font-bold font-heading text-lg">
                    W
                  </div>
                  {/* Online indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-surface-800" />
                </div>
                <div>
                  <p className="text-sm font-semibold font-heading">Message the Team</p>
                  <p className="text-xs text-text-muted">We reply within a few hours</p>
                </div>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-success/10 border border-success/25 flex items-center justify-center">
                    <CheckCircle size={28} className="text-success" />
                  </div>
                  <div>
                    <p className="font-semibold font-heading text-lg mb-1">Message Sent!</p>
                    <p className="text-sm text-text-muted">We&apos;ll get back to you within 24 hours.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      required
                      className="w-full rounded-xl bg-surface-700/60 border border-surface-500/60 px-4 py-3 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-amber/40 focus:bg-surface-700/80 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Work email"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      required
                      className="w-full rounded-xl bg-surface-700/60 border border-surface-500/60 px-4 py-3 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-amber/40 focus:bg-surface-700/80 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="What are you working on? (optional)"
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      rows={3}
                      className="w-full rounded-xl bg-surface-700/60 border border-surface-500/60 px-4 py-3 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-amber/40 focus:bg-surface-700/80 transition-all duration-200 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber text-black font-semibold text-sm py-3 px-6 hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <>
                        <Send size={15} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
