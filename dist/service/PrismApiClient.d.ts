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
    images?: Array<{
        data?: string;
        mimeType?: string;
        minioRef?: string;
    }>;
    audio?: Array<{
        data?: string;
        mimeType?: string;
        minioRef?: string;
    }>;
    audioRef?: string;
    toolCalls?: Array<{
        id: string;
        type: string;
        function: {
            name: string;
            arguments: string;
        };
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
export declare class PrismApiClient {
    private readonly baseUrl;
    private readonly project;
    private readonly defaultUsername;
    private readonly apiSecret?;
    private readonly getExtraHeaders?;
    private readonly defaultTimeoutMs;
    private readonly retryOnNetworkError;
    private readonly logger;
    constructor(config: PrismApiClientConfig);
    private headers;
    /**
     * Raw request against a Prism endpoint. Prefer the typed methods; this is
     * the escape hatch for endpoints the client doesn't model yet. Returns the
     * raw `Response` so callers can consume JSON or binary streams.
     */
    requestRaw(endpoint: string, { method, body, username, timeoutMs, }?: PrismRequestOptions): Promise<Response>;
    /** JSON request against a Prism endpoint. */
    request(endpoint: string, options?: PrismRequestOptions): Promise<PrismResponse>;
    /** Text or image generation via /chat (non-streaming). */
    chat({ username, timeoutMs, skipConversation, ...body }: PrismChatParams): Promise<PrismResponse>;
    /** Full agentic loop with server-side tool calling via /agent (non-streaming). */
    agent({ username, timeoutMs, skipConversation, ...body }: PrismAgentParams): Promise<PrismResponse>;
    /** Transcribe audio via /audio-to-text. */
    transcribeAudio({ audio, mimeType, username, timeoutMs, ...rest }: PrismTranscribeParams): Promise<PrismResponse>;
    /**
     * Generate speech via /text-to-audio. Collects the binary response into a
     * base64 buffer with its content type.
     */
    textToSpeech({ username, timeoutMs, skipConversation, ...body }: PrismTextToSpeechParams): Promise<PrismSpeechResult>;
    /** Generate an embedding vector via /embed. */
    embed({ username, timeoutMs, ...body }: PrismEmbedParams): Promise<PrismResponse>;
    /** Extract and store memories from a conversation chunk via /memory/extract. */
    extractMemories({ username, timeoutMs, ...body }: PrismMemoryExtractParams): Promise<PrismResponse>;
    /** Vector-similarity memory search via /memory/search. */
    searchMemories({ username, timeoutMs, limit, userIds, ...body }: PrismMemorySearchParams): Promise<PrismResponse>;
    /** Liveness probe against /health. Never throws. */
    health(timeoutMs?: number): Promise<boolean>;
    /** Fetch global user settings from /settings. Returns null on failure. */
    getSettings(timeoutMs?: number): Promise<Record<string, unknown> | null>;
}
//# sourceMappingURL=PrismApiClient.d.ts.map