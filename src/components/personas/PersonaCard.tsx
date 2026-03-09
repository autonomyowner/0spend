import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Persona {
  _id: string
  name: string
  role: string
  age: number
  traits: string[]
  description: string
  isPreset: boolean
}

interface PersonaCardProps {
  persona: Persona
}

export function PersonaCard({ persona }: PersonaCardProps) {
  const { t } = useLanguage()

  return (
    <div className="rounded-xl bg-surface-700 border border-surface-500 p-5 hover:border-amber/20 transition-all duration-200">
      <div className="flex items-start gap-3 mb-4">
        <Avatar name={persona.name} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{persona.name}</p>
          <p className="text-xs text-text-muted">{persona.role}, {persona.age}</p>
        </div>
        {!persona.isPreset && (
          <Badge variant="amber">{t.app.personaCard.custom}</Badge>
        )}
      </div>
      <p className="text-xs text-text-muted leading-relaxed mb-3">{persona.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {persona.traits.map((trait) => (
          <Badge key={trait} variant="neutral">{trait}</Badge>
        ))}
      </div>
    </div>
  )
}
