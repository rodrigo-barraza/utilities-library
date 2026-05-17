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
    for (const k of keys) {
        if (k in object)
            out[k] = object[k];
    }
    return out;
}
/**
 * Create a new object with all keys from `obj` except those listed.
 */
export function omit(object, keys) {
    const exclude = new Set(keys);
    return Object.fromEntries(Object.entries(object).filter(([k]) => !exclude.has(k)));
}
/**
 * Create a new object with the same keys but values transformed by `fn`.
 */
export function mapValues(object, fn) {
    return Object.fromEntries(Object.entries(object).map(([k, v]) => [k, fn(v, k)]));
}
/**
 * Create a new object with keys transformed by `fn`, values unchanged.
 */
export function mapKeys(object, fn) {
    return Object.fromEntries(Object.entries(object).map(([k, v]) => [fn(k, v), v]));
}
/**
 * Swap keys and values in an object.
 * e.g. { a: "1", b: "2" } → { "1": "a", "2": "b" }
 */
export function invert(object) {
    return Object.fromEntries(Object.entries(object).map(([k, v]) => [v, k]));
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
export function deepEqual(a, b) {
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    if (typeof a !== typeof b)
        return false;
    if (Array.isArray(a)) {
        if (!Array.isArray(b) || a.length !== b.length)
            return false;
        return a.every((value, i) => deepEqual(value, b[i]));
    }
    if (typeof a === "object") {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length)
            return false;
        return keysA.every((k) => deepEqual(a[k], b[k]));
    }
    return false;
}
//# sourceMappingURL=objects.js.map