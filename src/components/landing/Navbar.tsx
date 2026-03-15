'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { authClient } from '@/lib/auth-client'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session, isPending } = authClient.useSession()
  const isLoggedIn = !isPending && !!session
  const { locale, setLocale, t } = useLanguage()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: t.nav.howItWorks, href: '#how-it-works' },
    { label: t.nav.features, href: '#features' },
    { label: t.nav.pricing, href: '#pricing' },
  ]

  return (
    <nav className={cn('axm-nav', scrolled && 'scrolled')}>
      {/* Logo */}
      <Link href="/" className="axm-nav-logo">
        <img src="/logo-without-background.png" alt="10xSpend" className="h-7 w-auto" />
        10xSpend<sup>®</sup>
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="axm-nav-link">
            {link.label}
          </a>
        ))}
      </div>

      {/* Desktop CTAs */}
      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-surface-500/60 bg-surface-800/40 hover:border-amber/30 transition-all duration-300 cursor-none"
          title={locale === 'en' ? 'العربية' : 'English'}
        >
          <Globe size={13} className="text-text-muted" />
          <span className="text-xs font-medium text-text-muted tracking-wider">
            {locale === 'en' ? 'AR' : 'EN'}
          </span>
        </button>

        {isPending ? (
          <div className="w-20 h-8" />
        ) : isLoggedIn ? (
          <Link href="/app"><Button size="sm">{t.nav.dashboard}</Button></Link>
        ) : (
          <>
            <Link href="/sign-in"><Button variant="ghost" size="sm">{t.nav.signIn}</Button></Link>
            <Link href="/sign-up">
              <button className="axm-mag-btn" style={{ padding: '0.55rem 1.4rem', fontSize: '0.78rem' }}>
                {t.nav.getStarted} <span className="axm-mag-btn-arr">↗</span>
              </button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile toggle */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-surface-500/60 bg-surface-800/40 cursor-none"
        >
          <Globe size={13} className="text-text-muted" />
          <span className="text-xs text-text-muted">{locale === 'en' ? 'AR' : 'EN'}</span>
        </button>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-text-muted hover:text-white cursor-none"
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5 w-5">
            <span className={cn('block h-px bg-current transition-all duration-300', open && 'rotate-45 translate-y-2')} />
            <span className={cn('block h-px bg-current transition-all duration-300', open && 'opacity-0')} />
            <span className={cn('block h-px bg-current transition-all duration-300', open && '-rotate-45 -translate-y-2')} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        'md:hidden absolute top-full left-0 right-0 border-t border-surface-500/60 bg-surface-900/95 backdrop-blur-md overflow-hidden transition-all duration-300',
        open ? 'max-h-64 py-4' : 'max-h-0'
      )}>
        <div className="flex flex-col gap-2 px-6">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}
              className="text-sm text-text-muted hover:text-white transition-colors py-2 uppercase tracking-widest font-heading font-bold"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-3 pt-3 border-t border-surface-500/40">
            {isLoggedIn ? (
              <Link href="/app" className="flex-1"><Button size="sm" className="w-full">{t.nav.dashboard}</Button></Link>
            ) : (
              <>
                <Link href="/sign-in" className="flex-1"><Button variant="secondary" size="sm" className="w-full">{t.nav.signIn}</Button></Link>
                <Link href="/sign-up" className="flex-1"><Button size="sm" className="w-full">{t.nav.getStarted}</Button></Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
