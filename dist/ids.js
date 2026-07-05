// ─────────────────────────────────────────────────────────────
// IDs — Identifier generation utilities
// ─────────────────────────────────────────────────────────────
import { nanoid } from "nanoid";
/**
 * Generate a short, URL-safe random identifier.
 * e.g. "5WqX9z" or "user_5WqX9z"
 */
export function generateId(prefix, length = 12) {
    const id = nanoid(length);
    return prefix ? `${prefix}${id}` : id;
}
/**
 * Generate a short random identifier with a timestamp prefix for better sortability.
 */
export function generateSortableId(prefix, length = 8) {
    const timestamp = Date.now().toString(36);
    const random = nanoid(length);
    const id = `${timestamp}${random}`;
    return prefix ? `${prefix}${id}` : id;
}
//# sourceMappingURL=ids.js.map