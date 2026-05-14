// ─────────────────────────────────────────────────────────────
// Next.js — Shared server-side utilities for Next.js App Router
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";

// ── Private Network Detection ───────────────────────────────

/**
 * RFC 1918 private network check on the Host header.
 * Matches 10.x.x.x, 172.16–31.x.x, 192.168.x.x, localhost, and [::1].
 */
export const PRIVATE_HOST_RE =
  /^(localhost|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+|\[::1\])(:\d+)?$/;

/**
 * Check whether a Next.js request originates from a private/LAN host.
 *
 * @param {Request} request - Incoming Next.js request
 * @returns {boolean}
 */
export function isPrivateHost(request) {
  const host = request.headers.get("host") || "";
  return PRIVATE_HOST_RE.test(host);
}

/**
 * Create a Next.js middleware function that conditionally enforces auth,
 * with automatic LAN bypass for private/RFC 1918 hosts.
 *
 * When `authEnabled` is false or the request comes from a private host,
 * the middleware passes through. Otherwise it delegates to the `auth`
 * handler (typically Auth.js / NextAuth.js).
 *
 * @param {object} config
 * @param {Function} config.auth - Auth.js `auth` function (middleware mode)
 * @param {boolean} config.authEnabled - Whether auth enforcement is active
 * @returns {Function} Next.js middleware handler
 *
 * @example
 * // src/middleware.js
 * import { createAuthMiddleware } from "@rodrigo-barraza/utilities-library/nextjs";
 * import { auth, AUTH_ENABLED } from "@/auth";
 *
 * export const middleware = createAuthMiddleware({ auth, authEnabled: AUTH_ENABLED });
 * export const config = {
 *   matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
 * };
 */
export function createAuthMiddleware({ auth, authEnabled }) {
  return function middleware(request) {
    if (!authEnabled || isPrivateHost(request)) {
      return NextResponse.next();
    }
    return auth(request);
  };
}

// ── Passthrough Headers ─────────────────────────────────────
// Headers forwarded from upstream for non-JSON (binary) responses.
const PASSTHROUGH_HEADERS = ["content-type", "content-disposition", "content-length"];

/**
 * Resolve the upstream service URL for a catch-all proxy route.
 *
 * Priority:
 *  1. `publicUrlEnv` — production domain (reverse-proxied)
 *  2. `internalUrlEnv` — explicit internal URL (non-localhost)
 *  3. Auto-constructed from the incoming request's Host header + port
 *  4. Fallback to `http://localhost:<port>`
 *
 * @param {Request} request - Incoming Next.js request
 * @param {object} config
 * @param {number} config.port - Service port
 * @param {string} [config.publicUrlEnv] - Resolved public URL value
 * @param {string} [config.internalUrlEnv] - Resolved internal URL value
 * @returns {string}
 */
function resolveUpstream(request, { port, publicUrlEnv, internalUrlEnv }) {
  // 1. Public URL (production domain)
  if (publicUrlEnv) return publicUrlEnv;

  // 2. Explicit internal URL (non-localhost)
  if (
    internalUrlEnv &&
    !internalUrlEnv.includes("localhost") &&
    !internalUrlEnv.includes("127.0.0.1")
  ) {
    return internalUrlEnv;
  }

  // 3. Auto-constructed from request host
  const host = request.headers.get("host");
  if (host) {
    const hostname = host.split(":")[0];
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    return `${protocol}://${hostname}:${port}`;
  }

  // 4. Fallback
  return internalUrlEnv || `http://localhost:${port}`;
}

/**
 * Create a catch-all API proxy for a backend service.
 *
 * Returns an object with `{ GET, POST, PUT, DELETE, PATCH }` route
 * handlers compatible with Next.js App Router `[...path]/route.js`.
 *
 * Features:
 *  - Query string forwarding
 *  - Binary passthrough for non-JSON responses
 *  - JSON body forwarding for mutating methods
 *  - Structured error response on failure
 *  - Lazy env resolution — reads process.env at request time, not import time
 *
 * Accepts either raw URL values or env var key names. When a key name
 * is provided (no "://" in the string), `process.env[key]` is read at
 * request time. This solves Next.js standalone mode where runtime env
 * vars are not available at module initialization.
 *
 * @param {object} config
 * @param {number} config.port - Service port
 * @param {string} config.serviceName - Human-readable name for error messages
 * @param {string} [config.publicUrlEnv] - URL value or env var key name for public URL
 * @param {string} [config.internalUrlEnv] - URL value or env var key name for internal URL
 * @param {string[]} [config.forwardHeaders] - Request header names to forward upstream
 *   (e.g. ["x-forwarded-for", "user-agent", "accept-language"])
 * @param {string[]} [config.methods] - HTTP methods to export (default: all 5)
 * @returns {{ GET?: Function, POST?: Function, PUT?: Function, DELETE?: Function, PATCH?: Function }}
 *
 * @example
 * // src/app/api/ledger/[...path]/route.js
 * import { createNextjsProxy } from "@rodrigo-barraza/utilities-library/nextjs";
 *
 * export const { GET, POST, PUT, DELETE, PATCH } = createNextjsProxy({
 *   port: 5603,
 *   serviceName: "ledger",
 *   publicUrlEnv: "LEDGER_SERVICE_PUBLIC_URL",
 *   internalUrlEnv: "LEDGER_SERVICE_URL",
 * });
 *
 * @example
 * // Sessions proxy with identity header forwarding
 * export const { GET, POST } = createNextjsProxy({
 *   port: 5580,
 *   serviceName: "sessions",
 *   publicUrlEnv: "SESSIONS_SERVICE_PUBLIC_URL",
 *   internalUrlEnv: "SESSIONS_SERVICE_URL",
 *   forwardHeaders: ["x-forwarded-for", "x-real-ip", "user-agent", "x-session-id", "accept-language"],
 *   methods: ["GET", "POST"],
 * });
 */
export function createNextjsProxy({
  port,
  serviceName,
  publicUrlEnv,
  internalUrlEnv,
  forwardHeaders = [],
  methods,
}) {
  /**
   * Resolve a config value that may be a literal URL or an env var key name.
   * Keys are identified by not containing "://".
   */
  function resolveEnvValue(valueOrKey) {
    if (!valueOrKey) return undefined;
    if (valueOrKey.includes("://")) return valueOrKey;
    return process.env[valueOrKey] || undefined;
  }

  async function proxyRequest(request, { params }) {
    const { path } = await params;
    const segments = Array.isArray(path) ? path.join("/") : path;

    const url = new URL(request.url);
    const queryString = url.search || "";
    const upstreamBase = resolveUpstream(request, {
      port,
      publicUrlEnv: resolveEnvValue(publicUrlEnv),
      internalUrlEnv: resolveEnvValue(internalUrlEnv),
    });
    const targetUrl = `${upstreamBase}/${segments}${queryString}`;

    try {
      const fetchOptions = {
        method: request.method,
        headers: { "Content-Type": "application/json" },
      };

      // Forward specified request headers to upstream
      for (const name of forwardHeaders) {
        const value = request.headers.get(name);
        if (value) fetchOptions.headers[name] = value;
      }

      if (request.method !== "GET" && request.method !== "HEAD") {
        try {
          const body = await request.json();
          fetchOptions.body = JSON.stringify(body);
        } catch {
          // No body — that's fine for some POSTs
        }
      }

      const response = await fetch(targetUrl, fetchOptions);

      // ── Binary passthrough (ZIP, PDF, images, etc.) ────────
      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");

      if (!isJson) {
        const headers = new Headers();
        for (const key of PASSTHROUGH_HEADERS) {
          const val = response.headers.get(key);
          if (val) headers.set(key, val);
        }
        return new Response(response.body, {
          status: response.status,
          headers,
        });
      }

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      console.error(
        `[API Proxy] ${request.method} /${segments} → ${targetUrl} failed:`,
        error.message,
      );
      return NextResponse.json(
        { error: `Failed to reach ${serviceName} service: ${error.message}` },
        { status: 502 },
      );
    }
  }

  const allMethods = {
    GET: proxyRequest,
    POST: proxyRequest,
    PUT: proxyRequest,
    DELETE: proxyRequest,
    PATCH: proxyRequest,
  };

  // If methods is specified, return only those
  if (methods) {
    const filtered = {};
    for (const m of methods) filtered[m] = proxyRequest;
    return filtered;
  }

  return allMethods;
}
