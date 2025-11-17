'use client'

import Link from "next/link"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import GitHubRepoPreview from "../../../components/GitHubRepoPreview"
import FloatingParticles from "../../../components/FloatingParticles"

/**
 * Packet Tracer Labs Project Detail Page
 */
export default function PacketTracerLabsProject() {
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
            Cisco Packet Tracer Network Labs
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-slate-400 font-mono max-w-3xl mx-auto leading-relaxed">
            Enterprise network lab series featuring comprehensive Packet Tracer configurations for learning and practicing networking concepts.
          </p>
        </div>

        {/* Repository preview container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-7xl bg-slate-800/30 backdrop-blur-sm border-2 border-cyan-400 rounded-2xl p-8 shadow-lg shadow-cyan-400/20">
            <GitHubRepoPreview repoUrl="https://github.com/yanntroadec/cisco-packettracer-networklabs-series-01-enterprise" />
          </div>
        </div>
      </div>

      {/* Site footer */}
      <Footer />
    </div>
  )
}
