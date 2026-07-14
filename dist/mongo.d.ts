import { ObjectId } from "mongodb";
/**
 * Safely convert a string to a MongoDB ObjectId.
 * Returns null if the string is not a valid ObjectId.
 */
export declare function toObjectId(id: string | null | undefined): ObjectId | null;
/**
 * Build a time-range filter for MongoDB queries.
 */
export declare function buildTimeRangeFilter(field: string, from?: string, to?: string): Record<string, unknown>;
/**
 * Build a MongoDB pagination object from query params.
 */
export declare function buildPagination(query: {
    limit?: string | number;
    offset?: string | number;
    page?: string | number;
}): {
    limit: number;
    skip: number;
};
//# sourceMappingURL=mongo.d.ts.map