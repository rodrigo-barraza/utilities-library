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
} as const;

export type IdentityHeaderKey = keyof typeof IDENTITY_HEADERS;
export type IdentityHeaderName = (typeof IDENTITY_HEADERS)[IdentityHeaderKey];

/** Canonical shared-secret / API-auth header names. */
export const AUTH_HEADERS = {
  apiSecret: "x-api-secret",
  adminSecret: "x-admin-secret",
  apiKey: "x-api-key",
} as const;

export type AuthHeaderKey = keyof typeof AUTH_HEADERS;
export type AuthHeaderName = (typeof AUTH_HEADERS)[AuthHeaderKey];

/**
 * Standard request headers browsers may send to our services, used to
 * build the CORS `Access-Control-Allow-Headers` value. Derived from the
 * identity + auth header maps so adding a header there automatically
 * widens CORS — the two can never drift apart.
 */
export const CORS_ALLOWED_HEADERS: readonly string[] = [
  "Content-Type",
  "Authorization",
  ...Object.values(AUTH_HEADERS),
  ...Object.values(IDENTITY_HEADERS),
];

/** Comma-separated form for the `Access-Control-Allow-Headers` response header. */
export const CORS_ALLOWED_HEADERS_STRING: string = CORS_ALLOWED_HEADERS.join(", ");
