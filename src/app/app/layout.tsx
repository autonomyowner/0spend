'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { cn } from '@/lib/cn'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useConvexAuth } from '@/hooks/useCurrentUser'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, isLoading } = useConvexAuth()

  const sidebarWidth = collapsed ? 'lg:pl-16' : 'lg:pl-60'

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/sign-in'
    }
  }, [isLoading, isAuthenticated])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-amber border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-bg">
      {/* Mobile overlay */}
      {mobileOpen && !isDesktop && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - always visible on desktop, conditional on mobile */}
      <div className={cn(
        'lg:block',
        !isDesktop && !mobileOpen && 'hidden'
      )}>
        <Sidebar
          collapsed={isDesktop ? collapsed : false}
          onToggle={() => {
            if (isDesktop) setCollapsed(!collapsed)
            else setMobileOpen(false)
          }}
        />
      </div>

      {/* Main content */}
      <div className={cn('transition-all duration-200', sidebarWidth)}>
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
