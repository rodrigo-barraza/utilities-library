export interface PaginationQuery {
    limit?: string;
    offset?: string;
}
export interface Pagination {
    limit: number;
    offset: number;
    skip: number;
}
export interface BuildPaginationOptions {
    defaultLimit?: number;
    maxLimit?: number;
}
/**
 * Parse `limit`/`offset` query params into a clamped pagination object.
 * Defaults: limit 20 (clamped 1..100), offset >= 0. `skip` mirrors
 * `offset` for direct use in Mongo cursors.
 */
export declare function buildPagination(query: PaginationQuery, options?: BuildPaginationOptions): Pagination;
//# sourceMappingURL=Pagination.d.ts.map