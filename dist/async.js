// ─────────────────────────────────────────────────────────────
// Async — Promise-based timing utilities
// ─────────────────────────────────────────────────────────────
/**
 * Resolves after `milliseconds` milliseconds.
 */
export function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
export async function retry(action, { retries = 3, delay = 1000, backoff = 2 } = {}) {
    for (let attempt = 0;; attempt++) {
        try {
            return await action(attempt);
        }
        catch (error) {
            if (attempt >= retries)
                throw error;
            await sleep(delay * Math.pow(backoff, attempt));
        }
    }
}
/**
 * Race a promise against a timeout. Rejects with an Error if
 * the promise does not settle within `milliseconds` milliseconds.
 */
export function withTimeout(promise, milliseconds, message = "Operation timed out") {
    let timer;
    return Promise.race([
        promise.finally(() => clearTimeout(timer)),
        new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error(message)), milliseconds);
        }),
    ]);
}
/**
 * Fetch a URL with an automatic timeout.
 * Returns parsed JSON on success, or `fallback` on failure/timeout.
 */
export async function fetchWithTimeout(url, timeoutMilliseconds = 5000, fallback = null) {
    try {
        const response = await fetch(url, {
            signal: AbortSignal.timeout(timeoutMilliseconds),
        });
        if (!response.ok)
            return fallback;
        return (await response.json());
    }
    catch {
        return fallback;
    }
}
/**
 * Race a promise against a timeout, resolving to `fallback` on timeout.
 * Unlike `withTimeout`, this never rejects — it gracefully degrades.
 */
export function withTimeoutFallback(promise, milliseconds, fallback = null) {
    return Promise.race([
        promise,
        new Promise((resolve) => setTimeout(() => resolve(fallback), milliseconds)),
    ]);
}
export async function pMap(iterable, mapper, { concurrency = Infinity } = {}) {
    const items = [...iterable];
    const results = new Array(items.length);
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
    const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
    await Promise.all(workers);
    return results;
}
export function defer() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}
//# sourceMappingURL=async.js.map