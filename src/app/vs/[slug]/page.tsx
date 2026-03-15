import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { comparisons } from '@/lib/comparisons'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return comparisons.map((comp) => ({ slug: comp.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const comp = comparisons.find((c) => c.slug === slug)
  if (!comp) return {}

  return {
    title: comp.metaTitle,
    description: comp.metaDescription,
    alternates: { canonical: `https://10xspend.vercel.app/vs/${comp.slug}` },
    openGraph: {
      title: comp.metaTitle,
      description: comp.metaDescription,
      url: `https://10xspend.vercel.app/vs/${comp.slug}`,
      type: 'article',
    },
  }
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params
  const comp = comparisons.find((c) => c.slug === slug)
  if (!comp) notFound()

  const tenxspendWins = comp.features.filter(
    (f) => f.tenxspend && !f.competitor
  ).length
  const competitorWins = comp.features.filter(
    (f) => f.competitor && !f.tenxspend
  ).length
  const shared = comp.features.filter(
    (f) => f.tenxspend && f.competitor
  ).length

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-10 flex items-center gap-2 text-sm text-text-muted">
        <Link href="/vs" className="hover:text-amber transition-colors duration-200">
          Comparisons
        </Link>
        <span className="text-text-faint">/</span>
        <span className="text-text-primary">{comp.competitorName}</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-6">
          {comp.h1}
        </h1>
        <p className="text-text-muted text-lg leading-relaxed max-w-3xl">
          {comp.introText}
        </p>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="rounded-2xl border border-surface-500/60 bg-surface-800/60 backdrop-blur-sm p-6 text-center">
          <div className="text-3xl font-heading font-bold text-amber mb-1">
            {tenxspendWins}
          </div>
          <div className="text-xs text-text-muted uppercase tracking-wider">
            10xSpend Only
          </div>
        </div>
        <div className="rounded-2xl border border-surface-500/60 bg-surface-800/60 backdrop-blur-sm p-6 text-center">
          <div className="text-3xl font-heading font-bold text-text-primary mb-1">
            {shared}
          </div>
          <div className="text-xs text-text-muted uppercase tracking-wider">
            Both Have
          </div>
        </div>
        <div className="rounded-2xl border border-surface-500/60 bg-surface-800/60 backdrop-blur-sm p-6 text-center">
          <div className="text-3xl font-heading font-bold text-text-muted mb-1">
            {competitorWins}
          </div>
          <div className="text-xs text-text-muted uppercase tracking-wider">
            {comp.competitorName} Only
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="rounded-2xl border border-surface-500/60 bg-surface-800/60 backdrop-blur-sm overflow-hidden mb-12">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_120px_120px] sm:grid-cols-[1fr_140px_140px] border-b border-surface-500/60 px-6 py-4 bg-surface-700/40">
          <div className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Feature
          </div>
          <div className="text-sm font-semibold text-amber text-center uppercase tracking-wider">
            10xSpend
          </div>
          <div className="text-sm font-semibold text-text-muted text-center uppercase tracking-wider">
            {comp.competitorName}
          </div>
        </div>

        {/* Table Rows */}
        {comp.features.map((feature, index) => (
          <div
            key={feature.featureName}
            className={`grid grid-cols-[1fr_120px_120px] sm:grid-cols-[1fr_140px_140px] px-6 py-4 border-b border-surface-500/30 last:border-b-0 ${
              index % 2 === 0 ? 'bg-transparent' : 'bg-surface-700/20'
            }`}
          >
            <div>
              <span className="text-sm text-text-primary">
                {feature.featureName}
              </span>
              {feature.note && (
                <span className="block text-xs text-text-muted mt-0.5">
                  {feature.note}
                </span>
              )}
            </div>
            <div className="text-center text-lg">
              {feature.tenxspend ? (
                <span className="text-[#C8FF00]" aria-label="Yes">&#10003;</span>
              ) : (
                <span className="text-[#777777]" aria-label="No">&#10007;</span>
              )}
            </div>
            <div className="text-center text-lg">
              {feature.competitor ? (
                <span className="text-[#C8FF00]" aria-label="Yes">&#10003;</span>
              ) : (
                <span className="text-[#777777]" aria-label="No">&#10007;</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div className="rounded-2xl border border-amber/20 bg-amber/[0.04] backdrop-blur-sm p-8 mb-12">
        <h2 className="font-heading text-2xl font-bold mb-4">
          The Verdict
        </h2>
        <p className="text-text-muted leading-relaxed">
          {comp.verdict}
        </p>
      </div>

      {/* Internal Links */}
      <div className="rounded-2xl border border-surface-500/60 bg-surface-800/60 backdrop-blur-sm p-8 mb-12">
        <h3 className="font-heading text-lg font-semibold mb-4">
          More Comparisons
        </h3>
        <div className="flex flex-wrap gap-3">
          {comparisons
            .filter((c) => c.slug !== comp.slug)
            .map((other) => (
              <Link
                key={other.slug}
                href={`/vs/${other.slug}`}
                className="text-sm px-4 py-2 rounded-xl border border-surface-500/60 bg-surface-700/40 text-text-muted hover:text-amber hover:border-amber/30 transition-all duration-200"
              >
                10xSpend vs {other.competitorName}
              </Link>
            ))}
          <Link
            href="/vs"
            className="text-sm px-4 py-2 rounded-xl border border-surface-500/60 bg-surface-700/40 text-text-muted hover:text-amber hover:border-amber/30 transition-all duration-200"
          >
            All Comparisons
          </Link>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-8">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">
          Ready to Analyze Your Ads?
        </h2>
        <p className="text-text-muted mb-8 max-w-xl mx-auto">
          Upload any ad creative and get instant AI-powered analysis with
          persona simulations, heatmaps, and actionable fix-it rewrites.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FAFF00] via-[#C8FF00] to-[#00FF87] text-black font-semibold text-base transition-all duration-200 hover:brightness-110 glow-amber"
        >
          {comp.ctaText}
        </Link>
      </div>
    </div>
  )
}
