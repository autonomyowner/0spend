'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { Card } from '@/components/ui/Card'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { ChevronDown, ChevronUp, Send } from 'lucide-react'

interface Prediction {
  metric: string
  value: number
  unit: string
}

interface ActualResultsFormProps {
  testId: Id<'tests'>
  predictions: Prediction[]
}

const metricLabels: Record<string, string> = {
  'CTR': 'CTR',
  'Conversion Rate': 'CVR',
  'CPM': 'CPM',
  'ROAS': 'ROAS',
  'Scroll-Stop Rate': 'Scroll-Stop',
}

export function ActualResultsForm({ testId, predictions }: ActualResultsFormProps) {
  const { t } = useLanguage()
  const saveActualResults = useMutation(api.results.saveActualResults)

  const [expanded, setExpanded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [values, setValues] = useState<Record<string, string>>({})
  const [totalSpend, setTotalSpend] = useState('')
  const [totalRevenue, setTotalRevenue] = useState('')
  const [impressions, setImpressions] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = async () => {
    const results = predictions
      .filter((p) => values[p.metric] && !isNaN(parseFloat(values[p.metric])))
      .map((p) => ({
        metric: p.metric,
        value: parseFloat(values[p.metric]),
        unit: p.unit,
      }))

    if (results.length === 0) return

    setSaving(true)
    try {
      await saveActualResults({
        testId,
        results,
        totalSpend: totalSpend ? parseFloat(totalSpend) : undefined,
        totalRevenue: totalRevenue ? parseFloat(totalRevenue) : undefined,
        impressions: impressions ? parseInt(impressions) : undefined,
        notes: notes || undefined,
      })
    } catch {
      setSaving(false)
    }
  }

  const hasAnyValue = Object.values(values).some((v) => v && !isNaN(parseFloat(v)))

  return (
    <Card className="p-0 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-600/30 transition-colors duration-200 cursor-pointer"
      >
        <div className="text-left">
          <h4 className="text-sm font-semibold font-heading">{t.app.actualResults.title}</h4>
          <p className="text-[11px] text-text-muted mt-0.5">{t.app.actualResults.description}</p>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-text-muted shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-surface-500/40">
          {/* Metric inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
            {predictions.map((p) => (
              <div key={p.metric}>
                <label className="text-[10px] text-text-muted uppercase tracking-wider mb-1.5 block">
                  {metricLabels[p.metric] || p.metric}
                  <span className="text-text-faint ms-1">({p.unit === '$' ? '$' : p.unit})</span>
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder={`e.g. ${p.value}`}
                  value={values[p.metric] || ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [p.metric]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-800/60 border border-surface-500/60 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-amber/30 transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Optional fields */}
          <div className="pt-2">
            <p className="text-[10px] text-text-faint uppercase tracking-wider mb-3">
              {t.app.actualResults.optional}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-text-muted mb-1.5 block">{t.app.actualResults.totalSpend}</label>
                <input
                  type="number"
                  step="any"
                  placeholder="$0.00"
                  value={totalSpend}
                  onChange={(e) => setTotalSpend(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-800/60 border border-surface-500/60 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-amber/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] text-text-muted mb-1.5 block">{t.app.actualResults.totalRevenue}</label>
                <input
                  type="number"
                  step="any"
                  placeholder="$0.00"
                  value={totalRevenue}
                  onChange={(e) => setTotalRevenue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-800/60 border border-surface-500/60 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-amber/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] text-text-muted mb-1.5 block">{t.app.actualResults.impressions}</label>
                <input
                  type="number"
                  step="1"
                  placeholder="0"
                  value={impressions}
                  onChange={(e) => setImpressions(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-800/60 border border-surface-500/60 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-amber/30 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] text-text-muted mb-1.5 block">{t.app.actualResults.notes}</label>
            <textarea
              rows={2}
              placeholder={t.app.actualResults.notesPlaceholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-800/60 border border-surface-500/60 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-amber/30 transition-colors resize-none"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!hasAnyValue || saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FAFF00] via-[#C8FF00] to-[#00FF87] text-black text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            {saving ? t.app.actualResults.saving : t.app.actualResults.submit}
          </button>
        </div>
      )}
    </Card>
  )
}
