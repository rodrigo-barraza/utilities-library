// ─────────────────────────────────────────────────────────────
// Rate — Debounce and throttle utilities
// ─────────────────────────────────────────────────────────────
export function debounce(targetFunction, delayMilliseconds, { leading = false } = {}) {
    const state = {
        timer: null,
        lastParameters: null,
        lastContext: null,
    };
    function invoke() {
        const parameters = state.lastParameters;
        const context = state.lastContext;
        state.lastParameters = null;
        state.lastContext = null;
        targetFunction.apply(context, parameters);
    }
    const debounced = function (...parameters) {
        state.lastParameters = parameters;
        state.lastContext = this;
        if (leading && state.timer === null) {
            invoke();
        }
        if (state.timer !== null)
            clearTimeout(state.timer);
        state.timer = setTimeout(() => {
            state.timer = null;
            if (!leading || state.lastParameters)
                invoke();
        }, delayMilliseconds);
    };
    debounced.cancel = () => {
        if (state.timer !== null)
            clearTimeout(state.timer);
        state.timer = null;
        state.lastParameters = null;
        state.lastContext = null;
    };
    debounced.flush = () => {
        if (state.timer !== null) {
            clearTimeout(state.timer);
            state.timer = null;
            if (state.lastParameters)
                invoke();
        }
    };
    return debounced;
}
export function throttle(targetFunction, delayMilliseconds) {
    const state = {
        timer: null,
        lastParameters: null,
        lastContext: null,
        lastInvoke: 0,
    };
    function invoke() {
        state.lastInvoke = Date.now();
        const parameters = state.lastParameters;
        const context = state.lastContext;
        state.lastParameters = null;
        state.lastContext = null;
        targetFunction.apply(context, parameters);
    }
    const throttled = function (...parameters) {
        state.lastParameters = parameters;
        state.lastContext = this;
        const elapsed = Date.now() - state.lastInvoke;
        const remaining = delayMilliseconds - elapsed;
        if (remaining <= 0) {
            if (state.timer !== null)
                clearTimeout(state.timer);
            state.timer = null;
            invoke();
        }
        else if (state.timer === null) {
            state.timer = setTimeout(() => {
                state.timer = null;
                invoke();
            }, remaining);
        }
    };
    throttled.cancel = () => {
        if (state.timer !== null)
            clearTimeout(state.timer);
        state.timer = null;
        state.lastParameters = null;
        state.lastContext = null;
    };
    return throttled;
}
//# sourceMappingURL=rate.js.map