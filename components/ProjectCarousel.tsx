'use client'

import { useState, useRef, useEffect } from 'react'

/**
 * ProjectCarousel Component
 * 
 * Displays projects in a carousel format with navigation arrows.
 * Only one project is visible at a time with smooth transitions.
 */
export default function ProjectCarousel({ 
  children,
  defaultIndex = 0
}: { 
  children: React.ReactNode[]
  defaultIndex?: number
}) {
  const [currentIndex, setCurrentIndex] = useState(defaultIndex)
  const projectsArray = Array.isArray(children) ? children : [children]
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 50

  // Navigate to previous project
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? projectsArray.length - 1 : prev - 1))
  }

  // Navigate to next project
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projectsArray.length - 1 ? 0 : prev + 1))
  }

  // Handle touch start
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  // Handle touch move
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  // Handle touch end
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrevious()
    }
  }

  return (
    <div className="relative w-full max-w-7xl">
      {/* Navigation Buttons - Hidden on mobile */}
      <div className="hidden md:flex items-center justify-center gap-6">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          className="group relative p-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20 disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={projectsArray.length <= 1}
          aria-label="Previous project"
        >
          <svg 
            className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Project Display */}
        <div className="flex-1 overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {projectsArray.map((project, index) => (
              <div 
                key={index} 
                className="w-full flex-shrink-0 flex justify-center px-4"
              >
                {project}
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="group relative p-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20 disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={projectsArray.length <= 1}
          aria-label="Next project"
        >
          <svg 
            className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Mobile: Swipeable carousel */}
      <div 
        className="md:hidden overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {projectsArray.map((project, index) => (
            <div 
              key={index} 
              className="w-full flex-shrink-0 px-4"
            >
              {project}
            </div>
          ))}
        </div>

        {/* Swipe instruction hint - shows on first load */}
        <div className="text-center mt-4 text-slate-500 font-mono text-xs">
          <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Swipe to navigate
          <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {projectsArray.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 bg-cyan-400' 
                : 'w-2 bg-slate-600 hover:bg-slate-500'
            }`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>

      {/* Project Counter */}
      <div className="text-center mt-4">
        <span className="text-slate-500 font-mono text-sm">
          {currentIndex + 1} / {projectsArray.length}
        </span>
      </div>
    </div>
  )
}