/* HAZIR DİKTE ALIŞTIRMALARI — istemci tarafı
 * ============================================================================
 * EnglishClub'ın alıştırmalarını getiren üç küçük çağrı. Tek yerde duruyorlar
 * çünkü İKİ EKRAN birden kullanıyor: kaynak seçici (liste ve konu açma) ve
 * alıştırma ekranı ("sonraki alıştırma" düğmesi). İki yere kopyalansaydı
 * adres ya da yanıt biçimi değiştiğinde biri sessizce geride kalırdı.
 *
 * Sayfayı sunucu okuyor; sesi tarayıcı doğrudan kaynağından çekiyor
 * (gerekçesi server.ts'teki /api/dikte-hazir notunda).
 */

import { apiFetch } from '../../../../shared/vocab/userKeys';

export interface HazirKonu {
  baslik: string;
  url: string;
}

export interface HazirAlistirma {
  baslik: string;
  normalUrl: string;
  yavasUrl: string;
  metin: string;
  sayfaUrl: string;
  /** Aynı konunun bir sonraki alıştırması; sonuncudaysa boş. */
  sonrakiUrl: string;
}

async function iste<T>(yol: string, hataMesaji: string): Promise<T> {
  const r = await apiFetch(yol);
  const v = await r.json().catch(() => null);
  if (!r.ok) throw new Error(v?.error || hataMesaji);
  return v as T;
}

/** Bir seviyedeki konu başlıkları. */
export function hazirKonulariGetir(seviye: string): Promise<{ konular: HazirKonu[] }> {
  return iste(`/api/dikte-hazir?seviye=${encodeURIComponent(seviye)}`, 'Liste alınamadı.');
}

/**
 * Bir konudaki BÜTÜN alıştırmalar.
 *
 * Yavaş olabiliyor: EnglishClub bir konunun alıştırmalarını tek yerde
 * listelemiyor, her sayfa yalnızca bir sonrakine bağlanıyor; sunucu o
 * zinciri yürüyor. Sonuç sunucuda önbelleğe giriyor, yani ikinci açılış
 * hızlı.
 */
export function konuAlistirmalariniGetir(
  konuUrl: string
): Promise<{ alistirmalar: HazirKonu[] }> {
  return iste(
    `/api/dikte-hazir?konu=${encodeURIComponent(konuUrl)}`,
    'Konunun alıştırmaları alınamadı.'
  );
}

/** Tek bir alıştırma: ses adresleri ve cevap metni. */
export function hazirAlistirmayiGetir(url: string): Promise<HazirAlistirma> {
  return iste(`/api/dikte-hazir?url=${encodeURIComponent(url)}`, 'Alıştırma alınamadı.');
}
