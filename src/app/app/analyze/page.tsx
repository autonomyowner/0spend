'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useAction } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import { UploadZone } from '@/components/analysis/UploadZone'
import { FormatSelector } from '@/components/analysis/FormatSelector'
import { UrlInput } from '@/components/analysis/UrlInput'
import { Button } from '@/components/ui/Button'
import { DropZone } from '@/components/ui/DropZone'
import { useUploadCreative } from '@/hooks/useUploadCreative'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function AnalysisPage() {
  const router = useRouter()
  const { user } = useCurrentUser()
  const { t } = useLanguage()
  const { upload, uploading } = useUploadCreative()
  const personas = useQuery(api.personas.list)
  const runAnalysis = useAction(api.ai.analyze.runAnalysis)
  const runVideoAnalysis = useAction(api.ai.analyze.runVideoAnalysis)
  const captureScreenshot = useAction(api.ai.screenshot.captureScreenshot)

  const [format, setFormat] = useState('image')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [creativeId, setCreativeId] = useState<Id<'creatives'> | null>(null)
  const [selectedPersonas, setSelectedPersonas] = useState<Id<'personas'>[]>([])
  const [running, setRunning] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [videoDuration, setVideoDuration] = useState<number | null>(null)
  const [error, setError] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)

  function handleFormatChange(newFormat: string) {
    if (running) return
    setFormat(newFormat)
    clearUpload()
  }

  function handleImageUpload(files: File[]) {
    const f = files[0]
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError(t.app.analyze.onlyImages)
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError(t.app.analyze.fileTooLarge)
      return
    }
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setError('')
    upload(f, 'image').then((result) => {
      setCreativeId(result.creativeId)
    }).catch(() => {
      setError(t.app.analyze.uploadFailed)
    })
  }

  function handleVideoUpload(files: File[]) {
    const f = files[0]
    if (!f) return
    if (!f.type.startsWith('video/')) {
      setError('Only video files are supported (MP4, MOV, WebM)')
      return
    }
    if (f.size > 25 * 1024 * 1024) {
      setError('Video must be under 25MB')
      return
    }
    setFile(f)
    setError('')

    const url = URL.createObjectURL(f)
    setPreviewUrl(url)
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      const dur = Math.round(video.duration)
      setVideoDuration(dur)
      if (dur > 120) {
        setError('Video must be under 2 minutes')
        clearUpload()
        return
      }
      upload(f, 'video', dur).then((result) => {
        setCreativeId(result.creativeId)
      }).catch(() => {
        setError(t.app.analyze.uploadFailed)
      })
    }
    video.src = url
  }

  async function handleLandingPageCapture(url: string) {
    setCapturing(true)
    setError('')
    try {
      const result = await captureScreenshot({ url })
      setCreativeId(result.creativeId as Id<'creatives'>)
      setPreviewUrl(url)
    } catch {
      setError('Failed to capture screenshot. Check the URL and try again.')
    } finally {
      setCapturing(false)
    }
  }

  function clearUpload() {
    setFile(null)
    setPreviewUrl(null)
    setCreativeId(null)
    setVideoDuration(null)
    setError('')
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
      const testName = format === 'landing_page'
        ? previewUrl || 'Landing Page Test'
        : file?.name || 'Untitled Test'

      let result: { testId: string; status: string }

      if (format === 'video') {
        result = await runVideoAnalysis({
          creativeId,
          personaIds: selectedPersonas,
          testName,
        })
      } else {
        result = await runAnalysis({
          creativeId,
          personaIds: selectedPersonas,
          testName,
        })
      }

      router.push(`/app/results/${result.testId}`)
    } catch {
      setError(t.app.analyze.analysisFailed)
      setRunning(false)
    }
  }

  const isReady = creativeId && selectedPersonas.length > 0 && !uploading && !capturing

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">{t.app.analyze.title}</h1>
        <p className="text-sm text-text-muted mt-1">{t.app.analyze.subtitle}</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Format + Upload/URL */}
        <div className="space-y-6">
          <FormatSelector value={format} onChange={handleFormatChange} />

          {format === 'image' && !previewUrl && (
            <UploadZone onUpload={handleImageUpload} />
          )}

          {format === 'video' && !previewUrl && (
            <div>
              <h3 className="text-sm font-semibold font-heading mb-3">Upload Video</h3>
              <DropZone
                onFiles={handleVideoUpload}
                accept="video/*"
                description="MP4, MOV, WebM up to 25MB (max 2 min)"
              />
            </div>
          )}

          {format === 'landing_page' && !creativeId && (
            <UrlInput onCapture={handleLandingPageCapture} capturing={capturing} />
          )}

          {/* Image preview */}
          {format === 'image' && previewUrl && (
            <div className="rounded-xl bg-surface-700 border border-surface-500 overflow-hidden">
              <img
                src={previewUrl}
                alt="Creative preview"
                className="w-full h-auto max-h-80 object-contain"
              />
              <div className="p-3 border-t border-surface-500 flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-primary font-medium">{file?.name}</p>
                  <p className="text-xs text-text-muted">
                    {file ? (file.size / 1024).toFixed(1) + ' KB' : ''}
                    {uploading && ` · ${t.app.analyze.uploading}`}
                    {creativeId && !uploading && ` · ${t.app.analyze.ready}`}
                  </p>
                </div>
                {!running && (
                  <button onClick={clearUpload} className="text-xs text-text-muted hover:text-danger transition-colors cursor-pointer">
                    {t.app.analyze.remove}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Video preview */}
          {format === 'video' && previewUrl && (
            <div className="rounded-xl bg-surface-700 border border-surface-500 overflow-hidden">
              <video
                ref={videoRef}
                src={previewUrl}
                controls
                className="w-full max-h-80"
              />
              <div className="p-3 border-t border-surface-500 flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-primary font-medium">{file?.name}</p>
                  <p className="text-xs text-text-muted">
                    {file ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : ''}
                    {videoDuration ? ` · ${videoDuration}s` : ''}
                    {uploading && ` · ${t.app.analyze.uploading}`}
                    {creativeId && !uploading && ` · ${t.app.analyze.ready}`}
                  </p>
                </div>
                {!running && (
                  <button onClick={clearUpload} className="text-xs text-text-muted hover:text-danger transition-colors cursor-pointer">
                    {t.app.analyze.remove}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Landing page preview */}
          {format === 'landing_page' && creativeId && (
            <div className="rounded-xl bg-surface-700 border border-surface-500 overflow-hidden">
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center text-lg">
                  🌐
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary font-medium truncate">{previewUrl}</p>
                  <p className="text-xs text-text-muted">Screenshot captured · {t.app.analyze.ready}</p>
                </div>
                {!running && (
                  <button onClick={clearUpload} className="text-xs text-text-muted hover:text-danger transition-colors cursor-pointer">
                    {t.app.analyze.remove}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Persona Selection */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold font-heading">{t.app.analyze.selectPersonas}</h3>
              <button
                onClick={selectAll}
                className="text-xs text-amber hover:underline cursor-pointer"
              >
                {t.app.analyze.selectAll}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pe-1">
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
                <p className="text-sm text-text-muted col-span-2">{t.app.analyze.loadingPersonas}</p>
              )}
            </div>
            {selectedPersonas.length > 0 && (
              <p className="text-xs text-text-muted mt-2">
                {selectedPersonas.length} {selectedPersonas.length !== 1 ? t.app.analyze.personasSelected : t.app.analyze.personaSelected}
              </p>
            )}
          </div>

          <Button
            onClick={startAnalysis}
            disabled={!isReady || running}
            className="w-full"
          >
            {running ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                {t.app.analyze.analyzingWith} {selectedPersonas.length} {selectedPersonas.length !== 1 ? t.app.analyze.personasSelected : t.app.analyze.personaSelected}...
              </span>
            ) : (
              `${t.app.analyze.runAnalysis} (${selectedPersonas.length} ${selectedPersonas.length !== 1 ? t.app.analyze.personasSelected : t.app.analyze.personaSelected})`
            )}
          </Button>

          {running && (
            <div className="rounded-xl bg-surface-700 border border-surface-500 p-6">
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-10 h-10 rounded-full border-2 border-amber border-t-transparent animate-spin" />
                <p className="text-sm text-text-primary font-medium">
                  {format === 'video' ? 'Running video analysis...' : t.app.analyze.runningAi}
                </p>
                <p className="text-xs text-text-muted">
                  {format === 'video' ? 'This may take 30-60 seconds for video' : t.app.analyze.usuallyTakes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
