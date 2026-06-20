// ── Comprehensive unit tests for utilities-library ──

import { describe, it, expect } from "vitest";

// ─── Format ─────────────────────────────────────────────────────

describe("format.js", () => {
  let formatUtilities;
  beforeAll(async () => {
    formatUtilities = await import("../dist/format.js");
  });

  describe("formatCompact", () => {
    it("returns em-dash for null/undefined", () => {
      expect(formatUtilities.formatCompact(null)).toBe("—");
      expect(formatUtilities.formatCompact(undefined)).toBe("—");
    });
    it("formats millions", () => {
      expect(formatUtilities.formatCompact(10_000_000)).toBe("10M");
      expect(formatUtilities.formatCompact(3_500_000)).toBe("3.5M");
    });
    it("formats thousands", () => {
      expect(formatUtilities.formatCompact(3500)).toBe("3.5K");
      expect(formatUtilities.formatCompact(1000)).toBe("1K");
    });
    it("passes through small numbers", () => {
      expect(formatUtilities.formatCompact(42)).toBe("42");
    });
  });

  describe("formatNumber", () => {
    it("returns 0 for null/undefined", () => {
      expect(formatUtilities.formatNumber(null)).toBe("0");
    });
    it("truncates decimals", () => {
      expect(formatUtilities.formatNumber(3500)).toBe("4K");
    });
  });

  describe("formatCost", () => {
    it("formats with 5 decimals", () => {
      expect(formatUtilities.formatCost(0.001)).toBe("$0.00100");
    });
    it("handles null", () => {
      expect(formatUtilities.formatCost(null)).toBe("$0.00");
    });
  });

  describe("formatCostAdaptive", () => {
    it("uses 4 decimals for tiny costs", () => {
      expect(formatUtilities.formatCostAdaptive(0.0034)).toBe("$0.0034");
    });
    it("uses 2 decimals for normal costs", () => {
      expect(formatUtilities.formatCostAdaptive(1.5)).toBe("$1.50");
    });
    it("returns $0.00 for zero", () => {
      expect(formatUtilities.formatCostAdaptive(0)).toBe("$0.00");
    });
  });

  describe("formatLatency", () => {
    it("formats sub-second as ms", () => {
      expect(formatUtilities.formatLatency(0.3)).toBe("300ms");
    });
    it("formats seconds", () => {
      expect(formatUtilities.formatLatency(5.2)).toBe("5.2s");
    });
    it("formats minutes", () => {
      expect(formatUtilities.formatLatency(90)).toBe("1.5m");
    });
  });

  describe("formatDuration", () => {
    it("formats milliseconds", () => {
      expect(formatUtilities.formatDuration(500)).toBe("500ms");
    });
    it("formats seconds", () => {
      expect(formatUtilities.formatDuration(5000)).toBe("5.0s");
    });
    it("formats minutes + seconds", () => {
      expect(formatUtilities.formatDuration(90_000)).toBe("1m 30s");
    });
    it("formats hours", () => {
      expect(formatUtilities.formatDuration(3_660_000)).toBe("1h 1m");
    });
    it("returns em-dash for null", () => {
      expect(formatUtilities.formatDuration(null)).toBe("—");
    });
  });

  describe("formatElapsedTime", () => {
    it("delegates to formatDuration", () => {
      expect(formatUtilities.formatElapsedTime(65)).toBe("1m 5s");
    });
    it("returns 0s for null/zero/negative", () => {
      expect(formatUtilities.formatElapsedTime(null)).toBe("0s");
      expect(formatUtilities.formatElapsedTime(0)).toBe("0s");
      expect(formatUtilities.formatElapsedTime(-1)).toBe("0s");
    });
  });

  describe("formatFileSize", () => {
    it("formats KB", () => {
      expect(formatUtilities.formatFileSize(2048)).toBe("2 KB");
    });
    it("formats MB", () => {
      expect(formatUtilities.formatFileSize(1_048_576)).toBe("1.0 MB");
    });
    it("compact mode", () => {
      expect(formatUtilities.formatFileSize(0, { compact: true })).toBe("0B");
      expect(formatUtilities.formatFileSize(512, { compact: true })).toBe("512B");
    });
    it("returns null for falsy in normal mode", () => {
      expect(formatUtilities.formatFileSize(0)).toBeNull();
    });
  });

  describe("formatPercent", () => {
    it("formats with default precision", () => {
      expect(formatUtilities.formatPercent(85.456)).toBe("85.5%");
    });
    it("returns em-dash for null", () => {
      expect(formatUtilities.formatPercent(null)).toBe("—");
    });
  });

  describe("formatContextTokens", () => {
    it("delegates to formatCompact", () => {
      expect(formatUtilities.formatContextTokens(128_000)).toBe("128K");
    });
    it("returns null for falsy", () => {
      expect(formatUtilities.formatContextTokens(0)).toBeNull();
    });
  });

  describe("formatCurrency", () => {
    it("formats USD", () => {
      expect(formatUtilities.formatCurrency(1500)).toBe("$1,500.00");
    });
    it("uses 4 decimals for tiny amounts", () => {
      expect(formatUtilities.formatCurrency(0.005)).toBe("$0.0050");
    });
  });

  describe("roundMilliseconds", () => {
    it("rounds to 3 decimal places", () => {
      expect(formatUtilities.roundMilliseconds(1.23456789)).toBe(1.235);
    });
  });
});

// ─── Text ───────────────────────────────────────────────────────

describe("text.js", () => {
  let textUtilities;
  beforeAll(async () => {
    textUtilities = await import("../dist/text.js");
  });

  describe("stripHtml", () => {
    it("removes tags", () => {
      expect(textUtilities.stripHtml("<b>Hello</b>")).toBe("Hello");
    });
    it("decodes entities", () => {
      expect(textUtilities.stripHtml("&amp; &lt; &gt;")).toBe("& < >");
    });
    it("handles null", () => {
      expect(textUtilities.stripHtml(null)).toBe("");
    });
  });

  describe("normalizeName", () => {
    it("lowercases and strips special chars", () => {
      expect(textUtilities.normalizeName("Hello, World!")).toBe("hello world");
    });
  });

  describe("renderToolName", () => {
    it("strips get_ prefix and title-cases", () => {
      expect(textUtilities.renderToolName("get_stock_price")).toBe("Stock Price");
    });
    it("strips mcp__ prefix", () => {
      expect(textUtilities.renderToolName("mcp__github__list_repos")).toBe("List Repos");
    });
    it("strips mcp__ prefix with hyphens or dots in server names", () => {
      expect(textUtilities.renderToolName("mcp__lazy-tool-service__get_market_data")).toBe("Get Market Data");
      expect(textUtilities.renderToolName("mcp__my.api.server__fetch_items")).toBe("Fetch Items");
    });
    it("applies action-oriented display overrides correctly", () => {
      expect(textUtilities.renderToolName("task_get")).toBe("Get Task");
      expect(textUtilities.renderToolName("task_create")).toBe("Create Task");
      expect(textUtilities.renderToolName("task_list")).toBe("List Tasks");
      expect(textUtilities.renderToolName("task_update")).toBe("Update Task");
      expect(textUtilities.renderToolName("file_info")).toBe("Get File Info");
      expect(textUtilities.renderToolName("file_diff")).toBe("Compare Files");
    });
  });

  describe("truncate", () => {
    it("returns full string if within limit", () => {
      expect(textUtilities.truncate("short", 80)).toBe("short");
    });
    it("truncates with ellipsis", () => {
      const result = textUtilities.truncate("This is a long string", 10);
      expect(result.length).toBeLessThanOrEqual(10);
      expect(result.endsWith("…")).toBe(true);
    });
    it("handles null/empty", () => {
      expect(textUtilities.truncate(null)).toBe("");
      expect(textUtilities.truncate("")).toBe("");
    });
  });

  describe("escapeRegex", () => {
    it("escapes special characters", () => {
      expect(textUtilities.escapeRegex("file.txt")).toBe("file\\.txt");
      expect(textUtilities.escapeRegex("a+b*c")).toBe("a\\+b\\*c");
    });
  });

  describe("getRootDomain / getSubdomain", () => {
    it("extracts root domain", () => {
      expect(textUtilities.getRootDomain("api.prism.rod.dev")).toBe("rod.dev");
    });
    it("extracts subdomain", () => {
      expect(textUtilities.getSubdomain("api.prism.rod.dev")).toBe("api.prism");
    });
    it("returns empty subdomain for bare domains", () => {
      expect(textUtilities.getSubdomain("rod.dev")).toBe("");
    });
  });

  describe("capitalize", () => {
    it("capitalizes first char", () => {
      expect(textUtilities.capitalize("hello")).toBe("Hello");
    });
    it("leaves already-capitalized strings alone", () => {
      expect(textUtilities.capitalize("HELLO")).toBe("HELLO");
    });
    it("handles null/empty", () => {
      expect(textUtilities.capitalize(null)).toBe("");
      expect(textUtilities.capitalize("")).toBe("");
    });
  });
});

// ─── Date ───────────────────────────────────────────────────────

describe("date.js", () => {
  let dateUtilities;
  beforeAll(async () => {
    dateUtilities = await import("../dist/date.js");
  });

  describe("toISODate", () => {
    it("formats as YYYY-MM-DD", () => {
      const dateInstance = new Date("2026-05-08T12:00:00Z");
      expect(dateUtilities.toISODate(dateInstance)).toBe("2026-05-08");
    });
  });

  describe("timeAgo", () => {
    it("returns em-dash for null", () => {
      expect(dateUtilities.timeAgo(null)).toBe("—");
    });
    it("returns 'just now' for recent dates", () => {
      expect(dateUtilities.timeAgo(new Date())).toBe("just now");
    });
    it("returns seconds ago", () => {
      const dateInstance = new Date(Date.now() - 30_000);
      expect(dateUtilities.timeAgo(dateInstance)).toBe("30s ago");
    });
    it("returns minutes ago", () => {
      const dateInstance = new Date(Date.now() - 5 * 60_000);
      expect(dateUtilities.timeAgo(dateInstance)).toBe("5m ago");
    });
    it("returns hours ago", () => {
      const dateInstance = new Date(Date.now() - 3 * 3_600_000);
      expect(dateUtilities.timeAgo(dateInstance)).toBe("3h ago");
    });
    it("returns days ago", () => {
      const dateInstance = new Date(Date.now() - 5 * 86_400_000);
      expect(dateUtilities.timeAgo(dateInstance)).toBe("5d ago");
    });
  });

  describe("daysSinceIso", () => {
    it("returns 0 for today", () => {
      expect(dateUtilities.daysSinceIso(new Date().toISOString())).toBe(0);
    });
  });

  describe("daysAgo", () => {
    it("returns a Date in the past", () => {
      const dateInstance = dateUtilities.daysAgo(7);
      const diff = Date.now() - dateInstance.getTime();
      expect(Math.floor(diff / 86_400_000)).toBe(7);
    });
  });

  describe("toLocalDateString", () => {
    it("returns YYYY-MM-DD in local time", () => {
      const result = dateUtilities.toLocalDateString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});

// ─── Async ──────────────────────────────────────────────────────

describe("async.js", () => {
  let asyncUtilities;
  beforeAll(async () => {
    asyncUtilities = await import("../dist/async.js");
  });

  describe("sleep", () => {
    it("resolves after delay", async () => {
      const start = Date.now();
      await asyncUtilities.sleep(50);
      expect(Date.now() - start).toBeGreaterThanOrEqual(40);
    });
  });

  describe("retry", () => {
    it("retries on failure", async () => {
      let attempts = 0;
      const result = await asyncUtilities.retry(
        () => {
          attempts++;
          if (attempts < 3) throw new Error("fail");
          return "ok";
        },
        { retries: 3, delay: 10 },
      );
      expect(result).toBe("ok");
      expect(attempts).toBe(3);
    });
    it("throws after max retries", async () => {
      await expect(
        asyncUtilities.retry(() => { throw new Error("always"); }, { retries: 2, delay: 10 }),
      ).rejects.toThrow("always");
    });
  });

  describe("withTimeout", () => {
    it("resolves if promise is fast", async () => {
      const result = await asyncUtilities.withTimeout(Promise.resolve("ok"), 1000);
      expect(result).toBe("ok");
    });
    it("rejects on timeout", async () => {
      await expect(
        asyncUtilities.withTimeout(new Promise(() => {}), 50, "timed out"),
      ).rejects.toThrow("timed out");
    });
  });
});

// ─── Time ───────────────────────────────────────────────────────

describe("time.js", () => {
  let timeUtilities;
  beforeAll(async () => {
    timeUtilities = await import("../dist/time.js");
  });

  it("defines MILLISECONDS constants", () => {
    expect(timeUtilities.MILLISECONDS_PER_SECOND).toBe(1_000);
    expect(timeUtilities.MILLISECONDS_PER_MINUTE).toBe(60_000);
    expect(timeUtilities.MILLISECONDS_PER_HOUR).toBe(3_600_000);
    expect(timeUtilities.MILLISECONDS_PER_DAY).toBe(86_400_000);
  });

  it("converter functions work", () => {
    expect(timeUtilities.seconds(5)).toBe(5_000);
    expect(timeUtilities.minutes(2)).toBe(120_000);
    expect(timeUtilities.hours(1)).toBe(3_600_000);
    expect(timeUtilities.days(1)).toBe(86_400_000);
    expect(timeUtilities.weeks(1)).toBe(604_800_000);
  });
});

// ─── Arrays ─────────────────────────────────────────────────────

describe("arrays.js", () => {
  let arrayUtilities;
  beforeAll(async () => {
    arrayUtilities = await import("../dist/arrays.js");
  });

  describe("chunk", () => {
    it("splits into chunks", () => {
      expect(arrayUtilities.chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });
    it("handles empty array", () => {
      expect(arrayUtilities.chunk([], 3)).toEqual([]);
    });
  });

  describe("shuffleArray", () => {
    it("returns same length", () => {
      const input = [1, 2, 3, 4, 5];
      const result = arrayUtilities.shuffleArray(input);
      expect(result).toHaveLength(5);
      expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
    });
    it("does not mutate original", () => {
      const input = [1, 2, 3];
      arrayUtilities.shuffleArray(input);
      expect(input).toEqual([1, 2, 3]);
    });
  });

  describe("pickRandom", () => {
    it("returns an element from the array", () => {
      const input = [1, 2, 3];
      expect(input).toContain(arrayUtilities.pickRandom(input));
    });
  });

  describe("compactPayload", () => {
    it("strips null/undefined but keeps falsy values", () => {
      const result = arrayUtilities.compactPayload({ a: 1, b: null, c: 0, d: undefined, e: false, f: "" });
      expect(result).toEqual({ a: 1, c: 0, e: false, f: "" });
    });
  });

  describe("groupBy", () => {
    it("groups by string key", () => {
      const items = [{ type: "a", value: 1 }, { type: "b", value: 2 }, { type: "a", value: 3 }];
      const result = arrayUtilities.groupBy(items, "type");
      expect(result.a).toHaveLength(2);
      expect(result.b).toHaveLength(1);
    });
    it("groups by function", () => {
      const result = arrayUtilities.groupBy([1, 2, 3, 4], (numberValue) => (numberValue % 2 === 0 ? "even" : "odd"));
      expect(result.even).toEqual([2, 4]);
      expect(result.odd).toEqual([1, 3]);
    });
  });

  describe("uniqueBy", () => {
    it("deduplicates by key", () => {
      const items = [{ id: 1, name: "a" }, { id: 2, name: "b" }, { id: 1, name: "c" }];
      const result = arrayUtilities.uniqueBy(items, "id");
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("a"); // keeps first
    });
  });
});

// ─── Objects ────────────────────────────────────────────────────

describe("objects.js", () => {
  let objectUtilities;
  beforeAll(async () => {
    objectUtilities = await import("../dist/objects.js");
  });

  describe("deepMerge", () => {
    it("merges nested objects", () => {
      const result = objectUtilities.deepMerge({ a: { x: 1, y: 2 } }, { a: { y: 3, z: 4 } });
      expect(result).toEqual({ a: { x: 1, y: 3, z: 4 } });
    });
    it("replaces arrays outright", () => {
      const result = objectUtilities.deepMerge({ a: [1, 2] }, { a: [3] });
      expect(result.a).toEqual([3]);
    });
    it("does not mutate inputs", () => {
      const target = { a: { x: 1 } };
      const source = { a: { y: 2 } };
      objectUtilities.deepMerge(target, source);
      expect(target).toEqual({ a: { x: 1 } });
    });
  });

  describe("pick", () => {
    it("picks specified keys", () => {
      expect(objectUtilities.pick({ a: 1, b: 2, c: 3 }, ["a", "c"])).toEqual({ a: 1, c: 3 });
    });
    it("ignores missing keys", () => {
      expect(objectUtilities.pick({ a: 1 }, ["a", "z"])).toEqual({ a: 1 });
    });
  });

  describe("omit", () => {
    it("omits specified keys", () => {
      expect(objectUtilities.omit({ a: 1, b: 2, c: 3 }, ["b"])).toEqual({ a: 1, c: 3 });
    });
  });
});

// ─── Math ───────────────────────────────────────────────────────

describe("math.js", () => {
  let mathUtilities;
  beforeAll(async () => {
    mathUtilities = await import("../dist/math.js");
  });

  describe("clamp", () => {
    it("clamps below min", () => {
      expect(mathUtilities.clamp(-5, 0, 10)).toBe(0);
    });
    it("clamps above max", () => {
      expect(mathUtilities.clamp(15, 0, 10)).toBe(10);
    });
    it("passes through in range", () => {
      expect(mathUtilities.clamp(5, 0, 10)).toBe(5);
    });
  });

  describe("roundCents", () => {
    it("rounds to 2 decimal places", () => {
      expect(mathUtilities.roundCents(1.005)).toBe(1.01);
      expect(mathUtilities.roundCents(1.004)).toBe(1.0);
      expect(mathUtilities.roundCents(99.999)).toBe(100);
    });
  });

  describe("randomInt", () => {
    it("returns value within bounds", () => {
      for (let i = 0; i < 100; i++) {
        const randomValue = mathUtilities.randomInt(5, 10);
        expect(randomValue).toBeGreaterThanOrEqual(5);
        expect(randomValue).toBeLessThanOrEqual(10);
        expect(Number.isInteger(randomValue)).toBe(true);
      }
    });
  });

  describe("cosineSimilarity", () => {
    it("returns 1 for identical vectors", () => {
      expect(mathUtilities.cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1);
    });
    it("returns 0 for orthogonal vectors", () => {
      expect(mathUtilities.cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
    });
    it("returns -1 for opposite vectors", () => {
      expect(mathUtilities.cosineSimilarity([1, 0], [-1, 0])).toBeCloseTo(-1);
    });
    it("returns 0 for invalid input", () => {
      expect(mathUtilities.cosineSimilarity(null, [1])).toBe(0);
      expect(mathUtilities.cosineSimilarity([1], [1, 2])).toBe(0);
    });
  });
});

// ─── Validation ─────────────────────────────────────────────────

describe("validation.js", () => {
  let validationUtilities;
  beforeAll(async () => {
    validationUtilities = await import("../dist/validation.js");
  });

  describe("parseIntParam", () => {
    it("uses default for null", () => {
      expect(validationUtilities.parseIntParam(undefined, 10)).toBe(10);
    });
    it("parses valid string", () => {
      expect(validationUtilities.parseIntParam("25", 10)).toBe(25);
    });
    it("clamps to max", () => {
      expect(validationUtilities.parseIntParam("100", 10, 50)).toBe(50);
    });
    it("uses default for NaN", () => {
      expect(validationUtilities.parseIntParam("abc", 10)).toBe(10);
    });
  });

  describe("parsePrice", () => {
    it("parses dollar string", () => {
      expect(validationUtilities.parsePrice("$29.99")).toBe(29.99);
    });
    it("returns null for empty", () => {
      expect(validationUtilities.parsePrice("")).toBeNull();
    });
  });

  describe("parseJsonSafe", () => {
    it("parses valid JSON", () => {
      expect(validationUtilities.parseJsonSafe('{"a":1}')).toEqual({ a: 1 });
    });
    it("returns fallback for invalid JSON", () => {
      expect(validationUtilities.parseJsonSafe("not json", "default")).toBe("default");
    });
    it("returns fallback for null", () => {
      expect(validationUtilities.parseJsonSafe(null)).toBeNull();
    });
  });

  describe("parseJsonFromLargeLanguageModelResponse", () => {
    it("extracts from markdown fence", () => {
      const result = validationUtilities.parseJsonFromLargeLanguageModelResponse('```json\n{"a":1}\n```');
      expect(result).toEqual({ a: 1 });
    });
    it("handles bare JSON", () => {
      expect(validationUtilities.parseJsonFromLargeLanguageModelResponse('{"a":1}')).toEqual({ a: 1 });
    });
    it("extracts from surrounding text", () => {
      const result = validationUtilities.parseJsonFromLargeLanguageModelResponse('Here is the result: {"a":1} done');
      expect(result).toEqual({ a: 1 });
    });
    it("handles arrays", () => {
      expect(validationUtilities.parseJsonFromLargeLanguageModelResponse("[1,2,3]")).toEqual([1, 2, 3]);
    });
    it("returns null for unparseable", () => {
      expect(validationUtilities.parseJsonFromLargeLanguageModelResponse("just text")).toBeNull();
    });
    it("returns null for null/empty", () => {
      expect(validationUtilities.parseJsonFromLargeLanguageModelResponse(null)).toBeNull();
      expect(validationUtilities.parseJsonFromLargeLanguageModelResponse("")).toBeNull();
    });
  });
});

// ─── Crypto ─────────────────────────────────────────────────────

describe("crypto.js", () => {
  let cryptoUtilities;
  beforeAll(async () => {
    cryptoUtilities = await import("../dist/crypto.js");
  });

  describe("generateUUID", () => {
    it("returns a valid UUID format", () => {
      const uuidValue = cryptoUtilities.generateUUID();
      expect(uuidValue).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });
    it("generates unique values", () => {
      const uuidValue = cryptoUtilities.generateUUID();
      const secondUuidValue = cryptoUtilities.generateUUID();
      expect(uuidValue).not.toBe(secondUuidValue);
    });
  });
});

// ─── Phone ──────────────────────────────────────────────────────

describe("phone.js", () => {
  let phoneUtilities;
  beforeAll(async () => {
    phoneUtilities = await import("../dist/phone.js");
  });

  describe("formatPhone", () => {
    it("formats 11-digit NANP", () => {
      expect(phoneUtilities.formatPhone("16045551234")).toBe("+1 (604) 555-1234");
    });
    it("formats 10-digit", () => {
      expect(phoneUtilities.formatPhone("6045551234")).toBe("(604) 555-1234");
    });
    it("returns Unknown for null", () => {
      expect(phoneUtilities.formatPhone(null)).toBe("Unknown");
    });
    it("passes through other formats", () => {
      expect(phoneUtilities.formatPhone("+44 20 7946 0958")).toBe("+44 20 7946 0958");
    });
  });
});

// ─── New Text Utilities ─────────────────────────────────────────

describe("text.js — new utilities", () => {
  let textUtilities;
  beforeAll(async () => {
    textUtilities = await import("../dist/text.js");
  });

  describe("slugify", () => {
    it("converts to URL-safe slug", () => {
      expect(textUtilities.slugify("Hello World! Foo")).toBe("hello-world-foo");
    });
    it("strips diacritics", () => {
      expect(textUtilities.slugify("Café Résumé")).toBe("cafe-resume");
    });
    it("collapses multiple separators", () => {
      expect(textUtilities.slugify("hello   ---   world")).toBe("hello-world");
    });
    it("handles null/empty", () => {
      expect(textUtilities.slugify(null)).toBe("");
      expect(textUtilities.slugify("")).toBe("");
    });
  });

  describe("toKebabCase", () => {
    it("converts camelCase", () => {
      expect(textUtilities.toKebabCase("helloWorld")).toBe("hello-world");
    });
    it("converts spaces and underscores", () => {
      expect(textUtilities.toKebabCase("Hello World_Test")).toBe("hello-world-test");
    });
  });

  describe("toCamelCase", () => {
    it("converts kebab-case", () => {
      expect(textUtilities.toCamelCase("hello-world")).toBe("helloWorld");
    });
    it("converts snake_case", () => {
      expect(textUtilities.toCamelCase("hello_world")).toBe("helloWorld");
    });
    it("converts from PascalCase", () => {
      expect(textUtilities.toCamelCase("HelloWorld")).toBe("helloWorld");
    });
  });

  describe("toPascalCase", () => {
    it("converts from kebab-case", () => {
      expect(textUtilities.toPascalCase("hello-world")).toBe("HelloWorld");
    });
  });

  describe("toSnakeCase", () => {
    it("converts camelCase", () => {
      expect(textUtilities.toSnakeCase("helloWorld")).toBe("hello_world");
    });
    it("converts spaces", () => {
      expect(textUtilities.toSnakeCase("Hello World")).toBe("hello_world");
    });
  });

  describe("pluralize", () => {
    it("returns singular for count 1", () => {
      expect(textUtilities.pluralize("item", 1)).toBe("item");
    });
    it("appends s for other counts", () => {
      expect(textUtilities.pluralize("item", 0)).toBe("items");
      expect(textUtilities.pluralize("item", 5)).toBe("items");
    });
    it("uses custom plural form", () => {
      expect(textUtilities.pluralize("child", 3, "children")).toBe("children");
    });
  });

  describe("wordCount", () => {
    it("counts words", () => {
      expect(textUtilities.wordCount("hello world foo")).toBe(3);
    });
    it("handles extra whitespace", () => {
      expect(textUtilities.wordCount("  hello   world  ")).toBe(2);
    });
    it("returns 0 for null/empty", () => {
      expect(textUtilities.wordCount(null)).toBe(0);
      expect(textUtilities.wordCount("")).toBe(0);
    });
  });
});

// ─── New Math Utilities ─────────────────────────────────────────

describe("math.js — new utilities", () => {
  let mathUtilities;
  beforeAll(async () => {
    mathUtilities = await import("../dist/math.js");
  });

  describe("lerp", () => {
    it("returns a when t=0", () => {
      expect(mathUtilities.lerp(0, 100, 0)).toBe(0);
    });
    it("returns b when t=1", () => {
      expect(mathUtilities.lerp(0, 100, 1)).toBe(100);
    });
    it("interpolates at midpoint", () => {
      expect(mathUtilities.lerp(0, 100, 0.5)).toBe(50);
    });
  });

  describe("remap", () => {
    it("remaps value between ranges", () => {
      expect(mathUtilities.remap(50, 0, 100, 0, 1)).toBe(0.5);
    });
    it("handles negative output ranges", () => {
      expect(mathUtilities.remap(75, 0, 100, -10, 10)).toBe(5);
    });
  });

  describe("sum", () => {
    it("sums numbers", () => {
      expect(mathUtilities.sum([1, 2, 3, 4])).toBe(10);
    });
    it("returns 0 for empty/null", () => {
      expect(mathUtilities.sum([])).toBe(0);
      expect(mathUtilities.sum(null)).toBe(0);
    });
  });

  describe("average", () => {
    it("computes arithmetic mean", () => {
      expect(mathUtilities.average([10, 20, 30])).toBe(20);
    });
    it("returns 0 for empty", () => {
      expect(mathUtilities.average([])).toBe(0);
    });
  });

  describe("median", () => {
    it("returns middle for odd-length", () => {
      expect(mathUtilities.median([3, 1, 2])).toBe(2);
    });
    it("returns average of middle two for even-length", () => {
      expect(mathUtilities.median([1, 2, 3, 4])).toBe(2.5);
    });
    it("returns 0 for empty", () => {
      expect(mathUtilities.median([])).toBe(0);
    });
    it("does not mutate input", () => {
      const input = [3, 1, 2];
      mathUtilities.median(input);
      expect(input).toEqual([3, 1, 2]);
    });
  });

  describe("roundTo", () => {
    it("rounds to specified decimals", () => {
      expect(mathUtilities.roundTo(1.23456, 3)).toBe(1.235);
    });
    it("defaults to 2 decimals", () => {
      expect(mathUtilities.roundTo(1.005)).toBe(1.01);
    });
  });
});

// ─── New Object Utilities ───────────────────────────────────────

describe("objects.js — new utilities", () => {
  let objectUtilities;
  beforeAll(async () => {
    objectUtilities = await import("../dist/objects.js");
  });

  describe("mapValues", () => {
    it("transforms values", () => {
      expect(objectUtilities.mapValues({ a: 1, b: 2 }, (value) => value * 2)).toEqual({ a: 2, b: 4 });
    });
    it("passes key as second arg", () => {
      const result = objectUtilities.mapValues({ x: 1 }, (value, key) => `${key}=${value}`);
      expect(result.x).toBe("x=1");
    });
  });

  describe("mapKeys", () => {
    it("transforms keys", () => {
      expect(objectUtilities.mapKeys({ a: 1, b: 2 }, (k) => k.toUpperCase())).toEqual({ A: 1, B: 2 });
    });
  });

  describe("invert", () => {
    it("swaps keys and values", () => {
      expect(objectUtilities.invert({ a: "1", b: "2" })).toEqual({ "1": "a", "2": "b" });
    });
  });

  describe("isEmpty", () => {
    it("returns true for null/undefined", () => {
      expect(objectUtilities.isEmpty(null)).toBe(true);
      expect(objectUtilities.isEmpty(undefined)).toBe(true);
    });
    it("returns true for empty string", () => {
      expect(objectUtilities.isEmpty("")).toBe(true);
    });
    it("returns true for empty array", () => {
      expect(objectUtilities.isEmpty([])).toBe(true);
    });
    it("returns true for empty object", () => {
      expect(objectUtilities.isEmpty({})).toBe(true);
    });
    it("returns true for empty Map/Set", () => {
      expect(objectUtilities.isEmpty(new Map())).toBe(true);
      expect(objectUtilities.isEmpty(new Set())).toBe(true);
    });
    it("returns false for non-empty values", () => {
      expect(objectUtilities.isEmpty("hi")).toBe(false);
      expect(objectUtilities.isEmpty([1])).toBe(false);
      expect(objectUtilities.isEmpty({ a: 1 })).toBe(false);
      expect(objectUtilities.isEmpty(0)).toBe(false);
      expect(objectUtilities.isEmpty(false)).toBe(false);
    });
  });

  describe("deepEqual", () => {
    it("returns true for identical primitives", () => {
      expect(objectUtilities.deepEqual(1, 1)).toBe(true);
      expect(objectUtilities.deepEqual("a", "a")).toBe(true);
    });
    it("returns false for different primitives", () => {
      expect(objectUtilities.deepEqual(1, 2)).toBe(false);
    });
    it("deeply compares objects", () => {
      expect(objectUtilities.deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
      expect(objectUtilities.deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
    });
    it("deeply compares arrays", () => {
      expect(objectUtilities.deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
      expect(objectUtilities.deepEqual([1, 2], [1, 3])).toBe(false);
    });
    it("handles null comparison", () => {
      expect(objectUtilities.deepEqual(null, null)).toBe(true);
      expect(objectUtilities.deepEqual(null, {})).toBe(false);
    });
  });
});

// ─── New Array Utilities ────────────────────────────────────────

describe("arrays.js — new utilities", () => {
  let arrayUtilities;
  beforeAll(async () => {
    arrayUtilities = await import("../dist/arrays.js");
  });

  describe("partition", () => {
    it("splits by predicate", () => {
      const [evens, odds] = arrayUtilities.partition([1, 2, 3, 4, 5], (numberValue) => numberValue % 2 === 0);
      expect(evens).toEqual([2, 4]);
      expect(odds).toEqual([1, 3, 5]);
    });
  });

  describe("intersection", () => {
    it("returns shared elements", () => {
      expect(arrayUtilities.intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    });
    it("preserves order from first array", () => {
      expect(arrayUtilities.intersection([3, 1, 2], [2, 3])).toEqual([3, 2]);
    });
  });

  describe("difference", () => {
    it("returns elements only in first array", () => {
      expect(arrayUtilities.difference([1, 2, 3], [2, 4])).toEqual([1, 3]);
    });
  });

  describe("sortBy", () => {
    it("sorts by string key", () => {
      const items = [{ name: "c" }, { name: "a" }, { name: "b" }];
      expect(arrayUtilities.sortBy(items, "name").map((i) => i.name)).toEqual(["a", "b", "c"]);
    });
    it("sorts descending", () => {
      const items = [{ value: 1 }, { value: 3 }, { value: 2 }];
      expect(arrayUtilities.sortBy(items, "value", { descending: true }).map((i) => i.value)).toEqual([3, 2, 1]);
    });
    it("does not mutate original", () => {
      const items = [{ value: 3 }, { value: 1 }];
      arrayUtilities.sortBy(items, "value");
      expect(items[0].value).toBe(3);
    });
    it("accepts comparator function", () => {
      const result = arrayUtilities.sortBy([3, 1, 2], (itemA, itemB) => itemA - itemB);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe("flatten", () => {
    it("flattens one level by default", () => {
      expect(arrayUtilities.flatten([[1, 2], [3, [4]]])).toEqual([1, 2, 3, [4]]);
    });
    it("fully flattens with Infinity", () => {
      expect(arrayUtilities.flatten([[1, [2, [3, [4]]]]], Infinity)).toEqual([1, 2, 3, 4]);
    });
  });
});

// ─── New Async Utilities ────────────────────────────────────────

describe("async.js — new utilities", () => {
  let asyncModule;
  beforeAll(async () => {
    asyncModule = await import("../dist/async.js");
  });

  describe("pMap", () => {
    it("maps concurrently", async () => {
      const results = await asyncModule.pMap([1, 2, 3], async (numberValue) => numberValue * 2);
      expect(results).toEqual([2, 4, 6]);
    });
    it("respects concurrency limit", async () => {
      let active = 0;
      let maxActive = 0;
      const results = await asyncModule.pMap(
        [1, 2, 3, 4, 5],
        async (numberValue) => {
          active++;
          maxActive = Math.max(maxActive, active);
          await asyncModule.sleep(10);
          active--;
          return numberValue;
        },
        { concurrency: 2 },
      );
      expect(results).toEqual([1, 2, 3, 4, 5]);
      expect(maxActive).toBeLessThanOrEqual(2);
    });
    it("preserves order", async () => {
      const results = await asyncModule.pMap(
        [30, 10, 20],
        async (ms) => {
          await asyncModule.sleep(ms);
          return ms;
        },
        { concurrency: 3 },
      );
      expect(results).toEqual([30, 10, 20]);
    });
  });

  describe("defer", () => {
    it("resolves externally", async () => {
      const { promise, resolve } = asyncModule.defer();
      setTimeout(() => resolve("done"), 10);
      const result = await promise;
      expect(result).toBe("done");
    });
    it("rejects externally", async () => {
      const { promise, reject } = asyncModule.defer();
      setTimeout(() => reject(new Error("fail")), 10);
      await expect(promise).rejects.toThrow("fail");
    });
  });
});

// ─── New Validation Utilities ───────────────────────────────────

describe("validation.js — new utilities", () => {
  let validationUtilities;
  beforeAll(async () => {
    validationUtilities = await import("../dist/validation.js");
  });

  describe("isEmail", () => {
    it("validates correct emails", () => {
      expect(validationUtilities.isEmail("user@example.com")).toBe(true);
      expect(validationUtilities.isEmail("hello@rod.dev")).toBe(true);
    });
    it("rejects invalid emails", () => {
      expect(validationUtilities.isEmail("not-an-email")).toBe(false);
      expect(validationUtilities.isEmail("@nope.com")).toBe(false);
      expect(validationUtilities.isEmail("user@x.y")).toBe(false); // 1-char TLD rejected
      expect(validationUtilities.isEmail(null)).toBe(false);
      expect(validationUtilities.isEmail("")).toBe(false);
    });
  });

  describe("isUrl", () => {
    it("validates HTTP URLs", () => {
      expect(validationUtilities.isUrl("http://example.com")).toBe(true);
      expect(validationUtilities.isUrl("https://rod.dev/page")).toBe(true);
    });
    it("rejects non-HTTP protocols", () => {
      expect(validationUtilities.isUrl("ftp://files.com")).toBe(false);
    });
    it("enforces HTTPS when required", () => {
      expect(validationUtilities.isUrl("http://example.com", { requireHttps: true })).toBe(false);
      expect(validationUtilities.isUrl("https://example.com", { requireHttps: true })).toBe(true);
    });
    it("rejects invalid URLs", () => {
      expect(validationUtilities.isUrl("not a url")).toBe(false);
      expect(validationUtilities.isUrl(null)).toBe(false);
    });
  });

  describe("isNumeric", () => {
    it("validates numbers", () => {
      expect(validationUtilities.isNumeric(42)).toBe(true);
      expect(validationUtilities.isNumeric(3.14)).toBe(true);
      expect(validationUtilities.isNumeric("100")).toBe(true);
      expect(validationUtilities.isNumeric("-5.5")).toBe(true);
    });
    it("rejects non-numeric", () => {
      expect(validationUtilities.isNumeric("abc")).toBe(false);
      expect(validationUtilities.isNumeric(NaN)).toBe(false);
      expect(validationUtilities.isNumeric(Infinity)).toBe(false);
      expect(validationUtilities.isNumeric("")).toBe(false);
      expect(validationUtilities.isNumeric("  ")).toBe(false);
    });
  });
});

// ─── Rate Utilities ─────────────────────────────────────────────

describe("rate.js", () => {
  let rate, sleep;
  beforeAll(async () => {
    rate = await import("../dist/rate.js");
    sleep = (await import("../dist/async.js")).sleep;
  });

  describe("debounce", () => {
    it("delays execution", async () => {
      let count = 0;
      const fn = rate.debounce(() => count++, 50);
      fn();
      fn();
      fn();
      expect(count).toBe(0);
      await sleep(80);
      expect(count).toBe(1);
    });

    it("supports leading edge", async () => {
      let count = 0;
      const fn = rate.debounce(() => count++, 50, { leading: true });
      fn();
      expect(count).toBe(1);
      fn();
      fn();
      await sleep(80);
      expect(count).toBe(2); // leading + trailing
    });

    it("cancel prevents execution", async () => {
      let count = 0;
      const fn = rate.debounce(() => count++, 50);
      fn();
      fn.cancel();
      await sleep(80);
      expect(count).toBe(0);
    });
  });

  describe("throttle", () => {
    it("invokes immediately on first call", () => {
      let count = 0;
      const fn = rate.throttle(() => count++, 100);
      fn();
      expect(count).toBe(1);
      fn.cancel();
    });

    it("throttles subsequent calls", async () => {
      let count = 0;
      const fn = rate.throttle(() => count++, 50);
      fn();
      fn();
      fn();
      expect(count).toBe(1);
      await sleep(80);
      expect(count).toBe(2); // trailing call fires
      fn.cancel();
    });
  });
});

// ─── Color Utilities ────────────────────────────────────────────

describe("color.js", () => {
  let color;
  beforeAll(async () => {
    color = await import("../dist/color.js");
  });

  describe("parseHex", () => {
    it("parses 6-digit hex", () => {
      expect(color.parseHex("#ff8800")).toEqual({ r: 255, g: 136, b: 0, a: 1 });
    });
    it("parses 3-digit hex", () => {
      expect(color.parseHex("#f80")).toEqual({ r: 255, g: 136, b: 0, a: 1 });
    });
    it("parses without hash", () => {
      expect(color.parseHex("ff0000")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    });
    it("parses 8-digit hex with alpha", () => {
      const result = color.parseHex("#ff000080");
      expect(result.r).toBe(255);
      expect(result.a).toBeCloseTo(0.502, 2);
    });
  });

  describe("toHex", () => {
    it("converts RGB to hex string", () => {
      expect(color.toHex({ r: 255, g: 0, b: 0 })).toBe("#ff0000");
    });
    it("pads single-digit channels", () => {
      expect(color.toHex({ r: 0, g: 0, b: 0 })).toBe("#000000");
    });
  });

  describe("lerpColor", () => {
    it("returns colorA at t=0", () => {
      expect(color.lerpColor("#000000", "#ffffff", 0)).toBe("#000000");
    });
    it("returns colorB at t=1", () => {
      expect(color.lerpColor("#000000", "#ffffff", 1)).toBe("#ffffff");
    });
    it("interpolates at midpoint", () => {
      const result = color.lerpColor("#000000", "#ffffff", 0.5);
      // Should be around #808080 (grey)
      expect(result).toMatch(/^#[78][0-9a-f][78][0-9a-f][78][0-9a-f]$/);
    });
  });

  describe("adjustBrightness", () => {
    it("lightens a color", () => {
      const lighter = color.adjustBrightness("#800000", 20);
      const parsed = color.parseHex(lighter);
      expect(parsed.r).toBeGreaterThan(128);
    });
    it("darkens a color", () => {
      const darker = color.adjustBrightness("#ff0000", -30);
      const parsed = color.parseHex(darker);
      expect(parsed.r).toBeLessThan(255);
    });
  });

  describe("lerpRgb", () => {
    it("interpolates between two rgb triplets", () => {
      const colorA = [0, 100, 200];
      const colorB = [100, 200, 255];
      const result = color.lerpRgb(colorA, colorB, 0.5);
      expect(result).toEqual([50, 150, 227.5]);
    });
  });

  describe("paletteAt", () => {
    it("samples a palette of triplets at dynamic positions", () => {
      const palette = [
        [255, 0, 0],
        [0, 255, 0],
        [0, 0, 255],
      ];
      const midpoint = color.paletteAt(palette, 0.5);
      expect(midpoint).toEqual([0, 127.5, 127.5]);
    });
  });
});

// ─── Taxonomy ───────────────────────────────────────────────────

describe("taxonomy.js", () => {
  let taxonomyModule;
  beforeAll(async () => {
    taxonomyModule = await import("../dist/taxonomy/index.js");
  });

  describe("INPUT_MODALITIES", () => {
    it("defines the expected modality categories", () => {
      expect(taxonomyModule.INPUT_MODALITIES.IMAGE).toBe("image");
      expect(taxonomyModule.INPUT_MODALITIES.AUDIO).toBe("audio");
      expect(taxonomyModule.INPUT_MODALITIES.VIDEO).toBe("video");
      expect(taxonomyModule.INPUT_MODALITIES.PDF).toBe("pdf");
      expect(taxonomyModule.INPUT_MODALITIES.DOCUMENT).toBe("document");
    });
  });

  describe("TOOL_INPUT_MODALITIES", () => {
    it("maps tools to their correct input modalities", () => {
      expect(taxonomyModule.TOOL_INPUT_MODALITIES[taxonomyModule.TOOL_NAMES.GENERATE_IMAGE]).toContain(taxonomyModule.INPUT_MODALITIES.IMAGE);
      expect(taxonomyModule.TOOL_INPUT_MODALITIES[taxonomyModule.TOOL_NAMES.TRANSCRIBE_AUDIO]).toContain(taxonomyModule.INPUT_MODALITIES.AUDIO);
      expect(taxonomyModule.TOOL_INPUT_MODALITIES.read_pdf).toContain(taxonomyModule.INPUT_MODALITIES.PDF);
      expect(taxonomyModule.TOOL_INPUT_MODALITIES.read_docx).toContain(taxonomyModule.INPUT_MODALITIES.DOCUMENT);
      expect(taxonomyModule.TOOL_INPUT_MODALITIES.read_spreadsheet).toContain(taxonomyModule.INPUT_MODALITIES.DOCUMENT);
      expect(taxonomyModule.TOOL_INPUT_MODALITIES.convert_video_to_gif).toContain(taxonomyModule.INPUT_MODALITIES.VIDEO);
    });
  });
});

