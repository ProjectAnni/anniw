import { clientsClaim } from "workbox-core";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { RangeRequestsPlugin } from "workbox-range-requests";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;

self.skipWaiting();
clientsClaim();

registerRoute(
    ({ request }) => {
        const { url, method } = request;

        return method === "GET" && url.includes("_xcw=1");
    },
    new CacheFirst({
        cacheName: "audio-content-cache",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60,
                purgeOnQuotaError: true,
            }),
            new CacheableResponsePlugin({
                statuses: [200],
            }),
            new RangeRequestsPlugin(),
        ],
    })
);
