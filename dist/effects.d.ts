export declare function applyStatic(element: HTMLElement, { intensity }?: {
    intensity?: number | undefined;
}): () => void;
export declare function applyChromaticAberration(element: HTMLElement, { offset, intensity, animated }?: {
    offset?: number | undefined;
    intensity?: number | undefined;
    animated?: boolean | undefined;
}): () => void;
export declare function applyScanlines(element: HTMLElement, { intensity, gap, rolling }?: {
    intensity?: number | undefined;
    gap?: number | undefined;
    rolling?: boolean | undefined;
}): () => void;
export declare function applyGlitch(element: HTMLElement, { subtle }?: {
    subtle?: boolean | undefined;
}): () => void;
export declare function applyVhsTracking(element: HTMLElement): () => void;
export declare function applyHueRotate(element: HTMLElement, { duration }?: {
    duration?: number | undefined;
}): () => void;
export declare function applyShimmer(element: HTMLElement, { intensity, duration }?: {
    intensity?: number | undefined;
    duration?: number | undefined;
}): () => void;
export declare function applyDissolve(element: HTMLElement, { duration }?: {
    duration?: number | undefined;
}): () => void;
export declare function applyVignette(element: HTMLElement, { intensity }?: {
    intensity?: number | undefined;
}): () => void;
export declare function applyFlicker(element: HTMLElement, { duration, minimumOpacity }?: {
    duration?: number | undefined;
    minimumOpacity?: number | undefined;
}): () => void;
export declare function applyCathodeRayTube(element: HTMLElement, { scanlineIntensity, vignetteIntensity, noiseIntensity }?: {
    scanlineIntensity?: number | undefined;
    vignetteIntensity?: number | undefined;
    noiseIntensity?: number | undefined;
}): () => void;
export declare function composeEffects(element: HTMLElement, effectFunctions: Array<(element: HTMLElement) => () => void>): () => void;
//# sourceMappingURL=effects.d.ts.map