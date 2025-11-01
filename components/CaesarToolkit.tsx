'use client'

import { useState } from "react"

// Type definitions for operation modes
type Mode = 'auto' | 'encode' | 'decode' | 'rot13' | 'brute'
type Language = 'english' | 'french' | 'spanish' | 'german'

// Result structure returned from API
interface Result {
  output: string
  shift?: number
  confidence?: number
  allShifts?: Array<{ shift: number; text: string; score?: number }>
}

/**
 * CaesarToolkit Component
 * 
 * A comprehensive Caesar cipher encryption/decryption toolkit with multiple operation modes:
 * - Auto Decode: Automatically detects the correct shift using statistical analysis
 * - Encode: Encrypts plaintext with a specified shift value
 * - Decode: Decrypts ciphertext with a known shift value
 * - ROT13: Applies the classic ROT13 cipher (fixed shift of 13)
 * - Brute Force: Displays all 25 possible shift combinations
 * 
 * Supports multiple languages (English, French, Spanish, German) for accurate 
 * frequency analysis in Auto Decode mode.
 */
export default function CaesarToolkit() {
  // State management
  const [input, setInput] = useState("")
  const [shift, setShift] = useState(3)
  const [mode, setMode] = useState<Mode>('auto')
  const [language, setLanguage] = useState<Language>('english')
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  // Available operation modes with descriptions
  const modes = [
    { value: 'auto', label: 'Auto Decode', desc: 'Statistical analysis' },
    { value: 'encode', label: 'Encode', desc: 'Encrypt text' },
    { value: 'decode', label: 'Decode', desc: 'Known shift' },
    { value: 'rot13', label: 'ROT13', desc: 'Fixed shift 13' },
    { value: 'brute', label: 'Brute Force', desc: 'Try all shifts' }
  ] as const

  // Supported languages for statistical analysis
  const languages = [
    { value: 'english', label: 'English', flag: '🇬🇧' },
    { value: 'french', label: 'Français', flag: '🇫🇷' },
    { value: 'spanish', label: 'Español', flag: '🇪🇸' },
    { value: 'german', label: 'Deutsch', flag: '🇩🇪' }
  ] as const

  // Get button label based on current mode
  const getButtonLabel = () => {
    const labels = {
      'auto': 'Auto Decode',
      'encode': 'Encode',
      'decode': 'Decode',
      'rot13': 'ROT13',
      'brute': 'Brute Force'
    }
    return loading ? 'Processing...' : labels[mode]
  }

  // Handle text processing based on selected mode
  async function handleProcess() {
    if (!input.trim()) {
      setError("Please enter some text")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)
    setCopied(false)

    try {
      const response = await fetch('/api/caesar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: input,
          mode,
          shift: mode === 'encode' || mode === 'decode' ? shift : undefined,
          language: mode === 'auto' ? language : undefined
        })
      })

      if (!response.ok) {
        throw new Error('Processing failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Clear all inputs and results
  function handleClear() {
    setInput("")
    setResult(null)
    setError("")
    setCopied(false)
  }

  // Copy result to clipboard
  async function handleCopy() {
    if (!result?.output) return

    try {
      await navigator.clipboard.writeText(result.output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Determine which controls to show based on mode
  const needsShift = mode === 'encode' || mode === 'decode'
  const needsLanguage = mode === 'auto'
  const showMainResult = mode !== 'brute' // Don't show main result for brute force

  return (
    <div className="flex flex-col gap-6">
      {/* Mode Selection */}
      <div>
        <label className="block text-sm font-mono text-slate-400 mb-3">
          Mode
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value as Mode)}
              className={`
                p-3 rounded-lg border-2 transition-all duration-200 text-left
                ${mode === m.value
                  ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                  : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                }
              `}
            >
              <div className="font-mono font-bold text-sm">{m.label}</div>
              <div className="text-xs opacity-70">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Language Selection (only for auto mode) */}
      {needsLanguage && (
        <div>
          <label className="block text-sm font-mono text-slate-400 mb-3">
            Language
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.value}
                onClick={() => setLanguage(lang.value as Language)}
                className={`
                  p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2
                  ${language === lang.value
                    ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                    : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                  }
                `}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="font-mono text-sm">{lang.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Shift Input (only for encode/decode) */}
      {needsShift && (
        <div>
          <label className="block text-sm font-mono text-slate-400 mb-3">
            Shift Value (1-25)
          </label>
          <input
            type="number"
            min="1"
            max="25"
            value={shift}
            onChange={(e) => setShift(Math.min(25, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-full p-3 border-2 border-slate-700 rounded-lg bg-slate-900/50 text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
      )}

      {/* Text Input */}
      <div>
        <label className="block text-sm font-mono text-slate-400 mb-3">
          {mode === 'encode' ? 'Text to encode' : 'Text to decode'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter plain text...' : 'Paste your Caesar cipher here...'}
          rows={4}
          className="w-full p-3 border-2 border-slate-700 rounded-lg bg-slate-900/50 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400 transition-colors resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleProcess}
          disabled={loading}
          className="flex-1 bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-500 transition-colors font-mono font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {getButtonLabel()}
        </button>
        
        <button
          onClick={handleClear}
          className="px-6 py-3 rounded-lg border-2 border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600 hover:text-slate-300 transition-colors font-mono font-bold"
        >
          Clear
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-500/10 border-2 border-red-500/50 rounded-lg">
          <p className="text-red-400 font-mono text-sm">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-4">
          {/* Main Result (hidden for brute force) */}
          {showMainResult && (
            <div className="p-4 bg-slate-900/50 rounded-lg border-2 border-slate-700">
              {/* Header with metadata and copy button - flex-wrap allows button to wrap on mobile */}
              <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-cyan-400 font-bold font-mono text-sm">
                    {mode === 'encode' ? 'ENCODED' : 'DECODED'}:
                  </span>
                  {result.shift !== undefined && (
                    <span className="text-slate-500 font-mono text-xs whitespace-nowrap">
                      (shift: {result.shift})
                    </span>
                  )}
                  {result.confidence !== undefined && (
                    <span className="text-slate-500 font-mono text-xs whitespace-nowrap">
                      (confidence: {result.confidence.toFixed(4)})
                    </span>
                  )}
                </div>
                
                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400 hover:text-cyan-400 hover:border-cyan-400 transition-colors font-mono text-xs shrink-0"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              {/* Result text */}
              <p className="text-white font-mono text-lg break-words leading-relaxed">
                {result.output}
              </p>
            </div>
          )}

          {/* Brute Force Results - Show all possible shifts */}
          {mode === 'brute' && result.allShifts && (
            <div className="p-4 bg-slate-900/50 rounded-lg border-2 border-slate-700 max-h-96 overflow-y-auto">
              <div className="text-cyan-400 font-bold font-mono text-sm mb-4">
                ALL POSSIBLE SHIFTS:
              </div>
              <div className="space-y-3">
                {result.allShifts.map((item) => (
                  <div key={item.shift} className="border-b border-slate-700/50 pb-3 last:border-b-0">
                    <div className="text-slate-500 font-mono text-xs mb-1">
                      Shift {item.shift.toString().padStart(2, '0')}
                      {item.score !== undefined && ` - Score: ${item.score.toFixed(4)}`}
                    </div>
                    <div className="text-slate-300 font-mono text-sm break-words">
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Auto Decode - Top 5 Candidates */}
          {mode === 'auto' && result.allShifts && result.allShifts.length > 1 && (
            <div className="p-4 bg-slate-900/50 rounded-lg border-2 border-slate-700">
              <div className="text-cyan-400 font-bold font-mono text-sm mb-4">
                TOP CANDIDATES:
              </div>
              <div className="space-y-2">
                {result.allShifts.slice(0, 5).map((item, index) => (
                  <div key={item.shift} className="flex items-start gap-3 text-sm">
                    <span className="text-slate-500 font-mono text-xs min-w-[20px]">
                      #{index + 1}
                    </span>
                    <span className="text-slate-500 font-mono text-xs min-w-[60px]">
                      Shift {item.shift}
                    </span>
                    {item.score !== undefined && (
                      <span className="text-slate-500 font-mono text-xs min-w-[80px]">
                        {item.score.toFixed(4)}
                      </span>
                    )}
                    <span className="text-slate-400 font-mono text-xs flex-1 truncate">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}