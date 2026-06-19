// ─────────────────────────────────────────────────────────────
// Media — Private Network URL Sanitization
// ─────────────────────────────────────────────────────────────
export function rewritePrivateUrls(text, internalUrl) {
    const baseInternalUrl = internalUrl || process.env.MINIO_INTERNAL_URL || "";
    return text.replaceAll(baseInternalUrl, "/api/media");
}
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