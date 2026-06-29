// ─────────────────────────────────────────────────────────────
// Objects — Plain-object manipulation utilities
// ─────────────────────────────────────────────────────────────

export interface PlainObject {
  [key: string]: unknown;
}

export function isRecord(value: unknown): value is PlainObject {
  return typeof value === "object" && value !== null;
}

export function deepMerge<T extends PlainObject>(target: T, source: PlainObject): T {
  const result: PlainObject = { ...target };
  for (const [key, value] of Object.entries(source)) {
    const targetValue = target[key];
    if (
      isRecord(value) &&
      !Array.isArray(value) &&
      isRecord(targetValue) &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(targetValue, value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

export function pick<T extends PlainObject, K extends keyof T>(object: T, keys: K[]): Pick<T, K> {
  const result: PlainObject = {};
  for (const key of keys) {
    if (key in object) {
      result[key as string] = object[key];
    }
  }
  return result as Pick<T, K>;
}

export function omit<T extends PlainObject, K extends keyof T>(object: T, keys: K[]): Omit<T, K> {
  const exclude = new Set<string>(keys.map((key) => String(key)));
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !exclude.has(key)),
  ) as Omit<T, K>;
}

export function mapValues<T extends PlainObject, R>(
  object: T,
  callback: (value: unknown, key: string) => R,
): Record<string, R> {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, callback(value, key)]),
  );
}

export function mapKeys(
  object: PlainObject,
  callback: (key: string, value: unknown) => string,
): PlainObject {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [callback(key, value), value]),
  );
}

export function invert(object: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [value, key]),
  );
}

export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

// Does not handle circular references, Dates, RegExps, or class instances.
export function deepEqual(valueA: unknown, valueB: unknown): boolean {
  if (valueA === valueB) return true;
  if (valueA == null || valueB == null) return false;
  if (typeof valueA !== typeof valueB) return false;
  if (Array.isArray(valueA)) {
    if (!Array.isArray(valueB) || valueA.length !== valueB.length) return false;
    return valueA.every((item, itemIndex) => deepEqual(item, valueB[itemIndex]));
  }
  if (isRecord(valueA) && isRecord(valueB)) {
    const keysA = Object.keys(valueA);
    const keysB = Object.keys(valueB);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => deepEqual(valueA[key], valueB[key]));
  }
  return false;
}
