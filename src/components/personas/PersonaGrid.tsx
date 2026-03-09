import { PersonaCard } from './PersonaCard'
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

interface PersonaGridProps {
  personas: Persona[]
}

export function PersonaGrid({ personas }: PersonaGridProps) {
  const { t } = useLanguage()

  if (personas.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-text-muted">{t.app.personasPage.noPersonas}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {personas.map((p) => (
        <PersonaCard key={p._id} persona={p} />
      ))}
    </div>
  )
}
