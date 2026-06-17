/**
 * Parse an integer query param with a default fallback and optional max clamp.
 */
export declare function parseIntParam(value: string | undefined | null, defaultValue: number, max?: number): number;
/**
 * Safely parse a price string like "$29.99" or "29.99" into a number.
 */
export declare function parsePrice(priceString: string | null | undefined): number | null;
/**
 * Validate that a string value does not exceed a maximum length.
 * Returns an error message string if exceeded, or null if valid.
 */
export declare function validateMaxLength(value: string | null | undefined, maxLength: number, label: string): string | null;
/**
 * Safely parse a JSON string, returning a fallback on failure.
 */
export declare function parseJsonSafe<T = unknown>(jsonString: string | null | undefined, fallback?: T | null): T | null;
export interface TransformedJsonObject {
    [key: string]: unknown;
}
export type TransformedJson = TransformedJsonObject | unknown[] | null;
/**
 * Parse JSON from an LLM response, handling markdown code blocks.
 * Many LLMs wrap JSON in ```json ... ``` — this strips that before parsing.
 */
export declare function parseJsonFromLargeLanguageModelResponse(text: string | null | undefined): TransformedJson;
/**
 * Check if a string is a valid email address.
 * Uses a practical regex covering 99.9% of real-world addresses
 * (not the full RFC 5322 grammar, which is deliberately over-broad).
 */
export declare function isEmail(text: string | null | undefined): boolean;
/**
 * Check if a string is a valid HTTP(S) URL.
 * Uses the URL constructor for spec-compliant parsing.
 */
export interface IsUrlOptions {
    requireHttps?: boolean;
}
export declare function isUrl(text: string | null | undefined, { requireHttps }?: IsUrlOptions): boolean;
/**
 * Check if a value is numeric (finite number or numeric string).
 * e.g. isNumeric("3.14") → true, isNumeric("abc") → false, isNumeric(NaN) → false
 */
export declare function isNumeric(value: unknown): boolean;
//# sourceMappingURL=validation.d.ts.map