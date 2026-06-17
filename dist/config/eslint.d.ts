/**
 * Factory function to create the standard service ESLint config.
 * Accepts the dependencies as arguments to avoid the library needing
 * to have eslint packages as its own dependencies.
 *
 * When `typescriptEslint` is provided, the config automatically enables
 * TypeScript-aware linting rules (recommended preset, TS-specific
 * no-unused-vars, permissive `any` / `@ts-` comment rules).
 */
export interface EslintConfigItem {
    files?: string[];
    ignores?: string[];
    languageOptions?: {
        ecmaVersion?: string | number;
        sourceType?: string;
        globals?: Record<string, string | boolean>;
    };
    rules?: Record<string, unknown>;
}
export interface JavaScriptConfigGroup {
    configs: {
        recommended: EslintConfigItem | EslintConfigItem[];
    };
}
export interface TypeScriptEslintConfigGroup {
    config: (...args: (EslintConfigItem | EslintConfigItem[])[]) => EslintConfigItem[];
    configs: {
        recommended: EslintConfigItem[];
    };
}
export declare function createServiceEslintConfig({ javascript, prettierConfig, globals, typescriptEslint }: {
    javascript: JavaScriptConfigGroup;
    prettierConfig: EslintConfigItem | EslintConfigItem[];
    globals: {
        node: Record<string, string>;
    };
    typescriptEslint?: TypeScriptEslintConfigGroup;
}): EslintConfigItem[];
//# sourceMappingURL=eslint.d.ts.map