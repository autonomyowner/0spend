'use client'

import { useState } from 'react'
import { Users, Swords, Wrench, Eye, GitCompare, BarChart3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const featureIcons = [Users, Swords, Wrench, Eye, GitCompare, BarChart3]

const featureDetails = [
  { bullets: ['Score against 8+ AI personas', 'Gen Z to Enterprise CTOs', 'Platform-specific behavior', 'Demographic segmentation'] },
  { bullets: ['Real-time pro/con debate', 'Buyer vs. Skeptic agents', 'Unbiased AI verdict', 'Actionable improvement tips'] },
  { bullets: ['Specific copy rewrites', 'Visual improvement ideas', 'Impact score per change', 'A/B variant generation'] },
  { bullets: ['Eye-tracking simulation', 'Attention zones mapped', 'Visual hierarchy scored', 'Mobile vs. desktop view'] },
  { bullets: ["Plutchik's 8 core emotions", 'Emotional intensity scores', 'Audience resonance mapping', 'Trigger-based optimization'] },
  { bullets: ['Predicted CTR & ROAS', 'Scroll-stop rate estimate', 'CPM benchmarks by platform', 'Pre-launch spend confidence'] },
]

export function FeaturesGrid() {
  const ref = useReveal()
  const { t } = useLanguage()
  const [active, setActive] = useState(0)

  const ActiveIcon = featureIcons[active]

  return (
    <section id="features" className="relative py-24 sm:py-32 px-4">
      <div ref={ref} className="max-w-6xl mx-auto reveal">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-amber uppercase tracking-wider mb-3">{t.features.badge}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading tracking-tight mb-5">
            {t.features.headlinePre}
            <span className="gradient-text-amber">{t.features.headlineAccent}</span>
          </h2>
          <p className="text-text-muted text-base sm:text-lg max-w-2xl mx-auto">
            {t.features.description}
          </p>
        </div>

        {/* Interactive split layout */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch">

          {/* Left: Vertical numbered feature list */}
          <div className="lg:w-[38%] flex flex-col gap-2">
            {t.features.items.map((f, i) => {
              const isActive = active === i
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`group relative flex items-center gap-4 text-left rounded-2xl px-5 py-4 border transition-all duration-300 cursor-pointer overflow-hidden ${
                    isActive
                      ? 'border-amber/25 bg-amber/[0.06]'
                      : 'border-surface-500/40 bg-surface-800/30 hover:border-surface-500/70 hover:bg-surface-800/50'
                  }`}
                >
                  {/* Active left bar */}
                  {isActive && (
                    <motion.div
                      layoutId="feature-active-bar"
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber rounded-full"
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}

                  {/* Number */}
                  <span className={`text-xs font-mono font-bold tabular-nums w-5 shrink-0 transition-colors duration-300 ${
                    isActive ? 'text-amber' : 'text-text-faint group-hover:text-text-muted'
                  }`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Title */}
                  <p className={`text-sm font-semibold font-heading flex-1 transition-colors duration-300 ${
                    isActive ? 'text-text-primary' : 'text-text-muted group-hover:text-text-primary'
                  }`}>
                    {f.title}
                  </p>

                  {/* Active dot */}
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Right: Animated feature detail panel */}
          <div className="lg:w-[62%] min-h-[340px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-2xl bg-surface-800/60 backdrop-blur-sm border border-amber/15 p-8 sm:p-10 relative overflow-hidden"
              >
                {/* Large background number */}
                <div className="absolute -top-2 -right-3 text-[130px] font-bold font-heading text-surface-600/40 leading-none pointer-events-none select-none">
                  {String(active + 1).padStart(2, '0')}
                </div>

                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-amber/[0.06] rounded-full blur-[80px] pointer-events-none" />

                <div className="relative">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-amber/10 border border-amber/20 flex items-center justify-center mb-6">
                    <ActiveIcon size={26} className="text-amber/80" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-bold font-heading mb-3">
                    {t.features.items[active].title}
                  </h3>

                  {/* Description */}
                  <p className="text-text-muted leading-relaxed mb-8 text-base sm:text-lg max-w-lg">
                    {t.features.items[active].description}
                  </p>

                  {/* Feature bullets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {featureDetails[active].bullets.map((bullet, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: j * 0.06, duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-amber shrink-0" />
                        <span className="text-sm text-text-muted">{bullet}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
