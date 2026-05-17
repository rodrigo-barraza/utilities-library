// ─────────────────────────────────────────────────────────────
// Schemas — Zod-powered runtime validation and Express middleware
// ─────────────────────────────────────────────────────────────
// Re-exports `z` so consumers don't need to install Zod directly.
// Provides `validate()` middleware for Express route boundaries.
// ─────────────────────────────────────────────────────────────
import { z } from "zod";
// ─── Re-exports ───────────────────────────────────────────────────────
// Allow consumers to `import { z } from "@rodrigo-barraza/utilities-library/schemas"`
export { z };
// ─── Error formatting ─────────────────────────────────────────────────
/**
 * Format a ZodError into a flat array of human-readable field error strings.
 * e.g. ["body.sessionId: Required", "body.duration: Expected number, received string"]
 */
export function formatZodErrors(error, prefix) {
    return error.issues.map((issue) => {
        const path = issue.path.length > 0
            ? (prefix ? `${prefix}.` : "") + issue.path.join(".")
            : prefix || "value";
        return `${path}: ${issue.message}`;
    });
}
/**
 * Express middleware factory that validates `req.body`, `req.query`,
 * and/or `req.params` against Zod schemas.
 *
 * On success, replaces the raw values with the parsed (coerced/defaulted)
 * output so downstream handlers receive clean, typed data.
 *
 * On failure, responds with a structured 400 JSON error.
 *
 * @example
 * ```ts
 * import { validate, z } from "@rodrigo-barraza/utilities-library/schemas";
 *
 * const CreateSessionBody = z.object({
 *   sessionId: z.string().min(1),
 *   visitorId: z.string().nullable().default(null),
 *   duration: z.number().default(0),
 * });
 *
 * router.post("/", validate({ body: CreateSessionBody }), asyncHandler(async (req) => {
 *   // req.body is fully typed and validated
 * }));
 * ```
 */
export function validate(schemas) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (req, res, next) => {
        const errors = [];
        if (schemas.body) {
            const result = schemas.body.safeParse(req.body);
            if (!result.success) {
                errors.push(...formatZodErrors(result.error, "body"));
            }
            else {
                req.body = result.data;
            }
        }
        if (schemas.query) {
            const result = schemas.query.safeParse(req.query);
            if (!result.success) {
                errors.push(...formatZodErrors(result.error, "query"));
            }
            else {
                req.query = result.data;
            }
        }
        if (schemas.params) {
            const result = schemas.params.safeParse(req.params);
            if (!result.success) {
                errors.push(...formatZodErrors(result.error, "params"));
            }
            else {
                req.params = result.data;
            }
        }
        if (errors.length > 0) {
            return res.status(400).json({
                error: true,
                message: "Validation failed",
                details: errors,
            });
        }
        next();
    };
}
// ─── Common reusable schema fragments ─────────────────────────────────
/** MongoDB ObjectId-shaped string (24 hex chars). */
export const objectIdString = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");
/** Pagination query params — reuse across list endpoints. */
export const paginationQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(200).default(20),
});
/** Common period filter (e.g. "7d", "30d", "1y"). */
export const periodQuery = z.object({
    period: z.string().regex(/^\d+[dwmy]$/, "Expected format: 7d, 30d, 1y").default("30d"),
});
/** Standard sort direction. */
export const sortDirection = z.enum(["asc", "desc"]).default("desc");
/** Non-empty trimmed string. */
export const nonEmptyString = z.string().trim().min(1);
//# sourceMappingURL=schemas.js.map