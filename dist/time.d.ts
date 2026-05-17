/** One second in milliseconds. */
export declare const MS_PER_SECOND = 1000;
/** One minute in milliseconds. */
export declare const MS_PER_MINUTE = 60000;
/** One hour in milliseconds. */
export declare const MS_PER_HOUR = 3600000;
/** One day in milliseconds. */
export declare const MS_PER_DAY = 86400000;
/** One day in seconds. */
export declare const SECONDS_PER_DAY = 86400;
/** One week in milliseconds. */
export declare const MS_PER_WEEK = 604800000;
/**
 * Convert seconds to milliseconds.
 */
export declare const seconds: (n: number) => number;
/**
 * Convert minutes to milliseconds.
 */
export declare const minutes: (n: number) => number;
/**
 * Convert hours to milliseconds.
 */
export declare const hours: (n: number) => number;
/**
 * Convert days to milliseconds.
 */
export declare const days: (n: number) => number;
/**
 * Convert weeks to milliseconds.
 */
export declare const weeks: (n: number) => number;
/** 3 s — Live status, benchmarks, worker panels. */
export declare const POLL_FAST = 3000;
/** 5 s — Default table/list polling (containers, conversations). */
export declare const POLL_STANDARD = 5000;
/** 15 s — Model lists, analytics, moderate-frequency data. */
export declare const POLL_MODERATE = 15000;
/** 30 s — Health checks, background probes. */
export declare const POLL_SLOW = 30000;
/** 60 s — Dashboard-level refreshes. */
export declare const POLL_LAZY = 60000;
//# sourceMappingURL=time.d.ts.map