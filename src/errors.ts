// ─────────────────────────────────────────────────────────────
// Errors — Type-safe error handling utilities
// ─────────────────────────────────────────────────────────────

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

/** @deprecated Use getErrorMessage instead */
export const errorMessage = getErrorMessage;
