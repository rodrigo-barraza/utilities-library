/**
 * Copy text to clipboard with error handling.
 * Uses the modern Clipboard API with a legacy execCommand fallback
 * for insecure contexts (plain HTTP on non-localhost origins).
 * Returns true on success, false on failure (including SSR).
 */
export declare function copyToClipboard(text: string): Promise<boolean>;
//# sourceMappingURL=dom.d.ts.map