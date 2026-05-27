export interface RGB {
    r: number;
    g: number;
    b: number;
}
export interface RGBA extends RGB {
    a: number;
}
export interface HSL {
    h: number;
    s: number;
    l: number;
}
/**
 * Parse a hex color string (#RGB, #RRGGBB, or #RRGGBBAA) into
 * an `{ r, g, b, a }` object with values in the 0–255 range
 * (alpha as 0–1).
 */
export declare function parseHex(hex: string): RGBA;
/**
 * Convert an `{ r, g, b }` object (0–255) to a hex color string.
 */
export declare function toHex({ r, g, b }: RGB): string;
/**
 * Linearly interpolate between two hex colors.
 */
export declare function lerpColor(colorA: string, colorB: string, t: number): string;
/**
 * Convert an `{ r, g, b }` object (0–255) to an HSL object.
 */
export declare function rgbToHsl({ r: redInput, g: greenInput, b: blueInput }: RGB): HSL;
/**
 * Convert an HSL object to `{ r, g, b }` (0–255).
 */
export declare function hslToRgb({ h: hueInput, s: saturationInput, l: lightnessInput }: HSL): RGB;
/**
 * Lighten or darken a hex color by a percentage.
 */
export declare function adjustBrightness(hex: string, amount: number): string;
//# sourceMappingURL=color.d.ts.map