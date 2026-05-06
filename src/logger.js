// ─────────────────────────────────────────────────────────────
// Logger — Structured console logger for Node.js services
// ─────────────────────────────────────────────────────────────
// Shared base logger used across all backend services.
// No colors — designed for clean, uniform, grep-friendly output.
//
// Usage:
//   import { logger } from "@rodrigo-barraza/utilities-library/node";
//   logger.info("Server started");
//
//   // Or with a service name prefix:
//   import { createLogger } from "@rodrigo-barraza/utilities-library/node";
//   const logger = createLogger("prism");
//   logger.info("Ready");  // → [18:37:24] INFO  [prism] Ready
// ─────────────────────────────────────────────────────────────

function timestamp() {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/**
 * Build a logger instance, optionally scoped to a service name.
 * @param {string} [service] — Service identifier shown in log lines.
 * @returns {{ info, success, warn, error, debug, request }}
 */
function createLogger(service) {
  const tag = service ? ` [${service}]` : "";

  return {
    info(message, ...args) {
      console.log(`[${timestamp()}] INFO ${tag} ${message}`, ...args);
    },

    success(message, ...args) {
      console.log(`[${timestamp()}] OK   ${tag} ${message}`, ...args);
    },

    warn(message, ...args) {
      console.warn(`[${timestamp()}] WARN ${tag} ${message}`, ...args);
    },

    error(message, ...args) {
      console.error(`[${timestamp()}] ERR  ${tag} ${message}`, ...args);
    },

    debug(message, ...args) {
      console.log(`[${timestamp()}] DBG  ${tag} ${message}`, ...args);
    },

    /**
     * Log an HTTP request. Used by RequestLoggerMiddleware.
     * @param {string} method  — HTTP method (GET, POST, etc.)
     * @param {string} path    — Request path
     * @param {number} status  — Response status code
     * @param {string} timing  — Human-readable elapsed time
     * @param {string} [sizeTag] — Optional size summary
     */
    request(method, path, status, timing, sizeTag) {
      const size = sizeTag ? ` ${sizeTag}` : "";
      console.log(
        `[${timestamp()}] ${status}${tag} ${method} ${path} — ${timing}${size}`,
      );
    },
  };
}

/** Default (unscoped) logger instance. */
const logger = createLogger();

export default logger;
export { createLogger };
