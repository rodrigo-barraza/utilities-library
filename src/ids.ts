// ─────────────────────────────────────────────────────────────
// IDs — Identifier generation utilities
// ─────────────────────────────────────────────────────────────

import { nanoid } from "nanoid";

/**
 * Generate a short, URL-safe random identifier.
 * e.g. "5WqX9z" or "user_5WqX9z"
 */
export function generateId(prefix?: string, length = 12): string {
  const id = nanoid(length);
  return prefix ? `${prefix}${id}` : id;
}

/**
 * Generate a short random identifier with a timestamp prefix for better sortability.
 */
export function generateSortableId(prefix?: string, length = 8): string {
  const timestamp = Date.now().toString(36);
  const random = nanoid(length);
  const id = `${timestamp}${random}`;
  return prefix ? `${prefix}${id}` : id;
}
