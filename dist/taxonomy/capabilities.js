// ─────────────────────────────────────────────────────────────
// Capabilities — Provider-native tool/feature capability taxonomy
// ─────────────────────────────────────────────────────────────
// Single source of truth for the DISPLAY metadata of provider-native
// agent capabilities (web search, code execution, …). These are NOT
// our custom tool names (see ./tools.ts TOOL_NAMES) — they are the
// keys Anthropic/OpenAI/Google APIs use, mapped to one canonical
// display name + short label + emoji + color.
//
// Previously forked across prism-service/RequestLogger (API_TO_CANONICAL)
// and prism-client (TOOL_DISPLAY_NAMES / TOOL_SHORT_NAMES / TOOL_COLORS /
// CAPABILITY_EMOJI_FALLBACKS). React icon components stay client-side but
// key off the same canonical display names below.
// ─────────────────────────────────────────────────────────────
/** Canonical capabilities keyed by a stable programmatic key. */
export const CAPABILITIES = {
    thinking: { name: "Thinking", short: "Think", emoji: "🧠", color: "oklch(0.769 0.177 90.046)" },
    toolCalling: { name: "Tool Calling", short: "Tool", emoji: "🛠️", color: "oklch(0.692 0.218 36.634)" },
    webSearch: { name: "Web Search", short: "Web", emoji: "🌐", color: "oklch(0.588 0.158 241.966)" },
    googleSearch: { name: "Google Search", short: "Web", emoji: "🌐", color: "oklch(0.588 0.158 241.966)" },
    webFetch: { name: "Web Fetch", short: "Web", emoji: "🌐", color: "oklch(0.588 0.158 241.966)" },
    codeExecution: { name: "Code Execution", short: "Code", emoji: "⚡", color: "oklch(0.606 0.25 293.528)" },
    computerUse: { name: "Computer Use", short: "Computer", emoji: "🖥️", color: "oklch(0.705 0.191 165.574)" },
    fileSearch: { name: "File Search", short: "File", emoji: "🔍", color: "oklch(0.553 0.013 255.487)" },
    urlContext: { name: "URL Context", short: "URL", emoji: "🔗", color: "oklch(0.697 0.148 209.91)" },
    imageGeneration: { name: "Image Generation", short: "Image", emoji: "🖼️", color: "oklch(0.627 0.226 28.324)" },
};
/**
 * Provider-native alias (camelCase and snake_case variants across
 * Anthropic/OpenAI/Google) → canonical display name. Superset of the
 * former prism-service API_TO_CANONICAL map.
 */
export const CAPABILITY_ALIASES = {
    googleSearch: CAPABILITIES.googleSearch.name,
    googleSearchRetrieval: CAPABILITIES.googleSearch.name,
    web_search: CAPABILITIES.webSearch.name,
    webSearch: CAPABILITIES.webSearch.name,
    web_fetch: CAPABILITIES.webFetch.name,
    webFetch: CAPABILITIES.webFetch.name,
    code_execution: CAPABILITIES.codeExecution.name,
    codeExecution: CAPABILITIES.codeExecution.name,
    computer_use: CAPABILITIES.computerUse.name,
    computerUse: CAPABILITIES.computerUse.name,
    file_search: CAPABILITIES.fileSearch.name,
    fileSearch: CAPABILITIES.fileSearch.name,
    url_context: CAPABILITIES.urlContext.name,
    urlContext: CAPABILITIES.urlContext.name,
    thinking: CAPABILITIES.thinking.name,
    image_generation: CAPABILITIES.imageGeneration.name,
    imageGeneration: CAPABILITIES.imageGeneration.name,
};
// Convenience maps keyed by canonical display name (how the client UI keys them).
const byName = Object.values(CAPABILITIES);
export const CAPABILITY_DISPLAY_NAMES = Object.fromEntries(byName.map((c) => [c.name, c.name]));
export const CAPABILITY_SHORT_NAMES = Object.fromEntries(byName.map((c) => [c.name, c.short]));
export const CAPABILITY_EMOJI = Object.fromEntries(byName.map((c) => [c.name, c.emoji]));
export const CAPABILITY_COLORS = Object.fromEntries(byName.map((c) => [c.name, c.color]));
/**
 * Resolve any provider-native alias OR canonical display name to its
 * capability metadata. Returns undefined for unknown inputs.
 */
export function resolveCapability(nameOrAlias) {
    const canonicalName = CAPABILITY_ALIASES[nameOrAlias] ?? nameOrAlias;
    return byName.find((c) => c.name === canonicalName);
}
/** Resolve to a canonical display name (identity if already canonical/unknown). */
export function resolveCapabilityName(nameOrAlias) {
    return CAPABILITY_ALIASES[nameOrAlias] ?? nameOrAlias;
}
//# sourceMappingURL=capabilities.js.map