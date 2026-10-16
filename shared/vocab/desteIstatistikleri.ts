/* DESTE İSTATİSTİKLERİ
 * ============================================================================
 * "Kaç kelime biliyorum, neyi beceremiyorum, bu hafta ne yaptım" sorularının
 * cevabı. Sayma ve sıralama işi burada; çizim DesteDurumu.tsx'te.
 *
 * Saf işlevler — tarayıcı API'si yok, doğrudan sınanabiliyor
 * (scripts/deste-istatistikleri-sinamasi.mjs).
 */

import type { VocabCard } from './vocabStore';
import { CardState } from './fsrs';
import type { DayStatRow } from '../analytics/activityLog';

/**
 * OLGUN KARTIN EŞİĞİ: 21 gün.
 *
 * Anki'nin ölçütü ve keyfi değil — aralık üç haftayı geçtiğinde kelime
 * kısa süreli hatırlamadan çıkmış sayılıyor. Bundan kısası "taze": doğru
 * bilinmiş ama henüz oturmamış.
 */
export const OLGUN_GUN = 21;

export interface OlgunlukDagilimi {
  /** Hiç çalışılmamış. */
  yeni: number;
  /** Öğrenme ya da yeniden öğrenme adımında. */
  ogreniliyor: number;
  /** Tekrar aşamasında ama aralığı 21 günden kısa. */
  taze: number;
  /** Aralığı 21 gün ve üzeri. */
  olgun: number;
  /** Askıya alınmış; diğer sayımlara girmiyor. */
  askida: number;
  toplam: number;
}

/** Kartın bir sonraki aralığı, gün cinsinden. */
export function araligiGun(kart: VocabCard, simdi = Date.now()): number {
  const son = kart.lastReview ?? kart.createdAt ?? simdi;
  return Math.max(0, (kart.due - son) / 86400000);
}

export function olgunlukDagilimi(kartlar: VocabCard[], simdi = Date.now()): OlgunlukDagilimi {
  const d: OlgunlukDagilimi = {
    yeni: 0, ogreniliyor: 0, taze: 0, olgun: 0, askida: 0, toplam: kartlar.length,
  };

  for (const k of kartlar) {
    if (k.suspended) { d.askida++; continue; }
    if (k.reps === 0) { d.yeni++; continue; }
    if (k.state === CardState.Learning || k.state === CardState.Relearning) {
      d.ogreniliyor++;
      continue;
    }
    if (araligiGun(k, simdi) >= OLGUN_GUN) d.olgun++;
    else d.taze++;
  }

  return d;
}

export interface ZorKart {
  kart: VocabCard;
  /** Kaç kez unutuldu. */
  lapses: number;
  /** 0-100; yüksek olan daha çok zorlanılan. */
  zorlukPuani: number;
}

/**
 * En çok zorlanılan kartlar.
 *
 * ÖLÇÜT YALNIZCA "unutma sayısı" DEĞİL: hiç unutulmamış ama FSRS'nin zor
 * bulduğu kartlar da var. İkisi birleştiriliyor; unutma ağır basıyor çünkü
 * o gerçekten yaşanmış bir başarısızlık, difficulty ise bir tahmin.
 *
 * Hiç çalışılmamış kart listeye girmiyor: zorlandığın söylenemez, daha
 * karşılaşmadın.
 */
export function zorKartlar(kartlar: VocabCard[], enFazla = 10): ZorKart[] {
  return kartlar
    .filter((k) => !k.suspended && k.reps > 0 && (k.lapses > 0 || (k.difficulty ?? 0) >= 7))
    .map((k) => {
      /* AĞIRLIKLAR ÖLÇÜLDÜ, SEÇİLMEDİ. İlk denemede unutma 15, difficulty
         50 puandı; o zaman bir kez unutulmuş kart (15+22=37), hiç
         unutulmamış ama zor tahmin edilenin (44) ALTINDA kalıyordu —
         sınama bunu yakaladı. Oysa unutma yaşanmış bir başarısızlık,
         difficulty yalnızca bir tahmin. Tek unutma bile en yüksek
         difficulty'yi geçsin diye: unutma 25 (tavan 60), difficulty 40. */
      const zorlukPuani = Math.min(
        100,
        Math.min(60, k.lapses * 25) + ((k.difficulty ?? 1) - 1) / 9 * 40
      );
      return { kart: k, lapses: k.lapses, zorlukPuani: Math.round(zorlukPuani) };
    })
    .sort((a, b) => b.zorlukPuani - a.zorlukPuani)
    .slice(0, enFazla);
}

export interface GunOzeti {
  gun: string;
  /** Gösterim için kısa etiket: "12 Eki". */
  etiket: string;
  tekrar: number;
  dogru: number;
}

const AYLAR = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];

/** 'YYYY-MM-DD' → "12 Eki". */
export function gunEtiketi(gun: string): string {
  const [, ay, g] = gun.split('-');
  const ayIndeks = Number(ay) - 1;
  return `${Number(g)} ${AYLAR[ayIndeks] ?? ''}`.trim();
}

/**
 * Son N günün tekrar özeti.
 *
 * GÜNÜ OLMAYAN GÜN DE LİSTEDE: çalışılmamış günler atlanırsa grafik
 * yalancı bir süreklilik gösterir — üç günde bir çalışan biri her gün
 * çalışıyormuş gibi görünür.
 *
 * Aynı gün birden çok cihazdan satır gelebiliyor (satır anahtarı
 * gün|cihaz); hepsi toplanıyor.
 */
export function haftalikOzet(
  satirlar: DayStatRow[],
  gunSayisi = 7,
  simdi = Date.now()
): GunOzeti[] {
  const toplamlar = new Map<string, { tekrar: number; dogru: number }>();
  for (const r of satirlar) {
    const o = toplamlar.get(r.day) || { tekrar: 0, dogru: 0 };
    o.tekrar += r.reviews || 0;
    o.dogru += r.reviewsCorrect || 0;
    toplamlar.set(r.day, o);
  }

  const out: GunOzeti[] = [];
  for (let i = gunSayisi - 1; i >= 0; i--) {
    const t = new Date(simdi);
    t.setDate(t.getDate() - i);
    const gun = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(
      t.getDate()
    ).padStart(2, '0')}`;
    const o = toplamlar.get(gun) || { tekrar: 0, dogru: 0 };
    out.push({ gun, etiket: gunEtiketi(gun), tekrar: o.tekrar, dogru: o.dogru });
  }
  return out;
}

/** Son N gündeki tutma oranı (%). Hiç tekrar yoksa null. */
export function tutmaOrani(ozet: GunOzeti[]): number | null {
  const tekrar = ozet.reduce((t, g) => t + g.tekrar, 0);
  if (tekrar === 0) return null;
  const dogru = ozet.reduce((t, g) => t + g.dogru, 0);
  return Math.round((dogru / tekrar) * 100);
}
