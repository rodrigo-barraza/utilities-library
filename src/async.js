// ─────────────────────────────────────────────────────────────
// Async — Promise-based timing utilities
// ─────────────────────────────────────────────────────────────

/**
 * Resolves after `ms` milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an async function with exponential backoff.
 *
 * @param {(attempt: number) => Promise<*>} fn - Function to attempt (receives 0-based attempt index)
 * @param {object} [options]
 * @param {number} [options.retries=3] - Maximum number of retries after the first failure
 * @param {number} [options.delay=1000] - Base delay in ms before the first retry
 * @param {number} [options.backoff=2] - Multiplier applied to the delay after each retry
 * @returns {Promise<*>}
 */
export async function retry(
  fn,
  { retries = 3, delay = 1000, backoff = 2 } = {},
) {
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
 * Race a promise against a timeout. Rejects with a `TimeoutError` if
 * the promise does not settle within `ms` milliseconds.
 *
 * @param {Promise<*>} promise
 * @param {number} ms - Timeout in milliseconds
 * @param {string} [message="Operation timed out"] - Error message on timeout
 * @returns {Promise<*>}
 */
export function withTimeout(promise, ms, message = "Operation timed out") {
  let timer;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), ms);
    }),
  ]);
}

/**
 * Fetch a URL with an automatic timeout.
 * Returns parsed JSON on success, or `fallback` on failure/timeout.
 *
 * @param {string} url - URL to fetch
 * @param {number} [timeoutMs=5000] - Timeout in milliseconds
 * @param {*} [fallback=null] - Value to return on failure
 * @returns {Promise<*>}
 */
export async function fetchWithTimeout(url, timeoutMs = 5000, fallback = null) {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

/**
 * Race a promise against a timeout, resolving to `fallback` on timeout.
 * Unlike `withTimeout`, this never rejects — it gracefully degrades.
 * Useful for health probes and best-effort discovery where a timeout
 * should return a default value rather than propagate an error.
 *
 * @param {Promise<*>} promise
 * @param {number} ms - Timeout in milliseconds
 * @param {*} [fallback=null] - Value to resolve with on timeout
 * @returns {Promise<*>}
 */
export function withTimeoutFallback(promise, ms, fallback = null) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

/**
 * Map over an iterable with bounded concurrency (concurrency-limited Promise.all).
 *
 * @param {Iterable<*>} iterable - Items to process
 * @param {(item: *, index: number) => Promise<*>} fn - Async mapper function
 * @param {object} [options]
 * @param {number} [options.concurrency=Infinity] - Maximum concurrent promises
 * @returns {Promise<*[]>} Results in original order
 */
export async function pMap(iterable, fn, { concurrency = Infinity } = {}) {
  const items = [...iterable];
  const results = new Array(items.length);

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
 *
 * @returns {{ promise: Promise<*>, resolve: (value: *) => void, reject: (reason: *) => void }}
 */
export function defer() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

