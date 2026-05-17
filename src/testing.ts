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
  const res: Record<string, unknown> = {
    _status: null,
    _json: null,
    status(code: number) {
      res._status = code;
      return res;
    },
    json(data: unknown) {
      res._json = data;
      return res;
    },
    sendStatus(code: number) {
      res._status = code;
      return res;
    },
  };
  return res;
}
