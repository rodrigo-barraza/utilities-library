// ─────────────────────────────────────────────────────────────
// Errors — Type-safe error handling utilities
// ─────────────────────────────────────────────────────────────
export const getErrorMessage = (error, fallback) => error instanceof Error ? error.message : (fallback ?? String(error));
/** @deprecated Use getErrorMessage instead */
export const errorMessage = getErrorMessage;
//# sourceMappingURL=errors.js.map