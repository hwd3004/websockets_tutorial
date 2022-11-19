import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";
import path from "path";

const config: UserConfig = {
  plugins: [sveltekit()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@src": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/lib/components"),
      "@store": path.resolve(__dirname, "./src/stores/store.ts"),
    },
  },
};

export default config;
