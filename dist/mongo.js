// ─────────────────────────────────────────────────────────────
// Mongo — Pure, isomorphic query helpers
// ─────────────────────────────────────────────────────────────
// The stateful CONNECTION manager lives in service-library
// (MongoManager) — the single source of truth for connecting to
// MongoDB (named multi-DB pool + health + index creation). This
// module holds only the pure, stateless helpers that are safe to
// share with any consumer without pulling in connection concerns.
// ─────────────────────────────────────────────────────────────
import { ObjectId } from "mongodb";
/**
 * Safely convert a string to a MongoDB ObjectId.
 * Returns null if the string is not a valid ObjectId.
 */
export function toObjectId(id) {
    if (!id)
        return null;
    try {
        return new ObjectId(id);
    }
    catch {
        return null;
    }
}
/**
 * Build a time-range filter for MongoDB queries.
 */
export function buildTimeRangeFilter(field, from, to) {
    const filter = {};
    if (from)
        filter.$gte = new Date(from);
    if (to)
        filter.$lte = new Date(to);
    return Object.keys(filter).length ? { [field]: filter } : {};
}
/**
 * Build a MongoDB pagination object from query params.
 */
export function buildPagination(query) {
    const limit = Math.min(500, Math.max(1, parseInt(String(query.limit || ""), 10) || 20));
    let skip = 0;
    if (query.offset !== undefined) {
        skip = Math.max(0, parseInt(String(query.offset || ""), 10) || 0);
    }
    else if (query.page !== undefined) {
        const page = Math.max(1, parseInt(String(query.page || ""), 10) || 1);
        skip = (page - 1) * limit;
    }
    return { limit, skip };
}
//# sourceMappingURL=mongo.js.map