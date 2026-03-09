const testimonials = [
  {
    quote: 'We cut our wasted ad spend by 60% in the first month. The agent debate feature alone is worth the subscription.',
    name: 'Emily Chen',
    role: 'Head of Growth, Revo',
    metric: '$42K saved',
  },
  {
    quote: 'Finally, a tool that gives me real feedback — not just "looks good." The fix-it suggestions are incredibly specific.',
    name: 'James Okafor',
    role: 'Creative Director, PixelForge',
    metric: '3x ROAS',
  },
  {
    quote: 'We test every creative before launch now. Our CTR improved 40% since adopting 0spend across all campaigns.',
    name: 'Ana Rivera',
    role: 'Performance Marketing, Scalebound',
    metric: '40% CTR lift',
  },
]

export function SocialProof() {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-amber uppercase tracking-wider mb-3">Proof</p>
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-5">
            Teams That{' '}
            <span className="gradient-text-amber">Stopped Guessing</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl bg-surface-800 border border-surface-500 p-7 flex flex-col">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber/20 bg-amber/5 px-3 py-1 mb-5 self-start">
                <span className="text-xs font-semibold text-amber">{t.metric}</span>
              </div>
              <p className="text-sm text-text-primary leading-relaxed mb-6 flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber/10 flex items-center justify-center text-amber text-sm font-semibold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
