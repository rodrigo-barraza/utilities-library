/**
 * Clamp a value between a minimum and maximum bound.
 * Replaces the pervasive `Math.min(Math.max(value, min), max)` pattern.
 */
export declare function clamp(value: number, min: number, max: number): number;
/**
 * Round to 2 decimal places using banker's rounding.
 * Standard for financial calculations — avoids floating-point drift.
 */
export declare function roundCents(n: number): number;
/**
 * Return a random integer between min and max (inclusive).
 */
export declare function randomInt(min: number, max: number): number;
/**
 * Compute cosine similarity between two vectors.
 * Returns a value between -1 and 1, where 1 means identical direction.
 */
export declare function cosineSimilarity(a: number[] | null, b: number[] | null): number;
/**
 * Linearly interpolate between two numbers.
 * Standard lerp function — returns `a` when `t=0`, `b` when `t=1`.
 */
export declare function lerp(a: number, b: number, t: number): number;
/**
 * Remap a value from one range to another (linear mapping).
 * e.g. remap(50, 0, 100, 0, 1) → 0.5
 */
export declare function remap(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number;
/**
 * Sum all numbers in an array.
 */
export declare function sum(array: number[] | null): number;
/**
 * Compute the arithmetic mean of a numeric array.
 */
export declare function average(array: number[] | null): number;
/**
 * Compute the median of a numeric array.
 * Returns the middle value for odd-length arrays, or the average
 * of the two middle values for even-length arrays.
 */
export declare function median(array: number[] | null): number;
/**
 * Round a number to a specific number of decimal places.
 * More precise than `Number.toFixed()` for arithmetic (returns a number, not a string).
 */
export declare function roundTo(value: number, decimals?: number): number;
//# sourceMappingURL=math.d.ts.map