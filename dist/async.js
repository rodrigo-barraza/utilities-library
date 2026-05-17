// ─────────────────────────────────────────────────────────────
// Async — Promise-based timing utilities
// ─────────────────────────────────────────────────────────────
/**
 * Resolves after `ms` milliseconds.
 */
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function retry(fn, { retries = 3, delay = 1000, backoff = 2 } = {}) {
    for (let attempt = 0;; attempt++) {
        try {
            return await fn(attempt);
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
 * the promise does not settle within `ms` milliseconds.
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
 */
export async function fetchWithTimeout(url, timeoutMs = 5000, fallback = null) {
    try {
        const res = await fetch(url, {
            signal: AbortSignal.timeout(timeoutMs),
        });
        if (!res.ok)
            return fallback;
        return await res.json();
    }
    catch {
        return fallback;
    }
}
/**
 * Race a promise against a timeout, resolving to `fallback` on timeout.
 * Unlike `withTimeout`, this never rejects — it gracefully degrades.
 */
export function withTimeoutFallback(promise, ms, fallback = null) {
    return Promise.race([
        promise,
        new Promise((resolve) => setTimeout(() => resolve(fallback), ms)),
    ]);
}
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