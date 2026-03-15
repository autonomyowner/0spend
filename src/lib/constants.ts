import { LayoutDashboard, FlaskConical, Users, BarChart3 } from 'lucide-react'

export const BRAND = {
  name: '10xSpend',
  tagline: 'AI Ad Analysis',
  description: 'Upload any ad and get instant AI analysis — scores, attention heatmaps, persona feedback, and optimization suggestions. The smartest way to analyze your ads before you spend.',
} as const

export const NAV_LINKS = [
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
] as const

export const APP_NAV = [
  { label: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { label: 'Analyze', href: '/app/analyze', icon: FlaskConical },
  { label: 'Personas', href: '/app/personas', icon: Users },
  { label: 'Results', href: '/app/results', icon: BarChart3 },
] as const

export const PRICING_TIERS = [
  {
    name: 'Starter',
    price: 49,
    description: 'For solo marketers testing the waters.',
    features: [
      '25 creative tests/month',
      '5 AI personas',
      'Basic score breakdown',
      'Fix-It suggestions',
      'Email support',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro',
    price: 149,
    description: 'For growing teams shipping creatives weekly.',
    features: [
      '200 creative tests/month',
      '25 AI personas + custom builder',
      'Agent Debate analysis',
      'Attention heatmaps',
      'Competitive benchmarks',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Agency',
    price: 399,
    description: 'For agencies managing multiple brands.',
    features: [
      'Unlimited creative tests',
      'Unlimited personas',
      'White-label reports',
      'Team collaboration',
      'API access',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
] as const
