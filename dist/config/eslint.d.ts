/**
 * Factory function to create the standard service ESLint config.
 * Accepts the dependencies as arguments to avoid the library needing
 * to have eslint packages as its own dependencies.
 */
export declare function createServiceEslintConfig({ js, prettierConfig, globals }: {
    js: {
        configs: {
            recommended: unknown;
        };
    };
    prettierConfig: unknown;
    globals: {
        node: Record<string, string>;
    };
}): unknown[];
//# sourceMappingURL=eslint.d.ts.map