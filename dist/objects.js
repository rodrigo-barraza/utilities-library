// ─────────────────────────────────────────────────────────────
// Objects — Plain-object manipulation utilities
// ─────────────────────────────────────────────────────────────
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
export function deepMerge(target, source) {
    const result = { ...target };
    for (const [key, value] of Object.entries(source)) {
        const targetValue = target[key];
        if (isRecord(value) &&
            !Array.isArray(value) &&
            isRecord(targetValue) &&
            !Array.isArray(targetValue)) {
            result[key] = deepMerge(targetValue, value);
        }
        else {
            result[key] = value;
        }
    }
    return result;
}
export function pick(object, keys) {
    const result = {};
    for (const key of keys) {
        if (key in object) {
            result[key] = object[key];
        }
    }
    return result;
}
export function omit(object, keys) {
    const exclude = new Set(keys.map((key) => String(key)));
    return Object.fromEntries(Object.entries(object).filter(([key]) => !exclude.has(key)));
}
export function mapValues(object, callback) {
    return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, callback(value, key)]));
}
export function mapKeys(object, callback) {
    return Object.fromEntries(Object.entries(object).map(([key, value]) => [callback(key, value), value]));
}
export function invert(object) {
    return Object.fromEntries(Object.entries(object).map(([key, value]) => [value, key]));
}
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
// Does not handle circular references, Dates, RegExps, or class instances.
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
    if (isRecord(valueA) && isRecord(valueB)) {
        const keysA = Object.keys(valueA);
        const keysB = Object.keys(valueB);
        if (keysA.length !== keysB.length)
            return false;
        return keysA.every((key) => deepEqual(valueA[key], valueB[key]));
    }
    return false;
}
//# sourceMappingURL=objects.js.map