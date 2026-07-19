// ─────────────────────────────────────────────────────────────
// GitHub — REST API base helpers
// ─────────────────────────────────────────────────────────────
// The shared ~30% of the GitHub wrappers in portal-service
// (authenticated repo stats) and tools-service (anon README
// fetcher): base URL, standard headers, input parsing. Higher-
// level repo/README methods stay purpose-specific in each repo.
// ─────────────────────────────────────────────────────────────
import { createApiClient } from "./http.js";
export const GITHUB_API_BASE_URL = "https://api.github.com";
const GITHUB_REPO_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s#?]+)\/([^/\s#?]+)/;
/**
 * Parse a GitHub repo URL (with or without protocol/.git suffix) or an
 * "owner/repo" shorthand into its parts. Null when unparseable.
 */
export function parseGitHubRepoInput(input) {
    if (!input || typeof input !== "string")
        return null;
    const trimmed = input
        .trim()
        .replace(/\.git$/, "")
        .replace(/\/$/, "");
    const match = trimmed.match(GITHUB_REPO_REGEX);
    if (match)
        return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
    const parts = trimmed.split("/");
    if (parts.length === 2 && parts[0] && parts[1]) {
        return { owner: parts[0], repo: parts[1] };
    }
    return null;
}
/**
 * Create an {@link ApiClient} bound to the GitHub REST API with the
 * standard v3 Accept header, User-Agent, and optional Bearer auth.
 * Non-2xx responses throw ApiError (status 403 + x-ratelimit-remaining: 0
 * is GitHub's rate limit); use `requestRaw` to inspect responses manually.
 */
export function createGitHubClient({ token, userAgent = "utilities-library", timeoutMilliseconds = 8000, fetchImplementation, } = {}) {
    return createApiClient(GITHUB_API_BASE_URL, {
        headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": userAgent,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        timeoutMilliseconds,
        fetchImplementation,
    });
}
//# sourceMappingURL=github.js.map