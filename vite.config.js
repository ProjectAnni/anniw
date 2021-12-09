import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { viteMockServe } from "vite-plugin-mock";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    plugins: [
        reactRefresh(),
        viteMockServe({
            mockPath: "mock",
            supportTs: true,
        }),
    ],
});
