import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Silence warnings about img tag usage (we use plain <img> in some components)
  images: {
    unoptimized: true,
  },
}

export default nextConfig
