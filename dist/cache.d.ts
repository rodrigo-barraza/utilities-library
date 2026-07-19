export interface TtlCacheOptions {
    /**
     * When an entry is expired but present, return the stale value
     * immediately and refresh in the background (a failed background
     * refresh keeps the stale entry only if `serveStaleOnError`).
     */
    staleWhileRevalidate?: boolean;
    /** Serve the last good value when the fetcher throws, instead of rethrowing. */
    serveStaleOnError?: boolean;
}
export interface TtlCache {
    get<T>(key: string, ttlMilliseconds: number, fetcher: () => Promise<T>): Promise<T>;
    set(key: string, data: unknown): void;
    delete(key: string): void;
    clear(): void;
    /** Peek at a cached value without triggering a fetch (fresh or stale). */
    peek<T>(key: string): T | undefined;
}
/**
 * Create a keyed in-memory TTL cache. Concurrent misses for the same key
 * each invoke the fetcher (no in-flight dedup) — callers that need dedup
 * should memoize the promise themselves.
 */
export declare function createTtlCache(options?: TtlCacheOptions): TtlCache;
export interface CacheError {
    message: string;
    time: string;
}
export interface CacheHealth {
    lastFetch: string | null;
    error: CacheError | null;
    count?: number;
    hasData?: boolean;
}
export interface SimpleCacheOptions {
    type?: "object" | "array";
    itemsKey?: string;
}
export interface SimpleCache<T> {
    update: (data: T) => void;
    setError: (error: Error) => void;
    get: () => Record<string, unknown>;
    getHealth: () => CacheHealth;
    getData: () => T;
    getLastFetch: () => string | null;
}
/**
 * Create a standard in-memory cache with update/error/get/health lifecycle,
 * for data refreshed by an external poller (cron/interval) rather than
 * on-demand TTL fetches — see {@link createTtlCache} for that.
 */
export declare function createSimpleCache<T = unknown>({ type, itemsKey, }?: SimpleCacheOptions): SimpleCache<T>;
//# sourceMappingURL=cache.d.ts.map