// ─────────────────────────────────────────────────────────────
// HTTP — Isomorphic JSON API client
// ─────────────────────────────────────────────────────────────
// Consolidates the per-client `request()` fetch wrappers that
// were copy-pasted across the frontend repos: JSON headers,
// safe body parsing, and `body.error`-first error messages.
// ─────────────────────────────────────────────────────────────

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
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

function joinUrl(baseUrl: string, path: string): string {
  if (!path) return baseUrl;
  return `${baseUrl.replace(/\/+$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text().catch(() => "");
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function resolveHeaders(headers: ApiClientOptions["headers"]): HeadersInit {
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
export function createApiClient(baseUrl: string, options: ApiClientOptions = {}): ApiClient {
  const fetchImplementation = options.fetchImplementation ?? fetch;

  async function request<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(resolveHeaders(options.headers));
    new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    if (init.body !== undefined && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const signal =
      init.signal ??
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
      const serverMessage =
        typeof body === "object" && body !== null && "error" in body
          ? String((body as { error: unknown }).error)
          : undefined;
      throw new ApiError(
        serverMessage || `Request failed with status ${response.status}`,
        response.status,
        body,
      );
    }

    return body as T;
  }

  function withBody(method: string) {
    return <T = unknown>(path: string, body?: unknown, init: RequestInit = {}): Promise<T> =>
      request<T>(path, {
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
