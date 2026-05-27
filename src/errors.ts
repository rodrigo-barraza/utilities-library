// ─────────────────────────────────────────────────────────────
// Errors — Type-safe error handling utilities
// ─────────────────────────────────────────────────────────────

/**
 * Type-safe error message extraction for catch blocks.
 *
 * Replaces the unsafe `(error as Error).message` pattern.
 * The only acceptable `unknown` in TypeScript is in catch blocks —
 * this utility provides the canonical narrowing.
 */
export const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);
