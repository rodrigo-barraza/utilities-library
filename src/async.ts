// ─────────────────────────────────────────────────────────────
// Async — Promise-based timing utilities
// ─────────────────────────────────────────────────────────────

export function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export interface RetryOptions {
  retries?: number;
  delay?: number;
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

export interface PMapOptions {
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

export interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
}

export function defer<T = void>(): Deferred<T> {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}
