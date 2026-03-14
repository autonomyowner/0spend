import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface FixItSuggestion {
  element: string
  current: string
  suggested: string
  impact: 'high' | 'medium' | 'low'
}

interface FixItSuggestionsProps {
  suggestions?: FixItSuggestion[]
}

const impactVariant = {
  high: 'danger' as const,
  medium: 'amber' as const,
  low: 'neutral' as const,
}

export function FixItSuggestions({ suggestions }: FixItSuggestionsProps) {
  const { t, locale } = useLanguage()

  if (!suggestions || suggestions.length === 0) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <p className="text-sm text-text-muted">{t.app.fixIt.loading}</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-sm font-semibold font-heading mb-4">{t.app.fixIt.title}</h3>
      <p className="text-xs text-text-muted mb-6">
        {t.app.fixIt.description}
      </p>

      <div className="space-y-4">
        {suggestions.map((fix) => (
          <div key={fix.element} className="rounded-xl bg-surface-600/60 backdrop-blur-sm border border-surface-500/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold">{fix.element}</span>
              <Badge variant={impactVariant[fix.impact]}>{fix.impact} {t.app.fixIt.impact}</Badge>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-3">
              <div className="flex-1 rounded-xl bg-surface-700/60 border border-surface-500/60 p-3">
                <span className="text-xs text-text-muted block mb-1">{t.app.fixIt.current}</span>
                <p className="text-sm text-text-primary">{fix.current}</p>
              </div>
              <ArrowRight size={16} className={`text-amber flex-shrink-0 mt-6 hidden sm:block ${locale === 'ar' ? 'rotate-180' : ''}`} />
              <div className="flex-1 rounded-xl bg-amber/5 border border-amber/20 p-3">
                <span className="text-xs text-amber block mb-1">{t.app.fixIt.suggested}</span>
                <p className="text-sm text-text-primary">{fix.suggested}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
