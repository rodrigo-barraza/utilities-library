import { afterEach, describe, expect, it } from "vitest";
import type { Server } from "node:http";
import type { RequestHandler } from "express";
import { createService } from "../service/createService.ts";

// ─── The body-parsing slot ───────────────────────────────────
//
// `createService` mounts one `express.json` at `bodyLimit` ahead of every
// router; `bodyParser` is the service's own middleware in that same slot.
// Both are driven here through a real listener, because the property under
// test is WHERE the parser sits (after CORS, before the routes) and what a
// route then finds in `req.body` — neither of which a unit of the option
// alone can see.

const servers: Server[] = [];
afterEach(async () => {
  for (const server of servers.splice(0)) {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

async function standUp(config: { bodyLimit?: string; bodyParser?: RequestHandler }) {
  const router = (await import("express")).default.Router();
  router.post("/echo", (req, res) => {
    res.json({ body: req.body ?? null });
  });
  const { app } = await createService({
    name: "slot-under-test",
    port: 0,
    listen: false,
    routes: [{ path: "/t", router }],
    ...config,
  });
  const server = await new Promise<Server>((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  servers.push(server);
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  return `http://127.0.0.1:${port}`;
}

const post = (base: string, body: string) =>
  fetch(`${base}/t/echo`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });

describe("createService's body-parsing slot", () => {
  it("parses JSON with its own express.json at bodyLimit when no parser is given", async () => {
    const base = await standUp({ bodyLimit: "1kb" });
    const small = await post(base, JSON.stringify({ hello: "there" }));
    expect(small.status).toBe(200);
    expect(await small.json()).toEqual({ body: { hello: "there" } });
    // …and refuses past the limit, which is the behaviour every consumer
    // already leans on.
    const big = await post(base, JSON.stringify({ blob: "x".repeat(2048) }));
    expect(big.status).toBe(413);
  });

  it("mounts the service's bodyParser in that slot and reads nothing else", async () => {
    let seen = 0;
    const mine: RequestHandler = (req, _res, next) => {
      seen += 1;
      req.body = { parsedBy: "the service", method: req.method };
      next();
    };
    // A `bodyLimit` beside it is deliberately ignored: the slot holds one
    // parser, and the service's is it.
    const base = await standUp({ bodyLimit: "1kb", bodyParser: mine });
    const answer = await post(base, JSON.stringify({ blob: "x".repeat(4096) }));
    expect(answer.status).toBe(200);
    expect(await answer.json()).toEqual({
      body: { parsedBy: "the service", method: "POST" },
    });
    expect(seen).toBe(1);
  });
});
