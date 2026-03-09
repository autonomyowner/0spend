'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Plus } from 'lucide-react'
import { PersonaGrid } from '@/components/personas/PersonaGrid'
import { CreatePersonaModal } from '@/components/personas/CreatePersonaModal'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'

const tabs = [
  { id: 'all', label: 'All Personas' },
  { id: 'preset', label: 'Preset' },
  { id: 'custom', label: 'Custom' },
]

export default function PersonasPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const personas = useQuery(api.personas.list)
  const createPersona = useMutation(api.personas.create)

  const filtered = personas
    ? activeTab === 'all'
      ? personas
      : activeTab === 'custom'
        ? personas.filter((p) => !p.isPreset)
        : personas.filter((p) => p.isPreset)
    : []

  async function handleCreate(data: {
    name: string
    role: string
    age: number
    traits: string[]
    description: string
  }) {
    await createPersona(data)
    setModalOpen(false)
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">Persona Builder</h1>
          <p className="text-sm text-text-muted mt-1">
            {personas ? `${personas.length} personas available` : 'Loading...'}
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} size="sm">
          <Plus size={16} />
          Create Custom
        </Button>
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <PersonaGrid personas={filtered} />

      <CreatePersonaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  )
}
