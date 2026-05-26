// ─────────────────────────────────────────────────────────────
// Objects — Plain-object manipulation utilities
// ─────────────────────────────────────────────────────────────
/**
 * Recursively merge `source` into `target`, returning a new object.
 * Only plain objects are merged recursively — arrays and other types
 * are replaced outright. Neither input is mutated.
 */
export function deepMerge(target, source) {
    const out = { ...target };
    for (const [key, value] of Object.entries(source)) {
        if (value !== null &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            target[key] !== null &&
            typeof target[key] === "object" &&
            !Array.isArray(target[key])) {
            out[key] = deepMerge(target[key], value);
        }
        else {
            out[key] = value;
        }
    }
    return out;
}
/**
 * Create a new object with only the specified keys from `obj`.
 */
export function pick(object, keys) {
    const out = {};
    for (const key of keys) {
        if (key in object)
            out[key] = object[key];
    }
    return out;
}
/**
 * Create a new object with all keys from `obj` except those listed.
 */
export function omit(object, keys) {
    const exclude = new Set(keys);
    return Object.fromEntries(Object.entries(object).filter(([key]) => !exclude.has(key)));
}
/**
 * Create a new object with the same keys but values transformed by `fn`.
 */
export function mapValues(object, fn) {
    return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, fn(value, key)]));
}
/**
 * Create a new object with keys transformed by `fn`, values unchanged.
 */
export function mapKeys(object, fn) {
    return Object.fromEntries(Object.entries(object).map(([key, value]) => [fn(key, value), value]));
}
/**
 * Swap keys and values in an object.
 * e.g. { a: "1", b: "2" } → { "1": "a", "2": "b" }
 */
export function invert(object) {
    return Object.fromEntries(Object.entries(object).map(([key, value]) => [value, key]));
}
/**
 * Check if a value is "empty":
 * - `null` or `undefined` → true
 * - Empty string `""` → true
 * - Empty array `[]` → true
 * - Plain object with no own keys `{}` → true
 * - Map/Set with size 0 → true
 * - Everything else → false
 */
export function isEmpty(value) {
    if (value == null)
        return true;
    if (typeof value === "string")
        return value.length === 0;
    if (Array.isArray(value))
        return value.length === 0;
    if (value instanceof Map || value instanceof Set)
        return value.size === 0;
    if (typeof value === "object")
        return Object.keys(value).length === 0;
    return false;
}
/**
 * Deep structural equality check for JSON-serializable values.
 * Compares primitives, plain objects, and arrays recursively.
 * Does not handle circular references, Dates, RegExps, etc.
 */
export function deepEqual(valueA, valueB) {
    if (valueA === valueB)
        return true;
    if (valueA == null || valueB == null)
        return false;
    if (typeof valueA !== typeof valueB)
        return false;
    if (Array.isArray(valueA)) {
        if (!Array.isArray(valueB) || valueA.length !== valueB.length)
            return false;
        return valueA.every((item, itemIndex) => deepEqual(item, valueB[itemIndex]));
    }
    if (typeof valueA === "object") {
        const keysA = Object.keys(valueA);
        const keysB = Object.keys(valueB);
        if (keysA.length !== keysB.length)
            return false;
        return keysA.every((key) => deepEqual(valueA[key], valueB[key]));
    }
    return false;
}
//# sourceMappingURL=objects.js.map