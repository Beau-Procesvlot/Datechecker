// Service worker: zorgt dat de app ook zonder internet opent.
// App-bestanden: eerst het netwerk (dan heb je altijd de nieuwste versie), zonder internet uit de opslag.
// Nieuwe bestanden? Zet ze ook in SHELL.

const CACHE = 'datechecker';

const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'version.json',
  'css/fonts.css', 'css/app.css',
  'fonts/DMSerifDisplay.woff2', 'fonts/Inter.woff2',
  'icons/icon-192.png', 'icons/apple-touch-icon.png',
  'js/db.js', 'js/app.js', 'js/producten.js', 'js/zoeken.js', 'js/product.js',
  'js/onboarding.js', 'js/backup.js', 'js/pwa.js',
];

self.addEventListener('install', e => {
  // Alles alvast binnenhalen, zodat de app de eerste keer offline ook al compleet is.
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin === self.location.origin) e.respondWith(networkFirst(req));
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    // 'no-cache': bij de server navragen of er iets nieuws is, ook als de browser nog een kopie heeft.
    const res = await fetch(req, { cache: 'no-cache' });
    if (res.ok) cache.put(stripQuery(req), res.clone());
    return res;
  } catch {
    const hit = await cache.match(stripQuery(req)) || (req.mode === 'navigate' ? await cache.match('index.html') : null);
    if (hit) return hit;
    throw new Error('offline');
  }
}

// "version.json?123" en "version.json" zijn hetzelfde bestand.
function stripQuery(req) {
  const url = new URL(req.url);
  if (!url.search) return req;
  url.search = '';
  return new Request(url.href);
}
