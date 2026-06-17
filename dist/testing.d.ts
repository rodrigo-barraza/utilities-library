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
export declare function mockRequest(overrides?: Record<string, unknown>): MockRequest;
export declare function mockResponse(): MockResponse;
//# sourceMappingURL=testing.d.ts.map