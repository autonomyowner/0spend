import { DropZone } from '@/components/ui/DropZone'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface UploadZoneProps {
  onUpload: (files: File[]) => void
}

export function UploadZone({ onUpload }: UploadZoneProps) {
  const { t } = useLanguage()

  return (
    <div>
      <h3 className="text-sm font-semibold font-heading mb-3">{t.app.dropZone.uploadCreative}</h3>
      <DropZone
        accept="image/*"
        onFiles={onUpload}
      />
    </div>
  )
}
