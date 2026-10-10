/* MoC7 Atlas offline support: keeps a copy of the app so it opens without a connection.
   The page is always fetched fresh when online; the copy is only used offline. */
const CACHE = "moc7-atlas-v2";
const FILES = ["/moc7/", "/moc7/manifest.webmanifest", "/moc7/favicon.svg", "/moc7/favicon-32.png", "/moc7/apple-touch-icon.png", "/moc7/icon-192.png", "/moc7/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin || !url.pathname.startsWith("/moc7/")) return; // never touch the assistant or other sites
  if (req.mode === "navigate" || url.pathname === "/moc7/" || url.pathname === "/moc7/index.html") {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put("/moc7/", copy)); return r; }).catch(() => caches.match("/moc7/")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
