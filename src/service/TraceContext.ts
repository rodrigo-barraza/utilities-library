// ─────────────────────────────────────────────────────────────
// TraceContext — Canonical identity/trace headers + request store
// ─────────────────────────────────────────────────────────────
// Single source of truth for the x-* header names that carry
// identity and trace context between services, plus the shared
// AsyncLocalStorage used to propagate them through async calls.
// ─────────────────────────────────────────────────────────────

import { AsyncLocalStorage } from "node:async_hooks";

// Canonical header names live in the isomorphic taxonomy so clients and
// services share ONE source of truth. Re-exported here for backend callers
// that already import { IDENTITY_HEADERS } from the service-library.
export { IDENTITY_HEADERS, AUTH_HEADERS } from "../taxonomy/index.ts";
import { IDENTITY_HEADERS } from "../taxonomy/index.ts";

export interface RequestStore {
  project?: string | null;
  username?: string | null;
  clientIp?: string | null;
  workspaceId?: string | null;
  workspaceRoot?: string | null;
  workspaceOverride?: string | null;
  requestId?: string | null;
  conversationId?: string | null;
  iteration?: string | null;
}

/** Shared AsyncLocalStorage holding the current request's identity/trace values. */
export const requestLocalStorage = new AsyncLocalStorage<RequestStore>();

/**
 * Trace headers for outbound calls made while serving a request, so a
 * call can be correlated across service hops. Returns an empty object
 * outside a request context.
 */
export function getTraceHeaders(
  store: RequestStore | undefined = requestLocalStorage.getStore(),
): Record<string, string> {
  if (!store) return {};
  const headers: Record<string, string> = {};
  if (store.requestId) headers[IDENTITY_HEADERS.requestId] = store.requestId;
  if (store.conversationId) headers[IDENTITY_HEADERS.conversationId] = store.conversationId;
  if (store.iteration) headers[IDENTITY_HEADERS.iteration] = store.iteration;
  if (store.project) headers[IDENTITY_HEADERS.project] = store.project;
  if (store.username) headers[IDENTITY_HEADERS.username] = store.username;
  return headers;
}
