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
export declare function mockRequest(overrides?: Partial<MockRequest>): MockRequest;
export declare function mockResponse(): MockResponse;
//# sourceMappingURL=testing.d.ts.map