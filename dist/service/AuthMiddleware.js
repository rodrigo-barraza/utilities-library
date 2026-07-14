// ─────────────────────────────────────────────────────────────
// AuthMiddleware — Configurable identity resolution + secret guard
// ─────────────────────────────────────────────────────────────
import { IDENTITY_HEADERS, requestLocalStorage } from "./TraceContext.js";
/**
 * Create an identity-resolution middleware.
 * Resolves project, username, clientIp, workspace scoping, and trace ids
 * from request headers and attaches them to `req`.
 */
export function createAuthMiddleware(options = {}) {
    const defaultProject = options.defaultProject || "default";
    const defaultUsername = options.defaultUsername || "anonymous";
    return function authMiddleware(req, _res, next) {
        const typedRequest = req;
        const header = (name) => req.headers[name] || null;
        // Project: query param → body → header → default
        const project = req.query?.project ||
            req.body?.project ||
            header(IDENTITY_HEADERS.project) ||
            defaultProject;
        // Client IP: x-forwarded-for → req.ip, normalize IPv4-mapped IPv6
        const forwarded = req.headers[IDENTITY_HEADERS.forwardedFor];
        const rawIp = (typeof forwarded === "string" ? forwarded.split(",")[0]?.trim() : undefined) || req.ip;
        const clientIp = rawIp?.replace(/^::ffff:/, "") || rawIp || "";
        const identity = {
            project,
            clientIp,
            // Username from header (never fall back to IP — IPs in object keys
            // cause path duplication once the same user sends a real username)
            username: header(IDENTITY_HEADERS.username) || defaultUsername,
            agent: header(IDENTITY_HEADERS.agent),
            // Optional workspace scoping
            workspaceId: header(IDENTITY_HEADERS.workspaceId),
            workspaceRoot: header(IDENTITY_HEADERS.workspaceRoot),
            workspaceOverride: header(IDENTITY_HEADERS.workspaceOverride),
            // Trace ids for cross-service correlation
            requestId: header(IDENTITY_HEADERS.requestId),
            conversationId: header(IDENTITY_HEADERS.conversationId),
            iteration: header(IDENTITY_HEADERS.iteration),
        };
        Object.assign(typedRequest, identity);
        options.onResolved?.(identity, req);
        if (options.traceContext) {
            const store = { ...identity };
            requestLocalStorage.run(store, () => next());
            return;
        }
        next();
    };
}
/**
 * Create a secret-guard middleware.
 * Rejects requests that don't include the correct secret in the specified header.
 */
export function createSecretGuard(secret, options = {}) {
    const header = options.header || "x-api-secret";
    const bypassPaths = new Set(options.bypassPaths || ["/health"]);
    return function secretGuard(req, res, next) {
        if (bypassPaths.has(req.path))
            return next();
        if (req.method === "OPTIONS")
            return next();
        const provided = req.headers[header];
        if (!secret || provided === secret)
            return next();
        res.status(401).json({ error: "Unauthorized" });
    };
}
//# sourceMappingURL=AuthMiddleware.js.map