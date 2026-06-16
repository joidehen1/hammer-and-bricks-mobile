// Hammer & Bricks — Service Worker
// Mighty Units Ltd — cgosti.mightyunits.com / hb.mightyunits.com

const CACHE_NAME = 'hammer-bricks-v1';
const CORE_ASSETS = [
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Network-first for Firebase/API calls, cache-first for static shell.
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Never intercept Firebase, Firestore, Google APIs — always go to network.
  if (
    url.includes('firebaseio.com') ||
    url.includes('googleapis.com') ||
    url.includes('gstatic.com') ||
    url.includes('firebaseapp.com')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.status === 200 && event.request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
