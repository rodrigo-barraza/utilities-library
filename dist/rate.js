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
/** Create an in-memory per-UTC-day budget counter that resets at midnight UTC. */
export function createDailyBudget(limit, now = Date.now) {
    let dayKey = "";
    let used = 0;
    function rollDay() {
        const key = new Date(now()).toISOString().slice(0, 10);
        if (key !== dayKey) {
            dayKey = key;
            used = 0;
        }
    }
    return {
        tryConsume(count = 1) {
            rollDay();
            if (used + count > limit)
                return false;
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
/** Create an in-memory circuit breaker with a consecutive-failure threshold. */
export function createCircuitBreaker({ tripDurationMilliseconds, failureThreshold = 1, now = Date.now, }) {
    let openUntilTimestamp = null;
    let consecutiveFailures = 0;
    function isOpen() {
        if (openUntilTimestamp === null)
            return false;
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
//# sourceMappingURL=rate.js.map