// ─────────────────────────────────────────────────────────────
// Errors — Type-safe error handling utilities
// ─────────────────────────────────────────────────────────────
export const errorMessage = (error) => error instanceof Error ? error.message : String(error);
//# sourceMappingURL=errors.js.map