// ─────────────────────────────────────────────────────────────
// Discord — CDN URL builders (pure strings, no discord.js)
// ─────────────────────────────────────────────────────────────
// Consolidates the `hash.startsWith("a_") ? "gif" : "png"` CDN
// builders that were copy-pasted across lupos-bot, tools-service,
// components-library, and the Discord-backed Next.js clients.
// Isomorphic: safe in browser and server code.
// ─────────────────────────────────────────────────────────────

const CDN_BASE = "https://cdn.discordapp.com";
const MEDIA_BASE = "https://media.discordapp.net";

/** Animated Discord asset hashes are prefixed `a_` and serve as gif. */
function extensionForHash(hash: string): "gif" | "png" {
  return hash.startsWith("a_") ? "gif" : "png";
}

export interface DiscordAvatarOptions {
  size?: number;
  /** Guild-specific avatar; takes precedence over the global avatar. */
  guildId?: string | null;
  guildAvatarHash?: string | null;
  /** Fallback when the user has no custom avatar (e.g. `defaultAvatarURL`). */
  fallbackUrl?: string | null;
}

/**
 * Build a user avatar URL. A guild member avatar (when both `guildId` and
 * `guildAvatarHash` are given) wins over the global avatar. Returns
 * `fallbackUrl` (default null) when no avatar hash is available.
 */
export function discordAvatarUrl(
  userId: string | null | undefined,
  avatarHash: string | null | undefined,
  { size = 512, guildId, guildAvatarHash, fallbackUrl = null }: DiscordAvatarOptions = {},
): string | null {
  if (!userId) return fallbackUrl;
  if (guildId && guildAvatarHash) {
    return `${CDN_BASE}/guilds/${guildId}/users/${userId}/avatars/${guildAvatarHash}.${extensionForHash(guildAvatarHash)}?size=${size}`;
  }
  if (!avatarHash) return fallbackUrl;
  return `${CDN_BASE}/avatars/${userId}/${avatarHash}.${extensionForHash(avatarHash)}?size=${size}`;
}

/** Build a guild icon URL, or null when the guild has no icon. */
export function discordGuildIconUrl(
  guildId: string | null | undefined,
  iconHash: string | null | undefined,
  size = 128,
): string | null {
  if (!guildId || !iconHash) return null;
  return `${CDN_BASE}/icons/${guildId}/${iconHash}.${extensionForHash(iconHash)}?size=${size}`;
}

/** Build a profile/guild banner URL (`id` is a user or guild id). */
export function discordBannerUrl(
  id: string | null | undefined,
  bannerHash: string | null | undefined,
  size = 480,
): string | null {
  if (!id || !bannerHash) return null;
  return `${CDN_BASE}/banners/${id}/${bannerHash}.${extensionForHash(bannerHash)}?size=${size}`;
}

/** Build a guild invite splash URL. */
export function discordSplashUrl(
  guildId: string | null | undefined,
  splashHash: string | null | undefined,
  size = 480,
): string | null {
  if (!guildId || !splashHash) return null;
  return `${CDN_BASE}/splashes/${guildId}/${splashHash}.png?size=${size}`;
}

/** Build a custom emoji URL (webp for static, gif for animated). */
export function discordEmojiUrl(emojiId: string, animated = false, size = 48): string {
  return `${CDN_BASE}/emojis/${emojiId}.${animated ? "gif" : "webp"}?size=${size}&quality=lossless`;
}

/** Discord sticker format codes (https://discord.com/developers/docs/resources/sticker). */
export const DISCORD_STICKER_FORMAT = { png: 1, apng: 2, lottie: 3, gif: 4 } as const;

/**
 * Build a sticker URL. Uses the media proxy host; APNG stickers get
 * `passthrough=true` so animation frames survive the proxy.
 */
export function discordStickerUrl(stickerId: string, format: number, size = 160): string {
  const extension = format === DISCORD_STICKER_FORMAT.gif ? "gif" : "png";
  const passthrough = format === DISCORD_STICKER_FORMAT.apng ? "&passthrough=true" : "";
  return `${MEDIA_BASE}/stickers/${stickerId}.${extension}?size=${size}${passthrough}`;
}

/** Build a deep link to a message in the Discord client. */
export function discordMessageUrl(guildId: string, channelId: string, messageId: string): string {
  return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
}
