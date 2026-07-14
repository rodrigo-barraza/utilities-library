// ─────────────────────────────────────────────────────────────
// Headers — Canonical cross-service HTTP header names
// ─────────────────────────────────────────────────────────────
// Single source of truth for the x-* header names that carry
// identity/trace context and shared-secret auth between services.
// Isomorphic (plain strings) so both clients and services import
// the SAME names — a rename here updates every consumer, and the
// CORS allow-list is derived from it so headers can never drift
// out of the allow-list.
//
// service-library/TraceContext.ts re-exports IDENTITY_HEADERS from
// here (keeping the Node-only AsyncLocalStorage plumbing local).
// ─────────────────────────────────────────────────────────────
/** Canonical cross-service identity and trace header names. */
export const IDENTITY_HEADERS = {
    project: "x-project",
    username: "x-username",
    agent: "x-agent",
    workspaceId: "x-workspace-id",
    workspaceRoot: "x-workspace-root",
    workspaceOverride: "x-workspace-override",
    requestId: "x-request-id",
    conversationId: "x-conversation-id",
    iteration: "x-iteration",
    forwardedFor: "x-forwarded-for",
};
/** Canonical shared-secret / API-auth header names. */
export const AUTH_HEADERS = {
    apiSecret: "x-api-secret",
    adminSecret: "x-admin-secret",
    apiKey: "x-api-key",
};
/**
 * Standard request headers browsers may send to our services, used to
 * build the CORS `Access-Control-Allow-Headers` value. Derived from the
 * identity + auth header maps so adding a header there automatically
 * widens CORS — the two can never drift apart.
 */
export const CORS_ALLOWED_HEADERS = [
    "Content-Type",
    "Authorization",
    ...Object.values(AUTH_HEADERS),
    ...Object.values(IDENTITY_HEADERS),
];
/** Comma-separated form for the `Access-Control-Allow-Headers` response header. */
export const CORS_ALLOWED_HEADERS_STRING = CORS_ALLOWED_HEADERS.join(", ");
//# sourceMappingURL=headers.js.map