'use client'

import { useState } from 'react'
import { Globe, Loader2 } from 'lucide-react'

interface UrlInputProps {
  onCapture: (url: string) => void
  capturing: boolean
}

export function UrlInput({ onCapture, capturing }: UrlInputProps) {
  const [url, setUrl] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return
    // Add protocol if missing
    const fullUrl = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
    onCapture(fullUrl)
  }

  return (
    <div>
      <h3 className="text-sm font-semibold font-heading mb-3">Landing Page URL</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={capturing}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-800/60 backdrop-blur-sm border border-surface-500/60 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={!url.trim() || capturing}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FAFF00] via-[#C8FF00] to-[#00FF87] text-black text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:shadow-[0_0_20px_rgba(200,255,0,0.3)]"
        >
          {capturing ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Capturing screenshot...
            </span>
          ) : (
            'Capture & Analyze'
          )}
        </button>
      </form>
    </div>
  )
}
