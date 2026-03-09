'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

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
    <Modal open={open} onClose={onClose} title="Create Custom Persona">
      <div className="space-y-4">
        <Input
          label="Persona Name"
          id="persona-name"
          placeholder="e.g., Tech-Savvy Millennial"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Role"
            id="persona-role"
            placeholder="e.g., Startup CTO"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <Input
            label="Age"
            id="persona-age"
            type="number"
            placeholder="e.g., 32"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <Input
          label="Traits (comma separated)"
          id="persona-traits"
          placeholder="e.g., Data-driven, Risk-averse, ROI-focused"
          value={traits}
          onChange={(e) => setTraits(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="persona-desc" className="text-sm font-medium text-text-primary">
            Description & Behavior
          </label>
          <textarea
            id="persona-desc"
            rows={3}
            placeholder="Describe how this persona evaluates ads..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl bg-surface-600 border border-surface-500 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber/50 focus:ring-1 focus:ring-amber/20 transition-all duration-200 resize-none"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleCreate} className="flex-1" disabled={loading}>
            {loading ? 'Creating...' : 'Create Persona'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
