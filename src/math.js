// ─────────────────────────────────────────────────────────────
// Math — Numeric utility functions
// ─────────────────────────────────────────────────────────────

/**
 * Clamp a value between a minimum and maximum bound.
 * Replaces the pervasive `Math.min(Math.max(value, min), max)` pattern.
 *
 * @param {number} value - The value to clamp
 * @param {number} min - Lower bound
 * @param {number} max - Upper bound
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round to 2 decimal places using banker's rounding.
 * Standard for financial calculations — avoids floating-point drift.
 *
 * @param {number} n
 * @returns {number}
 */
export function roundCents(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Return a random integer between min and max (inclusive).
 *
 * @param {number} min - Lower bound (inclusive)
 * @param {number} max - Upper bound (inclusive)
 * @returns {number}
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Compute cosine similarity between two vectors.
 * Returns a value between -1 and 1, where 1 means identical direction.
 *
 * @param {number[]} a - First vector
 * @param {number[]} b - Second vector
 * @returns {number} Similarity score (-1 to 1), 0 on invalid input
 */
export function cosineSimilarity(a, b) {
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
