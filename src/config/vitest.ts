export const serviceVitestConfig = {
  test: {
    globals: true,
    exclude: ["tests/live/**", "node_modules/**"],
  },
} as const;
