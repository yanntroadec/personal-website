import { NextRequest, NextResponse } from 'next/server'
import { autoDecode } from './autoDecode'
import { encode, decode, rot13, bruteForce } from './manualTransform'

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
    const body: RequestBody = await request.json()
    const { text, mode, shift, language = 'english' } = body

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    let result

    switch (mode) {
      case 'encode':
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
        const rot13Result = rot13(text)
        result = {
          output: rot13Result.encoded,
          shift: 13
        }
        break

      case 'brute':
        const allResults = bruteForce(text)
        result = {
          output: allResults[0].text,
          allShifts: allResults
        }
        break

      case 'auto':
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
        return NextResponse.json(
          { error: 'Invalid mode' },
          { status: 400 }
        )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Caesar API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}