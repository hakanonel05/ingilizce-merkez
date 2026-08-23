/**
 * SOZ TURU (part of speech) TESPITI.
 *
 * Kart eklerken "isim mi, fiil mi, sifat mi" sorusunu kullaniciya
 * sormamak icin. Iki kaynak var:
 *
 *   1. Yapay zeka (define-word / extract-vocabulary "pos" alani) —
 *      BAGLAMA bakabildigi icin en dogru kaynak. "run" kelimesi
 *      "a long run" ve "I run" cumlelerinde farkli turdedir.
 *   2. Buradaki yerel tahmin — ag istegi yapmaz. Yapay zeka yanit
 *      vermediginde, cevrimdisi kalindiginda ve eski kartlar toplu
 *      siniflandirilirken kullanilir.
 *
 * Yerel tahmin sirasi: kapali sinif (edat/zamir/baglac gibi hic
 * degismeyen kelimeler) -> baglam ipucu -> sik kelime listesi -> ek
 * kurallari. Kapali sinif baglamdan once gelir cunku "the" her zaman
 * belirtectir; "run" ise ancak baglamdan ogrenilebilir.
 */

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'pronoun'
  | 'conjunction'
  | 'determiner'
  | 'interjection'
  | 'phrase';

export const POS_ORDER: PartOfSpeech[] = [
  'noun', 'verb', 'adjective', 'adverb', 'phrase',
  'preposition', 'pronoun', 'conjunction', 'determiner', 'interjection',
];

export const POS_LABELS_TR: Record<PartOfSpeech, string> = {
  noun: 'isim',
  verb: 'fiil',
  adjective: 'sıfat',
  adverb: 'zarf',
  phrase: 'kalıp',
  preposition: 'edat',
  pronoun: 'zamir',
  conjunction: 'bağlaç',
  determiner: 'belirteç',
  interjection: 'ünlem',
};

/**
 * Disaridan gelen tur etiketlerini normalize eder.
 * Yapay zeka "noun", sozluk verisi "n.", reading uygulamasi "phr. v"
 * yaziyor; hepsi ayni kumeye dusmeli.
 */
const POS_ALIASES: Record<string, PartOfSpeech> = {
  n: 'noun', 'n.': 'noun', noun: 'noun', nn: 'noun', isim: 'noun',
  v: 'verb', 'v.': 'verb', vb: 'verb', verb: 'verb', fiil: 'verb',
  'phr. v': 'verb', 'phr.v': 'verb', phrv: 'verb', 'phrasal verb': 'verb', phrasal_verb: 'verb',
  adj: 'adjective', 'adj.': 'adjective', adjective: 'adjective', sifat: 'adjective', 'sıfat': 'adjective',
  adv: 'adverb', 'adv.': 'adverb', adverb: 'adverb', zarf: 'adverb',
  prep: 'preposition', 'prep.': 'preposition', preposition: 'preposition', edat: 'preposition',
  pron: 'pronoun', 'pron.': 'pronoun', pronoun: 'pronoun', zamir: 'pronoun',
  conj: 'conjunction', 'conj.': 'conjunction', conjunction: 'conjunction', baglac: 'conjunction', 'bağlaç': 'conjunction',
  det: 'determiner', 'det.': 'determiner', determiner: 'determiner', article: 'determiner', belirtec: 'determiner',
  int: 'interjection', 'int.': 'interjection', interjection: 'interjection', exclamation: 'interjection', unlem: 'interjection',
  phrase: 'phrase', phr: 'phrase', 'phr.': 'phrase', idiom: 'phrase', expression: 'phrase',
  collocation: 'phrase', kalip: 'phrase', 'kalıp': 'phrase', deyim: 'phrase',
};

/** Serbest metinden tur etiketi cikarir; taninmazsa null. */
export function normalizePos(raw: unknown): PartOfSpeech | null {
  if (typeof raw !== 'string') return null;
  const key = raw.trim().toLowerCase();
  if (!key) return null;
  return POS_ALIASES[key] || null;
}

const putAll = (
  target: Record<string, PartOfSpeech>,
  pos: PartOfSpeech,
  words: string
): void => {
  for (const w of words.split(/\s+/)) if (w) target[w] = pos;
};

/**
 * KAPALI SINIF: dile yeni uyesi eklenmeyen kelimeler. Baglamdan bagimsiz
 * olarak hep ayni turdedirler, o yuzden her ipucunun onunde gelirler.
 */
const CLOSED_CLASS: Record<string, PartOfSpeech> = {};

putAll(CLOSED_CLASS, 'pronoun', `
  i you he she it we they me him her us them mine yours hers ours theirs
  myself yourself himself herself itself ourselves yourselves themselves
  who whom whoever whomever somebody someone something anybody anyone anything
  everybody everyone everything nobody nothing oneself
`);

putAll(CLOSED_CLASS, 'determiner', `
  a an the this that these those my your his its our their whose
  each every either neither another such
`);

putAll(CLOSED_CLASS, 'preposition', `
  of in on at by for with about against between into through during
  before after above below from over under off near across
  behind beyond within without upon toward towards among along around
  despite besides beside onto until till per via unlike versus amid
  throughout underneath alongside regarding concerning
`);

putAll(CLOSED_CLASS, 'conjunction', `
  and but or nor because although though whereas unless whether
`);

// "however", "therefore" gibi baglayicilar dilbilgisel olarak ZARFTIR
// (cumle baglaci degil, cumle zarfi); sozlukler de boyle etiketler.
putAll(CLOSED_CLASS, 'adverb', `
  however therefore moreover nevertheless furthermore otherwise
  consequently thus hence meanwhile besides
`);

putAll(CLOSED_CLASS, 'interjection', `
  oh ah wow hey hi hello bye ouch oops alas hmm huh yeah yep nope
`);

/**
 * SIK KULLANILAN ACIK SINIF KELIMELER.
 *
 * Ek kurallarinin yanildigi yerler icin: "study" -y ile bitiyor diye
 * sifat sanilmasin. Baglam ipucundan SONRA bakilir; baglam varsa o kazanir.
 */
const COMMON_OPEN: Record<string, PartOfSpeech> = {};

putAll(COMMON_OPEN, 'verb', `
  be am is are was were been being have has had having do does did done
  go goes went gone make made take took taken come came see saw seen
  know knew known think thought say said give gave given find found
  tell told become became leave left feel felt put bring brought
  begin began keep kept hold held write wrote written stand stood
  hear heard let mean meant meet met run ran pay paid sit sat speak spoke
  lie lay lead led read grow grew lose lost fall fell send sent build built
  understand draw drew break broke spend spent cut rise rose drive drove
  buy bought wear wore choose chose seek sought throw threw catch caught
  deal win won forget forgot eat ate teach taught sell sold fight fought
  will would can could shall should may might must ought need
  study carry try apply reply rely deny occupy imply supply enjoy destroy
  allow follow borrow show believe achieve receive happen listen open
  strengthen widen weaken frighten
`);

putAll(COMMON_OPEN, 'adjective', `
  good bad big small little large great high low long short old young
  new early late hard easy difficult important different same right wrong
  true false real sure able free full empty happy sad angry tired busy
  ready clear clean dirty fast slow strong weak rich poor cheap expensive
  hot cold warm cool dry wet safe quiet loud deep wide narrow thick thin
  heavy light dark bright nice fine close common main major minor whole
  single double local public private social human personal general special
  certain possible likely similar various recent current previous final
  entire own strange odd simple complex broad tight rough smooth sharp
`);

putAll(COMMON_OPEN, 'adverb', `
  very really quite rather too also still already always never often
  sometimes usually rarely seldom again once twice soon now then here
  there everywhere anywhere somewhere nowhere well together almost nearly
  hardly barely indeed instead perhaps maybe just even anymore
  forward backward ahead abroad indoors outdoors upstairs downstairs
`);

putAll(COMMON_OPEN, 'noun', `
  people person man woman child thing time year day week month hour
  money water food air house home school work job life world country city
  family friend problem question answer idea reason result example way
  place part number group system student teacher business company market
  government history science music movie story language word sentence
`);

/** Ek kurallari: sondaki bicimbirim turu ele verir. */
const SUFFIX_RULES: [RegExp, PartOfSpeech][] = [
  [/(tion|sion|ment|ness|ity|ance|ence|ship|hood|dom|ism|ist|ology|graphy|cracy|itude|ture)$/, 'noun'],
  [/(ous|ful|less|able|ible|ive|ic|ical|ish|like|proof|worthy|most)$/, 'adjective'],
  [/(ize|ise|ify|fy|ate|en)$/, 'verb'],
  [/(ly|ward|wards|wise)$/, 'adverb'],
  [/(ee|eer|ess|ling|let|age|ery)$/, 'noun'],
  // NOT: "-ine" bilerek yok — machine/medicine/routine isim, genuine sifat.
  // Ayirt edilemedigi icin varsayilan isme birakilir (undermine -> fiil degil
  // ama en azindan sifat da denmez).
  [/(al|ant|ent|ary|ory|ile|esque|y)$/, 'adjective'],
];

/** Kelimeden ONCE gelirse fiil oldugunu gosterenler. */
const VERB_MARKERS = new Set(
  "to will would can could shall should may might must let lets please not never".split(/\s+/)
);
/** Kelimeden ONCE gelirse sifat/zarf oldugunu gosterenler. */
const DEGREE_MARKERS = new Set(
  'very so too quite rather extremely really pretty fairly incredibly less least more most'.split(/\s+/)
);
/** "olmak" fiilleri: ardindan gelen kelime cogunlukla sifattir. */
const LINKING_VERBS = new Set(
  'be is are was were been am feel feels felt seem seems seemed look looks looked become becomes became get gets got stay stays remain remains sound sounds'.split(/\s+/)
);
/** Belirtec/iyelik: ardindan gelen kelime isim obeginin icindedir. */
const NOUN_MARKERS = new Set(
  'a an the this that these those my your his her its our their some any no every each another'.split(/\s+/)
);

/**
 * Kelimenin gectigi cumleden tur ipucu cikarir.
 * Bulamazsa null doner — emin olmadigi yerde tahmin uydurmaz.
 */
function contextClue(word: string, context: string): PartOfSpeech | null {
  const words: string[] = context.toLowerCase().match(/[a-z][a-z'-]*/g) || [];
  const index = words.indexOf(word);
  if (index < 0) return null;

  const prev = index > 0 ? words[index - 1] : '';
  const next = words[index + 1] || '';
  const isParticiple = /(ed|ing)$/.test(word);

  if (VERB_MARKERS.has(prev)) return 'verb';
  if (DEGREE_MARKERS.has(prev)) return /ly$/.test(word) ? 'adverb' : 'adjective';
  if (LINKING_VERBS.has(prev) && !isParticiple) return 'adjective';

  // "the decision was..." isim; "the quick fox" sifat. Ayirt etmek icin
  // sonraki kelimeye bakilir: o da isim obegine aitse kelime niteleyicidir.
  if (NOUN_MARKERS.has(prev)) {
    if (!next || CLOSED_CLASS[next] || COMMON_OPEN[next] === 'verb') return 'noun';
    return null; // belirsiz: karar ek kurallarina birakilir
  }

  // Onunde sifat varsa isim obeginin BASIDIR: "a long run", "the hard work"
  if (COMMON_OPEN[prev] === 'adjective' || /(ous|ful|less|able|ible|ive|ical)$/.test(prev)) {
    return 'noun';
  }

  return null;
}

export interface GuessPosOptions {
  /** Ifadenin gectigi cumle; varsa tahmini belirgin sekilde iyilestirir. */
  context?: string;
  /** Kart turu (word / phrasal_verb / idiom ...). Cok sozcuklu ifadelerde belirleyici. */
  kind?: string;
}

/**
 * Bir ifadenin soz turunu yerel olarak tahmin eder. Her zaman bir deger
 * doner; emin olunamayan durumda tek kelimede "noun", cok sozcuklu
 * ifadede "phrase" varsayilir.
 */
export function guessPos(term: string, options: GuessPosOptions = {}): PartOfSpeech {
  const cleaned = term.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!cleaned) return 'noun';

  const words = cleaned.split(' ');

  if (words.length > 1) {
    if (options.kind === 'phrasal_verb') return 'verb';
    if (words[0] === 'to' && words.length === 2) return 'verb'; // "to run"
    if (options.kind === 'idiom' || options.kind === 'expression') return 'phrase';
    // Bir fiille baslayan kaliplar fiil obegidir: "make a decision"
    if (COMMON_OPEN[words[0]] === 'verb') return 'verb';
    return 'phrase';
  }

  const word = words[0].replace(/[^a-z'-]/g, '');
  if (!word) return 'noun';

  const closed = CLOSED_CLASS[word];
  if (closed) return closed;

  if (options.context) {
    const clue = contextClue(word, options.context);
    if (clue) return clue;
  }

  const common = COMMON_OPEN[word];
  if (common) return common;

  // Cekim ekleri: bu bicimler cogunlukla fiilden gelir
  if (/ing$/.test(word) && word.length > 5) return 'verb';
  if (/ed$/.test(word) && word.length > 4) return 'verb';

  for (const [pattern, pos] of SUFFIX_RULES) {
    if (pattern.test(word)) return pos;
  }

  return 'noun';
}

/**
 * Once verilen ipucunu (yapay zeka yaniti) dener, tutmazsa yerel tahmine
 * duser. Kart olusturan her yol bu fonksiyondan gecer.
 */
export function resolvePos(
  term: string,
  hint?: unknown,
  options: GuessPosOptions = {}
): PartOfSpeech {
  return normalizePos(hint) || guessPos(term, options);
}
