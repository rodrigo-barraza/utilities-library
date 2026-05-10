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

/**
 * Capitalize the first character of a string.
 * e.g. "hello" → "Hello", "HELLO" → "HELLO"
 *
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a string to a URL-safe slug.
 * Lowercases, strips non-alphanumeric chars (except hyphens), and
 * collapses whitespace/hyphens into single hyphens.
 *
 * e.g. "Hello World! Foo" → "hello-world-foo"
 *
 * @param {string} str
 * @returns {string}
 */
export function slugify(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
}

/**
 * Convert a string to kebab-case.
 * e.g. "helloWorld" → "hello-world", "Hello World" → "hello-world"
 *
 * @param {string} str
 * @returns {string}
 */
export function toKebabCase(str) {
  if (!str) return "";
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * Convert a string to camelCase.
 * e.g. "hello-world" → "helloWorld", "Hello World" → "helloWorld"
 *
 * @param {string} str
 * @returns {string}
 */
export function toCamelCase(str) {
  if (!str) return "";
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

/**
 * Convert a string to PascalCase.
 * e.g. "hello-world" → "HelloWorld", "hello world" → "HelloWorld"
 *
 * @param {string} str
 * @returns {string}
 */
export function toPascalCase(str) {
  if (!str) return "";
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/**
 * Convert a string to snake_case.
 * e.g. "helloWorld" → "hello_world", "Hello World" → "hello_world"
 *
 * @param {string} str
 * @returns {string}
 */
export function toSnakeCase(str) {
  if (!str) return "";
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .toLowerCase();
}

/**
 * Simple count-based English pluralization.
 * Appends "s" (or a custom suffix) when `count !== 1`.
 * e.g. pluralize("item", 0) → "items", pluralize("item", 1) → "item"
 *
 * @param {string} word - Singular form
 * @param {number} count - Count controlling pluralization
 * @param {string} [plural] - Custom plural form (overrides default "s" suffix)
 * @returns {string}
 */
export function pluralize(word, count, plural) {
  if (count === 1) return word;
  return plural || word + "s";
}

/**
 * Count words in a string.
 * Splits on whitespace and filters empty tokens.
 *
 * @param {string} str
 * @returns {number}
 */
export function wordCount(str) {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}
