// ─────────────────────────────────────────────────────────────
// @rodrigo-barraza/utilities-library — Isomorphic entry point
// ─────────────────────────────────────────────────────────────
// Browser-safe utilities. No Node.js APIs (fs, crypto, process).
// For Node-only utilities, import from "@rodrigo-barraza/utilities-library/node".
// ─────────────────────────────────────────────────────────────

// Format — Number, cost, duration, and time formatting
export {
  formatCompact,
  formatNumber,
  formatTokenCount,
  formatCost,
  formatCostAdaptive,
  formatCostTag,
  formatCurrency,
  formatLatency,
  formatLatencyMilliseconds,
  formatDuration,
  formatElapsedTime,
  formatFileSize,
  formatBytes,
  formatMediaTimestamp,
  formatTokensPerSecond,
  formatTokensPerSec,
  formatContextTokens,
  formatPercent,
  roundMilliseconds,
  formatRequestTime,
} from "./format.ts";
export type { FormatFileSizeOptions } from "./format.ts";

// Text — String manipulation, sanitization, and case conversion
export {
  stripHtml,
  normalizeName,
  renderToolName,
  humanizeToolName,
  resolveToolDisplaySummary,
  truncate,
  escapeRegex,
  getRootDomain,
  getSubdomain,
  capitalize,
  slugify,
  toKebabCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  pluralize,
  wordCount,
  deriveAgentId,
  sanitizeNullBytes,
  isDisallowedIdentifier,
} from "./text.ts";
export type { ToolDisplaySummaryResult, ToolDisplayMetadata, ToolDisplaySubjectFormat } from "./text.ts";

// Date — Date formatting and relative time
export { toISODate, timeAgo, daysSinceIso, formatDateTime, formatDate, daysAgo, toLocalDateString } from "./date.ts";

// Async — Promise-based timing, concurrency, and control
export { sleep, retry, withTimeout, withTimeoutFallback, fetchWithTimeout, parallelMap, defer } from "./async.ts";
export type { RetryOptions, ParallelMapOptions, Deferred } from "./async.ts";

// Time — Duration constants, converters, and polling intervals
export {
  MILLISECONDS_PER_SECOND,
  MILLISECONDS_PER_MINUTE,
  MILLISECONDS_PER_HOUR,
  MILLISECONDS_PER_DAY,
  SECONDS_PER_DAY,
  MILLISECONDS_PER_WEEK,
  seconds,
  minutes,
  hours,
  days,
  weeks,
  POLL_FAST,
  POLL_STANDARD,
  POLL_MODERATE,
  POLL_SLOW,
  POLL_LAZY,
  FEEDBACK_BRIEF_MILLISECONDS,
  FEEDBACK_STANDARD_MILLISECONDS,
  TOAST_DURATION_MILLISECONDS,
  ACTION_COOLDOWN_MILLISECONDS,
  ACTION_COOLDOWN_LONG_MILLISECONDS,
  HIGHLIGHT_DURATION_MILLISECONDS,
} from "./time.ts";


// Arrays — Array manipulation
export {
  chunk,
  shuffleArray,
  pickRandom,
  compactPayload,
  groupBy,
  uniqueBy,
  partition,
  intersection,
  difference,
  sortBy,
  flatten,
} from "./arrays.ts";
export type { SortByOptions } from "./arrays.ts";

// Objects — Plain-object manipulation
export { deepMerge, pick, omit, mapValues, mapKeys, invert, isEmpty, deepEqual } from "./objects.ts";
export type { PlainObject } from "./objects.ts";

// Math — Numeric utilities
export { clamp, roundCents, randomInt, cosineSimilarity, lerp, remap, sum, average, median, roundTo } from "./math.ts";

// Validation — Input parsing and constraint checking
export {
  parseIntParam,
  parsePrice,
  validateMaxLength,
  parseJsonSafe,
  parseJsonFromLargeLanguageModelResponse,
  isEmail,
  isUrl,
  isNumeric,
} from "./validation.ts";
export type { IsUrlOptions } from "./validation.ts";

import { sanitizedStringSchema } from "./schemas.ts";
export { sanitizedStringSchema };

// Crypto — Browser-safe cryptographic utilities
export { generateUUID } from "./crypto.ts";

// Phone — Phone number formatting
export { formatPhone } from "./phone.ts";

// Rate — Debounce and throttle
export { debounce, throttle, createDailyBudget, createCircuitBreaker } from "./rate.ts";
export type {
  DebouncedFunction,
  ThrottledFunction,
  DebounceOptions,
  DailyBudget,
  CircuitBreaker,
  CircuitBreakerOptions,
} from "./rate.ts";
export { escapeHtml, normalizeSearchText, toAlphanumeric, cx } from "./text.ts";

// Color — Color manipulation and interpolation
export { parseHex, toHex, lerpColor, rgbToHsl, hslToRgb, adjustBrightness, lerpRgb, paletteAt } from "./color.ts";
export type { RGB, RGBA, HSL, RgbTriplet } from "./color.ts";

// Errors — Type-safe error handling utilities
export { getErrorMessage, errorMessage } from "./errors.ts";

// HTTP — Isomorphic JSON API client
export { createApiClient, ApiError } from "./http.ts";
export type { ApiClient, ApiClientOptions, ApiRequestInit, ApiRetryOptions } from "./http.ts";
export {
  discordAvatarUrl,
  discordGuildIconUrl,
  discordBannerUrl,
  discordSplashUrl,
  discordEmojiUrl,
  discordStickerUrl,
  discordMessageUrl,
  DISCORD_STICKER_FORMAT,
} from "./discord.ts";
export type { DiscordAvatarOptions } from "./discord.ts";
export { createTtlCache, createSimpleCache } from "./cache.ts";
export type {
  TtlCache,
  TtlCacheOptions,
  SimpleCache,
  SimpleCacheOptions,
  CacheHealth,
  CacheError,
} from "./cache.ts";
export { createGitHubClient, parseGitHubRepoInput, GITHUB_API_BASE_URL } from "./github.ts";
export type { GitHubClientOptions } from "./github.ts";

// Environment — Browser/production detection and client URL resolution
export {
  isBrowser,
  isProductionHostname,
  resolveClientServiceUrl,
  assertRequiredEnvironment,
} from "./environment.ts";
export type { ResolveClientServiceUrlOptions } from "./environment.ts";

// Temporal — Native Temporal API Utilities
export { TemporalHelpers } from "./temporal.ts";

// IDs — Identifier generation utilities
export { generateId, generateSortableId } from "./ids.ts";

// ── DOM (browser-only; SSR-safe no-ops) ─────────────────────
export { copyToClipboard } from "./dom.ts";

// Workspace — File operation constants and utilities
export {
  WORKSPACE_MAX_READ_BYTES,
  WORKSPACE_MAX_WRITE_BYTES,
  WORKSPACE_MAX_LINES_PER_READ,
  WORKSPACE_MAX_PREVIEW_BYTES,
  WORKSPACE_MAX_GREP_RESULTS,
  WORKSPACE_MAX_GLOB_RESULTS,
  WORKSPACE_MAX_DIRECTORY_ENTRIES,
  BINARY_FILE_EXTENSIONS,
  PREVIEW_IMAGE_FILE_EXTENSIONS,
  WORKSPACE_SKIP_DIRECTORIES,
  globToRegex,
} from "./workspace.ts";

// Workspace types
export type {
  PathValidationResult,
  FileInfoEntry,
  DirectoryEntry,
  TreeEntry,
  GrepMatch,
  GlobMatch,
  GitFileChange,
  GitStatusResult,
  GitDiffResult,
  GitLogResult,
  GitCommit,
  CommandExecutionResult,
  ProjectSummaryResult,
} from "./types/workspace.ts";
