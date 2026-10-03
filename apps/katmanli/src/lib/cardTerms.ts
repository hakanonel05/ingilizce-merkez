/**
 * KART KELİMELERİ — "bunu daha önce karta eklemiştim" farkındalığı.
 *
 * Kelime bankasındaki her kartın ön yüzü bir arama dizinine çevriliyor;
 * transkriptler ve test soruları bu dizine bakarak kart kelimelerini mor
 * işaretliyor (MarkedText). Dizin bir kez kuruluyor ve bütün ekranlar
 * aynı kopyayı paylaşıyor: yüzlerce cümle satırı ayrı ayrı IndexedDB
 * okumasın diye. Kart eklenince/silinince VOCAB_CHANGED_EVENT ile
 * arka planda yeniden kuruluyor.
 *
 * ÇEKİMLER: kart "cultivate" ise metindeki "cultivated", "cultivating",
 * "cultivates" de onun. Kural tabanlı ve kasıtlı olarak kaba — düzensiz
 * fiiller (went, bought) eşleşmiyor. Yanlış pozitif ("bus" kartı "bused"i
 * tutar) burada zararsız: en kötü ihtimalle tanıdık bir kelime mor görünür.
 */

import { useSyncExternalStore } from 'react';
import { getAllCards, VOCAB_CHANGED_EVENT } from '../../../../shared/vocab/vocabStore';
import type { VideoLesson } from '../types';

export interface CardMatcher {
  /** Metindeki tek kelime biçimi (küçük harf) → kartın ön yüzü. */
  words: Map<string, string>;
  /** Çok kelimeli kartlar, kelimeleri tek boşlukla, küçük harf. İlk
   *  kelimenin çekimli biçimleri de ayrı anahtar olarak var
   *  ("lays off", "laid off" hariç). */
  phrases: Map<string, string>;
  /** Dizindeki toplam kart sayısı. */
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

function buildMatcher(fronts: string[]): CardMatcher {
  const words = new Map<string, string>();
  const phrases = new Map<string, string>();
  for (const front of fronts) {
    const parts = (String(front || '').match(WORD_RE) || []).map((p) => p.toLowerCase());
    if (parts.length === 0) continue;
    if (parts.length === 1) {
      for (const form of inflections(parts[0])) if (!words.has(form)) words.set(form, front);
    } else if (parts.length <= MAX_PHRASE_WORDS) {
      const rest = parts.slice(1).join(' ');
      for (const form of inflections(parts[0])) {
        const key = `${form} ${rest}`;
        if (!phrases.has(key)) phrases.set(key, front);
      }
    }
  }
  return { words, phrases, size: fronts.length };
}

/* ---- Paylaşılan depo (useSyncExternalStore) ---- */

let current: CardMatcher = EMPTY;
let started = false;
const listeners = new Set<() => void>();

function reload() {
  getAllCards()
    .then((cards) => {
      current = buildMatcher(cards.map((c) => c.front));
      listeners.forEach((l) => l());
    })
    .catch(() => { /* IndexedDB yoksa işaret de yok; ekran çalışmaya devam eder */ });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!started) {
    started = true;
    reload();
    window.addEventListener(VOCAB_CHANGED_EVENT, reload);
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

/**
 * Bir dersin transkriptinde ve test sorularında geçen FARKLI kart
 * kelimeleri. Ders listesindeki "kartındaki kelimeler" rozeti bunu
 * gösteriyor.
 */
export function lessonCardTerms(lesson: VideoLesson, m: CardMatcher): string[] {
  if (m.size === 0) return [];
  const texts: string[] = (lesson.sentences || []).map((s) => s.en);
  for (const q of lesson.quizQuestions || []) {
    texts.push(q.question, ...(q.options || []));
  }
  const found = new Set<string>();
  for (const text of texts) {
    if (!text) continue;
    const matches = [...text.matchAll(WORD_RE)];
    let i = 0;
    while (i < matches.length) {
      const hit = findCardHits(matches, i, m);
      if (hit) { found.add(hit.front); i += hit.len; } else i++;
    }
  }
  return [...found];
}
