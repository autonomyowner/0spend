export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  readTime: string
  tags: string[]
  metaTitle: string
  metaDescription: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'best-ai-tools-for-marketing-2026',
    title: 'Best AI Tools for Marketing in 2026',
    description:
      'A comprehensive guide to the best AI marketing tools in 2026 — from ad analysis and copywriting to design automation and SEO optimization.',
    date: '2026-03-10',
    author: '10xSpend Team',
    readTime: '8 min',
    tags: ['AI Marketing', 'Tools'],
    metaTitle: 'Best AI Tools for Marketing in 2026 — Complete Guide',
    metaDescription:
      'Discover the best AI marketing tools in 2026 for ad analysis, content creation, and campaign optimization. Featuring 10xSpend, Jasper, Copy.ai, and more.',
  },
  {
    slug: 'ai-ad-analysis-test-ads-before-spending',
    title: 'AI Ad Analysis: How to Test Ads Before Spending',
    description:
      'Learn how AI-powered ad analysis tools help you test and optimize creatives before launching campaigns — saving budget and improving performance.',
    date: '2026-03-08',
    author: '10xSpend Team',
    readTime: '6 min',
    tags: ['AI Ads', 'Ad Analysis'],
    metaTitle: 'AI Ad Analysis: How to Test Your Ads Before Spending a Dollar',
    metaDescription:
      'Learn how AI ad analysis tools like 10xSpend help you test and optimize ads before launching campaigns. Save budget with AI-powered insights.',
  },
  {
    slug: '10xspend-vs-neurons-ai',
    title: '10xSpend vs Neurons AI: Which AI Ad Tool is Better?',
    description:
      'A detailed comparison of 10xSpend and Neurons AI — features, pricing, strengths, and which tool is the right fit for your advertising workflow.',
    date: '2026-03-05',
    author: '10xSpend Team',
    readTime: '7 min',
    tags: ['Comparison', 'Neurons AI'],
    metaTitle: '10xSpend vs Neurons AI: Detailed Comparison for 2026',
    metaDescription:
      '10xSpend vs Neurons AI — which AI ad analysis tool is better? Compare features, pricing, and capabilities in this detailed breakdown.',
  },
  {
    slug: 'how-ai-is-changing-digital-advertising',
    title: 'How AI is Changing Digital Advertising in 2026',
    description:
      'Explore the ways artificial intelligence is transforming digital advertising — from creative generation and ad analysis to audience targeting and bid optimization.',
    date: '2026-03-01',
    author: '10xSpend Team',
    readTime: '9 min',
    tags: ['AI Advertising', 'Trends'],
    metaTitle: 'How AI is Changing Digital Advertising — 2026 Trends & Insights',
    metaDescription:
      'Explore how artificial intelligence is transforming digital advertising — from AI ad analysis to automated campaign optimization.',
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
