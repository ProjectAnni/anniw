import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { viteMockServe } from "vite-plugin-mock";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    viteMockServe({
      mockPath: "mock",
      supportTs: true,
    }),
  ],
});