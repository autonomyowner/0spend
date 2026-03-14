'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Tabs } from '@/components/ui/Tabs'
import { ScoreBreakdown } from '@/components/results/ScoreBreakdown'
import { PersonaFeedbackCard } from '@/components/results/PersonaFeedbackCard'
import { AgentDebateView } from '@/components/results/AgentDebateView'
import { FixItSuggestions } from '@/components/results/FixItSuggestions'
import { AttentionHeatmap } from '@/components/results/AttentionHeatmap'
import { CompetitiveBenchmark } from '@/components/results/CompetitiveBenchmark'
import { EmotionalProfile } from '@/components/results/EmotionalProfile'
import { PredictedPerformance } from '@/components/results/PredictedPerformance'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function ResultsPage() {
  const { t, locale } = useLanguage()

  const tabs = [
    { id: 'overview', label: t.app.resultsDetail.overview },
    { id: 'feedback', label: t.app.resultsDetail.feedback },
    { id: 'debate', label: t.app.resultsDetail.debate },
    { id: 'heatmap', label: t.app.resultsDetail.heatmap },
    { id: 'predictions', label: t.app.resultsDetail.predictions },
    { id: 'emotions', label: t.app.resultsDetail.emotions },
    { id: 'benchmarks', label: t.app.resultsDetail.benchmarks },
  ]
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as Id<'tests'>
  const [activeTab, setActiveTab] = useState('overview')
  const [deleting, setDeleting] = useState(false)

  const test = useQuery(api.tests.getTest, { testId })
  const feedbacks = useQuery(api.results.getPersonaFeedbacks, { testId })
  const debate = useQuery(api.results.getDebate, { testId })
  const heatmap = useQuery(api.results.getHeatmap, { testId })
  const fixIts = useQuery(api.results.getFixIts, { testId })
  const benchmarks = useQuery(api.results.getBenchmarks, { testId })
  const emotionalProfile = useQuery(api.results.getEmotionalProfile, { testId })
  const predictedPerformance = useQuery(api.results.getPredictedPerformance, { testId })
  const creative = useQuery(
    api.creatives.getCreative,
    test?.creativeId ? { creativeId: test.creativeId } : "skip"
  )
  const creativeUrl = useQuery(
    api.creatives.getCreativeUrl,
    test?.creativeId ? { creativeId: test.creativeId } : "skip"
  )
  const deleteTest = useMutation(api.tests.deleteTest)

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
        <p className="text-text-muted">{t.app.resultsDetail.testNotFound}</p>
      </div>
    )
  }

  async function handleDelete() {
    if (!confirm(t.app.resultsDetail.deleteConfirm)) return
    setDeleting(true)
    try {
      await deleteTest({ testId })
      router.push('/app/results')
    } catch {
      setDeleting(false)
    }
  }

  const dateStr = new Date(test.createdAt).toLocaleDateString()

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/app/results"
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-700 transition-colors"
          >
            <ArrowLeft size={20} className={locale === 'ar' ? 'rotate-180' : ''} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-heading">{test.name}</h1>
            <p className="text-sm text-text-muted mt-0.5 flex flex-wrap items-center gap-1.5">
              {test.format && test.format !== 'image' && (
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-surface-600 text-text-muted border border-surface-500">
                  {test.format === 'landing_page' ? 'Page' : test.format}
                </span>
              )}
              {test.platform && test.platform !== 'generic' && (
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber/8 text-amber/70 border border-amber/15">
                  {test.platform.replace('_', ' ')}
                </span>
              )}
              {test.objective && test.objective !== 'conversion' && (
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-surface-600 text-text-muted border border-surface-500">
                  {test.objective.replace('_', ' ')}
                </span>
              )}
              <span>{test.personaCount} {t.app.recentTests.personas} &middot; {t.app.status[test.status as keyof typeof t.app.status] || test.status} &middot; {dateStr}</span>
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
          title="Delete test"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Creative preview */}
      {creativeUrl && (
        <div className="rounded-xl bg-surface-700 border border-surface-500 overflow-hidden">
          {test.format === 'video' ? (
            <video
              src={creativeUrl}
              controls
              className="w-full max-h-64"
            />
          ) : (
            <img
              src={creativeUrl}
              alt={test.name}
              className="w-full h-auto max-h-64 object-contain"
            />
          )}
          {creative?.sourceUrl && (
            <div className="p-3 border-t border-surface-500">
              <a
                href={creative.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber hover:underline truncate block"
              >
                {creative.sourceUrl}
              </a>
            </div>
          )}
        </div>
      )}

      {test.status === 'running' && (
        <div className="rounded-xl bg-surface-700 border border-amber/20 p-6 flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-amber border-t-transparent animate-spin" />
          <p className="text-sm text-text-primary font-medium">{t.app.resultsDetail.inProgress}</p>
          <p className="text-xs text-text-muted">{t.app.resultsDetail.resultsWillAppear}</p>
        </div>
      )}

      {test.status === 'failed' && (
        <div className="rounded-xl bg-danger/10 border border-danger/20 p-6 text-center">
          <p className="text-sm text-danger">{t.app.resultsDetail.analysisFailed}</p>
        </div>
      )}

      {test.status === 'completed' && (
        <>
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
              {feedbacks && feedbacks.length > 0 ? (
                feedbacks.map((f) => (
                  <PersonaFeedbackCard key={f._id} feedback={f} />
                ))
              ) : (
                <p className="text-sm text-text-muted col-span-2 text-center py-8">
                  {t.app.resultsDetail.noFeedback}
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

          {activeTab === 'predictions' && (
            <PredictedPerformance
              predictions={predictedPerformance?.predictions}
              overallVerdict={predictedPerformance?.overallVerdict}
              spendEfficiency={predictedPerformance?.spendEfficiency}
              confidence={predictedPerformance?.confidence}
            />
          )}

          {activeTab === 'emotions' && (
            <EmotionalProfile
              emotions={emotionalProfile?.emotions}
              dominantEmotion={emotionalProfile?.dominantEmotion}
              emotionalTone={emotionalProfile?.emotionalTone}
              recommendations={emotionalProfile?.recommendations}
            />
          )}

          {activeTab === 'benchmarks' && (
            <CompetitiveBenchmark entries={benchmarks?.entries} />
          )}
        </>
      )}
    </div>
  )
}
