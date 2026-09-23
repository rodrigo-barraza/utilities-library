import { afterEach, describe, expect, it, vi } from "vitest";
import { createNextjsProxy } from "../src/nextjs.ts";

afterEach(() => {
  vi.unstubAllGlobals();
});

function proxy() {
  const { GET } = createNextjsProxy({
    serviceName: "sessions",
    port: 5580,
    internalUrlEnvironmentVariable: "http://sessions.internal:5580",
    methods: ["GET"],
  });
  return (path: string) =>
    GET!(new Request(`https://site.example/api/sessions/${path}`), {
      params: Promise.resolve({ path: path.split("/") }),
    });
}

describe("createNextjsProxy", () => {
  it("keeps an upstream file's Cache-Control", async () => {
    const upstream = vi.fn(
      async () =>
        new Response("export {};", {
          headers: {
            "content-type": "text/javascript; charset=utf-8",
            "cache-control": "public, max-age=31536000, immutable",
            "x-internal": "dropped",
          },
        }),
    );
    vi.stubGlobal("fetch", upstream);

    const response = await proxy()("tracker/chunks/replay-ABC.js");

    expect(upstream).toHaveBeenCalledWith(
      "http://sessions.internal:5580/tracker/chunks/replay-ABC.js",
      expect.objectContaining({ method: "GET" }),
    );
    expect(response.headers.get("cache-control")).toBe(
      "public, max-age=31536000, immutable",
    );
    expect(response.headers.get("content-type")).toBe(
      "text/javascript; charset=utf-8",
    );
    expect(response.headers.get("x-internal")).toBeNull();
    expect(await response.text()).toBe("export {};");
  });
});
