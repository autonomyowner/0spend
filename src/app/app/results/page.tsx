'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Badge } from '@/components/ui/Badge'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const statusVariant = {
  completed: 'success' as const,
  running: 'amber' as const,
  failed: 'danger' as const,
}

export default function ResultsListPage() {
  const tests = useQuery(api.tests.listUserTests, {})
  const { t } = useLanguage()

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">{t.app.resultsList.title}</h1>
        <p className="text-sm text-text-muted mt-1">
          {tests ? `${tests.length} ${t.app.resultsList.testsTotal}` : t.app.personasPage.loading}
        </p>
      </div>

      {tests && tests.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-text-muted">{t.app.resultsList.noTests}</p>
        </div>
      )}

      <div className="space-y-3">
        {tests?.map((test) => (
          <Link
            key={test._id}
            href={`/app/results/${test._id}`}
            className="flex items-center gap-4 p-4 rounded-xl bg-surface-700 border border-surface-500 hover:border-amber/20 transition-all"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{test.name}</p>
              <p className="text-xs text-text-muted">
                {test.personaCount} {t.app.recentTests.personas} &middot; {t.app.status[test.status as keyof typeof t.app.status] || test.status} &middot; {new Date(test.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {test.format && test.format !== 'image' && (
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-600 text-text-muted border border-surface-500">
                  {test.format === 'landing_page' ? 'Page' : test.format}
                </span>
              )}
              {test.overallScore && test.overallScore > 0 && (
                <span className={`text-sm font-bold font-heading ${test.overallScore >= 7 ? 'text-success' : test.overallScore >= 5 ? 'text-amber' : 'text-danger'}`}>
                  {test.overallScore}
                </span>
              )}
              <Badge variant={statusVariant[test.status]}>
                {t.app.status[test.status as keyof typeof t.app.status] || test.status}
              </Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
