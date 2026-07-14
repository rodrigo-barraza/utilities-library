/** Canonical cross-service identity and trace header names. */
export declare const IDENTITY_HEADERS: {
    readonly project: "x-project";
    readonly username: "x-username";
    readonly agent: "x-agent";
    readonly workspaceId: "x-workspace-id";
    readonly workspaceRoot: "x-workspace-root";
    readonly workspaceOverride: "x-workspace-override";
    readonly requestId: "x-request-id";
    readonly conversationId: "x-conversation-id";
    readonly iteration: "x-iteration";
    readonly forwardedFor: "x-forwarded-for";
};
export type IdentityHeaderKey = keyof typeof IDENTITY_HEADERS;
export type IdentityHeaderName = (typeof IDENTITY_HEADERS)[IdentityHeaderKey];
/** Canonical shared-secret / API-auth header names. */
export declare const AUTH_HEADERS: {
    readonly apiSecret: "x-api-secret";
    readonly adminSecret: "x-admin-secret";
    readonly apiKey: "x-api-key";
};
export type AuthHeaderKey = keyof typeof AUTH_HEADERS;
export type AuthHeaderName = (typeof AUTH_HEADERS)[AuthHeaderKey];
/**
 * Standard request headers browsers may send to our services, used to
 * build the CORS `Access-Control-Allow-Headers` value. Derived from the
 * identity + auth header maps so adding a header there automatically
 * widens CORS — the two can never drift apart.
 */
export declare const CORS_ALLOWED_HEADERS: readonly string[];
/** Comma-separated form for the `Access-Control-Allow-Headers` response header. */
export declare const CORS_ALLOWED_HEADERS_STRING: string;
//# sourceMappingURL=headers.d.ts.map