// ─────────────────────────────────────────────────────────────
// Media — Private Network URL Sanitization
// ─────────────────────────────────────────────────────────────

export function rewritePrivateUrls(text: string, internalUrl?: string): string {
  const baseInternalUrl = internalUrl || process.env.MINIO_INTERNAL_URL || "";
  return text.replaceAll(baseInternalUrl, "/api/media");
}

export function rewriteStream(stream: ReadableStream<Uint8Array>, internalUrl?: string): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return stream.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
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
    }),
  );
}
