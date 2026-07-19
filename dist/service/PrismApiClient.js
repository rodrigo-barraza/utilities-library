// ─────────────────────────────────────────────────────────────
// PrismApiClient — typed HTTP client for the Prism LLM gateway
// ─────────────────────────────────────────────────────────────
//
// Transport only: base URL, identity headers, timeouts, one retry with
// jitter on transient network errors, and error normalization. App-level
// policy (provider maps, agent personas, response adapters) belongs in the
// consuming service.
//
// Identity is sent via headers (x-project / x-username) because Prism's
// AuthMiddleware resolves username from the x-username header ONLY — a
// `username` field in the request body is silently ignored.
import { DEFAULT_USERNAME, DEFAULT_PROJECT, IDENTITY_HEADERS, AUTH_HEADERS, } from "../taxonomy/index.js";
const DEFAULT_TIMEOUT_MS = 120_000;
// ────────────────────────────────────────────────────────────
// Client
// ────────────────────────────────────────────────────────────
export class PrismApiClient {
    baseUrl;
    project;
    defaultUsername;
    apiSecret;
    getExtraHeaders;
    defaultTimeoutMs;
    retryOnNetworkError;
    logger;
    constructor(config) {
        if (!config.baseUrl) {
            throw new Error("PrismApiClient: baseUrl is required");
        }
        this.baseUrl = config.baseUrl.replace(/\/+$/, "");
        this.project = config.project || DEFAULT_PROJECT;
        this.defaultUsername = config.defaultUsername || DEFAULT_USERNAME;
        this.apiSecret = config.apiSecret;
        this.getExtraHeaders = config.getExtraHeaders;
        this.defaultTimeoutMs = config.defaultTimeoutMs ?? DEFAULT_TIMEOUT_MS;
        this.retryOnNetworkError = config.retryOnNetworkError ?? true;
        this.logger = config.logger ?? console;
    }
    headers(username) {
        return {
            "Content-Type": "application/json",
            [IDENTITY_HEADERS.project]: this.project,
            [IDENTITY_HEADERS.username]: username || this.defaultUsername,
            ...(this.apiSecret && { [AUTH_HEADERS.apiSecret]: this.apiSecret }),
            ...this.getExtraHeaders?.(),
        };
    }
    /**
     * Raw request against a Prism endpoint. Prefer the typed methods; this is
     * the escape hatch for endpoints the client doesn't model yet. Returns the
     * raw `Response` so callers can consume JSON or binary streams.
     */
    async requestRaw(endpoint, { method = "POST", body, username, timeoutMs = this.defaultTimeoutMs, } = {}) {
        const doFetch = () => fetch(`${this.baseUrl}${endpoint}`, {
            method,
            headers: this.headers(username),
            ...(body && { body: JSON.stringify(body) }),
            // A hung Prism call must never hang the caller — several consumers
            // drain replies through serial queues where one unbounded request
            // freezes everything behind it.
            signal: AbortSignal.timeout(timeoutMs),
        });
        let response;
        try {
            response = await doFetch();
        }
        catch (error) {
            const isTimeout = error instanceof DOMException && error.name === "TimeoutError";
            if (isTimeout) {
                this.logger.error(`[PrismApiClient] Timeout after ${timeoutMs}ms on ${endpoint}`);
                throw new Error(`Prism timeout: ${endpoint} exceeded ${timeoutMs}ms`);
            }
            if (!this.retryOnNetworkError) {
                throw new Error(`Prism unreachable: ${errorText(error)}`);
            }
            // Transient network error (connection refused/reset before any
            // response): retry once with jitter, then give up.
            this.logger.warn(`[PrismApiClient] Network error on ${endpoint}, retrying once: ${errorText(error)}`);
            await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));
            try {
                response = await doFetch();
            }
            catch (retryError) {
                this.logger.error(`[PrismApiClient] Network error on ${endpoint} (after retry): ${errorText(retryError)}`);
                throw new Error(`Prism unreachable: ${errorText(retryError)}`);
            }
        }
        if (!response.ok) {
            const bodyText = await response.text().catch(() => "");
            throw new Error(`Prism API error: ${response.status} ${bodyText.slice(0, 500)}`);
        }
        return response;
    }
    /** JSON request against a Prism endpoint. */
    async request(endpoint, options = {}) {
        const response = await this.requestRaw(endpoint, options);
        return (await response.json());
    }
    // ── Chat / agent ────────────────────────────────────────────
    /** Text or image generation via /chat (non-streaming). */
    async chat({ username, timeoutMs, skipConversation = true, ...body }) {
        return this.request("/chat?stream=false", {
            body: pruneUndefined({ ...body, skipConversation }),
            username,
            timeoutMs,
        });
    }
    /** Full agentic loop with server-side tool calling via /agent (non-streaming). */
    async agent({ username, timeoutMs, skipConversation = true, ...body }) {
        return this.request("/agent?stream=false", {
            body: pruneUndefined({ ...body, skipConversation }),
            username,
            timeoutMs,
        });
    }
    // ── Audio ───────────────────────────────────────────────────
    /** Transcribe audio via /audio-to-text. */
    async transcribeAudio({ audio, mimeType = "audio/mpeg", username, timeoutMs, ...rest }) {
        const audioPayload = Buffer.isBuffer(audio)
            ? `data:${mimeType};base64,${audio.toString("base64")}`
            : audio;
        return this.request("/audio-to-text", {
            body: pruneUndefined({
                audio: audioPayload,
                skipConversation: true,
                ...rest,
            }),
            username,
            timeoutMs,
        });
    }
    /**
     * Generate speech via /text-to-audio. Collects the binary response into a
     * base64 buffer with its content type.
     */
    async textToSpeech({ username, timeoutMs, skipConversation = true, ...body }) {
        const response = await this.requestRaw("/text-to-audio", {
            body: pruneUndefined({ ...body, skipConversation }),
            username,
            timeoutMs,
        });
        const contentType = response.headers.get("content-type") || "audio/mpeg";
        const arrayBuffer = await response.arrayBuffer();
        return {
            audioBase64: Buffer.from(arrayBuffer).toString("base64"),
            contentType,
        };
    }
    // ── Embeddings / memory ─────────────────────────────────────
    /** Generate an embedding vector via /embed. */
    async embed({ username, timeoutMs, ...body }) {
        return this.request("/embed", {
            body: pruneUndefined({ ...body }),
            username,
            timeoutMs,
        });
    }
    /** Extract and store memories from a conversation chunk via /memory/extract. */
    async extractMemories({ username, timeoutMs, ...body }) {
        return this.request("/memory/extract", {
            body: pruneUndefined({ ...body }),
            username,
            timeoutMs,
        });
    }
    /** Vector-similarity memory search via /memory/search. */
    async searchMemories({ username, timeoutMs, limit = 10, userIds, ...body }) {
        return this.request("/memory/search", {
            body: pruneUndefined({
                ...body,
                limit,
                ...(userIds?.length ? { userIds } : {}),
            }),
            username,
            timeoutMs,
        });
    }
    // ── Meta ────────────────────────────────────────────────────
    /** Liveness probe against /health. Never throws. */
    async health(timeoutMs = 3_000) {
        try {
            const response = await fetch(`${this.baseUrl}/health`, {
                signal: AbortSignal.timeout(timeoutMs),
            });
            return response.ok;
        }
        catch {
            return false;
        }
    }
    /** Fetch global user settings from /settings. Returns null on failure. */
    async getSettings(timeoutMs = 3_000) {
        try {
            const response = await this.requestRaw("/settings", {
                method: "GET",
                timeoutMs,
            });
            return (await response.json());
        }
        catch (error) {
            this.logger.error(`[PrismApiClient] getSettings failed: ${errorText(error)}`);
            return null;
        }
    }
}
// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────
function errorText(error) {
    return error instanceof Error ? error.message : String(error);
}
function pruneUndefined(body) {
    return Object.fromEntries(Object.entries(body).filter(([, value]) => value !== undefined));
}
//# sourceMappingURL=PrismApiClient.js.map