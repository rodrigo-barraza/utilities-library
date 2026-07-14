// ─────────────────────────────────────────────────────────────
// ErrorMiddleware — Shared Express error + 404 handlers
// ─────────────────────────────────────────────────────────────
// Single source of truth for the JSON error envelope that every
// service previously hand-rolled. Handles:
//   • HttpError (and subclasses) — uses its statusCode + toJSON()
//   • plain errors carrying `status`/`statusCode`
//   • everything else → 500
// ─────────────────────────────────────────────────────────────

import type { Request, Response, NextFunction } from "express";
import type { LoggerLike } from "./GracefulShutdown.ts";

/**
 * Base class for errors that carry an HTTP status and a JSON body.
 * Extend it (e.g. a provider-specific error) and override `toJSON()`
 * to add fields to the response envelope.
 */
export class HttpError extends Error {
  readonly statusCode: number;
  readonly details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.details = details;
  }

  toJSON(): Record<string, unknown> {
    return {
      error: true,
      message: this.message,
      statusCode: this.statusCode,
      ...(this.details !== undefined ? { details: this.details } : {}),
    };
  }
}

/** Resolve a status code from the various shapes services throw. */
function resolveStatus(error: unknown): number {
  const candidate = error as { statusCode?: unknown; status?: unknown } | null;
  const raw = candidate?.statusCode ?? candidate?.status;
  return typeof raw === "number" && raw >= 400 && raw <= 599 ? raw : 500;
}

export interface ErrorHandlerOptions {
  logger?: LoggerLike;
  /** Include `error.stack` in logs (default true). */
  logStack?: boolean;
}

/**
 * Build the terminal Express error handler. Mount it LAST, after all routes.
 */
export function createErrorHandler(options: ErrorHandlerOptions = {}) {
  const logger: LoggerLike = options.logger || console;
  const logStack = options.logStack !== false;

  return function errorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
  ): void {
    const status = resolveStatus(error);
    const err = error as Error;
    const logError = logger.error ?? logger.log ?? console.error;
    logError(`Unhandled error: ${err?.message ?? String(error)}`);
    if (logStack && err?.stack) logError(err.stack);

    if (error instanceof HttpError) {
      res.status(status).json(error.toJSON());
      return;
    }

    // Honour a custom toJSON() on error-like objects (e.g. ProviderError).
    const maybeJson = error as { toJSON?: () => unknown };
    if (typeof maybeJson?.toJSON === "function") {
      res.status(status).json(maybeJson.toJSON());
      return;
    }

    res.status(status).json({
      error: true,
      message: err?.message || "Internal server error",
      statusCode: status,
    });
  };
}

/**
 * 404 handler for unmatched routes. Mount it after all routes but
 * before the error handler.
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: true,
    message: `Not found: ${req.method} ${req.path}`,
    statusCode: 404,
  });
}
