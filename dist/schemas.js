// ─────────────────────────────────────────────────────────────
// Schemas — Zod-powered runtime validation and Express middleware
// ─────────────────────────────────────────────────────────────
import { z } from "zod";
// ─── Re-exports ───────────────────────────────────────────────────────
export { z };
// ─── Error formatting ─────────────────────────────────────────────────
export function formatZodErrors(error, prefix) {
    return error.issues.map((issue) => {
        const path = issue.path.length > 0
            ? (prefix ? `${prefix}.` : "") + issue.path.join(".")
            : prefix || "value";
        return `${path}: ${issue.message}`;
    });
}
export function validate(schemas) {
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
                // Express 5 defines req.query as a getter that recomputes from the raw
                // URL on every access — Object.assign silently fails because the getter
                // immediately recalculates string values. Override with a value property
                // so downstream handlers receive coerced/defaulted Zod output.
                Object.defineProperty(req, "query", {
                    value: result.data,
                    writable: true,
                    configurable: true,
                });
            }
        }
        if (schemas.params) {
            const result = schemas.params.safeParse(req.params);
            if (!result.success) {
                errors.push(...formatZodErrors(result.error, "params"));
            }
            else {
                // Same Express 5 getter issue applies to req.params.
                Object.defineProperty(req, "params", {
                    value: result.data,
                    writable: true,
                    configurable: true,
                });
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
export const objectIdString = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");
export const paginationQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(200).default(20),
});
export const periodQuery = z.object({
    period: z.string().regex(/^\d+[dwmy]$/, "Expected format: 7d, 30d, 1y").default("30d"),
});
export const sortDirection = z.enum(["asc", "desc"]).default("desc");
export const nonEmptyString = z.string().trim().min(1);
//# sourceMappingURL=schemas.js.map