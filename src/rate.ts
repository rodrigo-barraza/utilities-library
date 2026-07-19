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

// ─────────────────────────────────────────────────────────────
// Daily budget + circuit breaker (in-memory)
// ─────────────────────────────────────────────────────────────
// The "daily UTC cap + breaker + jittered pacing" skeleton shared
// by outbound-request governors (classifieds fetchers, DM campaign).
// In-memory only — persistent governors with atomic store updates
// (e.g. Mongo-backed ClassifiedsEngine state) keep their own store.
// ─────────────────────────────────────────────────────────────

export interface DailyBudget {
  /** Consume `count` units if the UTC-day budget allows; false when exhausted. */
  tryConsume(count?: number): boolean;
  used(): number;
  remaining(): number;
}

/** Create an in-memory per-UTC-day budget counter that resets at midnight UTC. */
export function createDailyBudget(limit: number, now: () => number = Date.now): DailyBudget {
  let dayKey = "";
  let used = 0;

  function rollDay(): void {
    const key = new Date(now()).toISOString().slice(0, 10);
    if (key !== dayKey) {
      dayKey = key;
      used = 0;
    }
  }

  return {
    tryConsume(count = 1) {
      rollDay();
      if (used + count > limit) return false;
      used += count;
      return true;
    },
    used() {
      rollDay();
      return used;
    },
    remaining() {
      rollDay();
      return Math.max(0, limit - used);
    },
  };
}

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
export function createCircuitBreaker({
  tripDurationMilliseconds,
  failureThreshold = 1,
  now = Date.now,
}: CircuitBreakerOptions): CircuitBreaker {
  let openUntilTimestamp: number | null = null;
  let consecutiveFailures = 0;

  function isOpen(): boolean {
    if (openUntilTimestamp === null) return false;
    if (now() >= openUntilTimestamp) {
      openUntilTimestamp = null;
      return false;
    }
    return true;
  }

  return {
    isOpen,
    openUntil: () => (isOpen() ? openUntilTimestamp : null),
    trip() {
      openUntilTimestamp = now() + tripDurationMilliseconds;
      consecutiveFailures = 0;
    },
    reset() {
      openUntilTimestamp = null;
      consecutiveFailures = 0;
    },
    recordFailure() {
      consecutiveFailures += 1;
      if (consecutiveFailures >= failureThreshold) {
        openUntilTimestamp = now() + tripDurationMilliseconds;
        consecutiveFailures = 0;
      }
    },
    recordSuccess() {
      consecutiveFailures = 0;
    },
  };
}
