// Service worker — Console de crédits ComfyUI / RunComfy
// Stratégie : cache l'app shell (HTML/CSS/JS/icônes) pour un accès hors-ligne.
// Les données live (fetch vers le Web App Apps Script) restent en network-only
// pour ne jamais afficher des crédits périmés sans le signaler.

const CACHE_NAME = 'credits-ia-shell-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ne jamais mettre en cache les appels au Web App Apps Script (données live).
  if (url.hostname.indexOf('script.google.com') !== -1 || url.hostname.indexOf('script.googleusercontent.com') !== -1) {
    return; // laisse passer en network normal, pas d'interception
  }

  // App shell : cache-first, avec mise à jour en arrière-plan.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (event.request.method === 'GET' && networkResponse && networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
