// ─────────────────────────────────────────────────────────────
// Objects — Plain-object manipulation utilities
// ─────────────────────────────────────────────────────────────

/**
 * Recursively merge `source` into `target`, returning a new object.
 * Only plain objects are merged recursively — arrays and other types
 * are replaced outright. Neither input is mutated.
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Record<string, unknown>): T {
  const out = { ...target } as Record<string, unknown>;
  for (const [key, val] of Object.entries(source)) {
    if (
      val !== null &&
      typeof val === "object" &&
      !Array.isArray(val) &&
      target[key] !== null &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      out[key] = deepMerge(target[key] as Record<string, unknown>, val as Record<string, unknown>);
    } else {
      out[key] = val;
    }
  }
  return out as T;
}

/**
 * Create a new object with only the specified keys from `obj`.
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const k of keys) {
    if (k in obj) (out as Record<string, unknown>)[k as string] = obj[k];
  }
  return out;
}

/**
 * Create a new object with all keys from `obj` except those listed.
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const exclude = new Set<string>(keys as string[]);
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !exclude.has(k)),
  ) as Omit<T, K>;
}

/**
 * Create a new object with the same keys but values transformed by `fn`.
 */
export function mapValues<T extends Record<string, unknown>, R>(obj: T, fn: (value: unknown, key: string) => R): Record<string, R> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, fn(v, k)]),
  );
}

/**
 * Create a new object with keys transformed by `fn`, values unchanged.
 */
export function mapKeys(obj: Record<string, unknown>, fn: (key: string, value: unknown) => string): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [fn(k, v), v]),
  );
}

/**
 * Swap keys and values in an object.
 * e.g. { a: "1", b: "2" } → { "1": "a", "2": "b" }
 */
export function invert(obj: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [v, k]),
  );
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
export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * Deep structural equality check for JSON-serializable values.
 * Compares primitives, plain objects, and arrays recursively.
 * Does not handle circular references, Dates, RegExps, etc.
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    return a.every((val, i) => deepEqual(val, b[i]));
  }
  if (typeof a === "object") {
    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((k) => deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
  }
  return false;
}
