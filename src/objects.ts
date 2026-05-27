// ─────────────────────────────────────────────────────────────
// Objects — Plain-object manipulation utilities
// ─────────────────────────────────────────────────────────────

/**
 * Recursively merge `source` into `target`, returning a new object.
 * Only plain objects are merged recursively — arrays and other types
 * are replaced outright. Neither input is mutated.
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Record<string, unknown>): T {
  const result = { ...target } as Record<string, unknown>;
  for (const [key, value] of Object.entries(source)) {
    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      target[key] !== null &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key] as Record<string, unknown>, value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

/**
 * Create a new object with only the specified keys from `obj`.
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(object: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in object) (result as Record<string, unknown>)[key as string] = object[key];
  }
  return result;
}

/**
 * Create a new object with all keys from `obj` except those listed.
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(object: T, keys: K[]): Omit<T, K> {
  const exclude = new Set<string>(keys as string[]);
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !exclude.has(key)),
  ) as Omit<T, K>;
}

/**
 * Create a new object with the same keys but values transformed by `fn`.
 */
export function mapValues<T extends Record<string, unknown>, R>(object: T, fn: (value: unknown, key: string) => R): Record<string, R> {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, fn(value, key)]),
  );
}

/**
 * Create a new object with keys transformed by `fn`, values unchanged.
 */
export function mapKeys(object: Record<string, unknown>, fn: (key: string, value: unknown) => string): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [fn(key, value), value]),
  );
}

/**
 * Swap keys and values in an object.
 * e.g. { a: "1", b: "2" } → { "1": "a", "2": "b" }
 */
export function invert(object: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [value, key]),
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
export function deepEqual(valueA: unknown, valueB: unknown): boolean {
  if (valueA === valueB) return true;
  if (valueA == null || valueB == null) return false;
  if (typeof valueA !== typeof valueB) return false;
  if (Array.isArray(valueA)) {
    if (!Array.isArray(valueB) || valueA.length !== valueB.length) return false;
    return valueA.every((item, itemIndex) => deepEqual(item, valueB[itemIndex]));
  }
  if (typeof valueA === "object") {
    const keysA = Object.keys(valueA as Record<string, unknown>);
    const keysB = Object.keys(valueB as Record<string, unknown>);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => deepEqual((valueA as Record<string, unknown>)[key], (valueB as Record<string, unknown>)[key]));
  }
  return false;
}
