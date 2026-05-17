// ─────────────────────────────────────────────────────────────
// Express — Route handler wrappers and service health tracking
// ─────────────────────────────────────────────────────────────

import type { Request, Response, NextFunction } from "express";
import type { Logger } from "./logger.js";

export interface AsyncHandlerOptions {
  errorStatus?: number;
  health?: HealthTracker;
}

/**
 * Wrap an async route handler with standard error catching.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
  label: string = "",
  errorStatusOrOpts: number | AsyncHandlerOptions = 502,
) {
  const errorStatus =
    typeof errorStatusOrOpts === "number"
      ? errorStatusOrOpts
      : errorStatusOrOpts.errorStatus || 502;
  const health =
    typeof errorStatusOrOpts === "object"
      ? errorStatusOrOpts.health
      : undefined;
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await fn(req, res, next);
      if (health) health.markSuccess();
      if (result !== undefined && !res.headersSent) res.json(result);
    } catch (error: unknown) {
      if (health) health.markError(error);

      const err = error as Error & { status?: number };
      if (next) {
        if (!err.status) err.status = errorStatus;
        return next(err);
      }

      const fallbackMessage = label ? `${label} failed` : "Internal server error";
      console.error(`[asyncHandler] ${fallbackMessage}:`, err.message || err);
      res.status(err.status || errorStatus).json({
        error: true,
        message: err.message || fallbackMessage,
        statusCode: err.status || errorStatus,
      });
    }
  };
}

/**
 * Reusable health-state tracker for route domains.
 */
export class HealthTracker {
  #state = { lastChecked: null as Date | null, error: null as string | null };

  getHealth() {
    return { ...this.#state };
  }

  markSuccess() {
    this.#state.lastChecked = new Date();
    this.#state.error = null;
  }

  markError(err: unknown) {
    this.#state.error = typeof err === "string" ? err : (err as Error).message;
  }
}

/**
 * Set up a Server-Sent Events response with proper headers.
 */
export function setupStreamingSSE(res: Response): (event: unknown) => void {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  const send = (event: unknown) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };
  return send;
}

/**
 * Reusable OAuth2 client-credentials token manager with caching.
 */
export class TokenManager {
  #token: string | null = null;
  #expiry = 0;
  #fetchFn: () => Promise<{ token: string; expiresInMs: number }>;

  constructor(fetchFn: () => Promise<{ token: string; expiresInMs: number }>) {
    this.#fetchFn = fetchFn;
  }

  async getToken(): Promise<string> {
    if (this.#token && Date.now() < this.#expiry) return this.#token;
    const { token, expiresInMs } = await this.#fetchFn();
    this.#token = token;
    this.#expiry = Date.now() + expiresInMs;
    return this.#token;
  }

  invalidate() {
    this.#token = null;
    this.#expiry = 0;
  }
}

/**
 * Create a lazy-loading async getter for an ES module.
 */
export function lazyImport<T>(specifier: string, extract: (m: Record<string, unknown>) => T = (m) => m.default as T): () => Promise<T> {
  let cached: T;
  return async () => {
    if (!cached) cached = extract(await import(specifier));
    return cached;
  };
}

/**
 * Create an HTTP error with a status code.
 */
export function httpError(status: number, message: string): Error & { status: number } {
  const httpErr = new Error(message) as Error & { status: number };
  httpErr.status = status;
  return httpErr;
}

/**
 * Standard request logger middleware.
 */
export function createRequestLoggerMiddleware(logger: Logger) {
  return function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    const originalEnd = res.end;
    let size = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (res as any).end = function (chunk?: any, encoding?: any, cb?: any) {
      if (chunk) size += Buffer.byteLength(chunk);
      const timing = `${Date.now() - start}ms`;
      const sizeTag = size > 1024
        ? `${(size / 1024).toFixed(1)}KB`
        : `${size}B`;

      logger.request(req.method, req.originalUrl || req.url, res.statusCode, timing, sizeTag);

      return originalEnd.call(res, chunk, encoding, cb);
    };

    next();
  };
}
