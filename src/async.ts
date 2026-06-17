// ─────────────────────────────────────────────────────────────
// Async — Promise-based timing utilities
// ─────────────────────────────────────────────────────────────

/**
 * Resolves after `milliseconds` milliseconds.
 */
export function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * Retry an async function with exponential backoff.
 */
export interface RetryOptions {
  /** Maximum number of retries after the first failure. */
  retries?: number;
  /** Base delay in milliseconds before the first retry. */
  delay?: number;
  /** Multiplier applied to the delay after each retry. */
  backoff?: number;
}

export async function retry<T>(
  action: (attempt: number) => Promise<T> | T,
  { retries = 3, delay = 1000, backoff = 2 }: RetryOptions = {},
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await action(attempt);
    } catch (error) {
      if (attempt >= retries) throw error;
      await sleep(delay * Math.pow(backoff, attempt));
    }
  }
}

/**
 * Race a promise against a timeout. Rejects with an Error if
 * the promise does not settle within `milliseconds` milliseconds.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  milliseconds: number,
  message = "Operation timed out",
): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), milliseconds);
    }),
  ]);
}

/**
 * Fetch a URL with an automatic timeout.
 * Returns parsed JSON on success, or `fallback` on failure/timeout.
 */
export async function fetchWithTimeout<T>(
  url: string,
  timeoutMilliseconds = 5000,
  fallback: T | null = null,
): Promise<T | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMilliseconds),
    });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

/**
 * Race a promise against a timeout, resolving to `fallback` on timeout.
 * Unlike `withTimeout`, this never rejects — it gracefully degrades.
 */
export function withTimeoutFallback<T>(
  promise: Promise<T>,
  milliseconds: number,
  fallback: T | null = null,
): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<T | null>((resolve) => setTimeout(() => resolve(fallback), milliseconds)),
  ]);
}

/**
 * Map over an iterable with bounded concurrency (concurrency-limited Promise.all).
 */
export interface PMapOptions {
  /** Maximum concurrent promises. */
  concurrency?: number;
}

export async function pMap<T, R>(
  iterable: Iterable<T>,
  mapper: (item: T, index: number) => Promise<R> | R,
  { concurrency = Infinity }: PMapOptions = {},
): Promise<R[]> {
  const items = [...iterable];
  const results = new Array<R>(items.length);

  if (concurrency === Infinity) {
    return Promise.all(items.map((item, index) => mapper(item, index)));
  }

  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await mapper(items[index], index);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

/**
 * Create an externally-resolvable promise (Deferred pattern).
 * Useful for coordinating between event handlers, streams, and async flows.
 */
export interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
}

export function defer<T = void>(): Deferred<T> {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
