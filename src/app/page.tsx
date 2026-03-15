'use client'

import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { FeaturesGrid } from '@/components/landing/FeaturesGrid'
import { DemoPreview } from '@/components/landing/DemoPreview'
import { SocialProof } from '@/components/landing/SocialProof'
import { FreeTools } from '@/components/landing/FreeTools'
import { Pricing } from '@/components/landing/Pricing'
import { CTA } from '@/components/landing/CTA'
import { Footer } from '@/components/landing/Footer'
import { Cursor } from '@/components/ui/Cursor'

function Marquee({ words }: { words: string[] }) {
  const doubled = [...words, ...words]
  return (
    <div className="axm-mq-wrap" aria-hidden>
      <div className="axm-mq-track">
        {doubled.map((w, i) => (
          <span key={i}>{w}<i>·</i></span>
        ))}
      </div>
    </div>
  )
}

function StatsBar() {
  const stats = [
    { n: '10K', s: '+', l: 'Ads Analyzed' },
    { n: '<60', s: 's', l: 'Analysis Time' },
    { n: '8',   s: '+', l: 'Ad Platforms' },
    { n: '6',   s: 'x', l: 'AI Personas' },
  ]
  return (
    <div className="axm-stats">
      {stats.map((s, i) => (
        <div key={i} className="axm-stat">
          <span className="axm-stat-n">{s.n}<em>{s.s}</em></span>
          <span className="axm-stat-l">{s.l}</span>
        </div>
      ))}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="axiom-page min-h-screen bg-bg noise-overlay" style={{ cursor: 'none' }}>
      <Cursor />

      {/* SVG noise texture */}
      <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9000 }} xmlns="http://www.w3.org/2000/svg">
        <filter id="nz"><feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
        <rect width="100%" height="100%" filter="url(#nz)" opacity="0.03"/>
      </svg>

      <Navbar />
      <Hero />
      <Marquee words={['AD ANALYSIS', 'PERSONA SCORING', 'HEATMAPS', 'FIX-IT TIPS', 'SPEND SMART', 'AI POWERED', 'INSTANT RESULTS', '10X YOUR ADS']} />
      <StatsBar />
      <HowItWorks />
      <FeaturesGrid />
      <DemoPreview />
      <Marquee words={['UPLOAD', 'ANALYZE', 'OPTIMIZE', 'DEPLOY', 'MEASURE', 'ITERATE', 'SCALE', 'WIN']} />
      <SocialProof />
      <FreeTools />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  )
}
