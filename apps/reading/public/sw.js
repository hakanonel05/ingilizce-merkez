// ============================================================
// Lexis Trainer — Service Worker (v2 - Robust MIME & Fallback)
// ============================================================

const CACHE_NAME = 'lexis-trainer-v2';

// Başlangıçta önbelleğe alınacak temel statik dosyalar
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon.svg',
];

// ---- INSTALL ----
self.addEventListener('install', (event) => {
  console.log('[SW] Kuruluyor v2...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of APP_SHELL) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn('[SW] Cache eklenemedi:', url, err);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

// ---- ACTIVATE (Eski önbellekleri temizle) ----
self.addEventListener('activate', (event) => {
  console.log('[SW] Aktifleştiriliyor v2...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Eski önbellek temizlendi:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ---- FETCH ----
self.addEventListener('fetch', (event) => {
  // BIRLESIK SITE: Katmanli uygulamasi ve API istekleri bu SW'nin
  // kapsami disinda kalmali; aksi halde onbellek yanlis sayfa dondurur.
  {
    const u = new URL(event.request.url);
    if (u.origin === self.location.origin &&
        (u.pathname.startsWith('/katmanli') || u.pathname.startsWith('/api') ||
         u.pathname.startsWith('/.netlify'))) {
      return;
    }
  }
  const { request } = event;
  const url = new URL(request.url);

  // 1. API veya kendi sunucumuz dışındaki istekleri pas geç
  if (url.pathname.startsWith('/api/') || request.method !== 'GET') {
    return;
  }

  // 2. Sayfa Navigasyon İstekleri (HTML)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match('/index.html');
        return cached || Response.error();
      })
    );
    return;
  }

  // 3. Statik Asset İstekleri (JS, CSS, Resimler vb.)
  // Önce ağdan al, alamazsa önbellekten sun.
  // KRİTİK FİKS: Bulunamayan JS/CSS için ASLA index.html DÖNDÜRME!
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Arka planda güncelle (stale-while-revalidate)
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {/* offline */});
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
        }
        return networkResponse;
      });
    })
  );
});
