// ─────────────────────────────────────────────────────────────
// Provider Constants — single source of truth for AI provider
// identifiers, display labels, and classification helpers
// shared across prism-service and prism-client.
// ─────────────────────────────────────────────────────────────
export const PROVIDERS = {
    OPENAI: "openai",
    ANTHROPIC: "anthropic",
    GOOGLE: "google",
    ELEVENLABS: "elevenlabs",
    INWORLD: "inworld",
    LM_STUDIO: "lm-studio",
    VLLM: "vllm",
    OLLAMA: "ollama",
    LLAMA_CPP: "llama-cpp",
};
export const PROVIDER_LIST = Object.values(PROVIDERS);
/** All recognized local (self-hosted) provider type identifiers. */
export const LOCAL_PROVIDER_TYPES = new Set([
    PROVIDERS.LM_STUDIO,
    PROVIDERS.VLLM,
    PROVIDERS.OLLAMA,
    PROVIDERS.LLAMA_CPP,
]);
/** Human-readable display labels for provider IDs. */
export const PROVIDER_LABELS = {
    [PROVIDERS.OPENAI]: "OpenAI",
    [PROVIDERS.ANTHROPIC]: "Anthropic",
    [PROVIDERS.GOOGLE]: "Google",
    [PROVIDERS.ELEVENLABS]: "ElevenLabs",
    [PROVIDERS.INWORLD]: "Inworld",
    [PROVIDERS.LM_STUDIO]: "LM Studio",
    [PROVIDERS.VLLM]: "vLLM",
    [PROVIDERS.OLLAMA]: "Ollama",
    [PROVIDERS.LLAMA_CPP]: "llama.cpp",
};
/** Check whether a provider ID belongs to a local/self-hosted provider. */
export function isLocalProvider(provider) {
    return LOCAL_PROVIDER_TYPES.has(provider);
}
/**
 * Resolve a potentially numbered instance ID to its base provider type.
 * e.g. "lm-studio-2" → "lm-studio", "ollama" → "ollama"
 */
export function resolveProviderBaseType(instanceId) {
    if (!instanceId)
        return "";
    if (PROVIDER_LIST.includes(instanceId))
        return instanceId;
    const match = instanceId.match(/^(.+)-(\d+)$/);
    if (match && PROVIDER_LIST.includes(match[1]))
        return match[1];
    return instanceId;
}
//# sourceMappingURL=providers.js.map