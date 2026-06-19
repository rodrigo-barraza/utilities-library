import { z, type ZodSchema, type ZodError, type ZodIssue } from "zod";
import type { Request, Response, NextFunction } from "express";
export { z };
export type { ZodSchema, ZodError, ZodIssue };
export declare function formatZodErrors(error: ZodError, prefix?: string): string[];
export interface ValidateOptions<BodySchema extends ZodSchema = ZodSchema, QuerySchema extends ZodSchema = ZodSchema, ParametersSchema extends ZodSchema = ZodSchema> {
    body?: BodySchema;
    query?: QuerySchema;
    params?: ParametersSchema;
}
export declare function validate<BodySchema extends ZodSchema = ZodSchema, QuerySchema extends ZodSchema = ZodSchema, ParametersSchema extends ZodSchema = ZodSchema>(schemas: ValidateOptions<BodySchema, QuerySchema, ParametersSchema>): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const objectIdString: z.ZodString;
export declare const paginationQuery: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const periodQuery: z.ZodObject<{
    period: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export declare const sortDirection: z.ZodDefault<z.ZodEnum<{
    asc: "asc";
    desc: "desc";
}>>;
export declare const nonEmptyString: z.ZodString;
//# sourceMappingURL=schemas.d.ts.map