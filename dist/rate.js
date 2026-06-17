// ─────────────────────────────────────────────────────────────
// Rate — Debounce and throttle utilities
// ─────────────────────────────────────────────────────────────
// Classic rate-limiting higher-order functions used extensively
// across client components for search inputs, resize handlers,
// API polling, and scroll events.
// ─────────────────────────────────────────────────────────────
/**
 * Create a debounced version of a function that delays invocation
 * until `delayMilliseconds` milliseconds have elapsed since the last call.
 *
 * The returned function exposes `.cancel()` and `.flush()` methods.
 */
export function debounce(targetFunction, delayMilliseconds, { leading = false } = {}) {
    let timer = null;
    let lastParameters = null;
    let lastThis = null;
    function invoke() {
        const parameters = lastParameters;
        const context = lastThis;
        lastParameters = null;
        lastThis = null;
        targetFunction.apply(context, parameters);
    }
    const debounced = function (...parameters) {
        lastParameters = parameters;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        lastThis = this;
        if (leading && timer === null) {
            invoke();
        }
        if (timer !== null)
            clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            if (!leading || lastParameters)
                invoke();
        }, delayMilliseconds);
    };
    debounced.cancel = () => {
        if (timer !== null)
            clearTimeout(timer);
        timer = null;
        lastParameters = null;
        lastThis = null;
    };
    debounced.flush = () => {
        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
            if (lastParameters)
                invoke();
        }
    };
    return debounced;
}
/**
 * Create a throttled version of a function that invokes at most
 * once every `delayMilliseconds` milliseconds.
 *
 * Uses the trailing-edge pattern by default: the last call during
 * a throttled window is replayed after the window expires.
 * The returned function exposes a `.cancel()` method.
 */
export function throttle(targetFunction, delayMilliseconds) {
    let timer = null;
    let lastParameters = null;
    let lastThis = null;
    let lastInvoke = 0;
    function invoke() {
        lastInvoke = Date.now();
        const parameters = lastParameters;
        const context = lastThis;
        lastParameters = null;
        lastThis = null;
        targetFunction.apply(context, parameters);
    }
    const throttled = function (...parameters) {
        lastParameters = parameters;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        lastThis = this;
        const elapsed = Date.now() - lastInvoke;
        const remaining = delayMilliseconds - elapsed;
        if (remaining <= 0) {
            if (timer !== null)
                clearTimeout(timer);
            timer = null;
            invoke();
        }
        else if (timer === null) {
            timer = setTimeout(() => {
                timer = null;
                invoke();
            }, remaining);
        }
    };
    throttled.cancel = () => {
        if (timer !== null)
            clearTimeout(timer);
        timer = null;
        lastParameters = null;
        lastThis = null;
    };
    return throttled;
}
//# sourceMappingURL=rate.js.map