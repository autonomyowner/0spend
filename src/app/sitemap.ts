import type { MetadataRoute } from 'next'

const siteUrl = 'https://10xspend.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = [
    'best-ai-tools-for-marketing-2026',
    'ai-ad-analysis-test-ads-before-spending',
    '10xspend-vs-neurons-ai',
    'how-ai-is-changing-digital-advertising',
  ]

  const vsSlugs = ['neurons', 'adcreative']

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/sign-up`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/sign-in`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/vs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    ...vsSlugs.map((slug) => ({
      url: `${siteUrl}/vs/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...blogSlugs.map((slug) => ({
      url: `${siteUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
