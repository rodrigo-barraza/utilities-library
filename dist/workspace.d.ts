export declare const WORKSPACE_MAX_READ_BYTES = 1048576;
export declare const WORKSPACE_MAX_WRITE_BYTES = 5242880;
export declare const WORKSPACE_MAX_LINES_PER_READ = 800;
export declare const WORKSPACE_MAX_PREVIEW_BYTES = 2097152;
export declare const WORKSPACE_MAX_GREP_RESULTS = 50;
export declare const WORKSPACE_MAX_GLOB_RESULTS = 200;
export declare const WORKSPACE_MAX_DIRECTORY_ENTRIES = 500;
export declare const BINARY_FILE_EXTENSIONS: Set<string>;
export declare const PREVIEW_IMAGE_FILE_EXTENSIONS: Set<string>;
export declare const WORKSPACE_SKIP_DIRECTORIES: Set<string>;
/**
 * Convert a glob pattern to a case-insensitive RegExp.
 * Supports: `*` (any except `/`), `**` (any including `/`), `?` (single char).
 */
export declare function globToRegex(glob: string): RegExp;
//# sourceMappingURL=workspace.d.ts.map