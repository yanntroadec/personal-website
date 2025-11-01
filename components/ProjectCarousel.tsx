'use client'

import { useState } from 'react'

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

  // Navigate to previous project
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? projectsArray.length - 1 : prev - 1))
  }

  // Navigate to next project
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projectsArray.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative w-full max-w-7xl">
      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-6">
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