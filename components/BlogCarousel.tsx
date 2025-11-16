'use client'

import { useState, useEffect } from 'react'
import React from 'react'

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
  const [focusMode, setFocusMode] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const articlesArray = Array.isArray(children) ? children : [children]

  // Handle card click - make the card active when clicked or enter focus mode
  const handleCardClick = (index: number) => {
    if (index === currentIndex) {
      // If clicking active card, enter focus mode (hide other cards)
      setFocusMode(true)
    } else {
      // If clicking inactive card, make it active
      setCurrentIndex(index)
    }
  }

  // Add active state and click handler to child articles
  const articlesWithActiveState = articlesArray.map((article, index) => {
    if (React.isValidElement(article)) {
      const props: any = {
        isActive: index === currentIndex
      }

      // Add onClick for all cards
      props.onCardClick = (e: React.MouseEvent) => {
        e.preventDefault()
        handleCardClick(index)
      }

      return React.cloneElement(article as React.ReactElement<any>, props)
    }
    return article
  })
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 50

  // Navigate to previous article (circular)
  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev === 0 ? articlesArray.length - 1 : prev - 1
      return newIndex
    })
    setFocusMode(false) // Exit focus mode when navigating
  }

  // Navigate to next article (circular)
  const handleNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev === articlesArray.length - 1 ? 0 : prev + 1
      return newIndex
    })
    setFocusMode(false) // Exit focus mode when navigating
  }

  // Handle touch start (horizontal)
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsDragging(true)
  }

  // Handle touch move (horizontal)
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return

    const currentTouch = e.targetTouches[0].clientX
    setTouchEnd(currentTouch)

    // Calculate drag offset for smooth scrolling
    const offset = currentTouch - touchStart
    setDragOffset(offset)
  }

  // Handle touch end (horizontal)
  const onTouchEnd = () => {
    setIsDragging(false)
    setDragOffset(0)

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

        {/* Article Display with previews */}
        <div className="w-full relative">
          <div className="flex flex-col items-center gap-4">
            {/* Current article (full opacity) */}
            <div className="w-full transition-all duration-500">
              {articlesWithActiveState[currentIndex]}
            </div>

            {/* Next article preview (semi-transparent) - only show below, clickable, hidden in focus mode */}
            {articlesArray.length > 1 && !focusMode && (
              <div
                onClick={() => handleCardClick(currentIndex === articlesArray.length - 1 ? 0 : currentIndex + 1)}
                className="hidden lg:block w-full opacity-35 cursor-pointer hover:opacity-50 transition-all duration-500"
              >
                {articlesArray[currentIndex === articlesArray.length - 1 ? 0 : currentIndex + 1]}
              </div>
            )}
          </div>
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

      {/* Mobile: Swipeable carousel with progressive scroll */}
      <div
        className="md:hidden overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={`flex ${isDragging ? '' : 'transition-transform duration-500 ease-out'}`}
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`
          }}
        >
          {/* Render all articles */}
          {articlesWithActiveState.map((article, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 px-4"
            >
              {article}
            </div>
          ))}
        </div>

        {/* Swipe instruction hint - shows on first load */}
        <div className="text-center mt-4 text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Swipe to navigate
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
