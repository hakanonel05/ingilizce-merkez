/* TELAFFUZ DEĞERLENDİRME KAYITLARI
 * ============================================================================
 * BURADA DA SES YOK. Telaffuz değerlendirmesinde kayıt Gemini'ye gidiyor —
 * betimlemeden farkı bu — ama gönderildikten sonra yine bırakılıyor:
 * cihazda saklanmıyor, sunucuda da tutulmuyor. Saklanan tek şey raporun
 * kendisi.
 *
 * AYRI BİR VERİTABANI, betimlemelerin yanına yazılmıyor. Sebebi
 * shared/ses/analizDeposu.ts'teki ile aynı: iki özelliğin şeması ve ömrü
 * ayrı. Betimleme deposunun sürümünü yükseltmek, o depoyu açan mevcut
 * kodun yükseltme yolundan geçmesini gerektirirdi; kazancı olmayan bir risk.
 *
 * RAPOR HAM HÂLİYLE DURUYOR, çözümlenmiş hâliyle değil. Ayrıştırıcı
 * (telaffuzRaporu.ts) ileride düzelirse eski kayıtlar da düzelmiş olarak
 * okunur. Puanı ayrıca yazsaydık, ayrıştırıcıdaki bir düzeltme eski
 * kayıtlarda sessizce yalan söylemeye devam ederdi.
 */

const DB_ADI = 'konusma-telaffuz';
const DB_SURUM = 1;
const DEPO = 'degerlendirmeler';

export interface TelaffuzKaydi {
  id: string;
  olusturuldu: number;
  /** Okunması istenen metin. */
  hedefMetin: string;
  /** Hazır bir alıştırma metniyse adı; kendi metnini yazdıysa boş. */
  baslik?: string;
  aksan: string;
  /** Gemini'nin ürettiği ham Markdown rapor. */
  rapor: string;
  model?: string;
}

function dbAc(): Promise<IDBDatabase> {
  return new Promise((coz, hata) => {
    const istek = indexedDB.open(DB_ADI, DB_SURUM);
    istek.onupgradeneeded = () => {
      const db = istek.result;
      if (!db.objectStoreNames.contains(DEPO)) {
        const depo = db.createObjectStore(DEPO, { keyPath: 'id' });
        depo.createIndex('olusturuldu', 'olusturuldu');
      }
    };
    /* Başka bir sekme sürüm yükseltmesini engelliyorsa onsuccess HİÇ gelmez
       ve söz sonsuza kadar beklemede kalır. Reddetmek, sessizce donmaktan
       iyi (aynı tuzak: betimlemeDeposu.ts). */
    istek.onblocked = () => hata(new Error('Veritabanı başka bir sekmede açık.'));
    istek.onsuccess = () => coz(istek.result);
    istek.onerror = () => hata(istek.error || new Error('Veritabanı açılamadı.'));
  });
}

export async function telaffuzYaz(kayit: TelaffuzKaydi): Promise<void> {
  const db = await dbAc();
  try {
    await new Promise<void>((coz, hata) => {
      const iz = db.transaction(DEPO, 'readwrite');
      iz.objectStore(DEPO).put(kayit);
      iz.oncomplete = () => coz();
      iz.onerror = () => hata(iz.error);
    });
  } finally {
    db.close();
  }
}

/** Tüm değerlendirmeler, YENİDEN ESKİYE. */
export async function telaffuzlariOku(): Promise<TelaffuzKaydi[]> {
  try {
    const db = await dbAc();
    try {
      const hepsi = await new Promise<TelaffuzKaydi[]>((coz) => {
        const istek = db.transaction(DEPO).objectStore(DEPO).getAll();
        istek.onsuccess = () => coz(istek.result || []);
        istek.onerror = () => coz([]);
      });
      return hepsi.sort((a, b) => b.olusturuldu - a.olusturuldu);
    } finally {
      db.close();
    }
  } catch {
    /* Depolama kapalıysa (gizli pencere, kota dolu) alıştırma yine
       yapılabilsin; yalnızca geçmiş tutulmaz. */
    return [];
  }
}

export async function telaffuzSil(id: string): Promise<void> {
  const db = await dbAc();
  try {
    await new Promise<void>((coz, hata) => {
      const iz = db.transaction(DEPO, 'readwrite');
      iz.objectStore(DEPO).delete(id);
      iz.oncomplete = () => coz();
      iz.onerror = () => hata(iz.error);
    });
  } finally {
    db.close();
  }
}

export async function tumTelaffuzlariSil(): Promise<void> {
  const db = await dbAc();
  try {
    await new Promise<void>((coz, hata) => {
      const iz = db.transaction(DEPO, 'readwrite');
      iz.objectStore(DEPO).clear();
      iz.oncomplete = () => coz();
      iz.onerror = () => hata(iz.error);
    });
  } finally {
    db.close();
  }
}
