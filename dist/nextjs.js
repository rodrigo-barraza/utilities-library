// @ts-nocheck
// ─────────────────────────────────────────────────────────────
// Next.js — Shared server-side utilities for Next.js App Router
// ─────────────────────────────────────────────────────────────
// NOTE: This module imports from "next/server" — consumers must have
// "next" installed as a dependency. The import is left untyped here
// to avoid requiring next as a dependency of utilities-library itself.
// Static import — required for edge runtime compatibility.
// Dynamic import(/* webpackIgnore: true */) causes
// ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING in the edge VM.
import { NextResponse } from "next/server";
function getNextResponse() {
    return NextResponse;
}
// ── Private Network Detection ───────────────────────────────
export const PRIVATE_HOST_RE = /^(localhost|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+|\[::1\])(:\d+)?$/;
export function isPrivateHost(request) {
    const host = request.headers.get("host") || "";
    return PRIVATE_HOST_RE.test(host);
}
export function createAuthMiddleware({ auth, authEnabled }) {
    return async function middleware(request) {
        if (!authEnabled || isPrivateHost(request)) {
            const NR = await getNextResponse();
            return NR.next();
        }
        return auth(request);
    };
}
// ── Passthrough Headers ─────────────────────────────────────
const PASSTHROUGH_HEADERS = ["content-type", "content-disposition", "content-length"];
function resolveUpstream(request, { port, publicUrlEnv, internalUrlEnv }) {
    if (publicUrlEnv)
        return publicUrlEnv;
    if (internalUrlEnv &&
        !internalUrlEnv.includes("localhost") &&
        !internalUrlEnv.includes("127.0.0.1")) {
        return internalUrlEnv;
    }
    const host = request.headers.get("host");
    if (host) {
        const hostname = host.split(":")[0];
        const protocol = request.headers.get("x-forwarded-proto") || "http";
        return `${protocol}://${hostname}:${port}`;
    }
    return internalUrlEnv || `http://localhost:${port}`;
}
export function createNextjsProxy({ port, serviceName, publicUrlEnv, internalUrlEnv, forwardHeaders = [], methods, }) {
    function resolveEnvValue(valueOrKey) {
        if (!valueOrKey)
            return undefined;
        if (valueOrKey.includes("://"))
            return valueOrKey;
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
            for (const name of forwardHeaders) {
                const value = request.headers.get(name);
                if (value)
                    fetchOptions.headers[name] = value;
            }
            if (request.method !== "GET" && request.method !== "HEAD") {
                try {
                    const body = await request.json();
                    fetchOptions.body = JSON.stringify(body);
                }
                catch {
                    // No body — fine for some POSTs
                }
            }
            const response = await globalThis.fetch(targetUrl, fetchOptions);
            const contentType = response.headers.get("content-type") || "";
            const isJson = contentType.includes("application/json");
            if (!isJson) {
                const headers = new Headers();
                for (const key of PASSTHROUGH_HEADERS) {
                    const val = response.headers.get(key);
                    if (val)
                        headers.set(key, val);
                }
                return new Response(response.body, {
                    status: response.status,
                    headers,
                });
            }
            const data = await response.json();
            const NR = await getNextResponse();
            return NR.json(data, { status: response.status });
        }
        catch (error) {
            console.error(`[API Proxy] ${request.method} /${segments} → ${targetUrl} failed:`, error.message);
            const NR = await getNextResponse();
            return NR.json({ error: `Failed to reach ${serviceName} service: ${error.message}` }, { status: 502 });
        }
    }
    const allMethods = {
        GET: proxyRequest,
        POST: proxyRequest,
        PUT: proxyRequest,
        DELETE: proxyRequest,
        PATCH: proxyRequest,
    };
    if (methods) {
        const filtered = {};
        for (const m of methods)
            filtered[m] = proxyRequest;
        return filtered;
    }
    return allMethods;
}
//# sourceMappingURL=nextjs.js.map