export declare class ApiError extends Error {
    readonly status: number;
    readonly body: unknown;
    constructor(message: string, status: number, body: unknown);
}
export interface ApiRetryOptions {
    /** Additional attempts after the first failure (default 1). */
    retries?: number;
    /** Base delay before the first retry (default 500ms). */
    delayMilliseconds?: number;
    /** Multiplier applied to the delay per attempt (default 2). */
    backoff?: number;
    /** Random extra delay added per retry to avoid thundering herds (default 500ms). */
    jitterMilliseconds?: number;
    /**
     * Decide whether an error is retryable. Receives {@link ApiError} for
     * non-2xx responses and the raw fetch error otherwise. The default retries
     * only transient network failures (fetch `TypeError`), never HTTP errors
     * or timeouts/aborts.
     */
    shouldRetry?: (error: unknown, attempt: number) => boolean;
}
export interface ApiClientOptions {
    /** Static headers, or a factory evaluated per request (e.g. auth headers). */
    headers?: HeadersInit | (() => HeadersInit);
    /** Abort requests that take longer than this. */
    timeoutMilliseconds?: number;
    /** Retry failed requests: `true` for defaults, or tuned {@link ApiRetryOptions}. */
    retry?: boolean | ApiRetryOptions;
    /** Override the fetch implementation (useful in tests). */
    fetchImplementation?: typeof fetch;
}
export interface ApiRequestInit extends RequestInit {
    /** Per-request timeout, overriding the client-level default. */
    timeoutMilliseconds?: number;
}
export interface ApiClient {
    request<T = unknown>(path: string, init?: ApiRequestInit): Promise<T>;
    /**
     * Like {@link ApiClient.request} but returns the raw `Response` without
     * consuming the body or throwing on non-2xx — the escape hatch for SSE
     * and binary passthrough. Retry still applies to network-level failures.
     */
    requestRaw(path: string, init?: ApiRequestInit): Promise<Response>;
    get<T = unknown>(path: string, init?: ApiRequestInit): Promise<T>;
    post<T = unknown>(path: string, body?: unknown, init?: ApiRequestInit): Promise<T>;
    put<T = unknown>(path: string, body?: unknown, init?: ApiRequestInit): Promise<T>;
    patch<T = unknown>(path: string, body?: unknown, init?: ApiRequestInit): Promise<T>;
    delete<T = unknown>(path: string, init?: ApiRequestInit): Promise<T>;
}
/**
 * Create a JSON-first HTTP client bound to a base URL.
 *
 * - Sets `Content-Type: application/json` and serializes plain bodies.
 * - Parses JSON responses safely (empty/204 responses resolve to undefined).
 * - Non-2xx responses throw {@link ApiError} with the server's
 *   `body.error` message when present, else `Request failed with status N`.
 * - With `retry` enabled, transient network failures (and anything the
 *   `shouldRetry` predicate accepts) are retried with backoff + jitter.
 *
 * `baseUrl` may be an absolute service URL or a relative proxy prefix
 * (e.g. `/api/gauge`).
 */
export declare function createApiClient(baseUrl: string, options?: ApiClientOptions): ApiClient;
//# sourceMappingURL=http.d.ts.map