export interface RequestQuery {
  [key: string]: unknown;
}

export interface RequestBody {
  [key: string]: unknown;
}

export interface RequestHeaders {
  [key: string]: unknown;
}

export interface RequestParams {
  [key: string]: string;
}

export interface MockRequest {
  method: string;
  query: RequestQuery;
  body: RequestBody;
  headers: RequestHeaders;
  ip: string;
  path: string;
  params?: RequestParams;
  originalUrl?: string;
}

export interface MockResponse {
  _status: number | null;
  _json: unknown;
  headersSent?: boolean;
  status(code: number): MockResponse;
  json(data: unknown): MockResponse;
  sendStatus(code: number): MockResponse;
}

export function mockRequest(overrides: Partial<MockRequest> = {}): MockRequest {
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
