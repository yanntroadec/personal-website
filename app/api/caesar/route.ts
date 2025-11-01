import { NextRequest, NextResponse } from 'next/server'
import { autoDecode } from './autoDecode'
import { encode, decode, rot13, bruteForce } from './manualTransform'

// Type definitions for API request
type Mode = 'auto' | 'encode' | 'decode' | 'rot13' | 'brute'
type Language = 'english' | 'french' | 'spanish' | 'german'

interface RequestBody {
  text: string
  mode: Mode
  shift?: number
  language?: Language
}

export async function POST(request: NextRequest) {
  try {
    // Parse and destructure request body
    const body: RequestBody = await request.json()
    const { text, mode, shift, language = 'english' } = body

    // Validate input text
    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    let result

    // Process based on selected mode
    switch (mode) {
      case 'encode':
        // Encode text with a known shift value
        if (shift === undefined) {
          return NextResponse.json(
            { error: 'Shift is required for encode mode' },
            { status: 400 }
          )
        }
        result = {
          output: encode(text, shift),
          shift
        }
        break

      case 'decode':
        // Decode text with a known shift value
        if (shift === undefined) {
          return NextResponse.json(
            { error: 'Shift is required for decode mode' },
            { status: 400 }
          )
        }
        result = {
          output: decode(text, shift),
          shift
        }
        break

      case 'rot13':
        // Apply ROT13 cipher (fixed shift of 13)
        const rot13Result = rot13(text)
        result = {
          output: rot13Result.encoded,
          shift: 13
        }
        break

      case 'brute':
        // Try all possible shifts (1-25) and return all results
        const allResults = bruteForce(text)
        result = {
          output: allResults[0].text,
          allShifts: allResults
        }
        break

      case 'auto':
        // Automatically detect the correct shift using frequency analysis
        const autoResult = autoDecode(text, language)
        if (!autoResult.success) {
          return NextResponse.json(
            { error: autoResult.message || 'Auto decode failed' },
            { status: 400 }
          )
        }
        result = {
          output: autoResult.decoded,
          shift: autoResult.shift,
          confidence: autoResult.confidence,
          allShifts: autoResult.allShifts
        }
        break

      default:
        // Invalid mode provided
        return NextResponse.json(
          { error: 'Invalid mode' },
          { status: 400 }
        )
    }

    // Return successful result
    return NextResponse.json(result)
  } catch (error) {
    // Log error and return generic error response
    console.error('Caesar API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}