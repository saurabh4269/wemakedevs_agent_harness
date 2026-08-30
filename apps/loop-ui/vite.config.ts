/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const trueforge = process.env.VITE_TRUEFORGE_URL || "http://localhost:8790";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "zustand",
      "@assistant-ui/core",
      "@assistant-ui/react",
      "@assistant-ui/store",
    ],
  },
  server: {
    port: 5173,
    proxy: {
      "/api": { target: trueforge, changeOrigin: true },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test-setup.ts",
  },
});
