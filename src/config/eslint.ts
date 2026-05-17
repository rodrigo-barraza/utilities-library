/**
 * Factory function to create the standard service ESLint config.
 * Accepts the dependencies as arguments to avoid the library needing
 * to have eslint packages as its own dependencies.
 *
 * When `tseslint` is provided, the config automatically enables
 * TypeScript-aware linting rules (recommended preset, TS-specific
 * no-unused-vars, permissive `any` / `@ts-` comment rules).
 */
export function createServiceEslintConfig({ js, prettierConfig, globals, tseslint }: {
  js: { configs: { recommended: unknown } };
  prettierConfig: unknown;
  globals: { node: Record<string, string> };
  tseslint?: {
    config: (...args: unknown[]) => unknown[];
    configs: { recommended: unknown[] };
  };
}): unknown[] {
  const baseRules: Record<string, unknown> = {
    "no-console": "off",
    "prefer-const": "error",
    "no-var": "error",
  };

  // When typescript-eslint is available, swap no-unused-vars for the TS variant
  if (tseslint) {
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
  } else {
    baseRules["no-unused-vars"] = [
      "error",
      {
        argsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ];
  }

  const configs: unknown[] = [
    js.configs.recommended,
    ...(tseslint ? tseslint.configs.recommended : []),
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

  // When tseslint is available, wrap with tseslint.config() for proper type resolution
  if (tseslint) {
    return tseslint.config(...configs);
  }

  return configs;
}
