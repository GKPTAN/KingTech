import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default mergeConfig(viteConfig, defineConfig({
    test: {
        include: ["__tests__/**/*.test.{ts,tsx}"],
        globals: true,
        environment: "jsdom",
        coverage: {
            enabled: true,
            provider: "v8",
            reporter: ["text", "json", "html"],
            reportsDirectory: "./coverage",
            include: ["src/utils/**", "src/context/**", "src/pages/**"],
            clean: false,
            reportOnFailure: true
        }
    }
}));