/* IPA SÖZLÜĞÜ VE FONETİK YARDIMCILARI
 *
 * KAYNAK: AI Studio'da ayrı bir uygulama olarak geliştirilen telaffuz
 * değerlendirme projesinden taşındı (pronunciation-assessment-ai).
 * İKİ YERİ DEĞİŞTİ:
 *   1. Sözlüğe Türkçe konuşanın zorlandığı sesler eklendi (37 -> 81).
 *   2. Bilinmeyen kelime için IPA UYDURAN yedek kaldırıldı; gerekçesi ve
 *      ölçülen örnekler getFallbackIpa'in başında.
 */


export interface WordPhoneticEntry {
  ipa: string;
  stress?: string;
  tip?: string;
}

const TASINAN_SOZLUK: Record<string, WordPhoneticEntry> = {
  plausibility: {
    ipa: "/ˌplɔː.zəˈbɪl.ə.ti/",
    stress: "3. hece ('bil')",
    tip: "Birincil vurgu /bɪl/ hecesindedir. Başlangıçtaki /plɔː/ sesi yuvarlak dudakla açık söylenmeli.",
  },
  explanation: {
    ipa: "/ˌek.spləˈneɪ.ʃən/",
    stress: "3. hece ('nay')",
    tip: "/neɪ/ diftongu net duyurulmalı, son hecedeki /ʃən/ nötr (schwa) okunmalı.",
  },
  thought: {
    ipa: "/θɔːt/",
    stress: "Tek hece",
    tip: "Dil ucu üst dişlerin arasına değdirilerek peltek /θ/ çıkarılmalı, 'tot' veya 'sot' denmemeli.",
  },
  literally: {
    ipa: "/ˈlɪt.ər.əl.i/",
    stress: "1. hece ('lit')",
    tip: "İlk heceye kuvvetli vurgu verilir, ara heceler akıcı biçimde bağlanmalı.",
  },
  rural: {
    ipa: "/ˈrʊə.rəl/",
    stress: "1. hece ('roo')",
    tip: "Çift /r/ ve /l/ geçişi: Dil damağa değmeden geriye çekilip /l/ sesinde damağa dokundurulmalı.",
  },
  jury: {
    ipa: "/ˈdʒʊə.ri/",
    stress: "1. hece ('ju')",
    tip: "/dʒ/ patlamalı sesinden sonra pürüzsüz /r/ sesine geçilmeli.",
  },
  rarely: {
    ipa: "/ˈreə.li/",
    stress: "1. hece ('rare')",
    tip: "/r/ ve /l/ sesleri birbirine karıştırılmamalı, son /li/ hecesi net duyulmalı.",
  },
  comfortable: {
    ipa: "/ˈkʌm.fət.ə.bəl/",
    stress: "1. hece ('kum')",
    tip: "Genellikle 3 heceli olarak /ˈkʌmf.tə.bəl/ şeklinde okunur, 'kom-for-tey-bıl' denmemeli.",
  },
  comfortably: {
    ipa: "/ˈkʌm.fət.ə.bli/",
    stress: "1. hece ('kum')",
    tip: "/f/ ve /t/ sesleri ardışık olarak hafifçe bağlanır, vurgu en başta olmalı.",
  },
  preliminary: {
    ipa: "/prɪˈlɪm.ɪ.nər.i/",
    stress: "2. hece ('lim')",
    tip: "Vurgu /lɪm/ hecesindedir. 'pre' hecesi kısa ve zayıf /prɪ/ olarak okunur.",
  },
  evaluation: {
    ipa: "/ɪˌvæl.juˈeɪ.ʃən/",
    stress: "4. hece ('ay')",
    tip: "Birincil vurgu /eɪ/ hecesindedir. /væl/ hecesinde ikincil vurgu bulunur.",
  },
  primary: {
    ipa: "/ˈpraɪ.mər.i/",
    stress: "1. hece ('pry')",
    tip: "İlk hecede /aɪ/ çift ünlüsü net duyulmalı.",
  },
  objective: {
    ipa: "/əbˈdʒek.tɪv/",
    stress: "2. hece ('jec')",
    tip: "Başlangıçtaki /əb/ schwa sesidir. Vurgu /dʒek/ hecesine verilmelidir.",
  },
  optimize: {
    ipa: "/ˈɒp.tɪ.maɪz/",
    stress: "1. hece ('op')",
    tip: "Vurgu ilk hecede. Sondaki /z/ sesi ötümlü titreşmelidir.",
  },
  operational: {
    ipa: "/ˌɒp.ərˈeɪ.ʃən.əl/",
    stress: "3. hece ('ray')",
    tip: "/eɪ/ diftonguna kuvvetli vurgu yapılmalı.",
  },
  efficiency: {
    ipa: "/ɪˈfɪʃ.ən.si/",
    stress: "2. hece ('fish')",
    tip: "/fɪʃ/ hecesi vurgulu, son iki hece /ən.si/ hafif olmalı.",
  },
  sustainable: {
    ipa: "/səˈsteɪ.nə.bəl/",
    stress: "2. hece ('stay')",
    tip: "İlk /sə/ sesi zayıf, /steɪ/ hecesi belirgin vurgulanmalıdır.",
  },
  quarterly: {
    ipa: "/ˈkwɔː.təl.i/",
    stress: "1. hece ('kwar')",
    tip: "/kw/ dudak yuvarlamasıyla başlar.",
  },
  revenue: {
    ipa: "/ˈrev.ən.juː/",
    stress: "1. hece ('rev')",
    tip: "Vurgu ilk hecededir, son hece /juː/ şeklinde telaffuz edilir.",
  },
  croissant: {
    ipa: "/ˈkwæs.ɒ̃/",
    stress: "1. hece ('kwass')",
    tip: "Fransızca kökenlidir, 'kro-y-sant' yerine /ˈkwæs.ɒ̃/ veya /krəˈsɑːnt/ olarak sesletilir.",
  },
  woodchuck: {
    ipa: "/ˈwʊd.tʃʌk/",
    stress: "1. hece ('wood')",
    tip: "Kısa /ʊ/ ünlüsü (book gibi) ve /tʃ/ patlamalı sesi net çıkarılmalıdır.",
  },
  picked: {
    ipa: "/pɪkt/",
    stress: "Tek hece",
    tip: "Sondaki -ed eki /t/ olarak sesletilir ('pikt').",
  },
  peppers: {
    ipa: "/ˈpep.əz/",
    stress: "1. hece ('pep')",
    tip: "Aspirasyonlu /p/ ile başlar, sondaki -s /z/ olarak titreşir.",
  },
  weather: {
    ipa: "/ˈweð.ər/",
    stress: "1. hece ('weth')",
    tip: "Ötümlü peltek /ð/ sesi: Ses telleri titreşerek dil dişlerin arasından geçer.",
  },
  meteorological: {
    ipa: "/ˌmiː.ti.ə.rəˈlɒdʒ.ɪ.kəl/",
    stress: "5. hece ('loj')",
    tip: "Çok heceli ritim: Ana vurgu /ˈlɒdʒ/ hecesindedir.",
  },
  forecast: {
    ipa: "/ˈfɔː.kɑːst/",
    stress: "1. hece ('for')",
    tip: "İlk hece uzatılarak /fɔː/ okunur.",
  },
  thunderstorms: {
    ipa: "/ˈθʌn.də.stɔːmz/",
    stress: "1. hece ('thun')",
    tip: "Ötümsüz /θ/ ile başlar, /stɔːmz/ birleşik hecesiyle tamamlanır.",
  },
  pronunciation: {
    ipa: "/prəˌnʌn.siˈeɪ.ʃən/",
    stress: "4. hece ('ay')",
    tip: "'pro-noun-ce' değil, 'pro-NUN-ci-a-tion' şeklinde /nʌn/ ile söylenir.",
  },
  fluency: {
    ipa: "/ˈfluː.ən.si/",
    stress: "1. hece ('floo')",
    tip: "İlk hecede uzun /uː/ ünlüsü bulunur.",
  },
  schedule: {
    ipa: "/ˈskedʒ.uːl/ (US) / /ˈʃedʒ.uːl/ (UK)",
    stress: "1. hece ('sked')",
    tip: "Amerikan aksanında /skedʒ.uːl/, İngiliz aksanında /ˈʃedʒ.uːl/ tercih edilir.",
  },
  specifically: {
    ipa: "/spəˈsɪf.ɪ.kli/",
    stress: "2. hece ('sif')",
    tip: "Vurgu /sɪf/ hecesindedir. 4 heceli akış korunmalıdır.",
  },
  question: {
    ipa: "/ˈkwes.tʃən/",
    stress: "1. hece ('kwes')",
    tip: "'t' harfi /tʃ/ (ç) sesine dönüşür: /ˈkwes.tʃən/.",
  },
  walk: {
    ipa: "/wɔːk/",
    stress: "Tek hece",
    tip: "'L' harfi sessizdir! Kesinlikle 'volk' denmemeli, yuvarlak /wɔːk/ sesletilmelidir.",
  },
  outside: {
    ipa: "/ˌaʊtˈsaɪd/",
    stress: "2. hece ('side')",
    tip: "Ana vurgu /saɪd/ hecesindedir, /aʊ/ diftongu temiz duyulmalıdır.",
  },
  morning: {
    ipa: "/ˈmɔː.nɪŋ/",
    stress: "1. hece ('mor')",
    tip: "Sondaki 'ng' genizsel /ŋ/ sesidir, 'g' harfi patlatılmamalıdır.",
  },
  taking: {
    ipa: "/ˈteɪ.kɪŋ/",
    stress: "1. hece ('tay')",
    tip: "/eɪ/ diftongu ile başlar, sonu /ɪŋ/ olarak bağlanır.",
  },
  great: {
    ipa: "/ɡreɪt/",
    stress: "Tek hece",
    tip: "/eɪ/ çift seslidir ('greyt').",
  },
};


/* TÜRKÇE KONUŞANIN ZORLANDIĞI SESLER
 *
 * Taşınan sözlükte 37 kelime vardı ve hepsi örnek cümlelerden geliyordu.
 * Buradakiler bir metinden değil, TÜRKÇENİN SES ENVANTERİNDEN seçildi —
 * Türkçede karşılığı olmayan ya da yakın bir sese kayan fonemler:
 *
 *   /θ/ /ð/  Türkçede yok; "t/s" ve "d/z" gibi söyleniyor
 *   /w/ /v/  Türkçede tek ses; "west" ve "vest" ayrışmıyor
 *   /ɜːr/    "work, world, girl" — Türkçede yuvarlak "ö"ye kayıyor
 *   /æ/ /e/  "bad" ile "bed" ayrımı
 *   /ŋ/      "-ing" sonunda "-ing" diye okunuyor, /ŋ/ tek ses
 *   sessiz harfler  island, listen, castle, receipt…
 *
 * Vurgusu yanlış öğrenilen çok heceli kelimeler de burada.
 * Yazımlar Genel Amerikan İngilizcesi (en-US).
 */
const TURKCE_ZORLUKLARI: Record<string, WordPhoneticEntry> = {
  // --- /θ/ ve /ð/ ---
  through: { ipa: '/θruː/', stress: 'Tek hece', tip: 'Dil ucu dişler arasında /θ/, ardından yuvarlak /uː/. "true" değil.' },
  three: { ipa: '/θriː/', stress: 'Tek hece', tip: '/θ/ ile başlar; "tree" (ağaç) ile karışmasın.' },
  think: { ipa: '/θɪŋk/', stress: 'Tek hece', tip: 'Baştaki /θ/ peltek, sondaki /ŋk/ genizden. "sink" değil.' },
  thirty: { ipa: '/ˈθɜːr.ti/', stress: '1. hece', tip: '/θ/ + /ɜːr/ birlikte geliyor; ikisi de Türkçede yok.' },
  clothes: { ipa: '/kloʊðz/', stress: 'Tek hece', tip: 'Sondaki /ðz/ tek nefeste; "clothe-es" diye iki hece yapılmaz.' },
  months: { ipa: '/mʌnθs/', stress: 'Tek hece', tip: '/nθs/ üçlüsü zor: dil ucunu dişlere getirip kaydırın.' },
  together: { ipa: '/təˈɡeð.ər/', stress: '2. hece', tip: 'Ortadaki /ð/ ötümlü peltek; "tugeder" olmamalı.' },
  weather: { ipa: '/ˈweð.ər/', stress: '1. hece', tip: '/ð/ ötümlü; "weder" değil.' },
  although: { ipa: '/ɔːlˈðoʊ/', stress: '2. hece', tip: 'Sonda /ðoʊ/; "although" içindeki gh okunmaz.' },

  // --- /w/ ve /v/ ---
  very: { ipa: '/ˈver.i/', stress: '1. hece', tip: 'Üst dişler alt dudağa değer (/v/). "wery" olmamalı.' },
  west: { ipa: '/west/', stress: 'Tek hece', tip: 'Dudaklar yuvarlak, dişler dudağa DEĞMEZ (/w/).' },
  vest: { ipa: '/vest/', stress: 'Tek hece', tip: '"west" ile farkı /v/: üst dişler alt dudakta.' },
  world: { ipa: '/wɜːrld/', stress: 'Tek hece', tip: '/w/ ile başlar, /ɜːr/ ortada; "vörld" değil.' },
  wine: { ipa: '/waɪn/', stress: 'Tek hece', tip: '/w/ dudakla, /v/ ile karıştırmayın ("vine" = asma).' },

  // --- /ɜːr/ ---
  work: { ipa: '/wɜːrk/', stress: 'Tek hece', tip: 'Dil ortada ve geride; Türkçedeki "ö" gibi yuvarlanmaz.' },
  word: { ipa: '/wɜːrd/', stress: 'Tek hece', tip: '"world" ile karışmasın: burada /l/ yok.' },
  girl: { ipa: '/ɡɜːrl/', stress: 'Tek hece', tip: '/ɜːr/ + /l/; "görl" değil, dudak yayılmadan.' },
  early: { ipa: '/ˈɜːr.li/', stress: '1. hece', tip: 'Baştaki ünlü /ɜːr/; "erli" değil.' },
  learn: { ipa: '/lɜːrn/', stress: 'Tek hece', tip: '"lörn" değil; dil geride, dudak yayılmaz.' },
  determine: { ipa: '/dɪˈtɜːr.mɪn/', stress: '2. hece', tip: 'Vurgu ortada ve /ɜːr/ orada; son hece zayıf.' },

  // --- /æ/ ve /e/ ---
  bad: { ipa: '/bæd/', stress: 'Tek hece', tip: 'Ağız "a"dan geniş açılır; "bed" ile ayrışmalı.' },
  man: { ipa: '/mæn/', stress: 'Tek hece', tip: '/æ/ Türkçe "e" ile "a" arasında, ikisine de eşit uzak.' },
  happy: { ipa: '/ˈhæp.i/', stress: '1. hece', tip: 'İlk hecede /æ/, "hepi" değil.' },

  // --- sessiz harfler ---
  island: { ipa: '/ˈaɪ.lənd/', stress: '1. hece', tip: 'Baştaki "s" OKUNMAZ.' },
  listen: { ipa: '/ˈlɪs.ən/', stress: '1. hece', tip: 'Ortadaki "t" okunmaz.' },
  castle: { ipa: '/ˈkæs.əl/', stress: '1. hece', tip: '"t" okunmaz; "kasıl" gibi biter.' },
  answer: { ipa: '/ˈæn.sər/', stress: '1. hece', tip: '"w" okunmaz.' },
  receipt: { ipa: '/rɪˈsiːt/', stress: '2. hece', tip: '"p" okunmaz; "risiit".' },
  knowledge: { ipa: '/ˈnɑː.lɪdʒ/', stress: '1. hece', tip: 'Baştaki "k" okunmaz, ünlü açık /ɑː/.' },
  wednesday: { ipa: '/ˈwenz.deɪ/', stress: '1. hece', tip: 'Ortadaki "d" okunmaz: iki hece.' },
  business: { ipa: '/ˈbɪz.nəs/', stress: '1. hece', tip: 'İKİ hece; ortadaki "i" düşer.' },
  comfortable: { ipa: '/ˈkʌmf.tər.bəl/', stress: '1. hece', tip: 'Üç hece; "kom-for-tey-bıl" değil.' },
  vegetable: { ipa: '/ˈvedʒ.tə.bəl/', stress: '1. hece', tip: 'Üç hece; ikinci "e" düşer.' },
  chocolate: { ipa: '/ˈtʃɑːk.lət/', stress: '1. hece', tip: 'İKİ hece; ortadaki "o" düşer.' },
  restaurant: { ipa: '/ˈres.trɑːnt/', stress: '1. hece', tip: 'İki hece; "res-tı-rant" değil.' },
  often: { ipa: '/ˈɔː.fən/', stress: '1. hece', tip: '"t" genellikle okunmaz.' },

  // --- vurgu yanlış öğrenilenler ---
  develop: { ipa: '/dɪˈvel.əp/', stress: '2. hece', tip: 'Vurgu ORTADA; ilk hece zayıf /dɪ/.' },
  available: { ipa: '/əˈveɪ.lə.bəl/', stress: '2. hece', tip: 'Vurgu "vey" hecesinde, baş hece schwa.' },
  opportunity: { ipa: '/ˌɑː.pərˈtuː.nə.ti/', stress: '3. hece', tip: 'Birincil vurgu "tu" hecesinde.' },
  university: { ipa: '/ˌjuː.nɪˈvɜːr.sə.ti/', stress: '3. hece', tip: '/j/ ile başlar ("yu"), vurgu "vör" hecesinde.' },
  suggest: { ipa: '/səˈdʒest/', stress: '2. hece', tip: 'Baş hece zayıf; "sag-gest" değil.' },
  europe: { ipa: '/ˈjʊr.əp/', stress: '1. hece', tip: '/j/ ile başlar: "yurıp".' },
  women: { ipa: '/ˈwɪm.ɪn/', stress: '1. hece', tip: 'İlk hecede /ɪ/ — "vumın" değil.' },
  busy: { ipa: '/ˈbɪz.i/', stress: '1. hece', tip: '"bizi" gibi; "byuzi" değil.' },
  height: { ipa: '/haɪt/', stress: 'Tek hece', tip: '"weight" ile kafiyeli DEĞİL; /aɪ/ sesi var.' },
  schedule: { ipa: '/ˈskedʒ.uːl/', stress: '1. hece', tip: 'Amerikan söyleyişinde /sk/ ile başlar.' },

  // --- /ŋ/ ---
  something: { ipa: '/ˈsʌm.θɪŋ/', stress: '1. hece', tip: 'Sonda /ŋ/ tek ses; "-ing" diye "g" eklenmez.' },
  morning: { ipa: '/ˈmɔːr.nɪŋ/', stress: '1. hece', tip: 'Son /ŋ/ genizden, ayrı bir "g" duyulmaz.' },
};

/* İki sözlük birleşiyor. Taşınan kayıtlar önce yazılıyor ki buradaki
   düzeltmeler onların üstüne binebilsin. */
export const COMMON_IPA_DICT: Record<string, WordPhoneticEntry> = {
  ...TASINAN_SOZLUK,
  ...TURKCE_ZORLUKLARI,
};

/** Arama anahtarına indirger: küçük harf, noktalama yok. */
export function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Generates an approximate IPA transcription for unknown English words using phonetic heuristics
 */
/**
 * Sözlükte olmayan kelime için IPA — ARTIK UYDURULMUYOR, BOŞ DÖNÜYOR.
 *
 * Özgün sürüm harf değiştirerek "yaklaşık bir IPA" üretiyordu. Ölçtüm,
 * ürettiği şey IPA bile değildi:
 *
 *   through    -> /θrɔː/        yanlış (doğrusu /θruː/)
 *   island     -> /island/      yazılışın kendisi
 *   business   -> /business/    aynı
 *   knowledge  -> /knaʊledge/   aynı
 *
 * Telaffuz öğreten bir ekranda uydurulmuş okunuş, yanlış puandan daha
 * zararlı: öğrenci onu ezberleyip yanlış söylemeye BAŞLAR. "Bilmiyorum"
 * demek her zaman daha iyi ve arayüz bunu gösteriyor.
 *
 * NEDEN CMUdict GÖMÜLMEDİ: 134 bin kelimelik sözlük ham hâlde ~3,6 MB.
 * Bu yol NADİREN işliyor — kelime cümlede hatalı işaretlenmiş AMA model
 * önerilerde IPA vermemişse. Modelin verdiği IPA zaten önceliklı
 * (bkz. telaffuzRaporu.ts, matchedSuggestion.ipa). Nadir bir durum için
 * her açılışa megabaytlar bindirmek orantısız; sözlük bunun yerine
 * TÜRKÇE KONUŞANIN zorlandığı seslerle elle genişletildi.
 */
export function getFallbackIpa(word: string): string {
  const clean = normalizeWord(word);
  if (!clean) return "";
  return COMMON_IPA_DICT[clean]?.ipa ?? "";
}

/**
 * Returns phonetic detail (IPA + tip) for a given word
 */
export function getWordPhonetics(
  word: string,
  customSuggestionNotes?: string
): { ipa: string; stress?: string; tip: string; isKnown: boolean } {
  const clean = normalizeWord(word);
  const dictEntry = COMMON_IPA_DICT[clean];

  if (dictEntry) {
    return {
      ipa: dictEntry.ipa,
      stress: dictEntry.stress,
      tip: customSuggestionNotes || dictEntry.tip || "Fonem ayrımına ve hece vurgusuna dikkat ediniz.",
      isKnown: true,
    };
  }

  const fallbackIpa = getFallbackIpa(word);
  return {
    ipa: fallbackIpa,
    tip:
      customSuggestionNotes ||
      "Kelimenin vurgusunu netleştirip, ünlü ve ünsüz fonemleri tam artiküle ederek tekrar okuyun.",
    isKnown: false,
  };
}
