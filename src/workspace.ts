// ─── Workspace File Operations ──────────────────────────────
// Shared constants and utilities for file/directory operations
// used by both tools-service and workspace-service.
// ─────────────────────────────────────────────────────────────

// ── Size Limits ─────────────────────────────────────────────

export const WORKSPACE_MAX_READ_BYTES = 1_048_576;       // 1 MB
export const WORKSPACE_MAX_WRITE_BYTES = 5_242_880;      // 5 MB
export const WORKSPACE_MAX_LINES_PER_READ = 800;
export const WORKSPACE_MAX_PREVIEW_BYTES = 2_097_152;    // 2 MB

// ── Result Caps ─────────────────────────────────────────────

export const WORKSPACE_MAX_GREP_RESULTS = 50;
export const WORKSPACE_MAX_GLOB_RESULTS = 200;
export const WORKSPACE_MAX_DIRECTORY_ENTRIES = 500;

// ── Binary & Preview Extensions ─────────────────────────────

export const BINARY_FILE_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".ico",
  ".mp3", ".mp4", ".wav", ".ogg", ".webm", ".avi", ".mov",
  ".zip", ".tar", ".gz", ".bz2", ".7z", ".rar",
  ".woff", ".woff2", ".ttf", ".otf", ".eot",
  ".pdf", ".doc", ".docx", ".xls", ".xlsx",
  ".exe", ".dll", ".so", ".dylib",
  ".wasm", ".pyc", ".class",
]);

export const PREVIEW_IMAGE_FILE_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp",
  ".bmp", ".ico", ".avif", ".tiff", ".tif",
]);

// ── Skip Directories ────────────────────────────────────────
// Directories excluded from recursive scanning (grep, glob, tree, project summary).

export const WORKSPACE_SKIP_DIRECTORIES = new Set([
  "node_modules", ".git", ".next", ".nuxt", "__pycache__",
  "dist", "build", ".cache", ".turbo", "coverage",
  ".venv", "venv", "env",
]);

// ── Glob Matching ───────────────────────────────────────────

/**
 * Convert a glob pattern to a case-insensitive RegExp.
 * Supports: `*` (any except `/`), `**` (any including `/`), `?` (single char).
 */
export function globToRegex(glob: string): RegExp {
  const regexBody = glob
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "<<<GLOBSTAR>>>")
    .replace(/\*/g, "[^/]*")
    .replace(/<<<GLOBSTAR>>>/g, ".*")
    .replace(/\?/g, ".");
  return new RegExp(`(^|/)${regexBody}$`, "i");
}
