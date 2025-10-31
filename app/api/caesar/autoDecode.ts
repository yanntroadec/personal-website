// Automatic Caesar Cipher Decoding
// Weighted combination of all linguistic categories for optimal shift detection

import { analyzeAllLanguages } from './findStats';
import { decode } from './manualTransform';

// Category weights for final score calculation
const WEIGHTS: Record<string, number> = {
  singleLetters: 0.25,
  firstLetters: 0.15,
  lastLetters: 0.15,
  monograms: 0.2,
  digrams: 0.15,
  trigrams: 0.1,
};

// Combine all category scores with weights
function combineScores(categories: Record<string, Array<{ shift: number; score: number }>>) {
  const shiftScores: Record<number, number> = {};

  // Combine scores from all categories with weights
  Object.entries(categories).forEach(([category, results]) => {
    const weight = WEIGHTS[category] || 0;

    results.forEach(({ shift, score }) => {
      if (!shiftScores[shift]) {
        shiftScores[shift] = 0;
      }
      shiftScores[shift] += score * weight;
    });
  });

  // Sort by score descending
  return Object.entries(shiftScores)
    .sort((a, b) => b[1] - a[1])
    .map(([shift, score]) => ({
      shift: parseInt(shift),
      score: parseFloat(score.toFixed(4)),
    }));
}

// Automatically decode text for specified language
export function autoDecode(text: string, languageId: string = 'english') {
  const allResults = analyzeAllLanguages(text);
  const languageResult = allResults[languageId as keyof typeof allResults];

  if (!languageResult) {
    throw new Error(`Language '${languageId}' not supported`);
  }

  const rankedShifts = combineScores(languageResult.categories);

  if (rankedShifts.length === 0) {
    return {
      language: languageResult.language,
      success: false,
      message: 'No valid shifts found',
      original: text,
    };
  }

  const bestShift = rankedShifts[0].shift;
  const decoded = decode(text, bestShift);

  return {
    language: languageResult.language,
    success: true,
    original: text,
    decoded: decoded,
    shift: bestShift,
    confidence: rankedShifts[0].score,
    allShifts: rankedShifts,
    possibleShiftsCount: languageResult.possibleShiftsCount,
  };
}