'use client'

import Link from "next/link"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import FloatingParticles from "../../components/FloatingParticles"
import { useEffect } from "react"

interface ResourceCardProps {
  title: string
  description: string
  category: string
  categoryColor: string
  href: string
  icon: React.ReactNode
}

function ResourceCard({ title, description, category, categoryColor, href, icon }: ResourceCardProps) {
  return (
    <Link
      href={href}
      className="group block bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-500 hover:shadow-lg hover:shadow-slate-900/50"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-300 group-hover:scale-110"
          style={{ background: categoryColor + '18', borderColor: categoryColor + '40', color: categoryColor }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div
            className="text-[10px] font-mono font-bold uppercase tracking-widest mb-1"
            style={{ color: categoryColor }}
          >
            {category}
          </div>
          <h3 className="text-base font-bold font-mono text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-xs font-mono text-slate-500 group-hover:text-cyan-400 transition-colors duration-300">
        <span>Open reference</span>
        <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}

export default function Resources() {
  useEffect(() => {
    document.title = 'Resources | Yann Troadec'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', 'Interactive technical references and tools covering networking, cloud, security, and programming. Browse Cisco IOS commands, and more.')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col animate-fade-in-slow relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-20 pointer-events-none" />
      <FloatingParticles />
      <Header />

      <div className="flex-1 flex flex-col items-center px-6 py-16 relative z-10">
        {/* Page title */}
        <div className="text-center mb-14">
          <h2 className="text-5xl md:text-6xl font-bold font-mono text-white mb-4">
            Resources
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-6" />
          <p className="text-lg md:text-xl text-slate-400 font-mono">
            Interactive references & tools
          </p>
        </div>

        {/* Resource grid */}
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResourceCard
              title="Cisco IOS Reference"
              description="Complete command reference for Cisco routers and switches. Browse all IOS modes with searchable command tables and descriptions."
              category="Networking"
              categoryColor="#22d3ee"
              href="/resources/cisco-ios"
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="8" rx="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" />
                  <line x1="6" y1="6" x2="6.01" y2="6" />
                  <line x1="6" y1="18" x2="6.01" y2="18" />
                </svg>
              }
            />

            {/* Placeholder cards for future content */}
            <div className="block bg-slate-800/20 border border-slate-800 border-dashed rounded-xl p-6 opacity-40 cursor-default">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-700 bg-slate-800/50">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-600 mb-1">Cloud</div>
                  <div className="text-base font-bold font-mono text-slate-600 mb-2">Coming soon</div>
                  <div className="text-sm text-slate-700">AWS, Azure, or cloud networking references.</div>
                </div>
              </div>
            </div>

            <div className="block bg-slate-800/20 border border-slate-800 border-dashed rounded-xl p-6 opacity-40 cursor-default">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-700 bg-slate-800/50">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-600 mb-1">Security</div>
                  <div className="text-base font-bold font-mono text-slate-600 mb-2">Coming soon</div>
                  <div className="text-sm text-slate-700">Security concepts, tools, and references.</div>
                </div>
              </div>
            </div>

            <div className="block bg-slate-800/20 border border-slate-800 border-dashed rounded-xl p-6 opacity-40 cursor-default">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-700 bg-slate-800/50">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-600 mb-1">Programming</div>
                  <div className="text-base font-bold font-mono text-slate-600 mb-2">Coming soon</div>
                  <div className="text-sm text-slate-700">Code references, snippets, and cheat sheets.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
