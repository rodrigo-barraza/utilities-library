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
/**
 * Wrap an async route handler with standard error catching.
 */
export function asyncHandler(fn, label = "", errorStatusOrOpts = 502) {
    const errorStatus = typeof errorStatusOrOpts === "number"
        ? errorStatusOrOpts
        : errorStatusOrOpts.errorStatus || 502;
    const health = typeof errorStatusOrOpts === "object"
        ? errorStatusOrOpts.health
        : undefined;
    return async (req, res, next) => {
        try {
            const result = await fn(req, res, next);
            if (health)
                health.markSuccess();
            if (result !== undefined && !res.headersSent)
                res.json(result);
        }
        catch (error) {
            if (health)
                health.markError(error);
            const err = error;
            if (next) {
                if (!err.status)
                    err.status = errorStatus;
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
    #state = { lastChecked: null, error: null };
    getHealth() {
        return { ...this.#state };
    }
    markSuccess() {
        this.#state.lastChecked = new Date();
        this.#state.error = null;
    }
    markError(err) {
        this.#state.error = typeof err === "string" ? err : err.message;
    }
}
/**
 * Set up a Server-Sent Events response with proper headers.
 */
export function setupStreamingSSE(res) {
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
/**
 * Reusable OAuth2 client-credentials token manager with caching.
 */
export class TokenManager {
    #token = null;
    #expiry = 0;
    #fetchFn;
    constructor(fetchFn) {
        this.#fetchFn = fetchFn;
    }
    async getToken() {
        if (this.#token && Date.now() < this.#expiry)
            return this.#token;
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
export function lazyImport(specifier, extract = (m) => m.default) {
    let cached;
    return async () => {
        if (!cached)
            cached = extract(await import(__rewriteRelativeImportExtension(specifier)));
        return cached;
    };
}
/**
 * Create an HTTP error with a status code.
 */
export function httpError(status, message) {
    const httpErr = new Error(message);
    httpErr.status = status;
    return httpErr;
}
/**
 * Standard request logger middleware.
 */
export function createRequestLoggerMiddleware(logger) {
    return function requestLoggerMiddleware(req, res, next) {
        const start = Date.now();
        const originalEnd = res.end;
        let size = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        res.end = function (chunk, encoding, cb) {
            if (chunk)
                size += Buffer.byteLength(chunk);
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
//# sourceMappingURL=express.js.map