/**
 * Factory function to create the standard service ESLint config.
 * Accepts the dependencies as arguments to avoid the library needing
 * to have eslint packages as its own dependencies.
 *
 * When `tseslint` is provided, the config automatically enables
 * TypeScript-aware linting rules (recommended preset, TS-specific
 * no-unused-vars, permissive `any` / `@ts-` comment rules).
 */
export declare function createServiceEslintConfig({ js, prettierConfig, globals, tseslint }: {
    js: {
        configs: {
            recommended: unknown;
        };
    };
    prettierConfig: unknown;
    globals: {
        node: Record<string, string>;
    };
    tseslint?: {
        config: (...args: unknown[]) => unknown[];
        configs: {
            recommended: unknown[];
        };
    };
}): unknown[];
//# sourceMappingURL=eslint.d.ts.map