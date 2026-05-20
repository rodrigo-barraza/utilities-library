import { z, type ZodSchema, type ZodError, type ZodIssue } from "zod";
import type { Request, Response, NextFunction } from "express";
export { z };
export type { ZodSchema, ZodError, ZodIssue };
/**
 * Format a ZodError into a flat array of human-readable field error strings.
 * e.g. ["body.sessionId: Required", "body.duration: Expected number, received string"]
 */
export declare function formatZodErrors(error: ZodError, prefix?: string): string[];
/**
 * Validation target — which part of the request to validate.
 */
export interface ValidateOptions<TBody extends ZodSchema = ZodSchema, TQuery extends ZodSchema = ZodSchema, TParams extends ZodSchema = ZodSchema> {
    body?: TBody;
    query?: TQuery;
    params?: TParams;
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
export declare function validate<TBody extends ZodSchema = ZodSchema, TQuery extends ZodSchema = ZodSchema, TParams extends ZodSchema = ZodSchema>(schemas: ValidateOptions<TBody, TQuery, TParams>): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/** MongoDB ObjectId-shaped string (24 hex chars). */
export declare const objectIdString: z.ZodString;
/** Pagination query params — reuse across list endpoints. */
export declare const paginationQuery: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
/** Common period filter (e.g. "7d", "30d", "1y"). */
export declare const periodQuery: z.ZodObject<{
    period: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
/** Standard sort direction. */
export declare const sortDirection: z.ZodDefault<z.ZodEnum<{
    asc: "asc";
    desc: "desc";
}>>;
/** Non-empty trimmed string. */
export declare const nonEmptyString: z.ZodString;
//# sourceMappingURL=schemas.d.ts.map