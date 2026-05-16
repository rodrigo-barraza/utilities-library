// ─────────────────────────────────────────────────────────────
// Rate — Debounce and throttle utilities
// ─────────────────────────────────────────────────────────────
// Classic rate-limiting higher-order functions used extensively
// across client components for search inputs, resize handlers,
// API polling, and scroll events.
// ─────────────────────────────────────────────────────────────

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
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number,
  { leading = false }: DebounceOptions = {},
): DebouncedFunction<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: unknown = null;

  function invoke() {
    const args = lastArgs!;
    const ctx = lastThis;
    lastArgs = null;
    lastThis = null;
    fn.apply(ctx, args);
  }

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;

    if (leading && timer === null) {
      invoke();
    }

    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (!leading || lastArgs) invoke();
    }, wait);
  } as DebouncedFunction<T>;

  debounced.cancel = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    lastArgs = null;
    lastThis = null;
  };

  debounced.flush = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
      if (lastArgs) invoke();
    }
  };

  return debounced;
}

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
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number,
): ThrottledFunction<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: unknown = null;
  let lastInvoke = 0;

  function invoke() {
    lastInvoke = Date.now();
    const args = lastArgs!;
    const ctx = lastThis;
    lastArgs = null;
    lastThis = null;
    fn.apply(ctx, args);
  }

  const throttled = function (this: unknown, ...args: Parameters<T>) {
    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;
    const elapsed = Date.now() - lastInvoke;
    const remaining = wait - elapsed;

    if (remaining <= 0) {
      if (timer !== null) clearTimeout(timer);
      timer = null;
      invoke();
    } else if (timer === null) {
      timer = setTimeout(() => {
        timer = null;
        invoke();
      }, remaining);
    }
  } as ThrottledFunction<T>;

  throttled.cancel = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    lastArgs = null;
    lastThis = null;
  };

  return throttled;
}
