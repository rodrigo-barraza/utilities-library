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

import {
  DEFAULT_USERNAME,
  DEFAULT_PROJECT,
  IDENTITY_HEADERS,
  AUTH_HEADERS,
} from "../taxonomy/index.ts";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export interface PrismLoggerLike {
  warn: (message: string) => void;
  error: (message: string) => void;
}

export interface PrismApiClientConfig {
  /** Base URL of the Prism service, e.g. http://prism:4000 */
  baseUrl: string;
  /** Project name sent as x-project — Prism's cost-accounting dimension. */
  project?: string;
  /** Username sent as x-username when a call doesn't specify one. */
  defaultUsername?: string;
  /** Sent as x-api-secret when set (allowed by Prism's CORS; reserved for auth). */
  apiSecret?: string;
  /**
   * Called per request; returned headers are merged LAST so request-scoped
   * context (trace ids, per-request x-project/x-username from an
   * AsyncLocalStorage store) overrides the static config.
   */
  getExtraHeaders?: () => Record<string, string>;
  /** Default request timeout in milliseconds (default 120 000). */
  defaultTimeoutMs?: number;
  /** Retry once with jitter on transient network errors (default true). */
  retryOnNetworkError?: boolean;
  /** Destination for warn/error logs (default console). */
  logger?: PrismLoggerLike;
}

export interface PrismRequestOptions {
  method?: string;
  body?: Record<string, unknown>;
  username?: string;
  /** Abort the request after this many milliseconds. */
  timeoutMs?: number;
}

// No index signature: consumers' stricter message types (e.g. a ChatMessage
// interface) must remain assignable without casts.
export interface PrismChatMessage {
  role: string;
  content: string;
  name?: string;
  images?: string[];
}

export interface PrismChatParams {
  messages: PrismChatMessage[];
  provider?: string;
  model?: string;
  systemPrompt?: string;
  /** Provider options bag (maxTokens, temperature, …) forwarded verbatim. */
  options?: Record<string, unknown>;
  /** Ask Prism to route to an image-capable model and return images. */
  forceImageGeneration?: boolean;
  /** Skip persisting the exchange as a Prism conversation (default true). */
  skipConversation?: boolean;
  traceId?: string;
  username?: string;
  timeoutMs?: number;
  [key: string]: unknown;
}

export interface PrismAgentParams {
  messages: PrismChatMessage[];
  provider?: string;
  model?: string;
  /** Persona key resolved server-side by Prism's AgentPersonaRegistry. */
  agent?: string;
  agentContext?: Record<string, unknown>;
  maxTokens?: number;
  temperature?: number;
  thinkingEnabled?: boolean;
  thinkingBudget?: number;
  /** Auto-approve tool calls (unattended callers can't answer prompts). */
  autoApprove?: boolean;
  skipConversation?: boolean;
  traceId?: string;
  username?: string;
  timeoutMs?: number;
  [key: string]: unknown;
}

export interface PrismTranscribeParams {
  /** Audio as a Buffer, base64 string, or data URL. */
  audio: Buffer | string;
  /** Mime type used when `audio` is not already a data URL. */
  mimeType?: string;
  provider?: string;
  model?: string;
  language?: string;
  /** Body-level project override — beats x-project headers on the Prism side. */
  project?: string;
  traceId?: string;
  username?: string;
  timeoutMs?: number;
}

export interface PrismTextToSpeechParams {
  text: string;
  provider?: string;
  voice?: string;
  model?: string;
  skipConversation?: boolean;
  /** Body-level project override — beats x-project headers on the Prism side. */
  project?: string;
  traceId?: string;
  username?: string;
  timeoutMs?: number;
}

export interface PrismEmbedParams {
  text: string;
  provider?: string;
  model?: string;
  /** Body-level project override — beats x-project headers on the Prism side. */
  project?: string;
  traceId?: string;
  username?: string;
  timeoutMs?: number;
}

export interface PrismMemoryExtractParams {
  guildId: string;
  channelId: string;
  messages: PrismChatMessage[];
  participants?: string[];
  sourceMessageId?: string;
  traceId?: string;
  username?: string;
  timeoutMs?: number;
}

export interface PrismMemorySearchParams {
  guildId: string;
  queryText: string;
  userIds?: string[];
  limit?: number;
  traceId?: string;
  username?: string;
  timeoutMs?: number;
}

export interface PrismMemoryItem {
  content: string;
  createdAt: string | Date;
  aboutUsername?: string;
}

/** Response envelope shared by Prism's JSON endpoints. */
export interface PrismResponse {
  text?: string;
  message?: PrismChatMessage;
  model?: string;
  provider?: string;
  images?: Array<{ data?: string; mimeType?: string; minioRef?: string }>;
  audio?: Array<{ data?: string; mimeType?: string; minioRef?: string }>;
  audioRef?: string;
  toolCalls?: Array<{
    id: string;
    type: string;
    function: { name: string; arguments: string };
  }>;
  toolResults?: Array<{
    name?: string;
    args?: Record<string, unknown>;
    result?: unknown;
    status?: string;
  }>;
  embedding?: number[];
  results?: unknown;
  memories?: PrismMemoryItem[];
  count?: number;
  [key: string]: unknown;
}

export interface PrismSpeechResult {
  audioBase64: string;
  contentType: string;
}

const DEFAULT_TIMEOUT_MS = 120_000;

// ────────────────────────────────────────────────────────────
// Client
// ────────────────────────────────────────────────────────────

export class PrismApiClient {
  private readonly baseUrl: string;
  private readonly project: string;
  private readonly defaultUsername: string;
  private readonly apiSecret?: string;
  private readonly getExtraHeaders?: () => Record<string, string>;
  private readonly defaultTimeoutMs: number;
  private readonly retryOnNetworkError: boolean;
  private readonly logger: PrismLoggerLike;

  constructor(config: PrismApiClientConfig) {
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

  private headers(username?: string): Record<string, string> {
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
  async requestRaw(
    endpoint: string,
    {
      method = "POST",
      body,
      username,
      timeoutMs = this.defaultTimeoutMs,
    }: PrismRequestOptions = {},
  ): Promise<Response> {
    const doFetch = () =>
      fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: this.headers(username),
        ...(body && { body: JSON.stringify(body) }),
        // A hung Prism call must never hang the caller — several consumers
        // drain replies through serial queues where one unbounded request
        // freezes everything behind it.
        signal: AbortSignal.timeout(timeoutMs),
      });

    let response: Response;
    try {
      response = await doFetch();
    } catch (error: unknown) {
      const isTimeout =
        error instanceof DOMException && error.name === "TimeoutError";
      if (isTimeout) {
        this.logger.error(
          `[PrismApiClient] Timeout after ${timeoutMs}ms on ${endpoint}`,
        );
        throw new Error(`Prism timeout: ${endpoint} exceeded ${timeoutMs}ms`);
      }
      if (!this.retryOnNetworkError) {
        throw new Error(`Prism unreachable: ${errorText(error)}`);
      }
      // Transient network error (connection refused/reset before any
      // response): retry once with jitter, then give up.
      this.logger.warn(
        `[PrismApiClient] Network error on ${endpoint}, retrying once: ${errorText(error)}`,
      );
      await new Promise((resolve) =>
        setTimeout(resolve, 500 + Math.random() * 1000),
      );
      try {
        response = await doFetch();
      } catch (retryError: unknown) {
        this.logger.error(
          `[PrismApiClient] Network error on ${endpoint} (after retry): ${errorText(retryError)}`,
        );
        throw new Error(`Prism unreachable: ${errorText(retryError)}`);
      }
    }

    if (!response.ok) {
      const bodyText = await response.text().catch(() => "");
      throw new Error(
        `Prism API error: ${response.status} ${bodyText.slice(0, 500)}`,
      );
    }

    return response;
  }

  /** JSON request against a Prism endpoint. */
  async request(
    endpoint: string,
    options: PrismRequestOptions = {},
  ): Promise<PrismResponse> {
    const response = await this.requestRaw(endpoint, options);
    return (await response.json()) as PrismResponse;
  }

  // ── Chat / agent ────────────────────────────────────────────

  /** Text or image generation via /chat (non-streaming). */
  async chat({
    username,
    timeoutMs,
    skipConversation = true,
    ...body
  }: PrismChatParams): Promise<PrismResponse> {
    return this.request("/chat?stream=false", {
      body: pruneUndefined({ ...body, skipConversation }),
      username,
      timeoutMs,
    });
  }

  /** Full agentic loop with server-side tool calling via /agent (non-streaming). */
  async agent({
    username,
    timeoutMs,
    skipConversation = true,
    ...body
  }: PrismAgentParams): Promise<PrismResponse> {
    return this.request("/agent?stream=false", {
      body: pruneUndefined({ ...body, skipConversation }),
      username,
      timeoutMs,
    });
  }

  // ── Audio ───────────────────────────────────────────────────

  /** Transcribe audio via /audio-to-text. */
  async transcribeAudio({
    audio,
    mimeType = "audio/mpeg",
    username,
    timeoutMs,
    ...rest
  }: PrismTranscribeParams): Promise<PrismResponse> {
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
  async textToSpeech({
    username,
    timeoutMs,
    skipConversation = true,
    ...body
  }: PrismTextToSpeechParams): Promise<PrismSpeechResult> {
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
  async embed({
    username,
    timeoutMs,
    ...body
  }: PrismEmbedParams): Promise<PrismResponse> {
    return this.request("/embed", {
      body: pruneUndefined({ ...body }),
      username,
      timeoutMs,
    });
  }

  /** Extract and store memories from a conversation chunk via /memory/extract. */
  async extractMemories({
    username,
    timeoutMs,
    ...body
  }: PrismMemoryExtractParams): Promise<PrismResponse> {
    return this.request("/memory/extract", {
      body: pruneUndefined({ ...body }),
      username,
      timeoutMs,
    });
  }

  /** Vector-similarity memory search via /memory/search. */
  async searchMemories({
    username,
    timeoutMs,
    limit = 10,
    userIds,
    ...body
  }: PrismMemorySearchParams): Promise<PrismResponse> {
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
  async health(timeoutMs = 3_000): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        signal: AbortSignal.timeout(timeoutMs),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /** Fetch global user settings from /settings. Returns null on failure. */
  async getSettings(
    timeoutMs = 3_000,
  ): Promise<Record<string, unknown> | null> {
    try {
      const response = await this.requestRaw("/settings", {
        method: "GET",
        timeoutMs,
      });
      return (await response.json()) as Record<string, unknown>;
    } catch (error: unknown) {
      this.logger.error(
        `[PrismApiClient] getSettings failed: ${errorText(error)}`,
      );
      return null;
    }
  }
}

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function pruneUndefined(
  body: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(body).filter(([, value]) => value !== undefined),
  );
}
