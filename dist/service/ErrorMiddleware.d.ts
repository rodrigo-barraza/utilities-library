import type { Request, Response, NextFunction } from "express";
import type { LoggerLike } from "./GracefulShutdown.js";
/**
 * Base class for errors that carry an HTTP status and a JSON body.
 * Extend it (e.g. a provider-specific error) and override `toJSON()`
 * to add fields to the response envelope.
 */
export declare class HttpError extends Error {
    readonly statusCode: number;
    readonly details?: unknown;
    constructor(message: string, statusCode?: number, details?: unknown);
    toJSON(): Record<string, unknown>;
}
export interface ErrorHandlerOptions {
    logger?: LoggerLike;
    /** Include `error.stack` in logs (default true). */
    logStack?: boolean;
}
/**
 * Build the terminal Express error handler. Mount it LAST, after all routes.
 */
export declare function createErrorHandler(options?: ErrorHandlerOptions): (error: unknown, _req: Request, res: Response, _next: NextFunction) => void;
/**
 * 404 handler for unmatched routes. Mount it after all routes but
 * before the error handler.
 */
export declare function notFoundHandler(req: Request, res: Response): void;
//# sourceMappingURL=ErrorMiddleware.d.ts.map