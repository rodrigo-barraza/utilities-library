import { describe, expect, it } from "vitest";
import {
  DISCORD_STICKER_FORMAT,
  discordAvatarUrl,
  discordBannerUrl,
  discordEmojiUrl,
  discordGuildIconUrl,
  discordMessageUrl,
  discordSplashUrl,
  discordStickerUrl,
} from "../discord.ts";

describe("discord CDN builders", () => {
  it("builds static and animated avatar URLs", () => {
    expect(discordAvatarUrl("1", "abc")).toBe(
      "https://cdn.discordapp.com/avatars/1/abc.png?size=512",
    );
    expect(discordAvatarUrl("1", "a_abc", { size: 128 })).toBe(
      "https://cdn.discordapp.com/avatars/1/a_abc.gif?size=128",
    );
  });

  it("prefers the guild member avatar", () => {
    expect(discordAvatarUrl("1", "abc", { guildId: "9", guildAvatarHash: "a_g" })).toBe(
      "https://cdn.discordapp.com/guilds/9/users/1/avatars/a_g.gif?size=512",
    );
  });

  it("falls back when no avatar hash", () => {
    expect(discordAvatarUrl("1", null)).toBeNull();
    expect(discordAvatarUrl("1", null, { fallbackUrl: "d" })).toBe("d");
    expect(discordAvatarUrl(null, "abc")).toBeNull();
  });

  it("builds icon, banner, and splash URLs", () => {
    expect(discordGuildIconUrl("9", "a_i")).toBe(
      "https://cdn.discordapp.com/icons/9/a_i.gif?size=128",
    );
    expect(discordBannerUrl("9", "b", 480)).toBe(
      "https://cdn.discordapp.com/banners/9/b.png?size=480",
    );
    expect(discordSplashUrl("9", "s")).toBe(
      "https://cdn.discordapp.com/splashes/9/s.png?size=480",
    );
    expect(discordGuildIconUrl("9", null)).toBeNull();
  });

  it("builds emoji URLs (webp static, gif animated)", () => {
    expect(discordEmojiUrl("5")).toBe(
      "https://cdn.discordapp.com/emojis/5.webp?size=48&quality=lossless",
    );
    expect(discordEmojiUrl("5", true)).toBe(
      "https://cdn.discordapp.com/emojis/5.gif?size=48&quality=lossless",
    );
  });

  it("builds sticker URLs with APNG passthrough", () => {
    expect(discordStickerUrl("7", DISCORD_STICKER_FORMAT.png)).toBe(
      "https://media.discordapp.net/stickers/7.png?size=160",
    );
    expect(discordStickerUrl("7", DISCORD_STICKER_FORMAT.apng)).toBe(
      "https://media.discordapp.net/stickers/7.png?size=160&passthrough=true",
    );
    expect(discordStickerUrl("7", DISCORD_STICKER_FORMAT.gif)).toBe(
      "https://media.discordapp.net/stickers/7.gif?size=160",
    );
  });

  it("builds message deep links", () => {
    expect(discordMessageUrl("g", "c", "m")).toBe("https://discord.com/channels/g/c/m");
  });
});
