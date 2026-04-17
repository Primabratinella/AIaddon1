const CACHE_NAME = "joke-ai-v2";

const ASSETS = [
    "/AIaddon1/",
    "/AIaddon1/index.html",
    "/AIaddon1/src/style.css",
    "/AIaddon1/src/index.js",
    "/AIaddon1/manifest.json",
    "/AIaddon1/icon-192.png",
    "/AIaddon1/icon-512.png"
  ];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((res) => res || caches.match("/"))
    )
  );
});