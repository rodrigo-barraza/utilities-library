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
export declare function parseHex(hex: string): RGBA;
export declare function toHex({ r, g, b }: RGB): string;
export declare function lerpColor(colorA: string, colorB: string, interpolationFactor: number): string;
export declare function rgbToHsl({ r: redInput, g: greenInput, b: blueInput }: RGB): HSL;
export declare function hslToRgb({ h: hueInput, s: saturationInput, l: lightnessInput }: HSL): RGB;
export declare function adjustBrightness(hex: string, amount: number): string;
export type RgbTriplet = [number, number, number];
export declare function lerpRgb(colorA: RgbTriplet, colorB: RgbTriplet, interpolationValue: number): RgbTriplet;
export declare function paletteAt(colors: RgbTriplet[], position: number): RgbTriplet;
//# sourceMappingURL=color.d.ts.map