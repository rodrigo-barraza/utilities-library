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
    expect(resolveToolDisplaySummary("read_file", { path: true })).toBeNull();
  });

  // ── list_directory ────────────────────────────────────────────

  describe("list_directory", () => {
    it("shows full path in completed state", () => {
      const result = resolveToolDisplaySummary("list_directory", {
        path: "/home/rodrigo/development/prism-client",
      });
      expect(result).toBe("Analyzed /home/rodrigo/development/prism-client");
    });

    it("shows progressive form when active", () => {
      const result = resolveToolDisplaySummary(
        "list_directory",
        { path: "/home/rodrigo/development" },
        { isActive: true },
      );
      expect(result).toBe("Analyzing /home/rodrigo/development");
    });
  });

  // ── read_file ─────────────────────────────────────────────────

  describe("read_file", () => {
    it("shows basename in completed state", () => {
      const result = resolveToolDisplaySummary("read_file", {
        path: "/home/rodrigo/development/prism-client/src/components/ToolCallsBlockComponent.tsx",
      });
      expect(result).toBe("Read ToolCallsBlockComponent.tsx");
    });

    it("shows progressive form when active", () => {
      const result = resolveToolDisplaySummary(
        "read_file",
        { path: "/src/index.ts" },
        { isActive: true },
      );
      expect(result).toBe("Reading index.ts");
    });

    it("handles Windows-style backslash paths", () => {
      const result = resolveToolDisplaySummary("read_file", {
        path: "C:\\Users\\rodrigo\\file.ts",
      });
      expect(result).toBe("Read file.ts");
    });
  });

  // ── read_files ────────────────────────────────────────────────

  describe("read_files", () => {
    it("shows file count in completed state", () => {
      const result = resolveToolDisplaySummary("read_files", {
        paths: ["/a.ts", "/b.ts", "/c.ts"],
      });
      expect(result).toBe("Read 3 files");
    });

    it("uses singular for one file", () => {
      const result = resolveToolDisplaySummary("read_files", {
        paths: ["/a.ts"],
      });
      expect(result).toBe("Read 1 file");
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
    it("shows basename with past tense", () => {
      const result = resolveToolDisplaySummary("write_file", {
        path: "/src/utils/helpers.ts",
      });
      expect(result).toBe("Wrote helpers.ts");
    });

    it("shows progressive form when active", () => {
      const result = resolveToolDisplaySummary(
        "write_file",
        { path: "/src/index.ts" },
        { isActive: true },
      );
      expect(result).toBe("Writing index.ts");
    });
  });

  // ── replace_in_file ───────────────────────────────────────────

  describe("replace_in_file", () => {
    it("shows basename with edit verb", () => {
      const result = resolveToolDisplaySummary("replace_in_file", {
        path: "/src/config.ts",
      });
      expect(result).toBe("Edited config.ts");
    });
  });

  // ── replace_file_block & replace_file_regions ──────────────────

  describe("replace_file_block", () => {
    it("shows basename with edit verb", () => {
      const result = resolveToolDisplaySummary("replace_file_block", {
        path: "/src/App.tsx",
      });
      expect(result).toBe("Edited App.tsx");
    });
  });

  describe("replace_file_regions", () => {
    it("shows basename with edit verb", () => {
      const result = resolveToolDisplaySummary("replace_file_regions", {
        path: "/src/App.tsx",
      });
      expect(result).toBe("Edited App.tsx");
    });
  });

  // ── patch_file ────────────────────────────────────────────────

  describe("patch_file", () => {
    it("shows basename with patch verb", () => {
      const result = resolveToolDisplaySummary("patch_file", {
        path: "/src/server.ts",
      });
      expect(result).toBe("Patched server.ts");
    });
  });

  // ── search_file_contents ──────────────────────────────────────

  describe("search_file_contents", () => {
    it("shows query and path", () => {
      const result = resolveToolDisplaySummary("search_file_contents", {
        query: "ToolCallsBlock",
        path: "/src/components",
      });
      expect(result).toBe('Searched "ToolCallsBlock" in /src/components');
    });

    it("shows query without path when path is absent", () => {
      const result = resolveToolDisplaySummary("search_file_contents", {
        query: "renderToolName",
      });
      expect(result).toBe('Searched "renderToolName"');
    });

    it("returns null when query is missing", () => {
      expect(
        resolveToolDisplaySummary("search_file_contents", { path: "/src" }),
      ).toBeNull();
    });

    it("truncates very long queries", () => {
      const longQuery = "a".repeat(100);
      const result = resolveToolDisplaySummary("search_file_contents", {
        query: longQuery,
      });
      expect(result!.length).toBeLessThan(60);
    });
  });

  // ── find_files ────────────────────────────────────────────────

  describe("find_files", () => {
    it("shows pattern and path", () => {
      const result = resolveToolDisplaySummary("find_files", {
        pattern: "*.test.ts",
        path: "/src",
      });
      expect(result).toBe('Found "*.test.ts" in /src');
    });

    it("shows pattern without path", () => {
      const result = resolveToolDisplaySummary("find_files", {
        pattern: "*.css",
      });
      expect(result).toBe('Found "*.css"');
    });
  });

  // ── execute_command ───────────────────────────────────────────

  describe("execute_command", () => {
    it("shows command in completed state", () => {
      const result = resolveToolDisplaySummary("execute_command", {
        command: "git status",
      });
      expect(result).toBe("Ran git status");
    });

    it("shows progressive form when active", () => {
      const result = resolveToolDisplaySummary(
        "execute_command",
        { command: "npm run build" },
        { isActive: true },
      );
      expect(result).toBe("Running npm run build");
    });

    it("truncates very long commands", () => {
      const longCommand = "echo " + "x".repeat(200);
      const result = resolveToolDisplaySummary("execute_command", {
        command: longCommand,
      });
      expect(result!.length).toBeLessThan(70);
      expect(result).toContain("…");
    });
  });

  // ── search_web ────────────────────────────────────────────────

  describe("search_web", () => {
    it("shows search query", () => {
      const result = resolveToolDisplaySummary("search_web", {
        query: "TypeScript tool display",
      });
      expect(result).toBe('Searched "TypeScript tool display"');
    });
  });

  // ── read_web_page ─────────────────────────────────────────────

  describe("read_web_page", () => {
    it("shows domain from full URL", () => {
      const result = resolveToolDisplaySummary("read_web_page", {
        url: "https://developer.mozilla.org/en-US/docs/Web/API",
      });
      expect(result).toBe("Read developer.mozilla.org");
    });

    it("handles malformed URLs gracefully", () => {
      const result = resolveToolDisplaySummary("read_web_page", {
        url: "not-a-url",
      });
      expect(result).toBe("Read not-a-url");
    });
  });

  // ── control_browser ───────────────────────────────────────────

  describe("control_browser", () => {
    it("shows action", () => {
      const result = resolveToolDisplaySummary("control_browser", {
        action: "click",
      });
      expect(result).toBe("Browser: click");
    });
  });

  // ── move_file ─────────────────────────────────────────────────

  describe("move_file", () => {
    it("shows source and destination basenames", () => {
      const result = resolveToolDisplaySummary("move_file", {
        source: "/src/old.ts",
        destination: "/src/new.ts",
      });
      expect(result).toBe("Moved old.ts → new.ts");
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
    it("shows basename", () => {
      const result = resolveToolDisplaySummary("delete_file", {
        path: "/src/unused.ts",
      });
      expect(result).toBe("Deleted unused.ts");
    });
  });

  // ── diff_files ────────────────────────────────────────────────

  describe("diff_files", () => {
    it("shows both file basenames", () => {
      const result = resolveToolDisplaySummary("diff_files", {
        pathA: "/src/v1.ts",
        pathB: "/src/v2.ts",
      });
      expect(result).toBe("Compared v1.ts vs v2.ts");
    });

    it("returns null when pathA is missing", () => {
      expect(
        resolveToolDisplaySummary("diff_files", { pathB: "/b.ts" }),
      ).toBeNull();
    });
  });

  // ── summarize_project ─────────────────────────────────────────

  describe("summarize_project", () => {
    it("shows full path", () => {
      const result = resolveToolDisplaySummary("summarize_project", {
        path: "/home/rodrigo/development",
      });
      expect(result).toBe("Summarized /home/rodrigo/development");
    });
  });

  // ── run_git ───────────────────────────────────────────────────

  describe("run_git", () => {
    it("shows git command", () => {
      const result = resolveToolDisplaySummary("run_git", {
        command: "status --short",
      });
      expect(result).toBe("Ran git status --short");
    });

    it("shows progressive form when active", () => {
      const result = resolveToolDisplaySummary(
        "run_git",
        { command: "log -5" },
        { isActive: true },
      );
      expect(result).toBe("Running git log -5");
    });
  });

  // ── query_language_server ─────────────────────────────────────

  describe("query_language_server", () => {
    it("shows action and symbol", () => {
      const result = resolveToolDisplaySummary("query_language_server", {
        action: "definition",
        symbol: "renderToolName",
      });
      expect(result).toBe('Queried definition "renderToolName"');
    });

    it("shows action without symbol", () => {
      const result = resolveToolDisplaySummary("query_language_server", {
        action: "references",
      });
      expect(result).toBe("Queried references");
    });
  });

  // ── isActive defaults to false ────────────────────────────────

  it("defaults isActive to false when options omitted", () => {
    const result = resolveToolDisplaySummary("list_directory", {
      path: "/test",
    });
    expect(result).toBe("Analyzed /test");
  });

  it("defaults isActive to false when options is empty", () => {
    const result = resolveToolDisplaySummary("list_directory", { path: "/test" }, {});
    expect(result).toBe("Analyzed /test");
  });
});
