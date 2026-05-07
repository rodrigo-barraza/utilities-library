/**
 * Standard service Vitest config.
 * Ready to spread into defineConfig().
 */
export const serviceVitestConfig = {
  test: {
    globals: true,
    exclude: ["tests/live/**", "node_modules/**"],
  },
};
