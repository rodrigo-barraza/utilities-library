// ─────────────────────────────────────────────────────────────
// Express — Route handler wrappers and service health tracking
// ─────────────────────────────────────────────────────────────

import type { Request, Response, NextFunction } from "express";
import type { Logger } from "./logger.js";
import { getErrorMessage } from "./errors.js";

export interface AsyncHandlerOptions {
  errorStatus?: number;
  health?: HealthTracker;
}

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
      console.error(`[asyncHandler] ${fallbackMessage}:`, getErrorMessage(error));
      res.status(errorStatusToUse).json({
        error: true,
        message: errorMessageString,
        statusCode: errorStatusToUse,
      });
    }
  };
}

export class HealthTracker {
  #healthState: { lastChecked: Date | null; error: string | null } = { lastChecked: null, error: null };

  getHealth() {
    return { ...this.#healthState };
  }

  markSuccess() {
    this.#healthState.lastChecked = new Date();
    this.#healthState.error = null;
  }

  markError(error: unknown) {
    this.#healthState.error = typeof error === "string" ? error : getErrorMessage(error);
  }
}

// ─── SSE (Server-Sent Events) ────────────────────────────────
// Promoted from prism-service SseUtilities: header setup, a
// guarded low-latency emitter, and a comment-frame heartbeat.

/**
 * Configure an Express response for SSE streaming: required headers
 * (including X-Accel-Buffering for nginx) flushed immediately.
 */
export function initSseResponse(res: Response): void {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();
}

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
export function createSseEmitter(
  res: Response,
  { signal }: SseEmitterOptions = {},
): (event: unknown) => void {
  if (res.socket) res.socket.setNoDelay(true);

  return (event: unknown) => {
    if (signal?.aborted || res.destroyed || res.writableEnded) return;
    res.write(`data: ${JSON.stringify(event)}\n\n`);
    const responseWithFlush = res as Response & { flush?: () => void };
    if (typeof responseWithFlush.flush === "function") {
      responseWithFlush.flush();
    } else if (res.socket && !res.socket.destroyed) {
      res.socket.uncork?.();
      res.socket.cork?.();
      res.socket.uncork?.();
    }
  };
}

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
export function startSseHeartbeat(
  res: Response,
  { intervalMilliseconds = 15_000, signal }: SseHeartbeatOptions = {},
): () => void {
  const interval = setInterval(() => {
    if (!signal?.aborted && !res.destroyed && !res.writableEnded) {
      res.write(`: ping\n\n`);
    }
  }, intervalMilliseconds);
  return () => clearInterval(interval);
}

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

export function httpError(status: number, message: string): HttpError {
  return new HttpError(status, message);
}

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
