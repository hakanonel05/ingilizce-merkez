import { apiFetch } from './userKeys';

/* DOĞAL SESLENDİRME — katmanların ortak yardımcısı
 * ============================================================================
 * Katmanlar bugüne kadar doğrudan window.speechSynthesis çağırıyordu. O API
 * ücretsiz ve anında çalışıyor ama sesi tamamen cihaza bağlı: Windows'ta
 * kabul edilebilir, başka bir bilgisayarda ya da telefonda 2000'lerin robot
 * sesi. Vurgu ve duraklama üzerinde hiçbir denetim yok — cümlenin neresinin
 * önemli olduğunu söyleyemiyorsunuz.
 *
 * Sunucudaki /api/speak ucu Gemini'nin TTS modelini kullanıyor ve üslubu düz
 * metinle alıyor ("virgülde dur, anlam taşıyan kelimeyi vurgula"). Bu dosya
 * katmanları o uca bağlıyor.
 *
 * TARAYICI SESİ YEDEKTE: uç hata verirse (kota doldu, anahtar yok, çevrimdışı)
 * speechSynthesis'e düşülüyor. Ses her zaman çıkıyor, yalnızca kalitesi
 * değişiyor. Sessizce başarısız olmak, öğrencinin dinleyemeyeceği bir ekrandan
 * iyidir.
 *
 * ÖNBELLEK — bunun asıl sebebi para. Gölgeleme katmanında aynı cümle arka
 * arkaya onlarca kez dinleniyor; her seferinde yeniden üretmek her seferinde
 * yeniden faturalanmak demek. Üretilen ses hem bellekte hem IndexedDB'de
 * saklanıyor, aynı metin+ses+profil bir daha sunucuya gitmiyor.
 */

export type OkumaProfili = 'hikaye' | 'cumle' | 'kelime' | 'sohbet';

/** Bellek içi önbellek: aynı sekmede anında. */
const bellek = new Map<string, string>();

const anahtar = (metin: string, profil: OkumaProfili, ses?: string) =>
  `${profil}|${ses || '-'}|${metin}`;

/* ---------- IndexedDB: sekme kapansa da kalsın ---------- */

const DB_ADI = 'katmanli-ses';
const DEPO = 'sesler';
let dbSozu: Promise<IDBDatabase | null> | null = null;

function db(): Promise<IDBDatabase | null> {
  if (dbSozu) return dbSozu;
  dbSozu = new Promise((coz) => {
    try {
      const istek = indexedDB.open(DB_ADI, 1);
      istek.onupgradeneeded = () => {
        const d = istek.result;
        if (!d.objectStoreNames.contains(DEPO)) d.createObjectStore(DEPO);
      };
      istek.onsuccess = () => coz(istek.result);
      istek.onerror = () => coz(null);
    } catch {
      /* Gizli sekmede ya da depolama kapalıysa önbelleksiz devam. */
      coz(null);
    }
  });
  return dbSozu;
}

async function diskteBul(k: string): Promise<Blob | null> {
  const d = await db();
  if (!d) return null;
  return new Promise((coz) => {
    try {
      const istek = d.transaction(DEPO, 'readonly').objectStore(DEPO).get(k);
      istek.onsuccess = () => coz(istek.result || null);
      istek.onerror = () => coz(null);
    } catch {
      coz(null);
    }
  });
}

async function diskeYaz(k: string, blob: Blob): Promise<void> {
  const d = await db();
  if (!d) return;
  try {
    d.transaction(DEPO, 'readwrite').objectStore(DEPO).put(blob, k);
  } catch {
    /* Kota dolduysa önbelleksiz devam — ses yine çalışıyor. */
  }
}

/* ---------- tarayıcı sesi (yedek) ---------- */

export function tarayiciSesiyleOku(metin: string, hiz = 1): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(metin);
  u.lang = 'en-US';
  u.rate = hiz;
  window.speechSynthesis.speak(u);
}

export function sesiDurdur(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (calan) {
    calan.pause();
    calan = null;
  }
}

/* ---------- doğal ses ---------- */

let calan: HTMLAudioElement | null = null;

async function sesAdresi(
  metin: string,
  profil: OkumaProfili,
  ses: string | undefined,
  signal?: AbortSignal
): Promise<string> {
  const k = anahtar(metin, profil, ses);

  const hazir = bellek.get(k);
  if (hazir) return hazir;

  const diskten = await diskteBul(k);
  if (diskten) {
    const adres = URL.createObjectURL(diskten);
    bellek.set(k, adres);
    return adres;
  }

  const res = await apiFetch('/api/speak', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: metin, profil, ...(ses ? { voice: ses } : {}) }),
    signal,
  });

  const govde = await res.text();
  let veri: any;
  try {
    veri = JSON.parse(govde);
  } catch {
    throw new Error('Sunucu beklenmeyen bir yanıt döndürdü.');
  }
  if (!res.ok) throw new Error(veri?.error || 'Ses üretilemedi.');
  if (!veri?.audio) throw new Error('Ses verisi boş geldi.');

  /* base64 -> Blob: data: adresi uzun metinlerde adres uzunluğu sınırına
     takılıyor, blob takılmıyor. */
  const baytlar = Uint8Array.from(atob(veri.audio), (c) => c.charCodeAt(0));
  const blob = new Blob([baytlar], { type: veri.mimeType || 'audio/wav' });

  void diskeYaz(k, blob);
  const adres = URL.createObjectURL(blob);
  bellek.set(k, adres);
  return adres;
}

export interface OkumaSecenekleri {
  profil?: OkumaProfili;
  /** Profilin varsayılan sesini ezmek için. */
  ses?: string;
  hiz?: number;
  /** Doğal ses alınamayıp tarayıcıya düşülünce bir kez çağrılır. */
  onYedek?: (sebep: string) => void;
}

/**
 * Metni seslendirir. Önce doğal ses denenir, olmazsa tarayıcı sesi.
 * Çözülen söz, ses ÇALMAYA BAŞLADIĞINDA değil BİTTİĞİNDE dönüyor —
 * gölgeleme katmanı "bitince kaydı başlat" diyebilsin diye.
 */
export async function oku(metin: string, secenekler: OkumaSecenekleri = {}): Promise<void> {
  const { profil = 'cumle', ses, hiz = 1, onYedek } = secenekler;
  const temiz = metin.trim();
  if (!temiz) return;

  sesiDurdur();

  try {
    const adres = await sesAdresi(temiz, profil, ses);
    const audio = new Audio(adres);
    audio.playbackRate = hiz;
    calan = audio;

    await new Promise<void>((coz, kes) => {
      audio.onended = () => coz();
      audio.onerror = () => kes(new Error('Ses çalınamadı.'));
      audio.play().catch(kes);
    });
    calan = null;
  } catch (hata: any) {
    calan = null;
    onYedek?.(hata?.message || 'Doğal ses alınamadı.');
    tarayiciSesiyleOku(temiz, hiz);
  }
}

/**
 * Sesi önceden üretir ama çalmaz.
 *
 * Gölgeleme katmanında işe yarıyor: öğrenci bir cümleyi dinlerken bir
 * sonraki hazırlanıyor, "Sonraki"ye bastığında bekleme olmuyor.
 */
export function onceden(metin: string, profil: OkumaProfili = 'cumle', ses?: string): void {
  const temiz = metin.trim();
  if (!temiz) return;
  void sesAdresi(temiz, profil, ses).catch(() => {
    /* Sessizce geç: bu yalnızca bir hazırlık, asıl çalma anında yeniden
       denenecek ve orada gerekirse tarayıcı sesine düşülecek. */
  });
}
