/* BETİMLEME KAYITLARI
 * ============================================================================
 * Her alıştırmanın sonucu burada duruyor: görselin küçük hali, konuşmanın
 * yazıya dökülmüş metni, akıcılık ölçümü ve çözümlemenin tamamı.
 *
 * SES KAYDI BURADA YOK VE HİÇ OLMAYACAK.
 * ---------------------------------------------------------------------------
 * Gölgeleme katmanında (katmanlı uygulama) ses kayıtları IndexedDB'ye
 * yazılıyor, çünkü orada kullanıcının kendi kaydını tekrar dinlemesi
 * alıştırmanın parçası. Burada öyle değil: kayıt yalnızca metne dönüşmek
 * için var. Blob, çözümleme biter bitmez bırakılıyor.
 *
 * Bunun iki sebebi var ve ikisi de arayüzde yazıyor:
 *   1. Mahremiyet. Kendi sesin, uzun uzun konuştuğun bir kayıt; saklamak
 *      için sebep yoksa saklanmamalı.
 *   2. Yer. Bir dakikalık webm ~500 KB. Günde üç alıştırma yılda ~500 MB
 *      eder ve tarayıcı kotası dolduğunda İLK silinen şey IndexedDB olur —
 *      yani asıl değerli olan metinler ve ilerleme de giderdi.
 *
 * GÖRSEL SAKLANIYOR ama küçültülmüş halde (bkz. gorselIsleme.ts): geçmişe
 * bakarken neyi anlattığını görmek betimlemeyi okumaktan daha hızlı.
 */

import type { BetimlemeKaydi } from '../types';

const DB_ADI = 'konusma-betimlemeleri';
const DB_SURUM = 1;
const DEPO = 'kayitlar';

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
       iyi (aynı tuzak: shared/ses/analizDeposu.ts). */
    istek.onblocked = () => hata(new Error('Veritabanı başka bir sekmede açık.'));
    istek.onsuccess = () => coz(istek.result);
    istek.onerror = () => hata(istek.error || new Error('Veritabanı açılamadı.'));
  });
}

/** Yeni bir kimlik. Zaman damgası önde: kayıtlar anahtar sırasına göre de kronolojik. */
export function yeniKimlik(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function kayitYaz(kayit: BetimlemeKaydi): Promise<void> {
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

/** Tüm kayıtlar, YENİDEN ESKİYE. Ekranların hepsi bu sırayı istiyor. */
export async function kayitlariOku(): Promise<BetimlemeKaydi[]> {
  try {
    const db = await dbAc();
    try {
      const hepsi = await new Promise<BetimlemeKaydi[]>((coz) => {
        const istek = db.transaction(DEPO).objectStore(DEPO).getAll();
        istek.onsuccess = () => coz(istek.result || []);
        istek.onerror = () => coz([]);
      });
      return hepsi.sort((a, b) => b.olusturuldu - a.olusturuldu);
    } finally {
      db.close();
    }
  } catch {
    /* Depolama kapalıysa (gizli pencere, kota dolu) uygulama yine çalışsın:
       alıştırma yapılabilir, yalnızca geçmiş tutulmaz. */
    return [];
  }
}

export async function kayitSil(id: string): Promise<void> {
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

export async function tumKayitlariSil(): Promise<void> {
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
