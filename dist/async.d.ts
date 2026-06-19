export declare function sleep(milliseconds: number): Promise<void>;
export interface RetryOptions {
    retries?: number;
    delay?: number;
    backoff?: number;
}
export declare function retry<T>(action: (attempt: number) => Promise<T> | T, { retries, delay, backoff }?: RetryOptions): Promise<T>;
export declare function withTimeout<T>(promise: Promise<T>, milliseconds: number, message?: string): Promise<T>;
export declare function fetchWithTimeout<T>(url: string, timeoutMilliseconds?: number, fallback?: T | null): Promise<T | null>;
export declare function withTimeoutFallback<T>(promise: Promise<T>, milliseconds: number, fallback?: T | null): Promise<T | null>;
export interface PMapOptions {
    concurrency?: number;
}
export declare function pMap<T, R>(iterable: Iterable<T>, mapper: (item: T, index: number) => Promise<R> | R, { concurrency }?: PMapOptions): Promise<R[]>;
export interface Deferred<T> {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
}
export declare function defer<T = void>(): Deferred<T>;
//# sourceMappingURL=async.d.ts.map