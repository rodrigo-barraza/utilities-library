export declare function applyStatic(el: HTMLElement, { intensity }?: {
    intensity?: number | undefined;
}): () => void;
export declare function applyChromaticAberration(el: HTMLElement, { offset, intensity, animated }?: {
    offset?: number | undefined;
    intensity?: number | undefined;
    animated?: boolean | undefined;
}): () => void;
export declare function applyScanlines(el: HTMLElement, { intensity, gap, rolling }?: {
    intensity?: number | undefined;
    gap?: number | undefined;
    rolling?: boolean | undefined;
}): () => void;
export declare function applyGlitch(el: HTMLElement, { subtle }?: {
    subtle?: boolean | undefined;
}): () => void;
export declare function applyVhsTracking(el: HTMLElement): () => void;
export declare function applyHueRotate(el: HTMLElement, { duration }?: {
    duration?: number | undefined;
}): () => void;
export declare function applyShimmer(el: HTMLElement, { intensity, duration }?: {
    intensity?: number | undefined;
    duration?: number | undefined;
}): () => void;
export declare function applyDissolve(el: HTMLElement, { duration }?: {
    duration?: number | undefined;
}): () => void;
export declare function applyVignette(el: HTMLElement, { intensity }?: {
    intensity?: number | undefined;
}): () => void;
export declare function applyFlicker(el: HTMLElement, { duration, minOpacity }?: {
    duration?: number | undefined;
    minOpacity?: number | undefined;
}): () => void;
export declare function applyCRT(el: HTMLElement, { scanIntensity, vignetteIntensity, noiseIntensity }?: {
    scanIntensity?: number | undefined;
    vignetteIntensity?: number | undefined;
    noiseIntensity?: number | undefined;
}): () => void;
export declare function composeEffects(el: HTMLElement, fns: Array<(el: HTMLElement) => () => void>): () => void;
//# sourceMappingURL=effects.d.ts.map