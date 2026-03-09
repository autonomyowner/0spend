import { Image } from 'lucide-react'

interface CreativePreviewProps {
  file: File | null
}

export function CreativePreview({ file }: CreativePreviewProps) {
  if (!file) {
    return (
      <div className="rounded-xl bg-surface-700 border border-surface-500 aspect-video flex flex-col items-center justify-center gap-2">
        <Image size={32} className="text-text-faint" />
        <p className="text-sm text-text-muted">Upload a creative to preview</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-surface-700 border border-surface-500 aspect-video flex flex-col items-center justify-center gap-2 overflow-hidden">
      <div className="text-4xl">🖼️</div>
      <p className="text-sm text-text-primary font-medium">{file.name}</p>
      <p className="text-xs text-text-muted">{(file.size / 1024).toFixed(1)} KB</p>
    </div>
  )
}
