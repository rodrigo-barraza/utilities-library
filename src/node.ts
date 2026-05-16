// ─────────────────────────────────────────────────────────────
// @rodrigo-barraza/utilities-library/node — Node.js-only entry point
// ─────────────────────────────────────────────────────────────

// Logger — Structured console logger
export { default as logger, createLogger } from "./logger.ts";
export type { Logger, LoggerOptions } from "./logger.ts";

// Express — Route handler wrappers and service utilities
export {
  asyncHandler,
  HealthTracker,
  setupStreamingSSE,
  TokenManager,
  lazyImport,
  httpError,
  createRequestLoggerMiddleware,
} from "./express.ts";
export type { AsyncHandlerOptions } from "./express.ts";

// Vault — Secret bootstrap client
export { createVaultClient } from "./vault.ts";
export type { VaultClientOptions, VaultClient } from "./vault.ts";
