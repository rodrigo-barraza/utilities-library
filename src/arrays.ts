// ─────────────────────────────────────────────────────────────
// Arrays — Array and object manipulation utilities
// ─────────────────────────────────────────────────────────────

import { isRecord, type PlainObject } from "./objects.ts";

export function chunk<ArrayItem>(array: ArrayItem[], size: number): ArrayItem[][] {
  const chunks: ArrayItem[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function shuffleArray<ArrayItem>(array: ArrayItem[]): ArrayItem[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i]];
  }
  return shuffled;
}

export function pickRandom<ArrayItem>(array: ArrayItem[]): ArrayItem {
  return array[Math.floor(Math.random() * array.length)];
}

export function compactPayload<Payload extends PlainObject>(object: Payload): Partial<Payload> {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => value !== null && value !== undefined,
    ),
  ) as Partial<Payload>;
}

export function groupBy<ArrayItem>(
  array: ArrayItem[],
  keySelector: string | ((item: ArrayItem) => string),
): Record<string, ArrayItem[]> {
  const groups: Record<string, ArrayItem[]> = {};
  for (const item of array) {
    let key: string;
    if (typeof keySelector === "function") {
      key = keySelector(item);
    } else {
      if (isRecord(item)) {
        key = item[keySelector] as string;
      } else {
        key = String(item);
      }
    }
    (groups[key] ??= []).push(item);
  }
  return groups;
}

export function uniqueBy<ArrayItem>(
  array: ArrayItem[],
  keySelector: string | ((item: ArrayItem) => unknown),
): ArrayItem[] {
  const seen = new Set<unknown>();
  return array.filter((item) => {
    let key: unknown;
    if (typeof keySelector === "function") {
      key = keySelector(item);
    } else {
      if (isRecord(item)) {
        key = item[keySelector];
      } else {
        key = item;
      }
    }
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function partition<ArrayItem>(
  array: ArrayItem[],
  predicate: (item: ArrayItem) => boolean,
): [ArrayItem[], ArrayItem[]] {
  const pass: ArrayItem[] = [];
  const fail: ArrayItem[] = [];
  for (const item of array) {
    (predicate(item) ? pass : fail).push(item);
  }
  return [pass, fail];
}

export function intersection<ArrayItem>(firstArray: ArrayItem[], secondArray: ArrayItem[]): ArrayItem[] {
  const set = new Set(secondArray);
  return firstArray.filter((item) => set.has(item));
}

export function difference<ArrayItem>(firstArray: ArrayItem[], secondArray: ArrayItem[]): ArrayItem[] {
  const set = new Set(secondArray);
  return firstArray.filter((item) => !set.has(item));
}

export interface SortByOptions {
  descending?: boolean;
}

export function sortBy<ArrayItem>(
  array: ArrayItem[],
  keyOrComparator: string | ((firstItem: ArrayItem, secondItem: ArrayItem) => number),
  { descending = false }: SortByOptions = {},
): ArrayItem[] {
  const copy = [...array];
  if (typeof keyOrComparator === "function") {
    copy.sort(keyOrComparator);
  } else {
    copy.sort((firstItem, secondItem) => {
      let valueA: string | number = 0;
      let valueB: string | number = 0;
      if (isRecord(firstItem)) {
        valueA = firstItem[keyOrComparator] as string | number;
      }
      if (isRecord(secondItem)) {
        valueB = secondItem[keyOrComparator] as string | number;
      }
      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });
  }
  return descending ? copy.reverse() : copy;
}

// TypeScript cannot infer recursive Array.flat() depth generics —
// cast through unknown[] to satisfy the compiler.
export function flatten<ArrayItem>(array: ArrayItem[], depth = 1): ArrayItem[] {
  return (array as unknown[]).flat(depth) as ArrayItem[];
}
