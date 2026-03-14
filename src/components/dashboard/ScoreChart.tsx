'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/Card'
import { TrendingUp } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface ScoreChartProps {
  data?: { date: string; score: number }[]
}

export function ScoreChart({ data }: ScoreChartProps) {
  const { t } = useLanguage()

  const chartData = data && data.length > 0 ? data : [
    { date: 'Mon', score: 0 },
    { date: 'Tue', score: 0 },
    { date: 'Wed', score: 0 },
  ]

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl bg-amber/8 border border-amber/10 flex items-center justify-center">
          <TrendingUp size={14} className="text-amber" />
        </div>
        <h3 className="text-sm font-semibold font-heading">{t.app.scoreChart.title}</h3>
      </div>
      {(!data || data.length === 0) ? (
        <div className="h-56 sm:h-64 flex items-center justify-center rounded-xl bg-surface-800/60 backdrop-blur-sm border border-surface-500/40">
          <p className="text-sm text-text-muted">{t.app.scoreChart.empty}</p>
        </div>
      ) : (
        <div className="h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8FF00" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00FF87" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1C1C1C" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: '#777777', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fill: '#777777', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(14, 14, 14, 0.9)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(28, 28, 28, 0.6)',
                  borderRadius: '14px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  padding: '8px 12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#C8FF00"
                strokeWidth={2}
                fill="url(#scoreGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}
