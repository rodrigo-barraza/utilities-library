// ─────────────────────────────────────────────────────────────
// Discord — Canonical cross-repo snowflake ids
// ─────────────────────────────────────────────────────────────
// Only ids referenced from MORE THAN ONE repo belong here (they
// identify the same physical guild/channels and must stay in
// sync). Repo-private role/emoji/channel tables stay local —
// lupos-bot/src/arrays remains the home for its own maps.
// ─────────────────────────────────────────────────────────────
/** Guilds referenced across lupos-bot, prism-service, and the Discord clients. */
export const DISCORD_GUILDS = {
    whitemane: "249010731910037507",
};
/** Channels referenced across lupos-bot and classic-whitemane-client. */
export const DISCORD_CHANNELS = {
    politics: "762734438375096380",
    sportsmane: "844637988159356968",
};
/** Users referenced across repos (owner/admin checks). */
export const DISCORD_USERS = {
    owner: "166745313258897409",
};
//# sourceMappingURL=discord.js.map