// ─────────────────────────────────────────────────────────────
// Time — Duration constants and converters (milliseconds)
// ─────────────────────────────────────────────────────────────

export const MILLISECONDS_PER_SECOND = 1_000;
export const MILLISECONDS_PER_MINUTE = 60_000;
export const MILLISECONDS_PER_HOUR = 3_600_000;
export const MILLISECONDS_PER_DAY = 86_400_000;
export const SECONDS_PER_DAY = 86_400;
export const MILLISECONDS_PER_WEEK = 604_800_000;

export const seconds = (secondsCount: number): number => secondsCount * MILLISECONDS_PER_SECOND;
export const minutes = (minutesCount: number): number => minutesCount * MILLISECONDS_PER_MINUTE;
export const hours = (hoursCount: number): number => hoursCount * MILLISECONDS_PER_HOUR;
export const days = (daysCount: number): number => daysCount * MILLISECONDS_PER_DAY;
export const weeks = (weeksCount: number): number => weeksCount * MILLISECONDS_PER_WEEK;

// ── Polling Interval Tiers ──────────────────────────────────

export const POLL_FAST = 3_000;
export const POLL_STANDARD = 5_000;
export const POLL_MODERATE = 15_000;
export const POLL_SLOW = 30_000;
export const POLL_LAZY = 60_000;

// ── UI Feedback Timing ──────────────────────────────────────

export const FEEDBACK_BRIEF_MILLISECONDS = 1_500;
export const FEEDBACK_STANDARD_MILLISECONDS = 2_000;
export const TOAST_DURATION_MILLISECONDS = 5_000;
export const ACTION_COOLDOWN_MILLISECONDS = 5_000;
export const ACTION_COOLDOWN_LONG_MILLISECONDS = 8_000;
export const HIGHLIGHT_DURATION_MILLISECONDS = 6_000;
