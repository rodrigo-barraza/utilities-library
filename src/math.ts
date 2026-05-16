// ─────────────────────────────────────────────────────────────
// Math — Numeric utility functions
// ─────────────────────────────────────────────────────────────

/**
 * Clamp a value between a minimum and maximum bound.
 * Replaces the pervasive `Math.min(Math.max(value, min), max)` pattern.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round to 2 decimal places using banker's rounding.
 * Standard for financial calculations — avoids floating-point drift.
 */
export function roundCents(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Return a random integer between min and max (inclusive).
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Compute cosine similarity between two vectors.
 * Returns a value between -1 and 1, where 1 means identical direction.
 */
export function cosineSimilarity(a: number[] | null, b: number[] | null): number {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0,
    magA = 0,
    magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Linearly interpolate between two numbers.
 * Standard lerp function — returns `a` when `t=0`, `b` when `t=1`.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Remap a value from one range to another (linear mapping).
 * e.g. remap(50, 0, 100, 0, 1) → 0.5
 */
export function remap(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/**
 * Sum all numbers in an array.
 */
export function sum(arr: number[] | null): number {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((acc, n) => acc + n, 0);
}

/**
 * Compute the arithmetic mean of a numeric array.
 */
export function average(arr: number[] | null): number {
  if (!arr || arr.length === 0) return 0;
  return sum(arr) / arr.length;
}

/**
 * Compute the median of a numeric array.
 * Returns the middle value for odd-length arrays, or the average
 * of the two middle values for even-length arrays.
 */
export function median(arr: number[] | null): number {
  if (!arr || arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Round a number to a specific number of decimal places.
 * More precise than `Number.toFixed()` for arithmetic (returns a number, not a string).
 */
export function roundTo(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
