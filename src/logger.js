// ─────────────────────────────────────────────────────────────
// Logger — Structured console logger for Node.js services
// ─────────────────────────────────────────────────────────────
// Shared base logger used across all backend services.
// Supports colorized output via ANSI escape codes (no deps).
//
// Usage:
//   import { logger } from "@rodrigo-barraza/utilities-library/node";
//   logger.info("Server started");
//
//   // With a service name prefix:
//   import { createLogger } from "@rodrigo-barraza/utilities-library/node";
//   const logger = createLogger("prism");
//   logger.info("Ready");  // → [18:37:24] INFO  [prism] Ready
//
//   // Explicit color control:
//   const logger = createLogger({ service: "vault", color: false });
// ─────────────────────────────────────────────────────────────

// ── ANSI escape codes ──────────────────────────────────────────
const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";

const FG = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
};

// ── Level color map ────────────────────────────────────────────
const LEVEL_STYLES = {
  INFO: { label: "INFO ", color: FG.blue },
  OK: { label: "OK   ", color: FG.green },
  WARN: { label: "WARN ", color: FG.yellow },
  ERR: { label: "ERR  ", color: FG.red },
  DBG: { label: "DBG  ", color: FG.magenta },
};

function timestamp() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Detect whether the current process should use colors.
 * Respects NO_COLOR (https://no-color.org/) and FORCE_COLOR env vars.
 */
function shouldUseColor() {
  if (process.env.NO_COLOR !== undefined) return false;
  if (process.env.FORCE_COLOR !== undefined) return true;
  return process.stdout.isTTY === true;
}

/**
 * Build a logger instance, optionally scoped to a service name.
 *
 * @param {string|object} [opts] — Service name string, or options object.
 * @param {string}  [opts.service] — Service identifier shown in log lines.
 * @param {boolean} [opts.color]   — Enable/disable colors (default: auto-detect TTY).
 * @returns {{ info, success, warn, error, debug, request }}
 */
function createLogger(opts) {
  let service = "";
  let useColor = shouldUseColor();

  if (typeof opts === "string") {
    service = opts;
  } else if (opts && typeof opts === "object") {
    service = opts.service || "";
    if (typeof opts.color === "boolean") useColor = opts.color;
  }

  /**
   * Format a log line with optional ANSI colors.
   */
  function formatLine(level, message) {
    const time = timestamp();
    const style = LEVEL_STYLES[level];

    if (!useColor) {
      const tag = service ? ` [${service}]` : "";
      return `[${time}] ${style.label}${tag} ${message}`;
    }

    const timeFormatted = `${DIM}[${time}]${RESET}`;
    const levelFormatted = `${BOLD}${style.color}${style.label}${RESET}`;
    const tag = service
      ? ` ${FG.cyan}[${service}]${RESET}`
      : "";

    return `${timeFormatted} ${levelFormatted}${tag} ${message}`;
  }

  return {
    info(message, ...args) {
      console.log(formatLine("INFO", message), ...args);
    },

    success(message, ...args) {
      console.log(formatLine("OK", message), ...args);
    },

    warn(message, ...args) {
      console.warn(formatLine("WARN", message), ...args);
    },

    error(message, ...args) {
      console.error(formatLine("ERR", message), ...args);
    },

    debug(message, ...args) {
      console.log(formatLine("DBG", message), ...args);
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
      const time = timestamp();

      if (!useColor) {
        const tag = service ? ` [${service}]` : "";
        console.log(`[${time}] ${status}${tag} ${method} ${path} — ${timing}${size}`);
        return;
      }

      const timeFormatted = `${DIM}[${time}]${RESET}`;
      const tag = service ? ` ${FG.cyan}[${service}]${RESET}` : "";

      // Color status code by class
      let statusColor = FG.green;
      if (status >= 500) statusColor = FG.red;
      else if (status >= 400) statusColor = FG.yellow;
      else if (status >= 300) statusColor = FG.blue;

      const statusFormatted = `${BOLD}${statusColor}${status}${RESET}`;
      const methodFormatted = `${BOLD}${method}${RESET}`;
      const timingFormatted = `${DIM}${timing}${size}${RESET}`;

      console.log(
        `${timeFormatted} ${statusFormatted}${tag} ${methodFormatted} ${path} — ${timingFormatted}`,
      );
    },
  };
}

/** Default (unscoped) logger instance. */
const logger = createLogger();

export default logger;
export { createLogger };
