export interface DebouncedFunction<T extends (...args: unknown[]) => unknown> {
    (...args: Parameters<T>): void;
    cancel: () => void;
    flush: () => void;
}
export interface DebounceOptions {
    /** If true, invoke on the leading edge. */
    leading?: boolean;
}
/**
 * Create a debounced version of a function that delays invocation
 * until `wait` milliseconds have elapsed since the last call.
 *
 * The returned function exposes `.cancel()` and `.flush()` methods.
 */
export declare function debounce<T extends (...args: unknown[]) => unknown>(fn: T, wait: number, { leading }?: DebounceOptions): DebouncedFunction<T>;
export interface ThrottledFunction<T extends (...args: unknown[]) => unknown> {
    (...args: Parameters<T>): void;
    cancel: () => void;
}
/**
 * Create a throttled version of a function that invokes at most
 * once every `wait` milliseconds.
 *
 * Uses the trailing-edge pattern by default: the last call during
 * a throttled window is replayed after the window expires.
 * The returned function exposes a `.cancel()` method.
 */
export declare function throttle<T extends (...args: unknown[]) => unknown>(fn: T, wait: number): ThrottledFunction<T>;
//# sourceMappingURL=rate.d.ts.map