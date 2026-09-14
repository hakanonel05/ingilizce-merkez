// ============================================================
// Lexis Trainer — Service Worker (v2 - Robust MIME & Fallback)
// ============================================================

/* v3: v2'de Kokoro modelinin 88 MB'lik gereksiz kopyasi vardi. Surum
   artirilinca eski onbellek silinip yerine temizi kuruluyor.

   v4: ucuncu uygulama (/konusma/) eklendi ve asagidaki kapsam disi birakma
   listesine girdi. SURUM ARTIRMAK SART: bu SW kok kapsaminda ('/') calisiyor
   ve zaten kurulu olan v3, /konusma/ altindaki JS ve CSS'i kendi onbellegine
   almaya calisirdi - reading'in dosyalarina benzeyen ama ona ait olmayan
   varliklar. Surum degisince eski onbellek toptan siliniyor.

   v5: uygulama simgesi degisti (eski simge artik kullanilmayan bir palete
   aitti) ve yaninda PNG surumleri uretildi. Simge dosyalari onbellekte
   duruyor; surum artmazsa kurulu cihazlar eski simgeyi gostermeye devam
   ederdi. */
const CACHE_NAME = 'lexis-trainer-v5';

// Başlangıçta önbelleğe alınacak temel statik dosyalar
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
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
  // BIRLESIK SITE: Katmanli ve Konusma uygulamalari ile API istekleri bu SW'nin
  // kapsami disinda kalmali; aksi halde onbellek yanlis sayfa dondurur.
  {
    const u = new URL(event.request.url);
    if (u.origin === self.location.origin &&
        (u.pathname.startsWith('/katmanli') || u.pathname.startsWith('/konusma') ||
         u.pathname.startsWith('/api') ||
         u.pathname.startsWith('/.netlify'))) {
      return;
    }
  }
  const { request } = event;
  const url = new URL(request.url);

  /*
   * 0. HTTP DIŞI ŞEMALARI PAS GEÇ.
   *
   * Tarayıcı eklentileri sayfaya kendi isteklerini enjekte ediyor
   * (chrome-extension://, moz-extension://). Cache API bu şemaları kabul
   * etmiyor: cache.put() "Request scheme 'chrome-extension' is
   * unsupported" ile atıyor, konsol her sayfa açılışında bu hatayla
   * doluyor ve o istek için fetch işleyicisi yarıda kalıyor.
   */
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // 1. API veya kendi sunucumuz dışındaki istekleri pas geç
  if (url.pathname.startsWith('/api/') || request.method !== 'GET') {
    return;
  }

  /*
   * 1b. MODEL VE SES DOSYALARINI PAS GEÇ.
   *
   * Kokoro'nun modeli (~88 MB) ve ses dosyaları transformers.js tarafından
   * ZATEN kendi Cache API deposunda tutuluyor. Burada ikinci bir kopya almak
   * hiçbir şey kazandırmıyor: canlı sitede ölçtüm, aynı 88 MB iki ayrı
   * önbellekte duruyordu ve toplam 200 MB'a çıkmıştı.
   *
   * Üstelik zararlı — tarayıcının depolama kotası dolunca önbellekler
   * topluca siliniyor, yani işe yarayan kopya da gidiyor.
   *
   * onnxruntime'ın WASM'i (~21 MB) BİLEREK listede değil: onun transformers
   * deposunda bir kopyası yok, tek kalıcı kopyası burası. Pas geçmek 88 MB
   * kazandırmak yerine her ziyarette 21 MB yeniden indirtirdi.
   */
  if (
    /huggingface\.co|\/onnx\/|\.onnx($|\?)|\/voices\/.*\.bin/i.test(url.href)
  ) {
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
