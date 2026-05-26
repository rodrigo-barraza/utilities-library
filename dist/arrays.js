// ─────────────────────────────────────────────────────────────
// Arrays — Array and object manipulation utilities
// ─────────────────────────────────────────────────────────────
/**
 * Batch an array into chunks of a given size.
 */
export function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
/**
 * Shuffle an array using the Fisher–Yates algorithm.
 * Returns a new shuffled copy — does not mutate the original.
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const swapIndex = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i]];
    }
    return shuffled;
}
/**
 * Pick a random element from an array.
 */
export function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}
/**
 * Filter out null/undefined values from a payload object.
 * Keeps falsy values like 0, false, and empty strings.
 */
export function compactPayload(object) {
    return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== null && value !== undefined));
}
/**
 * Group array elements by a key derived from each element.
 * Returns an object whose keys are group identifiers and values are arrays.
 */
export function groupBy(array, keyFn) {
    const groups = {};
    for (const item of array) {
        const key = typeof keyFn === "function" ? keyFn(item) : item[keyFn];
        (groups[key] ??= []).push(item);
    }
    return groups;
}
/**
 * Deduplicate an array by a key derived from each element.
 * Keeps the first occurrence of each unique key.
 */
export function uniqueBy(array, keyFn) {
    const seen = new Set();
    return array.filter((item) => {
        const key = typeof keyFn === "function" ? keyFn(item) : item[keyFn];
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
}
/**
 * Split an array into two groups based on a predicate.
 * The first array contains items where `fn` returns true,
 * the second contains the rest.
 */
export function partition(array, fn) {
    const pass = [];
    const fail = [];
    for (const item of array) {
        (fn(item) ? pass : fail).push(item);
    }
    return [pass, fail];
}
/**
 * Return elements present in both arrays.
 * Uses strict equality. Preserves order from the first array.
 */
export function intersection(firstArray, secondArray) {
    const set = new Set(secondArray);
    return firstArray.filter((item) => set.has(item));
}
/**
 * Return elements in `a` that are not in `b`.
 * Uses strict equality. Preserves order from `a`.
 */
export function difference(firstArray, secondArray) {
    const set = new Set(secondArray);
    return firstArray.filter((item) => !set.has(item));
}
export function sortBy(array, keyOrFn, { descending = false } = {}) {
    const copy = [...array];
    if (typeof keyOrFn === "function") {
        copy.sort(keyOrFn);
    }
    else {
        copy.sort((firstItem, secondItem) => {
            const valueA = firstItem[keyOrFn];
            const valueB = secondItem[keyOrFn];
            if (valueA < valueB)
                return -1;
            if (valueA > valueB)
                return 1;
            return 0;
        });
    }
    return descending ? copy.reverse() : copy;
}
/**
 * Flatten a nested array to a given depth.
 * Wrapper around Array.flat() with a clearer API for shared usage.
 */
export function flatten(array, depth = 1) {
    return array.flat(depth);
}
//# sourceMappingURL=arrays.js.map