/* ÇALIŞMA MODLARININ ÇEKİRDEĞİ
 * ============================================================================
 * Üç yeni mod (yazma, çoktan seçmeli, eşleştirme) ve yön seçimi için gereken
 * KARAR mantığı burada: soru üretimi, çeldirici seçimi, cevap denetimi.
 *
 * Çizimden ayrı duruyor çünkü hata yapılabilecek yer burası — "bu cevap doğru
 * mu", "bu çeldirici makul mü" gibi sorular. Tarayıcı API'si istemediği için
 * doğrudan sınanabiliyor (scripts/calisma-modlari-sinamasi.mjs).
 */

import type { VocabCard } from './vocabStore';
import { Rating } from './fsrs';

/** Sorunun hangi yönde sorulduğu. */
export type CalismaYonu = 'enTr' | 'trEn' | 'karisik';

/** Bir soruda neyin sorulup neyin beklendiği. */
export interface SoruYonu {
  /** Ekranda gösterilen taraf. */
  soru: string;
  /** Beklenen cevap. */
  cevap: string;
  /** Soru İngilizce mi (seslendirme ve lang etiketi için). */
  soruIngilizce: boolean;
}

/**
 * Türkçeye duyarlı küçük harf.
 *
 * toLowerCase tek başına yetmiyor: "İ" → "i̇" (birleşik) ve "I" → "i" veriyor,
 * oysa Türkçede "I" küçükken "ı" olur. Karşılaştırma bunu bilmezse kullanıcı
 * doğru yazdığı hâlde yanlış sayılır.
 */
export function kucult(s: string): string {
  return s.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase();
}

/** Karşılaştırma için sadeleştirir: küçük harf, noktalama ve fazla boşluk yok. */
export function sadeles(s: string): string {
  return kucult(s)
    .replace(/[.,;:!?"'’“”()\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Kartın arka yüzündeki SEÇENEKLER.
 *
 * Bir kelimenin birden çok karşılığı olabiliyor ("ana dal, bölüm") ve
 * kullanıcının hepsini yazması beklenemez — herhangi biri doğrudur.
 * Parantez içi açıklama ("ertelemek (bir işi)") hedef değil.
 */
export function cevapSecenekleri(cevap: string): string[] {
  return String(cevap || '')
    .replace(/\([^)]*\)/g, ' ')
    .split(/[,;/]|\bveya\b|\bya da\b/)
    .map((p) => sadeles(p))
    .filter(Boolean);
}

/** İki dizgi arasındaki düzenleme mesafesi (Levenshtein). */
export function mesafe(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let onceki = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const simdiki = [i];
    for (let j = 1; j <= b.length; j++) {
      simdiki[j] = Math.min(
        onceki[j] + 1,
        simdiki[j - 1] + 1,
        onceki[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    onceki = simdiki;
  }
  return onceki[b.length];
}

export type YazmaDurumu = 'dogru' | 'yakin' | 'yanlis';

export interface YazmaSonucu {
  durum: YazmaDurumu;
  /** Yazılana en çok benzeyen beklenen seçenek. */
  beklenen: string;
}

/* "Yakın" sayılmak için gereken en kısa uzunluk. Kısa kelimelerde bir
   harf fark anlamı tamamen değiştirebiliyor ("cat"/"cut"), o yüzden
   orada hoşgörü yok. */
const YAKIN_EN_AZ_UZUNLUK = 4;

/**
 * Yazılan cevabı denetler.
 *
 * ÜÇ SONUÇ, İKİ DEĞİL: bir harf şaşırmakla bambaşka bir kelime yazmak aynı
 * şey değil. "Yakın" ayrı tutuluyor ki planlayıcıya da farklı bir sinyal
 * gitsin (Hard, Again değil) ve kullanıcı neyi az kaçırdığını görsün.
 */
export function yazmayiDenetle(beklenenHam: string, yazilanHam: string): YazmaSonucu {
  const yazilan = sadeles(yazilanHam);
  const secenekler = cevapSecenekleri(beklenenHam);

  if (secenekler.length === 0) return { durum: 'yanlis', beklenen: beklenenHam };
  if (!yazilan) return { durum: 'yanlis', beklenen: secenekler[0] };

  if (secenekler.includes(yazilan)) {
    return { durum: 'dogru', beklenen: yazilan };
  }

  /* En yakın seçeneği bul; hoşgörü yalnızca yeterince uzun kelimelerde. */
  let enIyi = secenekler[0];
  let enIyiMesafe = Infinity;
  for (const s of secenekler) {
    const m = mesafe(yazilan, s);
    if (m < enIyiMesafe) {
      enIyiMesafe = m;
      enIyi = s;
    }
  }

  const uzunluk = Math.max(yazilan.length, enIyi.length);
  if (enIyiMesafe <= 1 && uzunluk >= YAKIN_EN_AZ_UZUNLUK) {
    return { durum: 'yakin', beklenen: enIyi };
  }
  return { durum: 'yanlis', beklenen: enIyi };
}

/** Yazma sonucunun planlayıcıdaki karşılığı. */
export function yazmaDerecesi(durum: YazmaDurumu): Rating {
  if (durum === 'dogru') return Rating.Good;
  if (durum === 'yakin') return Rating.Hard;
  return Rating.Again;
}

/** Bir kartın hangi yönde sorulacağını belirler. */
export function soruYonu(kart: VocabCard, yon: CalismaYonu, rastgele = Math.random): SoruYonu {
  const trEn = yon === 'trEn' || (yon === 'karisik' && rastgele() < 0.5);
  return trEn
    ? { soru: kart.back, cevap: kart.front, soruIngilizce: false }
    : { soru: kart.front, cevap: kart.back, soruIngilizce: true };
}

/** Diziyi karıştırır (Fisher-Yates); kaynağı değiştirmez. */
export function karistir<T>(liste: T[], rastgele = Math.random): T[] {
  const k = [...liste];
  for (let i = k.length - 1; i > 0; i--) {
    const j = Math.floor(rastgele() * (i + 1));
    [k[i], k[j]] = [k[j], k[i]];
  }
  return k;
}

export interface TestSorusu {
  kart: VocabCard;
  soru: string;
  soruIngilizce: boolean;
  /** Şıklar, karışık sırada. */
  secenekler: string[];
  /** Doğru şıkkın `secenekler` içindeki konumu. */
  dogruIndeks: number;
}

/* Bir soruda kaç şık olsun. */
export const TEST_SIK_SAYISI = 4;

/**
 * Çoktan seçmeli soru üretir.
 *
 * ÇELDİRİCİLER RASTGELE DEĞİL: önce aynı söz türünden, sonra aynı
 * seviyeden, en son elde ne varsa. Rastgele seçilseydi "run" sorusunun
 * şıkları "masa / koşmak / yeşil / belki" gibi olur ve soru kendiliğinden
 * cevaplanırdı — ölçtüğü şey kelime bilgisi olmaktan çıkardı.
 *
 * Aynı metni taşıyan çeldirici elenir: destede iki kart aynı Türkçe
 * karşılığı taşıyabiliyor ve "iki şık da doğru" durumu oluşurdu.
 */
export function testSorusuUret(
  kart: VocabCard,
  deste: VocabCard[],
  yon: CalismaYonu,
  rastgele = Math.random
): TestSorusu {
  const { soru, cevap, soruIngilizce } = soruYonu(kart, yon, rastgele);
  const cevapAlani = (k: VocabCard) => (soruIngilizce ? k.back : k.front);

  const adaylar = deste.filter(
    (k) => k.id !== kart.id && sadeles(cevapAlani(k)) !== sadeles(cevap)
  );

  const katmanlar = [
    adaylar.filter((k) => kart.pos && k.pos === kart.pos),
    adaylar.filter((k) => k.level === kart.level),
    adaylar,
  ];

  const celdiriciler: string[] = [];
  const gorulen = new Set([sadeles(cevap)]);

  for (const katman of katmanlar) {
    for (const k of karistir(katman, rastgele)) {
      if (celdiriciler.length >= TEST_SIK_SAYISI - 1) break;
      const metin = cevapAlani(k);
      const anahtar = sadeles(metin);
      if (!anahtar || gorulen.has(anahtar)) continue;
      gorulen.add(anahtar);
      celdiriciler.push(metin);
    }
    if (celdiriciler.length >= TEST_SIK_SAYISI - 1) break;
  }

  const secenekler = karistir([cevap, ...celdiriciler], rastgele);
  return {
    kart,
    soru,
    soruIngilizce,
    secenekler,
    dogruIndeks: secenekler.findIndex((s) => sadeles(s) === sadeles(cevap)),
  };
}

export interface EslestirmeOyunu {
  /** Soldaki kutular (İngilizce), karışık. */
  sol: { kartId: string; metin: string }[];
  /** Sağdaki kutular (Türkçe), karışık. */
  sag: { kartId: string; metin: string }[];
}

/* Eşleştirmede bir turda kaç çift olsun. Fazlası ekrana sığmıyor ve
   oyun ezber değil arama hâline geliyor. */
export const ESLESTIRME_CIFT_SAYISI = 6;

/** Eşleştirme turu kurar. */
export function eslestirmeKur(
  deste: VocabCard[],
  ciftSayisi = ESLESTIRME_CIFT_SAYISI,
  rastgele = Math.random
): EslestirmeOyunu {
  const secilen = karistir(deste, rastgele).slice(0, Math.min(ciftSayisi, deste.length));
  return {
    sol: karistir(
      secilen.map((k) => ({ kartId: k.id, metin: k.front })),
      rastgele
    ),
    sag: karistir(
      secilen.map((k) => ({ kartId: k.id, metin: k.back })),
      rastgele
    ),
  };
}
