import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./global.css";

import { registerSW } from "virtual:pwa-register";

registerSW({
    onRegisteredSW(swUrl, r) {
        if (r) {
            (async () => {
                if (!(!r.installing && navigator)) return;

                if ("connection" in navigator && !navigator.onLine) return;

                const resp = await fetch(swUrl, {
                    cache: "no-store",
                    headers: {
                        cache: "no-store",
                        "cache-control": "no-cache",
                    },
                });

                if (resp?.status === 200) await r.update();
            })();
        }
    },
});

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
