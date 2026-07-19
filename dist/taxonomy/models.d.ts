/** Shared default model ids. Keep in sync with prism-service's registry. */
export declare const MODEL_IDS: {
    /** Default fast text model (lupos-bot chat). */
    readonly geminiFlash: "gemini-3-flash-preview";
    /** Default vision/analysis model (tools-service creative). */
    readonly geminiFlashVision: "gemini-3.5-flash";
    /** Fast image generation/editing (lupos-bot). */
    readonly geminiImageFlash: "gemini-3.1-flash-image-preview";
    /** High-quality image generation (tools-service creative). */
    readonly geminiImagePro: "gemini-3-pro-image-preview";
    /** OpenAI image generation (lupos-bot, rod-dev-client). */
    readonly gptImage: "gpt-image-1.5";
    /** Default agentic/scheduler model (tools-service). */
    readonly claudeSonnet: "claude-sonnet-4-5-20250929";
};
export type ModelIdKey = keyof typeof MODEL_IDS;
//# sourceMappingURL=models.d.ts.map