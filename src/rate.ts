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
  const state = {
    timer: null as ReturnType<typeof setTimeout> | null,
    lastParameters: null as Parameters<T> | null,
    lastContext: null as unknown,
  };

  function invoke() {
    const parameters = state.lastParameters!;
    const context = state.lastContext;
    state.lastParameters = null;
    state.lastContext = null;
    targetFunction.apply(context, parameters);
  }

  const debounced = function (this: unknown, ...parameters: Parameters<T>) {
    state.lastParameters = parameters;
    state.lastContext = this;

    if (leading && state.timer === null) {
      invoke();
    }

    if (state.timer !== null) clearTimeout(state.timer);
    state.timer = setTimeout(() => {
      state.timer = null;
      if (!leading || state.lastParameters) invoke();
    }, delayMilliseconds);
  } as DebouncedFunction<T>;

  debounced.cancel = () => {
    if (state.timer !== null) clearTimeout(state.timer);
    state.timer = null;
    state.lastParameters = null;
    state.lastContext = null;
  };

  debounced.flush = () => {
    if (state.timer !== null) {
      clearTimeout(state.timer);
      state.timer = null;
      if (state.lastParameters) invoke();
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
  const state = {
    timer: null as ReturnType<typeof setTimeout> | null,
    lastParameters: null as Parameters<T> | null,
    lastContext: null as unknown,
    lastInvoke: 0,
  };

  function invoke() {
    state.lastInvoke = Date.now();
    const parameters = state.lastParameters!;
    const context = state.lastContext;
    state.lastParameters = null;
    state.lastContext = null;
    targetFunction.apply(context, parameters);
  }

  const throttled = function (this: unknown, ...parameters: Parameters<T>) {
    state.lastParameters = parameters;
    state.lastContext = this;
    const elapsed = Date.now() - state.lastInvoke;
    const remaining = delayMilliseconds - elapsed;

    if (remaining <= 0) {
      if (state.timer !== null) clearTimeout(state.timer);
      state.timer = null;
      invoke();
    } else if (state.timer === null) {
      state.timer = setTimeout(() => {
        state.timer = null;
        invoke();
      }, remaining);
    }
  } as ThrottledFunction<T>;

  throttled.cancel = () => {
    if (state.timer !== null) clearTimeout(state.timer);
    state.timer = null;
    state.lastParameters = null;
    state.lastContext = null;
  };

  return throttled;
}
