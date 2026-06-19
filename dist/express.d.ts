import type { Request, Response, NextFunction } from "express";
import type { Logger } from "./logger.js";
export interface AsyncHandlerOptions {
    errorStatus?: number;
    health?: HealthTracker;
}
export declare function asyncHandler(handlerFunction: (req: Request, res: Response, next: NextFunction) => Promise<unknown>, label?: string, errorStatusOrOptions?: number | AsyncHandlerOptions): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare class HealthTracker {
    #private;
    getHealth(): {
        lastChecked: Date | null;
        error: string | null;
    };
    markSuccess(): void;
    markError(error: unknown): void;
}
export declare function setupStreamingServerSentEvents(res: Response): (event: unknown) => void;
export declare class TokenManager {
    #private;
    constructor(fetchTokenFunction: () => Promise<{
        token: string;
        expiresInMilliseconds: number;
    }>);
    getToken(): Promise<string>;
    invalidate(): void;
}
export interface ModuleNamespace {
    default?: unknown;
    [key: string]: unknown;
}
export declare function lazyImport<ImportedModule>(specifier: string, extract?: (moduleObject: ModuleNamespace) => ImportedModule): () => Promise<ImportedModule>;
export declare class HttpError extends Error {
    status: number;
    constructor(status: number, message: string);
}
export declare function httpError(status: number, message: string): HttpError;
export declare function createRequestLoggerMiddleware(logger: Logger): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=express.d.ts.map