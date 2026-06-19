// ─────────────────────────────────────────────────────────────
// Errors — Type-safe error handling utilities
// ─────────────────────────────────────────────────────────────

export const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);
