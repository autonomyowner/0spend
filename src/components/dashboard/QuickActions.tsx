'use client'

import Link from 'next/link'
import { FlaskConical, Users, BarChart3, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function QuickActions() {
  const { t, locale } = useLanguage()

  const actions = [
    { label: t.app.quickActionItems.newAnalysis, description: t.app.quickActionItems.newAnalysisDesc, href: '/app/analyze', icon: FlaskConical, color: 'bg-amber/8 border-amber/10', iconColor: 'text-amber' },
    { label: t.app.quickActionItems.managePersonas, description: t.app.quickActionItems.managePersonasDesc, href: '/app/personas', icon: Users, color: 'bg-surface-500/30 border-surface-500/30', iconColor: 'text-text-muted' },
    { label: t.app.quickActionItems.viewReports, description: t.app.quickActionItems.viewReportsDesc, href: '/app/results', icon: BarChart3, color: 'bg-surface-500/30 border-surface-500/30', iconColor: 'text-text-muted' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {actions.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className="group relative rounded-2xl bg-surface-700/60 backdrop-blur-sm border border-surface-500/60 p-5 hover:border-amber/15 transition-all duration-300 cursor-pointer"
        >
          <div className="absolute inset-0 rounded-2xl bg-amber/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-2xl ${a.color} border flex items-center justify-center group-hover:bg-amber/12 transition-colors duration-300`}>
                <a.icon size={18} className={`${a.iconColor} group-hover:text-amber transition-colors duration-300`} />
              </div>
              <ArrowRight size={14} className="text-text-faint group-hover:text-text-muted group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-all duration-300" />
            </div>
            <p className="text-sm font-semibold font-heading">{a.label}</p>
            <p className="text-xs text-text-muted mt-1">{a.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
