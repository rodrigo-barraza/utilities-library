// ─────────────────────────────────────────────────────────────
// Express — Route handler wrappers and service health tracking
// ─────────────────────────────────────────────────────────────

import type { Request, Response, NextFunction } from "express";
import type { Logger } from "./logger.js";
import { errorMessage } from "./errors.js";

export interface AsyncHandlerOptions {
  errorStatus?: number;
  health?: HealthTracker;
}

/**
 * Wrap an async route handler with standard error catching.
 */
export function asyncHandler(
  handlerFunction: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
  label: string = "",
  errorStatusOrOptions: number | AsyncHandlerOptions = 502,
) {
  const errorStatus =
    typeof errorStatusOrOptions === "number"
      ? errorStatusOrOptions
      : errorStatusOrOptions.errorStatus || 502;
  const health =
    typeof errorStatusOrOptions === "object"
      ? errorStatusOrOptions.health
      : undefined;
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await handlerFunction(req, res, next);
      if (health) health.markSuccess();
      if (result !== undefined && !res.headersSent) res.json(result);
    } catch (error: unknown) {
      if (health) health.markError(error);

      let errorStatusToUse = errorStatus;
      let errorMessageString = label ? `${label} failed` : "Internal server error";

      if (error && typeof error === "object") {
        if ("status" in error && typeof error.status === "number") {
          errorStatusToUse = error.status;
        }
        if ("message" in error && typeof error.message === "string") {
          errorMessageString = error.message;
        }
      }

      if (next) {
        const nextError = error instanceof Error ? error : new Error(String(error));
        if (!("status" in nextError)) {
          Object.defineProperty(nextError, "status", {
            value: errorStatusToUse,
            writable: true,
            configurable: true,
            enumerable: true,
          });
        }
        return next(nextError);
      }

      const fallbackMessage = label ? `${label} failed` : "Internal server error";
      console.error(`[asyncHandler] ${fallbackMessage}:`, errorMessage(error));
      res.status(errorStatusToUse).json({
        error: true,
        message: errorMessageString,
        statusCode: errorStatusToUse,
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

  markError(error: unknown) {
    this.#state.error = typeof error === "string" ? error : errorMessage(error);
  }
}

/**
 * Set up a Server-Sent Events response with proper headers.
 */
export function setupStreamingServerSentEvents(res: Response): (event: unknown) => void {
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
  #fetchTokenFunction: () => Promise<{ token: string; expiresInMilliseconds: number }>;

  constructor(fetchTokenFunction: () => Promise<{ token: string; expiresInMilliseconds: number }>) {
    this.#fetchTokenFunction = fetchTokenFunction;
  }

  async getToken(): Promise<string> {
    if (this.#token && Date.now() < this.#expiry) return this.#token;
    const { token, expiresInMilliseconds } = await this.#fetchTokenFunction();
    this.#token = token;
    this.#expiry = Date.now() + expiresInMilliseconds;
    return this.#token;
  }

  invalidate() {
    this.#token = null;
    this.#expiry = 0;
  }
}

export interface ModuleNamespace {
  default?: unknown;
  [key: string]: unknown;
}

/**
 * Create a lazy-loading async getter for an ES module.
 */
export function lazyImport<ImportedModule>(
  specifier: string,
  extract: (moduleObject: ModuleNamespace) => ImportedModule = (moduleObject) => moduleObject.default as ImportedModule,
): () => Promise<ImportedModule> {
  let cached: ImportedModule;
  return async () => {
    if (!cached) cached = extract(await import(specifier));
    return cached;
  };
}

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Create an HTTP error with a status code.
 */
export function httpError(status: number, message: string): HttpError {
  return new HttpError(status, message);
}

/**
 * Standard request logger middleware.
 */
export function createRequestLoggerMiddleware(logger: Logger) {
  return function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
    const startTimestamp = Date.now();

    const originalEnd = res.end;
    let size = 0;

    // Node's res.end has 3 overloaded signatures — monkey-patching requires a cast
    res.end = function (this: unknown, ...parameters: unknown[]) {
      const chunk = parameters[0];
      if (typeof chunk === "string" || Buffer.isBuffer(chunk)) {
        size += Buffer.byteLength(chunk);
      }
      const timing = `${Date.now() - startTimestamp}ms`;
      const sizeTag = size > 1024
        ? `${(size / 1024).toFixed(1)}KB`
        : `${size}B`;

      logger.request(req.method, req.originalUrl || req.url, res.statusCode, timing, sizeTag);

      return Function.prototype.apply.call(originalEnd, this, parameters);
    } as typeof res.end;

    next();
  };
}
