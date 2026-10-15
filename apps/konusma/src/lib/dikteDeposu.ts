/* DİKTE GEÇMİŞİ
 * ============================================================================
 * Biten her dikte oturumu burada duruyor: hangi metin, kaç birim, kaç doğru.
 * Ses SAKLANMIYOR — telaffuz ve betimleme depolarındaki kuralla aynı: sesler
 * tutulmuyor, yalnızca metin ve sonuç tutuluyor.
 *
 * IndexedDB, localStorage değil: oturum sayısı yüzlere çıkabiliyor ve her
 * kayıt birim birim yazılan metinleri taşıyor.
 */

const DB_ADI = 'konusma-dikte';
const DB_SURUM = 1;
const DEPO = 'oturumlar';

export interface DikteBirimKaydi {
  sira: number;
  hedef: string;
  yazilan: string;
  dogru: number;
  toplam: number;
  /** Bu birimi kaç kez dinlediği. */
  dinleme: number;
  /** Yavaş sürümü kullandı mı. */
  yavasKullandi: boolean;
}

export interface DikteKaydi {
  id: string;
  olusturuldu: number;
  /** Metnin başlığı; kendi metnini yapıştırdıysa ilk kelimelerinden. */
  baslik: string;
  /** Alıştırmanın tam metni. */
  metin: string;
  birimler: DikteBirimKaydi[];
  dogru: number;
  toplam: number;
  /** Doğru kelime oranı, 0-100. */
  puan: number;
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
       ve söz sonsuza kadar beklemede kalır (aynı tuzak: telaffuzDeposu). */
    istek.onblocked = () => hata(new Error('Veritabanı başka bir sekmede açık.'));
    istek.onsuccess = () => coz(istek.result);
    istek.onerror = () => hata(istek.error || new Error('Veritabanı açılamadı.'));
  });
}

export async function dikteYaz(kayit: DikteKaydi): Promise<void> {
  const db = await dbAc();
  await new Promise<void>((coz, hata) => {
    const iz = db.transaction(DEPO, 'readwrite');
    iz.objectStore(DEPO).put(kayit);
    iz.oncomplete = () => coz();
    iz.onerror = () => hata(iz.error || new Error('Kayıt yazılamadı.'));
  });
  db.close();
}

export async function dikteleriOku(): Promise<DikteKaydi[]> {
  const db = await dbAc();
  const kayitlar = await new Promise<DikteKaydi[]>((coz, hata) => {
    const istek = db.transaction(DEPO, 'readonly').objectStore(DEPO).getAll();
    istek.onsuccess = () => coz(istek.result as DikteKaydi[]);
    istek.onerror = () => hata(istek.error || new Error('Kayıtlar okunamadı.'));
  });
  db.close();
  /* En yeni başta: geçmişte aranan şey genellikle son oturum. */
  return kayitlar.sort((a, b) => b.olusturuldu - a.olusturuldu);
}

export async function dikteSil(id: string): Promise<void> {
  const db = await dbAc();
  await new Promise<void>((coz, hata) => {
    const iz = db.transaction(DEPO, 'readwrite');
    iz.objectStore(DEPO).delete(id);
    iz.oncomplete = () => coz();
    iz.onerror = () => hata(iz.error || new Error('Kayıt silinemedi.'));
  });
  db.close();
}
