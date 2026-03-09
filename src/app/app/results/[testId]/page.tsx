'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { ArrowLeft } from 'lucide-react'
import { Tabs } from '@/components/ui/Tabs'
import { ScoreBreakdown } from '@/components/results/ScoreBreakdown'
import { PersonaFeedbackCard } from '@/components/results/PersonaFeedbackCard'
import { AgentDebateView } from '@/components/results/AgentDebateView'
import { FixItSuggestions } from '@/components/results/FixItSuggestions'
import { AttentionHeatmap } from '@/components/results/AttentionHeatmap'
import { CompetitiveBenchmark } from '@/components/results/CompetitiveBenchmark'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'debate', label: 'Debate' },
  { id: 'heatmap', label: 'Heatmap' },
  { id: 'benchmarks', label: 'Benchmarks' },
]

export default function ResultsPage() {
  const params = useParams()
  const testId = params.testId as Id<'tests'>
  const [activeTab, setActiveTab] = useState('overview')

  const test = useQuery(api.tests.getTest, { testId })
  const feedbacks = useQuery(api.results.getPersonaFeedbacks, { testId })
  const debate = useQuery(api.results.getDebate, { testId })
  const heatmap = useQuery(api.results.getHeatmap, { testId })
  const fixIts = useQuery(api.results.getFixIts, { testId })
  const benchmarks = useQuery(api.results.getBenchmarks, { testId })

  if (test === undefined) {
    return (
      <div className="max-w-6xl flex items-center justify-center py-20">
        <div className="w-10 h-10 rounded-full border-2 border-amber border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!test) {
    return (
      <div className="max-w-6xl py-20 text-center">
        <p className="text-text-muted">Test not found</p>
      </div>
    )
  }

  const dateStr = new Date(test.createdAt).toLocaleDateString()

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/app"
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-heading">{test.name}</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {test.personaCount} personas &middot; {test.status} &middot; {dateStr}
          </p>
        </div>
      </div>

      {test.status === 'running' && (
        <div className="rounded-xl bg-surface-700 border border-amber/20 p-6 flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-amber border-t-transparent animate-spin" />
          <p className="text-sm text-text-primary font-medium">Analysis in progress...</p>
          <p className="text-xs text-text-muted">Results will appear as they complete</p>
        </div>
      )}

      {test.status === 'failed' && (
        <div className="rounded-xl bg-danger/10 border border-danger/20 p-6 text-center">
          <p className="text-sm text-danger">Analysis failed. Please try again.</p>
        </div>
      )}

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScoreBreakdown
            metrics={test.metrics}
            overallScore={test.overallScore}
          />
          <FixItSuggestions suggestions={fixIts?.suggestions} />
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedbacks?.map((f) => (
            <PersonaFeedbackCard key={f._id} feedback={f} />
          ))}
          {feedbacks?.length === 0 && (
            <p className="text-sm text-text-muted col-span-2 text-center py-8">
              No feedback yet — analysis may still be running.
            </p>
          )}
        </div>
      )}

      {activeTab === 'debate' && (
        <AgentDebateView exchanges={debate?.exchanges} />
      )}

      {activeTab === 'heatmap' && (
        <AttentionHeatmap zones={heatmap?.zones} />
      )}

      {activeTab === 'benchmarks' && (
        <CompetitiveBenchmark entries={benchmarks?.entries} />
      )}
    </div>
  )
}
