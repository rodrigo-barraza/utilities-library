export declare const TemporalHelpers: {
    now(): Temporal.ZonedDateTime;
    nowISO(): string;
    fromMillis(milliseconds: number): Temporal.ZonedDateTime;
    fromJSDate(date: Date): Temporal.ZonedDateTime;
    fromISO(isoString: string): Temporal.ZonedDateTime;
    format(zonedDateTime: Temporal.ZonedDateTime, pattern: string): string;
    formatLocale(zonedDateTime: Temporal.ZonedDateTime, options?: Intl.DateTimeFormatOptions): string;
    toRelative(zonedDateTime: Temporal.ZonedDateTime): string;
    diffIn(a: Temporal.ZonedDateTime, b: Temporal.ZonedDateTime, unit: "days" | "hours" | "minutes" | "seconds"): number;
    hasSame(a: Temporal.ZonedDateTime, b: Temporal.ZonedDateTime, unit: "year" | "month" | "day" | "hour"): boolean;
    minus(zonedDateTime: Temporal.ZonedDateTime, duration: Temporal.DurationLike): Temporal.ZonedDateTime;
    toEpochMilliseconds(zonedDateTime: Temporal.ZonedDateTime): number;
    toDateId(zonedDateTime: Temporal.ZonedDateTime, pattern: string): string;
};
//# sourceMappingURL=temporal.d.ts.map