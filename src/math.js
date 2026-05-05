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
