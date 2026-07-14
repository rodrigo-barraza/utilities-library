// ─────────────────────────────────────────────────────────────
// HTTP — Isomorphic JSON API client
// ─────────────────────────────────────────────────────────────
// Consolidates the per-client `request()` fetch wrappers that
// were copy-pasted across the frontend repos: JSON headers,
// safe body parsing, and `body.error`-first error messages.
// ─────────────────────────────────────────────────────────────
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
export function createApiClient(baseUrl, options = {}) {
    const fetchImplementation = options.fetchImplementation ?? fetch;
    async function request(path, init = {}) {
        const headers = new Headers(resolveHeaders(options.headers));
        new Headers(init.headers).forEach((value, key) => headers.set(key, value));
        if (init.body !== undefined && !headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }
        const signal = init.signal ??
            (options.timeoutMilliseconds !== undefined
                ? AbortSignal.timeout(options.timeoutMilliseconds)
                : undefined);
        const response = await fetchImplementation(joinUrl(baseUrl, path), {
            ...init,
            headers,
            signal,
        });
        const body = await parseBody(response);
        if (!response.ok) {
            const serverMessage = typeof body === "object" && body !== null && "error" in body
                ? String(body.error)
                : undefined;
            throw new ApiError(serverMessage || `Request failed with status ${response.status}`, response.status, body);
        }
        return body;
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
        get: (path, init = {}) => request(path, { ...init, method: "GET" }),
        post: withBody("POST"),
        put: withBody("PUT"),
        patch: withBody("PATCH"),
        delete: (path, init = {}) => request(path, { ...init, method: "DELETE" }),
    };
}
//# sourceMappingURL=http.js.map