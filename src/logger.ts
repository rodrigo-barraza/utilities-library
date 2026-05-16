// ─────────────────────────────────────────────────────────────
// Logger — Structured console logger for Node.js services
// ─────────────────────────────────────────────────────────────

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
} as const;

type LogLevel = "INFO" | "OK" | "WARN" | "ERR" | "DBG";

const LEVEL_STYLES: Record<LogLevel, { label: string; color: string }> = {
  INFO: { label: "INFO ", color: FG.blue },
  OK: { label: "OK   ", color: FG.green },
  WARN: { label: "WARN ", color: FG.yellow },
  ERR: { label: "ERR  ", color: FG.red },
  DBG: { label: "DBG  ", color: FG.magenta },
};

function timestamp(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function shouldUseColor(): boolean {
  if (process.env.NO_COLOR !== undefined) return false;
  if (process.env.FORCE_COLOR !== undefined) return true;
  return process.stdout.isTTY === true;
}

export interface Logger {
  info(message: string, ...args: unknown[]): void;
  success(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
  request(method: string, path: string, status: number, timing: string, sizeTag?: string): void;
}

export interface LoggerOptions {
  /** Service identifier shown in log lines. */
  service?: string;
  /** Enable/disable colors (default: auto-detect TTY). */
  color?: boolean;
}

/**
 * Build a logger instance, optionally scoped to a service name.
 */
function createLogger(opts?: string | LoggerOptions): Logger {
  let service = "";
  let useColor = shouldUseColor();

  if (typeof opts === "string") {
    service = opts;
  } else if (opts && typeof opts === "object") {
    service = opts.service || "";
    if (typeof opts.color === "boolean") useColor = opts.color;
  }

  function formatLine(level: LogLevel, message: string): string {
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
    info(message: string, ...args: unknown[]) {
      console.log(formatLine("INFO", message), ...args);
    },

    success(message: string, ...args: unknown[]) {
      console.log(formatLine("OK", message), ...args);
    },

    warn(message: string, ...args: unknown[]) {
      console.warn(formatLine("WARN", message), ...args);
    },

    error(message: string, ...args: unknown[]) {
      console.error(formatLine("ERR", message), ...args);
    },

    debug(message: string, ...args: unknown[]) {
      console.log(formatLine("DBG", message), ...args);
    },

    request(method: string, path: string, status: number, timing: string, sizeTag?: string) {
      const size = sizeTag ? ` ${sizeTag}` : "";
      const time = timestamp();

      if (!useColor) {
        const tag = service ? ` [${service}]` : "";
        console.log(`[${time}] ${status}${tag} ${method} ${path} — ${timing}${size}`);
        return;
      }

      const timeFormatted = `${DIM}[${time}]${RESET}`;
      const tag = service ? ` ${FG.cyan}[${service}]${RESET}` : "";

      let statusColor: string = FG.green;
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
const logger: Logger = createLogger();

export default logger;
export { createLogger };
