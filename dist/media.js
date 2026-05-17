// ─────────────────────────────────────────────────────────────
// Media — Private Network URL Sanitization
// ─────────────────────────────────────────────────────────────
/**
 * Replace all occurrences of the internal MinIO URL with the
 * public-facing `/api/media` proxy path in a string.
 */
export function rewritePrivateUrls(text, internalUrl) {
    const base = internalUrl || process.env.MINIO_INTERNAL_URL || "";
    return text.replaceAll(base, "/api/media");
}
/**
 * Wrap a ReadableStream to rewrite private URLs on the fly.
 */
export function rewriteStream(stream, internalUrl) {
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    return stream.pipeThrough(new TransformStream({
        transform(chunk, controller) {
            const text = decoder.decode(chunk, { stream: true });
            controller.enqueue(encoder.encode(rewritePrivateUrls(text, internalUrl)));
        },
        flush(controller) {
            const remaining = decoder.decode();
            if (remaining) {
                controller.enqueue(encoder.encode(rewritePrivateUrls(remaining, internalUrl)));
            }
        },
    }));
}
//# sourceMappingURL=media.js.map