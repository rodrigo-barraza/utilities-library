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
/**
 * Configure an Express response for SSE streaming: required headers
 * (including X-Accel-Buffering for nginx) flushed immediately.
 */
export declare function initSseResponse(res: Response): void;
export interface SseEmitterOptions {
    /** Stop writing once this signal aborts (e.g. client disconnect). */
    signal?: AbortSignal;
}
/**
 * Create an emit callback that writes `data: <json>\n\n` frames with
 * guarded writes (no writes after abort/close) and force-flushing.
 * Disables Nagle's algorithm so small frames aren't buffered while the
 * server awaits; cork/uncork guarantees flushes without compression
 * middleware's res.flush().
 */
export declare function createSseEmitter(res: Response, { signal }?: SseEmitterOptions): (event: unknown) => void;
export interface SseHeartbeatOptions {
    intervalMilliseconds?: number;
    signal?: AbortSignal;
}
/**
 * Emit `: ping` SSE comment frames on an interval so clients can tell a
 * quiet-but-alive stream from a dead socket. Comment frames are invisible
 * to `data:`-line parsers. Returns a stop function — always call it when
 * the stream ends.
 */
export declare function startSseHeartbeat(res: Response, { intervalMilliseconds, signal }?: SseHeartbeatOptions): () => void;
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