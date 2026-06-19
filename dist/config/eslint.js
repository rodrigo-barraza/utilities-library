// Dependencies are passed as arguments to avoid requiring eslint packages
// as direct dependencies of utilities-library itself.
export function createServiceEslintConfig({ javascript, prettierConfig, globals, typescriptEslint }) {
    const baseRules = {
        "no-console": "off",
        "prefer-const": "error",
        "no-var": "error",
    };
    if (typescriptEslint) {
        baseRules["no-unused-vars"] = "off";
        baseRules["@typescript-eslint/no-unused-vars"] = [
            "error",
            {
                argsIgnorePattern: "^_",
                destructuredArrayIgnorePattern: "^_",
                varsIgnorePattern: "^_",
            },
        ];
        baseRules["@typescript-eslint/no-explicit-any"] = "off";
        baseRules["@typescript-eslint/ban-ts-comment"] = "off";
    }
    else {
        baseRules["no-unused-vars"] = [
            "error",
            {
                argsIgnorePattern: "^_",
                destructuredArrayIgnorePattern: "^_",
                varsIgnorePattern: "^_",
            },
        ];
    }
    const configs = [
        javascript.configs.recommended,
        ...(typescriptEslint ? [typescriptEslint.configs.recommended] : []),
        prettierConfig,
        {
            languageOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                globals: {
                    ...globals.node,
                },
            },
            rules: baseRules,
        },
        {
            files: ["tests/**/*.ts", "tests/**/*.js"],
            languageOptions: {
                globals: {
                    describe: "readonly",
                    it: "readonly",
                    test: "readonly",
                    expect: "readonly",
                    vi: "readonly",
                    beforeEach: "readonly",
                    afterEach: "readonly",
                    beforeAll: "readonly",
                    afterAll: "readonly",
                },
            },
        },
        {
            ignores: ["node_modules/", "dist/"],
        },
    ];
    // typescriptEslint.config() wraps configs for proper type resolution
    if (typescriptEslint) {
        return typescriptEslint.config(...configs);
    }
    return configs.flat();
}
//# sourceMappingURL=eslint.js.map