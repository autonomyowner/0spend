'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/Card'

interface ScoreChartProps {
  data?: { date: string; score: number }[]
}

export function ScoreChart({ data }: ScoreChartProps) {
  const chartData = data && data.length > 0 ? data : [
    { date: 'Mon', score: 0 },
    { date: 'Tue', score: 0 },
    { date: 'Wed', score: 0 },
  ]

  return (
    <Card className="p-6">
      <h3 className="text-sm font-semibold font-heading mb-4">Average Score Trend</h3>
      {(!data || data.length === 0) ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-text-muted">Run some tests to see your score trend</p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8FF00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00FF87" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1C1C1C" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: '#777777', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fill: '#777777', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0E0E0E',
                  border: '1px solid #1C1C1C',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '13px',
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
