/// <reference types="vite/client" />

const { PORT = 5173 } = process.env

import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
    // Redirect calls to express
    proxy: {
      "/api": {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
        ws: true,
      },
    },
  },
  build: {
    outDir: "dist/app",
    target: "esnext",
  },
  resolve: {
    conditions: ["development", "browser"],
  },
})
