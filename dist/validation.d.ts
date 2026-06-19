export declare function parseIntParam(value: string | undefined | null, defaultValue: number, max?: number): number;
export declare function parsePrice(priceString: string | null | undefined): number | null;
export declare function validateMaxLength(value: string | null | undefined, maxLength: number, label: string): string | null;
export declare function parseJsonSafe<T = unknown>(jsonString: string | null | undefined, fallback?: T | null): T | null;
export interface TransformedJsonObject {
    [key: string]: unknown;
}
export type TransformedJson = TransformedJsonObject | unknown[] | null;
export declare function parseJsonFromLargeLanguageModelResponse(text: string | null | undefined): TransformedJson;
export declare function isEmail(text: string | null | undefined): boolean;
export interface IsUrlOptions {
    requireHttps?: boolean;
}
export declare function isUrl(text: string | null | undefined, { requireHttps }?: IsUrlOptions): boolean;
export declare function isNumeric(value: unknown): boolean;
//# sourceMappingURL=validation.d.ts.map