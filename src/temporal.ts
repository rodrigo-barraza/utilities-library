// ─────────────────────────────────────────────────────────────
// Temporal — Native Temporal API Utilities
// ─────────────────────────────────────────────────────────────
// Bridge utilities that provide convenience methods using the 
// native TC39 Temporal API.
// ─────────────────────────────────────────────────────────────

const TIMEZONE = "America/Los_Angeles";

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const RELATIVE_UNITS: Array<{ unit: Intl.RelativeTimeFormatUnit; divisor: number }> = [
  { unit: "year", divisor: 365.25 * 24 * 60 * 60 },
  { unit: "month", divisor: 30.44 * 24 * 60 * 60 },
  { unit: "week", divisor: 7 * 24 * 60 * 60 },
  { unit: "day", divisor: 24 * 60 * 60 },
  { unit: "hour", divisor: 60 * 60 },
  { unit: "minute", divisor: 60 },
  { unit: "second", divisor: 1 },
];

export const TemporalHelpers = {
  now(): Temporal.ZonedDateTime {
    return Temporal.Now.zonedDateTimeISO(TIMEZONE);
  },

  nowISO(): string {
    return Temporal.Now.instant().toString();
  },

  fromMillis(milliseconds: number): Temporal.ZonedDateTime {
    return Temporal.Instant.fromEpochMilliseconds(milliseconds).toZonedDateTimeISO(TIMEZONE);
  },

  fromJSDate(date: Date): Temporal.ZonedDateTime {
    return Temporal.Instant.fromEpochMilliseconds(date.getTime()).toZonedDateTimeISO(TIMEZONE);
  },

  fromISO(isoString: string): Temporal.ZonedDateTime {
    return Temporal.Instant.from(isoString).toZonedDateTimeISO(TIMEZONE);
  },

  format(zonedDateTime: Temporal.ZonedDateTime, pattern: string): string {
    switch (pattern) {
      case "yyyy-MM-dd HH:mm:ss a":
        return zonedDateTime
          .toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
          .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$1-$2");

      case "LLLL dd, yyyy 'at' hh:mm:ss a":
        return zonedDateTime
          .toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
          .replace(",", " at")
          .replace(/,/, "");

      case "h:mm:ss a":
        return zonedDateTime.toLocaleString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });

      case "hh:mm:ss a":
        return zonedDateTime.toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });

      case "LLLL dd, yyyy":
        return zonedDateTime.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        });

      case "cccc, LLLL dd, yyyy 'at' h:mm a":
        return zonedDateTime
          .toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
          .replace(/,\s*(\d)/, " at $1");

      case "yyyy-MM-dd HH:mm:ss": {
        const plainDateTime = zonedDateTime.toPlainDateTime();
        const hours = String(plainDateTime.hour).padStart(2, "0");
        const minutes = String(plainDateTime.minute).padStart(2, "0");
        const seconds = String(plainDateTime.second).padStart(2, "0");
        return `${plainDateTime.toPlainDate().toString()} ${hours}:${minutes}:${seconds}`;
      }

      case "yyyy-MM-dd HH:mm": {
        const plainDateTime = zonedDateTime.toPlainDateTime();
        const formattedHours = String(plainDateTime.hour).padStart(2, "0");
        const formattedMinutes = String(plainDateTime.minute).padStart(2, "0");
        return `${plainDateTime.toPlainDate().toString()} ${formattedHours}:${formattedMinutes}`;
      }

      case "yyyy-MM-dd":
        return zonedDateTime.toPlainDate().toString();

      default:
        return zonedDateTime.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
    }
  },

  formatLocale(zonedDateTime: Temporal.ZonedDateTime, options: Intl.DateTimeFormatOptions = {}): string {
    const epochMilliseconds = zonedDateTime.toInstant().epochMilliseconds;
    return new Intl.DateTimeFormat("en-US", {
      timeZone: TIMEZONE,
      ...options,
    }).format(epochMilliseconds);
  },

  toRelative(zonedDateTime: Temporal.ZonedDateTime): string {
    const nowInstant = Temporal.Now.instant();
    const targetInstant = zonedDateTime.toInstant();
    const differenceSeconds = Number(nowInstant.epochMilliseconds - targetInstant.epochMilliseconds) / 1000;

    for (const { unit, divisor } of RELATIVE_UNITS) {
      const value = differenceSeconds / divisor;
      if (Math.abs(value) >= 1 || unit === "second") {
        return relativeTimeFormatter.format(-Math.round(value), unit);
      }
    }
    return relativeTimeFormatter.format(0, "second");
  },

  diffIn(
    a: Temporal.ZonedDateTime,
    b: Temporal.ZonedDateTime,
    unit: "days" | "hours" | "minutes" | "seconds",
  ): number {
    const aMs = a.toInstant().epochMilliseconds;
    const bMs = b.toInstant().epochMilliseconds;
    const differenceMs = aMs - bMs;
    switch (unit) {
      case "days":
        return differenceMs / (24 * 60 * 60 * 1000);
      case "hours":
        return differenceMs / (60 * 60 * 1000);
      case "minutes":
        return differenceMs / (60 * 1000);
      case "seconds":
        return differenceMs / 1000;
    }
  },

  hasSame(
    a: Temporal.ZonedDateTime,
    b: Temporal.ZonedDateTime,
    unit: "year" | "month" | "day" | "hour",
  ): boolean {
    switch (unit) {
      case "year":
        return a.year === b.year;
      case "month":
        return a.year === b.year && a.month === b.month;
      case "day":
        return a.year === b.year && a.month === b.month && a.day === b.day;
      case "hour":
        return a.year === b.year && a.month === b.month && a.day === b.day && a.hour === b.hour;
    }
  },

  minus(zonedDateTime: Temporal.ZonedDateTime, duration: Temporal.DurationLike): Temporal.ZonedDateTime {
    return zonedDateTime.subtract(Temporal.Duration.from(duration));
  },

  toEpochMilliseconds(zonedDateTime: Temporal.ZonedDateTime): number {
    return Number(zonedDateTime.toInstant().epochMilliseconds);
  },

  toDateId(zonedDateTime: Temporal.ZonedDateTime, pattern: string): string {
    const plainDateTime = zonedDateTime.toPlainDateTime();
    const yearShort = String(plainDateTime.year % 100).padStart(2, "0");
    const monthPadded = String(plainDateTime.month).padStart(2, "0");
    const dayPadded = String(plainDateTime.day).padStart(2, "0");
    const hourPadded = String(plainDateTime.hour).padStart(2, "0");
    const minutePadded = String(plainDateTime.minute).padStart(2, "0");
    const millisecondPadded = String(plainDateTime.millisecond).padStart(3, "0");

    switch (pattern) {
      case "yyMMddHHmmSSS":
        return `${yearShort}${monthPadded}${dayPadded}${hourPadded}${minutePadded}${millisecondPadded}`;
      case "mSSS":
        return `${minutePadded}${millisecondPadded}`;
      case "HmmSSS":
        return `${hourPadded}${minutePadded}${millisecondPadded}`;
      case "dHHmmSSS":
        return `${dayPadded}${hourPadded}${minutePadded}${millisecondPadded}`;
      case "MddHHmmSSS":
        return `${monthPadded}${dayPadded}${hourPadded}${minutePadded}${millisecondPadded}`;
      default:
        return `${yearShort}${monthPadded}${dayPadded}${hourPadded}${minutePadded}${millisecondPadded}`;
    }
  },
};
