export interface FeatureComparison {
  featureName: string
  tenxspend: boolean
  competitor: boolean
  note?: string
}

export interface ComparisonData {
  slug: string
  competitorName: string
  metaTitle: string
  metaDescription: string
  h1: string
  introText: string
  features: FeatureComparison[]
  verdict: string
  ctaText: string
}

export const comparisons: ComparisonData[] = [
  {
    slug: 'neurons',
    competitorName: 'Neurons AI',
    metaTitle: '10xSpend vs Neurons AI — AI Ad Analysis Comparison (2026)',
    metaDescription:
      'Compare 10xSpend and Neurons AI side-by-side. See which AI ad analysis tool offers more features including persona simulations, heatmaps, debate analysis, and performance predictions.',
    h1: '10xSpend vs Neurons AI',
    introText:
      'Neurons AI uses neuroscience-based prediction models to forecast ad attention. 10xSpend takes a different approach: simulating real buyer personas, running adversarial debates between a buyer and a skeptic, and generating actionable fix-it rewrites. Both tools offer heatmaps and emotional profiling, but the depth and breadth of analysis differ significantly.',
    features: [
      {
        featureName: 'Persona Simulations',
        tenxspend: true,
        competitor: false,
      },
      {
        featureName: 'Attention Heatmaps',
        tenxspend: true,
        competitor: true,
      },
      {
        featureName: 'Buyer vs Skeptic Debate',
        tenxspend: true,
        competitor: false,
      },
      {
        featureName: 'Fix-It Rewrites',
        tenxspend: true,
        competitor: false,
      },
      {
        featureName: 'Video Analysis',
        tenxspend: true,
        competitor: true,
      },
      {
        featureName: 'Landing Page Analysis',
        tenxspend: true,
        competitor: false,
      },
      {
        featureName: 'Performance Predictions',
        tenxspend: true,
        competitor: false,
      },
      {
        featureName: 'Emotional Profiling',
        tenxspend: true,
        competitor: true,
        note: '10xSpend uses Plutchik model, Neurons uses neuroscience',
      },
      {
        featureName: 'Platform-Specific Analysis (8 platforms)',
        tenxspend: true,
        competitor: false,
      },
      {
        featureName: 'Competitive Benchmarks',
        tenxspend: true,
        competitor: true,
      },
      {
        featureName: 'Neuroscience-Based Prediction',
        tenxspend: false,
        competitor: true,
      },
    ],
    verdict:
      'Neurons AI is strong in neuroscience-backed attention prediction, making it a solid choice if your primary concern is whether people will look at specific elements of your ad. However, 10xSpend goes far deeper: it simulates how different buyer personas actually react to your creative, runs a structured debate between a buyer and a skeptic, and generates concrete fix-it rewrites you can act on immediately. With platform-specific analysis across 8 ad platforms, landing page testing, and performance predictions, 10xSpend gives you a complete creative intelligence toolkit rather than just an attention score.',
    ctaText: 'Try 10xSpend Free — Get Deeper Ad Analysis Than Neurons AI',
  },
  {
    slug: 'adcreative',
    competitorName: 'AdCreative.ai',
    metaTitle: '10xSpend vs AdCreative.ai — Ad Analysis vs Ad Generation (2026)',
    metaDescription:
      'Compare 10xSpend and AdCreative.ai. 10xSpend analyzes your ads with AI personas and heatmaps. AdCreative.ai generates ads. See which tool fits your workflow.',
    h1: '10xSpend vs AdCreative.ai',
    introText:
      'AdCreative.ai and 10xSpend solve different parts of the ad creative workflow. AdCreative.ai is an AI ad generator — it creates ad copy, images, and variations for you. 10xSpend is an AI ad analyzer — it tests your existing creatives against simulated buyer personas, generates heatmaps, runs adversarial debates, and predicts platform-specific performance. They are complementary tools, but if you need to know whether your ad will actually convert before you spend budget on it, 10xSpend is purpose-built for that.',
    features: [
      {
        featureName: 'AI Ad Analysis',
        tenxspend: true,
        competitor: false,
        note: 'AdCreative.ai is a generator, not an analyzer',
      },
      {
        featureName: 'AI Ad Generation',
        tenxspend: false,
        competitor: true,
      },
      {
        featureName: 'Persona Simulations',
        tenxspend: true,
        competitor: false,
      },
      {
        featureName: 'Attention Heatmaps',
        tenxspend: true,
        competitor: false,
      },
      {
        featureName: 'Agent Debate',
        tenxspend: true,
        competitor: false,
      },
      {
        featureName: 'Fix-It Rewrites',
        tenxspend: true,
        competitor: false,
        note: 'AdCreative.ai regenerates entirely instead',
      },
      {
        featureName: 'Video Analysis',
        tenxspend: true,
        competitor: false,
      },
      {
        featureName: 'Performance Predictions',
        tenxspend: true,
        competitor: true,
      },
      {
        featureName: 'Ad Copywriting',
        tenxspend: false,
        competitor: true,
      },
      {
        featureName: 'Stock Photo Integration',
        tenxspend: false,
        competitor: true,
      },
    ],
    verdict:
      'AdCreative.ai excels at generating ad creatives quickly — if you need AI-written copy, generated images, and fast ad variations, it is a powerful tool. But generation without analysis is flying blind. 10xSpend fills the critical gap: before you spend a dollar on media, you can test your creative against simulated buyer personas, see exactly where attention lands on your ad, read a structured debate about its persuasiveness, and get specific rewrite suggestions. The ideal workflow is to generate with AdCreative.ai and then validate with 10xSpend before launching.',
    ctaText: 'Try 10xSpend Free — Analyze Before You Advertise',
  },
]
