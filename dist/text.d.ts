/**
 * Strip HTML tags from a string and decode common HTML entities.
 */
export declare function stripHtml(html: string | null | undefined): string;
/**
 * Normalize a name/title for deduplication and matching.
 * Strips non-alphanumeric chars, lowercases, collapses whitespace.
 */
export declare function normalizeName(str: string | null | undefined): string;
/**
 * Convert a snake_case function name to a human-readable title.
 * Strips common prefixes: get_, mcp__<server>__
 * e.g. "get_stock_price" → "Stock Price", "mcp__github__list_repos" → "List Repos"
 */
export declare function renderToolName(name: string): string;
/**
 * Extended tool name humanization — strips a broad set of verb prefixes
 * before title-casing. Use for display contexts where the action verb
 * is redundant (e.g. tool catalog pages).
 * e.g. "search_web_results" → "Web Results", "execute_python" → "Python"
 */
export declare function humanizeToolName(name: string): string;
/**
 * Truncate a string to a maximum length, appending a suffix.
 */
export declare function truncate(str: string | null | undefined, maxLen?: number, suffix?: string): string;
/**
 * Escape special RegExp characters in a string so it can be used
 * as a literal pattern inside `new RegExp(...)`.
 */
export declare function escapeRegex(str: string): string;
/**
 * Extract the registrable root domain (domain + TLD) from a FQDN.
 * e.g. "api.prism.rod.dev" → "rod.dev", "clock-crew.com" → "clock-crew.com"
 */
export declare function getRootDomain(fqdn: string | null | undefined): string;
/**
 * Extract the subdomain prefix from a FQDN.
 * e.g. "api.prism.rod.dev" → "api.prism", "rod.dev" → ""
 */
export declare function getSubdomain(fqdn: string | null | undefined): string;
/**
 * Capitalize the first character of a string.
 * e.g. "hello" → "Hello", "HELLO" → "HELLO"
 */
export declare function capitalize(str: string | null | undefined): string;
/**
 * Convert a string to a URL-safe slug.
 * Lowercases, strips non-alphanumeric chars (except hyphens), and
 * collapses whitespace/hyphens into single hyphens.
 *
 * e.g. "Hello World! Foo" → "hello-world-foo"
 */
export declare function slugify(str: string | null | undefined): string;
/**
 * Convert a string to kebab-case.
 * e.g. "helloWorld" → "hello-world", "Hello World" → "hello-world"
 */
export declare function toKebabCase(str: string | null | undefined): string;
/**
 * Convert a string to camelCase.
 * e.g. "hello-world" → "helloWorld", "Hello World" → "helloWorld"
 */
export declare function toCamelCase(str: string | null | undefined): string;
/**
 * Convert a string to PascalCase.
 * e.g. "hello-world" → "HelloWorld", "hello world" → "HelloWorld"
 */
export declare function toPascalCase(str: string | null | undefined): string;
/**
 * Convert a string to snake_case.
 * e.g. "helloWorld" → "hello_world", "Hello World" → "hello_world"
 */
export declare function toSnakeCase(str: string | null | undefined): string;
/**
 * Simple count-based English pluralization.
 * Appends "s" (or a custom suffix) when `count !== 1`.
 * e.g. pluralize("item", 0) → "items", pluralize("item", 1) → "item"
 */
export declare function pluralize(word: string, count: number, plural?: string): string;
/**
 * Count words in a string.
 * Splits on whitespace and filters empty tokens.
 */
export declare function wordCount(str: string | null | undefined): number;
//# sourceMappingURL=text.d.ts.map