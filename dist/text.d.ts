export declare function stripHtml(html: string | null | undefined): string;
export declare function normalizeName(text: string | null | undefined): string;
export declare function renderToolName(name: string): string;
export interface ToolDisplaySummaryResult {
    verb: string;
    subject: string;
    filePath?: string;
}
export type ToolDisplaySubjectFormat = "basename" | "full" | "truncate" | "quoted" | "domain";
export interface ToolDisplayMetadata {
    activeVerb: string;
    completedVerb: string;
    subjectParam: string;
    subjectFormat: ToolDisplaySubjectFormat;
    filePathParam?: string;
    descriptionParam?: string;
    toolLabel?: string;
}
interface ToolDisplaySummaryOptions {
    isActive?: boolean;
    display?: ToolDisplayMetadata;
}
export declare function resolveToolDisplaySummary(name: string, args: Record<string, unknown>, options?: ToolDisplaySummaryOptions): ToolDisplaySummaryResult | null;
export declare function humanizeToolName(name: string): string;
export declare function truncate(text: string | null | undefined, maximumLength?: number, suffix?: string): string;
export declare function escapeRegex(text: string): string;
export declare function getRootDomain(fullyQualifiedDomainName: string | null | undefined): string;
export declare function getSubdomain(fullyQualifiedDomainName: string | null | undefined): string;
export declare function capitalize(text: string | null | undefined): string;
export declare function slugify(text: string | null | undefined): string;
export declare function toKebabCase(text: string | null | undefined): string;
export declare function toCamelCase(text: string | null | undefined): string;
export declare function toPascalCase(text: string | null | undefined): string;
export declare function toSnakeCase(text: string | null | undefined): string;
export declare function pluralize(word: string, count: number, plural?: string): string;
export declare function wordCount(text: string | null | undefined): number;
/**
 * Derive a stable agent ID from a display name.
 * Uppercases, strips non-alphanumeric characters, and prefixes with CUSTOM_.
 * e.g. "My Agent" → "CUSTOM_MY_AGENT"
 */
export declare function deriveAgentId(name: string): string;
/**
 * Remove null bytes from a string.
 */
export declare function sanitizeNullBytes(value: string | null | undefined): string;
/**
 * Check if a string contains disallowed characters (null bytes or path traversal).
 */
export declare function isDisallowedIdentifier(value: string | null | undefined): boolean;
/**
 * Escape a value for safe interpolation into HTML text or attributes.
 * Escapes the five significant entities; null/undefined become "".
 */
export declare function escapeHtml(value: unknown): string;
/**
 * Normalize free text for fuzzy search matching: lowercase, keep only
 * ASCII letters/digits/whitespace. The word-preserving variant of
 * {@link toAlphanumeric}.
 */
export declare function normalizeSearchText(text: string | null | undefined): string;
/**
 * Squash text to bare lowercase alphanumerics (no spaces) — for building
 * lookup keys where "St. John's" and "st johns" must collide.
 */
export declare function toAlphanumeric(text: string | null | undefined): string;
/**
 * Join CSS class names, skipping falsy parts — the classic `classNames`/`clsx`
 * one-liner: `cx("btn", isActive && "btn--active", size)`.
 */
export declare function cx(...parts: Array<string | false | null | undefined>): string;
export {};
//# sourceMappingURL=text.d.ts.map