/* DERS RAPORU — VERİNİN TOPLANMASI
 * ============================================================================
 * Yedi katmanı bitirdiğin dersin bütün çıktısını tek yerde toplar: iki dilli
 * transkript, kelime kartların, yazdığın özet ve yapay zekânın bütün
 * değerlendirmeleri.
 *
 * NİYE AYRI BİR DOSYA: toplama işi ile çizim işi farklı. Veri üç ayrı yerden
 * geliyor (dersin kendisi, IndexedDB'deki kart destesi, localStorage'daki
 * yanlışlar defteri) ve bu birleştirme bileşenin içinde dururken sınanamaz.
 *
 * ESKİ DERSLER: değerlendirmeler bu özellikten önce HİÇBİR YERE
 * kaydedilmiyordu (yalnızca katmanın bileşen durumundaydılar). Yani eski bir
 * dersin raporunda yazma değerlendirmesi, test sonucu ve konuşma dökümü
 * bulunmayabilir. Rapor bunu gizlemiyor, "kayıt yok" diye yazıyor — eksik
 * olduğunu bilmek, olmayan bir şeyi var sanmaktan iyidir.
 */

import type { VideoLesson, MistakeEntry, SentencePair } from '../types';
import { getCardsByLesson, cardSources } from '../../../../shared/vocab/vocabStore';

/** Rapordaki bir kelime kartı satırı. */
export interface RaporKelimesi {
  on: string;
  arka: string;
  ipa?: string;
  seviye: string;
  /** Kelimenin bu derste geçtiği cümle. */
  baglam?: string;
  ornek?: string;
}

export interface DersRaporu {
  ders: VideoLesson;
  olusturulma: number;
  cumleler: SentencePair[];
  kelimeler: RaporKelimesi[];
  yanlislar: MistakeEntry[];
  /** Çeviriyle birlikte sunulabilecek cümle sayısı (boş çeviriler hariç). */
  cevrilenCumle: number;
}

/**
 * Kartın BU derste geçtiği bağlam cümlesini bulur.
 *
 * Kart birden çok derste görülmüş olabilir ve her görüşün kendi cümlesi var;
 * raporda rastgele birini değil, raporu alınan dersinkini göstermek gerekiyor.
 */
function baglamBul(kart: any, dersId: string): string | undefined {
  const kaynak = cardSources(kart).find((s) => s.lessonId === dersId);
  return kaynak?.contextEn || kart.contextEn || undefined;
}

/** Dersin bütün rapor verisini toplar. */
export async function dersRaporunuTopla(
  ders: VideoLesson,
  yanlislarinTumu: MistakeEntry[]
): Promise<DersRaporu> {
  const kartlar = await getCardsByLesson(ders.id);

  const kelimeler: RaporKelimesi[] = kartlar
    .map((k) => ({
      on: k.front,
      arka: k.back,
      ipa: k.ipa,
      seviye: k.level,
      baglam: baglamBul(k, ders.id),
      ornek: k.exampleEn,
    }))
    /* Alfabetik: raporda kart destesinin tekrar sırası anlamsız,
       aranan kelimeyi bulmak ise kolay olmalı. */
    .sort((a, b) => a.on.localeCompare(b.on, 'en'));

  const cumleler = ders.sentences || [];

  return {
    ders,
    olusturulma: Date.now(),
    cumleler,
    kelimeler,
    yanlislar: yanlislarinTumu.filter((y) => y.lessonId === ders.id),
    cevrilenCumle: cumleler.filter((c) => (c.tr || '').trim().length > 0).length,
  };
}

/** Rapor dosyası/başlık için okunabilir tarih. */
export function raporTarihi(zaman: number): string {
  return new Date(zaman).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Yazdırma penceresinde dosya adı olarak kullanılan başlık. */
export function raporDosyaAdi(ders: VideoLesson, zaman: number): string {
  const tarih = new Date(zaman).toISOString().slice(0, 10);
  const ad = ders.title
    .replace(/[\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60);
  return `${tarih} — ${ad} — Ders Raporu`;
}
