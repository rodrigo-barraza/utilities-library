// ─────────────────────────────────────────────────────────────
// Rate — Debounce and throttle utilities
// ─────────────────────────────────────────────────────────────

export interface DebouncedFunction<T extends (...parameters: unknown[]) => unknown> {
  (...parameters: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}

export interface DebounceOptions {
  leading?: boolean;
}

export function debounce<T extends (...parameters: unknown[]) => unknown>(
  targetFunction: T,
  delayMilliseconds: number,
  { leading = false }: DebounceOptions = {},
): DebouncedFunction<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastParameters: Parameters<T> | null = null;
  let lastContext: unknown = null;

  function invoke() {
    const parameters = lastParameters!;
    const context = lastContext;
    lastParameters = null;
    lastContext = null;
    targetFunction.apply(context, parameters);
  }

  const debounced = function (this: unknown, ...parameters: Parameters<T>) {
    lastParameters = parameters;
    lastContext = this;

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
    lastContext = null;
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

export function throttle<T extends (...parameters: unknown[]) => unknown>(
  targetFunction: T,
  delayMilliseconds: number,
): ThrottledFunction<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastParameters: Parameters<T> | null = null;
  let lastContext: unknown = null;
  let lastInvoke = 0;

  function invoke() {
    lastInvoke = Date.now();
    const parameters = lastParameters!;
    const context = lastContext;
    lastParameters = null;
    lastContext = null;
    targetFunction.apply(context, parameters);
  }

  const throttled = function (this: unknown, ...parameters: Parameters<T>) {
    lastParameters = parameters;
    lastContext = this;
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
    lastContext = null;
  };

  return throttled;
}
