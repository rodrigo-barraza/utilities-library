export function mockRequest(overrides = {}) {
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
export function mockResponse() {
    const responsePayload = {
        _status: null,
        _json: null,
        status(code) {
            responsePayload._status = code;
            return responsePayload;
        },
        json(data) {
            responsePayload._json = data;
            return responsePayload;
        },
        sendStatus(code) {
            responsePayload._status = code;
            return responsePayload;
        },
    };
    return responsePayload;
}
//# sourceMappingURL=testing.js.map