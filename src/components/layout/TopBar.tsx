'use client'

import { usePathname } from 'next/navigation'
import { Bell, Menu } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { useCurrentUser } from '@/hooks/useCurrentUser'

interface TopBarProps {
  onMenuClick?: () => void
}

const breadcrumbMap: Record<string, string> = {
  '/app': 'Dashboard',
  '/app/analyze': 'Creative Analysis',
  '/app/personas': 'Persona Builder',
  '/app/results': 'Results',
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname()
  const { user } = useCurrentUser()
  const base = Object.keys(breadcrumbMap).find((k) => pathname.startsWith(k)) || '/app'
  const title = breadcrumbMap[base] || 'Dashboard'
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
          <span className="text-text-muted">App</span>
          <span className="text-text-faint">/</span>
          <span className="text-text-primary font-medium">{title}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-700 transition-colors cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber" />
        </button>
        <Avatar name={displayName} size="md" />
      </div>
    </header>
  )
}
