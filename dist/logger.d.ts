export interface Logger {
    info(message: string, ...additionalData: unknown[]): void;
    success(message: string, ...additionalData: unknown[]): void;
    warn(message: string, ...additionalData: unknown[]): void;
    error(message: string, ...additionalData: unknown[]): void;
    debug(message: string, ...additionalData: unknown[]): void;
    request(method: string, path: string, status: number, timing: string, sizeTag?: string): void;
}
export interface LoggerOptions {
    service?: string;
    color?: boolean;
}
declare function createLogger(options?: string | LoggerOptions): Logger;
declare const logger: Logger;
export default logger;
export { createLogger };
//# sourceMappingURL=logger.d.ts.map