import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function CTA() {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-5">
            Stop Spending.{' '}
            <span className="gradient-text-amber">Start Testing.</span>
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto mb-10">
            Join thousands of marketers who validate every creative before it touches real budget.
          </p>
          <Link href="/sign-up">
            <Button size="lg">
              Get Started Free
              <ArrowRight size={18} />
            </Button>
          </Link>
          <p className="text-xs text-text-muted mt-4">No credit card required. 14-day free trial.</p>
        </div>
      </div>
    </section>
  )
}
