/**
 * Bir dersin zorlugunu KULLANICIYA GORE olcer.
 *
 * Neden yalnizca kart destesine bakilmiyor: kimse "the", "is", "and" icin
 * kelime karti olusturmaz. Anlama orani sadece desteden hesaplansaydi her
 * metin %5 civari cikardi ve sayi anlamsiz olurdu.
 *
 * Bu yuzden iki kaynak birlestiriliyor:
 *   - CEFR listesi: kullanicinin seviyesinin ALTINDAKI kelimeler bilinir
 *     kabul edilir. Okuma arastirmalarindaki "kapsama" olcutu de boyle
 *     calisir; rahat okuma icin esik %95 ~ %98 arasidir.
 *   - FSRS destesi: seviyesi ne olursa olsun, olgunlasmis (Review) bir
 *     karti olan kelime bilinir sayilir. Ogrenilmekte olanlar ayri
 *     gosterilir, cunku henuz guvenilir degiller.
 */

import { CefrLevel, CEFR_ORDER, analyzeCefr, CefrAnalysis, TokenizedWord } from '../../../../shared/vocab/cefr';
import { findPhrases } from '../../../../shared/vocab/phrasal';
import { VocabCard, getAllCards } from '../../../../shared/vocab/vocabStore';
import { CardState } from '../../../../shared/vocab/fsrs';
import { levelOfCached } from './cefrCache';

export const DEFAULT_USER_LEVEL: CefrLevel = 'B1';

export type WordStatus = 'known' | 'learning' | 'unknown';

export interface ScoredWord extends TokenizedWord {
  level: CefrLevel | null;
  status: WordStatus;
}

export interface ScoredPhrase {
  /** Kok hali: "carry out" */
  phrase: string;
  /** Metinde gorulen bicimler: ["carried out"] */
  surfaces: string[];
  count: number;
  level: CefrLevel | null;
  status: WordStatus;
}

export interface LessonInsight {
  cefr: CefrAnalysis;
  /** Kelime GECISI bazinda sayimlar (okurken karsilasma sikligi). */
  knownTokens: number;
  learningTokens: number;
  unknownTokens: number;
  analysedTokens: number;
  /** Bilinen gecislerin yuzdesi, 0-100. */
  comprehension: number;
  /** Bilinmeyen kelimeler, siklik sirali. */
  unknownWords: ScoredWord[];
  /** Ogrenilmekte olan kelimeler. */
  learningWords: ScoredWord[];
  /** Metinde bulunan tum cok sozcuklu kaliplar. */
  phrases: ScoredPhrase[];
  /** Bunlardan bilinmeyenler. */
  unknownPhrases: ScoredPhrase[];
  /** Kart destesinde bulunan kelime sayisi (olgun + ogreniliyor). */
  deckHits: number;
}

/** Kart destesini kelime -> durum haritasina cevirir. */
function buildDeckIndex(cards: VocabCard[]): Map<string, WordStatus> {
  const index = new Map<string, WordStatus>();
  for (const card of cards) {
    if (card.suspended) continue;
    const term = String(card.front || '').trim().toLowerCase();
    if (!term) continue;

    // Olgunlasmis kart = biliniyor. Ogrenme/yeniden ogrenme = henuz degil.
    const status: WordStatus = card.state === CardState.Review ? 'known' : 'learning';

    // Ayni kelimenin birden fazla karti olabilir; en iyi durum kazanir
    if (index.get(term) === 'known') continue;
    index.set(term, status);
  }
  return index;
}

/** Kelimenin durumunu belirler. */
function scoreWord(
  token: TokenizedWord,
  userLevelIndex: number,
  deck: Map<string, WordStatus>
): ScoredWord {
  const level = levelOfCached(token.word);
  const deckStatus = deck.get(token.word);

  // Deste her seyin ustunde: kullanici bu kelimeyi bilerek calismis
  if (deckStatus === 'known') return { ...token, level, status: 'known' };

  // Seviyesi kullanicinin seviyesinde veya altindaysa bilinir kabul et
  if (level && CEFR_ORDER.indexOf(level) <= userLevelIndex) {
    return { ...token, level, status: 'known' };
  }

  if (deckStatus === 'learning') return { ...token, level, status: 'learning' };

  return { ...token, level, status: 'unknown' };
}

/**
 * Metni kullanicinin seviyesine ve destesine gore cozumler.
 * Ag istegi yapmaz; bilinmeyen kelimeleri yapay zekaya sormak icin
 * cefrCache.classifyMissingWords ayrica cagrilir.
 */
export function buildLessonInsight(
  text: string,
  userLevel: CefrLevel,
  cards: VocabCard[]
): LessonInsight {
  const cefr = analyzeCefr(text);
  const deck = buildDeckIndex(cards);
  const userLevelIndex = Math.max(0, CEFR_ORDER.indexOf(userLevel));

  let knownTokens = 0;
  let learningTokens = 0;
  let unknownTokens = 0;
  let deckHits = 0;

  const unknownWords: ScoredWord[] = [];
  const learningWords: ScoredWord[] = [];

  /* --- Cok sozcuklu kaliplar --- */
  // Once kaliplar bulunur, cunku onlari olusturan kelimeler ayrica
  // sayilmamali: "carry out" B2 bir birimken, "carry" ve "out"u ayri ayri
  // A1 diye saymak metni oldugundan kolay gosterirdi.
  const phraseHits = findPhrases(text);
  const consumed = new Map<string, number>();
  const phrases: ScoredPhrase[] = [];
  const unknownPhrases: ScoredPhrase[] = [];

  for (const hit of phraseHits) {
    for (const word of hit.words) {
      consumed.set(word, (consumed.get(word) || 0) + hit.count);
    }

    const level = levelOfCached(hit.phrase);
    const deckStatus = deck.get(hit.phrase);
    let status: WordStatus;
    if (deckStatus === 'known') status = 'known';
    else if (level && CEFR_ORDER.indexOf(level) <= userLevelIndex) status = 'known';
    else if (deckStatus === 'learning') status = 'learning';
    else status = 'unknown';

    const scored: ScoredPhrase = {
      phrase: hit.phrase,
      surfaces: hit.surfaces,
      count: hit.count,
      level,
      status,
    };
    phrases.push(scored);
    if (deckStatus) deckHits++;

    if (status === 'known') knownTokens += hit.count;
    else if (status === 'learning') learningTokens += hit.count;
    else { unknownTokens += hit.count; unknownPhrases.push(scored); }
  }

  /* --- Tekil kelimeler --- */
  for (const token of cefr.tokens) {
    // Ozel isimler kelime bilgisi degildir; anlama oranini sisirmesinler
    if (token.isProperNoun) continue;

    // Bir kalibin parcasi olarak sayilan gecisleri dus
    const usedByPhrase = consumed.get(token.word) || 0;
    const count = Math.max(0, token.count - usedByPhrase);
    if (count === 0) continue;

    const scored = scoreWord({ ...token, count }, userLevelIndex, deck);
    if (deck.has(token.word)) deckHits++;

    if (scored.status === 'known') {
      knownTokens += count;
    } else if (scored.status === 'learning') {
      learningTokens += count;
      learningWords.push(scored);
    } else {
      unknownTokens += count;
      unknownWords.push(scored);
    }
  }

  const analysedTokens = knownTokens + learningTokens + unknownTokens;
  const comprehension = analysedTokens ? (knownTokens / analysedTokens) * 100 : 0;

  unknownWords.sort((a, b) => b.count - a.count);
  learningWords.sort((a, b) => b.count - a.count);

  return {
    cefr,
    knownTokens,
    learningTokens,
    unknownTokens,
    analysedTokens,
    comprehension,
    unknownWords,
    learningWords,
    phrases,
    unknownPhrases,
    deckHits,
  };
}

/** Kart destesini kendisi yukleyen kolaylik sarmalayicisi. */
export async function analyseLesson(
  text: string,
  userLevel: CefrLevel = DEFAULT_USER_LEVEL
): Promise<LessonInsight> {
  const cards = await getAllCards();
  return buildLessonInsight(text, userLevel, cards);
}

/**
 * Anlama oranini okunur bir yargiya cevirir.
 * Esikler okuma arastirmasindaki kapsama olcutlerinden: %98 bagimsiz
 * okuma, %95 rahat, %90 alti destekle.
 */
export function comprehensionVerdict(percent: number): { label: string; tone: 'good' | 'ok' | 'hard' } {
  if (percent >= 98) return { label: 'Çok rahat', tone: 'good' };
  if (percent >= 95) return { label: 'Rahat', tone: 'good' };
  if (percent >= 90) return { label: 'Biraz zorlayıcı', tone: 'ok' };
  if (percent >= 80) return { label: 'Zorlayıcı', tone: 'hard' };
  return { label: 'Çok zor', tone: 'hard' };
}
