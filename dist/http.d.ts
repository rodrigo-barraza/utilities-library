export declare class ApiError extends Error {
    readonly status: number;
    readonly body: unknown;
    constructor(message: string, status: number, body: unknown);
}
export interface ApiClientOptions {
    /** Static headers, or a factory evaluated per request (e.g. auth headers). */
    headers?: HeadersInit | (() => HeadersInit);
    /** Abort requests that take longer than this. */
    timeoutMilliseconds?: number;
    /** Override the fetch implementation (useful in tests). */
    fetchImplementation?: typeof fetch;
}
export interface ApiClient {
    request<T = unknown>(path: string, init?: RequestInit): Promise<T>;
    get<T = unknown>(path: string, init?: RequestInit): Promise<T>;
    post<T = unknown>(path: string, body?: unknown, init?: RequestInit): Promise<T>;
    put<T = unknown>(path: string, body?: unknown, init?: RequestInit): Promise<T>;
    patch<T = unknown>(path: string, body?: unknown, init?: RequestInit): Promise<T>;
    delete<T = unknown>(path: string, init?: RequestInit): Promise<T>;
}
/**
 * Create a JSON-first HTTP client bound to a base URL.
 *
 * - Sets `Content-Type: application/json` and serializes plain bodies.
 * - Parses JSON responses safely (empty/204 responses resolve to undefined).
 * - Non-2xx responses throw {@link ApiError} with the server's
 *   `body.error` message when present, else `Request failed with status N`.
 *
 * `baseUrl` may be an absolute service URL or a relative proxy prefix
 * (e.g. `/api/gauge`).
 */
export declare function createApiClient(baseUrl: string, options?: ApiClientOptions): ApiClient;
//# sourceMappingURL=http.d.ts.map