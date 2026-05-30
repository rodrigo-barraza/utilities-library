// ─────────────────────────────────────────────────────────────
// Text — String manipulation and sanitization utilities
// ─────────────────────────────────────────────────────────────

/**
 * Strip HTML tags from a string and decode common HTML entities.
 */
export function stripHtml(html: string | null | undefined): string {
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
 */
export function normalizeName(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Display-name overrides for tools whose algorithmically generated
 * titles are too vague (single word, ambiguous, or non-descriptive).
 * renderToolName checks this map first before falling back to the
 * strip-prefix + title-case heuristic.
 */
const TOOL_DISPLAY_OVERRIDES: Record<string, string> = {
  get_events: "Search Local Events",
  get_commodities: "Fetch Commodity Prices",
  get_trends: "Fetch Trending Topics",
  get_stock: "Lookup Stock Quote",
  get_macro: "Fetch Macro Indicators",
  get_anime: "Search Anime Database",
  get_country: "Lookup Country Info",
  get_element: "Lookup Periodic Element",
  get_exoplanet: "Search Exoplanet Catalog",
  get_dota: "Lookup Dota 2 Stats",
  get_music: "Search Music Catalog",
  get_tides: "Fetch Tide Forecasts",
  get_weather: "Fetch Weather Report",
  get_wildfires: "Track Active Wildfires",
  get_next_bus: "Check Next Bus Arrival",
  get_ip_info: "Lookup IP Address",
  think: "Think Step-by-Step",
  sleep: "Delay Execution",
  git: "Run Git Command",
  read_url: "Read Web URL",
  read_pdf: "Read PDF Document",
};

/**
 * Convert a snake_case function name to a human-readable title.
 * Checks display overrides first, then strips common prefixes:
 * get_, mcp__<server>__
 * e.g. "get_stock_price" → "Stock Price", "mcp__github__list_repos" → "List Repos"
 */
export function renderToolName(name: string): string {
  if (TOOL_DISPLAY_OVERRIDES[name]) return TOOL_DISPLAY_OVERRIDES[name];
  return name
    .replace(/^(get_|mcp__[\w.-]+__)/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

/**
 * Extended tool name humanization — strips a broad set of verb prefixes
 * before title-casing. Use for display contexts where the action verb
 * is redundant (e.g. tool catalog pages).
 * e.g. "search_web_results" → "Web Results", "execute_python" → "Python"
 */
export function humanizeToolName(name: string): string {
  return name
    .replace(
      /^(get|set|search|list|create|delete|update|fetch|read|write|check|run|execute|find|query|rank|lookup|send|track|stop|cancel|submit|browse|navigate|click|scroll|type|clear|wait|close|open|save|load|ask|plan|log|emit|extract|consolidate|manage|add|remove|use|exit|enter)_/i,
      "",
    )
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

/**
 * Truncate a string to a maximum length, appending a suffix.
 */
export function truncate(text: string | null | undefined, maximumLength = 80, suffix = "…"): string {
  if (!text || text.length <= maximumLength) return text || "";
  return text.slice(0, maximumLength - suffix.length) + suffix;
}

/**
 * Escape special RegExp characters in a string so it can be used
 * as a literal pattern inside `new RegExp(...)`.
 */
export function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Extract the registrable root domain (domain + TLD) from a FQDN.
 * e.g. "api.prism.rod.dev" → "rod.dev", "clock-crew.com" → "clock-crew.com"
 */
export function getRootDomain(fqdn: string | null | undefined): string {
  if (!fqdn) return "";
  const parts = fqdn.split(".");
  return parts.length <= 2 ? fqdn : parts.slice(-2).join(".");
}

/**
 * Extract the subdomain prefix from a FQDN.
 * e.g. "api.prism.rod.dev" → "api.prism", "rod.dev" → ""
 */
export function getSubdomain(fqdn: string | null | undefined): string {
  if (!fqdn) return "";
  const parts = fqdn.split(".");
  return parts.length <= 2 ? "" : parts.slice(0, -2).join(".");
}

/**
 * Capitalize the first character of a string.
 * e.g. "hello" → "Hello", "HELLO" → "HELLO"
 */
export function capitalize(text: string | null | undefined): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert a string to a URL-safe slug.
 * Lowercases, strips non-alphanumeric chars (except hyphens), and
 * collapses whitespace/hyphens into single hyphens.
 *
 * e.g. "Hello World! Foo" → "hello-world-foo"
 */
export function slugify(text: string | null | undefined): string {
  if (!text) return "";
  return text
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
 */
export function toKebabCase(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * Convert a string to camelCase.
 * e.g. "hello-world" → "helloWorld", "Hello World" → "helloWorld"
 */
export function toCamelCase(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/[-_\s]+(.)?/g, (_, character: string | undefined) => (character ? character.toUpperCase() : ""))
    .replace(/^[A-Z]/, (character) => character.toLowerCase());
}

/**
 * Convert a string to PascalCase.
 * e.g. "hello-world" → "HelloWorld", "hello world" → "HelloWorld"
 */
export function toPascalCase(text: string | null | undefined): string {
  if (!text) return "";
  const camel = toCamelCase(text);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/**
 * Convert a string to snake_case.
 * e.g. "helloWorld" → "hello_world", "Hello World" → "hello_world"
 */
export function toSnakeCase(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .toLowerCase();
}

/**
 * Simple count-based English pluralization.
 * Appends "s" (or a custom suffix) when `count !== 1`.
 * e.g. pluralize("item", 0) → "items", pluralize("item", 1) → "item"
 */
export function pluralize(word: string, count: number, plural?: string): string {
  if (count === 1) return word;
  return plural || word + "s";
}

/**
 * Count words in a string.
 * Splits on whitespace and filters empty tokens.
 */
export function wordCount(text: string | null | undefined): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}
