'use client'

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import AboutCard from "../../components/AboutCard"
import FloatingParticles from "../../components/FloatingParticles"
import { useEffect } from 'react'

/**
 * About Page Component
 *
 * Professional profile page featuring personal information,
 * contact details, certifications, and social links.
 */
export default function About() {
  // Update page metadata dynamically for client component
  useEffect(() => {
    document.title = 'About | Yann Troadec'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn more about Yann Troadec, software developer from Rennes, France. Specializing in systems programming, networking, and backend development with expertise in JavaScript, TypeScript, and Cisco networking.')
    }
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col animate-fade-in-slow relative overflow-hidden">
      {/* Subtle grain texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>

      {/* Animated particle system background */}
      <FloatingParticles />

      {/* Site header */}
      <Header />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">
        {/* Page title */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold font-mono text-white mb-4">
            About
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-slate-400 font-mono">
            Get to know me
          </p>
        </div>

        {/* About card */}
        <AboutCard />
      </div>

      {/* Site footer */}
      <Footer />
    </div>
  )
}