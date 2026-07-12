import { describe, it, expect } from "vitest";
import { resolveToolDisplaySummary } from "../text.ts";

describe("resolveToolDisplaySummary", () => {
  // ── Unknown / missing args ────────────────────────────────────

  it("returns null for unknown tool names", () => {
    expect(resolveToolDisplaySummary("unknown_tool", { path: "/test" })).toBeNull();
  });

  it("returns null when required args are missing", () => {
    expect(resolveToolDisplaySummary("list_directory", {})).toBeNull();
    expect(resolveToolDisplaySummary("read_file", {})).toBeNull();
    expect(resolveToolDisplaySummary("execute_command", {})).toBeNull();
    expect(resolveToolDisplaySummary("search_web", {})).toBeNull();
  });

  it("returns null when args are wrong type", () => {
    expect(resolveToolDisplaySummary("list_directory", { path: 42 })).toBeNull();
    expect(resolveToolDisplaySummary("read_file", { absolutePath: true })).toBeNull();
  });

  // ── list_directory ────────────────────────────────────────────

  describe("list_directory", () => {
    it("returns verb, full path, and filePath in completed state", () => {
      const result = resolveToolDisplaySummary("list_directory", {
        path: "/home/rodrigo/development/prism-client",
      });
      expect(result).toEqual({
        verb: "Analyzed",
        subject: "/home/rodrigo/development/prism-client",
        filePath: "/home/rodrigo/development/prism-client",
      });
    });

    it("returns progressive verb when active", () => {
      const result = resolveToolDisplaySummary(
        "list_directory",
        { path: "/home/rodrigo/development" },
        { isActive: true },
      );
      expect(result).toEqual({
        verb: "Analyzing",
        subject: "/home/rodrigo/development",
        filePath: "/home/rodrigo/development",
      });
    });
  });

  // ── read_file ─────────────────────────────────────────────────

  describe("read_file", () => {
    it("resolves from absolutePath with Analyzed verb", () => {
      const result = resolveToolDisplaySummary("read_file", {
        absolutePath: "/workspace/prism-service/src/services/ToolOrchestratorService.ts",
      });
      expect(result).toEqual({
        verb: "Analyzed",
        subject: "ToolOrchestratorService.ts",
        filePath: "/workspace/prism-service/src/services/ToolOrchestratorService.ts",
      });
    });

    it("falls back to path param", () => {
      const result = resolveToolDisplaySummary("read_file", {
        path: "/src/index.ts",
      });
      expect(result).toEqual({
        verb: "Analyzed",
        subject: "index.ts",
        filePath: "/src/index.ts",
      });
    });

    it("prefers absolutePath over path", () => {
      const result = resolveToolDisplaySummary("read_file", {
        absolutePath: "/correct/file.ts",
        path: "/wrong/file.ts",
      });
      expect(result!.filePath).toBe("/correct/file.ts");
    });

    it("returns progressive verb when active", () => {
      const result = resolveToolDisplaySummary(
        "read_file",
        { absolutePath: "/src/index.ts" },
        { isActive: true },
      );
      expect(result).toEqual({
        verb: "Analyzing",
        subject: "index.ts",
        filePath: "/src/index.ts",
      });
    });

    it("handles Windows-style backslash paths", () => {
      const result = resolveToolDisplaySummary("read_file", {
        absolutePath: "C:\\Users\\rodrigo\\file.ts",
      });
      expect(result!.subject).toBe("file.ts");
      expect(result!.filePath).toBe("C:\\Users\\rodrigo\\file.ts");
    });
  });

  // ── read_files ────────────────────────────────────────────────

  describe("read_files", () => {
    it("returns file count without filePath", () => {
      const result = resolveToolDisplaySummary("read_files", {
        paths: ["/a.ts", "/b.ts", "/c.ts"],
      });
      expect(result).toEqual({ verb: "Read", subject: "3 files" });
      expect(result!.filePath).toBeUndefined();
    });

    it("uses singular for one file", () => {
      const result = resolveToolDisplaySummary("read_files", {
        paths: ["/a.ts"],
      });
      expect(result).toEqual({ verb: "Read", subject: "1 file" });
    });

    it("returns null for empty array", () => {
      expect(resolveToolDisplaySummary("read_files", { paths: [] })).toBeNull();
    });

    it("returns null for non-array", () => {
      expect(resolveToolDisplaySummary("read_files", { paths: "string" })).toBeNull();
    });
  });

  // ── write_file ────────────────────────────────────────────────

  describe("write_file", () => {
    it("returns verb, basename, and filePath", () => {
      const result = resolveToolDisplaySummary("write_file", {
        path: "/src/utils/helpers.ts",
      });
      expect(result).toEqual({
        verb: "Wrote",
        subject: "helpers.ts",
        filePath: "/src/utils/helpers.ts",
      });
    });

    it("returns progressive verb when active", () => {
      const result = resolveToolDisplaySummary(
        "write_file",
        { path: "/src/index.ts" },
        { isActive: true },
      );
      expect(result!.verb).toBe("Writing");
      expect(result!.filePath).toBe("/src/index.ts");
    });
  });

  // ── replace_in_file ───────────────────────────────────────────

  describe("replace_in_file", () => {
    it("returns edit verb, basename, and filePath", () => {
      const result = resolveToolDisplaySummary("replace_in_file", {
        path: "/src/config.ts",
      });
      expect(result).toEqual({
        verb: "Edited",
        subject: "config.ts",
        filePath: "/src/config.ts",
      });
    });
  });

  // ── replace_file_block & replace_file_regions ──────────────────

  describe("replace_file_block", () => {
    it("includes filePath", () => {
      const result = resolveToolDisplaySummary("replace_file_block", {
        path: "/src/App.tsx",
      });
      expect(result!.filePath).toBe("/src/App.tsx");
    });
  });

  describe("replace_file_regions", () => {
    it("includes filePath", () => {
      const result = resolveToolDisplaySummary("replace_file_regions", {
        path: "/src/App.tsx",
      });
      expect(result!.filePath).toBe("/src/App.tsx");
    });
  });

  // ── patch_file ────────────────────────────────────────────────

  describe("patch_file", () => {
    it("includes filePath", () => {
      const result = resolveToolDisplaySummary("patch_file", {
        path: "/src/server.ts",
      });
      expect(result!.filePath).toBe("/src/server.ts");
    });
  });

  // ── search_file_contents ──────────────────────────────────────

  describe("search_file_contents", () => {
    it("resolves from pattern + searchPath (no filePath)", () => {
      const result = resolveToolDisplaySummary("search_file_contents", {
        pattern: "ToolCallsBlock",
        searchPath: "/src/components",
      });
      expect(result).toEqual({
        verb: "Searched",
        subject: '"ToolCallsBlock" in /src/components',
      });
      expect(result!.filePath).toBeUndefined();
    });

    it("falls back to query + path params", () => {
      const result = resolveToolDisplaySummary("search_file_contents", {
        query: "renderToolName",
        path: "/src",
      });
      expect(result).toEqual({
        verb: "Searched",
        subject: '"renderToolName" in /src',
      });
    });

    it("returns query without path when searchPath is absent", () => {
      const result = resolveToolDisplaySummary("search_file_contents", {
        pattern: "renderToolName",
      });
      expect(result).toEqual({ verb: "Searched", subject: '"renderToolName"' });
    });

    it("returns null when neither pattern nor query is present", () => {
      expect(
        resolveToolDisplaySummary("search_file_contents", { searchPath: "/src" }),
      ).toBeNull();
    });

    it("truncates very long queries in subject", () => {
      const longQuery = "a".repeat(100);
      const result = resolveToolDisplaySummary("search_file_contents", {
        pattern: longQuery,
      });
      expect(result!.subject.length).toBeLessThan(50);
    });
  });

  // ── find_files ────────────────────────────────────────────────

  describe("find_files", () => {
    it("resolves from pattern + searchPath (no filePath)", () => {
      const result = resolveToolDisplaySummary("find_files", {
        pattern: "*.test.ts",
        searchPath: "/src",
      });
      expect(result).toEqual({ verb: "Found", subject: '"*.test.ts" in /src' });
      expect(result!.filePath).toBeUndefined();
    });

    it("falls back to path param", () => {
      const result = resolveToolDisplaySummary("find_files", {
        pattern: "*.css",
        path: "/styles",
      });
      expect(result).toEqual({ verb: "Found", subject: '"*.css" in /styles' });
    });

    it("returns pattern without path", () => {
      const result = resolveToolDisplaySummary("find_files", {
        pattern: "*.css",
      });
      expect(result).toEqual({ verb: "Found", subject: '"*.css"' });
    });
  });

  // ── execute_command ───────────────────────────────────────────

  describe("execute_command", () => {
    it("returns verb and command (no filePath)", () => {
      const result = resolveToolDisplaySummary("execute_command", {
        command: "git status",
      });
      expect(result).toEqual({ verb: "Ran", subject: "git status" });
      expect(result!.filePath).toBeUndefined();
    });

    it("returns progressive verb when active", () => {
      const result = resolveToolDisplaySummary(
        "execute_command",
        { command: "npm run build" },
        { isActive: true },
      );
      expect(result!.verb).toBe("Running");
    });

    it("truncates very long commands in subject", () => {
      const longCommand = "echo " + "x".repeat(200);
      const result = resolveToolDisplaySummary("execute_command", {
        command: longCommand,
      });
      expect(result!.subject.length).toBeLessThanOrEqual(60);
      expect(result!.subject).toContain("…");
    });
  });

  // ── search_web ────────────────────────────────────────────────

  describe("search_web", () => {
    it("returns verb and quoted query (no filePath)", () => {
      const result = resolveToolDisplaySummary("search_web", {
        query: "TypeScript tool display",
      });
      expect(result).toEqual({ verb: "Searched", subject: '"TypeScript tool display"' });
      expect(result!.filePath).toBeUndefined();
    });
  });

  // ── read_web_page ─────────────────────────────────────────────

  describe("read_web_page", () => {
    it("returns verb and domain (no filePath)", () => {
      const result = resolveToolDisplaySummary("read_web_page", {
        url: "https://developer.mozilla.org/en-US/docs/Web/API",
      });
      expect(result).toEqual({ verb: "Read", subject: "developer.mozilla.org" });
      expect(result!.filePath).toBeUndefined();
    });

    it("handles malformed URLs gracefully", () => {
      const result = resolveToolDisplaySummary("read_web_page", {
        url: "not-a-url",
      });
      expect(result).toEqual({ verb: "Read", subject: "not-a-url" });
    });
  });

  // ── control_browser ───────────────────────────────────────────

  describe("control_browser", () => {
    it("returns Browser: verb and action (no filePath)", () => {
      const result = resolveToolDisplaySummary("control_browser", {
        action: "click",
      });
      expect(result).toEqual({ verb: "Browser:", subject: "click" });
      expect(result!.filePath).toBeUndefined();
    });
  });

  // ── move_file ─────────────────────────────────────────────────

  describe("move_file", () => {
    it("returns verb and source→dest basenames (no filePath)", () => {
      const result = resolveToolDisplaySummary("move_file", {
        source: "/src/old.ts",
        destination: "/src/new.ts",
      });
      expect(result).toEqual({ verb: "Moved", subject: "old.ts → new.ts" });
      expect(result!.filePath).toBeUndefined();
    });

    it("returns null when source is missing", () => {
      expect(
        resolveToolDisplaySummary("move_file", { destination: "/dst/file.ts" }),
      ).toBeNull();
    });

    it("returns null when destination is missing", () => {
      expect(
        resolveToolDisplaySummary("move_file", { source: "/src/file.ts" }),
      ).toBeNull();
    });
  });

  // ── delete_file ───────────────────────────────────────────────

  describe("delete_file", () => {
    it("returns verb, basename, and filePath", () => {
      const result = resolveToolDisplaySummary("delete_file", {
        path: "/src/unused.ts",
      });
      expect(result).toEqual({
        verb: "Deleted",
        subject: "unused.ts",
        filePath: "/src/unused.ts",
      });
    });
  });

  // ── diff_files ────────────────────────────────────────────────

  describe("diff_files", () => {
    it("returns verb and both basenames (no filePath)", () => {
      const result = resolveToolDisplaySummary("diff_files", {
        pathA: "/src/v1.ts",
        pathB: "/src/v2.ts",
      });
      expect(result).toEqual({ verb: "Compared", subject: "v1.ts vs v2.ts" });
      expect(result!.filePath).toBeUndefined();
    });

    it("returns null when pathA is missing", () => {
      expect(
        resolveToolDisplaySummary("diff_files", { pathB: "/b.ts" }),
      ).toBeNull();
    });
  });

  // ── summarize_project ─────────────────────────────────────────

  describe("summarize_project", () => {
    it("returns verb, full path, and filePath", () => {
      const result = resolveToolDisplaySummary("summarize_project", {
        path: "/home/rodrigo/development",
      });
      expect(result).toEqual({
        verb: "Summarized",
        subject: "/home/rodrigo/development",
        filePath: "/home/rodrigo/development",
      });
    });
  });

  // ── run_git ───────────────────────────────────────────────────

  describe("run_git", () => {
    it("resolves from action (no filePath)", () => {
      const result = resolveToolDisplaySummary("run_git", {
        action: "status",
      });
      expect(result).toEqual({ verb: "Ran", subject: "git status" });
      expect(result!.filePath).toBeUndefined();
    });

    it("falls back to command param", () => {
      const result = resolveToolDisplaySummary("run_git", {
        command: "status --short",
      });
      expect(result).toEqual({ verb: "Ran", subject: "git status --short" });
    });

    it("returns progressive verb when active", () => {
      const result = resolveToolDisplaySummary(
        "run_git",
        { action: "log" },
        { isActive: true },
      );
      expect(result!.verb).toBe("Running");
    });

    it("returns null when neither action nor command provided", () => {
      expect(resolveToolDisplaySummary("run_git", {})).toBeNull();
    });
  });

  // ── query_language_server ─────────────────────────────────────

  describe("query_language_server", () => {
    it("resolves from operation + filePath", () => {
      const result = resolveToolDisplaySummary("query_language_server", {
        operation: "goToDefinition",
        filePath: "/src/services/AuthService.ts",
      });
      expect(result).toEqual({ verb: "Queried", subject: "goToDefinition in AuthService.ts" });
    });

    it("falls back to action param", () => {
      const result = resolveToolDisplaySummary("query_language_server", {
        action: "references",
      });
      expect(result).toEqual({ verb: "Queried", subject: "references" });
    });

    it("shows operation without filePath", () => {
      const result = resolveToolDisplaySummary("query_language_server", {
        operation: "documentSymbol",
      });
      expect(result).toEqual({ verb: "Queried", subject: "documentSymbol" });
    });

    it("returns null when neither operation nor action provided", () => {
      expect(resolveToolDisplaySummary("query_language_server", {})).toBeNull();
    });
  });

  // ── isActive defaults ─────────────────────────────────────────

  it("defaults isActive to false when options omitted", () => {
    const result = resolveToolDisplaySummary("list_directory", {
      path: "/test",
    });
    expect(result!.verb).toBe("Analyzed");
  });

  it("defaults isActive to false when options is empty", () => {
    const result = resolveToolDisplaySummary("list_directory", { path: "/test" }, {});
    expect(result!.verb).toBe("Analyzed");
  });
});
