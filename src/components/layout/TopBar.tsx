'use client'

import { usePathname } from 'next/navigation'
import { Bell, Menu } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface TopBarProps {
  onMenuClick?: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname()
  const { user } = useCurrentUser()
  const { t } = useLanguage()

  const breadcrumbMap: Record<string, string> = {
    '/app': t.app.topBar.dashboard,
    '/app/analyze': t.app.topBar.creativeAnalysis,
    '/app/personas': t.app.topBar.personaBuilder,
    '/app/results': t.app.topBar.results,
  }

  const base = Object.keys(breadcrumbMap).find((k) => pathname.startsWith(k)) || '/app'
  const title = breadcrumbMap[base] || t.app.topBar.dashboard
  const displayName = user?.name || 'User'

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-surface-500 bg-surface-800/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-700 transition-colors cursor-pointer"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-muted">{t.app.topBar.app}</span>
          <span className="text-text-faint">/</span>
          <span className="text-text-primary font-medium">{title}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-700 transition-colors cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-amber" />
        </button>
        <Avatar name={displayName} size="md" />
      </div>
    </header>
  )
}
