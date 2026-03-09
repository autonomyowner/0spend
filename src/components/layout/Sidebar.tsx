'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FlaskConical, Users, BarChart3, PanelLeftClose, PanelLeft, LogOut } from 'lucide-react'
import { cn } from '@/lib/cn'
import { authClient } from '@/lib/auth-client'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    { label: t.app.sidebar.dashboard, href: '/app', icon: LayoutDashboard },
    { label: t.app.sidebar.analyze, href: '/app/analyze', icon: FlaskConical },
    { label: t.app.sidebar.personas, href: '/app/personas', icon: Users },
    { label: t.app.sidebar.results, href: '/app/results', icon: BarChart3 },
  ]

  return (
    <aside
      className={cn(
        'fixed start-0 top-0 bottom-0 z-40 flex flex-col bg-surface-800 border-e border-surface-500 transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-500">
        <img src="/logo-without-background.png" alt="0spend" className="h-8 w-auto flex-shrink-0" />
        {!collapsed && (
          <span className="font-heading font-semibold text-text-primary tracking-tight">
            0spend
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = item.href === '/app'
            ? pathname === '/app'
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-amber/10 text-amber'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-700'
              )}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-4 border-t border-surface-500 flex flex-col gap-1">
        <button
          onClick={onToggle}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-muted hover:text-text-primary hover:bg-surface-700 transition-colors w-full cursor-pointer"
        >
          {collapsed ? <PanelLeft size={20} className="rtl:-scale-x-100" /> : <PanelLeftClose size={20} className="rtl:-scale-x-100" />}
          {!collapsed && <span>{t.app.sidebar.collapse}</span>}
        </button>
        <button
          onClick={async () => {
            await authClient.signOut()
            window.location.href = '/'
          }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-muted hover:text-danger hover:bg-danger/5 transition-colors w-full cursor-pointer"
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span>{t.app.sidebar.signOut}</span>}
        </button>
      </div>
    </aside>
  )
}
