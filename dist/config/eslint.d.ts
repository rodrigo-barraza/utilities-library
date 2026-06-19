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