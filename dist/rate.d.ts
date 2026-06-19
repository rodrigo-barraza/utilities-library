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
//# sourceMappingURL=rate.d.ts.map