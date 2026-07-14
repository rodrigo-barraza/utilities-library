// ─────────────────────────────────────────────────────────────
// Pagination — Shared query-param pagination parsing
// ─────────────────────────────────────────────────────────────
/**
 * Parse `limit`/`offset` query params into a clamped pagination object.
 * Defaults: limit 20 (clamped 1..100), offset >= 0. `skip` mirrors
 * `offset` for direct use in Mongo cursors.
 */
export function buildPagination(query, options = {}) {
    const { defaultLimit = 20, maxLimit = 100 } = options;
    const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit || "", 10) || defaultLimit));
    const offset = Math.max(0, parseInt(query.offset || "", 10) || 0);
    return { limit, offset, skip: offset };
}
//# sourceMappingURL=Pagination.js.map