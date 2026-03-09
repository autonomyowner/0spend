'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FlaskConical, Users, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/cn'

const items = [
  { label: 'Home', href: '/app', icon: LayoutDashboard },
  { label: 'Analyze', href: '/app/analyze', icon: FlaskConical },
  { label: 'Personas', href: '/app/personas', icon: Users },
  { label: 'Results', href: '/app/results', icon: BarChart3 },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Glassmorphic background */}
      <div className="border-t border-surface-500/50 bg-surface-800/80 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          {items.map((item) => {
            const isActive = item.href === '/app'
              ? pathname === '/app'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 py-2.5 px-3 min-w-[64px] rounded-2xl transition-all duration-200',
                  isActive
                    ? 'text-amber'
                    : 'text-text-muted active:text-text-primary'
                )}
              >
                <div className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200',
                  isActive && 'bg-amber/10 shadow-[0_0_12px_rgba(200,255,0,0.15)]'
                )}>
                  <item.icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                </div>
                <span className={cn(
                  'text-[10px] font-medium',
                  isActive && 'font-semibold'
                )}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
