// ─────────────────────────────────────────────────────────────
// Media — Private Network URL Sanitization
// ─────────────────────────────────────────────────────────────

import { getMinioInternalUrl } from "./environment.ts";

const PUBLIC_MEDIA_PATH = "/api/media";

/**
 * Rewrite every private MinIO URL in `text` to the public media proxy.
 * With no MinIO URL configured this is a no-op — `replaceAll("")` would
 * otherwise insert the proxy path between every character.
 */
export function rewritePrivateUrls(text: string, internalUrl?: string): string {
  const baseInternalUrl = internalUrl || getMinioInternalUrl() || "";
  if (!baseInternalUrl) return text;
  return text.replaceAll(baseInternalUrl, PUBLIC_MEDIA_PATH);
}

/**
 * `rewritePrivateUrls` over a byte stream. A URL can straddle two
 * chunks, so the last `url.length - 1` characters of each chunk are
 * held back until the next one (or the end) arrives.
 */
export function rewriteStream(stream: ReadableStream<Uint8Array>, internalUrl?: string): ReadableStream<Uint8Array> {
  const baseInternalUrl = internalUrl || getMinioInternalUrl() || "";
  if (!baseInternalUrl) return stream;

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const holdBack = baseInternalUrl.length - 1;
  let pending = "";

  return stream.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        const text = rewritePrivateUrls(pending + decoder.decode(chunk, { stream: true }), baseInternalUrl);
        const cut = Math.max(0, text.length - holdBack);
        pending = text.slice(cut);
        if (cut > 0) controller.enqueue(encoder.encode(text.slice(0, cut)));
      },
      flush(controller) {
        const text = rewritePrivateUrls(pending + decoder.decode(), baseInternalUrl);
        if (text) controller.enqueue(encoder.encode(text));
      },
    }),
  );
}
