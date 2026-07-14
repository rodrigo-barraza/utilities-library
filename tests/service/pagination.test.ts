import { describe, it, expect } from "vitest";
import { buildPagination } from "../../src/service/Pagination.js";
import { toObjectId, buildTimeRangeFilter } from "../../src/service/MongoUtilities.js";

describe("buildPagination", () => {
  it("defaults to limit 20, offset 0", () => {
    expect(buildPagination({})).toEqual({ limit: 20, offset: 0, skip: 0 });
  });

  it("parses and clamps limit to 1..100", () => {
    expect(buildPagination({ limit: "50" }).limit).toBe(50);
    expect(buildPagination({ limit: "1000" }).limit).toBe(100);
    expect(buildPagination({ limit: "0" }).limit).toBe(20);
    expect(buildPagination({ limit: "-5" }).limit).toBe(1);
    expect(buildPagination({ limit: "junk" }).limit).toBe(20);
  });

  it("parses offset and mirrors it as skip", () => {
    expect(buildPagination({ offset: "40" })).toEqual({ limit: 20, offset: 40, skip: 40 });
    expect(buildPagination({ offset: "-3" }).offset).toBe(0);
  });

  it("honors custom defaults and caps", () => {
    expect(buildPagination({}, { defaultLimit: 10 }).limit).toBe(10);
    expect(buildPagination({ limit: "500" }, { maxLimit: 250 }).limit).toBe(250);
  });
});

describe("toObjectId", () => {
  it("converts valid 24-hex strings", () => {
    const id = toObjectId("507f1f77bcf86cd799439011");
    expect(id?.toHexString()).toBe("507f1f77bcf86cd799439011");
  });

  it("returns null for invalid input", () => {
    expect(toObjectId("not-an-id")).toBeNull();
    expect(toObjectId("")).toBeNull();
  });
});

describe("buildTimeRangeFilter", () => {
  it("builds $gte/$lte bounds", () => {
    const filter = buildTimeRangeFilter("createdAt", "2026-01-01", "2026-02-01") as {
      createdAt: { $gte: Date; $lte: Date };
    };
    expect(filter.createdAt.$gte).toEqual(new Date("2026-01-01"));
    expect(filter.createdAt.$lte).toEqual(new Date("2026-02-01"));
  });

  it("omits missing bounds and returns {} when empty", () => {
    expect(buildTimeRangeFilter("t", undefined, undefined)).toEqual({});
    const onlyFrom = buildTimeRangeFilter("t", "2026-01-01", undefined) as {
      t: Record<string, Date>;
    };
    expect(Object.keys(onlyFrom.t)).toEqual(["$gte"]);
  });
});
