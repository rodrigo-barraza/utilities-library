// ─────────────────────────────────────────────────────────────
// @rodrigo-barraza/utilities/node — Node.js-only entry point
// ─────────────────────────────────────────────────────────────
// These utilities require Node.js APIs (fs, process, etc.)
// and should NOT be imported in browser/client bundles.
// ─────────────────────────────────────────────────────────────

// Logger — Structured console logger
export { default as logger, createLogger } from "./logger.js";

// Express — Route handler wrappers and service utilities
export {
  asyncHandler,
  HealthTracker,
  setupStreamingSSE,
  TokenManager,
  lazyImport,
} from "./express.js";

// Vault — Secret bootstrap client
export { createVaultClient } from "./vault.js";
