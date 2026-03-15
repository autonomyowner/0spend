'use client'

import { useState, useRef } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import { useReveal } from '@/hooks/useReveal'
import { authClient } from '@/lib/auth-client'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function CTA() {
  const ref = useReveal()
  const { data: session, isPending } = authClient.useSession()
  const isLoggedIn = !isPending && !!session
  const { t } = useLanguage()

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    setSubmitting(false)
    setSubmitted(true)
  }

  /* Magnetic btn */
  const magRef = useRef<HTMLAnchorElement>(null)
  const onMagMove = (e: React.MouseEvent) => {
    const r = magRef.current!.getBoundingClientRect()
    magRef.current!.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`
  }
  const onMagLeave = () => { if (magRef.current) magRef.current.style.transform = '' }

  return (
    <section className="relative py-28 sm:py-40 px-4 sm:px-16 border-t border-surface-500 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-amber/[0.05] rounded-full blur-[140px] pointer-events-none" />

      <div ref={ref} className="relative max-w-6xl mx-auto reveal">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: Massive headline + CTA */}
          <div>
            <div className="axm-tag">Let&apos;s Work Together</div>
            <h2 className="font-heading font-black uppercase leading-none mb-8"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 10rem)', letterSpacing: '-0.01em', lineHeight: '0.9' }}>
              {t.cta.headlinePre}
              <span className="text-amber">{t.cta.headlineAccent}</span>
            </h2>

            <p className="text-text-muted text-base sm:text-lg mb-10 leading-relaxed max-w-md">
              {t.cta.description}
            </p>

            {isLoggedIn ? (
              <a
                ref={magRef}
                href="/app"
                onMouseMove={onMagMove}
                onMouseLeave={onMagLeave}
                className="axm-mag-btn inline-flex"
                style={{ transition: 'background 0.4s, border-color 0.4s, color 0.4s, transform 0.4s cubic-bezier(0.19,1,0.22,1)' }}
              >
                {t.cta.ctaDashboard} <span className="axm-mag-btn-arr">↗</span>
              </a>
            ) : (
              <div className="flex flex-col gap-4">
                <a
                  ref={magRef}
                  href="/sign-up"
                  onMouseMove={onMagMove}
                  onMouseLeave={onMagLeave}
                  className="axm-mag-btn inline-flex"
                  style={{ transition: 'background 0.4s, border-color 0.4s, color 0.4s, transform 0.4s cubic-bezier(0.19,1,0.22,1)' }}
                >
                  {t.cta.ctaStart} <span className="axm-mag-btn-arr">↗</span>
                </a>
                {!isLoggedIn && (
                  <div className="space-y-1">
                    <p className="text-xs text-text-muted">{t.cta.noCreditCard}</p>
                    <p className="text-xs text-amber/70">{t.cta.spotsRemaining}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Contact form */}
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/25 to-transparent" />
            <div className="pt-8">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full bg-amber/10 border border-amber/25 flex items-center justify-center text-amber font-heading font-bold text-lg">W</div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-bg" />
                </div>
                <div>
                  <p className="text-sm font-heading font-bold uppercase tracking-wider">Message the Team</p>
                  <p className="text-xs text-text-muted">We reply within a few hours</p>
                </div>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center border border-surface-500 rounded-2xl">
                  <div className="w-14 h-14 rounded-full bg-success/10 border border-success/25 flex items-center justify-center">
                    <CheckCircle size={26} className="text-success" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xl uppercase tracking-wide mb-1">Message Sent!</p>
                    <p className="text-sm text-text-muted">We&apos;ll get back to you within 24 hours.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                    className="w-full rounded-xl bg-surface-800/60 border border-surface-500/60 px-4 py-3.5 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-amber/40 transition-all duration-200 font-body"
                  />
                  <input
                    type="email"
                    placeholder="Work email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    required
                    className="w-full rounded-xl bg-surface-800/60 border border-surface-500/60 px-4 py-3.5 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-amber/40 transition-all duration-200 font-body"
                  />
                  <textarea
                    placeholder="What are you working on? (optional)"
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    rows={3}
                    className="w-full rounded-xl bg-surface-800/60 border border-surface-500/60 px-4 py-3.5 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-amber/40 transition-all duration-200 resize-none font-body"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber text-black font-heading font-bold text-sm py-3.5 uppercase tracking-wide hover:bg-amber/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 cursor-none"
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
                      <><Send size={14} /> Send Message</>
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
