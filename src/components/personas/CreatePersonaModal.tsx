'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface CreatePersonaModalProps {
  open: boolean
  onClose: () => void
  onCreate?: (data: {
    name: string
    role: string
    age: number
    traits: string[]
    description: string
  }) => void
}

export function CreatePersonaModal({ open, onClose, onCreate }: CreatePersonaModalProps) {
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [age, setAge] = useState('')
  const [traits, setTraits] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!name || !role || !age || !description) return
    setLoading(true)
    try {
      const traitsList = traits
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      await onCreate?.({
        name,
        role,
        age: parseInt(age),
        traits: traitsList.length > 0 ? traitsList : ['Custom'],
        description,
      })

      setName('')
      setRole('')
      setAge('')
      setTraits('')
      setDescription('')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t.app.createPersonaModal.title}>
      <div className="space-y-4">
        <Input
          label={t.app.createPersonaModal.personaName}
          id="persona-name"
          placeholder={t.app.createPersonaModal.personaNamePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label={t.app.createPersonaModal.role}
            id="persona-role"
            placeholder={t.app.createPersonaModal.rolePlaceholder}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <Input
            label={t.app.createPersonaModal.age}
            id="persona-age"
            type="number"
            placeholder={t.app.createPersonaModal.agePlaceholder}
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <Input
          label={t.app.createPersonaModal.traits}
          id="persona-traits"
          placeholder={t.app.createPersonaModal.traitsPlaceholder}
          value={traits}
          onChange={(e) => setTraits(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="persona-desc" className="text-sm font-medium text-text-primary">
            {t.app.createPersonaModal.descriptionLabel}
          </label>
          <textarea
            id="persona-desc"
            rows={3}
            placeholder={t.app.createPersonaModal.descriptionPlaceholder}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl bg-surface-600 border border-surface-500 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber/50 focus:ring-1 focus:ring-amber/20 transition-all duration-200 resize-none"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            {t.app.createPersonaModal.cancel}
          </Button>
          <Button onClick={handleCreate} className="flex-1" disabled={loading}>
            {loading ? t.app.createPersonaModal.creating : t.app.createPersonaModal.createPersona}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
