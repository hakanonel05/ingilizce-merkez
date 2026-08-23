// Netlify Scheduled Function: Supabase projesini uyanik tutar.
//
// NEDEN VAR: Supabase ucretsiz plani, bir hafta boyunca hicbir istek
// almayan projeyi askiya alir. Askiya alinan projenin alt alan adi da
// kaldirilir; tarayici o adrese ulasamayinca giris ekrani "Failed to
// fetch" verir ve senkron tamamen durur. Uygulama gunlerce
// kullanilmadiginda tam olarak bu oldu.
//
// NE YAPAR: gunde bir kez veritabanindan tek satir okur. Onemli olan
// SITEYE degil, dogrudan Supabase'e istek gitmesi: Netlify adresini
// ping'lemek veritabanina dokunmadigi icin askiya almayi engellemez.
//
// Zamanlama netlify.toml icinde ([functions."keepalive"] schedule).
//
// NOT: bu resmi bir garanti degil. Supabase "hareketsizlik" olcutunu
// degistirirse yontem islemez; askiya almanin kesin cozumu ucretli plan.
// Ayrica askidaki bir projeyi UYANDIRMAZ — once panelden Restore etmek
// gerekir, bu fonksiyon yalnizca ayakta olani ayakta tutar.

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/** Sunucu tarafinda calisir; servis anahtari tarayiciya hicbir zaman gitmez. */
export const handler = async () => {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.warn('[keepalive] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY tanimli degil, atlaniyor.');
    return { statusCode: 200, body: 'skipped: env yok' };
  }

  // Gercek bir tablo okumasi: saglik ucu yerine sorgu calistirmak
  // veritabanini da hareketli sayar. Tek satir, tek sutun.
  const url = `${SUPABASE_URL}/rest/v1/sync_kv?select=key&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        // Satir sayimi istemiyoruz; sorgu olabildigince ucuz kalsin
        Prefer: 'count=none',
      },
    });

    // Yanit gövdesini okumak zorunda degiliz; durum kodu yeter.
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 200);
      console.error(`[keepalive] Supabase ${res.status} dondu: ${detail}`);
      return { statusCode: 200, body: `supabase ${res.status}` };
    }

    console.log('[keepalive] Supabase yanit verdi, proje aktif.');
    return { statusCode: 200, body: 'ok' };
  } catch (error: any) {
    // Basarisiz ping bir sonraki gun tekrar denenir; fonksiyonu
    // hataya dusurup Netlify'da alarm uretmesine gerek yok.
    console.error('[keepalive] Supabase istegi basarisiz:', error?.message || error);
    return { statusCode: 200, body: 'unreachable' };
  }
};
