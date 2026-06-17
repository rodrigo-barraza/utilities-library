// ─────────────────────────────────────────────────────────────
// Rate — Debounce and throttle utilities
// ─────────────────────────────────────────────────────────────
// Classic rate-limiting higher-order functions used extensively
// across client components for search inputs, resize handlers,
// API polling, and scroll events.
// ─────────────────────────────────────────────────────────────

export interface DebouncedFunction<T extends (...parameters: unknown[]) => unknown> {
  (...parameters: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}

export interface DebounceOptions {
  /** If true, invoke on the leading edge. */
  leading?: boolean;
}

/**
 * Create a debounced version of a function that delays invocation
 * until `delayMilliseconds` milliseconds have elapsed since the last call.
 *
 * The returned function exposes `.cancel()` and `.flush()` methods.
 */
export function debounce<T extends (...parameters: unknown[]) => unknown>(
  targetFunction: T,
  delayMilliseconds: number,
  { leading = false }: DebounceOptions = {},
): DebouncedFunction<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastParameters: Parameters<T> | null = null;
  let lastThis: unknown = null;

  function invoke() {
    const parameters = lastParameters!;
    const context = lastThis;
    lastParameters = null;
    lastThis = null;
    targetFunction.apply(context, parameters);
  }

  const debounced = function (this: unknown, ...parameters: Parameters<T>) {
    lastParameters = parameters;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;

    if (leading && timer === null) {
      invoke();
    }

    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (!leading || lastParameters) invoke();
    }, delayMilliseconds);
  } as DebouncedFunction<T>;

  debounced.cancel = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    lastParameters = null;
    lastThis = null;
  };

  debounced.flush = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
      if (lastParameters) invoke();
    }
  };

  return debounced;
}

export interface ThrottledFunction<T extends (...parameters: unknown[]) => unknown> {
  (...parameters: Parameters<T>): void;
  cancel: () => void;
}

/**
 * Create a throttled version of a function that invokes at most
 * once every `delayMilliseconds` milliseconds.
 *
 * Uses the trailing-edge pattern by default: the last call during
 * a throttled window is replayed after the window expires.
 * The returned function exposes a `.cancel()` method.
 */
export function throttle<T extends (...parameters: unknown[]) => unknown>(
  targetFunction: T,
  delayMilliseconds: number,
): ThrottledFunction<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastParameters: Parameters<T> | null = null;
  let lastThis: unknown = null;
  let lastInvoke = 0;

  function invoke() {
    lastInvoke = Date.now();
    const parameters = lastParameters!;
    const context = lastThis;
    lastParameters = null;
    lastThis = null;
    targetFunction.apply(context, parameters);
  }

  const throttled = function (this: unknown, ...parameters: Parameters<T>) {
    lastParameters = parameters;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;
    const elapsed = Date.now() - lastInvoke;
    const remaining = delayMilliseconds - elapsed;

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
    lastParameters = null;
    lastThis = null;
  };

  return throttled;
}
