'use client'

import Link from 'next/link'

/**
 * ArticleCard Component
 * 
 * Displays a blog article preview card with title, date, excerpt, and link.
 * Features hover animations and responsive design.
 */
export default function ArticleCard({
  title,
  date,
  excerpt,
  link,
  isActive = false
}: {
  title: string
  date: string
  excerpt: string
  link: string
  isActive?: boolean
}) {
  return (
    <Link
      href={link || "#"}
      className={`group relative block bg-slate-800/50 backdrop-blur-sm border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/10 ${
        isActive
          ? 'border-cyan-400 shadow-lg shadow-cyan-400/20 hover:border-cyan-300'
          : 'border-slate-700/50 hover:border-cyan-400/50'
      }`}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>

      <div className="relative z-10">
      {/* Date display with calendar icon */}
      <div className="flex items-center gap-2 text-slate-500 text-sm font-mono mb-3">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      {/* Article title */}
      <h3 className="text-xl md:text-2xl font-bold font-mono text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
        {title}
      </h3>

      {/* Article excerpt */}
      <p className="text-slate-400 font-mono text-sm leading-relaxed mb-4">
        {excerpt}
      </p>

      {/* Read more call-to-action with arrow animation */}
      <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm group-hover:gap-3 transition-all duration-300">
        <span>Read more</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
      </div>
    </Link>
  )
}