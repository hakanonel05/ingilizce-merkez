/**
 * KART BILGISININ OTOMATIK BELIRLENMESI (seviye + tur + soz turu).
 *
 * SORUN: kart eklerken seviye alani her zaman "B2" ile aciliyordu. Yapay
 * zeka bir seviye dondurmediginde ya da ag hatasi oldugunda da B2'ye
 * dusuluyordu; sonucta destedeki her kart B2 gorunuyordu ve seviye
 * filtresi anlamsizlasiyordu.
 *
 * COZUM: elimizde ZATEN seviyeli veri var —
 *   - shared/vocab/cefrWords.json   : 9394 tekil kelime (Oxford + Kaggle)
 *   - shared/vocab/phrasalLevels.json: 621 kalibin seviyesi
 * Bu listeler yapay zekadan once sorulur. Cevrimdisi bile calisir, ucretsizdir
 * ve ayni kelime her zaman ayni seviyeyi alir (yapay zeka her cagrida farkli
 * cevap verebiliyordu).
 *
 * ONCELIK SIRASI
 *   Seviye : yerel liste  ->  yapay zeka  ->  parcalardan tahmin  ->  varsayilan
 *   Tur    : kalip listesi ->  yapay zeka  ->  bicimsel tahmin
 *   Sozturu: yapay zeka    ->  yerel tahmin (baglamli)
 *
 * Seviyede liste yapay zekanin onunde, soz turunde arkasindadir: listede
 * seviye OLGUSAL bir veridir, soz turu ise baglama gore degisir ("a long
 * run" isim, "I run" fiil) ve orada baglami goren yapay zeka daha iyidir.
 */

import { CefrLevel, CEFR_ORDER, levelOf } from './cefr';
import { phraseLevelOf, isPhrasalVerb } from './phrasal';
import { PartOfSpeech, resolvePos } from './pos';

/** vocabStore'daki CardKind ile ayni kume; dongusel import olmasin diye burada. */
export type CardKindName = 'word' | 'phrasal_verb' | 'collocation' | 'idiom' | 'expression';

const KINDS: CardKindName[] = ['word', 'phrasal_verb', 'collocation', 'idiom', 'expression'];

/**
 * Yerel listede bulunmayan TEK kelimeler icin varsayilan.
 * 9394 kelimelik genel listede olmayan bir kelime tanimi geregi gunluk
 * kelime dagarciginin disindadir; B2 degil C1 varsaymak daha dogru.
 */
const UNKNOWN_WORD_LEVEL: CefrLevel = 'C1';
/** Listede olmayan kaliplar icin varsayilan. */
const UNKNOWN_PHRASE_LEVEL: CefrLevel = 'B2';

/** Ifadeyi karsilastirilabilir hale getirir: kucuk harf, tek bosluk. */
export function normalizeTerm(term: string): string {
  return term.trim().toLowerCase().replace(/\s+/g, ' ').replace(/^to\s+/, '');
}

/** Seviyeyi n basamak yukari tasir (C2'yi asmaz). */
function bumpLevel(level: CefrLevel, steps: number): CefrLevel {
  const index = Math.min(CEFR_ORDER.length - 1, CEFR_ORDER.indexOf(level) + steps);
  return CEFR_ORDER[index];
}

export type LevelSource =
  /** cefrWords.json — tekil kelime listesi */
  | 'word-list'
  /** phrasalLevels.json — hazir kalip seviyeleri */
  | 'phrase-list'
  /** kalibi olusturan kelimelerin seviyesinden turetildi */
  | 'phrase-parts'
  /** yapay zekanin verdigi seviye */
  | 'ai'
  /** hicbiri: varsayilana dusuldu */
  | 'default';

export interface LevelResult {
  level: CefrLevel;
  source: LevelSource;
}

/**
 * Ifadenin seviyesini YALNIZCA yerel verilerden bulur; ag istegi yapmaz.
 * Bulamazsa null doner ki cagiran taraf yapay zeka yanitina duşebilsin.
 */
export function localLevelOf(term: string): LevelResult | null {
  const normalized = normalizeTerm(term);
  if (!normalized) return null;

  const words = normalized.split(' ');

  if (words.length === 1) {
    const level = levelOf(normalized);
    return level ? { level, source: 'word-list' } : null;
  }

  const known = phraseLevelOf(normalized);
  if (known) return { level: known, source: 'phrase-list' };

  // Kalibi olusturan kelimelerin hepsi biliniyorsa en zorundan yola cikilir.
  // Bir basamak yukari tasinir: kelimeler tek tek kolay olsa da birlestiklerinde
  // anlamlari degisir ("come across" A1 + A1 ama kalip olarak cok daha ileri).
  const parts = words.map((w) => levelOf(w));
  if (parts.some((p) => p === null)) return null;

  const hardest = (parts as CefrLevel[]).reduce((acc, level) =>
    CEFR_ORDER.indexOf(level) > CEFR_ORDER.indexOf(acc) ? level : acc
  );
  return { level: bumpLevel(hardest, 1), source: 'phrase-parts' };
}

/** Yapay zeka yanitindaki seviye etiketini dogrular. */
export function normalizeLevel(raw: unknown): CefrLevel | null {
  if (typeof raw !== 'string') return null;
  const value = raw.trim().toUpperCase();
  return CEFR_ORDER.includes(value as CefrLevel) ? (value as CefrLevel) : null;
}

/** Yapay zeka yanitindaki kart turunu dogrular. */
export function normalizeKind(raw: unknown): CardKindName | null {
  if (typeof raw !== 'string') return null;
  const value = raw.trim().toLowerCase();
  return KINDS.includes(value as CardKindName) ? (value as CardKindName) : null;
}

/**
 * Kart turu: once kalip listesi (olgusal), sonra yapay zeka, sonra bicim.
 * Tek kelimelik bir ifade her zaman "word"dur.
 */
export function resolveKind(term: string, hint?: unknown): CardKindName {
  const normalized = normalizeTerm(term);
  const words = normalized.split(' ').filter(Boolean);

  if (words.length <= 1) return 'word';
  if (isPhrasalVerb(normalized)) return 'phrasal_verb';

  const fromHint = normalizeKind(hint);
  // Model tek kelimelik olmayan bir ifadeye "word" derse duzeltilir
  if (fromHint && fromHint !== 'word') return fromHint;

  // "to be honest", "as far as I know" gibi hazir konusma kaliplari
  // collocation degil expression'dir: bir fiil obegi kurmazlar.
  const startsWithTo = term.trim().toLowerCase().startsWith('to ');
  return startsWithTo || words.length >= 4 ? 'expression' : 'collocation';
}

export interface CardMetaHints {
  /** Yapay zekanin onerdigi seviye. */
  level?: unknown;
  /** Yapay zekanin onerdigi kart turu. */
  kind?: unknown;
  /** Yapay zekanin onerdigi soz turu. */
  pos?: unknown;
  /** Ifadenin gectigi cumle — soz turu tahmininde kullanilir. */
  context?: string;
}

export interface CardMeta {
  level: CefrLevel;
  kind: CardKindName;
  pos: PartOfSpeech;
  /** Seviyenin nereden geldigi; arayuzde "otomatik" rozetini aciklamak icin. */
  levelSource: LevelSource;
}

/**
 * Bir ifade icin seviye + tur + soz turunu tek seferde belirler.
 * Kart olusturan TUM yollar (secimden ekleme, elle ekleme, ayiklama,
 * reading uygulamasi) buradan gecer ki sonuc her yerde ayni olsun.
 */
export function resolveCardMeta(term: string, hints: CardMetaHints = {}): CardMeta {
  const kind = resolveKind(term, hints.kind);
  const pos = resolvePos(term, hints.pos, { context: hints.context, kind });

  const local = localLevelOf(term);
  const fromAi = normalizeLevel(hints.level);
  const isPhrase = normalizeTerm(term).includes(' ');

  let level: CefrLevel;
  let levelSource: LevelSource;

  if (local && local.source !== 'phrase-parts') {
    // Liste kaydi kesin bilgidir
    level = local.level;
    levelSource = local.source;
  } else if (fromAi) {
    level = fromAi;
    levelSource = 'ai';
  } else if (local) {
    level = local.level;
    levelSource = local.source;
  } else {
    level = isPhrase ? UNKNOWN_PHRASE_LEVEL : UNKNOWN_WORD_LEVEL;
    levelSource = 'default';
  }

  return { level, kind, pos, levelSource };
}

/** Seviyenin nereden geldigini kullaniciya anlatan kisa metin. */
export const LEVEL_SOURCE_LABELS: Record<LevelSource, string> = {
  'word-list': 'CEFR kelime listesinden',
  'phrase-list': 'kalıp listesinden',
  'phrase-parts': 'kalıbı oluşturan kelimelerden',
  ai: 'yapay zekadan',
  default: 'listede yok, varsayılan',
};
