'use client'

import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import FloatingParticles from './FloatingParticles'

interface BlogArticleProps {
  title: string
  date: string
  readTime?: string
  children: ReactNode
}

export default function BlogArticle({ title, date, readTime = "5 min read", children }: BlogArticleProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col animate-fade-in-slow relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>

      <FloatingParticles />

      <Header />

      <div className="flex-1 flex flex-col items-center px-6 py-16 relative z-10">
        <article className="max-w-4xl w-full">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-mono text-white mb-6 leading-tight">
              {title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-slate-400 font-mono text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{readTime}</span>
              </div>
            </div>

            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-transparent mt-8"></div>
          </header>

          <div className="prose prose-invert prose-slate max-w-none">
            {children}
          </div>
        </article>
      </div>

      <Footer />
    </div>
  )
}


export function Section({ title, children }: { title?: string, children: ReactNode }) {
  return (
    <section className="mb-12">
      {title && (
        <h2 className="text-2xl md:text-3xl font-bold font-mono text-cyan-400 mb-6">
          {title}
        </h2>
      )}
      <div className="text-slate-300 leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  )
}

export function Paragraph({ children }: { children: ReactNode }) {
  return (
    <p className="text-slate-300 leading-relaxed mb-4 font-mono text-base">
      {children}
    </p>
  )
}

export function CodeBlock({ children, language }: { children: string, language?: string }) {
  return (
    <div className="bg-slate-900/70 border border-slate-700/50 rounded-lg p-6 mb-6 overflow-x-auto">
      {language && (
        <div className="text-xs text-cyan-400 font-mono mb-3 uppercase tracking-wider">
          {language}
        </div>
      )}
      <pre className="text-slate-300 font-mono text-sm leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  )
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="bg-slate-800/70 text-cyan-400 px-2 py-1 rounded font-mono text-sm">
      {children}
    </code>
  )
}

export function List({ items, ordered = false }: { items: string[], ordered?: boolean }) {
  const ListTag = ordered ? 'ol' : 'ul'
  return (
    <ListTag className={`mb-6 space-y-2 ${ordered ? 'list-decimal' : 'list-disc'} list-inside text-slate-300 font-mono`}>
      {items.map((item, index) => (
        <li key={index} className="leading-relaxed">
          {item}
        </li>
      ))}
    </ListTag>
  )
}

export function Quote({ children, author }: { children: ReactNode, author?: string }) {
  return (
    <blockquote className="border-l-4 border-cyan-400 pl-6 py-4 mb-6 italic">
      <p className="text-slate-300 font-mono leading-relaxed mb-2">
        {children}
      </p>
      {author && (
        <footer className="text-slate-500 font-mono text-sm">
          — {author}
        </footer>
      )}
    </blockquote>
  )
}

export function Alert({ type = 'info', children }: { type?: 'info' | 'warning' | 'success', children: ReactNode }) {
  const colors = {
    info: 'border-blue-500/50 bg-blue-500/10',
    warning: 'border-yellow-500/50 bg-yellow-500/10',
    success: 'border-green-500/50 bg-green-500/10'
  }

  const icons = {
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  return (
    <div className={`border-2 rounded-lg p-4 mb-6 flex gap-3 ${colors[type]}`}>
      <div className="text-slate-300 flex-shrink-0">
        {icons[type]}
      </div>
      <div className="text-slate-300 font-mono text-sm leading-relaxed">
        {children}
      </div>
    </div>
  )
}
