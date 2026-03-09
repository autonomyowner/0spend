'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useAction } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import { UploadZone } from '@/components/analysis/UploadZone'
import { FormatSelector } from '@/components/analysis/FormatSelector'
import { Button } from '@/components/ui/Button'
import { useUploadCreative } from '@/hooks/useUploadCreative'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export default function AnalysisPage() {
  const router = useRouter()
  const { user } = useCurrentUser()
  const { upload, uploading } = useUploadCreative()
  const personas = useQuery(api.personas.list)
  const runAnalysis = useAction(api.ai.analyze.runAnalysis)

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [format, setFormat] = useState('image')
  const [creativeId, setCreativeId] = useState<Id<'creatives'> | null>(null)
  const [selectedPersonas, setSelectedPersonas] = useState<Id<'personas'>[]>([])
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')

  function handleUpload(files: File[]) {
    const f = files[0]
    if (!f) return
    // Validate image type and size
    if (!f.type.startsWith('image/')) {
      setError('Only images are supported')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB')
      return
    }
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setError('')
    // Auto-upload
    upload(f, format).then((result) => {
      setCreativeId(result.creativeId)
    }).catch(() => {
      setError('Upload failed')
    })
  }

  function togglePersona(id: Id<'personas'>) {
    setSelectedPersonas((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    )
  }

  function selectAll() {
    if (!personas) return
    setSelectedPersonas(personas.map((p) => p._id))
  }

  async function startAnalysis() {
    if (!creativeId || !user || selectedPersonas.length === 0) return
    setRunning(true)
    setError('')
    try {
      const result = await runAnalysis({
        creativeId,
        personaIds: selectedPersonas,
        testName: file?.name || 'Untitled Test',
        userId: user._id,
      })
      router.push(`/app/results/${result.testId}`)
    } catch (err) {
      setError('Analysis failed. Please try again.')
      setRunning(false)
    }
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Creative Analysis</h1>
        <p className="text-sm text-text-muted mt-1">Upload a creative and get AI-powered feedback</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upload & Config */}
        <div className="space-y-6">
          <UploadZone onUpload={handleUpload} />
          <FormatSelector value={format} onChange={setFormat} />

          {/* Preview */}
          {previewUrl ? (
            <div className="rounded-xl bg-surface-700 border border-surface-500 overflow-hidden">
              <img
                src={previewUrl}
                alt="Creative preview"
                className="w-full h-auto max-h-80 object-contain"
              />
              <div className="p-3 border-t border-surface-500">
                <p className="text-sm text-text-primary font-medium">{file?.name}</p>
                <p className="text-xs text-text-muted">
                  {file ? (file.size / 1024).toFixed(1) + ' KB' : ''}
                  {uploading && ' · Uploading...'}
                  {creativeId && !uploading && ' · Ready'}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-surface-700 border border-surface-500 aspect-video flex flex-col items-center justify-center gap-2">
              <p className="text-sm text-text-muted">Upload a creative to preview</p>
            </div>
          )}
        </div>

        {/* Right: Persona Selection */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold font-heading">Select Personas</h3>
              <button
                onClick={selectAll}
                className="text-xs text-amber hover:underline cursor-pointer"
              >
                Select all
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
              {personas?.map((persona) => (
                <button
                  key={persona._id}
                  onClick={() => togglePersona(persona._id)}
                  className={`text-left p-3 rounded-xl border text-sm transition-all cursor-pointer ${
                    selectedPersonas.includes(persona._id)
                      ? 'border-amber/40 bg-amber/5 text-amber'
                      : 'border-surface-500 bg-surface-700 text-text-muted hover:border-amber/20'
                  }`}
                >
                  <p className="font-medium text-text-primary text-sm">{persona.name}</p>
                  <p className="text-xs text-text-muted">{persona.role}, {persona.age}</p>
                </button>
              )) || (
                <p className="text-sm text-text-muted col-span-2">Loading personas...</p>
              )}
            </div>
            {selectedPersonas.length > 0 && (
              <p className="text-xs text-text-muted mt-2">
                {selectedPersonas.length} persona{selectedPersonas.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          <Button
            onClick={startAnalysis}
            disabled={!creativeId || uploading || running || selectedPersonas.length === 0}
            className="w-full"
          >
            {running ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                Analyzing with {selectedPersonas.length} personas...
              </span>
            ) : (
              `Run Analysis (${selectedPersonas.length} persona${selectedPersonas.length !== 1 ? 's' : ''})`
            )}
          </Button>

          {running && (
            <div className="rounded-xl bg-surface-700 border border-surface-500 p-6">
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-10 h-10 rounded-full border-2 border-amber border-t-transparent animate-spin" />
                <p className="text-sm text-text-primary font-medium">
                  Running AI analysis...
                </p>
                <p className="text-xs text-text-muted">
                  This usually takes 15-30 seconds
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
