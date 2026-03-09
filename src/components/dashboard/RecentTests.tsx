import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface Test {
  _id: string
  name: string
  personaCount: number
  overallScore?: number
  status: 'running' | 'completed' | 'failed'
  createdAt: number
}

interface RecentTestsProps {
  tests?: Test[]
}

const statusVariant = {
  completed: 'success' as const,
  running: 'amber' as const,
  failed: 'danger' as const,
}

export function RecentTests({ tests }: RecentTestsProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold font-heading">Recent Tests</h3>
        <Link href="/app/results" className="text-xs text-amber hover:underline">View all</Link>
      </div>
      {(!tests || tests.length === 0) ? (
        <div className="py-8 text-center">
          <p className="text-sm text-text-muted">No tests yet. Run your first analysis!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tests.map((test) => (
            <Link
              key={test._id}
              href={`/app/results/${test._id}`}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-600 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{test.name}</p>
                <p className="text-xs text-text-muted">
                  {test.personaCount} personas &middot; {new Date(test.createdAt).toLocaleDateString()}
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
      )}
    </Card>
  )
}
