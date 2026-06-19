export interface MockRequest {
    method: string;
    query: Record<string, unknown>;
    body: Record<string, unknown>;
    headers: Record<string, unknown>;
    ip: string;
    path: string;
    params?: Record<string, string>;
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
export declare function mockRequest(overrides?: Partial<MockRequest>): MockRequest;
export declare function mockResponse(): MockResponse;
//# sourceMappingURL=testing.d.ts.map