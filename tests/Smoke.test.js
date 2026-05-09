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
