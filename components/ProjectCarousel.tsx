'use client'

import { useState, useRef, useEffect } from 'react'
import React from 'react'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(defaultIndex)
  const [focusMode, setFocusMode] = useState(false)
  const projectsArray = Array.isArray(children) ? children : [children]

  // Project URLs mapping
  const projectUrls = [
    '/projects/personal-website',
    '/projects/caesar-cipher',
    '/projects/clockwise',
    '/projects/packet-tracer-labs'
  ]

  // Handle card click
  const handleCardClick = (index: number) => {
    if (index === currentIndex) {
      // If clicking active card, enter focus mode (hide other cards)
      setFocusMode(true)
    } else {
      // If clicking inactive card, make it active
      setCurrentIndex(index)
    }
  }

  // Add active state and click handler to child projects
  const projectsWithActiveState = projectsArray.map((project, index) => {
    if (React.isValidElement(project)) {
      return React.cloneElement(project as React.ReactElement<any>, {
        isActive: index === currentIndex,
        onClick: () => handleCardClick(index)
      })
    }
    return project
  })
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 50

  // Navigate to previous project
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? projectsArray.length - 1 : prev - 1))
    setFocusMode(false) // Exit focus mode when navigating
  }

  // Navigate to next project
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projectsArray.length - 1 ? 0 : prev + 1))
    setFocusMode(false) // Exit focus mode when navigating
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
          className="group relative p-4 bg-slate-800/70 backdrop-blur-sm border-2 border-cyan-400/30 rounded-xl hover:border-cyan-400 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/40 hover:bg-slate-800/90 disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-x-1"
          disabled={projectsArray.length <= 1}
          aria-label="Previous project"
        >
          <svg 
            className="w-7 h-7 text-white group-hover:text-cyan-400 transition-colors duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Project Display with 3D carousel effect */}
        <div className="flex-1 overflow-visible relative" style={{ perspective: '2000px' }}>
          <div className="flex items-center justify-center gap-8 relative">
            {/* Previous project preview (rotated left, 3D depth) - Clickable, hidden in focus mode */}
            {projectsArray.length > 1 && !focusMode && (
              <div
                onClick={() => handleCardClick(currentIndex === 0 ? projectsArray.length - 1 : currentIndex - 1)}
                className="hidden lg:block flex-shrink-0 opacity-35 cursor-pointer hover:opacity-50 transition-all duration-500"
                style={{
                  transform: 'rotateY(45deg) scale(0.85) translateZ(-200px) translateX(-50px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {projectsArray[currentIndex === 0 ? projectsArray.length - 1 : currentIndex - 1]}
              </div>
            )}

            {/* Current project (centered, no rotation) */}
            <div
              className="flex-shrink-0 transition-all duration-500 relative z-10"
              style={{
                transform: 'rotateY(0deg) scale(1) translateZ(0px)',
                transformStyle: 'preserve-3d'
              }}
            >
              {projectsWithActiveState[currentIndex]}
            </div>

            {/* Next project preview (rotated right, 3D depth) - Clickable, hidden in focus mode */}
            {projectsArray.length > 1 && !focusMode && (
              <div
                onClick={() => handleCardClick(currentIndex === projectsArray.length - 1 ? 0 : currentIndex + 1)}
                className="hidden lg:block flex-shrink-0 opacity-35 cursor-pointer hover:opacity-50 transition-all duration-500"
                style={{
                  transform: 'rotateY(-45deg) scale(0.85) translateZ(-200px) translateX(50px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {projectsArray[currentIndex === projectsArray.length - 1 ? 0 : currentIndex + 1]}
              </div>
            )}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="group relative p-4 bg-slate-800/70 backdrop-blur-sm border-2 border-cyan-400/30 rounded-xl hover:border-cyan-400 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/40 hover:bg-slate-800/90 disabled:opacity-30 disabled:cursor-not-allowed hover:translate-x-1"
          disabled={projectsArray.length <= 1}
          aria-label="Next project"
        >
          <svg 
            className="w-7 h-7 text-white group-hover:text-cyan-400 transition-colors duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
          {/* Render all projects */}
          {projectsWithActiveState.map((project, index) => (
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
        <span className="text-white font-mono text-sm font-semibold">
          {currentIndex + 1} / {projectsArray.length}
        </span>
      </div>
    </div>
  )
}