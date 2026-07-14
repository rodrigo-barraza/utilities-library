import { AsyncLocalStorage } from "node:async_hooks";
export { IDENTITY_HEADERS, AUTH_HEADERS } from "../taxonomy/index.js";
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
export declare const requestLocalStorage: AsyncLocalStorage<RequestStore>;
/**
 * Trace headers for outbound calls made while serving a request, so a
 * call can be correlated across service hops. Returns an empty object
 * outside a request context.
 */
export declare function getTraceHeaders(store?: RequestStore | undefined): Record<string, string>;
//# sourceMappingURL=TraceContext.d.ts.map