'use client'

import Link from "next/link"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import CaesarToolkit from "../../../components/CaesarToolkit"
import FloatingParticles from "../../../components/FloatingParticles"

/**
 * Caesar Cipher Project Detail Page
 */
export default function CaesarCipherProject() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col animate-fade-in-slow relative overflow-hidden">
      {/* Subtle grain texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>

      {/* Animated particle system background */}
      <FloatingParticles />

      {/* Site header */}
      <Header />

      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 py-12 relative z-10">
        {/* Back button */}
        <div className="mb-8 max-w-7xl mx-auto w-full">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
        </div>

        {/* Project title and description */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold font-mono text-white mb-4">
            Caesar Cipher Decryptor
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-slate-400 font-mono max-w-3xl mx-auto leading-relaxed">
            An automatic Caesar cipher decoder supporting four languages with frequency analysis.
          </p>
        </div>

        {/* Tool container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-7xl bg-slate-800/30 backdrop-blur-sm border-2 border-cyan-400 rounded-2xl p-8 shadow-lg shadow-cyan-400/20">
            <CaesarToolkit />
          </div>
        </div>

        {/* GitHub link */}
        <div className="mt-8 flex justify-center">
          <a
            href="https://github.com/yanntroadec/caesar-cipher-toolkit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold font-mono rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-slate-600/50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.868 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.091-.646.35-1.088.636-1.339-2.221-.252-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.269.098-2.646 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.338 1.909-1.295 2.748-1.025 2.748-1.025.546 1.377.203 2.393.1 2.646.64.699 1.028 1.593 1.028 2.686 0 3.847-2.337 4.696-4.565 4.944.36.31.68.923.68 1.861 0 1.343-.012 2.427-.012 2.758 0 .267.18.579.688.481C19.135 20.202 22 16.447 22 12.02 22 6.484 17.522 2 12 2z" />
            </svg>
            View on GitHub
          </a>
        </div>
      </div>

      {/* Site footer */}
      <Footer />
    </div>
  )
}
