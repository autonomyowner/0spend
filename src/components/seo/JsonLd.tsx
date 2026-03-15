export function JsonLd() {
  const siteUrl = 'https://10xspend.vercel.app'

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '10xSpend',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: siteUrl,
    description:
      'AI ad analysis platform — upload any ad and get instant scores, attention heatmaps, persona feedback, and fix-it suggestions.',
    offers: [
      {
        '@type': 'Offer',
        price: '49',
        priceCurrency: 'USD',
        name: 'Starter',
        description: '25 creative tests/month, 5 AI personas',
      },
      {
        '@type': 'Offer',
        price: '149',
        priceCurrency: 'USD',
        name: 'Pro',
        description: '200 creative tests/month, 25 AI personas, agent debate, heatmaps',
      },
      {
        '@type': 'Offer',
        price: '399',
        priceCurrency: 'USD',
        name: 'Agency',
        description: 'Unlimited tests, white-label reports, API access',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
      bestRating: '5',
    },
  }

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '10xSpend',
    url: siteUrl,
    logo: `${siteUrl}/logo-without-background.png`,
    description: 'AI-powered ad analysis and marketing intelligence platform.',
    sameAs: [],
  }

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is AI ad analysis?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AI ad analysis uses artificial intelligence to evaluate ad creatives before you spend on campaigns. 10xSpend analyzes your ads with synthetic AI personas, generating scores, attention heatmaps, persona feedback, buyer-vs-skeptic debates, and specific fix-it suggestions — all in seconds.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does 10xSpend work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Upload any ad (image, video, or landing page URL), select AI personas to evaluate it, and get instant analysis. You receive an overall score, attention heatmap, individual persona feedback, a buyer-vs-skeptic debate, fix-it rewrites, emotional profiling, and predicted performance metrics like CTR, ROAS, and scroll-stop rate.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is 10xSpend different from Neurons AI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '10xSpend offers persona simulations, buyer-vs-skeptic debates, fix-it rewrites, landing page analysis, performance predictions, emotional profiling, and platform-specific analysis for 8 ad platforms. Neurons AI focuses on neuroscience-based attention prediction. 10xSpend provides more actionable, comprehensive analysis at a lower price point.',
        },
      },
      {
        '@type': 'Question',
        name: 'What ad formats does 10xSpend support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '10xSpend supports images (PNG, JPG, WebP), videos (MP4), and landing page URLs. You can analyze ads for 8 platforms: Facebook, Instagram, TikTok, Google Ads, LinkedIn, YouTube, X (Twitter), and generic. Each analysis is tailored to the platform and campaign objective you select.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  )
}
