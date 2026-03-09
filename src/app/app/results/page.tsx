'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Badge } from '@/components/ui/Badge'

const statusVariant = {
  completed: 'success' as const,
  running: 'amber' as const,
  failed: 'danger' as const,
}

export default function ResultsListPage() {
  const tests = useQuery(api.tests.listUserTests, {})

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">All Results</h1>
        <p className="text-sm text-text-muted mt-1">
          {tests ? `${tests.length} tests total` : 'Loading...'}
        </p>
      </div>

      {tests && tests.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-text-muted">No tests yet. Go to Analyze to run your first test.</p>
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
                {test.personaCount} personas &middot; {test.status} &middot; {new Date(test.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {test.overallScore && test.overallScore > 0 && (
                <span className={`text-sm font-bold font-heading ${test.overallScore >= 7 ? 'text-success' : test.overallScore >= 5 ? 'text-amber' : 'text-danger'}`}>
                  {test.overallScore}
                </span>
              )}
              <Badge variant={statusVariant[test.status]}>
                {test.status}
              </Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
