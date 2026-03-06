// Encoder Interface
// High-level interface for encoding text with Caesar cipher

import { shiftChar } from './shiftChar';

// Encode text using Caesar cipher with given shift
export function encode(text: string, shift: number): string {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  if (typeof shift !== 'number') {
    throw new TypeError('Shift must be a number');
  }

  // Normalize shift to 0-25 range (handle negative shifts)
  const normalizedShift = ((shift % 26) + 26) % 26;

  // Apply shift to each character
  return text
    .split('')
    .map(char => shiftChar(char, normalizedShift))
    .join('');
}

// Decode text using Caesar cipher with given shift
// Decoding is just encoding with negative shift
export function decode(text: string, shift: number): string {
  return encode(text, -shift);
}

// ROT13 - Special case of Caesar cipher with shift of 13
export function rot13(text: string) {
  const encoded = encode(text, 13);
  
  return {
    original: text,
    encoded: encoded
  };
}

// Try all possible shifts (brute force)
export function bruteForce(text: string) {
  const results: Array<{ shift: number; text: string }> = [];

  for (let shift = 0; shift < 26; shift++) {
    results.push({
      shift,
      text: decode(text, shift),
    });
  }

  return results;
}