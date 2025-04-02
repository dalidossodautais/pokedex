import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@pokedex/ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
  optimizeDeps: {
    include: ["@pokedex/ui"],
  },
  server: {
    proxy: {
      "/api/pokemon": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
