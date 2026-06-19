// ─────────────────────────────────────────────────────────────
// Math — Numeric utility functions
// ─────────────────────────────────────────────────────────────

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Uses banker's rounding to avoid floating-point drift in financial calculations.
export function roundCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function cosineSimilarity(vectorA: number[] | null, vectorB: number[] | null): number {
  if (!vectorA || !vectorB || vectorA.length !== vectorB.length) return 0;
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }
  const denominator = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

export function lerp(startValue: number, endValue: number, interpolationFactor: number): number {
  return startValue + (endValue - startValue) * interpolationFactor;
}

export function remap(
  value: number,
  inputMinimum: number,
  inputMaximum: number,
  outputMinimum: number,
  outputMaximum: number,
): number {
  return ((value - inputMinimum) / (inputMaximum - inputMinimum)) * (outputMaximum - outputMinimum) + outputMinimum;
}

export function sum(array: number[] | null): number {
  if (!array || array.length === 0) return 0;
  return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

export function average(array: number[] | null): number {
  if (!array || array.length === 0) return 0;
  return sum(array) / array.length;
}

export function median(array: number[] | null): number {
  if (!array || array.length === 0) return 0;
  const sorted = [...array].sort((firstValue, secondValue) => firstValue - secondValue);
  const middleIndex = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[middleIndex]
    : (sorted[middleIndex - 1] + sorted[middleIndex]) / 2;
}

// Returns a number (not a string like Number.toFixed()) for arithmetic precision.
export function roundTo(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
