import { describe, it, expect, afterEach, vi } from "vitest";
import { rewritePrivateUrls, rewriteStream } from "../media.js";
const MINIO = "http://192.168.1.100:9000";
async function collect(chunks, internalUrl) {
    const encoder = new TextEncoder();
    const source = new ReadableStream({
        start(controller) {
            for (const chunk of chunks)
                controller.enqueue(encoder.encode(chunk));
            controller.close();
        },
    });
    return new Response(rewriteStream(source, internalUrl)).text();
}
afterEach(() => {
    vi.unstubAllEnvs();
});
describe("rewritePrivateUrls", () => {
    it("rewrites the MinIO origin to the media proxy", () => {
        expect(rewritePrivateUrls(`{"url":"${MINIO}/discord-media/a.png"}`, MINIO)).toBe('{"url":"/api/media/discord-media/a.png"}');
    });
    it("leaves text alone when no MinIO URL is configured", () => {
        vi.stubEnv("MINIO_INTERNAL_URL", "");
        expect(rewritePrivateUrls('{"count":0}')).toBe('{"count":0}');
    });
});
describe("rewriteStream", () => {
    it("rewrites a URL split across chunks", async () => {
        const body = `data: {"url":"${MINIO}/discord-media/a.png"}\n\n`;
        const splitAt = body.indexOf("168");
        expect(await collect([body.slice(0, splitAt), body.slice(splitAt)], MINIO)).toBe('data: {"url":"/api/media/discord-media/a.png"}\n\n');
    });
    it("passes every byte through, one chunk per character", async () => {
        const body = `a ${MINIO}/x b ${MINIO}/y c`;
        expect(await collect([...body], MINIO)).toBe("a /api/media/x b /api/media/y c");
    });
    it("is the stream itself when no MinIO URL is configured", async () => {
        vi.stubEnv("MINIO_INTERNAL_URL", "");
        expect(await collect(["event: init\n", "data: {}\n\n"])).toBe("event: init\ndata: {}\n\n");
    });
});
//# sourceMappingURL=media.test.js.map