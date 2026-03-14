'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Globe } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { authClient } from '@/lib/auth-client'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { data: session, isPending } = authClient.useSession()
  const isLoggedIn = !isPending && !!session
  const { locale, setLocale, t } = useLanguage()

  const navLinks = [
    { label: t.nav.howItWorks, href: '#how-it-works' },
    { label: t.nav.features, href: '#features' },
    { label: t.nav.pricing, href: '#pricing' },
  ]

  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      <div className="max-w-6xl mx-auto rounded-2xl border border-surface-500 bg-surface-800/80 backdrop-blur-md px-5 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo-without-background.png" alt="0spend" className="h-8 w-auto" />
            <span className="font-heading font-semibold text-text-primary tracking-tight text-lg">
              0spend
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs + Language toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-surface-500/60 bg-surface-700/40 hover:border-amber/20 hover:bg-surface-700/60 transition-all duration-300 cursor-pointer"
              title={locale === 'en' ? 'العربية' : 'English'}
            >
              <Globe size={14} className="text-text-muted" />
              <span className="text-xs font-medium text-text-muted">
                {locale === 'en' ? 'AR' : 'EN'}
              </span>
            </button>

            {isPending ? (
              <div className="w-20 h-8" />
            ) : isLoggedIn ? (
              <Link href="/app">
                <Button size="sm">{t.nav.dashboard}</Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">{t.nav.signIn}</Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">{t.nav.getStarted}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-surface-500/60 bg-surface-700/40 hover:border-amber/20 transition-all duration-300 cursor-pointer"
            >
              <Globe size={14} className="text-text-muted" />
              <span className="text-xs font-medium text-text-muted">
                {locale === 'en' ? 'AR' : 'EN'}
              </span>
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg text-text-muted hover:text-text-primary cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={cn(
          'md:hidden overflow-hidden transition-all duration-200',
          open ? 'max-h-64 mt-4 pb-2' : 'max-h-0'
        )}>
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-text-muted hover:text-text-primary transition-colors py-1"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2 border-t border-surface-500">
              {isLoggedIn ? (
                <Link href="/app" className="flex-1">
                  <Button size="sm" className="w-full">{t.nav.dashboard}</Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-in" className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">{t.nav.signIn}</Button>
                  </Link>
                  <Link href="/sign-up" className="flex-1">
                    <Button size="sm" className="w-full">{t.nav.getStarted}</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
