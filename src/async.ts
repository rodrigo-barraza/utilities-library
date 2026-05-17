// ─────────────────────────────────────────────────────────────
// Async — Promise-based timing utilities
// ─────────────────────────────────────────────────────────────

/**
 * Resolves after `ms` milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an async function with exponential backoff.
 */
export interface RetryOptions {
  /** Maximum number of retries after the first failure. */
  retries?: number;
  /** Base delay in ms before the first retry. */
  delay?: number;
  /** Multiplier applied to the delay after each retry. */
  backoff?: number;
}

export async function retry<T>(
  fn: (attempt: number) => Promise<T> | T,
  { retries = 3, delay = 1000, backoff = 2 }: RetryOptions = {},
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      if (attempt >= retries) throw error;
      await sleep(delay * Math.pow(backoff, attempt));
    }
  }
}

/**
 * Race a promise against a timeout. Rejects with an Error if
 * the promise does not settle within `ms` milliseconds.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number, message = "Operation timed out"): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), ms);
    }),
  ]);
}

/**
 * Fetch a URL with an automatic timeout.
 * Returns parsed JSON on success, or `fallback` on failure/timeout.
 */
export async function fetchWithTimeout<T = unknown>(url: string, timeoutMs = 5000, fallback: T | null = null): Promise<T | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) return fallback;
    return await response.json() as T;
  } catch {
    return fallback;
  }
}

/**
 * Race a promise against a timeout, resolving to `fallback` on timeout.
 * Unlike `withTimeout`, this never rejects — it gracefully degrades.
 */
export function withTimeoutFallback<T>(promise: Promise<T>, ms: number, fallback: T | null = null): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<T | null>((resolve) => setTimeout(() => resolve(fallback), ms)),
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
  fn: (item: T, index: number) => Promise<R> | R,
  { concurrency = Infinity }: PMapOptions = {},
): Promise<R[]> {
  const items = [...iterable];
  const results = new Array<R>(items.length);

  if (concurrency === Infinity) {
    return Promise.all(items.map((item, i) => fn(item, i)));
  }

  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const i = nextIndex++;
      results[i] = await fn(items[i], i);
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
