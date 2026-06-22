// ─────────────────────────────────────────────────────────────
// Model Capability Patterns — substring-match lists used to
// detect capabilities (thinking, function calling, vision, etc.)
// from local model names.
//
// These are the canonical source of truth. prism-service uses
// them in detectCapabilities.ts and prism-client uses them as
// a fallback before the /config response arrives.
// ─────────────────────────────────────────────────────────────
/**
 * Models that support extended thinking / chain-of-thought reasoning.
 * Matched against the lowercased model key via substring inclusion.
 * Only include models whose GGUF/local variants emit native <think>
 * tags or structured reasoning traces before the final answer.
 */
export const THINKING_PATTERNS = [
    // Alibaba — Qwen family
    "qwen3",
    "qwq",
    // DeepSeek
    "deepseek-r1",
    "deepseek-v3",
    // OpenAI open-weight
    "gpt-oss",
    // Google
    "gemma-4",
    // MiniMax
    "minimax",
    // Microsoft — Phi-4 reasoning variants
    "phi4-reasoning",
    "phi-4-reasoning",
    // Alibaba — Marco-o1
    "marco-o1",
    // Skywork
    "skywork-o1",
    // LG AI Research — EXAONE Deep
    "exaone-deep",
    // Zhipu AI — GLM series (4+)
    "glm-4",
    "glm4",
    "glm-5",
    "glm5",
    // Deep Cogito — hybrid reasoning
    "cogito",
    // IBM — Granite reasoning variants
    "granite-reasoning",
    // Cognitive Computations — Dolphin R1 (reasoning-trained)
    "dolphin-r1",
    // Shanghai AI Lab — InternLM3 (deep thinking mode)
    "internlm3",
    // Moonshot AI — Kimi K2
    "kimi-k2",
];
//# sourceMappingURL=model-patterns.js.map