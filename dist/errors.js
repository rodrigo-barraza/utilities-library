// ─────────────────────────────────────────────────────────────
// Errors — Type-safe error handling utilities
// ─────────────────────────────────────────────────────────────
export const getErrorMessage = (error) => error instanceof Error ? error.message : String(error);
/** @deprecated Use getErrorMessage instead */
export const errorMessage = getErrorMessage;
//# sourceMappingURL=errors.js.map