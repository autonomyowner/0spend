'use client'

import { useState, DragEvent, useRef } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface DropZoneProps {
  onFiles?: (files: File[]) => void
  accept?: string
  description?: string
  className?: string
}

export function DropZone({ onFiles, accept, description, className }: DropZoneProps) {
  const { t } = useLanguage()
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDrag(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDragIn(e: DragEvent) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragOut(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files)
    onFiles?.(files)
  }

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-all duration-200',
        dragging
          ? 'border-amber bg-amber/5 glow-amber'
          : 'border-surface-500 bg-surface-800 hover:border-amber/30 hover:bg-surface-700',
        className
      )}
    >
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
        dragging ? 'bg-amber/20' : 'bg-surface-600'
      )}>
        <Upload size={24} className={dragging ? 'text-amber' : 'text-text-muted'} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-text-primary">
          {t.app.dropZone.dropHere} <span className="text-amber">{t.app.dropZone.browse}</span>
        </p>
        <p className="text-xs text-text-muted mt-1">{description || t.app.dropZone.formats}</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || [])
          onFiles?.(files)
        }}
      />
    </div>
  )
}
