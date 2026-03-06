'use client'

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import ArticleCard from "../../components/ArticleCard"
import BlogCarousel from "../../components/BlogCarousel"
import FloatingParticles from "../../components/FloatingParticles"
import { useEffect } from 'react'

/**
 * Blog Page Component
 *
 * Blog listing page featuring:
 * - Article cards with preview and metadata
 * - Networking, security, and backend development topics
 * - Floating particle animation background
 * - Consistent dark theme with cyan accents
 */
export default function Blog() {
  // Update page metadata dynamically for client component
  useEffect(() => {
    document.title = 'Blog | Yann Troadec'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Technical articles about networking, systems programming, and backend development. Learn about Cisco networking, VLAN configuration, TCP/IP protocols, and modern web technologies.')
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
        {/* Page title and description */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold font-mono text-white mb-4">
            Blog
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-slate-400 font-mono max-w-2xl leading-relaxed">
            Welcome to my blog! Dive into articles about networking, security,
            and backend development.
          </p>
        </div>

        {/* Article carousel */}
        <div className="mt-8 w-full flex justify-center">
          <BlogCarousel defaultIndex={0}>
            <ArticleCard
              title="VLAN Configuration Essentials: Segmenting Your Network"
              date="2025-11-17"
              excerpt="Comprehensive guide on configuring VLANs on Cisco switches, covering VLAN basics, trunking, and best practices for network segmentation."
              link="/blog/vlan-configuration"
            />
            <ArticleCard
              title="Cisco IOS Fundamentals and Advanced Techniques"
              date="2025-11-16"
              excerpt="Master the essentials of Cisco IOS with comprehensive coverage of navigation, configuration modes, and advanced command-line techniques."
              link="/blog/ios-fundamentals-advanced"
            />
            <ArticleCard
              title="Cisco SSH Deep Dive: How to Secure, Configure, and Harden Remote Access"
              date="2025-11-01"
              excerpt="Deep dive into SSH configuration and security best practices on Cisco routers and switches."
              link="/blog/ssh-configuration"
            />
          </BlogCarousel>
        </div>
      </div>

      {/* Site footer */}
      <Footer />
    </div>
  )
}