import { NextResponse } from "next/server";
export declare const PRIVATE_HOST_REGEXP: RegExp;
export declare function isPrivateHost(request: Request): boolean;
export interface AuthMiddlewareConfig {
    auth: (request: Request) => Response | Promise<Response>;
    authEnabled: boolean;
}
export declare function createAuthMiddleware({ auth, authEnabled }: AuthMiddlewareConfig): (request: Request) => Promise<NextResponse>;
export interface NextjsProxyConfig {
    /** Dev-fallback port. Defaults to the SERVICE_PORTS registry entry for serviceName. */
    port?: number;
    serviceName: string;
    publicUrlEnvironmentVariable?: string;
    internalUrlEnvironmentVariable?: string;
    forwardHeaders?: string[];
    /**
     * Headers to add server-side (shared secrets, resolved identity) that do
     * NOT exist on the incoming request. Evaluated per request; undefined
     * values are skipped. Applied after forwardHeaders, so injected values win.
     */
    injectHeaders?: () => Record<string, string | undefined> | Promise<Record<string, string | undefined>>;
    methods?: string[];
}
type RouteHandler = (request: Request, context: {
    params: Promise<{
        path: string | string[];
    }>;
}) => Promise<Response>;
export interface ProxyRouteHandlers {
    GET?: RouteHandler;
    POST?: RouteHandler;
    PUT?: RouteHandler;
    DELETE?: RouteHandler;
    PATCH?: RouteHandler;
    [method: string]: RouteHandler | undefined;
}
export declare function createNextjsProxy({ port, serviceName, publicUrlEnvironmentVariable, internalUrlEnvironmentVariable, forwardHeaders, injectHeaders, methods, }: NextjsProxyConfig): ProxyRouteHandlers;
export {};
//# sourceMappingURL=nextjs.d.ts.map