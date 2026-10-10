/* DERS BİRLEŞTİRME KURALLARI
 * ============================================================================
 * Senkronun en riskli parçası burası, ve AYRI BİR DOSYADA olmasının sebebi
 * de bu: kurallar saf işlevler olduğu için doğrudan sınanabiliyorlar
 * (scripts/ders-senkron-sinamasi.mjs). Aynı gerekçe
 * shared/ses/konusmaCozumleme.ts'teki `analizTuret` için de geçerliydi.
 *
 * NEDEN YAZILDI: önceki sürümde ders listesi TEK BİR BLOK olarak
 * eşitleniyordu ve çakışmada "son yazan kazanır" kuralı listenin tamamını
 * değiştiriyordu. Sonucu şu oldu: bir bilgisayarda eklenen ders,
 * diğerinde eklenen dersle birleşmek yerine onu tamamen sildi. Bu
 * gerçekten yaşandı ve kullanıcının çalışması kayboldu.
 *
 * YENİ KURAL ÜÇ MADDE:
 *   1. BİRLEŞTİR, DEĞİŞTİRME. Uzakta olup yerelde olmayan ders eklenir.
 *      Farklı dersler asla birbirini silmez.
 *   2. AYNI DERSİN İKİ SÜRÜMÜNDE YENİ OLAN KAZANIR (updatedAt).
 *   3. SİLME ANCAK MEZAR TAŞIYLA YAYILIR. Silinen ders listeden çıkarılıp
 *      bırakılırsa diğer cihaz onu bilmeye devam eder ve ilk senkronda
 *      geri gönderir — silme hiçbir zaman gerçekleşmez.
 */

export interface SenkronDersi {
  id: string;
  /** Son değişme zamanı; eski kayıtlarda yok, yoksa 0 sayılıyor. */
  updatedAt?: number;
  [alan: string]: any;
}

/** Silinen ders kimlikleri: `{ id: silinmeZamanı }`. */
export type DersMezarlari = Record<string, number>;

export interface BirlestirmeSonucu {
  dersler: SenkronDersi[];
  degisti: boolean;
}

/**
 * Uzaktan gelen bir dersi yerel listeye katar.
 *
 * MEZAR TAŞI KONTROLÜ ÖNCE: yerelde silinmiş bir ders, silme işlemi
 * uzaktaki sürümden yeniyse geri getirilmiyor. Tersi de doğru — ders
 * silindikten SONRA başka bir cihazda düzenlendiyse düzenleme kazanıyor,
 * çünkü kullanıcı o dersi oradan silmemiş.
 */
export function dersiKat(
  dersler: SenkronDersi[],
  uzak: SenkronDersi,
  mezarlar: DersMezarlari = {}
): BirlestirmeSonucu {
  if (!uzak?.id) return { dersler, degisti: false };

  const silinme = mezarlar[uzak.id];
  if (silinme && silinme >= (uzak.updatedAt || 0)) {
    return { dersler, degisti: false };
  }

  const yer = dersler.findIndex((d) => d.id === uzak.id);

  if (yer < 0) {
    /* Yeni ders listenin BAŞINA ekleniyor: arayüz dersleri eklenme
       sırasıyla gösteriyor ve en son gelen en üstte duruyor. */
    return { dersler: [uzak, ...dersler], degisti: true };
  }

  if ((uzak.updatedAt || 0) > (dersler[yer].updatedAt || 0)) {
    const kopya = dersler.slice();
    kopya[yer] = uzak;
    return { dersler: kopya, degisti: true };
  }

  return { dersler, degisti: false };
}

/** Uzakta silinmiş bir dersi yerelden de kaldırır. */
export function dersiCikar(dersler: SenkronDersi[], id: string): BirlestirmeSonucu {
  const kalan = dersler.filter((d) => d.id !== id);
  return { dersler: kalan, degisti: kalan.length !== dersler.length };
}

/**
 * ESKİ BLOK KAYDINI katar — geçiş dönemi.
 *
 * Bu sürümden önce dersler `lessons` anahtarı altında tek blok
 * gönderiliyordu ve bulutta öyle duran kayıtlar var. Blok OKUNMAYA devam
 * ediyor ki o dersler kaybolmasın, ama artık yerelin üzerine YAZMIYOR:
 * içindeki her ders tek tek katılıyor. Böylece eski sürümü çalıştıran bir
 * cihaz hâlâ blok gönderse bile buradaki dersleri silemiyor, yalnızca
 * ekleyebiliyor.
 *
 * Blok kayıtlarında ders başına damga yok; bloğun damgası kullanılıyor.
 */
export function eskiBloguKat(
  dersler: SenkronDersi[],
  blok: unknown,
  blokDamgasi: number,
  mezarlar: DersMezarlari = {}
): BirlestirmeSonucu {
  if (!Array.isArray(blok)) return { dersler, degisti: false };

  let guncel = dersler;
  let degisti = false;

  for (const ders of blok) {
    if (!ders?.id) continue;
    const sonuc = dersiKat(
      guncel,
      { ...ders, updatedAt: ders.updatedAt || blokDamgasi },
      mezarlar
    );
    guncel = sonuc.dersler;
    degisti = degisti || sonuc.degisti;
  }

  return { dersler: guncel, degisti };
}
