// ─────────────────────────────────────────────────────────────
// Phone — Phone number formatting utilities
// ─────────────────────────────────────────────────────────────

/**
 * Format a phone number string for display.
 * Handles North American (NANP) numbers with +1 prefix.
 * Other formats are returned as-is.
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "Unknown";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}
