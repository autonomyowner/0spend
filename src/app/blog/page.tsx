import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts, formatDate } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog — AI Marketing Insights & Ad Analysis Tips | 10xSpend',
  description:
    'Expert insights on AI marketing, ad analysis, and campaign optimization. Learn how to use AI to improve your advertising performance.',
  alternates: { canonical: 'https://10xspend.vercel.app/blog' },
}

export default function BlogPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4">
          Blog
        </h1>
        <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
          Expert insights on AI marketing, ad analysis, and campaign optimization.
          Learn how to use AI to improve your advertising performance.
        </p>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-2xl border border-[#1C1C1C]/60 bg-[#080808]/60 backdrop-blur-sm p-6 transition-all duration-300 hover:border-[#C8FF00]/20 hover:bg-[#0E0E0E]/60"
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-2.5 py-1 rounded-full border border-[#1C1C1C] bg-[#141414] text-text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h2 className="text-xl font-heading font-semibold text-white mb-2 group-hover:text-[#C8FF00] transition-colors duration-300">
              {post.title}
            </h2>

            {/* Description */}
            <p className="text-sm text-text-muted leading-relaxed mb-4 line-clamp-3">
              {post.description}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="w-1 h-1 rounded-full bg-[#1C1C1C]" />
              <span>{post.readTime} read</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
