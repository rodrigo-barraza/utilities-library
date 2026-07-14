import { describe, it, expect } from "vitest";
import { createAuthMiddleware } from "../../src/service/AuthMiddleware.js";
import { IDENTITY_HEADERS, requestLocalStorage, getTraceHeaders } from "../../src/service/TraceContext.js";

function mockReq(headers: Record<string, string> = {}) {
  return {
    method: "GET",
    query: {},
    body: {},
    headers,
    ip: "127.0.0.1",
    path: "/test",
  };
}

describe("IDENTITY_HEADERS", () => {
  it("uses the canonical lowercase header names", () => {
    expect(IDENTITY_HEADERS.username).toBe("x-username");
    expect(IDENTITY_HEADERS.project).toBe("x-project");
    expect(IDENTITY_HEADERS.requestId).toBe("x-request-id");
    expect(IDENTITY_HEADERS.workspaceRoot).toBe("x-workspace-root");
  });
});

describe("createAuthMiddleware trace context", () => {
  it("resolves trace ids and workspace override onto req", () => {
    const middleware = createAuthMiddleware();
    const req = mockReq({
      "x-request-id": "req-1",
      "x-conversation-id": "conv-1",
      "x-iteration": "3",
      "x-workspace-override": "/tmp/worktree",
    });
    middleware(req as never, {} as never, () => {});
    const typed = req as never as Record<string, unknown>;
    expect(typed.requestId).toBe("req-1");
    expect(typed.conversationId).toBe("conv-1");
    expect(typed.iteration).toBe("3");
    expect(typed.workspaceOverride).toBe("/tmp/worktree");
  });

  it("invokes onResolved with the resolved identity", () => {
    let seen: Record<string, unknown> | undefined;
    const middleware = createAuthMiddleware({
      defaultUsername: "any",
      onResolved: (identity) => {
        seen = identity as never;
      },
    });
    middleware(mockReq({ "x-username": "rodrigo" }) as never, {} as never, () => {});
    expect(seen?.username).toBe("rodrigo");
    expect(seen?.clientIp).toBe("127.0.0.1");
  });

  it("traceContext: true exposes the store to getTraceHeaders inside handlers", () => {
    const middleware = createAuthMiddleware({ traceContext: true });
    let headers: Record<string, string> = {};
    middleware(
      mockReq({
        "x-request-id": "req-9",
        "x-conversation-id": "conv-9",
        "x-username": "rodrigo",
        "x-project": "prism",
      }) as never,
      {} as never,
      () => {
        headers = getTraceHeaders();
      },
    );
    expect(headers).toEqual({
      "x-request-id": "req-9",
      "x-conversation-id": "conv-9",
      "x-project": "prism",
      "x-username": "rodrigo",
    });
  });

  it("getTraceHeaders is empty outside a request context", () => {
    expect(requestLocalStorage.getStore()).toBeUndefined();
    expect(getTraceHeaders()).toEqual({});
  });

  it("omits unset values and accepts an explicit store", () => {
    expect(getTraceHeaders({ username: "rodrigo" })).toEqual({ "x-username": "rodrigo" });
  });
});
