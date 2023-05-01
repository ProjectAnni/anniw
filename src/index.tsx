import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./global.css";

navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (const registration of registrations) {
        registration.unregister();
    }
});

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
