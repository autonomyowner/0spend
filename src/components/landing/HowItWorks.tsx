import { Upload, Users, BarChart3 } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    title: 'Upload Creative',
    description: 'Drop in your ad image, video, carousel, or landing page. We handle all formats.',
  },
  {
    icon: Users,
    title: 'AI Personas Evaluate',
    description: '8+ synthetic personas score your creative on hook strength, clarity, CTA power, and more.',
  },
  {
    icon: BarChart3,
    title: 'Get Actionable Results',
    description: 'Scores, agent debates, attention heatmaps, and specific "fix-it" rewrites — in seconds.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 px-4 grid-bg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-amber uppercase tracking-wider mb-3">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-5">
            Three Steps to{' '}
            <span className="gradient-text-amber">Validated Creatives</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            No more guessing. No more wasted ad spend. Get AI-powered feedback before you hit publish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-px border-t border-dashed border-amber/20 z-0" />
              )}

              <div className="relative rounded-2xl bg-surface-800 border border-surface-500 p-8 hover:border-amber/20 transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center mb-5">
                  <step.icon size={24} className="text-text-muted" />
                </div>
                <span className="text-xs font-mono text-amber mb-2 block">0{i + 1}</span>
                <h3 className="text-xl font-semibold font-heading mb-3">{step.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
