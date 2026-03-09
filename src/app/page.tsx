'use client'

import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { FeaturesGrid } from '@/components/landing/FeaturesGrid'
import { DemoPreview } from '@/components/landing/DemoPreview'
import { SocialProof } from '@/components/landing/SocialProof'
import { Pricing } from '@/components/landing/Pricing'
import { CTA } from '@/components/landing/CTA'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-bg noise-overlay">
        <Navbar />
        <Hero />
        <HowItWorks />
        <FeaturesGrid />
        <DemoPreview />
        <SocialProof />
        <Pricing />
        <CTA />
        <Footer />
      </div>
    </LanguageProvider>
  )
}
