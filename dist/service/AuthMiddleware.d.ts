import type { Request, Response, NextFunction } from "express";
/** Everything the middleware resolves from an incoming request. */
export interface ResolvedIdentity {
    project: string;
    username: string;
    clientIp: string;
    agent: string | null;
    workspaceId: string | null;
    workspaceRoot: string | null;
    workspaceOverride: string | null;
    requestId: string | null;
    conversationId: string | null;
    iteration: string | null;
}
export interface AuthMiddlewareOptions {
    defaultProject?: string;
    defaultUsername?: string;
    /**
     * Run downstream handlers inside the shared requestLocalStorage so
     * getTraceHeaders() works for outbound calls made during the request.
     */
    traceContext?: boolean;
    /** Hook invoked after identity resolution (e.g. sync a service-local store). */
    onResolved?: (identity: ResolvedIdentity, req: Request) => void;
}
/**
 * Create an identity-resolution middleware.
 * Resolves project, username, clientIp, workspace scoping, and trace ids
 * from request headers and attaches them to `req`.
 */
export declare function createAuthMiddleware(options?: AuthMiddlewareOptions): (req: Request, _res: Response, next: NextFunction) => void;
export interface SecretGuardOptions {
    header?: string;
    bypassPaths?: string[];
}
/**
 * Create a secret-guard middleware.
 * Rejects requests that don't include the correct secret in the specified header.
 */
export declare function createSecretGuard(secret: string, options?: SecretGuardOptions): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=AuthMiddleware.d.ts.map