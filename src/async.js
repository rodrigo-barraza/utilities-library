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
    } catch (err) {
      if (attempt >= retries) throw err;
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
