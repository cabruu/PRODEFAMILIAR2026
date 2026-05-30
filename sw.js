// Service Worker — Prode Familiar 2026
const CACHE = 'prode-v1';
const PRECACHE = [
  '/',
  '/index.html',
  '/home.html',
  '/js/sheets.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first: siempre intenta la red primero (para que los datos del Sheets
// sean siempre frescos), y cae al caché solo si no hay conexión.
self.addEventListener('fetch', e => {
  // No interceptar llamadas al AppScript
  if (e.request.url.includes('script.google.com')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
