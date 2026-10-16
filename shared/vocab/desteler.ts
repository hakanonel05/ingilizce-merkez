/* KENDİ DESTELERİN ve TOPLU EKLEME
 * ============================================================================
 * İki ayrı ihtiyaç, tek dosya çünkü ikisi de "kartları kendi düzenine göre
 * toparlama" işi:
 *
 *   DESTELER. Şimdiye kadar tek gruplama "hangi derste geçti" idi; o da
 *     kelimenin NEREDEN geldiğini söylüyor, senin onu nasıl çalışmak
 *     istediğini değil. "Sınav kelimeleri", "iş İngilizcesi" gibi kendi
 *     grupların için.
 *
 *   YAPIŞTIRARAK EKLEME. Quizlet, Anki ve çoğu kaynak listeyi satır satır
 *     "terim<TAB>karşılık" olarak veriyor. Elle tek tek eklemek yüz
 *     kelimede saatler sürüyor.
 *
 * Kartın hangi destelerde olduğu KARTIN ÜZERİNDE (`desteler: string[]`):
 * kartlar zaten tek tek eşitleniyor, ayrı bir eşleme tablosu tutsaydık o
 * tablonun da eşitlenmesi ve kartlarla tutarlı kalması gerekirdi.
 */

import type { VocabCard } from './vocabStore';

const DESTE_ANAHTARI = 'layered_learning_vocab_decks_v1';

export interface Deste {
  id: string;
  ad: string;
  olusturuldu: number;
}

/* ---------------------------------------------------------- DESTE KAYDI */

export function desteleriOku(): Deste[] {
  try {
    const ham = localStorage.getItem(DESTE_ANAHTARI);
    const liste = ham ? JSON.parse(ham) : [];
    return Array.isArray(liste) ? liste : [];
  } catch {
    return [];
  }
}

export function desteleriYaz(liste: Deste[]): void {
  try {
    localStorage.setItem(DESTE_ANAHTARI, JSON.stringify(liste));
  } catch (e) {
    console.error('Desteler kaydedilemedi:', e);
  }
}

/** Yeni deste; aynı adlı deste varsa onu döndürür. */
export function desteEkle(ad: string): Deste {
  const temiz = ad.trim();
  const liste = desteleriOku();
  const varsa = liste.find((d) => d.ad.toLowerCase() === temiz.toLowerCase());
  if (varsa) return varsa;

  const yeni: Deste = {
    /* Kimlik addan BAĞIMSIZ: deste yeniden adlandırıldığında kartların
       üzerindeki bağ kopmasın. */
    id: `deste-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ad: temiz,
    olusturuldu: Date.now(),
  };
  desteleriYaz([...liste, yeni]);
  return yeni;
}

export function desteSil(id: string): void {
  desteleriYaz(desteleriOku().filter((d) => d.id !== id));
}

export function desteAdiDegistir(id: string, yeniAd: string): void {
  desteleriYaz(
    desteleriOku().map((d) => (d.id === id ? { ...d, ad: yeniAd.trim() } : d))
  );
}

/** Kart bu destede mi. */
export function destedeMi(kart: VocabCard, desteId: string): boolean {
  return (kart.desteler || []).includes(desteId);
}

/** Kartı desteye ekler/çıkarır; kartın kopyasını döndürür. */
export function desteyiDegistir(
  kart: VocabCard,
  desteId: string,
  ekle: boolean
): VocabCard {
  const simdiki = kart.desteler || [];
  if (ekle) {
    if (simdiki.includes(desteId)) return kart;
    return { ...kart, desteler: [...simdiki, desteId] };
  }
  return { ...kart, desteler: simdiki.filter((d) => d !== desteId) };
}

/* ------------------------------------------------------ YAPIŞTIRMA AYRIŞTIRMA */

export interface YapistirilanSatir {
  on: string;
  arka: string;
}

/* Terim ile karşılığı ayıran işaretler, DENENME SIRASIYLA.
   Sekme en başta: Quizlet'in ve Anki'nin varsayılanı o, ve metinde
   virgül/tire geçtiğinde yanlış bölmeyi önlüyor. */
const AYIRACLAR: { ad: string; re: RegExp }[] = [
  { ad: 'sekme', re: /\t+/ },
  { ad: 'nokta-virgül', re: /\s*;\s*/ },
  { ad: 'tire', re: /\s+[-–—]\s+/ },
  { ad: 'eşittir', re: /\s*=\s*/ },
  { ad: 'iki nokta', re: /\s*:\s+/ },
  { ad: 'virgül', re: /\s*,\s*/ },
];

/**
 * Hangi ayıracın kullanıldığını metnin TAMAMINA bakarak seçer.
 *
 * SATIR SATIR SEÇİLSEYDİ karışırdı: "mistake<TAB>hata, yanlış" satırında
 * sekme doğru ayıraç ama bir sonraki satırda sekme yoksa virgüle düşülür
 * ve "hata" ile "yanlış" iki ayrı alan sanılırdı. En çok satırı ikiye
 * bölen ayıraç kazanıyor.
 */
export function ayiraciSec(metin: string): RegExp | null {
  const satirlar = metin.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  if (satirlar.length === 0) return null;

  let enIyi: { re: RegExp; sayi: number } | null = null;
  for (const a of AYIRACLAR) {
    const sayi = satirlar.filter((s) => s.split(a.re).filter(Boolean).length >= 2).length;
    if (sayi > 0 && (!enIyi || sayi > enIyi.sayi)) enIyi = { re: a.re, sayi };
    /* Bütün satırları bölen bir ayıraç bulunduysa aramaya gerek yok;
       sıradaki ayıraçlar daha zayıf adaylar. */
    if (enIyi && enIyi.sayi === satirlar.length) break;
  }
  return enIyi ? enIyi.re : null;
}

/**
 * Yapıştırılan listeyi satırlara ayırır.
 *
 * İKİDEN FAZLA ALAN VARSA gerisi karşılığa katılıyor: "run, koşmak,
 * işletmek" satırında ikinci virgül yeni bir alan değil, karşılığın
 * parçası. Atılsaydı kullanıcı farkında olmadan kelime kaybederdi.
 */
export function yapistirilaniCozumle(metin: string): YapistirilanSatir[] {
  const ayirac = ayiraciSec(metin);
  if (!ayirac) return [];

  const out: YapistirilanSatir[] = [];
  const gorulen = new Set<string>();

  for (const ham of metin.split(/\r?\n/)) {
    const satir = ham.trim();
    if (!satir) continue;

    const parcalar = satir.split(ayirac).map((p) => p.trim()).filter(Boolean);
    if (parcalar.length < 2) continue;

    const on = parcalar[0];
    const arka = parcalar.slice(1).join(', ');
    if (!on || !arka) continue;

    /* Aynı terim iki kez yapıştırıldıysa biri yeter. */
    const anahtar = on.toLowerCase();
    if (gorulen.has(anahtar)) continue;
    gorulen.add(anahtar);

    out.push({ on, arka });
  }

  return out;
}
