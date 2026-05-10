// ─────────────────────────────────────────────────────────────
// Media — Private Network URL Sanitization
// ─────────────────────────────────────────────────────────────
// Rewrites internal MinIO URLs in API responses so browsers
// never attempt to load resources from private IP addresses.
// This prevents Chrome's Private Network Access (PNA) prompt.
//
// Before: http://localhost:9000/discord-media/media/<key>
// After:  /api/media/discord-media/media/<key>
// ─────────────────────────────────────────────────────────────

/**
 * Replace all occurrences of the internal MinIO URL with the
 * public-facing `/api/media` proxy path in a string.
 *
 * @param {string} text
 * @param {string} [internalUrl] - Override for MINIO_INTERNAL_URL
 * @returns {string}
 */
export function rewritePrivateUrls(text, internalUrl) {
  const base = internalUrl || process.env.MINIO_INTERNAL_URL || "http://localhost:9000";
  return text.replaceAll(base, "/api/media");
}

/**
 * Wrap a ReadableStream to rewrite private URLs on the fly.
 * Used for SSE streams that pipe data directly to the browser.
 *
 * @param {ReadableStream} stream
 * @param {string} [internalUrl] - Override for MINIO_INTERNAL_URL
 * @returns {ReadableStream}
 */
export function rewriteStream(stream, internalUrl) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return stream.pipeThrough(
    new TransformStream({
      transform(chunk, controller) {
        const text = decoder.decode(chunk, { stream: true });
        controller.enqueue(encoder.encode(rewritePrivateUrls(text, internalUrl)));
      },
      flush(controller) {
        // Flush any remaining bytes from the decoder
        const remaining = decoder.decode();
        if (remaining) {
          controller.enqueue(encoder.encode(rewritePrivateUrls(remaining, internalUrl)));
        }
      },
    }),
  );
}
