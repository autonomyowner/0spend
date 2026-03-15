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
    <section id="features" className="relative py-24 sm:py-32 px-4 sm:px-16">
      <div ref={ref} className="max-w-6xl mx-auto reveal">

        <div className="mb-16">
          <div className="axm-tag">{t.features.badge}</div>
          <h2 className="axm-section-h2 max-w-2xl">
            {t.features.headlinePre}
            <em>{t.features.headlineAccent}</em>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-stretch">

          {/* Left: Feature list as Axiom rows */}
          <div className="lg:w-[40%] border-t border-surface-500">
            {t.features.items.map((f, i) => {
              const isActive = active === i
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="group w-full flex items-center gap-4 py-4 border-b border-surface-500 relative overflow-hidden cursor-none text-left transition-all duration-300"
                  style={{ background: isActive ? 'rgba(200,255,0,0.04)' : 'transparent' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="feat-bar"
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber"
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <span className={`text-xs font-heading font-bold tracking-wider ml-3 w-6 shrink-0 ${isActive ? 'text-amber' : 'text-text-faint'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`text-sm font-heading font-bold uppercase tracking-wide transition-colors duration-300 flex-1 ${isActive ? 'text-white' : 'text-text-muted group-hover:text-white'}`}>
                    {f.title}
                  </span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-amber mr-4 shrink-0" />}
                </button>
              )
            })}
          </div>

          {/* Right: Animated detail panel */}
          <div className="lg:w-[60%] min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-2xl bg-surface-800/60 border border-amber/12 p-8 sm:p-10 relative overflow-hidden"
              >
                {/* Big ghost number */}
                <div className="absolute -top-2 -right-3 text-[130px] font-heading font-bold text-surface-600/30 leading-none pointer-events-none select-none">
                  {String(active + 1).padStart(2, '0')}
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber/[0.05] rounded-full blur-[80px] pointer-events-none" />

                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-amber/10 border border-amber/20 flex items-center justify-center mb-6">
                    <ActiveIcon size={22} className="text-amber/80" />
                  </div>
                  <h3 className="font-heading font-black text-3xl sm:text-4xl uppercase tracking-tight mb-3">
                    {t.features.items[active].title}
                  </h3>
                  <p className="text-text-muted leading-relaxed mb-8 max-w-md">
                    {t.features.items[active].description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {featureDetails[active].bullets.map((bullet, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: j * 0.055, duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
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
