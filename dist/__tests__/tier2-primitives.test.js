import { describe, expect, it, vi } from "vitest";
import { retry } from "../async.js";
import { createTtlCache } from "../cache.js";
import { createDailyBudget, createCircuitBreaker } from "../rate.js";
import { escapeHtml, normalizeSearchText, toAlphanumeric } from "../text.js";
import { parseGitHubRepoInput, createGitHubClient } from "../github.js";
import { assertRequiredEnvironment } from "../environment.js";
describe("retry shouldRetry predicate", () => {
    it("stops immediately when shouldRetry rejects the error", async () => {
        const action = vi.fn(async () => {
            throw new Error("fatal");
        });
        await expect(retry(action, { retries: 3, delay: 1, shouldRetry: () => false })).rejects.toThrow("fatal");
        expect(action).toHaveBeenCalledTimes(1);
    });
    it("retries while shouldRetry accepts", async () => {
        const action = vi
            .fn()
            .mockRejectedValueOnce(new Error("transient"))
            .mockResolvedValueOnce("ok");
        await expect(retry(action, { retries: 3, delay: 1, shouldRetry: (e) => e.message === "transient" })).resolves.toBe("ok");
        expect(action).toHaveBeenCalledTimes(2);
    });
});
describe("createTtlCache", () => {
    it("caches within TTL and refetches after expiry", async () => {
        const cache = createTtlCache();
        const fetcher = vi.fn().mockResolvedValueOnce("a").mockResolvedValueOnce("b");
        await expect(cache.get("k", 10_000, fetcher)).resolves.toBe("a");
        await expect(cache.get("k", 10_000, fetcher)).resolves.toBe("a");
        expect(fetcher).toHaveBeenCalledTimes(1);
        await expect(cache.get("k", 0, fetcher)).resolves.toBe("b");
    });
    it("staleWhileRevalidate serves stale immediately and refreshes in background", async () => {
        const cache = createTtlCache({ staleWhileRevalidate: true });
        let resolveSecond;
        const fetcher = vi
            .fn()
            .mockResolvedValueOnce("old")
            .mockImplementationOnce(() => new Promise((resolve) => (resolveSecond = resolve)));
        await cache.get("k", 10_000, fetcher);
        await expect(cache.get("k", 0, fetcher)).resolves.toBe("old");
        resolveSecond("new");
        await new Promise((resolve) => setImmediate(resolve));
        await expect(cache.get("k", 10_000, fetcher)).resolves.toBe("new");
        expect(fetcher).toHaveBeenCalledTimes(2);
    });
    it("serveStaleOnError returns last good value when fetcher throws", async () => {
        const cache = createTtlCache({ serveStaleOnError: true });
        const fetcher = vi
            .fn()
            .mockResolvedValueOnce("good")
            .mockRejectedValueOnce(new Error("down"));
        await cache.get("k", 10_000, fetcher);
        await expect(cache.get("k", 0, fetcher)).resolves.toBe("good");
    });
    it("throws and clears the entry on error without serveStaleOnError", async () => {
        const cache = createTtlCache();
        const fetcher = vi
            .fn()
            .mockResolvedValueOnce("good")
            .mockRejectedValueOnce(new Error("down"));
        await cache.get("k", 10_000, fetcher);
        await expect(cache.get("k", 0, fetcher)).rejects.toThrow("down");
        expect(cache.peek("k")).toBeUndefined();
    });
});
describe("createDailyBudget", () => {
    it("caps consumption per UTC day and resets on rollover", () => {
        let clock = Date.UTC(2026, 6, 18, 23, 59, 0);
        const budget = createDailyBudget(2, () => clock);
        expect(budget.tryConsume()).toBe(true);
        expect(budget.tryConsume()).toBe(true);
        expect(budget.tryConsume()).toBe(false);
        expect(budget.remaining()).toBe(0);
        clock = Date.UTC(2026, 6, 19, 0, 1, 0);
        expect(budget.tryConsume()).toBe(true);
        expect(budget.used()).toBe(1);
    });
});
describe("createCircuitBreaker", () => {
    it("trips after the failure threshold and recovers after the duration", () => {
        let clock = 0;
        const breaker = createCircuitBreaker({
            tripDurationMilliseconds: 1000,
            failureThreshold: 3,
            now: () => clock,
        });
        breaker.recordFailure();
        breaker.recordFailure();
        expect(breaker.isOpen()).toBe(false);
        breaker.recordSuccess();
        breaker.recordFailure();
        breaker.recordFailure();
        breaker.recordFailure();
        expect(breaker.isOpen()).toBe(true);
        expect(breaker.openUntil()).toBe(1000);
        clock = 1001;
        expect(breaker.isOpen()).toBe(false);
    });
    it("supports manual trip and reset", () => {
        let clock = 0;
        const breaker = createCircuitBreaker({ tripDurationMilliseconds: 500, now: () => clock });
        breaker.trip();
        expect(breaker.isOpen()).toBe(true);
        breaker.reset();
        expect(breaker.isOpen()).toBe(false);
    });
});
describe("text helpers", () => {
    it("escapeHtml escapes the five entities and handles nullish", () => {
        expect(escapeHtml(`<a href="x">Tom & Jerry's</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/a&gt;");
        expect(escapeHtml(null)).toBe("");
        expect(escapeHtml(undefined)).toBe("");
    });
    it("normalizeSearchText keeps words, toAlphanumeric squashes", () => {
        expect(normalizeSearchText("St. John's, NL!")).toBe("st johns nl");
        expect(toAlphanumeric("St. John's, NL!")).toBe("stjohnsnl");
        expect(normalizeSearchText(null)).toBe("");
    });
});
describe("github helpers", () => {
    it("parses URLs, .git suffixes, and shorthand", () => {
        expect(parseGitHubRepoInput("https://github.com/foo/bar")).toEqual({ owner: "foo", repo: "bar" });
        expect(parseGitHubRepoInput("github.com/foo/bar.git/")).toEqual({ owner: "foo", repo: "bar" });
        expect(parseGitHubRepoInput("foo/bar")).toEqual({ owner: "foo", repo: "bar" });
        expect(parseGitHubRepoInput("not a repo")).toBeNull();
        expect(parseGitHubRepoInput(null)).toBeNull();
    });
    it("sends standard headers with optional bearer token", async () => {
        const fetchMock = vi.fn(async (_url, init) => {
            const headers = new Headers(init?.headers);
            expect(headers.get("Accept")).toBe("application/vnd.github.v3+json");
            expect(headers.get("Authorization")).toBe("Bearer tok");
            return new Response(JSON.stringify({ ok: true }), { status: 200 });
        });
        const client = createGitHubClient({
            token: "tok",
            fetchImplementation: fetchMock,
        });
        await expect(client.get("/repos/foo/bar")).resolves.toEqual({ ok: true });
        expect(fetchMock.mock.calls[0][0]).toBe("https://api.github.com/repos/foo/bar");
    });
});
describe("assertRequiredEnvironment", () => {
    it("aggregates all missing values into one error", () => {
        expect(() => assertRequiredEnvironment({ A: "set", B: "", C: undefined })).toThrow("[config] Missing required environment variable(s): B, C");
        expect(() => assertRequiredEnvironment({ A: "set" })).not.toThrow();
    });
});
//# sourceMappingURL=tier2-primitives.test.js.map