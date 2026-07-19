import { describe, expect, it, vi } from "vitest";
import { ApiError, createApiClient } from "../http.js";
function jsonResponse(body, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}
describe("createApiClient", () => {
    it("parses JSON bodies and joins URLs", async () => {
        const fetchMock = vi.fn(async (_url, _init) => jsonResponse({ ok: true }));
        const client = createApiClient("http://svc:1234/", {
            fetchImplementation: fetchMock,
        });
        await expect(client.get("/health")).resolves.toEqual({ ok: true });
        expect(fetchMock.mock.calls[0][0]).toBe("http://svc:1234/health");
    });
    it("throws ApiError with body.error message on non-2xx", async () => {
        const fetchMock = vi.fn(async () => jsonResponse({ error: "nope" }, 503));
        const client = createApiClient("http://svc", {
            fetchImplementation: fetchMock,
        });
        const error = await client.get("/x").catch((e) => e);
        expect(error).toBeInstanceOf(ApiError);
        expect(error.message).toBe("nope");
        expect(error.status).toBe(503);
    });
    it("does not retry by default", async () => {
        const fetchMock = vi.fn(async () => {
            throw new TypeError("fetch failed");
        });
        const client = createApiClient("http://svc", {
            fetchImplementation: fetchMock,
        });
        await expect(client.get("/x")).rejects.toThrow("fetch failed");
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
    it("retries transient network errors when retry is enabled", async () => {
        const fetchMock = vi
            .fn()
            .mockRejectedValueOnce(new TypeError("fetch failed"))
            .mockResolvedValueOnce(jsonResponse({ ok: true }));
        const client = createApiClient("http://svc", {
            fetchImplementation: fetchMock,
            retry: { delayMilliseconds: 1, jitterMilliseconds: 0 },
        });
        await expect(client.get("/x")).resolves.toEqual({ ok: true });
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });
    it("does not retry HTTP errors with the default predicate", async () => {
        const fetchMock = vi.fn(async () => jsonResponse({ error: "boom" }, 500));
        const client = createApiClient("http://svc", {
            fetchImplementation: fetchMock,
            retry: { delayMilliseconds: 1, jitterMilliseconds: 0 },
        });
        await expect(client.get("/x")).rejects.toThrow("boom");
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
    it("honors a custom shouldRetry predicate for HTTP errors", async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(jsonResponse({ error: "busy" }, 503))
            .mockResolvedValueOnce(jsonResponse({ ok: true }));
        const client = createApiClient("http://svc", {
            fetchImplementation: fetchMock,
            retry: {
                delayMilliseconds: 1,
                jitterMilliseconds: 0,
                shouldRetry: (error) => error instanceof ApiError && error.status === 503,
            },
        });
        await expect(client.get("/x")).resolves.toEqual({ ok: true });
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });
    it("requestRaw returns the raw response without throwing on non-2xx", async () => {
        const fetchMock = vi.fn(async () => new Response("stream", { status: 502 }));
        const client = createApiClient("http://svc", {
            fetchImplementation: fetchMock,
        });
        const response = await client.requestRaw("/agent");
        expect(response.status).toBe(502);
        await expect(response.text()).resolves.toBe("stream");
    });
    it("serializes JSON bodies and sets Content-Type", async () => {
        const fetchMock = vi.fn(async (_url, _init) => jsonResponse({ ok: true }));
        const client = createApiClient("http://svc", {
            fetchImplementation: fetchMock,
        });
        await client.post("/x", { a: 1 });
        const init = fetchMock.mock.calls[0][1];
        expect(init.body).toBe(JSON.stringify({ a: 1 }));
        expect(new Headers(init.headers).get("Content-Type")).toBe("application/json");
    });
    it("applies per-request timeout override as an abort signal", async () => {
        const fetchMock = vi.fn(async (_url, init) => {
            expect(init.signal).toBeInstanceOf(AbortSignal);
            return jsonResponse({ ok: true });
        });
        const client = createApiClient("http://svc", {
            fetchImplementation: fetchMock,
        });
        await client.get("/x", { timeoutMilliseconds: 5000 });
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=http.test.js.map