import type { Temporal as TemporalType } from "@js-temporal/polyfill";

declare global {
  namespace Temporal {
    export type ZonedDateTime = TemporalType.ZonedDateTime;
    export type Instant = TemporalType.Instant;
    export type Duration = TemporalType.Duration;
    export type DurationLike = TemporalType.DurationLike;
    export type PlainDate = TemporalType.PlainDate;
    export type PlainDateTime = TemporalType.PlainDateTime;
  }

  var Temporal: {
    Now: typeof TemporalType.Now;
    Instant: typeof TemporalType.Instant;
    ZonedDateTime: typeof TemporalType.ZonedDateTime;
    Duration: typeof TemporalType.Duration;
    PlainDate: typeof TemporalType.PlainDate;
    PlainDateTime: typeof TemporalType.PlainDateTime;
  };
}
