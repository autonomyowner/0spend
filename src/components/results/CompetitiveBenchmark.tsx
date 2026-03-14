'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card } from '@/components/ui/Card'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface BenchmarkEntry {
  metric: string
  yours: number
  average: number
  topPerformer: number
  source?: string
  confidence?: string
}

interface CompetitiveBenchmarkProps {
  entries?: BenchmarkEntry[]
}

export function CompetitiveBenchmark({ entries }: CompetitiveBenchmarkProps) {
  const { t } = useLanguage()

  if (!entries || entries.length === 0) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <p className="text-sm text-text-muted">{t.app.benchmark.loading}</p>
      </Card>
    )
  }

  const hasHistorical = entries.some((e) => e.source === 'historical')
  const avgLabel = hasHistorical ? t.app.benchmark.yourAverage : t.app.benchmark.industryAvg

  return (
    <Card className="p-6">
      <h3 className="text-sm font-semibold font-heading mb-4">{t.app.benchmark.title}</h3>
      <p className="text-xs text-text-muted mb-6">
        {t.app.benchmark.description}
      </p>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={entries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#1C1C1C" strokeDasharray="3 3" />
            <XAxis
              dataKey="metric"
              tick={{ fill: '#777777', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fill: '#777777', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0E0E0E',
                border: '1px solid #1C1C1C',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '13px',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: '#777777' }}
            />
            <Bar dataKey="yours" name={t.app.benchmark.yourScore} fill="#C8FF00" radius={[4, 4, 0, 0]} />
            <Bar dataKey="average" name={avgLabel} fill="#3A3A3A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="topPerformer" name={t.app.benchmark.topPerformer} fill="#5B9A6B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[10px] text-text-faint mt-3">
        {hasHistorical ? t.app.benchmark.sourceHistorical : t.app.benchmark.sourceEstimated}
      </p>
    </Card>
  )
}
