'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface OnboardingChecklistProps {
  testCount: number
  creativeCount: number
}

export function OnboardingChecklist({ testCount, creativeCount }: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(false)
  const { t } = useLanguage()

  const steps = [
    { done: true, href: '' },                           // Account created — always done
    { done: creativeCount > 0, href: '/app/analyze' },  // Uploaded a creative
    { done: testCount > 0, href: '/app/analyze' },      // Ran an analysis
  ]

  const completedCount = steps.filter(s => s.done).length
  const allDone = completedCount === steps.length

  if (dismissed || allDone) return null

  const progressPct = (completedCount / steps.length) * 100
  const progressText = t.app.onboarding.progress
    .replace('{count}', String(completedCount))
    .replace('{total}', String(steps.length))

  return (
    <Card className="relative p-5 sm:p-6 overflow-hidden">
      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 p-1 rounded-lg hover:bg-surface-500/30 transition-colors"
      >
        <X size={14} className="text-text-muted" />
      </button>

      <h3 className="text-sm font-semibold font-heading mb-1">{t.app.onboarding.title}</h3>
      <p className="text-xs text-text-muted mb-4">{progressText}</p>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-surface-500/40 mb-5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#FAFF00] via-[#C8FF00] to-[#00FF87] transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {t.app.onboarding.steps.map((step, i) => {
          const isDone = steps[i].done
          const href = steps[i].href

          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-amber/15 border border-amber/30' : 'bg-surface-500/30 border border-surface-500/40'}`}>
                {isDone && <Check size={12} className="text-amber" />}
                {!isDone && <span className="w-2 h-2 rounded-full bg-surface-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isDone ? 'text-text-muted line-through' : ''}`}>{step.title}</p>
                <p className="text-xs text-text-muted">{step.description}</p>
              </div>
              {!isDone && step.cta && href && (
                <Link href={href} className="text-xs font-medium text-amber hover:text-amber/80 transition-colors flex-shrink-0">
                  {step.cta}
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
