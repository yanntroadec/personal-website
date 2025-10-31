'use client'

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import ProjectCard from "../../components/ProjectCard"
import CaesarToolkit from "../../components/CaesarToolkit"
import FloatingParticles from "../../components/FloatingParticles"

export default function Projects() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col animate-fade-in-slow relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>
      <FloatingParticles />

      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold font-mono text-white mb-4">
            Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-slate-400 font-mono">
            Explore my latest work and experiments
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap justify-center items-stretch gap-6 max-w-7xl w-full">
          {/* Project 1: Decryptor */}
          <ProjectCard
            title="Caesar Cipher Decryptor"
            description="A tool to automatically decode Caesar-encrypted messages in English using frequency analysis."
            githubUrl="https://github.com/yanntroadec/caesar-cipher-toolkit"
          >
            <CaesarToolkit />
          </ProjectCard>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
