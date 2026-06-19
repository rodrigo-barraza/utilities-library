// ─────────────────────────────────────────────────────────────
// Rate — Debounce and throttle utilities
// ─────────────────────────────────────────────────────────────
export function debounce(targetFunction, delayMilliseconds, { leading = false } = {}) {
    let timer = null;
    let lastParameters = null;
    let lastContext = null;
    function invoke() {
        const parameters = lastParameters;
        const context = lastContext;
        lastParameters = null;
        lastContext = null;
        targetFunction.apply(context, parameters);
    }
    const debounced = function (...parameters) {
        lastParameters = parameters;
        lastContext = this;
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
        lastContext = null;
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
export function throttle(targetFunction, delayMilliseconds) {
    let timer = null;
    let lastParameters = null;
    let lastContext = null;
    let lastInvoke = 0;
    function invoke() {
        lastInvoke = Date.now();
        const parameters = lastParameters;
        const context = lastContext;
        lastParameters = null;
        lastContext = null;
        targetFunction.apply(context, parameters);
    }
    const throttled = function (...parameters) {
        lastParameters = parameters;
        lastContext = this;
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
        lastContext = null;
    };
    return throttled;
}
//# sourceMappingURL=rate.js.map