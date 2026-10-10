/* ŞU AN KONUŞULAN BÖLÜM
 * ============================================================================
 * TED'in transkriptinde cümlenin tamamı değil, o anda söylenen BÖLÜM sarıyla
 * işaretli. Bizde de cümlenin tamamı boyanıyordu ve bu, nerede olunduğunu
 * söylemiyordu: 25 kelimelik bir cümlede göz hâlâ satırı arıyor.
 *
 * İKİ KAYNAK, İKİ DOĞRULUK — hangisinin kullanıldığı veriye bağlı:
 *
 *   PARÇALAR (kesin). YouTube altyazısı zaten küçük parçalar hâlinde
 *     geliyor ve her birinin gerçek başlangıç/bitiş saniyesi var;
 *     buildSentencesFromCues artık bu sınırları saklıyor. TED'in yaptığı
 *     da tam olarak bu: vurgu birimi altyazı parçası.
 *
 *   TAHMİN (yaklaşık). Elle yapıştırılan transkriptlerde ve BU ÖZELLİKTEN
 *     ÖNCE eklenmiş derslerde parça yok. O zaman cümle kelime öbeklerine
 *     bölünüp geçen süreye göre seçiliyor. Konuşma hızı cümle içinde sabit
 *     değil, yani kayabiliyor — ama hiç vurgulamamaktan iyi ve eski
 *     derslerin yeniden eklenmesini gerektirmiyor.
 */

import type { SentencePair } from '../types';

/** Tahmin modunda bir öbeğe kaç kelime girsin. */
const OBEK_KELIME = 6;

export type VurguAraligi = [number, number];

/** Metni ~OBEK_KELIME kelimelik parçalara böler, karakter aralıklarıyla. */
function obeklereBol(metin: string): VurguAraligi[] {
  const araliklar: VurguAraligi[] = [];
  const kelimeler = [...metin.matchAll(/\S+/g)];
  if (kelimeler.length === 0) return araliklar;

  for (let i = 0; i < kelimeler.length; i += OBEK_KELIME) {
    const ilk = kelimeler[i];
    const son = kelimeler[Math.min(i + OBEK_KELIME, kelimeler.length) - 1];
    araliklar.push([ilk.index!, son.index! + son[0].length]);
  }
  return araliklar;
}

/**
 * Verilen saniyede cümlenin hangi karakter aralığının konuşulduğunu söyler.
 *
 * Cümle aktif değilse ya da hesaplanamıyorsa null döner; çağıran taraf o
 * zaman eski davranışa (cümlenin tamamını hafifçe işaretlemek) düşüyor.
 */
export function aktifVurguAraligi(
  pair: SentencePair,
  saniye: number
): VurguAraligi | null {
  /* 1) KESİN YOL — altyazı parçaları. */
  if (pair.parcalar && pair.parcalar.length > 0) {
    for (const p of pair.parcalar) {
      if (saniye >= p.bas && saniye < p.son) {
        return [p.basHarf, p.sonHarf];
      }
    }
    /* Parçalar arasındaki boşluğa denk geldiyse (altyazıda sessizlik)
       en son geçilen parçayı işaretli bırak: vurgunun sönüp yanması,
       takip edilen satırı kaybettiriyor. */
    let sonGecilen: VurguAraligi | null = null;
    for (const p of pair.parcalar) {
      if (saniye >= p.bas) sonGecilen = [p.basHarf, p.sonHarf];
    }
    return sonGecilen;
  }

  /* 2) TAHMİN — parça yoksa süreyi kelimelere oranla. */
  const bas = pair.startSec;
  const son = pair.endSec;
  if (typeof bas !== 'number' || typeof son !== 'number' || son <= bas) return null;

  const obekler = obeklereBol(pair.en);
  if (obekler.length === 0) return null;

  const oran = (saniye - bas) / (son - bas);
  const sira = Math.floor(oran * obekler.length);
  return obekler[Math.max(0, Math.min(obekler.length - 1, sira))];
}
