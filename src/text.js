// ─────────────────────────────────────────────────────────────
// Text — String manipulation and sanitization utilities
// ─────────────────────────────────────────────────────────────

/**
 * Strip HTML tags from a string and decode common HTML entities.
 * @param {string} html
 * @returns {string}
 */
export function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normalize a name/title for deduplication and matching.
 * Strips non-alphanumeric chars, lowercases, collapses whitespace.
 *
 * @param {string} str
 * @returns {string}
 */
export function normalizeName(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Convert a snake_case function name to a human-readable title.
 * Strips common prefixes: get_, mcp__<server>__
 * e.g. "get_stock_price" → "Stock Price", "mcp__github__list_repos" → "List Repos"
 *
 * @param {string} name
 * @returns {string}
 */
export function renderToolName(name) {
  return name
    .replace(/^(get_|mcp__\w+__)/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Extended tool name humanization — strips a broad set of verb prefixes
 * before title-casing. Use for display contexts where the action verb
 * is redundant (e.g. tool catalog pages).
 * e.g. "search_web_results" → "Web Results", "execute_python" → "Python"
 *
 * @param {string} name
 * @returns {string}
 */
export function humanizeToolName(name) {
  return name
    .replace(
      /^(get|set|search|list|create|delete|update|fetch|read|write|check|run|execute|find|query|rank|lookup|send|track|stop|cancel|submit|browse|navigate|click|scroll|type|clear|wait|close|open|save|load|ask|plan|log|emit|extract|consolidate|manage|add|remove|use|exit|enter)_/i,
      "",
    )
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Truncate a string to a maximum length, appending a suffix.
 *
 * @param {string} str - The string to truncate
 * @param {number} [maxLen=80] - Maximum allowed length (including suffix)
 * @param {string} [suffix="…"] - Suffix appended when truncated
 * @returns {string}
 */
export function truncate(str, maxLen = 80, suffix = "…") {
  if (!str || str.length <= maxLen) return str || "";
  return str.slice(0, maxLen - suffix.length) + suffix;
}

/**
 * Escape special RegExp characters in a string so it can be used
 * as a literal pattern inside `new RegExp(...)`.
 *
 * @param {string} str
 * @returns {string}
 */
export function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Extract the registrable root domain (domain + TLD) from a FQDN.
 * e.g. "api.prism.rod.dev" → "rod.dev", "clock-crew.com" → "clock-crew.com"
 *
 * @param {string} fqdn
 * @returns {string}
 */
export function getRootDomain(fqdn) {
  if (!fqdn) return "";
  const parts = fqdn.split(".");
  return parts.length <= 2 ? fqdn : parts.slice(-2).join(".");
}

/**
 * Extract the subdomain prefix from a FQDN.
 * e.g. "api.prism.rod.dev" → "api.prism", "rod.dev" → ""
 *
 * @param {string} fqdn
 * @returns {string}
 */
export function getSubdomain(fqdn) {
  if (!fqdn) return "";
  const parts = fqdn.split(".");
  return parts.length <= 2 ? "" : parts.slice(0, -2).join(".");
}
