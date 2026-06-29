// ─────────────────────────────────────────────────────────────
// Arrays — Array and object manipulation utilities
// ─────────────────────────────────────────────────────────────
import { isRecord } from "./objects.js";
export function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const swapIndex = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i]];
    }
    return shuffled;
}
export function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}
export function compactPayload(object) {
    return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== null && value !== undefined));
}
export function groupBy(array, keySelector) {
    const groups = {};
    for (const item of array) {
        let key;
        if (typeof keySelector === "function") {
            key = keySelector(item);
        }
        else {
            if (isRecord(item)) {
                key = item[keySelector];
            }
            else {
                key = String(item);
            }
        }
        (groups[key] ??= []).push(item);
    }
    return groups;
}
export function uniqueBy(array, keySelector) {
    const seen = new Set();
    return array.filter((item) => {
        let key;
        if (typeof keySelector === "function") {
            key = keySelector(item);
        }
        else {
            if (isRecord(item)) {
                key = item[keySelector];
            }
            else {
                key = item;
            }
        }
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
}
export function partition(array, predicate) {
    const pass = [];
    const fail = [];
    for (const item of array) {
        (predicate(item) ? pass : fail).push(item);
    }
    return [pass, fail];
}
export function intersection(firstArray, secondArray) {
    const set = new Set(secondArray);
    return firstArray.filter((item) => set.has(item));
}
export function difference(firstArray, secondArray) {
    const set = new Set(secondArray);
    return firstArray.filter((item) => !set.has(item));
}
export function sortBy(array, keyOrComparator, { descending = false } = {}) {
    const copy = [...array];
    if (typeof keyOrComparator === "function") {
        copy.sort(keyOrComparator);
    }
    else {
        copy.sort((firstItem, secondItem) => {
            let valueA = 0;
            let valueB = 0;
            if (isRecord(firstItem)) {
                valueA = firstItem[keyOrComparator];
            }
            if (isRecord(secondItem)) {
                valueB = secondItem[keyOrComparator];
            }
            if (valueA < valueB)
                return -1;
            if (valueA > valueB)
                return 1;
            return 0;
        });
    }
    return descending ? copy.reverse() : copy;
}
// TypeScript cannot infer recursive Array.flat() depth generics —
// cast through unknown[] to satisfy the compiler.
export function flatten(array, depth = 1) {
    return array.flat(depth);
}
//# sourceMappingURL=arrays.js.map