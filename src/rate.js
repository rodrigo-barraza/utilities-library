// ─────────────────────────────────────────────────────────────
// Rate — Debounce and throttle utilities
// ─────────────────────────────────────────────────────────────
// Classic rate-limiting higher-order functions used extensively
// across client components for search inputs, resize handlers,
// API polling, and scroll events.
// ─────────────────────────────────────────────────────────────

/**
 * Create a debounced version of a function that delays invocation
 * until `wait` milliseconds have elapsed since the last call.
 *
 * The returned function exposes `.cancel()` and `.flush()` methods.
 *
 * @param {Function} fn - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @param {{ leading?: boolean }} [options] - If `leading` is true, invoke on the leading edge
 * @returns {Function & { cancel: () => void, flush: () => void }}
 */
export function debounce(fn, wait, { leading = false } = {}) {
  let timer = null;
  let lastArgs = null;
  let lastThis = null;

  function invoke() {
    const args = lastArgs;
    const ctx = lastThis;
    lastArgs = null;
    lastThis = null;
    fn.apply(ctx, args);
  }

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;

    if (leading && timer === null) {
      invoke();
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (!leading || lastArgs) invoke();
    }, wait);
  }

  debounced.cancel = () => {
    clearTimeout(timer);
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

/**
 * Create a throttled version of a function that invokes at most
 * once every `wait` milliseconds.
 *
 * Uses the trailing-edge pattern by default: the last call during
 * a throttled window is replayed after the window expires.
 * The returned function exposes a `.cancel()` method.
 *
 * @param {Function} fn - Function to throttle
 * @param {number} wait - Minimum interval in milliseconds
 * @returns {Function & { cancel: () => void }}
 */
export function throttle(fn, wait) {
  let timer = null;
  let lastArgs = null;
  let lastThis = null;
  let lastInvoke = 0;

  function invoke() {
    lastInvoke = Date.now();
    const args = lastArgs;
    const ctx = lastThis;
    lastArgs = null;
    lastThis = null;
    fn.apply(ctx, args);
  }

  function throttled(...args) {
    lastArgs = args;
    lastThis = this;
    const elapsed = Date.now() - lastInvoke;
    const remaining = wait - elapsed;

    if (remaining <= 0) {
      clearTimeout(timer);
      timer = null;
      invoke();
    } else if (timer === null) {
      timer = setTimeout(() => {
        timer = null;
        invoke();
      }, remaining);
    }
  }

  throttled.cancel = () => {
    clearTimeout(timer);
    timer = null;
    lastArgs = null;
    lastThis = null;
  };

  return throttled;
}
