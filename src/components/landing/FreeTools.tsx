'use client'

import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function FreeTools() {
  const ref = useReveal()
  const { t } = useLanguage()

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-16 border-t border-surface-500">
      <div ref={ref} className="max-w-6xl mx-auto reveal">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="axm-tag">{t.freeTools.badge}</div>
            <h2 className="axm-section-h2">
              {t.freeTools.headlinePre}
              <em>{t.freeTools.headlineAccent}</em>
            </h2>
          </div>
        </div>

        {/* Free tools as Axiom rows */}
        <div className="border-t border-surface-500">
          {t.freeTools.items.map((item, i) => (
            <Link key={i} href="/sign-up"
              className="axm-row group block"
              style={{ display: 'grid' }}
            >
              <span className="axm-row-num">0{i + 1}</span>
              <div>
                <span className="inline-flex items-center gap-2 border border-amber/20 bg-amber/5 rounded-full px-3 py-0.5 mb-2">
                  <span className="text-[10px] font-heading font-bold text-amber uppercase tracking-wider">Free</span>
                </span>
                <h3 className="axm-row-title">{item.title}</h3>
              </div>
              <p className="axm-row-desc">{item.description}</p>
              <span className="axm-row-arr">↗</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
