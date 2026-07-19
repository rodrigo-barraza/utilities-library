// ─────────────────────────────────────────────────────────────
// Cache — in-memory TTL / SWR caches
// ─────────────────────────────────────────────────────────────
// Consolidates the memoize-with-expiry maps hand-rolled across
// portal-service (GoogleAnalytics `cached()`, DockerStats
// stale-on-error) and the tools-service cache modules.
// ─────────────────────────────────────────────────────────────
/**
 * Create a keyed in-memory TTL cache. Concurrent misses for the same key
 * each invoke the fetcher (no in-flight dedup) — callers that need dedup
 * should memoize the promise themselves.
 */
export function createTtlCache(options = {}) {
    const { staleWhileRevalidate = false, serveStaleOnError = false } = options;
    const store = new Map();
    async function get(key, ttlMilliseconds, fetcher) {
        const hit = store.get(key);
        if (hit && Date.now() - hit.timestamp < ttlMilliseconds)
            return hit.data;
        const refresh = Promise.resolve()
            .then(fetcher)
            .then((data) => {
            store.set(key, { data, timestamp: Date.now() });
            return data;
        });
        if (hit && staleWhileRevalidate) {
            refresh.catch(() => {
                if (!serveStaleOnError)
                    store.delete(key);
            });
            return hit.data;
        }
        try {
            return await refresh;
        }
        catch (error) {
            if (hit && serveStaleOnError)
                return hit.data;
            store.delete(key);
            throw error;
        }
    }
    return {
        get,
        set: (key, data) => void store.set(key, { data, timestamp: Date.now() }),
        delete: (key) => void store.delete(key),
        clear: () => store.clear(),
        peek: (key) => store.get(key)?.data,
    };
}
/**
 * Create a standard in-memory cache with update/error/get/health lifecycle,
 * for data refreshed by an external poller (cron/interval) rather than
 * on-demand TTL fetches — see {@link createTtlCache} for that.
 */
export function createSimpleCache({ type = "object", itemsKey = "items", } = {}) {
    const cache = {
        data: (type === "array" ? [] : null),
        lastFetch: null,
        error: null,
    };
    function update(data) {
        cache.data = data;
        cache.lastFetch = new Date().toISOString();
        cache.error = null;
    }
    function setError(error) {
        cache.error = { message: error.message, time: new Date().toISOString() };
    }
    function get() {
        if (type === "array") {
            const array = cache.data;
            return {
                count: array.length,
                [itemsKey]: cache.data,
                lastFetch: cache.lastFetch,
            };
        }
        if (!cache.data)
            return { status: "no_data", lastFetch: null };
        return {
            ...cache.data,
            lastFetch: cache.lastFetch,
        };
    }
    function getHealth() {
        if (type === "array") {
            const array = cache.data;
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
//# sourceMappingURL=cache.js.map