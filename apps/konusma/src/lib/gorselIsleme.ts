/* GÖRSEL BOYUTLANDIRMA
 * ============================================================================
 * Aynı görsel iki ayrı işe iki ayrı boyutta gidiyor ve boyutları ayırmanın
 * somut bir sebebi var:
 *
 *   ÇÖZÜMLEME (1280px, JPEG %82)  — yapay zekâya gönderilen kopya. Küçültmek
 *     şart: telefon kamerası 4000px'lik bir kare üretiyor, base64'e çevrilince
 *     ~8 MB oluyor ve Netlify fonksiyonu 26 saniyede kesiliyor — istek yüklenme
 *     aşamasında ölüyor. 1280px'te ayrıntılar (yüz ifadesi, tabeladaki nesne,
 *     arkadaki insanlar) hâlâ seçiliyor, dosya ~200 KB'a iniyor.
 *
 *   SAKLAMA (640px, JPEG %70)  — geçmiş listesinde gösterilen kopya. Orada
 *     görsel bir hatırlatıcı; ~40 KB yetiyor. Tam boy saklansaydı yüz
 *     alıştırmadan sonra IndexedDB birkaç yüz MB'a çıkardı ve kota dolunca
 *     tarayıcı METİNLERİ de silerdi.
 *
 * HEPSİ JPEG'E ÇEVRİLİYOR: PNG ekran görüntülerinde makul ama fotoğrafta
 * JPEG'in üç dört katı yer kaplıyor, ve buraya gelen şey her zaman fotoğraf.
 */

/** Çözümlemeye gidecek kopya. */
const COZUMLEME_EN = 1280;
const COZUMLEME_KALITE = 0.82;

/** Geçmişte saklanacak kopya. */
const KUCUK_EN = 640;
const KUCUK_KALITE = 0.7;

function gorseliYukle(kaynak: string): Promise<HTMLImageElement> {
  return new Promise((coz, hata) => {
    const img = new Image();
    img.onload = () => coz(img);
    img.onerror = () => hata(new Error('Görsel okunamadı.'));
    img.src = kaynak;
  });
}

/**
 * Uzun kenarı `enBuyukKenar` olacak şekilde küçültüp JPEG data URL döndürür.
 * Görsel zaten küçükse BÜYÜTMEZ — büyütmek ayrıntı katmıyor, yalnızca dosyayı
 * şişiriyor.
 */
async function olcekle(
  kaynak: string,
  enBuyukKenar: number,
  kalite: number
): Promise<string> {
  const img = await gorseliYukle(kaynak);
  const oran = Math.min(1, enBuyukKenar / Math.max(img.naturalWidth, img.naturalHeight));
  const g = Math.max(1, Math.round(img.naturalWidth * oran));
  const y = Math.max(1, Math.round(img.naturalHeight * oran));

  const tuval = document.createElement('canvas');
  tuval.width = g;
  tuval.height = y;
  const ctx = tuval.getContext('2d');
  if (!ctx) throw new Error('Tarayıcı görsel işlemeyi desteklemiyor.');
  ctx.drawImage(img, 0, 0, g, y);
  return tuval.toDataURL('image/jpeg', kalite);
}

export function cozumlemeKopyasi(kaynak: string): Promise<string> {
  return olcekle(kaynak, COZUMLEME_EN, COZUMLEME_KALITE);
}

export function kucukKopya(kaynak: string): Promise<string> {
  return olcekle(kaynak, KUCUK_EN, KUCUK_KALITE);
}

/** Yüklenen dosyayı data URL'e çevirir. */
export function dosyayiOku(dosya: File): Promise<string> {
  return new Promise((coz, hata) => {
    const okuyucu = new FileReader();
    okuyucu.onload = () => coz(String(okuyucu.result));
    okuyucu.onerror = () => hata(new Error('Dosya okunamadı.'));
    okuyucu.readAsDataURL(dosya);
  });
}

/** `data:image/jpeg;base64,XXX` -> `{ tur: 'image/jpeg', veri: 'XXX' }` */
export function veriUrlAyir(veriUrl: string): { tur: string; veri: string } {
  const eslesme = veriUrl.match(/^data:([^;,]+)[^,]*,(.*)$/s);
  if (!eslesme) return { tur: 'image/jpeg', veri: '' };
  return { tur: eslesme[1], veri: eslesme[2] };
}
