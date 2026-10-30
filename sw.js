/* SCIENCE STUDY same-origin offline shell. Never cache API responses. */
const CACHE = 'science-study-mobile-v1';
const PAGES = [
  './', './index.html', './app.html', './astronomy.html',
  './biology.html', './chemistry.html', './geology.html',
  './physics.html', './paper10.html', './mobile.css',
  './mobile.js', './icon.svg', './manifest.webmanifest'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PAGES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys
    .filter((key) => key.startsWith('science-study-mobile-') && key !== CACHE)
    .map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((cache) => cache.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(req).then((cached) => cached || fetch(req).then((res) => {
    if (res.ok && res.type === 'basic' && !req.url.includes('/api/')) {
      const copy = res.clone(); caches.open(CACHE).then((cache) => cache.put(req, copy));
    }
    return res;
  })));
});
