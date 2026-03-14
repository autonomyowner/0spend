'use client'

import { cn } from '@/lib/cn'

interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-1 border-b border-surface-500 overflow-x-auto scrollbar-hide', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px cursor-pointer whitespace-nowrap',
            active === tab.id
              ? 'text-amber border-amber'
              : 'text-text-muted border-transparent hover:text-text-primary hover:border-surface-500'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
