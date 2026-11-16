/* Offline support for the planner: serve the cached copy at once, refresh it in the background. */
const CACHE = 'planner-v1';
const SHELL = [
  '/planner/',
  '/planner/manifest.webmanifest',
  '/planner/icon.svg',
  '/planner/icon-180.png',
  '/planner/icon-192.png',
  '/planner/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('planner-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith('/planner/')) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    const fresh = fetch(req).then(res => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    });
    if (hit) {
      event.waitUntil(fresh.catch(() => {}));
      return hit;
    }
    return fresh;
  })());
});
