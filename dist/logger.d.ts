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
declare function createLogger(opts?: string | LoggerOptions): Logger;
/** Default (unscoped) logger instance. */
declare const logger: Logger;
export default logger;
export { createLogger };
//# sourceMappingURL=logger.d.ts.map