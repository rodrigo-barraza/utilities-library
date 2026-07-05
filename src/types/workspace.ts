// ─── Workspace Types ────────────────────────────────────────
// Canonical type definitions for file, directory, search,
// git, command, and project operations.
// ─────────────────────────────────────────────────────────────

// ── Path Validation ─────────────────────────────────────────

export interface PathValidationResult {
  safe: boolean;
  resolved: string;
  error?: string;
}

// ── File Operations ─────────────────────────────────────────

export interface FileInfoEntry {
  path: string;
  exists: boolean;
  isFile?: boolean;
  isDirectory?: boolean;
  sizeBytes?: number;
  lastModified?: string;
  extension?: string | null;
  isBinary?: boolean;
  lines?: number;
  error?: string;
}

export interface DirectoryEntry {
  name: string;
  path: string;
  isDir: boolean;
  sizeBytes?: number;
}

export interface TreeEntry {
  name: string;
  path?: string;
  type: "file" | "directory";
  sizeBytes?: number;
  children?: TreeEntry[];
}

// ── Search Results ──────────────────────────────────────────

export interface GrepMatch {
  file: string;
  line: number;
  content: string;
}

export interface GlobMatch {
  path: string;
  relativePath: string;
  name: string;
  sizeBytes?: number;
}

// ── Git Operations ──────────────────────────────────────────

export interface GitFileChange {
  status: string;
  file: string;
}

export interface GitStatusResult {
  path: string;
  branch: string;
  ahead: number;
  behind: number;
  staged: GitFileChange[];
  unstaged: GitFileChange[];
  untracked: string[];
  totalChanges: number;
  clean: boolean;
  error?: string;
}

export interface GitDiffResult {
  path?: string;
  staged?: boolean;
  file?: string;
  ref?: string;
  hasChanges?: boolean;
  additions?: number;
  deletions?: number;
  diff?: string;
  error?: string;
}

export interface GitLogResult {
  path?: string;
  totalCommits?: number;
  author?: string;
  since?: string;
  commits?: GitCommit[];
  error?: string;
}

export interface GitCommit {
  hash: string;
  shortHash: string;
  author: string;
  email: string;
  date: string;
  message: string;
}

// ── Command Execution ───────────────────────────────────────

export interface CommandExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  executionTimeMs: number;
  error?: string;
  aborted?: boolean;
  backgrounded?: boolean;
  pid?: number;
  backgroundReason?: string;
  timedOut?: boolean;
}

// ── Project Summary ─────────────────────────────────────────

export interface ProjectSummaryResult {
  path?: string;
  name?: string;
  packageManager?: string | null;
  version?: string | null;
  description?: string | null;
  scripts?: Record<string, string>;
  dependencies?: string[];
  devDependencies?: string[];
  frameworks?: string[];
  type?: string;
  readme?: string;
  structure?: Record<string, number>;
  totalFiles?: number;
  totalDirectories?: number;
  entryPoints?: string[];
  configFiles?: string[];
  error?: string;
}
