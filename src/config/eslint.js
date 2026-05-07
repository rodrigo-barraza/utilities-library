/**
 * Factory function to create the standard service ESLint config.
 * Accepts the dependencies as arguments to avoid the library needing
 * to have eslint packages as its own dependencies.
 *
 * @param {object} deps
 * @param {object} deps.js - @eslint/js module
 * @param {object} deps.prettierConfig - eslint-config-prettier module
 * @param {object} deps.globals - globals module
 * @returns {Array} ESLint flat config array
 */
export function createServiceEslintConfig({ js, prettierConfig, globals }) {
  return [
    js.configs.recommended,
    prettierConfig,
    {
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        globals: {
          ...globals.node,
        },
      },
      rules: {
        "no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            destructuredArrayIgnorePattern: "^_",
            varsIgnorePattern: "^_",
          },
        ],
        "no-console": "off",
        "prefer-const": "error",
        "no-var": "error",
      },
    },
    {
      files: ["tests/**/*.js"],
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
      ignores: ["node_modules/"],
    },
  ];
}
