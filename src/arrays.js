// ─────────────────────────────────────────────────────────────
// Arrays — Array and object manipulation utilities
// ─────────────────────────────────────────────────────────────

/**
 * Batch an array into chunks of a given size.
 * @param {Array} array
 * @param {number} size
 * @returns {Array[]}
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
 *
 * @param {Array} arr
 * @returns {Array}
 */
export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick a random element from an array.
 * @param {Array} array
 * @returns {*}
 */
export function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Filter out null/undefined values from a payload object.
 * Keeps falsy values like 0, false, and empty strings.
 *
 * @param {object} obj
 * @returns {object}
 */
export function compactPayload(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) => value !== null && value !== undefined,
    ),
  );
}

/**
 * Group array elements by a key derived from each element.
 * Returns an object whose keys are group identifiers and values are arrays.
 *
 * @param {Array} array
 * @param {string|((item: *) => string)} keyFn - Property name or function returning the group key
 * @returns {Object<string, Array>}
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
 *
 * @param {Array} array
 * @param {string|((item: *) => *)} keyFn - Property name or function returning the unique key
 * @returns {Array}
 */
export function uniqueBy(array, keyFn) {
  const seen = new Set();
  return array.filter((item) => {
    const key = typeof keyFn === "function" ? keyFn(item) : item[keyFn];
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Split an array into two groups based on a predicate.
 * The first array contains items where `fn` returns true,
 * the second contains the rest.
 *
 * @param {Array} array
 * @param {(item: *) => boolean} fn - Predicate function
 * @returns {[Array, Array]} [passing, failing]
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
 *
 * @param {Array} a
 * @param {Array} b
 * @returns {Array}
 */
export function intersection(a, b) {
  const set = new Set(b);
  return a.filter((item) => set.has(item));
}

/**
 * Return elements in `a` that are not in `b`.
 * Uses strict equality. Preserves order from `a`.
 *
 * @param {Array} a
 * @param {Array} b
 * @returns {Array}
 */
export function difference(a, b) {
  const set = new Set(b);
  return a.filter((item) => !set.has(item));
}

/**
 * Sort an array of objects by a key or comparator function.
 * Returns a new sorted copy — does not mutate the original.
 *
 * @param {Array} array
 * @param {string|((a: *, b: *) => number)} keyOrFn - Property name (ascending) or comparator
 * @param {{ descending?: boolean }} [options]
 * @returns {Array}
 */
export function sortBy(array, keyOrFn, { descending = false } = {}) {
  const copy = [...array];
  if (typeof keyOrFn === "function") {
    copy.sort(keyOrFn);
  } else {
    copy.sort((a, b) => {
      const va = a[keyOrFn];
      const vb = b[keyOrFn];
      if (va < vb) return -1;
      if (va > vb) return 1;
      return 0;
    });
  }
  return descending ? copy.reverse() : copy;
}

/**
 * Flatten a nested array to a given depth.
 * Wrapper around Array.flat() with a clearer API for shared usage.
 *
 * @param {Array} array - Possibly nested array
 * @param {number} [depth=1] - Maximum flatten depth (Infinity for full flatten)
 * @returns {Array}
 */
export function flatten(array, depth = 1) {
  return array.flat(depth);
}

