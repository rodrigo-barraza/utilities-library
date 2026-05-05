// ─────────────────────────────────────────────────────────────
// Objects — Plain-object manipulation utilities
// ─────────────────────────────────────────────────────────────

/**
 * Recursively merge `source` into `target`, returning a new object.
 * Only plain objects are merged recursively — arrays and other types
 * are replaced outright. Neither input is mutated.
 *
 * @param {object} target - Base object
 * @param {object} source - Object whose values override `target`
 * @returns {object}
 */
export function deepMerge(target, source) {
  const out = { ...target };
  for (const [key, val] of Object.entries(source)) {
    if (
      val !== null &&
      typeof val === "object" &&
      !Array.isArray(val) &&
      target[key] !== null &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      out[key] = deepMerge(target[key], val);
    } else {
      out[key] = val;
    }
  }
  return out;
}

/**
 * Create a new object with only the specified keys from `obj`.
 *
 * @param {object} obj - Source object
 * @param {string[]} keys - Keys to include
 * @returns {object}
 */
export function pick(obj, keys) {
  const out = {};
  for (const k of keys) {
    if (k in obj) out[k] = obj[k];
  }
  return out;
}

/**
 * Create a new object with all keys from `obj` except those listed.
 *
 * @param {object} obj - Source object
 * @param {string[]} keys - Keys to exclude
 * @returns {object}
 */
export function omit(obj, keys) {
  const exclude = new Set(keys);
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !exclude.has(k)),
  );
}
