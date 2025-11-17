'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * ClockwiseGame Component
 *
 * A browser-based timing/strategy game where players align rotating color wheels
 * to reduce a counter to zero. Features 5 wheels with different color sequences,
 * auto-rotation, and manual controls.
 */

type Color = 'Coral' | 'Sky' | 'Mint' | 'Lavender' | 'Amber'

// Fixed color sequences for each wheel
// Odd wheels (1,3,5) have one sequence, even wheels (2,4) have a different sequence
const WHEEL_SEQUENCES: Color[][] = [
  ['Coral', 'Sky', 'Mint', 'Lavender', 'Amber'],      // Wheel 1 (clockwise)
  ['Mint', 'Sky', 'Coral', 'Amber', 'Lavender'],      // Wheel 2 (counter-clockwise)
  ['Coral', 'Sky', 'Mint', 'Lavender', 'Amber'],      // Wheel 3 (clockwise)
  ['Mint', 'Sky', 'Coral', 'Amber', 'Lavender'],      // Wheel 4 (counter-clockwise)
  ['Coral', 'Sky', 'Mint', 'Lavender', 'Amber']       // Wheel 5 (clockwise)
]

const COLOR_PALETTE: Record<Color, string> = {
  'Coral': '#FF6B6B',
  'Sky': '#4ECDC4',
  'Mint': '#95E1D3',
  'Lavender': '#C7CEEA',
  'Amber': '#FFD93D'
}

export default function ClockwiseGame() {
  const [counter, setCounter] = useState(60)
  const [wheelPositions, setWheelPositions] = useState<number[]>([0, 0, 0, 0, 0])
  const [isRunning, setIsRunning] = useState(false)
  const [lastAlignment, setLastAlignment] = useState<{ count: number; score: number } | null>(null)
  const [showLockEffect, setShowLockEffect] = useState(false)
  const [rotationSpeed, setRotationSpeed] = useState(4) // Speed in seconds (1-10)

  // Initialize game with random starting positions (all different)
  const initializeGame = useCallback((speed: number) => {
    const colors: Color[] = ['Coral', 'Sky', 'Mint', 'Lavender', 'Amber']
    const shuffled = [...colors].sort(() => Math.random() - 0.5)

    const positions = WHEEL_SEQUENCES.map((sequence, wheelIndex) => {
      const targetColor = shuffled[wheelIndex]
      return sequence.indexOf(targetColor)
    })

    setWheelPositions(positions)
    setCounter(60)
    setRotationSpeed(speed)
    setIsRunning(true)
    setLastAlignment(null)
    setShowLockEffect(false)
  }, [])

  // Stop game
  const stopGame = useCallback(() => {
    setIsRunning(false)
    setCounter(60)
    setLastAlignment(null)
    setShowLockEffect(false)
    setAlignedWheels(new Set())
    setAlignedColor(null)
  }, [])

  // State to track which wheels are aligned and their aligned color
  const [alignedWheels, setAlignedWheels] = useState<Set<number>>(new Set())
  const [alignedColor, setAlignedColor] = useState<Color | null>(null)

  // Check for alignment and update counter
  const checkAlignment = useCallback((positions: number[]) => {
    // Calculate NEXT colors (the ones shown by the colored arcs)
    const nextColors = positions.map((pos, wheelIdx) => {
      const isClockwise = wheelIdx % 2 === 0
      const sequence = WHEEL_SEQUENCES[wheelIdx]
      const nextPos = isClockwise
        ? (pos + 1) % sequence.length
        : (pos - 1 + sequence.length) % sequence.length
      return sequence[nextPos]
    })

    const colorCounts = nextColors.reduce((acc, color) => {
      acc[color] = (acc[color] || 0) + 1
      return acc
    }, {} as Record<Color, number>)

    const maxAlignment = Math.max(...Object.values(colorCounts))

    let scoreChange = 0
    if (maxAlignment === 3) scoreChange = -1
    else if (maxAlignment === 4) scoreChange = -10
    else if (maxAlignment === 5) scoreChange = -60

    if (scoreChange !== 0) {
      setCounter(prev => Math.max(0, prev + scoreChange))
      setLastAlignment({ count: maxAlignment, score: scoreChange })
      setShowLockEffect(true)

      // Find which color is aligned and which wheels have it
      const alignedColorName = Object.entries(colorCounts).find(([_, count]) => count === maxAlignment)?.[0] as Color
      const alignedWheelIndices = new Set(
        nextColors.map((color, idx) => color === alignedColorName ? idx : -1).filter(idx => idx !== -1)
      )

      setAlignedColor(alignedColorName)
      setAlignedWheels(alignedWheelIndices)

      setTimeout(() => {
        setShowLockEffect(false)
        setAlignedWheels(new Set())
        setAlignedColor(null)
      }, 1000)
    }
  }, [])

  // Counter increment effect (every 1 second)
  useEffect(() => {
    if (!isRunning) return

    const counterInterval = setInterval(() => {
      setCounter(prev => prev + 1)
    }, 1000)

    return () => clearInterval(counterInterval)
  }, [isRunning])

  // Auto-stop game when counter reaches 0 (victory condition)
  useEffect(() => {
    if (counter <= 0 && isRunning) {
      setIsRunning(false)
    }
  }, [counter, isRunning])

  // Wheel auto-rotation effect (speed controlled by rotationSpeed)
  useEffect(() => {
    if (!isRunning) return

    const wheelInterval = setInterval(() => {
      setWheelPositions(prev => {
        const newPositions = prev.map((pos, wheelIdx) => {
          // Odd wheels (1,3,5) rotate clockwise, even (2,4) counter-clockwise
          const isClockwise = wheelIdx % 2 === 0
          const sequence = WHEEL_SEQUENCES[wheelIdx]
          return isClockwise
            ? (pos + 1) % sequence.length
            : (pos - 1 + sequence.length) % sequence.length
        })
        checkAlignment(newPositions)
        return newPositions
      })
    }, rotationSpeed * 1000) // Convert seconds to milliseconds

    return () => clearInterval(wheelInterval)
  }, [isRunning, checkAlignment, rotationSpeed])

  // Manual wheel control
  const rotateWheel = (wheelIndex: number, direction: 'forward' | 'backward') => {
    setWheelPositions(prev => {
      const newPositions = [...prev]
      const sequence = WHEEL_SEQUENCES[wheelIndex]
      const isClockwise = wheelIndex % 2 === 0

      if (direction === 'forward') {
        // Forward = same direction as auto-rotation
        newPositions[wheelIndex] = isClockwise
          ? (prev[wheelIndex] + 1) % sequence.length
          : (prev[wheelIndex] - 1 + sequence.length) % sequence.length
      } else {
        // Backward = opposite direction of auto-rotation
        newPositions[wheelIndex] = isClockwise
          ? (prev[wheelIndex] - 1 + sequence.length) % sequence.length
          : (prev[wheelIndex] + 1) % sequence.length
      }

      checkAlignment(newPositions)
      return newPositions
    })
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Counter Display or Victory Message */}
      <div className="text-center">
        {counter === 0 ? (
          <div className="text-6xl font-bold font-mono text-green-400 animate-pulse">
            You Won!
          </div>
        ) : (
          <div className="text-8xl font-bold font-mono text-cyan-400 transition-all duration-300">
            {counter}
          </div>
        )}
      </div>

      {/* Alignment Feedback - Fixed height to prevent card resizing */}
      <div className="min-h-[60px] flex items-center justify-center">
        {lastAlignment && showLockEffect && (
          <div className="text-center animate-pulse">
            <div className="text-4xl font-bold font-mono text-cyan-400">
              {lastAlignment.score}
            </div>
          </div>
        )}
      </div>

      {/* Difficulty Selection - Only visible when game is not running */}
      {!isRunning && (
        <div className="flex justify-center gap-2 md:gap-4">
          <button
            onClick={() => initializeGame(4)}
            className="px-3 py-2 md:px-6 md:py-3 bg-emerald-300 hover:bg-emerald-200 text-slate-800 font-bold font-mono text-xs md:text-base rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-300/50"
          >
            Easy
          </button>
          <button
            onClick={() => initializeGame(2)}
            className="px-3 py-2 md:px-6 md:py-3 bg-amber-300 hover:bg-amber-200 text-slate-800 font-bold font-mono text-xs md:text-base rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-300/50"
          >
            Medium
          </button>
          <button
            onClick={() => initializeGame(1)}
            className="px-3 py-2 md:px-6 md:py-3 bg-rose-300 hover:bg-rose-200 text-slate-800 font-bold font-mono text-xs md:text-base rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-rose-300/50"
          >
            Hard
          </button>
        </div>
      )}

      {/* Wheels Display - Desktop: single row of 5 */}
      <div className="hidden md:grid grid-cols-5 gap-4 md:gap-6">
        {wheelPositions.map((position, wheelIdx) => {
          const isClockwise = wheelIdx % 2 === 0
          const sequence = WHEEL_SEQUENCES[wheelIdx]
          const nextPosition = isClockwise
            ? (position + 1) % sequence.length
            : (position - 1 + sequence.length) % sequence.length
          const nextColor = sequence[nextPosition]

          return (
            <div key={wheelIdx} className="flex flex-col items-center space-y-3">
              <div className="relative w-24 h-24 md:w-28 md:h-28">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {sequence.map((color, idx) => {
                    const startAngle = (idx * 72 - 90) * (Math.PI / 180)
                    const endAngle = ((idx + 1) * 72 - 90) * (Math.PI / 180)
                    const x1 = 50 + 45 * Math.cos(startAngle)
                    const y1 = 50 + 45 * Math.sin(startAngle)
                    const x2 = 50 + 45 * Math.cos(endAngle)
                    const y2 = 50 + 45 * Math.sin(endAngle)
                    const pathData = `M 50 50 L ${x1} ${y1} A 45 45 0 0 1 ${x2} ${y2} Z`
                    return (
                      <path key={`${wheelIdx}-${color}-${idx}`} d={pathData} fill={COLOR_PALETTE[color]}
                        stroke="#1e293b" strokeWidth="1" className={`transition-all duration-500 ${showLockEffect ? 'opacity-100' : 'opacity-90'}`} />
                    )
                  })}
                  <circle cx="50" cy="50" r="18"
                    fill={showLockEffect && alignedWheels.has(wheelIdx) && alignedColor ? COLOR_PALETTE[alignedColor] : "#0f172a"}
                    stroke="#334155" strokeWidth="2" className="transition-all duration-300" />
                  {(() => {
                    const arcStartAngle = (nextPosition * 72 - 90) * (Math.PI / 180)
                    const arcEndAngle = ((nextPosition + 1) * 72 - 90) * (Math.PI / 180)
                    const arcX1 = 50 + 50 * Math.cos(arcStartAngle)
                    const arcY1 = 50 + 50 * Math.sin(arcStartAngle)
                    const arcX2 = 50 + 50 * Math.cos(arcEndAngle)
                    const arcY2 = 50 + 50 * Math.sin(arcEndAngle)
                    return <path d={`M ${arcX1} ${arcY1} A 50 50 0 0 1 ${arcX2} ${arcY2}`} fill="none"
                      stroke={COLOR_PALETTE[nextColor]} strokeWidth="5" strokeLinecap="round" className="transition-all duration-500"
                      style={{ filter: `drop-shadow(0 0 6px ${COLOR_PALETTE[nextColor]})` }} />
                  })()}
                </svg>
              </div>
              <button onClick={() => rotateWheel(wheelIdx, 'forward')} disabled={!isRunning}
                className="px-3 py-1.5 bg-slate-700/80 hover:bg-cyan-400 border border-slate-600 hover:border-cyan-400 rounded-lg transition-all duration-200 disabled:opacity-30 text-white hover:text-slate-900 font-mono text-xs font-semibold">
                Next
              </button>
            </div>
          )
        })}
      </div>

      {/* Wheels Display - Mobile: odd wheels (1,3,5) on top row, even wheels (2,4) on bottom */}
      <div className="md:hidden space-y-4">
        <div className="flex justify-center gap-2">
          {[0, 2, 4].map((wheelIdx) => {
            const position = wheelPositions[wheelIdx]
            const isClockwise = wheelIdx % 2 === 0
            const sequence = WHEEL_SEQUENCES[wheelIdx]
            const nextPosition = isClockwise
              ? (position + 1) % sequence.length
              : (position - 1 + sequence.length) % sequence.length
            const nextColor = sequence[nextPosition]

            return (
              <div key={wheelIdx} className="flex flex-col items-center space-y-2">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {sequence.map((color, idx) => {
                      const startAngle = (idx * 72 - 90) * (Math.PI / 180)
                      const endAngle = ((idx + 1) * 72 - 90) * (Math.PI / 180)
                      const x1 = 50 + 45 * Math.cos(startAngle)
                      const y1 = 50 + 45 * Math.sin(startAngle)
                      const x2 = 50 + 45 * Math.cos(endAngle)
                      const y2 = 50 + 45 * Math.sin(endAngle)
                      return (
                        <path key={`${wheelIdx}-${color}-${idx}`} d={`M 50 50 L ${x1} ${y1} A 45 45 0 0 1 ${x2} ${y2} Z`}
                          fill={COLOR_PALETTE[color]} stroke="#1e293b" strokeWidth="1" className={`transition-all duration-500 ${showLockEffect ? 'opacity-100' : 'opacity-90'}`} />
                      )
                    })}
                    <circle cx="50" cy="50" r="18"
                      fill={showLockEffect && alignedWheels.has(wheelIdx) && alignedColor ? COLOR_PALETTE[alignedColor] : "#0f172a"}
                      stroke="#334155" strokeWidth="2" className="transition-all duration-300" />
                    {(() => {
                      const arcStartAngle = (nextPosition * 72 - 90) * (Math.PI / 180)
                      const arcEndAngle = ((nextPosition + 1) * 72 - 90) * (Math.PI / 180)
                      const arcX1 = 50 + 50 * Math.cos(arcStartAngle)
                      const arcY1 = 50 + 50 * Math.sin(arcStartAngle)
                      const arcX2 = 50 + 50 * Math.cos(arcEndAngle)
                      const arcY2 = 50 + 50 * Math.sin(arcEndAngle)
                      return <path d={`M ${arcX1} ${arcY1} A 50 50 0 0 1 ${arcX2} ${arcY2}`} fill="none"
                        stroke={COLOR_PALETTE[nextColor]} strokeWidth="4" strokeLinecap="round" className="transition-all duration-500"
                        style={{ filter: `drop-shadow(0 0 4px ${COLOR_PALETTE[nextColor]})` }} />
                    })()}
                  </svg>
                </div>
                <button onClick={() => rotateWheel(wheelIdx, 'forward')} disabled={!isRunning}
                  className="px-2 py-1 bg-slate-700/80 hover:bg-cyan-400 border border-slate-600 hover:border-cyan-400 rounded-lg transition-all duration-200 disabled:opacity-30 text-white hover:text-slate-900 font-mono text-xs font-semibold">
                  Next
                </button>
              </div>
            )
          })}
        </div>
        <div className="flex justify-center gap-2">
          {[1, 3].map((wheelIdx) => {
            const position = wheelPositions[wheelIdx]
            const isClockwise = wheelIdx % 2 === 0
            const sequence = WHEEL_SEQUENCES[wheelIdx]
            const nextPosition = isClockwise
              ? (position + 1) % sequence.length
              : (position - 1 + sequence.length) % sequence.length
            const nextColor = sequence[nextPosition]

            return (
              <div key={wheelIdx} className="flex flex-col items-center space-y-2">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {sequence.map((color, idx) => {
                      const startAngle = (idx * 72 - 90) * (Math.PI / 180)
                      const endAngle = ((idx + 1) * 72 - 90) * (Math.PI / 180)
                      const x1 = 50 + 45 * Math.cos(startAngle)
                      const y1 = 50 + 45 * Math.sin(startAngle)
                      const x2 = 50 + 45 * Math.cos(endAngle)
                      const y2 = 50 + 45 * Math.sin(endAngle)
                      return (
                        <path key={`${wheelIdx}-${color}-${idx}`} d={`M 50 50 L ${x1} ${y1} A 45 45 0 0 1 ${x2} ${y2} Z`}
                          fill={COLOR_PALETTE[color]} stroke="#1e293b" strokeWidth="1" className={`transition-all duration-500 ${showLockEffect ? 'opacity-100' : 'opacity-90'}`} />
                      )
                    })}
                    <circle cx="50" cy="50" r="18"
                      fill={showLockEffect && alignedWheels.has(wheelIdx) && alignedColor ? COLOR_PALETTE[alignedColor] : "#0f172a"}
                      stroke="#334155" strokeWidth="2" className="transition-all duration-300" />
                    {(() => {
                      const arcStartAngle = (nextPosition * 72 - 90) * (Math.PI / 180)
                      const arcEndAngle = ((nextPosition + 1) * 72 - 90) * (Math.PI / 180)
                      const arcX1 = 50 + 50 * Math.cos(arcStartAngle)
                      const arcY1 = 50 + 50 * Math.sin(arcStartAngle)
                      const arcX2 = 50 + 50 * Math.cos(arcEndAngle)
                      const arcY2 = 50 + 50 * Math.sin(arcEndAngle)
                      return <path d={`M ${arcX1} ${arcY1} A 50 50 0 0 1 ${arcX2} ${arcY2}`} fill="none"
                        stroke={COLOR_PALETTE[nextColor]} strokeWidth="4" strokeLinecap="round" className="transition-all duration-500"
                        style={{ filter: `drop-shadow(0 0 4px ${COLOR_PALETTE[nextColor]})` }} />
                    })()}
                  </svg>
                </div>
                <button onClick={() => rotateWheel(wheelIdx, 'forward')} disabled={!isRunning}
                  className="px-2 py-1 bg-slate-700/80 hover:bg-cyan-400 border border-slate-600 hover:border-cyan-400 rounded-lg transition-all duration-200 disabled:opacity-30 text-white hover:text-slate-900 font-mono text-xs font-semibold">
                  Next
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      {isRunning && (
        <div className="flex justify-center">
          <button
            onClick={stopGame}
            className="px-8 py-3 font-bold font-mono rounded-xl transition-all duration-300 hover:shadow-lg bg-red-500 hover:bg-red-400 text-white hover:shadow-red-400/50"
          >
            Stop Game
          </button>
        </div>
      )}

      {/* Game Rules - Only visible when game is not running */}
      {!isRunning && (
        <div className="mt-8 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold font-mono text-cyan-400 mb-4 text-center">How to Play</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 font-mono text-xs md:text-sm">
            <div className="text-center md:text-left">
              <div className="text-cyan-400 font-bold mb-1">Goal</div>
              <div>Reduce the counter to 0 by aligning the colored wheels before time runs out.</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-cyan-400 font-bold mb-1">Controls</div>
              <div>Click "Next" under each wheel to manually advance it, or let them auto-rotate.</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-cyan-400 font-bold mb-1">Scoring</div>
              <div>
                <div>• 3 wheels: <span className="text-green-400">-1s</span></div>
                <div>• 4 wheels: <span className="text-yellow-400">-10s</span></div>
                <div>• 5 wheels: <span className="text-red-400">-60s!</span></div>
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-cyan-400 font-bold mb-1">Strategy</div>
              <div>Odd wheels rotate clockwise, even wheels counter-clockwise. Timing is key!</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
