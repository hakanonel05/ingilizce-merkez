/**
 * KART KELİMELERİ — "bunu daha önce karta eklemiştim" farkındalığı.
 *
 * Kelime bankasındaki her kartın ön yüzü bir arama dizinine çevriliyor;
 * metinler ve test soruları bu dizine bakarak kart kelimelerini mor
 * işaretliyor: katmanlı'da MarkedText, reading'de CardMarkedText ve
 * okuma parçası. İki uygulama aynı origin'de aynı IndexedDB'yi
 * paylaştığı için (bkz. vocabStore) kartın nereden eklendiği önemsiz. Dizin bir kez kuruluyor ve bütün ekranlar
 * aynı kopyayı paylaşıyor: yüzlerce cümle satırı ayrı ayrı IndexedDB
 * okumasın diye. Kart eklenince/silinince VOCAB_CHANGED_EVENT ile
 * arka planda yeniden kuruluyor.
 *
 * "BİLİYORUM" DENEN KELİME MOR DEĞİL: kelime listesinde Biliyorum dersen
 * (katmanlı, lib/knownWords) kart silinmiyor ama işaret anında kalkıyor —
 * mor "henüz öğreniyorsun" demek. Kartın herhangi bir çekimi bilinen
 * listesindeyse ("engages") kartın tamamı ("engage") işaretten çıkar.
 *
 * ÇEKİMLER: kart "cultivate" ise metindeki "cultivated", "cultivating",
 * "cultivates" de onun. Kural tabanlı ve kasıtlı olarak kaba — düzensiz
 * fiiller (went, bought) eşleşmiyor. Yanlış pozitif ("bus" kartı "bused"i
 * tutar) burada zararsız: en kötü ihtimalle tanıdık bir kelime mor görünür.
 */

import { useSyncExternalStore } from 'react';
import { getAllCards, VOCAB_CHANGED_EVENT, VocabCard, CardSense } from './vocabStore';

export interface CardMatcher {
  /** Metindeki tek kelime biçimi (küçük harf) → kartın ön yüzü. */
  words: Map<string, string>;
  /** Çok kelimeli kartlar, kelimeleri tek boşlukla, küçük harf. İlk
   *  kelimenin çekimli biçimleri de ayrı anahtar olarak var
   *  ("lays off", "laid off" hariç). */
  phrases: Map<string, string>;
  /** Dizindeki kart sayısı ("Biliyorum" denenler hariç). */
  size: number;
}

export const WORD_RE = /[A-Za-z][A-Za-z'-]*/g;
export const MAX_PHRASE_WORDS = 4;

const EMPTY: CardMatcher = { words: new Map(), phrases: new Map(), size: 0 };

const VOWELS = 'aeiou';

/** Bir İngilizce kelimenin düzenli çekimleri (kendisi dahil). */
export function inflections(word: string): string[] {
  const w = word.toLowerCase();
  const out = new Set<string>([w]);
  if (w.length < 3) return [...out];

  const last = w[w.length - 1];
  const prev = w[w.length - 2];

  // -s / -es
  if (/(s|x|z|ch|sh)$/.test(w)) out.add(w + 'es');
  else if (last === 'y' && !VOWELS.includes(prev)) out.add(w.slice(0, -1) + 'ies');
  else out.add(w + 's');

  // -ed / -ing
  if (last === 'e') {
    out.add(w + 'd');
    out.add(w.slice(0, -1) + 'ing');
  } else if (last === 'y' && !VOWELS.includes(prev)) {
    out.add(w.slice(0, -1) + 'ied');
    out.add(w + 'ing');
  } else {
    out.add(w + 'ed');
    out.add(w + 'ing');
    // stop → stopped: kısa, ünsüz-ünlü-ünsüz ile biten kelimelerde
    const prev2 = w[w.length - 3];
    if (
      !VOWELS.includes(last) && !'wxy'.includes(last) &&
      VOWELS.includes(prev) && !VOWELS.includes(prev2) && w.length <= 5
    ) {
      out.add(w + last + 'ed');
      out.add(w + last + 'ing');
    }
  }
  return [...out];
}

/* "Biliyorum" listesi. Anahtar ve olay katmanlı'nın lib/knownWords'ünde
 * tanımlı; aynı origin'de olduğumuz için reading de aynı listeyi görüyor.
 * Burada yalnızca okunuyor. */
const KNOWN_WORDS_KEY = 'layered_learning_known_words_v1';
const KNOWN_WORDS_CHANGED_EVENT = 'known-words-changed';

function readKnownWords(): Set<string> {
  try {
    const parsed = JSON.parse(localStorage.getItem(KNOWN_WORDS_KEY) || '[]');
    return new Set(Array.isArray(parsed) ? parsed.map((w) => String(w).trim().toLowerCase()) : []);
  } catch {
    return new Set();
  }
}

function buildMatcher(fronts: string[], known: Set<string>): CardMatcher {
  const words = new Map<string, string>();
  const phrases = new Map<string, string>();
  let size = 0;
  for (const front of fronts) {
    const parts = (String(front || '').match(WORD_RE) || []).map((p) => p.toLowerCase());
    if (parts.length === 0) continue;
    const firstForms = inflections(parts[0]);
    if (parts.length === 1) {
      if (firstForms.some((f) => known.has(f))) continue;
      for (const form of firstForms) if (!words.has(form)) words.set(form, front);
      size++;
    } else if (parts.length <= MAX_PHRASE_WORDS) {
      const rest = parts.slice(1).join(' ');
      const keys = firstForms.map((form) => `${form} ${rest}`);
      if (keys.some((k) => known.has(k))) continue;
      for (const key of keys) if (!phrases.has(key)) phrases.set(key, front);
      size++;
    }
  }
  return { words, phrases, size };
}

/* ---- Paylaşılan depo (useSyncExternalStore) ---- */

let current: CardMatcher = EMPTY;
let fronts: string[] = [];

/** Mor kelimenin üzerine gelince açılan pencere için kartın yüzleri. */
export interface CardInfo {
  front: string;
  back: string;
  ipa?: string;
  senses?: CardSense[];
  /** Kartın kendisi — pencereden eski karta anlam eklemek için. */
  card: VocabCard;
}
let infoByFront = new Map<string, CardInfo>();

/** Kartın ön yüzünden (MarkedText'in data-card-front'u) kart bilgisi. */
export function cardInfo(front: string): CardInfo | undefined {
  return infoByFront.get(front.trim().toLowerCase());
}
let started = false;
const listeners = new Set<() => void>();

/** Dizini eldeki kartlardan ve güncel "Biliyorum" listesinden yeniden kurar. */
function rebuild() {
  current = buildMatcher(fronts, readKnownWords());
  listeners.forEach((l) => l());
}

function reload() {
  getAllCards()
    .then((cards) => {
      fronts = cards.map((c) => c.front);
      infoByFront = new Map(
        cards.map((c) => [
          c.front.trim().toLowerCase(),
          { front: c.front, back: c.back, ipa: c.ipa, senses: c.senses, card: c },
        ])
      );
      rebuild();
    })
    .catch(() => { /* IndexedDB yoksa işaret de yok; ekran çalışmaya devam eder */ });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!started) {
    started = true;
    reload();
    window.addEventListener(VOCAB_CHANGED_EVENT, reload);
    // Biliyorum: kartları yeniden okumaya gerek yok, yalnız süzgeç değişti.
    window.addEventListener(KNOWN_WORDS_CHANGED_EVENT, rebuild);
    // Başka sekmede (ör. reading açıkken katmanlı'da) Biliyorum denirse.
    window.addEventListener('storage', (e) => { if (e.key === KNOWN_WORDS_KEY) rebuild(); });
  }
  return () => { listeners.delete(listener); };
}

/** Kart dizini; kartlar değişince yeniden çizer. İlk yüklemede boş. */
export function useCardMatcher(): CardMatcher {
  return useSyncExternalStore(subscribe, () => current, () => EMPTY);
}

/**
 * Bir metindeki kart eşleşmeleri, sırayla: [başlangıç, bitiş, kartın ön yüzü].
 * MarkedText ile ders taraması aynı kuralı kullansın diye tek yerde.
 * Çok kelimeli kart, tek kelimeliden önce denenir.
 */
export function findCardHits(
  matches: RegExpMatchArray[],
  i: number,
  m: CardMatcher
): { len: number; front: string } | null {
  if (m.phrases.size > 0) {
    const maxLen = Math.min(MAX_PHRASE_WORDS, matches.length - i);
    for (let len = maxLen; len >= 2; len--) {
      const key = matches.slice(i, i + len).map((x) => x[0].toLowerCase()).join(' ');
      const front = m.phrases.get(key);
      if (front) return { len, front };
    }
  }
  const front = m.words.get(matches[i][0].toLowerCase());
  return front ? { len: 1, front } : null;
}

export interface CardRange {
  start: number;
  end: number;
  front: string;
}

/** Bir metindeki kart eşleşmelerinin karakter aralıkları, sırayla. */
export function cardRanges(text: string, m: CardMatcher): CardRange[] {
  if (m.size === 0 || !text) return [];
  const matches = [...text.matchAll(WORD_RE)];
  const out: CardRange[] = [];
  let i = 0;
  while (i < matches.length) {
    const hit = findCardHits(matches, i, m);
    if (hit) {
      const last = matches[i + hit.len - 1];
      out.push({ start: matches[i].index!, end: last.index! + last[0].length, front: hit.front });
      i += hit.len;
    } else i++;
  }
  return out;
}

/**
 * Metinlerde geçen FARKLI kart kelimeleri (kartın ön yüzüyle). Ders ve
 * parça listelerindeki "N kart kelimesi" bunu gösteriyor.
 */
export function cardTermsInTexts(texts: (string | undefined)[], m: CardMatcher): string[] {
  if (m.size === 0) return [];
  const found = new Set<string>();
  for (const text of texts) {
    for (const r of cardRanges(text || '', m)) found.add(r.front);
  }
  return [...found];
}
