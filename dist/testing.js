export function mockReq(overrides = {}) {
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
    const res = {
        _status: null,
        _json: null,
        status(code) {
            res._status = code;
            return res;
        },
        json(data) {
            res._json = data;
            return res;
        },
        sendStatus(code) {
            res._status = code;
            return res;
        },
    };
    return res;
}
//# sourceMappingURL=testing.js.map