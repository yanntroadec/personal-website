'use client'

import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import FloatingParticles from "../../../components/FloatingParticles"
import NetworkingCablesReference from "../../../components/NetworkingCablesReference"

export default function NetworkingCablesPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col animate-fade-in-slow relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-20 pointer-events-none" />
      <FloatingParticles />
      <Header />

      <div className="flex-1 flex flex-col px-2 sm:px-6 py-6 sm:py-12 relative z-10">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-white mb-4">
            Networking Cables
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-5" />
          <p className="text-base md:text-lg text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed">
            Interactive cable reference covering copper, fiber, serial, USB, and DAC.
            Filter by type, speed, distance, protocol, or vendor.
          </p>
        </div>

        {/* Tool */}
        <div className="flex-1 max-w-7xl mx-auto w-full bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden shadow-xl shadow-slate-900/50" style={{ minHeight: '600px' }}>
          <NetworkingCablesReference />
        </div>
      </div>

      <Footer />
    </div>
  )
}
