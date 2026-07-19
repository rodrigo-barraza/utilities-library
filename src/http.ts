// ─────────────────────────────────────────────────────────────
// HTTP — Isomorphic JSON API client
// ─────────────────────────────────────────────────────────────
// Consolidates the per-client `request()` fetch wrappers that
// were copy-pasted across the frontend repos: JSON headers,
// safe body parsing, and `body.error`-first error messages.
// Backend adoption (2026-07): opt-in retry with backoff, per-call
// timeout override, and `requestRaw` for SSE/binary passthrough.
// ─────────────────────────────────────────────────────────────

import { sleep } from "./async.ts";

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

function isTransientNetworkError(error: unknown): boolean {
  // fetch rejects with TypeError on connection-level failures (refused,
  // reset, DNS). Timeouts/aborts surface as DOMException and are excluded.
  return error instanceof TypeError;
}

function resolveRetry(retry: ApiClientOptions["retry"]): Required<ApiRetryOptions> | null {
  if (!retry) return null;
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
export function createApiClient(baseUrl: string, options: ApiClientOptions = {}): ApiClient {
  const fetchImplementation = options.fetchImplementation ?? fetch;
  const retryPolicy = resolveRetry(options.retry);

  async function sendOnce(path: string, init: ApiRequestInit): Promise<Response> {
    const { timeoutMilliseconds, ...fetchInit } = init;
    const headers = new Headers(resolveHeaders(options.headers));
    new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    if (init.body !== undefined && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const effectiveTimeout = timeoutMilliseconds ?? options.timeoutMilliseconds;
    const signal =
      init.signal ??
      (effectiveTimeout !== undefined ? AbortSignal.timeout(effectiveTimeout) : undefined);

    return fetchImplementation(joinUrl(baseUrl, path), {
      ...fetchInit,
      headers,
      signal,
    });
  }

  async function send(
    path: string,
    init: ApiRequestInit,
    failOnStatus: boolean,
  ): Promise<Response> {
    for (let attempt = 0; ; attempt++) {
      try {
        const response = await sendOnce(path, init);
        if (failOnStatus && !response.ok) {
          const body = await parseBody(response);
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
        return response;
      } catch (error) {
        if (
          !retryPolicy ||
          attempt >= retryPolicy.retries ||
          !retryPolicy.shouldRetry(error, attempt)
        ) {
          throw error;
        }
        await sleep(
          retryPolicy.delayMilliseconds * Math.pow(retryPolicy.backoff, attempt) +
            Math.random() * retryPolicy.jitterMilliseconds,
        );
      }
    }
  }

  async function request<T = unknown>(path: string, init: ApiRequestInit = {}): Promise<T> {
    const response = await send(path, init, true);
    return (await parseBody(response)) as T;
  }

  function withBody(method: string) {
    return <T = unknown>(path: string, body?: unknown, init: ApiRequestInit = {}): Promise<T> =>
      request<T>(path, {
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
