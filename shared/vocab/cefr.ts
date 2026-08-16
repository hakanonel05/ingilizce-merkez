/**
 * CEFR seviye analizi.
 *
 * VERI KAYNAGI (cefrWords.json, 9394 kelime) iki listenin birlesimidir:
 *   1. Oxford Learner's Dictionaries (4954 kelime) — YETKILI kaynak
 *   2. Kaggle "10000 English words CEFR labelled" (4440 kelime) — yalnizca
 *      Oxford'da bulunmayan kelimeleri doldurur
 *
 * Ikisi ortak kelimelerde yalnizca %44 ayni seviyeyi veriyor: CEFR
 * etiketlemesi kaynaklar arasinda standart degil. Bu yuzden celiskilerde
 * Oxford kazanir; Kaggle seti seviye DEGISTIRMEZ, yalnizca bosluk doldurur.
 * Ikisinde de olmayan kelimeler yapay zekaya sorulur.
 *
 * Birlesim olcumu (gecis bazinda kapsama): ornek podcast %98.8,
 * hazir ders metinleri %86-95. Kalan bosluk agirlikli olarak uzmanlik
 * terimleri (neuroplasticity, acetylcholine) — genel bir listeden zaten
 * beklenmez.
 *
 * Listede kelimeler KOK halinde. Metinde ise cekimli hallerini goruruz
 * (running, studied, cats). Cekimleri indirgemezsek bilinen kelimelerin
 * buyuk kismi "listede yok" sayilir; bu hem analizi bozar hem de yapay
 * zeka yedegine gereksiz yuk bindirir. Bu yuzden basit bir ek soyme
 * uygulanir: her aday bicim sirayla listede aranir.
 */

import cefrWordsRaw from './cefrWords.json';

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export const CEFR_ORDER: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const grouped = cefrWordsRaw as Record<string, string[]>;

/** kelime -> seviye. Dosya seviyeye gore grupli tutulur (daha kucuk). */
const WORD_LEVELS: Map<string, CefrLevel> = (() => {
  const map = new Map<string, CefrLevel>();
  for (const level of CEFR_ORDER) {
    for (const word of grouped[level] || []) {
      map.set(word, level);
    }
  }
  return map;
})();

/** Listedeki toplam kelime sayisi. */
export const CEFR_WORD_COUNT = WORD_LEVELS.size;

/**
 * Duzensiz bicimler -> kok.
 *
 * Ek soyme yalnizca kurali cekimleri cozer. Oysa metinde en sik gecen
 * kelimeler (is, are, was, these, better...) tam da duzensiz olanlar.
 * Bunlar olmadan analiz "is" kelimesini bilinmeyen sayiyor ve yapay zeka
 * yedegine gonderiyordu.
 */
const IRREGULAR_FORMS: Record<string, string> = {
  // to be / have / do
  am: 'be', is: 'be', are: 'be', was: 'be', were: 'be', been: 'be', being: 'be',
  has: 'have', had: 'have', having: 'have',
  does: 'do', did: 'do', done: 'do', doing: 'do',
  // isaret ve karsilastirma
  these: 'this', those: 'that',
  better: 'good', best: 'good', worse: 'bad', worst: 'bad',
  more: 'much', most: 'much', less: 'little', least: 'little',
  further: 'far', farther: 'far', furthest: 'far', farthest: 'far',
  // sik duzensiz fiiller
  went: 'go', gone: 'go', goes: 'go',
  said: 'say', says: 'say', got: 'get', gotten: 'get', made: 'make',
  took: 'take', taken: 'take', came: 'come', saw: 'see', seen: 'see',
  knew: 'know', known: 'know', thought: 'think', gave: 'give', given: 'give',
  found: 'find', told: 'tell', became: 'become', left: 'leave', felt: 'feel',
  brought: 'bring', began: 'begin', begun: 'begin', kept: 'keep', held: 'hold',
  wrote: 'write', written: 'write', stood: 'stand', heard: 'hear', meant: 'mean',
  met: 'meet', ran: 'run', paid: 'pay', sat: 'sit', spoke: 'speak', spoken: 'speak',
  led: 'lead', grew: 'grow', grown: 'grow', lost: 'lose', fell: 'fall', fallen: 'fall',
  sent: 'send', built: 'build', understood: 'understand', drew: 'draw', drawn: 'draw',
  broke: 'break', broken: 'break', spent: 'spend', rose: 'rise', risen: 'rise',
  drove: 'drive', driven: 'drive', bought: 'buy', wore: 'wear', worn: 'wear',
  chose: 'choose', chosen: 'choose', ate: 'eat', eaten: 'eat', taught: 'teach',
  caught: 'catch', fought: 'fight', threw: 'throw', thrown: 'throw', sold: 'sell',
  won: 'win', forgot: 'forget', forgotten: 'forget', sang: 'sing', sung: 'sing',
  drank: 'drink', drunk: 'drink', slept: 'sleep', fed: 'feed', hid: 'hide',
  hidden: 'hide', rode: 'ride', shot: 'shoot', stole: 'steal', stolen: 'steal',
  woke: 'wake', woken: 'wake', beat: 'beat', beaten: 'beat', blew: 'blow',
  blown: 'blow', dealt: 'deal', flew: 'fly', flown: 'fly', froze: 'freeze',
  frozen: 'freeze', hung: 'hang', laid: 'lay', lent: 'lend', lit: 'light',
  shook: 'shake', shaken: 'shake', shone: 'shine', spread: 'spread',
  struck: 'strike', swept: 'sweep', tore: 'tear', torn: 'tear', swam: 'swim',
  // duzensiz cogullar
  men: 'man', women: 'woman', children: 'child', teeth: 'tooth', feet: 'foot',
  mice: 'mouse', geese: 'goose', lives: 'life', wives: 'wife', knives: 'knife',
  leaves: 'leaf', halves: 'half', shelves: 'shelf', wolves: 'wolf',
  thieves: 'thief', selves: 'self', criteria: 'criterion', phenomena: 'phenomenon',
  analyses: 'analysis', crises: 'crisis', theses: 'thesis', bases: 'basis',
};

/**
 * Yalnizca FIIL cekimlerini geri alir: -s/-es, -ed/-ied, -ing ve duzensiz
 * bicimler. Karsilastirma (-er/-est), zarf (-ly) ve isim cogullari
 * UYGULANMAZ.
 *
 * Kalip eslestirmesi icin ayri tutuluyor: genel soyucu "layer" kelimesinden
 * -er atip "lay" uretiyor ve metindeki "layer in" ifadesi "lay in" kalibina
 * yanlis esleiyordu. Kalibin ilk kelimesi her zaman bir fiildir, dolayisiyla
 * orada yalnizca fiil cekimleri gecerli.
 */
export function verbBaseForms(word: string): string[] {
  const forms = [word];
  const add = (f: string) => { if (f.length >= 2 && !forms.includes(f)) forms.push(f); };

  const irregular = IRREGULAR_FORMS[word];
  if (irregular) add(irregular);

  // 3. tekil / cogul eki
  if (word.endsWith('ies') && word.length > 4) add(word.slice(0, -3) + 'y');
  if (word.endsWith('es') && word.length > 3) add(word.slice(0, -2));
  if (word.endsWith('s') && !word.endsWith('ss')) add(word.slice(0, -1));

  // Gecmis zaman
  if (word.endsWith('ied') && word.length > 4) add(word.slice(0, -3) + 'y');
  if (word.endsWith('ed') && word.length > 3) {
    add(word.slice(0, -2));
    add(word.slice(0, -1));
    const stem = word.slice(0, -2);
    if (/([bdfglmnprt])\1$/.test(stem)) add(stem.slice(0, -1));
  }

  // Simdiki zaman
  if (word.endsWith('ing') && word.length > 4) {
    const stem = word.slice(0, -3);
    add(stem);
    add(stem + 'e');
    if (/([bdgflmnprt])\1$/.test(stem)) add(stem.slice(0, -1));
  }

  return forms;
}

/**
 * Bir kelimenin olasi kok bicimlerini uretir.
 * Sirayla denenir; ilk eslesme kazanir.
 */
function candidateForms(word: string): string[] {
  const forms = [word];
  const add = (f: string) => { if (f.length >= 2 && !forms.includes(f)) forms.push(f); };

  // Duzensiz bicimler kurallardan once denenir
  const irregular = IRREGULAR_FORMS[word];
  if (irregular) add(irregular);

  // Iyelik ve kisaltma
  if (word.endsWith("'s")) add(word.slice(0, -2));
  if (word.endsWith("n't")) add(word.slice(0, -3));

  // Cogul / 3. tekil
  if (word.endsWith('ies') && word.length > 4) add(word.slice(0, -3) + 'y');
  if (word.endsWith('es') && word.length > 3) add(word.slice(0, -2));
  if (word.endsWith('s') && !word.endsWith('ss')) add(word.slice(0, -1));

  // Gecmis zaman / sifat-fiil
  if (word.endsWith('ied') && word.length > 4) add(word.slice(0, -3) + 'y');
  if (word.endsWith('ed') && word.length > 3) {
    add(word.slice(0, -2));
    add(word.slice(0, -1));                       // liked -> like
    const stem = word.slice(0, -2);               // stopped -> stop
    if (/([bdfglmnprt])\1$/.test(stem)) add(stem.slice(0, -1));
  }

  // Simdiki zaman
  if (word.endsWith('ing') && word.length > 4) {
    const stem = word.slice(0, -3);
    add(stem);
    add(stem + 'e');                              // making -> make
    if (/([bdgflmnprt])\1$/.test(stem)) add(stem.slice(0, -1)); // running -> run
  }

  // Zarf
  if (word.endsWith('ily') && word.length > 4) add(word.slice(0, -3) + 'y');
  if (word.endsWith('ly') && word.length > 3) add(word.slice(0, -2));

  // Karsilastirma
  if (word.endsWith('iest') && word.length > 5) add(word.slice(0, -4) + 'y');
  if (word.endsWith('ier') && word.length > 4) add(word.slice(0, -3) + 'y');
  if (word.endsWith('est') && word.length > 4) {
    add(word.slice(0, -3));
    add(word.slice(0, -2));
  }
  if (word.endsWith('er') && word.length > 3) {
    add(word.slice(0, -2));
    add(word.slice(0, -1));
  }

  return forms;
}

/** Kelimenin CEFR seviyesi; listede hicbir bicimi yoksa null. */
export function levelOf(word: string): CefrLevel | null {
  const normalized = word.trim().toLowerCase();
  if (!normalized) return null;

  for (const form of candidateForms(normalized)) {
    const level = WORD_LEVELS.get(form);
    if (level) return level;
  }
  return null;
}

export interface TokenizedWord {
  /** Metinde gectigi hali (kucuk harfe cevrilmis). */
  word: string;
  count: number;
  /** Cumle basi disinda buyuk harfle basliyorsa ozel isim sayilir. */
  isProperNoun: boolean;
}

/**
 * Metni kelimelere ayirir ve her birinin kac kez gectigini sayar.
 * Ozel isimler isaretlenir: bunlar kelime bilgisi degildir, ne analize
 * ne de yapay zeka yedegine girmeliler (yoksa her isim "bilinmeyen
 * kelime" diye siniflandirilmaya gonderilir).
 */
export function tokenize(text: string): TokenizedWord[] {
  const counts = new Map<string, { count: number; capitalHits: number; totalHits: number }>();

  // Cumleleri ayir ki her cumlenin ILK kelimesini ozel isim sanmayalim
  const sentences = text.split(/(?<=[.!?…])\s+|\n+/);

  for (const sentence of sentences) {
    const matches = sentence.match(/[A-Za-z][A-Za-z'-]*/g);
    if (!matches) continue;

    matches.forEach((raw, index) => {
      const lower = raw.toLowerCase();
      const entry = counts.get(lower) || { count: 0, capitalHits: 0, totalHits: 0 };
      entry.count++;
      entry.totalHits++;
      // Cumle basindaki buyuk harf bilgi tasimaz
      if (index > 0 && /^[A-Z]/.test(raw)) entry.capitalHits++;
      counts.set(lower, entry);
    });
  }

  return [...counts.entries()].map(([word, e]) => ({
    word,
    count: e.count,
    // Cumle ici gecislerinin cogu buyuk harfliyse ozel isimdir
    isProperNoun: e.capitalHits > 0 && e.capitalHits >= e.totalHits * 0.6,
  }));
}

export interface CefrAnalysis {
  /**
   * Metindeki tum benzersiz kelimeler (ozel isim isaretiyle birlikte).
   * Cagiran taraf kendi olcutuyle yeniden puanlayabilsin diye tutuluyor;
   * ornegin lessonInsight bunlari kart destesiyle kesistirir.
   */
  tokens: TokenizedWord[];
  /** Seviye basina BENZERSIZ kelime sayisi. */
  byLevel: Record<CefrLevel, number>;
  /** Listede bulunamayan (seviyesi bilinmeyen) kelimeler, siklik sirali. */
  unknown: TokenizedWord[];
  /** Ozel isim sayildigi icin analiz disi birakilanlar. */
  properNouns: number;
  /** Analize giren benzersiz kelime sayisi (ozel isimler haric). */
  uniqueWords: number;
  /** Toplam kelime gecisi. */
  totalWords: number;
  /**
   * Metnin agirlikli seviyesi: kelimelerin %90'ini kapsayan en dusuk
   * seviye. Tek bir C1 kelimesi yuzunden metnin C1 sayilmasini onler.
   */
  dominantLevel: CefrLevel | null;
}

const EMPTY_BY_LEVEL = (): Record<CefrLevel, number> =>
  ({ A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 });

/** Metni CEFR acisindan cozumler. */
export function analyzeCefr(text: string): CefrAnalysis {
  const tokens = tokenize(text);
  const byLevel = EMPTY_BY_LEVEL();
  const unknown: TokenizedWord[] = [];

  let properNouns = 0;
  let uniqueWords = 0;
  let totalWords = 0;

  for (const token of tokens) {
    totalWords += token.count;
    if (token.isProperNoun) { properNouns++; continue; }

    uniqueWords++;
    const level = levelOf(token.word);
    if (level) byLevel[level]++;
    else unknown.push(token);
  }

  unknown.sort((a, b) => b.count - a.count);

  // Kumulatif %90'i yakalayan seviye
  const graded = CEFR_ORDER.reduce((sum, l) => sum + byLevel[l], 0);
  let dominantLevel: CefrLevel | null = null;
  if (graded > 0) {
    let cumulative = 0;
    for (const level of CEFR_ORDER) {
      cumulative += byLevel[level];
      if (cumulative >= graded * 0.9) { dominantLevel = level; break; }
    }
  }

  return { tokens, byLevel, unknown, properNouns, uniqueWords, totalWords, dominantLevel };
}
