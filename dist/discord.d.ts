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
export declare function discordAvatarUrl(userId: string | null | undefined, avatarHash: string | null | undefined, { size, guildId, guildAvatarHash, fallbackUrl }?: DiscordAvatarOptions): string | null;
/** Build a guild icon URL, or null when the guild has no icon. */
export declare function discordGuildIconUrl(guildId: string | null | undefined, iconHash: string | null | undefined, size?: number): string | null;
/** Build a profile/guild banner URL (`id` is a user or guild id). */
export declare function discordBannerUrl(id: string | null | undefined, bannerHash: string | null | undefined, size?: number): string | null;
/** Build a guild invite splash URL. */
export declare function discordSplashUrl(guildId: string | null | undefined, splashHash: string | null | undefined, size?: number): string | null;
/** Build a custom emoji URL (webp for static, gif for animated). */
export declare function discordEmojiUrl(emojiId: string, animated?: boolean, size?: number): string;
/** Discord sticker format codes (https://discord.com/developers/docs/resources/sticker). */
export declare const DISCORD_STICKER_FORMAT: {
    readonly png: 1;
    readonly apng: 2;
    readonly lottie: 3;
    readonly gif: 4;
};
/**
 * Build a sticker URL. Uses the media proxy host; APNG stickers get
 * `passthrough=true` so animation frames survive the proxy.
 */
export declare function discordStickerUrl(stickerId: string, format: number, size?: number): string;
/** Build a deep link to a message in the Discord client. */
export declare function discordMessageUrl(guildId: string, channelId: string, messageId: string): string;
//# sourceMappingURL=discord.d.ts.map