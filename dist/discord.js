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
function extensionForHash(hash) {
    return hash.startsWith("a_") ? "gif" : "png";
}
/**
 * Build a user avatar URL. A guild member avatar (when both `guildId` and
 * `guildAvatarHash` are given) wins over the global avatar. Returns
 * `fallbackUrl` (default null) when no avatar hash is available.
 */
export function discordAvatarUrl(userId, avatarHash, { size = 512, guildId, guildAvatarHash, fallbackUrl = null } = {}) {
    if (!userId)
        return fallbackUrl;
    if (guildId && guildAvatarHash) {
        return `${CDN_BASE}/guilds/${guildId}/users/${userId}/avatars/${guildAvatarHash}.${extensionForHash(guildAvatarHash)}?size=${size}`;
    }
    if (!avatarHash)
        return fallbackUrl;
    return `${CDN_BASE}/avatars/${userId}/${avatarHash}.${extensionForHash(avatarHash)}?size=${size}`;
}
/** Build a guild icon URL, or null when the guild has no icon. */
export function discordGuildIconUrl(guildId, iconHash, size = 128) {
    if (!guildId || !iconHash)
        return null;
    return `${CDN_BASE}/icons/${guildId}/${iconHash}.${extensionForHash(iconHash)}?size=${size}`;
}
/** Build a profile/guild banner URL (`id` is a user or guild id). */
export function discordBannerUrl(id, bannerHash, size = 480) {
    if (!id || !bannerHash)
        return null;
    return `${CDN_BASE}/banners/${id}/${bannerHash}.${extensionForHash(bannerHash)}?size=${size}`;
}
/** Build a guild invite splash URL. */
export function discordSplashUrl(guildId, splashHash, size = 480) {
    if (!guildId || !splashHash)
        return null;
    return `${CDN_BASE}/splashes/${guildId}/${splashHash}.png?size=${size}`;
}
/** Build a custom emoji URL (webp for static, gif for animated). */
export function discordEmojiUrl(emojiId, animated = false, size = 48) {
    return `${CDN_BASE}/emojis/${emojiId}.${animated ? "gif" : "webp"}?size=${size}&quality=lossless`;
}
/** Discord sticker format codes (https://discord.com/developers/docs/resources/sticker). */
export const DISCORD_STICKER_FORMAT = { png: 1, apng: 2, lottie: 3, gif: 4 };
/**
 * Build a sticker URL. Uses the media proxy host; APNG stickers get
 * `passthrough=true` so animation frames survive the proxy.
 */
export function discordStickerUrl(stickerId, format, size = 160) {
    const extension = format === DISCORD_STICKER_FORMAT.gif ? "gif" : "png";
    const passthrough = format === DISCORD_STICKER_FORMAT.apng ? "&passthrough=true" : "";
    return `${MEDIA_BASE}/stickers/${stickerId}.${extension}?size=${size}${passthrough}`;
}
/** Build a deep link to a message in the Discord client. */
export function discordMessageUrl(guildId, channelId, messageId) {
    return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
}
//# sourceMappingURL=discord.js.map