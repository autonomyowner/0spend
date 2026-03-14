'use client'

import { useState, useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import { GitCompareArrows, Check, Trophy, TrendingUp, TrendingDown, Minus, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

function getScoreColor(score: number): string {
  if (score >= 7) return 'text-success'
  if (score >= 5) return 'text-amber'
  return 'text-danger'
}

function getScoreBg(score: number): string {
  if (score >= 7) return 'bg-success'
  if (score >= 5) return 'bg-amber'
  return 'bg-danger'
}

function DiffIndicator({ value, baseline }: { value: number; baseline: number }) {
  const diff = value - baseline
  if (Math.abs(diff) < 0.1) return <Minus size={14} className="text-text-muted" />
  if (diff > 0) return <TrendingUp size={14} className="text-success" />
  return <TrendingDown size={14} className="text-danger" />
}

export default function ComparePage() {
  const { t } = useLanguage()
  const tests = useQuery(api.tests.listUserTests, {})
  const completedTests = useMemo(
    () => tests?.filter((t) => t.status === 'completed' && t.overallScore) || [],
    [tests]
  )
  const [selectedIds, setSelectedIds] = useState<Id<'tests'>[]>([])
  const [pickerOpen, setPickerOpen] = useState(true)

  const selectedTests = useMemo(
    () => completedTests.filter((t) => selectedIds.includes(t._id)),
    [completedTests, selectedIds]
  )

  // Find winner
  const winner = useMemo(() => {
    if (selectedTests.length < 2) return null
    return selectedTests.reduce((best, t) =>
      (t.overallScore ?? 0) > (best.overallScore ?? 0) ? t : best
    )
  }, [selectedTests])

  // Collect all unique metric labels across selected tests
  const allMetricLabels = useMemo(() => {
    const labels = new Set<string>()
    selectedTests.forEach((t) =>
      t.metrics?.forEach((m) => labels.add(m.label))
    )
    return Array.from(labels)
  }, [selectedTests])

  function toggleTest(id: Id<'tests'>) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 4 ? prev : [...prev, id]
    )
  }

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading">{t.app.compare.title}</h1>
        <p className="text-sm text-text-muted mt-1">{t.app.compare.subtitle}</p>
      </div>

      {/* Test Picker */}
      <div className="rounded-2xl bg-surface-700/60 backdrop-blur-sm border border-surface-500/60 overflow-hidden">
        <button
          onClick={() => setPickerOpen(!pickerOpen)}
          className="w-full flex items-center justify-between p-4 text-left cursor-pointer hover:bg-amber/[0.02] transition-colors"
        >
          <div className="flex items-center gap-3">
            <GitCompareArrows size={20} className="text-amber" />
            <span className="text-sm font-medium">
              {t.app.compare.selectTests}
              {selectedIds.length > 0 && (
                <span className="text-text-muted ml-2">({selectedIds.length}/4)</span>
              )}
            </span>
          </div>
          <ChevronDown
            size={16}
            className={`text-text-muted transition-transform duration-200 ${pickerOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {pickerOpen && (
          <div className="border-t border-surface-500/40 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
            {completedTests.length === 0 && (
              <p className="text-sm text-text-muted col-span-2 text-center py-6">
                {t.app.compare.noCompleted}
              </p>
            )}
            {completedTests.map((test) => {
              const isSelected = selectedIds.includes(test._id)
              const isDisabled = !isSelected && selectedIds.length >= 4
              return (
                <button
                  key={test._id}
                  onClick={() => !isDisabled && toggleTest(test._id)}
                  disabled={isDisabled}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-amber/8 border-amber/30 ring-1 ring-amber/20'
                      : isDisabled
                      ? 'bg-surface-800/40 border-surface-500/30 opacity-40 cursor-not-allowed'
                      : 'bg-surface-800/40 border-surface-500/40 hover:border-amber/20 hover:bg-amber/[0.02]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected ? 'bg-amber border-amber' : 'border-surface-500'
                    }`}
                  >
                    {isSelected && <Check size={12} className="text-black" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{test.name}</p>
                    <p className="text-[10px] text-text-muted">
                      {test.platform && test.platform !== 'generic'
                        ? test.platform.replace('_', ' ').toUpperCase() + ' \u00b7 '
                        : ''}
                      {new Date(test.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold font-heading flex-shrink-0 ${getScoreColor(
                      test.overallScore ?? 0
                    )}`}
                  >
                    {test.overallScore?.toFixed(1)}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Comparison View */}
      {selectedTests.length >= 2 && (
        <div className="space-y-6 animate-fade-up">
          {/* Winner Banner */}
          {winner && (
            <div className="relative rounded-2xl bg-amber/8 border border-amber/20 p-4 flex items-center gap-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber/5 to-transparent" />
              <div className="relative w-10 h-10 rounded-xl bg-amber/15 flex items-center justify-center">
                <Trophy size={20} className="text-amber" />
              </div>
              <div className="relative">
                <p className="text-sm font-semibold text-amber">{t.app.compare.winner}</p>
                <p className="text-base font-bold font-heading">{winner.name}</p>
              </div>
              <span className="relative ml-auto text-2xl font-bold font-heading text-amber">
                {winner.overallScore?.toFixed(1)}
              </span>
            </div>
          )}

          {/* Score Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {selectedTests.map((test, i) => {
              const isWinner = winner && test._id === winner._id
              return (
                <div
                  key={test._id}
                  className={`rounded-2xl p-4 border backdrop-blur-sm transition-all ${
                    isWinner
                      ? 'bg-amber/8 border-amber/30 shadow-[0_0_20px_rgba(200,255,0,0.08)]'
                      : 'bg-surface-700/60 border-surface-500/60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {isWinner && (
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber/15 text-amber font-semibold">
                        {t.app.compare.winner}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium truncate mb-1">{test.name}</p>
                  {test.platform && test.platform !== 'generic' && (
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber/8 text-amber/60 border border-amber/10">
                      {test.platform.replace('_', ' ')}
                    </span>
                  )}
                  <div className="mt-4 flex items-end gap-1">
                    <span
                      className={`text-3xl font-bold font-heading ${getScoreColor(
                        test.overallScore ?? 0
                      )}`}
                    >
                      {test.overallScore?.toFixed(1)}
                    </span>
                    <span className="text-xs text-text-muted mb-1">/ 10</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Metric-by-Metric Comparison */}
          {allMetricLabels.length > 0 && (
            <div className="rounded-2xl bg-surface-700/60 backdrop-blur-sm border border-surface-500/60 overflow-hidden">
              <div className="p-4 border-b border-surface-500/40">
                <h2 className="text-base font-semibold font-heading">
                  {t.app.compare.metricBreakdown}
                </h2>
              </div>

              {/* Table Header */}
              <div className="grid gap-px bg-surface-500/20">
                <div
                  className="grid bg-surface-800/60 px-4 py-2.5"
                  style={{
                    gridTemplateColumns: `1fr repeat(${selectedTests.length}, minmax(80px, 1fr))`,
                  }}
                >
                  <span className="text-xs text-text-muted uppercase tracking-wider">
                    {t.app.compare.metric}
                  </span>
                  {selectedTests.map((test, i) => (
                    <span
                      key={test._id}
                      className="text-xs text-text-muted uppercase tracking-wider text-center"
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                  ))}
                </div>

                {/* Metric Rows */}
                {allMetricLabels.map((label) => {
                  const values = selectedTests.map(
                    (t) => t.metrics?.find((m) => m.label === label)?.value ?? 0
                  )
                  const maxVal = Math.max(...values)
                  const baselineAvg = values.reduce((a, b) => a + b, 0) / values.length

                  return (
                    <div
                      key={label}
                      className="grid bg-surface-800/30 px-4 py-3 items-center"
                      style={{
                        gridTemplateColumns: `1fr repeat(${selectedTests.length}, minmax(80px, 1fr))`,
                      }}
                    >
                      <span className="text-sm text-text-primary">{label}</span>
                      {values.map((val, i) => {
                        const isBest = val === maxVal && values.filter((v) => v === maxVal).length === 1
                        return (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-sm font-semibold ${
                                  isBest ? 'text-amber' : getScoreColor(val)
                                }`}
                              >
                                {val.toFixed(1)}
                              </span>
                              <DiffIndicator value={val} baseline={baselineAvg} />
                            </div>
                            <div className="w-full max-w-[80px] h-1.5 rounded-full bg-surface-500/40 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  isBest ? 'bg-amber' : getScoreBg(val)
                                }`}
                                style={{
                                  width: `${(val / 10) * 100}%`,
                                  boxShadow: isBest
                                    ? '0 0 8px rgba(200,255,0,0.3)'
                                    : undefined,
                                }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Summary Verdict */}
          {selectedTests.length >= 2 && winner && (
            <div className="rounded-2xl bg-surface-700/60 backdrop-blur-sm border border-surface-500/60 p-5">
              <h3 className="text-base font-semibold font-heading mb-3">
                {t.app.compare.verdict}
              </h3>
              <div className="space-y-3">
                {selectedTests
                  .sort((a, b) => (b.overallScore ?? 0) - (a.overallScore ?? 0))
                  .map((test, rank) => {
                    const score = test.overallScore ?? 0
                    const isWin = test._id === winner._id
                    return (
                      <div key={test._id} className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isWin
                              ? 'bg-amber/15 text-amber'
                              : 'bg-surface-600/60 text-text-muted'
                          }`}
                        >
                          #{rank + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{test.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 rounded-full bg-surface-500/40 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isWin ? 'bg-amber' : getScoreBg(score)}`}
                              style={{ width: `${(score / 10) * 100}%` }}
                            />
                          </div>
                          <span
                            className={`text-sm font-bold font-heading w-8 text-right ${getScoreColor(
                              score
                            )}`}
                          >
                            {score.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state when less than 2 selected */}
      {selectedTests.length < 2 && (
        <div className="rounded-2xl bg-surface-700/30 border border-surface-500/30 border-dashed p-12 text-center">
          <GitCompareArrows size={40} className="text-text-faint mx-auto mb-3" />
          <p className="text-sm text-text-muted">{t.app.compare.emptyState}</p>
        </div>
      )}
    </div>
  )
}
