export interface DebouncedFunction<T extends (...parameters: unknown[]) => unknown> {
    (...parameters: Parameters<T>): void;
    cancel: () => void;
    flush: () => void;
}
export interface DebounceOptions {
    leading?: boolean;
}
export declare function debounce<T extends (...parameters: unknown[]) => unknown>(targetFunction: T, delayMilliseconds: number, { leading }?: DebounceOptions): DebouncedFunction<T>;
export interface ThrottledFunction<T extends (...parameters: unknown[]) => unknown> {
    (...parameters: Parameters<T>): void;
    cancel: () => void;
}
export declare function throttle<T extends (...parameters: unknown[]) => unknown>(targetFunction: T, delayMilliseconds: number): ThrottledFunction<T>;
export interface DailyBudget {
    /** Consume `count` units if the UTC-day budget allows; false when exhausted. */
    tryConsume(count?: number): boolean;
    used(): number;
    remaining(): number;
}
/** Create an in-memory per-UTC-day budget counter that resets at midnight UTC. */
export declare function createDailyBudget(limit: number, now?: () => number): DailyBudget;
export interface CircuitBreakerOptions {
    /** How long the breaker stays open after tripping. */
    tripDurationMilliseconds: number;
    /** Consecutive recordFailure() calls before auto-tripping (default 1). */
    failureThreshold?: number;
    now?: () => number;
}
export interface CircuitBreaker {
    isOpen(): boolean;
    /** Epoch ms until which the breaker is open, or null when closed. */
    openUntil(): number | null;
    trip(): void;
    reset(): void;
    /** Count a failure; trips automatically at `failureThreshold`. */
    recordFailure(): void;
    /** Clear the consecutive-failure count (does not close an open breaker). */
    recordSuccess(): void;
}
/** Create an in-memory circuit breaker with a consecutive-failure threshold. */
export declare function createCircuitBreaker({ tripDurationMilliseconds, failureThreshold, now, }: CircuitBreakerOptions): CircuitBreaker;
//# sourceMappingURL=rate.d.ts.map