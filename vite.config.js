import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { viteMockServe } from "vite-plugin-mock";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    plugins: [
        reactRefresh(),
        VitePWA({
            strategies: "injectManifest",
            registerType: "autoUpdate",
            srcDir: "src",
            filename: "service-worker.ts",
            devOptions: {
                enabled: true,
                type: "module",
            },
            injectManifest: {
                injectionPoint: undefined,
            },
        }),
        // viteMockServe({
        //     mockPath: "mock",
        //     supportTs: true,
        // }),
    ],
    css: {
        modules: {
            localsConvention: "camelCaseOnly",
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "https://ribbon.anni.rs/api",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
        port: 3000,
    },
    build: {
        sourcemap: true,
    },
});
