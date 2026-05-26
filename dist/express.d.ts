import type { Request, Response, NextFunction } from "express";
import type { Logger } from "./logger.js";
export interface AsyncHandlerOptions {
    errorStatus?: number;
    health?: HealthTracker;
}
/**
 * Wrap an async route handler with standard error catching.
 */
export declare function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>, label?: string, errorStatusOrOpts?: number | AsyncHandlerOptions): (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Reusable health-state tracker for route domains.
 */
export declare class HealthTracker {
    #private;
    getHealth(): {
        lastChecked: Date | null;
        error: string | null;
    };
    markSuccess(): void;
    markError(error: unknown): void;
}
/**
 * Set up a Server-Sent Events response with proper headers.
 */
export declare function setupStreamingSSE(res: Response): (event: unknown) => void;
/**
 * Reusable OAuth2 client-credentials token manager with caching.
 */
export declare class TokenManager {
    #private;
    constructor(fetchFn: () => Promise<{
        token: string;
        expiresInMs: number;
    }>);
    getToken(): Promise<string>;
    invalidate(): void;
}
/**
 * Create a lazy-loading async getter for an ES module.
 */
export declare function lazyImport<ImportedModule>(specifier: string, extract?: (moduleObject: Record<string, unknown>) => ImportedModule): () => Promise<ImportedModule>;
/**
 * Create an HTTP error with a status code.
 */
export declare function httpError(status: number, message: string): Error & {
    status: number;
};
/**
 * Standard request logger middleware.
 */
export declare function createRequestLoggerMiddleware(logger: Logger): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=express.d.ts.map