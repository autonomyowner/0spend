'use client'

import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { StatsRow } from '@/components/dashboard/StatsRow'
import { ScoreChart } from '@/components/dashboard/ScoreChart'
import { RecentTests } from '@/components/dashboard/RecentTests'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function DashboardPage() {
  const stats = useQuery(api.dashboard.stats)
  const recentTests = useQuery(api.dashboard.recentTests)
  const scoreTrend = useQuery(api.dashboard.scoreTrend)
  const { t } = useLanguage()

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold font-heading">{t.app.dashboard.title}</h1>
        <p className="text-sm text-text-muted mt-1">{t.app.dashboard.subtitle}</p>
      </div>

      <StatsRow stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6">
        <div className="lg:col-span-2">
          <ScoreChart data={scoreTrend} />
        </div>
        <div className="lg:col-span-3">
          <RecentTests tests={recentTests} />
        </div>
      </div>

      <div className="hidden lg:block">
        <h2 className="text-sm font-semibold font-heading mb-3">{t.app.dashboard.quickActions}</h2>
        <QuickActions />
      </div>
    </div>
  )
}
