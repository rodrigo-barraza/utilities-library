/**
 * Replace all occurrences of the internal MinIO URL with the
 * public-facing `/api/media` proxy path in a string.
 */
export declare function rewritePrivateUrls(text: string, internalUrl?: string): string;
/**
 * Wrap a ReadableStream to rewrite private URLs on the fly.
 */
export declare function rewriteStream(stream: ReadableStream<Uint8Array>, internalUrl?: string): ReadableStream<Uint8Array>;
//# sourceMappingURL=media.d.ts.map