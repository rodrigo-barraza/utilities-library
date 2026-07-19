// ─────────────────────────────────────────────────────────────
// Cache — in-memory TTL / SWR caches
// ─────────────────────────────────────────────────────────────
// Consolidates the memoize-with-expiry maps hand-rolled across
// portal-service (GoogleAnalytics `cached()`, DockerStats
// stale-on-error) and the tools-service cache modules.
// ─────────────────────────────────────────────────────────────

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
export function createTtlCache(options: TtlCacheOptions = {}): TtlCache {
  const { staleWhileRevalidate = false, serveStaleOnError = false } = options;
  const store = new Map<string, { data: unknown; timestamp: number }>();

  async function get<T>(
    key: string,
    ttlMilliseconds: number,
    fetcher: () => Promise<T>,
  ): Promise<T> {
    const hit = store.get(key);
    if (hit && Date.now() - hit.timestamp < ttlMilliseconds) return hit.data as T;

    const refresh = Promise.resolve()
      .then(fetcher)
      .then((data) => {
        store.set(key, { data, timestamp: Date.now() });
        return data;
      });

    if (hit && staleWhileRevalidate) {
      refresh.catch(() => {
        if (!serveStaleOnError) store.delete(key);
      });
      return hit.data as T;
    }

    try {
      return await refresh;
    } catch (error) {
      if (hit && serveStaleOnError) return hit.data as T;
      store.delete(key);
      throw error;
    }
  }

  return {
    get,
    set: (key, data) => void store.set(key, { data, timestamp: Date.now() }),
    delete: (key) => void store.delete(key),
    clear: () => store.clear(),
    peek: <T>(key: string) => store.get(key)?.data as T | undefined,
  };
}

// ─────────────────────────────────────────────────────────────
// SimpleCache — interval-polled cache with health reporting
// (promoted from tools-service createSimpleCache, which fronts
// its ~26 fetcher cache modules)
// ─────────────────────────────────────────────────────────────

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
export function createSimpleCache<T = unknown>({
  type = "object",
  itemsKey = "items",
}: SimpleCacheOptions = {}): SimpleCache<T> {
  const cache: { data: T; lastFetch: string | null; error: CacheError | null } = {
    data: (type === "array" ? [] : null) as T,
    lastFetch: null,
    error: null,
  };

  function update(data: T): void {
    cache.data = data;
    cache.lastFetch = new Date().toISOString();
    cache.error = null;
  }

  function setError(error: Error): void {
    cache.error = { message: error.message, time: new Date().toISOString() };
  }

  function get(): Record<string, unknown> {
    if (type === "array") {
      const array = cache.data as unknown[];
      return {
        count: array.length,
        [itemsKey]: cache.data,
        lastFetch: cache.lastFetch,
      };
    }
    if (!cache.data) return { status: "no_data", lastFetch: null };
    return {
      ...(cache.data as Record<string, unknown>),
      lastFetch: cache.lastFetch,
    };
  }

  function getHealth(): CacheHealth {
    if (type === "array") {
      const array = cache.data as unknown[];
      return {
        lastFetch: cache.lastFetch,
        error: cache.error,
        count: array.length,
      };
    }
    return {
      lastFetch: cache.lastFetch,
      error: cache.error,
      hasData: cache.data !== null,
    };
  }

  return {
    update,
    setError,
    get,
    getHealth,
    getData: () => cache.data,
    getLastFetch: () => cache.lastFetch,
  };
}
