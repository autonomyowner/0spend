import type { Metadata } from 'next'
import { ConvexClientProvider } from '@/components/providers/convex-provider'
import { JsonLd } from '@/components/seo/JsonLd'
import './globals.css'

const siteUrl = 'https://10xspend.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: '10xSpend — AI Ad Analysis & Marketing Intelligence',
  description:
    'Upload any ad and get instant AI analysis — scores, attention heatmaps, persona feedback, and fix-it suggestions. Analyze ads with AI before you spend. The smartest AI marketing tool for ad optimization.',
  keywords: [
    'AI ads',
    'ad analysis',
    'AI marketing',
    'AI ad analysis',
    'AI campaign',
    'ad optimization',
    'marketing intelligence',
    'attention heatmap',
    'ad testing',
    'creative analysis',
    'AI advertising',
  ],
  authors: [{ name: '10xSpend' }],
  creator: '10xSpend',
  publisher: '10xSpend',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: '10xSpend',
    title: '10xSpend — AI Ad Analysis & Marketing Intelligence',
    description:
      'Upload any ad and get instant AI analysis — scores, attention heatmaps, persona feedback, and fix-it suggestions. The smartest AI marketing tool for ad optimization.',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: '10xSpend - AI Ad Analysis Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '10xSpend — AI Ad Analysis & Marketing Intelligence',
    description:
      'Upload any ad and get instant AI analysis — scores, attention heatmaps, persona feedback, and fix-it suggestions.',
    images: ['/api/og'],
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: '/logo-without-background.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Syne:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <JsonLd />
      </head>
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  )
}
