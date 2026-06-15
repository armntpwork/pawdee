const CACHE = 'pawdee-v1';
const STATIC = [
  '/',
  '/places',
  '/emergency',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800&display=swap',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // ไม่ cache Firebase, Storage, หรือ external APIs
  if (url.includes('firestore.googleapis.com') ||
      url.includes('firebase') ||
      url.includes('gstatic.com/firebasejs') ||
      url.includes('unsplash.com') ||
      url.includes('make.com')) {
    return;
  }
  // Network-first สำหรับ HTML / cache-first สำหรับ assets
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request) || caches.match('/'))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
