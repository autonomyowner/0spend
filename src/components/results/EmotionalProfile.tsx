'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'
import { Card } from '@/components/ui/Card'
import { AiDisclaimer } from '@/components/ui/AiDisclaimer'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Emotion {
  emotion: string
  intensity: number
  confidence?: string
}

interface EmotionalProfileProps {
  emotions?: Emotion[]
  dominantEmotion?: string
  emotionalTone?: string
  recommendations?: string[]
}

export function EmotionalProfile({
  emotions,
  dominantEmotion,
  emotionalTone,
  recommendations,
}: EmotionalProfileProps) {
  const { t } = useLanguage()

  if (!emotions || emotions.length === 0) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <p className="text-sm text-text-muted">{t.app.emotionalProfile.loading}</p>
      </Card>
    )
  }

  const data = emotions.map((e) => ({
    emotion: e.emotion,
    intensity: e.intensity,
    fullMark: 10,
  }))

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-sm font-semibold font-heading mb-1">
          {t.app.emotionalProfile.title}
        </h3>
        <p className="text-xs text-text-muted mb-4">
          {t.app.emotionalProfile.description}
        </p>
        <AiDisclaimer text={t.app.disclaimers.emotionsNote} severity="info" className="mb-6" />

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="#1C1C1C" />
              <PolarAngleAxis
                dataKey="emotion"
                tick={{ fill: '#777777', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 10]}
                tick={{ fill: '#3A3A3A', fontSize: 10 }}
                axisLine={false}
              />
              <Radar
                name="Intensity"
                dataKey="intensity"
                stroke="#C8FF00"
                fill="#C8FF00"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dominant Emotion + Tone */}
        <Card className="p-5">
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1.5">
                {t.app.emotionalProfile.dominantEmotion}
              </p>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-amber/10 text-amber border border-amber/20">
                {dominantEmotion}
              </span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1.5">
                {t.app.emotionalProfile.emotionalTone}
              </p>
              <p className="text-sm text-text-primary">{emotionalTone}</p>
            </div>
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="p-5">
          <p className="text-[10px] uppercase tracking-wider text-text-muted mb-3">
            {t.app.emotionalProfile.recommendations}
          </p>
          {recommendations && recommendations.length > 0 ? (
            <ul className="space-y-2">
              {recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                  <span className="text-amber mt-0.5 shrink-0">&#x2022;</span>
                  {rec}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-muted">No recommendations available.</p>
          )}
        </Card>
      </div>
    </div>
  )
}
