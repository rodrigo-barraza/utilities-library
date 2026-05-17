// ─────────────────────────────────────────────────────────────
// @rodrigo-barraza/utilities-library/node — Node.js-only entry point
// ─────────────────────────────────────────────────────────────

// Logger — Structured console logger
export { default as logger, createLogger } from "./logger.js";
export type { Logger, LoggerOptions } from "./logger.js";

// Express — Route handler wrappers and service utilities
export {
  asyncHandler,
  HealthTracker,
  setupStreamingSSE,
  TokenManager,
  lazyImport,
  httpError,
  createRequestLoggerMiddleware,
} from "./express.js";
export type { AsyncHandlerOptions } from "./express.js";

// Vault — Secret bootstrap client
export { createVaultClient } from "./vault.js";
export type { VaultClientOptions, VaultClient } from "./vault.js";
