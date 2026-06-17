export interface MockRequest {
  method: string;
  query: Record<string, unknown>;
  body: Record<string, unknown>;
  headers: Record<string, unknown>;
  ip: string;
  path: string;
  [key: string]: unknown;
}

export interface MockResponse {
  _status: number | null;
  _json: unknown;
  status(code: number): MockResponse;
  json(data: unknown): MockResponse;
  sendStatus(code: number): MockResponse;
  [key: string]: unknown;
}

export function mockRequest(overrides: Record<string, unknown> = {}): MockRequest {
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

export function mockResponse(): MockResponse {
  const responsePayload: MockResponse = {
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
