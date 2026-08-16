/**
 * Cok sozcuklu kalip (phrasal verb / collocation) tespiti.
 *
 * NEDEN GEREKLI: kelimeler tek tek kolay olsa da birlestiklerinde ileri
 * seviye olabiliyorlar. "carry" A1, "out" A1, ama "carry out" B2. Kelime
 * kelime bakan bir cozumleyici bu kalibi hic gormez ve metni oldugundan
 * kolay sanir.
 *
 * VERI: github.com/WithEnglishWeCan/generated-english-phrasal-verbs
 * icindeki 3332 kalip dizgisi. Aciklama, ornek cumle ve ceviriler
 * BILEREK alinmadi (kaynakta lisans dosyasi yok; kalip listesi olgusal
 * veridir, duzyazi icerik degil). Cekimli bicimler de tasinmadi:
 * eslestirmede kalibin ilk kelimesi cefr.ts'teki ek soyucuyla koke
 * indiriliyor, boylece veri 277 KB yerine 40 KB.
 *
 * SEVIYE: veri kaynaginda CEFR yok. Bulunan kaliplarin seviyesi, tekil
 * kelimelerde oldugu gibi yapay zekaya sorulup onbellege yazilir.
 * Listenin fazla kapsayici olmasi (talk to, call at gibi duz birlesimler
 * de iceriyor) bu sayede zararsiz: "talk to" A2 doner ve B1 kullaniciya
 * zaten gosterilmez.
 */

import phrasalRaw from './phrasalVerbs.json';
import { verbBaseForms } from './cefr';

const PHRASES: Set<string> = new Set(phrasalRaw as string[]);

/** En uzun kalip 4 kelime; oradan geriye dogru denenir. */
const MAX_PHRASE_WORDS = 4;

export const PHRASE_COUNT = PHRASES.size;

export interface PhraseOccurrence {
  /** Kok hali: "carry out" */
  phrase: string;
  /** Metinde gectigi hali: "carried out" */
  surface: string;
  /** Kalibi olusturan kelimeler (kucuk harf), sirayla. */
  words: string[];
}

export interface PhraseHit {
  phrase: string;
  count: number;
  /** Metinde gorulen bicimler. */
  surfaces: string[];
  words: string[];
}

/** Metni sirali kelime dizisine cevirir (noktalama atilir). */
function wordSequence(text: string): string[] {
  return (text.toLowerCase().match(/[a-z][a-z'-]*/g) || []);
}

/**
 * Bir konumdan baslayan en UZUN kalibi arar.
 * Uzundan kisaya bakilir ki "come up with", "come up"i bastirsin.
 */
function matchAt(words: string[], start: number): PhraseOccurrence | null {
  const maxLen = Math.min(MAX_PHRASE_WORDS, words.length - start);

  for (let len = maxLen; len >= 2; len--) {
    const slice = words.slice(start, start + len);
    const tail = slice.slice(1).join(' ');

    // Ilk kelime cekimli bir FIIL olabilir; olasi koklerini sirayla dene.
    // Yalnizca fiil cekimleri: "layer" -> "lay" gibi karsilastirma/isim
    // indirgemeleri yanlis kalip eslesmesi uretiyordu.
    for (const base of verbBaseForms(slice[0])) {
      const key = `${base} ${tail}`;
      if (PHRASES.has(key)) {
        return { phrase: key, surface: slice.join(' '), words: slice };
      }
    }
  }
  return null;
}

/**
 * Metindeki tum kaliplari bulur.
 * Eslesen kelimeler tuketilir: ayni kelime iki farkli kalibin parcasi
 * olarak iki kez sayilmaz.
 */
export function findPhrases(text: string): PhraseHit[] {
  const words = wordSequence(text);
  const found = new Map<string, PhraseHit>();

  let i = 0;
  while (i < words.length) {
    const hit = matchAt(words, i);
    if (!hit) { i++; continue; }

    const existing = found.get(hit.phrase);
    if (existing) {
      existing.count++;
      if (!existing.surfaces.includes(hit.surface)) existing.surfaces.push(hit.surface);
    } else {
      found.set(hit.phrase, {
        phrase: hit.phrase,
        count: 1,
        surfaces: [hit.surface],
        words: hit.words,
      });
    }

    i += hit.words.length; // kalibin kelimelerini tuket
  }

  return [...found.values()].sort((a, b) => b.count - a.count);
}
