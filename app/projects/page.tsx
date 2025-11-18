'use client'

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import ProjectCard from "../../components/ProjectCard"
import ProjectCarousel from "../../components/ProjectCarousel"
import FloatingParticles from "../../components/FloatingParticles"

/**
 * Projects Page Component
 *
 * Interactive projects showcase featuring:
 * - Horizontal carousel navigation with arrow controls
 * - Four projects: Personal Website, Caesar Cipher, Clockwise Game, Packet Tracer Labs
 * - GitHub repository integration with expandable file tree
 * - Caesar Cipher decoder as default displayed project
 * - Uniform card sizing with adaptive height
 * - Floating particle animation background
 */
export default function Projects() {
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
            Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-slate-400 font-mono">
            Explore my latest work and experiments
          </p>
        </div>

        {/* Project carousel with default display on Network Labs */}
        <ProjectCarousel defaultIndex={1}>
          {/* Project 1: Personal Website */}
          <ProjectCard
            title="Personal Website"
            description="The source code for this portfolio website built with Next.js, TypeScript, and Tailwind CSS."
            projectUrl="/projects/personal-website"
            githubUrl="https://github.com/yanntroadec/personal-website"
          />

          {/* Project 2: Cisco Packet Tracer Labs */}
          <ProjectCard
            title="Cisco Packet Tracer Network Labs"
            description="Enterprise network lab series featuring comprehensive Packet Tracer configurations for learning and practicing networking concepts."
            projectUrl="/projects/packet-tracer-labs"
            githubUrl="https://github.com/yanntroadec/cisco-packettracer-networklabs-series-01-enterprise"
          />

          {/* Project 3: Caesar Cipher Decryptor */}
          <ProjectCard
            title="Caesar Cipher Decryptor"
            description="An automatic Caesar cipher decoder supporting four languages with frequency analysis."
            projectUrl="/projects/caesar-cipher"
            githubUrl="https://github.com/yanntroadec/caesar-cipher-toolkit"
          />

          {/* Project 4: Clockwise Game */}
          <ProjectCard
            title="Clockwise"
            description="A browser-based timing and strategy game where you align rotating color wheels to beat the clock."
            projectUrl="/projects/clockwise"
            githubUrl="https://github.com/yanntroadec/personal-website/blob/main/components/ClockwiseGame.tsx"
          />
        </ProjectCarousel>
      </div>

      {/* Site footer */}
      <Footer />
    </div>
  )
}