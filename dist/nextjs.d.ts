export declare const PRIVATE_HOST_RE: RegExp;
export declare function isPrivateHost(request: Request): boolean;
export interface AuthMiddlewareConfig {
    auth: (request: Request) => Response | Promise<Response>;
    authEnabled: boolean;
}
export declare function createAuthMiddleware({ auth, authEnabled }: AuthMiddlewareConfig): (request: Request) => Promise<any>;
export interface NextjsProxyConfig {
    port: number;
    serviceName: string;
    publicUrlEnv?: string;
    internalUrlEnv?: string;
    forwardHeaders?: string[];
    methods?: string[];
}
type RouteHandler = (request: Request, context: {
    params: Promise<{
        path: string | string[];
    }>;
}) => Promise<Response>;
export declare function createNextjsProxy({ port, serviceName, publicUrlEnv, internalUrlEnv, forwardHeaders, methods, }: NextjsProxyConfig): Record<string, RouteHandler>;
export {};
//# sourceMappingURL=nextjs.d.ts.map