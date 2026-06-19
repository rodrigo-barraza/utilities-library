// ─────────────────────────────────────────────────────────────
// Logger — Structured console logger for Node.js services
// ─────────────────────────────────────────────────────────────
const ANSI_RESET = "\x1b[0m";
const ANSI_DIM = "\x1b[2m";
const ANSI_BOLD = "\x1b[1m";
const FOREGROUND_COLORS = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",
};
const LEVEL_STYLES = {
    INFO: { label: "INFO ", color: FOREGROUND_COLORS.blue },
    OK: { label: "OK   ", color: FOREGROUND_COLORS.green },
    WARN: { label: "WARN ", color: FOREGROUND_COLORS.yellow },
    ERROR: { label: "ERROR", color: FOREGROUND_COLORS.red },
    DEBUG: { label: "DEBUG", color: FOREGROUND_COLORS.magenta },
};
function timestamp() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}
function shouldUseColor() {
    if (process.env.NO_COLOR !== undefined)
        return false;
    if (process.env.FORCE_COLOR !== undefined)
        return true;
    return process.stdout.isTTY === true;
}
function createLogger(options) {
    let service = "";
    let useColor = shouldUseColor();
    if (typeof options === "string") {
        service = options;
    }
    else if (options && typeof options === "object") {
        service = options.service || "";
        if (typeof options.color === "boolean")
            useColor = options.color;
    }
    function formatLine(level, message) {
        const time = timestamp();
        const style = LEVEL_STYLES[level];
        if (!useColor) {
            const tag = service ? ` [${service}]` : "";
            return `[${time}] ${style.label}${tag} ${message}`;
        }
        const timeFormatted = `${ANSI_DIM}[${time}]${ANSI_RESET}`;
        const levelFormatted = `${ANSI_BOLD}${style.color}${style.label}${ANSI_RESET}`;
        const tag = service
            ? ` ${FOREGROUND_COLORS.cyan}[${service}]${ANSI_RESET}`
            : "";
        return `${timeFormatted} ${levelFormatted}${tag} ${message}`;
    }
    return {
        info(message, ...additionalData) {
            console.log(formatLine("INFO", message), ...additionalData);
        },
        success(message, ...additionalData) {
            console.log(formatLine("OK", message), ...additionalData);
        },
        warn(message, ...additionalData) {
            console.warn(formatLine("WARN", message), ...additionalData);
        },
        error(message, ...additionalData) {
            console.error(formatLine("ERROR", message), ...additionalData);
        },
        debug(message, ...additionalData) {
            console.log(formatLine("DEBUG", message), ...additionalData);
        },
        request(method, path, status, timing, sizeTag) {
            const size = sizeTag ? ` ${sizeTag}` : "";
            const time = timestamp();
            if (!useColor) {
                const tag = service ? ` [${service}]` : "";
                console.log(`[${time}] ${status}${tag} ${method} ${path} — ${timing}${size}`);
                return;
            }
            const timeFormatted = `${ANSI_DIM}[${time}]${ANSI_RESET}`;
            const tag = service ? ` ${FOREGROUND_COLORS.cyan}[${service}]${ANSI_RESET}` : "";
            let statusColor = FOREGROUND_COLORS.green;
            if (status >= 500)
                statusColor = FOREGROUND_COLORS.red;
            else if (status >= 400)
                statusColor = FOREGROUND_COLORS.yellow;
            else if (status >= 300)
                statusColor = FOREGROUND_COLORS.blue;
            const statusFormatted = `${ANSI_BOLD}${statusColor}${status}${ANSI_RESET}`;
            const methodFormatted = `${ANSI_BOLD}${method}${ANSI_RESET}`;
            const timingFormatted = `${ANSI_DIM}${timing}${size}${ANSI_RESET}`;
            console.log(`${timeFormatted} ${statusFormatted}${tag} ${methodFormatted} ${path} — ${timingFormatted}`);
        },
    };
}
const logger = createLogger();
export default logger;
export { createLogger };
//# sourceMappingURL=logger.js.map