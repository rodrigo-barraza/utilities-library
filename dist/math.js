// ─────────────────────────────────────────────────────────────
// Math — Numeric utility functions
// ─────────────────────────────────────────────────────────────
/**
 * Clamp a value between a minimum and maximum bound.
 * Replaces the pervasive `Math.min(Math.max(value, min), max)` pattern.
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
/**
 * Round to 2 decimal places using banker's rounding.
 * Standard for financial calculations — avoids floating-point drift.
 */
export function roundCents(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}
/**
 * Return a random integer between min and max (inclusive).
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * Compute cosine similarity between two vectors.
 * Returns a value between -1 and 1, where 1 means identical direction.
 */
export function cosineSimilarity(vectorA, vectorB) {
    if (!vectorA || !vectorB || vectorA.length !== vectorB.length)
        return 0;
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
/**
 * Linearly interpolate between two numbers.
 * Standard lerp function — returns `a` when `t=0`, `b` when `t=1`.
 */
export function lerp(startValue, endValue, interpolationFactor) {
    return startValue + (endValue - startValue) * interpolationFactor;
}
/**
 * Remap a value from one range to another (linear mapping).
 * e.g. remap(50, 0, 100, 0, 1) → 0.5
 */
export function remap(value, inputMinimum, inputMaximum, outputMinimum, outputMaximum) {
    return ((value - inputMinimum) / (inputMaximum - inputMinimum)) * (outputMaximum - outputMinimum) + outputMinimum;
}
/**
 * Sum all numbers in an array.
 */
export function sum(array) {
    if (!array || array.length === 0)
        return 0;
    return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}
/**
 * Compute the arithmetic mean of a numeric array.
 */
export function average(array) {
    if (!array || array.length === 0)
        return 0;
    return sum(array) / array.length;
}
/**
 * Compute the median of a numeric array.
 * Returns the middle value for odd-length arrays, or the average
 * of the two middle values for even-length arrays.
 */
export function median(array) {
    if (!array || array.length === 0)
        return 0;
    const sorted = [...array].sort((firstValue, secondValue) => firstValue - secondValue);
    const middleIndex = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[middleIndex]
        : (sorted[middleIndex - 1] + sorted[middleIndex]) / 2;
}
/**
 * Round a number to a specific number of decimal places.
 * More precise than `Number.toFixed()` for arithmetic (returns a number, not a string).
 */
export function roundTo(value, decimals = 2) {
    const factor = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * factor) / factor;
}
//# sourceMappingURL=math.js.map