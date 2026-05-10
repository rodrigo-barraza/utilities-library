// ── Comprehensive unit tests for utilities-library ──

import { describe, it, expect } from "vitest";

// ─── Format ─────────────────────────────────────────────────────

describe("format.js", () => {
  let fmt;
  beforeAll(async () => {
    fmt = await import("../src/format.js");
  });

  describe("formatCompact", () => {
    it("returns em-dash for null/undefined", () => {
      expect(fmt.formatCompact(null)).toBe("—");
      expect(fmt.formatCompact(undefined)).toBe("—");
    });
    it("formats millions", () => {
      expect(fmt.formatCompact(10_000_000)).toBe("10M");
      expect(fmt.formatCompact(3_500_000)).toBe("3.5M");
    });
    it("formats thousands", () => {
      expect(fmt.formatCompact(3500)).toBe("3.5K");
      expect(fmt.formatCompact(1000)).toBe("1K");
    });
    it("passes through small numbers", () => {
      expect(fmt.formatCompact(42)).toBe("42");
    });
  });

  describe("formatNumber", () => {
    it("returns 0 for null/undefined", () => {
      expect(fmt.formatNumber(null)).toBe("0");
    });
    it("truncates decimals", () => {
      expect(fmt.formatNumber(3500)).toBe("4K");
    });
  });

  describe("formatCost", () => {
    it("formats with 5 decimals", () => {
      expect(fmt.formatCost(0.001)).toBe("$0.00100");
    });
    it("handles null", () => {
      expect(fmt.formatCost(null)).toBe("$0.00");
    });
  });

  describe("formatCostAdaptive", () => {
    it("uses 4 decimals for tiny costs", () => {
      expect(fmt.formatCostAdaptive(0.0034)).toBe("$0.0034");
    });
    it("uses 2 decimals for normal costs", () => {
      expect(fmt.formatCostAdaptive(1.5)).toBe("$1.50");
    });
    it("returns $0.00 for zero", () => {
      expect(fmt.formatCostAdaptive(0)).toBe("$0.00");
    });
  });

  describe("formatLatency", () => {
    it("formats sub-second as ms", () => {
      expect(fmt.formatLatency(0.3)).toBe("300ms");
    });
    it("formats seconds", () => {
      expect(fmt.formatLatency(5.2)).toBe("5.2s");
    });
    it("formats minutes", () => {
      expect(fmt.formatLatency(90)).toBe("1.5m");
    });
  });

  describe("formatDuration", () => {
    it("formats milliseconds", () => {
      expect(fmt.formatDuration(500)).toBe("500ms");
    });
    it("formats seconds", () => {
      expect(fmt.formatDuration(5000)).toBe("5.0s");
    });
    it("formats minutes + seconds", () => {
      expect(fmt.formatDuration(90_000)).toBe("1m 30s");
    });
    it("formats hours", () => {
      expect(fmt.formatDuration(3_660_000)).toBe("1h 1m");
    });
    it("returns em-dash for null", () => {
      expect(fmt.formatDuration(null)).toBe("—");
    });
  });

  describe("formatElapsedTime", () => {
    it("delegates to formatDuration", () => {
      expect(fmt.formatElapsedTime(65)).toBe("1m 5s");
    });
    it("returns 0s for null/zero/negative", () => {
      expect(fmt.formatElapsedTime(null)).toBe("0s");
      expect(fmt.formatElapsedTime(0)).toBe("0s");
      expect(fmt.formatElapsedTime(-1)).toBe("0s");
    });
  });

  describe("formatFileSize", () => {
    it("formats KB", () => {
      expect(fmt.formatFileSize(2048)).toBe("2 KB");
    });
    it("formats MB", () => {
      expect(fmt.formatFileSize(1_048_576)).toBe("1.0 MB");
    });
    it("compact mode", () => {
      expect(fmt.formatFileSize(0, { compact: true })).toBe("0B");
      expect(fmt.formatFileSize(512, { compact: true })).toBe("512B");
    });
    it("returns null for falsy in normal mode", () => {
      expect(fmt.formatFileSize(0)).toBeNull();
    });
  });

  describe("formatPercent", () => {
    it("formats with default precision", () => {
      expect(fmt.formatPercent(85.456)).toBe("85.5%");
    });
    it("returns em-dash for null", () => {
      expect(fmt.formatPercent(null)).toBe("—");
    });
  });

  describe("formatContextTokens", () => {
    it("delegates to formatCompact", () => {
      expect(fmt.formatContextTokens(128_000)).toBe("128K");
    });
    it("returns null for falsy", () => {
      expect(fmt.formatContextTokens(0)).toBeNull();
    });
  });

  describe("formatCurrency", () => {
    it("formats USD", () => {
      expect(fmt.formatCurrency(1500)).toBe("$1,500.00");
    });
    it("uses 4 decimals for tiny amounts", () => {
      expect(fmt.formatCurrency(0.005)).toBe("$0.0050");
    });
  });

  describe("roundMs", () => {
    it("rounds to 3 decimal places", () => {
      expect(fmt.roundMs(1.23456789)).toBe(1.235);
    });
  });
});

// ─── Text ───────────────────────────────────────────────────────

describe("text.js", () => {
  let txt;
  beforeAll(async () => {
    txt = await import("../src/text.js");
  });

  describe("stripHtml", () => {
    it("removes tags", () => {
      expect(txt.stripHtml("<b>Hello</b>")).toBe("Hello");
    });
    it("decodes entities", () => {
      expect(txt.stripHtml("&amp; &lt; &gt;")).toBe("& < >");
    });
    it("handles null", () => {
      expect(txt.stripHtml(null)).toBe("");
    });
  });

  describe("normalizeName", () => {
    it("lowercases and strips special chars", () => {
      expect(txt.normalizeName("Hello, World!")).toBe("hello world");
    });
  });

  describe("renderToolName", () => {
    it("strips get_ prefix and title-cases", () => {
      expect(txt.renderToolName("get_stock_price")).toBe("Stock Price");
    });
    it("strips mcp__ prefix", () => {
      expect(txt.renderToolName("mcp__github__list_repos")).toBe("List Repos");
    });
  });

  describe("truncate", () => {
    it("returns full string if within limit", () => {
      expect(txt.truncate("short", 80)).toBe("short");
    });
    it("truncates with ellipsis", () => {
      const result = txt.truncate("This is a long string", 10);
      expect(result.length).toBeLessThanOrEqual(10);
      expect(result.endsWith("…")).toBe(true);
    });
    it("handles null/empty", () => {
      expect(txt.truncate(null)).toBe("");
      expect(txt.truncate("")).toBe("");
    });
  });

  describe("escapeRegex", () => {
    it("escapes special characters", () => {
      expect(txt.escapeRegex("file.txt")).toBe("file\\.txt");
      expect(txt.escapeRegex("a+b*c")).toBe("a\\+b\\*c");
    });
  });

  describe("getRootDomain / getSubdomain", () => {
    it("extracts root domain", () => {
      expect(txt.getRootDomain("api.prism.rod.dev")).toBe("rod.dev");
    });
    it("extracts subdomain", () => {
      expect(txt.getSubdomain("api.prism.rod.dev")).toBe("api.prism");
    });
    it("returns empty subdomain for bare domains", () => {
      expect(txt.getSubdomain("rod.dev")).toBe("");
    });
  });

  describe("capitalize", () => {
    it("capitalizes first char", () => {
      expect(txt.capitalize("hello")).toBe("Hello");
    });
    it("leaves already-capitalized strings alone", () => {
      expect(txt.capitalize("HELLO")).toBe("HELLO");
    });
    it("handles null/empty", () => {
      expect(txt.capitalize(null)).toBe("");
      expect(txt.capitalize("")).toBe("");
    });
  });
});

// ─── Date ───────────────────────────────────────────────────────

describe("date.js", () => {
  let date;
  beforeAll(async () => {
    date = await import("../src/date.js");
  });

  describe("toISODate", () => {
    it("formats as YYYY-MM-DD", () => {
      const d = new Date("2026-05-08T12:00:00Z");
      expect(date.toISODate(d)).toBe("2026-05-08");
    });
  });

  describe("timeAgo", () => {
    it("returns em-dash for null", () => {
      expect(date.timeAgo(null)).toBe("—");
    });
    it("returns 'just now' for recent dates", () => {
      expect(date.timeAgo(new Date())).toBe("just now");
    });
    it("returns seconds ago", () => {
      const d = new Date(Date.now() - 30_000);
      expect(date.timeAgo(d)).toBe("30s ago");
    });
    it("returns minutes ago", () => {
      const d = new Date(Date.now() - 5 * 60_000);
      expect(date.timeAgo(d)).toBe("5m ago");
    });
    it("returns hours ago", () => {
      const d = new Date(Date.now() - 3 * 3_600_000);
      expect(date.timeAgo(d)).toBe("3h ago");
    });
    it("returns days ago", () => {
      const d = new Date(Date.now() - 5 * 86_400_000);
      expect(date.timeAgo(d)).toBe("5d ago");
    });
  });

  describe("daysSinceIso", () => {
    it("returns 0 for today", () => {
      expect(date.daysSinceIso(new Date().toISOString())).toBe(0);
    });
  });

  describe("daysAgo", () => {
    it("returns a Date in the past", () => {
      const d = date.daysAgo(7);
      const diff = Date.now() - d.getTime();
      expect(Math.floor(diff / 86_400_000)).toBe(7);
    });
  });

  describe("toLocalDateString", () => {
    it("returns YYYY-MM-DD in local time", () => {
      const result = date.toLocalDateString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});

// ─── Async ──────────────────────────────────────────────────────

describe("async.js", () => {
  let async;
  beforeAll(async () => {
    async = await import("../src/async.js");
  });

  describe("sleep", () => {
    it("resolves after delay", async () => {
      const start = Date.now();
      await async.sleep(50);
      expect(Date.now() - start).toBeGreaterThanOrEqual(40);
    });
  });

  describe("retry", () => {
    it("retries on failure", async () => {
      let attempts = 0;
      const result = await async.retry(
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
        async.retry(() => { throw new Error("always"); }, { retries: 2, delay: 10 }),
      ).rejects.toThrow("always");
    });
  });

  describe("withTimeout", () => {
    it("resolves if promise is fast", async () => {
      const result = await async.withTimeout(Promise.resolve("ok"), 1000);
      expect(result).toBe("ok");
    });
    it("rejects on timeout", async () => {
      await expect(
        async.withTimeout(new Promise(() => {}), 50, "timed out"),
      ).rejects.toThrow("timed out");
    });
  });
});

// ─── Time ───────────────────────────────────────────────────────

describe("time.js", () => {
  let time;
  beforeAll(async () => {
    time = await import("../src/time.js");
  });

  it("defines MS constants", () => {
    expect(time.MS_PER_SECOND).toBe(1_000);
    expect(time.MS_PER_MINUTE).toBe(60_000);
    expect(time.MS_PER_HOUR).toBe(3_600_000);
    expect(time.MS_PER_DAY).toBe(86_400_000);
  });

  it("converter functions work", () => {
    expect(time.seconds(5)).toBe(5_000);
    expect(time.minutes(2)).toBe(120_000);
    expect(time.hours(1)).toBe(3_600_000);
    expect(time.days(1)).toBe(86_400_000);
    expect(time.weeks(1)).toBe(604_800_000);
  });
});

// ─── Arrays ─────────────────────────────────────────────────────

describe("arrays.js", () => {
  let arr;
  beforeAll(async () => {
    arr = await import("../src/arrays.js");
  });

  describe("chunk", () => {
    it("splits into chunks", () => {
      expect(arr.chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });
    it("handles empty array", () => {
      expect(arr.chunk([], 3)).toEqual([]);
    });
  });

  describe("shuffleArray", () => {
    it("returns same length", () => {
      const input = [1, 2, 3, 4, 5];
      const result = arr.shuffleArray(input);
      expect(result).toHaveLength(5);
      expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
    });
    it("does not mutate original", () => {
      const input = [1, 2, 3];
      arr.shuffleArray(input);
      expect(input).toEqual([1, 2, 3]);
    });
  });

  describe("pickRandom", () => {
    it("returns an element from the array", () => {
      const input = [1, 2, 3];
      expect(input).toContain(arr.pickRandom(input));
    });
  });

  describe("compactPayload", () => {
    it("strips null/undefined but keeps falsy values", () => {
      const result = arr.compactPayload({ a: 1, b: null, c: 0, d: undefined, e: false, f: "" });
      expect(result).toEqual({ a: 1, c: 0, e: false, f: "" });
    });
  });

  describe("groupBy", () => {
    it("groups by string key", () => {
      const items = [{ type: "a", v: 1 }, { type: "b", v: 2 }, { type: "a", v: 3 }];
      const result = arr.groupBy(items, "type");
      expect(result.a).toHaveLength(2);
      expect(result.b).toHaveLength(1);
    });
    it("groups by function", () => {
      const result = arr.groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? "even" : "odd"));
      expect(result.even).toEqual([2, 4]);
      expect(result.odd).toEqual([1, 3]);
    });
  });

  describe("uniqueBy", () => {
    it("deduplicates by key", () => {
      const items = [{ id: 1, name: "a" }, { id: 2, name: "b" }, { id: 1, name: "c" }];
      const result = arr.uniqueBy(items, "id");
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("a"); // keeps first
    });
  });
});

// ─── Objects ────────────────────────────────────────────────────

describe("objects.js", () => {
  let obj;
  beforeAll(async () => {
    obj = await import("../src/objects.js");
  });

  describe("deepMerge", () => {
    it("merges nested objects", () => {
      const result = obj.deepMerge({ a: { x: 1, y: 2 } }, { a: { y: 3, z: 4 } });
      expect(result).toEqual({ a: { x: 1, y: 3, z: 4 } });
    });
    it("replaces arrays outright", () => {
      const result = obj.deepMerge({ a: [1, 2] }, { a: [3] });
      expect(result.a).toEqual([3]);
    });
    it("does not mutate inputs", () => {
      const target = { a: { x: 1 } };
      const source = { a: { y: 2 } };
      obj.deepMerge(target, source);
      expect(target).toEqual({ a: { x: 1 } });
    });
  });

  describe("pick", () => {
    it("picks specified keys", () => {
      expect(obj.pick({ a: 1, b: 2, c: 3 }, ["a", "c"])).toEqual({ a: 1, c: 3 });
    });
    it("ignores missing keys", () => {
      expect(obj.pick({ a: 1 }, ["a", "z"])).toEqual({ a: 1 });
    });
  });

  describe("omit", () => {
    it("omits specified keys", () => {
      expect(obj.omit({ a: 1, b: 2, c: 3 }, ["b"])).toEqual({ a: 1, c: 3 });
    });
  });
});

// ─── Math ───────────────────────────────────────────────────────

describe("math.js", () => {
  let math;
  beforeAll(async () => {
    math = await import("../src/math.js");
  });

  describe("clamp", () => {
    it("clamps below min", () => {
      expect(math.clamp(-5, 0, 10)).toBe(0);
    });
    it("clamps above max", () => {
      expect(math.clamp(15, 0, 10)).toBe(10);
    });
    it("passes through in range", () => {
      expect(math.clamp(5, 0, 10)).toBe(5);
    });
  });

  describe("roundCents", () => {
    it("rounds to 2 decimal places", () => {
      expect(math.roundCents(1.005)).toBe(1.01);
      expect(math.roundCents(1.004)).toBe(1.0);
      expect(math.roundCents(99.999)).toBe(100);
    });
  });

  describe("randomInt", () => {
    it("returns value within bounds", () => {
      for (let i = 0; i < 100; i++) {
        const val = math.randomInt(5, 10);
        expect(val).toBeGreaterThanOrEqual(5);
        expect(val).toBeLessThanOrEqual(10);
        expect(Number.isInteger(val)).toBe(true);
      }
    });
  });

  describe("cosineSimilarity", () => {
    it("returns 1 for identical vectors", () => {
      expect(math.cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1);
    });
    it("returns 0 for orthogonal vectors", () => {
      expect(math.cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
    });
    it("returns -1 for opposite vectors", () => {
      expect(math.cosineSimilarity([1, 0], [-1, 0])).toBeCloseTo(-1);
    });
    it("returns 0 for invalid input", () => {
      expect(math.cosineSimilarity(null, [1])).toBe(0);
      expect(math.cosineSimilarity([1], [1, 2])).toBe(0);
    });
  });
});

// ─── Validation ─────────────────────────────────────────────────

describe("validation.js", () => {
  let val;
  beforeAll(async () => {
    val = await import("../src/validation.js");
  });

  describe("parseIntParam", () => {
    it("uses default for null", () => {
      expect(val.parseIntParam(undefined, 10)).toBe(10);
    });
    it("parses valid string", () => {
      expect(val.parseIntParam("25", 10)).toBe(25);
    });
    it("clamps to max", () => {
      expect(val.parseIntParam("100", 10, 50)).toBe(50);
    });
    it("uses default for NaN", () => {
      expect(val.parseIntParam("abc", 10)).toBe(10);
    });
  });

  describe("parsePrice", () => {
    it("parses dollar string", () => {
      expect(val.parsePrice("$29.99")).toBe(29.99);
    });
    it("returns null for empty", () => {
      expect(val.parsePrice("")).toBeNull();
    });
  });

  describe("parseJsonSafe", () => {
    it("parses valid JSON", () => {
      expect(val.parseJsonSafe('{"a":1}')).toEqual({ a: 1 });
    });
    it("returns fallback for invalid JSON", () => {
      expect(val.parseJsonSafe("not json", "default")).toBe("default");
    });
    it("returns fallback for null", () => {
      expect(val.parseJsonSafe(null)).toBeNull();
    });
  });

  describe("parseJsonFromLlmResponse", () => {
    it("extracts from markdown fence", () => {
      const result = val.parseJsonFromLlmResponse('```json\n{"a":1}\n```');
      expect(result).toEqual({ a: 1 });
    });
    it("handles bare JSON", () => {
      expect(val.parseJsonFromLlmResponse('{"a":1}')).toEqual({ a: 1 });
    });
    it("extracts from surrounding text", () => {
      const result = val.parseJsonFromLlmResponse('Here is the result: {"a":1} done');
      expect(result).toEqual({ a: 1 });
    });
    it("handles arrays", () => {
      expect(val.parseJsonFromLlmResponse("[1,2,3]")).toEqual([1, 2, 3]);
    });
    it("returns null for unparseable", () => {
      expect(val.parseJsonFromLlmResponse("just text")).toBeNull();
    });
    it("returns null for null/empty", () => {
      expect(val.parseJsonFromLlmResponse(null)).toBeNull();
      expect(val.parseJsonFromLlmResponse("")).toBeNull();
    });
  });
});

// ─── Crypto ─────────────────────────────────────────────────────

describe("crypto.js", () => {
  let crypto;
  beforeAll(async () => {
    crypto = await import("../src/crypto.js");
  });

  describe("generateUUID", () => {
    it("returns a valid UUID format", () => {
      const uuid = crypto.generateUUID();
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });
    it("generates unique values", () => {
      const a = crypto.generateUUID();
      const b = crypto.generateUUID();
      expect(a).not.toBe(b);
    });
  });
});

// ─── Phone ──────────────────────────────────────────────────────

describe("phone.js", () => {
  let phone;
  beforeAll(async () => {
    phone = await import("../src/phone.js");
  });

  describe("formatPhone", () => {
    it("formats 11-digit NANP", () => {
      expect(phone.formatPhone("16045551234")).toBe("+1 (604) 555-1234");
    });
    it("formats 10-digit", () => {
      expect(phone.formatPhone("6045551234")).toBe("(604) 555-1234");
    });
    it("returns Unknown for null", () => {
      expect(phone.formatPhone(null)).toBe("Unknown");
    });
    it("passes through other formats", () => {
      expect(phone.formatPhone("+44 20 7946 0958")).toBe("+44 20 7946 0958");
    });
  });
});

// ─── New Text Utilities ─────────────────────────────────────────

describe("text.js — new utilities", () => {
  let txt;
  beforeAll(async () => {
    txt = await import("../src/text.js");
  });

  describe("slugify", () => {
    it("converts to URL-safe slug", () => {
      expect(txt.slugify("Hello World! Foo")).toBe("hello-world-foo");
    });
    it("strips diacritics", () => {
      expect(txt.slugify("Café Résumé")).toBe("cafe-resume");
    });
    it("collapses multiple separators", () => {
      expect(txt.slugify("hello   ---   world")).toBe("hello-world");
    });
    it("handles null/empty", () => {
      expect(txt.slugify(null)).toBe("");
      expect(txt.slugify("")).toBe("");
    });
  });

  describe("toKebabCase", () => {
    it("converts camelCase", () => {
      expect(txt.toKebabCase("helloWorld")).toBe("hello-world");
    });
    it("converts spaces and underscores", () => {
      expect(txt.toKebabCase("Hello World_Test")).toBe("hello-world-test");
    });
  });

  describe("toCamelCase", () => {
    it("converts kebab-case", () => {
      expect(txt.toCamelCase("hello-world")).toBe("helloWorld");
    });
    it("converts snake_case", () => {
      expect(txt.toCamelCase("hello_world")).toBe("helloWorld");
    });
    it("converts from PascalCase", () => {
      expect(txt.toCamelCase("HelloWorld")).toBe("helloWorld");
    });
  });

  describe("toPascalCase", () => {
    it("converts from kebab-case", () => {
      expect(txt.toPascalCase("hello-world")).toBe("HelloWorld");
    });
  });

  describe("toSnakeCase", () => {
    it("converts camelCase", () => {
      expect(txt.toSnakeCase("helloWorld")).toBe("hello_world");
    });
    it("converts spaces", () => {
      expect(txt.toSnakeCase("Hello World")).toBe("hello_world");
    });
  });

  describe("pluralize", () => {
    it("returns singular for count 1", () => {
      expect(txt.pluralize("item", 1)).toBe("item");
    });
    it("appends s for other counts", () => {
      expect(txt.pluralize("item", 0)).toBe("items");
      expect(txt.pluralize("item", 5)).toBe("items");
    });
    it("uses custom plural form", () => {
      expect(txt.pluralize("child", 3, "children")).toBe("children");
    });
  });

  describe("wordCount", () => {
    it("counts words", () => {
      expect(txt.wordCount("hello world foo")).toBe(3);
    });
    it("handles extra whitespace", () => {
      expect(txt.wordCount("  hello   world  ")).toBe(2);
    });
    it("returns 0 for null/empty", () => {
      expect(txt.wordCount(null)).toBe(0);
      expect(txt.wordCount("")).toBe(0);
    });
  });
});

// ─── New Math Utilities ─────────────────────────────────────────

describe("math.js — new utilities", () => {
  let math;
  beforeAll(async () => {
    math = await import("../src/math.js");
  });

  describe("lerp", () => {
    it("returns a when t=0", () => {
      expect(math.lerp(0, 100, 0)).toBe(0);
    });
    it("returns b when t=1", () => {
      expect(math.lerp(0, 100, 1)).toBe(100);
    });
    it("interpolates at midpoint", () => {
      expect(math.lerp(0, 100, 0.5)).toBe(50);
    });
  });

  describe("remap", () => {
    it("remaps value between ranges", () => {
      expect(math.remap(50, 0, 100, 0, 1)).toBe(0.5);
    });
    it("handles negative output ranges", () => {
      expect(math.remap(75, 0, 100, -10, 10)).toBe(5);
    });
  });

  describe("sum", () => {
    it("sums numbers", () => {
      expect(math.sum([1, 2, 3, 4])).toBe(10);
    });
    it("returns 0 for empty/null", () => {
      expect(math.sum([])).toBe(0);
      expect(math.sum(null)).toBe(0);
    });
  });

  describe("average", () => {
    it("computes arithmetic mean", () => {
      expect(math.average([10, 20, 30])).toBe(20);
    });
    it("returns 0 for empty", () => {
      expect(math.average([])).toBe(0);
    });
  });

  describe("median", () => {
    it("returns middle for odd-length", () => {
      expect(math.median([3, 1, 2])).toBe(2);
    });
    it("returns average of middle two for even-length", () => {
      expect(math.median([1, 2, 3, 4])).toBe(2.5);
    });
    it("returns 0 for empty", () => {
      expect(math.median([])).toBe(0);
    });
    it("does not mutate input", () => {
      const input = [3, 1, 2];
      math.median(input);
      expect(input).toEqual([3, 1, 2]);
    });
  });

  describe("roundTo", () => {
    it("rounds to specified decimals", () => {
      expect(math.roundTo(1.23456, 3)).toBe(1.235);
    });
    it("defaults to 2 decimals", () => {
      expect(math.roundTo(1.005)).toBe(1.01);
    });
  });
});

// ─── New Object Utilities ───────────────────────────────────────

describe("objects.js — new utilities", () => {
  let obj;
  beforeAll(async () => {
    obj = await import("../src/objects.js");
  });

  describe("mapValues", () => {
    it("transforms values", () => {
      expect(obj.mapValues({ a: 1, b: 2 }, (v) => v * 2)).toEqual({ a: 2, b: 4 });
    });
    it("passes key as second arg", () => {
      const result = obj.mapValues({ x: 1 }, (v, k) => `${k}=${v}`);
      expect(result.x).toBe("x=1");
    });
  });

  describe("mapKeys", () => {
    it("transforms keys", () => {
      expect(obj.mapKeys({ a: 1, b: 2 }, (k) => k.toUpperCase())).toEqual({ A: 1, B: 2 });
    });
  });

  describe("invert", () => {
    it("swaps keys and values", () => {
      expect(obj.invert({ a: "1", b: "2" })).toEqual({ "1": "a", "2": "b" });
    });
  });

  describe("isEmpty", () => {
    it("returns true for null/undefined", () => {
      expect(obj.isEmpty(null)).toBe(true);
      expect(obj.isEmpty(undefined)).toBe(true);
    });
    it("returns true for empty string", () => {
      expect(obj.isEmpty("")).toBe(true);
    });
    it("returns true for empty array", () => {
      expect(obj.isEmpty([])).toBe(true);
    });
    it("returns true for empty object", () => {
      expect(obj.isEmpty({})).toBe(true);
    });
    it("returns true for empty Map/Set", () => {
      expect(obj.isEmpty(new Map())).toBe(true);
      expect(obj.isEmpty(new Set())).toBe(true);
    });
    it("returns false for non-empty values", () => {
      expect(obj.isEmpty("hi")).toBe(false);
      expect(obj.isEmpty([1])).toBe(false);
      expect(obj.isEmpty({ a: 1 })).toBe(false);
      expect(obj.isEmpty(0)).toBe(false);
      expect(obj.isEmpty(false)).toBe(false);
    });
  });

  describe("deepEqual", () => {
    it("returns true for identical primitives", () => {
      expect(obj.deepEqual(1, 1)).toBe(true);
      expect(obj.deepEqual("a", "a")).toBe(true);
    });
    it("returns false for different primitives", () => {
      expect(obj.deepEqual(1, 2)).toBe(false);
    });
    it("deeply compares objects", () => {
      expect(obj.deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
      expect(obj.deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
    });
    it("deeply compares arrays", () => {
      expect(obj.deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
      expect(obj.deepEqual([1, 2], [1, 3])).toBe(false);
    });
    it("handles null comparison", () => {
      expect(obj.deepEqual(null, null)).toBe(true);
      expect(obj.deepEqual(null, {})).toBe(false);
    });
  });
});

// ─── New Array Utilities ────────────────────────────────────────

describe("arrays.js — new utilities", () => {
  let arr;
  beforeAll(async () => {
    arr = await import("../src/arrays.js");
  });

  describe("partition", () => {
    it("splits by predicate", () => {
      const [evens, odds] = arr.partition([1, 2, 3, 4, 5], (n) => n % 2 === 0);
      expect(evens).toEqual([2, 4]);
      expect(odds).toEqual([1, 3, 5]);
    });
  });

  describe("intersection", () => {
    it("returns shared elements", () => {
      expect(arr.intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    });
    it("preserves order from first array", () => {
      expect(arr.intersection([3, 1, 2], [2, 3])).toEqual([3, 2]);
    });
  });

  describe("difference", () => {
    it("returns elements only in first array", () => {
      expect(arr.difference([1, 2, 3], [2, 4])).toEqual([1, 3]);
    });
  });

  describe("sortBy", () => {
    it("sorts by string key", () => {
      const items = [{ name: "c" }, { name: "a" }, { name: "b" }];
      expect(arr.sortBy(items, "name").map((i) => i.name)).toEqual(["a", "b", "c"]);
    });
    it("sorts descending", () => {
      const items = [{ v: 1 }, { v: 3 }, { v: 2 }];
      expect(arr.sortBy(items, "v", { descending: true }).map((i) => i.v)).toEqual([3, 2, 1]);
    });
    it("does not mutate original", () => {
      const items = [{ v: 3 }, { v: 1 }];
      arr.sortBy(items, "v");
      expect(items[0].v).toBe(3);
    });
    it("accepts comparator function", () => {
      const result = arr.sortBy([3, 1, 2], (a, b) => a - b);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe("flatten", () => {
    it("flattens one level by default", () => {
      expect(arr.flatten([[1, 2], [3, [4]]])).toEqual([1, 2, 3, [4]]);
    });
    it("fully flattens with Infinity", () => {
      expect(arr.flatten([[1, [2, [3, [4]]]]], Infinity)).toEqual([1, 2, 3, 4]);
    });
  });
});

// ─── New Async Utilities ────────────────────────────────────────

describe("async.js — new utilities", () => {
  let asyncMod;
  beforeAll(async () => {
    asyncMod = await import("../src/async.js");
  });

  describe("pMap", () => {
    it("maps concurrently", async () => {
      const results = await asyncMod.pMap([1, 2, 3], async (n) => n * 2);
      expect(results).toEqual([2, 4, 6]);
    });
    it("respects concurrency limit", async () => {
      let active = 0;
      let maxActive = 0;
      const results = await asyncMod.pMap(
        [1, 2, 3, 4, 5],
        async (n) => {
          active++;
          maxActive = Math.max(maxActive, active);
          await asyncMod.sleep(10);
          active--;
          return n;
        },
        { concurrency: 2 },
      );
      expect(results).toEqual([1, 2, 3, 4, 5]);
      expect(maxActive).toBeLessThanOrEqual(2);
    });
    it("preserves order", async () => {
      const results = await asyncMod.pMap(
        [30, 10, 20],
        async (ms) => {
          await asyncMod.sleep(ms);
          return ms;
        },
        { concurrency: 3 },
      );
      expect(results).toEqual([30, 10, 20]);
    });
  });

  describe("defer", () => {
    it("resolves externally", async () => {
      const { promise, resolve } = asyncMod.defer();
      setTimeout(() => resolve("done"), 10);
      const result = await promise;
      expect(result).toBe("done");
    });
    it("rejects externally", async () => {
      const { promise, reject } = asyncMod.defer();
      setTimeout(() => reject(new Error("fail")), 10);
      await expect(promise).rejects.toThrow("fail");
    });
  });
});

// ─── New Validation Utilities ───────────────────────────────────

describe("validation.js — new utilities", () => {
  let val;
  beforeAll(async () => {
    val = await import("../src/validation.js");
  });

  describe("isEmail", () => {
    it("validates correct emails", () => {
      expect(val.isEmail("user@example.com")).toBe(true);
      expect(val.isEmail("hello@rod.dev")).toBe(true);
    });
    it("rejects invalid emails", () => {
      expect(val.isEmail("not-an-email")).toBe(false);
      expect(val.isEmail("@nope.com")).toBe(false);
      expect(val.isEmail("user@x.y")).toBe(false); // 1-char TLD rejected
      expect(val.isEmail(null)).toBe(false);
      expect(val.isEmail("")).toBe(false);
    });
  });

  describe("isUrl", () => {
    it("validates HTTP URLs", () => {
      expect(val.isUrl("http://example.com")).toBe(true);
      expect(val.isUrl("https://rod.dev/page")).toBe(true);
    });
    it("rejects non-HTTP protocols", () => {
      expect(val.isUrl("ftp://files.com")).toBe(false);
    });
    it("enforces HTTPS when required", () => {
      expect(val.isUrl("http://example.com", { requireHttps: true })).toBe(false);
      expect(val.isUrl("https://example.com", { requireHttps: true })).toBe(true);
    });
    it("rejects invalid URLs", () => {
      expect(val.isUrl("not a url")).toBe(false);
      expect(val.isUrl(null)).toBe(false);
    });
  });

  describe("isNumeric", () => {
    it("validates numbers", () => {
      expect(val.isNumeric(42)).toBe(true);
      expect(val.isNumeric(3.14)).toBe(true);
      expect(val.isNumeric("100")).toBe(true);
      expect(val.isNumeric("-5.5")).toBe(true);
    });
    it("rejects non-numeric", () => {
      expect(val.isNumeric("abc")).toBe(false);
      expect(val.isNumeric(NaN)).toBe(false);
      expect(val.isNumeric(Infinity)).toBe(false);
      expect(val.isNumeric("")).toBe(false);
      expect(val.isNumeric("  ")).toBe(false);
    });
  });
});

// ─── Rate Utilities ─────────────────────────────────────────────

describe("rate.js", () => {
  let rate, sleep;
  beforeAll(async () => {
    rate = await import("../src/rate.js");
    sleep = (await import("../src/async.js")).sleep;
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
    color = await import("../src/color.js");
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
});
