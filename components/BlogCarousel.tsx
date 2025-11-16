'use client'

import { useState } from 'react'

/**
 * BlogCarousel Component
 *
 * Displays blog articles in a vertical carousel format with navigation arrows.
 * Only one article is visible at a time with smooth transitions.
 */
export default function BlogCarousel({
  children,
  defaultIndex = 0
}: {
  children: React.ReactNode[]
  defaultIndex?: number
}) {
  const [currentIndex, setCurrentIndex] = useState(defaultIndex)
  const articlesArray = Array.isArray(children) ? children : [children]
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 50

  // Navigate to previous article
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? articlesArray.length - 1 : prev - 1))
  }

  // Navigate to next article
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === articlesArray.length - 1 ? 0 : prev + 1))
  }

  // Handle touch start (vertical)
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientY)
  }

  // Handle touch move (vertical)
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY)
  }

  // Handle touch end (vertical)
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isUpSwipe = distance > minSwipeDistance
    const isDownSwipe = distance < -minSwipeDistance

    if (isUpSwipe) {
      handleNext()
    } else if (isDownSwipe) {
      handlePrevious()
    }
  }

  return (
    <div className="relative w-full max-w-4xl">
      {/* Navigation Buttons - Hidden on mobile */}
      <div className="hidden md:flex flex-col items-center gap-6">
        {/* Previous Button (Up Arrow) */}
        <button
          onClick={handlePrevious}
          className="group relative p-4 bg-slate-800/70 backdrop-blur-sm border-2 border-cyan-400/30 rounded-xl hover:border-cyan-400 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/40 hover:bg-slate-800/90 disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-1"
          disabled={articlesArray.length <= 1}
          aria-label="Previous article"
        >
          <svg
            className="w-7 h-7 text-white group-hover:text-cyan-400 transition-colors duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Article Display - Show only current article */}
        <div className="w-full">
          {articlesArray[currentIndex]}
        </div>

        {/* Next Button (Down Arrow) */}
        <button
          onClick={handleNext}
          className="group relative p-4 bg-slate-800/70 backdrop-blur-sm border-2 border-cyan-400/30 rounded-xl hover:border-cyan-400 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/40 hover:bg-slate-800/90 disabled:opacity-30 disabled:cursor-not-allowed hover:translate-y-1"
          disabled={articlesArray.length <= 1}
          aria-label="Next article"
        >
          <svg
            className="w-7 h-7 text-white group-hover:text-cyan-400 transition-colors duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Mobile: Swipeable carousel - Show only current article */}
      <div
        className="md:hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {articlesArray[currentIndex]}

        {/* Swipe instruction hint - shows on first load */}
        <div className="text-center mt-4 text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Swipe to navigate
          <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex flex-col items-center gap-2 mt-8 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 md:mt-0">
        {articlesArray.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'h-8 bg-cyan-400'
                : 'h-2 bg-slate-600 hover:bg-slate-500'
            }`}
            aria-label={`Go to article ${index + 1}`}
          />
        ))}
      </div>

      {/* Article Counter */}
      <div className="text-center mt-4">
        <span className="text-white font-mono text-sm font-semibold">
          {currentIndex + 1} / {articlesArray.length}
        </span>
      </div>
    </div>
  )
}
