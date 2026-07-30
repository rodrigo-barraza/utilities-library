import { describe, it, expect, afterAll } from "vitest";
import http from "node:http";
import type { AddressInfo } from "node:net";
import {
  createService,
  CORS_PREFLIGHT_MAX_AGE_SECONDS,
} from "../../src/service/createService.js";

// ── Helpers ────────────────────────────────────────────────

const ORIGIN = "https://games.rod.dev";

// Boots the chassis without binding its configured port, then serves
// the returned app on an ephemeral one so the assertions run against
// real response headers rather than a mocked `res`.
async function startService() {
  const { app } = await createService({
    name: "cors-test",
    port: 0,
    listen: false,
    cors: [ORIGIN],
  });

  const server = http.createServer(app as never);
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address() as AddressInfo;

  return {
    url: `http://127.0.0.1:${port}`,
    close: () =>
      new Promise<void>((resolve) => {
        server.close(() => resolve());
      }),
  };
}

const service = await startService();
afterAll(() => service.close());

// ── Access-Control-Max-Age ─────────────────────────────────

describe("CORS preflight caching", () => {
  it("sends Access-Control-Max-Age on the preflight", async () => {
    const response = await fetch(`${service.url}/health`, {
      method: "OPTIONS",
      headers: {
        Origin: ORIGIN,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type",
      },
    });

    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-max-age")).toBe("600");
    expect(response.headers.get("access-control-max-age")).toBe(
      String(CORS_PREFLIGHT_MAX_AGE_SECONDS),
    );
  });

  it("omits Access-Control-Max-Age on a non-preflight response", async () => {
    const response = await fetch(`${service.url}/health`, {
      method: "GET",
      headers: { Origin: ORIGIN },
    });

    expect(response.headers.get("access-control-max-age")).toBeNull();
    // The CORS middleware still ran — so the assertion above is about
    // Max-Age being scoped to the preflight, not about it being skipped.
    expect(response.headers.get("access-control-allow-origin")).toBe(ORIGIN);
  });

  it("stays inside every engine's preflight cache ceiling", () => {
    // Chromium honours up to 7200 and Firefox up to 86400; Safari caps
    // lower than either. Raising this past 600 makes the effective TTL
    // differ per browser and lets a stale CORS policy live longer, so
    // the value stays under every ceiling rather than chasing the max.
    expect(CORS_PREFLIGHT_MAX_AGE_SECONDS).toBeLessThanOrEqual(600);
    expect(CORS_PREFLIGHT_MAX_AGE_SECONDS).toBeGreaterThan(5);
  });
});
