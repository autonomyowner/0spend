'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const columnHrefs = [
  ['#features', '#pricing', '#how-it-works', '#'],
  ['#', '#', '#', '#'],
  ['#', '#', '#', '#'],
  ['#', '#', '#'],
]

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-surface-500/50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <img src="/logo-without-background.png" alt="0spend" className="h-8 w-auto" />
              <span className="font-heading font-semibold text-text-primary tracking-tight">
                0spend
              </span>
            </Link>
            <p className="text-xs text-text-muted leading-relaxed">
              {t.footer.tagline}
            </p>
          </div>

          {t.footer.columns.map((col, ci) => (
            <div key={ci}>
              <h4 className="text-sm font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((label, li) => (
                  <li key={li}>
                    <a href={columnHrefs[ci]?.[li] ?? '#'} className="text-sm text-text-muted hover:text-amber transition-colors duration-200">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-surface-500 text-center">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
