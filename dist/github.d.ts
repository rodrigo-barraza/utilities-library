import { type ApiClient } from "./http.js";
export declare const GITHUB_API_BASE_URL = "https://api.github.com";
/**
 * Parse a GitHub repo URL (with or without protocol/.git suffix) or an
 * "owner/repo" shorthand into its parts. Null when unparseable.
 */
export declare function parseGitHubRepoInput(input: string | null | undefined): {
    owner: string;
    repo: string;
} | null;
export interface GitHubClientOptions {
    /** Personal access token; requests go unauthenticated when omitted. */
    token?: string | null;
    userAgent?: string;
    timeoutMilliseconds?: number;
    fetchImplementation?: typeof fetch;
}
/**
 * Create an {@link ApiClient} bound to the GitHub REST API with the
 * standard v3 Accept header, User-Agent, and optional Bearer auth.
 * Non-2xx responses throw ApiError (status 403 + x-ratelimit-remaining: 0
 * is GitHub's rate limit); use `requestRaw` to inspect responses manually.
 */
export declare function createGitHubClient({ token, userAgent, timeoutMilliseconds, fetchImplementation, }?: GitHubClientOptions): ApiClient;
//# sourceMappingURL=github.d.ts.map