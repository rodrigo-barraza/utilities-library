export function mockReq(overrides: Record<string, unknown> = {}) {
  return {
    method: "GET",
    query: {},
    body: {},
    headers: {},
    ip: "127.0.0.1",
    path: "/test",
    ...overrides,
  };
}

export function mockRes() {
  const responsePayload: Record<string, unknown> = {
    _status: null,
    _json: null,
    status(code: number) {
      responsePayload._status = code;
      return responsePayload;
    },
    json(data: unknown) {
      responsePayload._json = data;
      return responsePayload;
    },
    sendStatus(code: number) {
      responsePayload._status = code;
      return responsePayload;
    },
  };
  return responsePayload;
}
