/**
 * Models that support extended thinking / chain-of-thought reasoning.
 * Matched against the lowercased model key via substring inclusion.
 * Only include models whose GGUF/local variants emit native <think>
 * tags or structured reasoning traces before the final answer.
 */
export declare const THINKING_PATTERNS: readonly ["qwen3", "qwq", "deepseek-r1", "deepseek-v3", "gpt-oss", "gemma-4", "minimax", "phi4-reasoning", "phi-4-reasoning", "marco-o1", "skywork-o1", "exaone-deep", "glm-4", "glm4", "glm-5", "glm5", "cogito", "granite-reasoning", "dolphin-r1", "internlm3", "kimi-k2"];
//# sourceMappingURL=model-patterns.d.ts.map