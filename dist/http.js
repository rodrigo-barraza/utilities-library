// ─────────────────────────────────────────────────────────────
// HTTP — Isomorphic JSON API client
// ─────────────────────────────────────────────────────────────
// Consolidates the per-client `request()` fetch wrappers that
// were copy-pasted across the frontend repos: JSON headers,
// safe body parsing, and `body.error`-first error messages.
// Backend adoption (2026-07): opt-in retry with backoff, per-call
// timeout override, and `requestRaw` for SSE/binary passthrough.
// ─────────────────────────────────────────────────────────────
import { sleep } from "./async.js";
export class ApiError extends Error {
    status;
    body;
    constructor(message, status, body) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.body = body;
    }
}
function joinUrl(baseUrl, path) {
    if (!path)
        return baseUrl;
    return `${baseUrl.replace(/\/+$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}
async function parseBody(response) {
    const text = await response.text().catch(() => "");
    if (!text)
        return undefined;
    try {
        return JSON.parse(text);
    }
    catch {
        return text;
    }
}
function resolveHeaders(headers) {
    return typeof headers === "function" ? headers() : (headers ?? {});
}
function isTransientNetworkError(error) {
    // fetch rejects with TypeError on connection-level failures (refused,
    // reset, DNS). Timeouts/aborts surface as DOMException and are excluded.
    return error instanceof TypeError;
}
function resolveRetry(retry) {
    if (!retry)
        return null;
    const options = retry === true ? {} : retry;
    return {
        retries: options.retries ?? 1,
        delayMilliseconds: options.delayMilliseconds ?? 500,
        backoff: options.backoff ?? 2,
        jitterMilliseconds: options.jitterMilliseconds ?? 500,
        shouldRetry: options.shouldRetry ?? isTransientNetworkError,
    };
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
export function createApiClient(baseUrl, options = {}) {
    const fetchImplementation = options.fetchImplementation ?? fetch;
    const retryPolicy = resolveRetry(options.retry);
    async function sendOnce(path, init) {
        const { timeoutMilliseconds, ...fetchInit } = init;
        const headers = new Headers(resolveHeaders(options.headers));
        new Headers(init.headers).forEach((value, key) => headers.set(key, value));
        if (init.body !== undefined && !headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }
        const effectiveTimeout = timeoutMilliseconds ?? options.timeoutMilliseconds;
        const signal = init.signal ??
            (effectiveTimeout !== undefined ? AbortSignal.timeout(effectiveTimeout) : undefined);
        return fetchImplementation(joinUrl(baseUrl, path), {
            ...fetchInit,
            headers,
            signal,
        });
    }
    async function send(path, init, failOnStatus) {
        for (let attempt = 0;; attempt++) {
            try {
                const response = await sendOnce(path, init);
                if (failOnStatus && !response.ok) {
                    const body = await parseBody(response);
                    const serverMessage = typeof body === "object" && body !== null && "error" in body
                        ? String(body.error)
                        : undefined;
                    throw new ApiError(serverMessage || `Request failed with status ${response.status}`, response.status, body);
                }
                return response;
            }
            catch (error) {
                if (!retryPolicy ||
                    attempt >= retryPolicy.retries ||
                    !retryPolicy.shouldRetry(error, attempt)) {
                    throw error;
                }
                await sleep(retryPolicy.delayMilliseconds * Math.pow(retryPolicy.backoff, attempt) +
                    Math.random() * retryPolicy.jitterMilliseconds);
            }
        }
    }
    async function request(path, init = {}) {
        const response = await send(path, init, true);
        return (await parseBody(response));
    }
    function withBody(method) {
        return (path, body, init = {}) => request(path, {
            ...init,
            method,
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    }
    return {
        request,
        requestRaw: (path, init = {}) => send(path, init, false),
        get: (path, init = {}) => request(path, { ...init, method: "GET" }),
        post: withBody("POST"),
        put: withBody("PUT"),
        patch: withBody("PATCH"),
        delete: (path, init = {}) => request(path, { ...init, method: "DELETE" }),
    };
}
//# sourceMappingURL=http.js.map