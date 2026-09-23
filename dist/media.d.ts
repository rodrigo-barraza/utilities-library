/**
 * Rewrite every private MinIO URL in `text` to the public media proxy.
 * With no MinIO URL configured this is a no-op — `replaceAll("")` would
 * otherwise insert the proxy path between every character.
 */
export declare function rewritePrivateUrls(text: string, internalUrl?: string): string;
/**
 * `rewritePrivateUrls` over a byte stream. A URL can straddle two
 * chunks, so the last `url.length - 1` characters of each chunk are
 * held back until the next one (or the end) arrives.
 */
export declare function rewriteStream(stream: ReadableStream<Uint8Array>, internalUrl?: string): ReadableStream<Uint8Array>;
//# sourceMappingURL=media.d.ts.map