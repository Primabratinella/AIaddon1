const CACHE_NAME = "joke-ai-v1";

const ASSETS = [
  "/",
  "/index.html",
  "/src/style.css",
  "/src/index.js",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

/* =========================
   INSTALL (CACHE FILES)
========================= */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

/* =========================
   ACTIVATE (CLEAN OLD CACHE)
========================= */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

/* =========================
   FETCH (OFFLINE-FIRST STRATEGY)
========================= */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => {
          // optional offline fallback
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        })
      );
    })
  );
});