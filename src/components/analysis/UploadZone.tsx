import { DropZone } from '@/components/ui/DropZone'

interface UploadZoneProps {
  onUpload: (files: File[]) => void
}

export function UploadZone({ onUpload }: UploadZoneProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold font-heading mb-3">Upload Creative</h3>
      <DropZone
        accept="image/*"
        onFiles={onUpload}
      />
    </div>
  )
}
