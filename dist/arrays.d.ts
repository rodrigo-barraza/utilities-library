/**
 * Batch an array into chunks of a given size.
 */
export declare function chunk<ArrayItem>(array: ArrayItem[], size: number): ArrayItem[][];
/**
 * Shuffle an array using the Fisher–Yates algorithm.
 * Returns a new shuffled copy — does not mutate the original.
 */
export declare function shuffleArray<ArrayItem>(array: ArrayItem[]): ArrayItem[];
/**
 * Pick a random element from an array.
 */
export declare function pickRandom<ArrayItem>(array: ArrayItem[]): ArrayItem;
/**
 * Filter out null/undefined values from a payload object.
 * Keeps falsy values like 0, false, and empty strings.
 */
export declare function compactPayload<Payload extends Record<string, unknown>>(object: Payload): Partial<Payload>;
/**
 * Group array elements by a key derived from each element.
 * Returns an object whose keys are group identifiers and values are arrays.
 */
export declare function groupBy<ArrayItem>(array: ArrayItem[], keySelector: string | ((item: ArrayItem) => string)): Record<string, ArrayItem[]>;
/**
 * Deduplicate an array by a key derived from each element.
 * Keeps the first occurrence of each unique key.
 */
export declare function uniqueBy<ArrayItem>(array: ArrayItem[], keySelector: string | ((item: ArrayItem) => unknown)): ArrayItem[];
/**
 * Split an array into two groups based on a predicate.
 * The first array contains items where the predicate returns true,
 * the second contains the rest.
 */
export declare function partition<ArrayItem>(array: ArrayItem[], predicate: (item: ArrayItem) => boolean): [ArrayItem[], ArrayItem[]];
/**
 * Return elements present in both arrays.
 * Uses strict equality. Preserves order from the first array.
 */
export declare function intersection<ArrayItem>(firstArray: ArrayItem[], secondArray: ArrayItem[]): ArrayItem[];
/**
 * Return elements in `a` that are not in `b`.
 * Uses strict equality. Preserves order from `a`.
 */
export declare function difference<ArrayItem>(firstArray: ArrayItem[], secondArray: ArrayItem[]): ArrayItem[];
/**
 * Sort an array of objects by a key or comparator function.
 * Returns a new sorted copy — does not mutate the original.
 */
export interface SortByOptions {
    descending?: boolean;
}
export declare function sortBy<ArrayItem>(array: ArrayItem[], keyOrComparator: string | ((firstItem: ArrayItem, secondItem: ArrayItem) => number), { descending }?: SortByOptions): ArrayItem[];
/**
 * Flatten a nested array to a given depth.
 * Wrapper around Array.flat() with a clearer API for shared usage.
 */
export declare function flatten<ArrayItem>(array: ArrayItem[], depth?: number): ArrayItem[];
//# sourceMappingURL=arrays.d.ts.map