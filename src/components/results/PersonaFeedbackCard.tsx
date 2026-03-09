import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface PersonaFeedbackCardProps {
  feedback: {
    personaName: string
    personaRole: string
    score: number
    sentiment: 'positive' | 'neutral' | 'negative'
    reaction: string
    highlights: string[]
  }
}

const sentimentVariant = {
  positive: 'success' as const,
  neutral: 'amber' as const,
  negative: 'danger' as const,
}

export function PersonaFeedbackCard({ feedback }: PersonaFeedbackCardProps) {
  const { t } = useLanguage()
  const scoreColor = feedback.score >= 7 ? 'text-success' : feedback.score >= 5 ? 'text-amber' : 'text-danger'

  return (
    <div className="rounded-xl bg-surface-700 border border-surface-500 p-5">
      <div className="flex items-start gap-3 mb-3">
        <Avatar name={feedback.personaName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{feedback.personaName}</span>
            <Badge variant={sentimentVariant[feedback.sentiment]}>{t.app.sentiment[feedback.sentiment]}</Badge>
          </div>
          <p className="text-xs text-text-muted">{feedback.personaRole}</p>
        </div>
        <span className={`text-lg font-bold font-heading ${scoreColor}`}>{feedback.score}</span>
      </div>

      <p className="text-sm text-text-primary leading-relaxed mb-3">{feedback.reaction}</p>

      <div className="flex flex-wrap gap-1.5">
        {feedback.highlights.map((h) => (
          <Badge key={h} variant="neutral">{h}</Badge>
        ))}
      </div>
    </div>
  )
}
