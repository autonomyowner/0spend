import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-4 overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber/8 rounded-full blur-3xl pointer-events-none" style={{ animation: 'pulse-glow 4s ease-in-out infinite' }} />
      <div className="absolute top-40 right-1/4 w-72 h-72 bg-amber/5 rounded-full blur-3xl pointer-events-none" style={{ animation: 'pulse-glow 6s ease-in-out infinite 2s' }} />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber/20 bg-amber/5 px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-amber" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
          <span className="text-xs font-medium text-amber">AI-Powered Creative Testing</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-heading tracking-tight leading-[1.1] mb-6">
          Stop Burning{' '}
          <span className="gradient-text-amber text-glow-amber">Ad Budget</span>
          <br />
          on Untested Creatives
        </h1>

        <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10">
          Test your ad creatives with synthetic AI personas before spending a single dollar.
          Get scores, feedback, and fix-it suggestions in seconds.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/sign-up">
            <Button size="lg">
              Start Testing Free
              <ArrowRight size={18} />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="secondary" size="lg">
              See How It Works
            </Button>
          </a>
        </div>

        {/* Terminal mockup */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-surface-500 overflow-hidden glow-amber">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-surface-800 border-b border-surface-500">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger/60" />
                <div className="w-3 h-3 rounded-full bg-amber/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <span className="text-xs text-text-muted ml-2 font-mono">0spend — creative analysis</span>
            </div>

            {/* Terminal body */}
            <div className="bg-surface-900 p-6 font-mono text-sm text-left space-y-3 relative">
              <div className="text-text-muted">
                <span className="text-amber">$</span> 0spend analyze --creative summer-sale-v2.png
              </div>
              <div className="text-text-muted">
                <Sparkles size={14} className="inline text-amber mr-1" />
                Running 8 AI personas against your creative...
              </div>
              <div className="h-px bg-surface-500 my-2" />

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-text-muted w-28 text-xs">Hook Strength</span>
                  <div className="flex-1 h-2 rounded-full bg-surface-600 overflow-hidden">
                    <div className="h-full rounded-full bg-success" style={{ width: '85%' }} />
                  </div>
                  <span className="text-success text-xs font-medium">8.5</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-text-muted w-28 text-xs">Visual Clarity</span>
                  <div className="flex-1 h-2 rounded-full bg-surface-600 overflow-hidden">
                    <div className="h-full rounded-full bg-amber" style={{ width: '72%' }} />
                  </div>
                  <span className="text-amber text-xs font-medium">7.2</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-text-muted w-28 text-xs">CTA Power</span>
                  <div className="flex-1 h-2 rounded-full bg-surface-600 overflow-hidden">
                    <div className="h-full rounded-full bg-success" style={{ width: '91%' }} />
                  </div>
                  <span className="text-success text-xs font-medium">9.1</span>
                </div>
              </div>

              <div className="h-px bg-surface-500 my-2" />
              <div className="text-text-muted text-xs">
                <span className="text-amber">Fix-It:</span> Headline could be 40% shorter. Try: "50% Off — Today Only"
              </div>
              <div className="text-text-muted text-xs">
                <span className="text-success">Verdict:</span> Ship it — strong creative with minor copy tweaks
                <span className="inline-block w-px h-3 bg-amber ml-1" style={{ animation: 'blink 1s step-end infinite' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
