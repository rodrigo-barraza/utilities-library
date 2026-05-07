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
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(message)), ms),
    ),
  ]);
}
