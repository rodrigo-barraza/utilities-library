// ─────────────────────────────────────────────────────────────
// ErrorMiddleware — Shared Express error + 404 handlers
// ─────────────────────────────────────────────────────────────
// Single source of truth for the JSON error envelope that every
// service previously hand-rolled. Handles:
//   • HttpError (and subclasses) — uses its statusCode + toJSON()
//   • plain errors carrying `status`/`statusCode`
//   • everything else → 500
// ─────────────────────────────────────────────────────────────
/**
 * Base class for errors that carry an HTTP status and a JSON body.
 * Extend it (e.g. a provider-specific error) and override `toJSON()`
 * to add fields to the response envelope.
 */
export class HttpError extends Error {
    statusCode;
    details;
    constructor(message, statusCode = 500, details) {
        super(message);
        this.name = new.target.name;
        this.statusCode = statusCode;
        this.details = details;
    }
    toJSON() {
        return {
            error: true,
            message: this.message,
            statusCode: this.statusCode,
            ...(this.details !== undefined ? { details: this.details } : {}),
        };
    }
}
/** Resolve a status code from the various shapes services throw. */
function resolveStatus(error) {
    const candidate = error;
    const raw = candidate?.statusCode ?? candidate?.status;
    return typeof raw === "number" && raw >= 400 && raw <= 599 ? raw : 500;
}
/**
 * Build the terminal Express error handler. Mount it LAST, after all routes.
 */
export function createErrorHandler(options = {}) {
    const logger = options.logger || console;
    const logStack = options.logStack !== false;
    return function errorHandler(error, _req, res, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next) {
        const status = resolveStatus(error);
        const err = error;
        const logError = logger.error ?? logger.log ?? console.error;
        logError(`Unhandled error: ${err?.message ?? String(error)}`);
        if (logStack && err?.stack)
            logError(err.stack);
        if (error instanceof HttpError) {
            res.status(status).json(error.toJSON());
            return;
        }
        // Honour a custom toJSON() on error-like objects (e.g. ProviderError).
        const maybeJson = error;
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
export function notFoundHandler(req, res) {
    res.status(404).json({
        error: true,
        message: `Not found: ${req.method} ${req.path}`,
        statusCode: 404,
    });
}
//# sourceMappingURL=ErrorMiddleware.js.map