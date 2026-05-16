// ─────────────────────────────────────────────────────────────
// Arrays — Array and object manipulation utilities
// ─────────────────────────────────────────────────────────────

/**
 * Batch an array into chunks of a given size.
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Shuffle an array using the Fisher–Yates algorithm.
 * Returns a new shuffled copy — does not mutate the original.
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i]];
  }
  return shuffled;
}

/**
 * Pick a random element from an array.
 */
export function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Filter out null/undefined values from a payload object.
 * Keeps falsy values like 0, false, and empty strings.
 */
export function compactPayload(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) => value !== null && value !== undefined,
    ),
  );
}

/**
 * Group array elements by a key derived from each element.
 * Returns an object whose keys are group identifiers and values are arrays.
 */
export function groupBy<T>(array: T[], keyFn: string | ((item: T) => string)): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of array) {
    const key = typeof keyFn === "function" ? keyFn(item) : (item as Record<string, unknown>)[keyFn] as string;
    (groups[key] ??= []).push(item);
  }
  return groups;
}

/**
 * Deduplicate an array by a key derived from each element.
 * Keeps the first occurrence of each unique key.
 */
export function uniqueBy<T>(array: T[], keyFn: string | ((item: T) => unknown)): T[] {
  const seen = new Set<unknown>();
  return array.filter((item) => {
    const key = typeof keyFn === "function" ? keyFn(item) : (item as Record<string, unknown>)[keyFn];
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Split an array into two groups based on a predicate.
 * The first array contains items where `fn` returns true,
 * the second contains the rest.
 */
export function partition<T>(array: T[], fn: (item: T) => boolean): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  for (const item of array) {
    (fn(item) ? pass : fail).push(item);
  }
  return [pass, fail];
}

/**
 * Return elements present in both arrays.
 * Uses strict equality. Preserves order from the first array.
 */
export function intersection<T>(a: T[], b: T[]): T[] {
  const set = new Set(b);
  return a.filter((item) => set.has(item));
}

/**
 * Return elements in `a` that are not in `b`.
 * Uses strict equality. Preserves order from `a`.
 */
export function difference<T>(a: T[], b: T[]): T[] {
  const set = new Set(b);
  return a.filter((item) => !set.has(item));
}

/**
 * Sort an array of objects by a key or comparator function.
 * Returns a new sorted copy — does not mutate the original.
 */
export interface SortByOptions {
  descending?: boolean;
}

export function sortBy<T>(array: T[], keyOrFn: string | ((a: T, b: T) => number), { descending = false }: SortByOptions = {}): T[] {
  const copy = [...array];
  if (typeof keyOrFn === "function") {
    copy.sort(keyOrFn);
  } else {
    copy.sort((a, b) => {
      const valueA = (a as Record<string, unknown>)[keyOrFn] as string | number;
      const valueB = (b as Record<string, unknown>)[keyOrFn] as string | number;
      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });
  }
  return descending ? copy.reverse() : copy;
}

/**
 * Flatten a nested array to a given depth.
 * Wrapper around Array.flat() with a clearer API for shared usage.
 */
export function flatten<T>(array: T[], depth = 1): T[] {
  return (array as unknown[]).flat(depth) as T[];
}
