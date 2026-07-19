// ─────────────────────────────────────────────────────────────
// Models — Canonical default model ids used outside prism-service
// ─────────────────────────────────────────────────────────────
// Prism-service's provider registry is the runtime source of truth
// for what models exist; these constants exist so the handful of
// repos that must name a DEFAULT model (lupos-bot, tools-service,
// rod-dev-client) share one definition instead of scattering
// string literals. Update here when a default is bumped.
// ─────────────────────────────────────────────────────────────

/** Shared default model ids. Keep in sync with prism-service's registry. */
export const MODEL_IDS = {
  /** Default fast text model (lupos-bot chat). */
  geminiFlash: "gemini-3-flash-preview",
  /** Default vision/analysis model (tools-service creative). */
  geminiFlashVision: "gemini-3.5-flash",
  /** Fast image generation/editing (lupos-bot). */
  geminiImageFlash: "gemini-3.1-flash-image-preview",
  /** High-quality image generation (tools-service creative). */
  geminiImagePro: "gemini-3-pro-image-preview",
  /** OpenAI image generation (lupos-bot, rod-dev-client). */
  gptImage: "gpt-image-1.5",
  /** Default agentic/scheduler model (tools-service). */
  claudeSonnet: "claude-sonnet-4-5-20250929",
} as const;

export type ModelIdKey = keyof typeof MODEL_IDS;
