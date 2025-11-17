'use client'

import Link from "next/link"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import FloatingParticles from "../../../components/FloatingParticles"
import ClockwiseGame from "../../../components/ClockwiseGame"

/**
 * Clockwise Project Page
 *
 * Interactive timing/strategy game where players align rotating color wheels
 * to reduce a counter to zero.
 */
export default function ClockwisePage() {
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
            Clockwise
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-slate-400 font-mono max-w-3xl mx-auto leading-relaxed">
            A browser-based timing and strategy game where you align rotating color wheels to beat the clock.
            Master the patterns, control the chaos, and race against time!
          </p>
        </div>

        {/* Game container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-7xl bg-slate-800/30 backdrop-blur-sm border-2 border-cyan-400 rounded-2xl p-8 shadow-lg shadow-cyan-400/20">
            <ClockwiseGame />
          </div>
        </div>

        {/* Project details */}
        <div className="mt-12 max-w-4xl mx-auto space-y-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold font-mono text-cyan-400 mb-4">Game Mechanics</h2>
            <div className="text-slate-400 font-mono text-sm space-y-3">
              <p><strong className="text-white">Counter System:</strong> The counter starts at 60 and increases by 1 every second. Your goal is to reduce it to 0 by aligning the colored wheels. When you reach 0, you win!</p>
              <p><strong className="text-white">Difficulty Levels:</strong> Choose between Easy (4s rotation), Medium (2s rotation), or Hard (1s rotation) to control the speed of the wheels.</p>
              <p><strong className="text-white">Wheel Behavior:</strong> All 5 wheels share the same cyclical color sequence, but even-numbered wheels (2, 4) start at a different position. Odd-numbered wheels (1, 3, 5) rotate clockwise, while even-numbered wheels rotate counter-clockwise.</p>
              <p><strong className="text-white">Scoring:</strong> Align 3 wheels for -1 second, 4 wheels for -10 seconds, or all 5 wheels for -60 seconds!</p>
              <p><strong className="text-white">Strategy:</strong> Watch the colored arc around each wheel showing the next color. Timing your manual "Next" rotations with the auto-rotation is key to creating alignments.</p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold font-mono text-cyan-400 mb-4">Technical Implementation</h2>
            <div className="text-slate-400 font-mono text-sm space-y-3">
              <p><strong className="text-white">Built with:</strong> React/Next.js with TypeScript for type-safe game logic</p>
              <p><strong className="text-white">State Management:</strong> React hooks (useState, useEffect, useCallback) for game state, auto-rotation timers, and real-time alignment detection</p>
              <p><strong className="text-white">Graphics:</strong> SVG paths with trigonometric calculations for color wheel segments and dynamic arc indicators</p>
              <p><strong className="text-white">Animations:</strong> Tailwind CSS transitions for smooth color changes, center circle fills, and score display effects</p>
              <p><strong className="text-white">Responsive Design:</strong> Adaptive layout with desktop (single row) and mobile (two-row) wheel arrangements, fully touch-friendly</p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold font-mono text-cyan-400 mb-4">Features</h2>
            <ul className="text-slate-400 font-mono text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">▸</span>
                <span>5 wheels with synchronized color sequences and bidirectional rotation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">▸</span>
                <span>Three difficulty levels with adjustable rotation speeds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">▸</span>
                <span>Colored arc indicators showing the next color for each wheel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">▸</span>
                <span>Real-time alignment detection with visual feedback (center circle fill)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">▸</span>
                <span>Victory condition with "You Won!" message when counter reaches 0</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">▸</span>
                <span>Randomized starting positions for replayability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">▸</span>
                <span>Responsive mobile layout with optimized wheel arrangement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">▸</span>
                <span>Stop game functionality to reset and start over</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Site footer */}
      <Footer />
    </div>
  )
}
