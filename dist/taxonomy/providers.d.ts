export declare const PROVIDERS: {
    readonly OPENAI: "openai";
    readonly ANTHROPIC: "anthropic";
    readonly GOOGLE: "google";
    readonly ELEVENLABS: "elevenlabs";
    readonly INWORLD: "inworld";
    readonly MOONSHOT: "moonshot";
    readonly LM_STUDIO: "lm-studio";
    readonly VLLM: "vllm";
    readonly OLLAMA: "ollama";
    readonly LLAMA_CPP: "llama-cpp";
};
export type ProviderType = (typeof PROVIDERS)[keyof typeof PROVIDERS];
export declare const PROVIDER_LIST: ("anthropic" | "elevenlabs" | "google" | "inworld" | "llama-cpp" | "lm-studio" | "moonshot" | "ollama" | "openai" | "vllm")[];
/** All recognized local (self-hosted) provider type identifiers. */
export declare const LOCAL_PROVIDER_TYPES: Set<ProviderType>;
/** Human-readable display labels for provider IDs. */
export declare const PROVIDER_LABELS: Readonly<Record<string, string>>;
/** Check whether a provider ID belongs to a local/self-hosted provider. */
export declare function isLocalProvider(provider: string): boolean;
/**
 * Resolve a potentially numbered instance ID to its base provider type.
 * e.g. "lm-studio-2" → "lm-studio", "ollama" → "ollama"
 */
export declare function resolveProviderBaseType(instanceId: string): string;
//# sourceMappingURL=providers.d.ts.map