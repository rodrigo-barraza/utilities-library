import { beforeEach, describe, expect, it, vi } from "vitest";

const TOKEN = "vault-token-that-must-never-leak";

const execFileSync = vi.fn();
vi.mock("child_process", () => ({ execFileSync }));

const { createVaultClient } = await import("../src/vault.ts");

describe("createVaultClient().fetchSync", () => {
  beforeEach(() => {
    execFileSync.mockReset();
  });

  it("hands curl the token on stdin, never in argv", () => {
    execFileSync.mockReturnValue('{"A":"1"}');
    const secrets = createVaultClient({ vaultUrl: "http://vault.test", vaultToken: TOKEN }).fetchSync();
    expect(secrets).toEqual({ A: "1" });
    const [command, args, options] = execFileSync.mock.calls[0];
    expect(command).toBe("curl");
    expect(args.join(" ")).not.toContain(TOKEN);
    expect(args).toContain("--config");
    expect(options.input).toContain(`Authorization: Bearer ${TOKEN}`);
  });

  it("keeps the token out of the warning when Vault is unreachable", () => {
    // What execFileSync throws: the command line, quoted — which used to hold the token.
    execFileSync.mockImplementation(() => {
      throw new Error(`Command failed: curl -sf -H Authorization: Bearer ${TOKEN} http://vault.test/secrets`);
    });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(createVaultClient({ vaultUrl: "http://vault.test", vaultToken: TOKEN }).fetchSync()).toEqual({});
    const logged = warn.mock.calls.flat().join(" ");
    expect(logged).toContain("Vault unreachable");
    expect(logged).not.toContain(TOKEN);
    expect(logged).toContain("[redacted]");
    warn.mockRestore();
  });
});

describe("createVaultClient().fetch", () => {
  it("keeps the token out of the warning when the request fails", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error(`proxy said: Bearer ${TOKEN}`));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await createVaultClient({ vaultUrl: "http://vault.test", vaultToken: TOKEN }).fetch()).toEqual({});
    expect(warn.mock.calls.flat().join(" ")).not.toContain(TOKEN);
    warn.mockRestore();
    fetchSpy.mockRestore();
  });
});
