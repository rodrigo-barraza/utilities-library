// ─────────────────────────────────────────────────────────────
// Express — Route handler wrappers and service health tracking
// ─────────────────────────────────────────────────────────────
var __rewriteRelativeImportExtension = (this && this.__rewriteRelativeImportExtension) || function (path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
        });
    }
    return path;
};
import { getErrorMessage } from "./errors.js";
export function asyncHandler(handlerFunction, label = "", errorStatusOrOptions = 502) {
    const errorStatus = typeof errorStatusOrOptions === "number"
        ? errorStatusOrOptions
        : errorStatusOrOptions.errorStatus || 502;
    const health = typeof errorStatusOrOptions === "object"
        ? errorStatusOrOptions.health
        : undefined;
    return async (req, res, next) => {
        try {
            const result = await handlerFunction(req, res, next);
            if (health)
                health.markSuccess();
            if (result !== undefined && !res.headersSent)
                res.json(result);
        }
        catch (error) {
            if (health)
                health.markError(error);
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
    #healthState = { lastChecked: null, error: null };
    getHealth() {
        return { ...this.#healthState };
    }
    markSuccess() {
        this.#healthState.lastChecked = new Date();
        this.#healthState.error = null;
    }
    markError(error) {
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
export function initSseResponse(res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();
}
/**
 * Create an emit callback that writes `data: <json>\n\n` frames with
 * guarded writes (no writes after abort/close) and force-flushing.
 * Disables Nagle's algorithm so small frames aren't buffered while the
 * server awaits; cork/uncork guarantees flushes without compression
 * middleware's res.flush().
 */
export function createSseEmitter(res, { signal } = {}) {
    if (res.socket)
        res.socket.setNoDelay(true);
    return (event) => {
        if (signal?.aborted || res.destroyed || res.writableEnded)
            return;
        res.write(`data: ${JSON.stringify(event)}\n\n`);
        const responseWithFlush = res;
        if (typeof responseWithFlush.flush === "function") {
            responseWithFlush.flush();
        }
        else if (res.socket && !res.socket.destroyed) {
            res.socket.uncork?.();
            res.socket.cork?.();
            res.socket.uncork?.();
        }
    };
}
/**
 * Emit `: ping` SSE comment frames on an interval so clients can tell a
 * quiet-but-alive stream from a dead socket. Comment frames are invisible
 * to `data:`-line parsers. Returns a stop function — always call it when
 * the stream ends.
 */
export function startSseHeartbeat(res, { intervalMilliseconds = 15_000, signal } = {}) {
    const interval = setInterval(() => {
        if (!signal?.aborted && !res.destroyed && !res.writableEnded) {
            res.write(`: ping\n\n`);
        }
    }, intervalMilliseconds);
    return () => clearInterval(interval);
}
export function setupStreamingServerSentEvents(res) {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
    });
    const send = (event) => {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
    };
    return send;
}
export class TokenManager {
    #token = null;
    #expiry = 0;
    #fetchTokenFunction;
    constructor(fetchTokenFunction) {
        this.#fetchTokenFunction = fetchTokenFunction;
    }
    async getToken() {
        if (this.#token && Date.now() < this.#expiry)
            return this.#token;
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
export function lazyImport(specifier, extract = (moduleObject) => moduleObject.default) {
    let cached;
    return async () => {
        if (!cached)
            cached = extract(await import(__rewriteRelativeImportExtension(specifier)));
        return cached;
    };
}
export class HttpError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
export function httpError(status, message) {
    return new HttpError(status, message);
}
export function createRequestLoggerMiddleware(logger) {
    return function requestLoggerMiddleware(req, res, next) {
        const startTimestamp = Date.now();
        const originalEnd = res.end;
        let size = 0;
        // Node's res.end has 3 overloaded signatures — monkey-patching requires a cast
        res.end = function (...parameters) {
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
        };
        next();
    };
}
//# sourceMappingURL=express.js.map