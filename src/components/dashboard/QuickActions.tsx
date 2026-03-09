import Link from 'next/link'
import { FlaskConical, Users, BarChart3 } from 'lucide-react'

const actions = [
  { label: 'New Analysis', description: 'Upload and test a creative', href: '/app/analyze', icon: FlaskConical },
  { label: 'Manage Personas', description: 'Build custom AI personas', href: '/app/personas', icon: Users },
  { label: 'View Reports', description: 'Browse all test results', href: '/app/results', icon: BarChart3 },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {actions.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className="group rounded-xl bg-surface-700 border border-surface-500 p-5 hover:border-amber/20 hover:bg-surface-600 transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center mb-3">
            <a.icon size={20} className="text-text-muted" />
          </div>
          <p className="text-sm font-semibold font-heading">{a.label}</p>
          <p className="text-xs text-text-muted mt-1">{a.description}</p>
        </Link>
      ))}
    </div>
  )
}
