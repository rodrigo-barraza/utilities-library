// ─────────────────────────────────────────────────────────────
// Express — Route handler wrappers and service health tracking
// ─────────────────────────────────────────────────────────────

/**
 * Wrap an async route handler with standard error catching.
 * The wrapped function should return the JSON payload (or call res directly for non-standard flows).
 *
 * @param {Function} fn - (req, res) => Promise<any> — return value is sent as JSON
 * @param {string} label - Error context label (e.g. "Dictionary lookup")
 * @param {number|object} [errorStatusOrOpts=502] - HTTP status on error, or options object
 * @param {number} [errorStatusOrOpts.errorStatus=502] - HTTP status on error
 * @param {HealthTracker} [errorStatusOrOpts.health] - Optional HealthTracker to update
 * @returns {Function} Express middleware
 */
export function asyncHandler(fn, label, errorStatusOrOpts = 502) {
  const errorStatus =
    typeof errorStatusOrOpts === "number" ? errorStatusOrOpts : (errorStatusOrOpts.errorStatus || 502);
  const health =
    typeof errorStatusOrOpts === "object" ? errorStatusOrOpts.health : undefined;
  return async (req, res) => {
    try {
      const result = await fn(req, res);
      if (health) health.markSuccess();
      if (result !== undefined) res.json(result);
    } catch (err) {
      if (health) health.markError(err);
      res.status(errorStatus).json({ error: `${label} failed: ${err.message}` });
    }
  };
}

/**
 * Reusable health-state tracker for route domains.
 * Replaces the duplicated `const state = { lastChecked, error }` +
 * `getXxxHealth()` pattern found across multiple services.
 */
export class HealthTracker {
  #state = { lastChecked: null, error: null };

  /** Return a snapshot of the current health state. */
  getHealth() {
    return { ...this.#state };
  }

  /** Mark a successful operation. */
  markSuccess() {
    this.#state.lastChecked = new Date();
    this.#state.error = null;
  }

  /** Mark a failed operation. */
  markError(err) {
    this.#state.error = typeof err === "string" ? err : err.message;
  }
}

/**
 * Set up a Server-Sent Events response with proper headers.
 * Returns a `send(event)` function that serializes objects as SSE data lines.
 *
 * @param {import("express").Response} res
 * @returns {(event: object) => void}
 */
export function setupStreamingSSE(res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  const send = (event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };
  return send;
}

/**
 * Reusable OAuth2 client-credentials token manager with caching.
 * Handles token expiry and automatic refresh.
 */
export class TokenManager {
  #token = null;
  #expiry = 0;
  #fetchFn;

  /**
   * @param {Function} fetchFn - Async function that returns { token, expiresInMs }
   */
  constructor(fetchFn) {
    this.#fetchFn = fetchFn;
  }

  /**
   * Get a valid token, refreshing if expired.
   * @returns {Promise<string>}
   */
  async getToken() {
    if (this.#token && Date.now() < this.#expiry) return this.#token;
    const { token, expiresInMs } = await this.#fetchFn();
    this.#token = token;
    this.#expiry = Date.now() + expiresInMs;
    return this.#token;
  }

  /** Invalidate the cached token (e.g. on 401). */
  invalidate() {
    this.#token = null;
    this.#expiry = 0;
  }
}

/**
 * Create a lazy-loading async getter for an ES module.
 * Replaces the duplicated `let mod; async function getMod() { ... }` pattern.
 *
 * @param {string} specifier - The import specifier (e.g. "qrcode")
 * @param {(m: any) => any} [extract=m => m.default] - Extractor for the module export
 * @returns {() => Promise<any>}
 */
export function lazyImport(specifier, extract = (m) => m.default) {
  let cached;
  return async () => {
    if (!cached) cached = extract(await import(specifier));
    return cached;
  };
}
