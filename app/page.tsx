'use client'

import Link from "next/link"
import Header from "../components/Header"
import FloatingParticles from "../components/FloatingParticles"
import Footer from "../components/Footer"

/**
 * Home Page Component
 * 
 * Main landing page featuring:
 * - Hero section with animated name
 * - Navigation cards to Projects, Blog, and About sections with staggered layout
 * - Floating particle animation background
 * - Cyberpunk/tech aesthetic with cyan accents
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col relative overflow-hidden">
      {/* Subtle grain texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>
      
      {/* Animated particle system background */}
      <FloatingParticles />
      
      {/* Site header with home button */}
      <Header />
      
      {/* Tagline section */}
      <div className="w-full flex justify-center pt-12 md:pt-16 pb-8 md:pb-12 z-10">
        <div className="text-center">
          <span className="text-cyan-400 text-2xl md:text-4xl font-semibold font-mono">
           Systems, layer by layer
          </span>
          {/* Decorative line */}
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-4 mx-auto opacity-50"></div>
        </div>
      </div>
      
      {/* Main content container with two columns */}
      <div className="flex flex-col md:flex-row flex-1 items-center w-full relative">
        {/* Vertical separator line (desktop only) */}
        <div
          className="hidden md:block pointer-events-none absolute top-1/2 left-1/2 w-[1px] h-[60vh] z-0 opacity-20"
          style={{
            transform: "translate(-50%, -50%)",
            background:
              "linear-gradient(to bottom, transparent, #64748b 20%, #64748b 80%, transparent)",
          }}
        />

        {/* Left column - Hero section with introduction */}
        <div className="flex justify-center items-center md:w-1/2 w-full z-10 px-6 py-8 md:py-16">
          <div className="w-full max-w-md">
            <h1 className="text-left font-mono text-3xl md:text-5xl font-bold leading-relaxed tracking-tight">
              {/* Greeting text */}
              <span className="block text-slate-400 text-xl md:text-2xl mb-4 font-normal">
                Hi, I'm 
              </span>
              {/* Name with neon glow effect */}
              <span
                className="block text-white mb-4 text-5xl md:text-7xl font-extrabold tracking-wide drop-shadow-2xl"
                style={{
                  textShadow: `
        0 0 50px rgba(34, 211, 238, 1),
        0 0 80px rgba(34, 211, 238, 0.8),
        0 0 120px rgba(34, 211, 238, 0.6),
        0 0 160px rgba(34, 211, 238, 0.4),
        0 5px 10px rgba(0, 0, 0, 0.6)
      `,
                }}
              >
                Yann,
              </span>
            </h1>

            {/* Introduction paragraph */}
            <p className="text-slate-400 text-base md:text-lg mt-6 font-mono leading-relaxed">
              Technical support professional building expertise in backend development, networking, and infrastructure.
            </p>
            
            {/* Decorative accent line */}
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-transparent mt-8"></div>
          </div>
        </div>

        {/* Right column - Navigation cards with staggered layout */}
        <div className="flex justify-center items-center md:w-1/2 w-full px-6 py-8 md:py-16 z-10">
          <div className="w-full max-w-md space-y-6">
            {/* Projects navigation card - Left aligned */}
            <div className="md:mr-20">
              <Link href="/projects" className="group relative block w-full">
                <div className="relative bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700/50 rounded-2xl p-8 transition-all duration-300 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-400/20 hover:-translate-y-1">
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>

                  <div className="relative flex items-center justify-between">
                    <div className="flex-1">
                      {/* Card title */}
                      <h3 className="text-4xl md:text-5xl font-bold font-mono text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                        Projects
                      </h3>
                      {/* Card description */}
                      <p className="text-slate-400 font-mono text-sm md:text-base">
                        What I'm building
                      </p>
                    </div>

                    {/* Animated arrow icon */}
                    <div className="ml-4 transform group-hover:translate-x-2 transition-transform duration-300">
                      <svg
                        className="w-8 h-8 text-cyan-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom progress bar on hover */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
                </div>
              </Link>
            </div>

            {/* Blog navigation card - Right aligned */}
            <div className="md:ml-20">
              <Link href="/blog" className="group relative block w-full">
                <div className="relative bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700/50 rounded-2xl p-8 transition-all duration-300 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-400/20 hover:-translate-y-1">
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>

                  <div className="relative flex items-center justify-between">
                    <div className="flex-1">
                      {/* Card title */}
                      <h3 className="text-4xl md:text-5xl font-bold font-mono text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                        Blog
                      </h3>
                      {/* Card description */}
                      <p className="text-slate-400 font-mono text-sm md:text-base">
                        Thoughts & discoveries
                      </p>
                    </div>

                    {/* Animated arrow icon */}
                    <div className="ml-4 transform group-hover:translate-x-2 transition-transform duration-300">
                      <svg
                        className="w-8 h-8 text-cyan-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom progress bar on hover */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
                </div>
              </Link>
            </div>

            {/* About navigation card - Left aligned */}
            <div className="md:mr-20">
              <Link href="/about" className="group relative block w-full">
                <div className="relative bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700/50 rounded-2xl p-8 transition-all duration-300 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-400/20 hover:-translate-y-1">
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>

                  <div className="relative flex items-center justify-between">
                    <div className="flex-1">
                      {/* Card title */}
                      <h3 className="text-4xl md:text-5xl font-bold font-mono text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                        About
                      </h3>
                      {/* Card description */}
                      <p className="text-slate-400 font-mono text-sm md:text-base">
                        Get to know me
                      </p>
                    </div>

                    {/* Animated arrow icon */}
                    <div className="ml-4 transform group-hover:translate-x-2 transition-transform duration-300">
                      <svg
                        className="w-8 h-8 text-cyan-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom progress bar on hover */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Site footer with social links */}
      <Footer />
    </div>
  );
}