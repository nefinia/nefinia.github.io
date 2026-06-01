import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: "./",
  server: {
    host: "127.0.0.1",
    port: 4173,
  },
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL("./src/index.html", import.meta.url)),
      },
    },
  },
});
