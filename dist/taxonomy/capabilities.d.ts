export interface CapabilityMeta {
    /** Canonical human-readable display name. */
    name: string;
    /** Abbreviated label for condensed UI. */
    short: string;
    /** Fallback emoji (real tool emojis come from the tools-service schema). */
    emoji: string;
    /** Accent color (oklch). */
    color: string;
}
/** Canonical capabilities keyed by a stable programmatic key. */
export declare const CAPABILITIES: {
    readonly thinking: {
        readonly name: "Thinking";
        readonly short: "Think";
        readonly emoji: "🧠";
        readonly color: "oklch(0.769 0.177 90.046)";
    };
    readonly toolCalling: {
        readonly name: "Tool Calling";
        readonly short: "Tool";
        readonly emoji: "🛠️";
        readonly color: "oklch(0.692 0.218 36.634)";
    };
    readonly webSearch: {
        readonly name: "Web Search";
        readonly short: "Web";
        readonly emoji: "🌐";
        readonly color: "oklch(0.588 0.158 241.966)";
    };
    readonly googleSearch: {
        readonly name: "Google Search";
        readonly short: "Web";
        readonly emoji: "🌐";
        readonly color: "oklch(0.588 0.158 241.966)";
    };
    readonly webFetch: {
        readonly name: "Web Fetch";
        readonly short: "Web";
        readonly emoji: "🌐";
        readonly color: "oklch(0.588 0.158 241.966)";
    };
    readonly codeExecution: {
        readonly name: "Code Execution";
        readonly short: "Code";
        readonly emoji: "⚡";
        readonly color: "oklch(0.606 0.25 293.528)";
    };
    readonly computerUse: {
        readonly name: "Computer Use";
        readonly short: "Computer";
        readonly emoji: "🖥️";
        readonly color: "oklch(0.705 0.191 165.574)";
    };
    readonly fileSearch: {
        readonly name: "File Search";
        readonly short: "File";
        readonly emoji: "🔍";
        readonly color: "oklch(0.553 0.013 255.487)";
    };
    readonly urlContext: {
        readonly name: "URL Context";
        readonly short: "URL";
        readonly emoji: "🔗";
        readonly color: "oklch(0.697 0.148 209.91)";
    };
    readonly imageGeneration: {
        readonly name: "Image Generation";
        readonly short: "Image";
        readonly emoji: "🖼️";
        readonly color: "oklch(0.627 0.226 28.324)";
    };
};
export type CapabilityKey = keyof typeof CAPABILITIES;
/**
 * Provider-native alias (camelCase and snake_case variants across
 * Anthropic/OpenAI/Google) → canonical display name. Superset of the
 * former prism-service API_TO_CANONICAL map.
 */
export declare const CAPABILITY_ALIASES: Record<string, string>;
export declare const CAPABILITY_DISPLAY_NAMES: Record<string, string>;
export declare const CAPABILITY_SHORT_NAMES: Record<string, string>;
export declare const CAPABILITY_EMOJI: Record<string, string>;
export declare const CAPABILITY_COLORS: Record<string, string>;
/**
 * Resolve any provider-native alias OR canonical display name to its
 * capability metadata. Returns undefined for unknown inputs.
 */
export declare function resolveCapability(nameOrAlias: string): CapabilityMeta | undefined;
/** Resolve to a canonical display name (identity if already canonical/unknown). */
export declare function resolveCapabilityName(nameOrAlias: string): string;
//# sourceMappingURL=capabilities.d.ts.map