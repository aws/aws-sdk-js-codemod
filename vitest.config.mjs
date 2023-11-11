import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    forceRerunTriggers: ["**/__fixtures__/**"],
  },
});
