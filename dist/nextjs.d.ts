export declare const PRIVATE_HOST_REGEXP: RegExp;
export declare function isPrivateHost(request: Request): boolean;
export interface AuthMiddlewareConfig {
    auth: (request: Request) => Response | Promise<Response>;
    authEnabled: boolean;
}
export declare function createAuthMiddleware({ auth, authEnabled }: AuthMiddlewareConfig): (request: Request) => Promise<Response>;
export interface NextjsProxyConfig {
    port: number;
    serviceName: string;
    publicUrlEnvironmentVariable?: string;
    internalUrlEnvironmentVariable?: string;
    forwardHeaders?: string[];
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
export declare function createNextjsProxy({ port, serviceName, publicUrlEnvironmentVariable, internalUrlEnvironmentVariable, forwardHeaders, methods, }: NextjsProxyConfig): ProxyRouteHandlers;
export {};
//# sourceMappingURL=nextjs.d.ts.map