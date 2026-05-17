/**
 * Batch an array into chunks of a given size.
 */
export declare function chunk<T>(array: T[], size: number): T[][];
/**
 * Shuffle an array using the Fisher–Yates algorithm.
 * Returns a new shuffled copy — does not mutate the original.
 */
export declare function shuffleArray<T>(array: T[]): T[];
/**
 * Pick a random element from an array.
 */
export declare function pickRandom<T>(array: T[]): T;
/**
 * Filter out null/undefined values from a payload object.
 * Keeps falsy values like 0, false, and empty strings.
 */
export declare function compactPayload(object: Record<string, unknown>): Record<string, unknown>;
/**
 * Group array elements by a key derived from each element.
 * Returns an object whose keys are group identifiers and values are arrays.
 */
export declare function groupBy<T>(array: T[], keyFn: string | ((item: T) => string)): Record<string, T[]>;
/**
 * Deduplicate an array by a key derived from each element.
 * Keeps the first occurrence of each unique key.
 */
export declare function uniqueBy<T>(array: T[], keyFn: string | ((item: T) => unknown)): T[];
/**
 * Split an array into two groups based on a predicate.
 * The first array contains items where `fn` returns true,
 * the second contains the rest.
 */
export declare function partition<T>(array: T[], fn: (item: T) => boolean): [T[], T[]];
/**
 * Return elements present in both arrays.
 * Uses strict equality. Preserves order from the first array.
 */
export declare function intersection<T>(a: T[], b: T[]): T[];
/**
 * Return elements in `a` that are not in `b`.
 * Uses strict equality. Preserves order from `a`.
 */
export declare function difference<T>(a: T[], b: T[]): T[];
/**
 * Sort an array of objects by a key or comparator function.
 * Returns a new sorted copy — does not mutate the original.
 */
export interface SortByOptions {
    descending?: boolean;
}
export declare function sortBy<T>(array: T[], keyOrFn: string | ((a: T, b: T) => number), { descending }?: SortByOptions): T[];
/**
 * Flatten a nested array to a given depth.
 * Wrapper around Array.flat() with a clearer API for shared usage.
 */
export declare function flatten<T>(array: T[], depth?: number): T[];
//# sourceMappingURL=arrays.d.ts.map