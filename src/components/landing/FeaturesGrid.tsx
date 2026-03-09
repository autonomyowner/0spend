import { Users, Swords, Wrench, Eye, GitCompare, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Persona Scoring',
    description: 'Score creatives against diverse synthetic personas — from Gen Z impulse buyers to skeptical enterprise CTOs.',
  },
  {
    icon: Swords,
    title: 'Agent Debate',
    description: 'Watch a Buyer Agent and Skeptic Agent debate your creative in real time. See both sides before you spend.',
  },
  {
    icon: Wrench,
    title: 'Fix-It Engine',
    description: 'Get specific copy and visual rewrites with predicted impact scores. Not just "make it better" — actual alternatives.',
  },
  {
    icon: Eye,
    title: 'Attention Heatmaps',
    description: 'See where eyes land first, what gets ignored, and how visual hierarchy performs across your creative.',
  },
  {
    icon: GitCompare,
    title: 'Funnel Check',
    description: 'Validate creative-to-landing page consistency. Catch message mismatches before they tank your conversion rate.',
  },
  {
    icon: BarChart3,
    title: 'Competitive Benchmarks',
    description: 'Compare your scores against industry averages and top performers in your vertical.',
  },
]

export function FeaturesGrid() {
  return (
    <section id="features" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-amber uppercase tracking-wider mb-3">Features</p>
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-5">
            Everything You Need to{' '}
            <span className="gradient-text-amber">Ship Winning Ads</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            A complete toolkit for creative testing — no focus groups, no wasted spend, no guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl bg-surface-800 border border-surface-500 p-7 hover:border-amber/20 hover:bg-surface-700 transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-lg bg-amber/10 flex items-center justify-center mb-5">
                <f.icon size={22} className="text-text-muted" />
              </div>
              <h3 className="text-lg font-semibold font-heading mb-2">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
