// ─────────────────────────────────────────────────────────────
// Errors — Type-safe error handling utilities
// ─────────────────────────────────────────────────────────────

export const getErrorMessage = (error: unknown, fallback?: string): string =>
  error instanceof Error ? error.message : (fallback ?? String(error));

/** @deprecated Use getErrorMessage instead */
export const errorMessage = getErrorMessage;
