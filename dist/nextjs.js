// ─────────────────────────────────────────────────────────────
// Next.js — Shared server-side utilities for Next.js App Router
// ─────────────────────────────────────────────────────────────
// Static import required for edge runtime compatibility —
// dynamic import(/* webpackIgnore: true */) causes
// ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING in the edge VM.
import { NextResponse } from "next/server";
import { getErrorMessage } from "./errors.js";
import { getEnvironmentVariable } from "./environment.js";
import { getServicePort } from "./taxonomy/services.js";
function getNextResponse() {
    return NextResponse;
}
// ── Private Network Detection ───────────────────────────────
export const PRIVATE_HOST_REGEXP = /^(localhost|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+|\[::1\])(:\d+)?$/;
export function isPrivateHost(request) {
    const host = request.headers.get("host") || "";
    return PRIVATE_HOST_REGEXP.test(host);
}
export function createAuthMiddleware({ auth, authEnabled }) {
    return async function middleware(request) {
        if (!authEnabled || isPrivateHost(request)) {
            const nextResponse = await getNextResponse();
            return nextResponse.next();
        }
        return auth(request);
    };
}
// ── Passthrough Headers ─────────────────────────────────────
const PASSTHROUGH_HEADERS = ["content-type", "content-disposition", "content-length"];
function resolveUpstream(request, { port, publicUrlEnvironmentVariable, internalUrlEnvironmentVariable }) {
    // INTERNAL FIRST: this resolver runs SERVER-SIDE (Next.js route handlers
    // proxying to a sibling service). From inside a container on the LAN, the
    // public URL is often unreachable — Docker DNS may not resolve public
    // hostnames and home routers rarely hairpin NAT to their own WAN IP — so
    // preferring it caused silent 502s on every proxied call. The public URL
    // is the fallback for deployments where no internal route exists.
    if (internalUrlEnvironmentVariable &&
        !internalUrlEnvironmentVariable.includes("localhost") &&
        !internalUrlEnvironmentVariable.includes("127.0.0.1")) {
        return internalUrlEnvironmentVariable;
    }
    if (publicUrlEnvironmentVariable)
        return publicUrlEnvironmentVariable;
    const host = request.headers.get("host");
    if (host) {
        const hostname = host.split(":")[0];
        const protocol = request.headers.get("x-forwarded-proto") || "http";
        return `${protocol}://${hostname}:${port}`;
    }
    return internalUrlEnvironmentVariable || `http://localhost:${port}`;
}
export function createNextjsProxy({ port, serviceName, publicUrlEnvironmentVariable, internalUrlEnvironmentVariable, forwardHeaders = [], injectHeaders, methods, }) {
    const registryPort = port ?? getServicePort(serviceName);
    if (registryPort === undefined) {
        throw new Error(`createNextjsProxy: no port given and "${serviceName}" is not in the SERVICE_PORTS registry`);
    }
    const resolvedPort = registryPort;
    function resolveEnvValue(valueOrKey) {
        if (!valueOrKey)
            return undefined;
        if (valueOrKey.includes("://"))
            return valueOrKey;
        return getEnvironmentVariable(valueOrKey) || undefined;
    }
    async function proxyRequest(request, { params }) {
        const { path } = await params;
        const segments = Array.isArray(path) ? path.join("/") : path;
        const url = new URL(request.url);
        const queryString = url.search || "";
        const upstreamBase = resolveUpstream(request, {
            port: resolvedPort,
            publicUrlEnvironmentVariable: resolveEnvValue(publicUrlEnvironmentVariable),
            internalUrlEnvironmentVariable: resolveEnvValue(internalUrlEnvironmentVariable),
        });
        const targetUrl = `${upstreamBase}/${segments}${queryString}`;
        try {
            const headersRecord = { "Content-Type": "application/json" };
            for (const name of forwardHeaders) {
                const value = request.headers.get(name);
                if (value) {
                    headersRecord[name] = value;
                }
            }
            if (injectHeaders) {
                const injected = await injectHeaders();
                for (const [name, value] of Object.entries(injected)) {
                    if (value !== undefined)
                        headersRecord[name] = value;
                }
            }
            const fetchOptions = {
                method: request.method,
                headers: headersRecord,
            };
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
            const isJsonResponse = contentType.includes("application/json");
            if (!isJsonResponse) {
                const headers = new Headers();
                for (const key of PASSTHROUGH_HEADERS) {
                    const value = response.headers.get(key);
                    if (value)
                        headers.set(key, value);
                }
                return new Response(response.body, {
                    status: response.status,
                    headers,
                });
            }
            const data = await response.json();
            const nextResponse = await getNextResponse();
            return nextResponse.json(data, { status: response.status });
        }
        catch (error) {
            console.error(`[API Proxy] ${request.method} /${segments} → ${targetUrl} failed:`, getErrorMessage(error));
            const nextResponse = await getNextResponse();
            return nextResponse.json({ error: `Failed to reach ${serviceName} service: ${getErrorMessage(error)}` }, { status: 502 });
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
        for (const method of methods)
            filtered[method] = proxyRequest;
        return filtered;
    }
    return allMethods;
}
//# sourceMappingURL=nextjs.js.map