/**
 * Recursively merge `source` into `target`, returning a new object.
 * Only plain objects are merged recursively — arrays and other types
 * are replaced outright. Neither input is mutated.
 */
export declare function deepMerge<T extends Record<string, unknown>>(target: T, source: Record<string, unknown>): T;
/**
 * Create a new object with only the specified keys from `obj`.
 */
export declare function pick<T extends Record<string, unknown>, K extends keyof T>(object: T, keys: K[]): Pick<T, K>;
/**
 * Create a new object with all keys from `obj` except those listed.
 */
export declare function omit<T extends Record<string, unknown>, K extends keyof T>(object: T, keys: K[]): Omit<T, K>;
/**
 * Create a new object with the same keys but values transformed by `fn`.
 */
export declare function mapValues<T extends Record<string, unknown>, R>(object: T, fn: (value: unknown, key: string) => R): Record<string, R>;
/**
 * Create a new object with keys transformed by `fn`, values unchanged.
 */
export declare function mapKeys(object: Record<string, unknown>, fn: (key: string, value: unknown) => string): Record<string, unknown>;
/**
 * Swap keys and values in an object.
 * e.g. { a: "1", b: "2" } → { "1": "a", "2": "b" }
 */
export declare function invert(object: Record<string, string>): Record<string, string>;
/**
 * Check if a value is "empty":
 * - `null` or `undefined` → true
 * - Empty string `""` → true
 * - Empty array `[]` → true
 * - Plain object with no own keys `{}` → true
 * - Map/Set with size 0 → true
 * - Everything else → false
 */
export declare function isEmpty(value: unknown): boolean;
/**
 * Deep structural equality check for JSON-serializable values.
 * Compares primitives, plain objects, and arrays recursively.
 * Does not handle circular references, Dates, RegExps, etc.
 */
export declare function deepEqual(valueA: unknown, valueB: unknown): boolean;
//# sourceMappingURL=objects.d.ts.map