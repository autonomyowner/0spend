import type { Metadata } from 'next'
import Link from 'next/link'
import { comparisons } from '@/lib/comparisons'

export const metadata: Metadata = {
  title: '10xSpend vs Competitors — AI Ad Analysis Tool Comparisons',
  description:
    'See how 10xSpend compares to Neurons AI, AdCreative.ai, and other AI ad analysis tools. Feature-by-feature comparison.',
  alternates: { canonical: 'https://10xspend.vercel.app/vs' },
}

const competitorDescriptions: Record<string, string> = {
  neurons:
    'Neuroscience-based attention prediction vs full creative intelligence with persona simulations, debates, and fix-it rewrites.',
  adcreative:
    'AI ad generation vs AI ad analysis. Generate creatives with AdCreative.ai, then validate them with 10xSpend.',
}

export default function VsIndexPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-sm font-medium text-amber tracking-widest uppercase mb-4">
          Comparisons
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-6">
          10xSpend vs Competitors
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed">
          See how 10xSpend stacks up against the leading AI ad tools.
          Feature-by-feature breakdowns to help you choose the right platform.
        </p>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {comparisons.map((comp) => (
          <Link
            key={comp.slug}
            href={`/vs/${comp.slug}`}
            className="group relative rounded-2xl border border-surface-500/60 bg-surface-800/60 backdrop-blur-sm p-8 transition-all duration-300 hover:border-amber/30 hover:bg-surface-700/40"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-amber/[0.02]" />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl font-semibold">
                  10xSpend vs {comp.competitorName}
                </h2>
                <span className="text-text-muted group-hover:text-amber transition-colors duration-300">
                  &rarr;
                </span>
              </div>

              <p className="text-text-muted text-sm leading-relaxed mb-6">
                {competitorDescriptions[comp.slug] ?? comp.metaDescription}
              </p>

              {/* Feature count summary */}
              <div className="flex items-center gap-4 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-amber/10 text-amber font-medium">
                  {comp.features.filter((f) => f.tenxspend && !f.competitor).length} unique to 10xSpend
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-surface-600 text-text-muted font-medium">
                  {comp.features.length} features compared
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-20">
        <p className="text-text-muted mb-6">
          Ready to see what AI-powered ad analysis can do for your campaigns?
        </p>
        <Link
          href="/sign-up"
          className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FAFF00] via-[#C8FF00] to-[#00FF87] text-black font-semibold text-base transition-all duration-200 hover:brightness-110 glow-amber"
        >
          Get Started Free
        </Link>
      </div>
    </div>
  )
}
