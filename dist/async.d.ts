/**
 * Resolves after `ms` milliseconds.
 */
export declare function sleep(ms: number): Promise<void>;
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
export declare function retry<T>(fn: (attempt: number) => Promise<T> | T, { retries, delay, backoff }?: RetryOptions): Promise<T>;
/**
 * Race a promise against a timeout. Rejects with an Error if
 * the promise does not settle within `ms` milliseconds.
 */
export declare function withTimeout<T>(promise: Promise<T>, ms: number, message?: string): Promise<T>;
/**
 * Fetch a URL with an automatic timeout.
 * Returns parsed JSON on success, or `fallback` on failure/timeout.
 */
export declare function fetchWithTimeout<T = unknown>(url: string, timeoutMs?: number, fallback?: T | null): Promise<T | null>;
/**
 * Race a promise against a timeout, resolving to `fallback` on timeout.
 * Unlike `withTimeout`, this never rejects — it gracefully degrades.
 */
export declare function withTimeoutFallback<T>(promise: Promise<T>, ms: number, fallback?: T | null): Promise<T | null>;
/**
 * Map over an iterable with bounded concurrency (concurrency-limited Promise.all).
 */
export interface PMapOptions {
    /** Maximum concurrent promises. */
    concurrency?: number;
}
export declare function pMap<T, R>(iterable: Iterable<T>, fn: (item: T, index: number) => Promise<R> | R, { concurrency }?: PMapOptions): Promise<R[]>;
/**
 * Create an externally-resolvable promise (Deferred pattern).
 * Useful for coordinating between event handlers, streams, and async flows.
 */
export interface Deferred<T> {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
}
export declare function defer<T = void>(): Deferred<T>;
//# sourceMappingURL=async.d.ts.map