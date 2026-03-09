'use client'

import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { StatsRow } from '@/components/dashboard/StatsRow'
import { ScoreChart } from '@/components/dashboard/ScoreChart'
import { RecentTests } from '@/components/dashboard/RecentTests'
import { QuickActions } from '@/components/dashboard/QuickActions'

export default function DashboardPage() {
  const stats = useQuery(api.dashboard.stats)
  const recentTests = useQuery(api.dashboard.recentTests)
  const scoreTrend = useQuery(api.dashboard.scoreTrend)

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold font-heading">Dashboard</h1>
        <p className="text-sm text-text-muted mt-1">Overview of your creative testing performance</p>
      </div>

      <StatsRow stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <ScoreChart data={scoreTrend} />
        </div>
        <div className="lg:col-span-3">
          <RecentTests tests={recentTests} />
        </div>
      </div>

      <div className="hidden lg:block">
        <h2 className="text-sm font-semibold font-heading mb-3">Quick Actions</h2>
        <QuickActions />
      </div>
    </div>
  )
}
