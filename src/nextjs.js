// ─────────────────────────────────────────────────────────────
// Next.js — Shared server-side utilities for Next.js App Router
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";

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
 * @param {string} [config.publicUrlEnv] - process.env value for public URL
 * @param {string} [config.internalUrlEnv] - process.env value for internal URL
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
 *
 * @param {object} config
 * @param {number} config.port - Service port
 * @param {string} config.serviceName - Human-readable name for error messages
 * @param {string} [config.publicUrlEnv] - process.env value for public URL
 * @param {string} [config.internalUrlEnv] - process.env value for internal URL
 * @returns {{ GET: Function, POST: Function, PUT: Function, DELETE: Function, PATCH: Function }}
 *
 * @example
 * // src/app/api/ledger/[...path]/route.js
 * import { createNextjsProxy } from "@rodrigo-barraza/utilities-library/nextjs";
 *
 * export const { GET, POST, PUT, DELETE, PATCH } = createNextjsProxy({
 *   port: 5603,
 *   serviceName: "ledger",
 *   publicUrlEnv: process.env.LEDGER_SERVICE_PUBLIC_URL,
 *   internalUrlEnv: process.env.LEDGER_SERVICE_URL,
 * });
 */
export function createNextjsProxy({
  port,
  serviceName,
  publicUrlEnv,
  internalUrlEnv,
}) {
  async function proxyRequest(request, { params }) {
    const { path } = await params;
    const segments = Array.isArray(path) ? path.join("/") : path;

    const url = new URL(request.url);
    const queryString = url.search || "";
    const upstreamBase = resolveUpstream(request, {
      port,
      publicUrlEnv,
      internalUrlEnv,
    });
    const targetUrl = `${upstreamBase}/${segments}${queryString}`;

    try {
      const fetchOptions = {
        method: request.method,
        headers: { "Content-Type": "application/json" },
      };

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

  return {
    GET: proxyRequest,
    POST: proxyRequest,
    PUT: proxyRequest,
    DELETE: proxyRequest,
    PATCH: proxyRequest,
  };
}
