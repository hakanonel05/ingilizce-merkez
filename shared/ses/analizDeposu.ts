import type { KayitAnalizi } from './konusmaCozumleme';

/* ÇÖZÜMLEME SONUÇLARININ SAKLANMASI
 * ============================================================================
 * Bir cümlenin çözümlenmesi birkaç saniye sürüyor. Kullanıcı cümleler arasında
 * ileri geri gezindiğinde aynı kaydı tekrar tekrar çözümlemek hem bekletir hem
 * anlamsız — kayıt değişmediyse sonuç da değişmiyor.
 *
 * ANAHTAR kaydın oluşturulma zamanını da içeriyor (`ders:cumle:zaman`). Böylece
 * kullanıcı aynı cümleyi YENİDEN kaydettiğinde eski çözümleme kendiliğinden
 * geçersiz kalıyor; ayrıca silme işlemi gerekmiyor.
 *
 * Ayrı bir veritabanı kullanılıyor, kayıtların yanına yazılmıyor: kayıt deposu
 * sunucuyla eşitleniyor ve şemasına alan eklemek eşitlemeyi bozabilirdi.
 */

const DB_ADI = 'konusma-analizi';
const DB_SURUM = 1;
const DEPO = 'analizler';

interface Satir {
  anahtar: string;
  analiz: KayitAnalizi;
}

function dbAc(): Promise<IDBDatabase> {
  return new Promise((coz, hata) => {
    const istek = indexedDB.open(DB_ADI, DB_SURUM);
    istek.onupgradeneeded = () => {
      const db = istek.result;
      if (!db.objectStoreNames.contains(DEPO)) {
        db.createObjectStore(DEPO, { keyPath: 'anahtar' });
      }
    };
    /* Başka bir sekme sürüm yükseltmesini engelliyorsa onsuccess HİÇ gelmez
       ve söz sonsuza kadar beklemede kalır (bkz. recordingStore'daki aynı
       tuzak). Reddetmek, sessizce donmaktan iyi. */
    istek.onblocked = () => hata(new Error('Veritabanı başka bir sekmede açık.'));
    istek.onsuccess = () => coz(istek.result);
    istek.onerror = () => hata(istek.error || new Error('Veritabanı açılamadı.'));
  });
}

export function analizAnahtari(lessonId: string, sentenceId: number, kayitZamani: number): string {
  return `${lessonId}:${sentenceId}:${kayitZamani}`;
}

export async function analizOku(anahtar: string): Promise<KayitAnalizi | null> {
  try {
    const db = await dbAc();
    const sonuc = await new Promise<Satir | undefined>((coz) => {
      const istek = db.transaction(DEPO).objectStore(DEPO).get(anahtar);
      istek.onsuccess = () => coz(istek.result);
      istek.onerror = () => coz(undefined);
    });
    db.close();
    return sonuc?.analiz ?? null;
  } catch {
    /* Depolama kapalıysa (gizli pencere, kota dolu) özellik yine çalışsın —
       sadece her seferinde yeniden çözümlenir. */
    return null;
  }
}

export async function analizYaz(anahtar: string, analiz: KayitAnalizi): Promise<void> {
  try {
    const db = await dbAc();
    await new Promise<void>((coz, hata) => {
      const iz = db.transaction(DEPO, 'readwrite');
      iz.objectStore(DEPO).put({ anahtar, analiz } satisfies Satir);
      iz.oncomplete = () => coz();
      iz.onerror = () => hata(iz.error);
    });
    db.close();
  } catch {
    /* yazılamadıysa sorun değil: yalnızca önbellek */
  }
}
