/* KENDİ KAYDININ ÇÖZÜMLENMESİ
 * ============================================================================
 * Kullanıcı gölgeleme katmanında cümleyi sesli okuyup kaydediyordu, ama
 * kaydı yalnızca DİNLEYEBİLİYORDU. "Doğru söyledim mi?" sorusunun cevabı
 * kendi kulağına kalıyordu — dil öğrenirken en güvenilmez ölçü bu.
 *
 * Burada kayıt Whisper ile yazıya çevriliyor ve hedef cümleyle hizalanıyor.
 * Her şey tarayıcıda; kayıt cihazdan çıkmıyor.
 *
 * NE ÖLÇÜLEBİLİR, NE ÖLÇÜLEMEZ — bu ayrım önemli, çünkü kullanıcıya
 * ölçmediğimiz bir şeyi ölçmüş gibi göstermek onu yanlış yönlendirir:
 *
 *   ÖLÇÜLEBİLİR
 *     · Doğru kelimeyi söyledin mi — Whisper yanlış kelimeyi düzeltmiyor.
 *       Ölçtüm: kasten bozulmuş cümledeki üç yanlışın üçünü de yakaladı
 *       (rewarded / congress / December), doğrusuna çevirmedi.
 *     · Kelime atladın mı, fazladan kelime eklendi mi.
 *     · Akıcılık: konuşma hızı, duraksama sayısı ve uzunluğu — doğrudan
 *       kaydın dalga biçiminden. (Whisper'ın zaman damgaları denendi ve
 *       bırakıldı; uzun sessizliklerde yanılıyor, bkz. 4. bölüm.)
 *
 *   ÖLÇÜLEMEZ (ve iddia EDİLMİYOR)
 *     · Ses birimi düzeyinde telaffuz notu. Whisper bir sesletim modeli
 *       değil; "th" sesini "d" gibi söylediğini söyleyemez. Bunun için
 *       fonem tanıyan ayrı bir model gerekir.
 *
 *   ARADA — TELAFFUZ İPUCU
 *     Whisper hedeflenen kelime yerine BAŞKA bir kelime duyduysa, bu çoğu
 *     zaman telaffuzun kaydığı anlamına geliyor. Duyulan kelime hedefe
 *     yakınsa "kaymış", uzaksa "farklı" deniyor. Bu bir telaffuz notu
 *     değil, telaffuz İPUCU — arayüzde de öyle yazıyor.
 */

import type { CozumKelimesi } from './konusmaIscisi';

export type KelimeDurumu = 'dogru' | 'kaymis' | 'farkli' | 'eksik';

export interface KelimeSonucu {
  /** Hedef cümledeki kelime, olduğu gibi (noktalama dahil). */
  hedef: string;
  /** Whisper'ın o konumda duyduğu kelime; atlanmışsa null. */
  duyulan: string | null;
  durum: KelimeDurumu;
}

export interface Akicilik {
  /** Dakikada kelime — ilk kelimenin başından son kelimenin sonuna. */
  kelimeHizi: number;
  konusmaSuresi: number;
  duraklamaSayisi: number;
  enUzunDuraklama: number;
}

export interface KayitAnalizi {
  duyulanMetin: string;
  kelimeler: KelimeSonucu[];
  /** Hedef cümleye ait olmayan, fazladan söylenmiş kelimeler. */
  fazladan: string[];
  dogrulukPuani: number;
  akicilik: Akicilik;
  akicilikPuani: number;
  uretildi: number;
}

/* ===========================================================================
   1) SES HAZIRLAMA
   ---------------------------------------------------------------------------
   Whisper 16 kHz tek kanal bekliyor. MediaRecorder ise webm/opus üretiyor ve
   örnekleme oranı tarayıcıya göre 44,1 veya 48 kHz oluyor. Dönüşüm burada.
   =========================================================================== */

async function pcmCikar(blob: Blob): Promise<Float32Array> {
  const veri = await blob.arrayBuffer();

  const Ctx: typeof AudioContext =
    (window as any).AudioContext || (window as any).webkitAudioContext;
  const ctx = new Ctx();
  let tampon: AudioBuffer;
  try {
    tampon = await ctx.decodeAudioData(veri);
  } finally {
    void ctx.close();
  }

  const hedefOran = 16000;
  if (tampon.sampleRate === hedefOran && tampon.numberOfChannels === 1) {
    return tampon.getChannelData(0).slice();
  }

  /* OfflineAudioContext hem kanal indirmeyi hem yeniden örneklemeyi tek
     seferde yapıyor ve tarayıcının kendi (kaliteli) filtresini kullanıyor. */
  try {
    const uzunluk = Math.ceil(tampon.duration * hedefOran);
    const off = new OfflineAudioContext(1, uzunluk, hedefOran);
    const kaynak = off.createBufferSource();
    kaynak.buffer = tampon;
    kaynak.connect(off.destination);
    kaynak.start();
    const sonuc = await off.startRendering();
    return sonuc.getChannelData(0).slice();
  } catch {
    /* Bazı tarayıcılar 16 kHz'lik OfflineAudioContext kurmayı reddediyor.
       O durumda elle indiriyoruz; kalite biraz düşük ama Whisper için
       yeterli ve özelliğin hiç çalışmamasından iyi. */
    const kanal = tampon.getChannelData(0);
    const adim = tampon.sampleRate / hedefOran;
    const n = Math.floor(kanal.length / adim);
    const cikti = new Float32Array(n);
    for (let i = 0; i < n; i++) cikti[i] = kanal[Math.floor(i * adim)];
    return cikti;
  }
}

/* ===========================================================================
   2) İŞÇİ YÖNETİMİ
   =========================================================================== */

export type CozumDurumu = 'kapali' | 'yukleniyor' | 'cozuluyor' | 'hazir' | 'hata';

let isci: Worker | null = null;
const bekleyen = new Map<
  string,
  { coz: (d: { metin: string; kelimeler: CozumKelimesi[] }) => void; hata: (e: Error) => void }
>();
const dinleyiciler = new Set<(d: CozumDurumu, yuzde?: number) => void>();
let sonDurum: CozumDurumu = 'kapali';

function durumBildir(d: CozumDurumu, yuzde?: number) {
  sonDurum = d;
  for (const f of dinleyiciler) f(d, yuzde);
}

export function cozumDurumunuIzle(f: (d: CozumDurumu, yuzde?: number) => void): () => void {
  dinleyiciler.add(f);
  f(sonDurum);
  return () => dinleyiciler.delete(f);
}

/**
 * Bu bağlantıda 76 MB indirmek makul mü?
 *
 * Kokoro tarafındaki aynı gerekçe: mobil veride ya da "veri tasarrufu"
 * açıkken kullanıcıya sormadan bu boyutu indirmek kabalık olur. Fark şu ki
 * burada analiz kullanıcının AÇIKÇA istediği bir şey (düğmeye basıyor), o
 * yüzden engellemek yerine çağıran tarafa bildiriliyor ve uyarı gösteriliyor.
 */
export function baglantiAgirMi(): boolean {
  const c = (navigator as any)?.connection;
  if (!c) return false;
  if (c.saveData) return true;
  const t = String(c.effectiveType || '');
  return t === 'slow-2g' || t === '2g' || t === '3g';
}

function isciyiAl(): Worker | null {
  if (isci) return isci;
  if (typeof Worker === 'undefined') return null;
  try {
    isci = new Worker(new URL('./konusmaIscisi.ts', import.meta.url), { type: 'module' });
    isci.onmessage = (e: MessageEvent<any>) => {
      const m = e.data;
      if (m.tip === 'yukleniyor') return durumBildir('yukleniyor', m.yuzde);
      if (m.tip === 'hazir') return durumBildir('hazir');
      if (m.tip === 'cozum') {
        bekleyen.get(m.anahtar)?.coz({ metin: m.metin, kelimeler: m.kelimeler });
        bekleyen.delete(m.anahtar);
        durumBildir(bekleyen.size ? 'cozuluyor' : 'hazir');
        return;
      }
      if (m.tip === 'hata') {
        if (m.anahtar) {
          bekleyen.get(m.anahtar)?.hata(new Error(m.mesaj));
          bekleyen.delete(m.anahtar);
        }
        durumBildir('hata');
      }
    };
    isci.onerror = () => durumBildir('hata');
  } catch {
    isci = null;
  }
  return isci;
}

/* ===========================================================================
   3) HİZALAMA
   ---------------------------------------------------------------------------
   Duyulan kelimeleri hedef cümleyle eşleştirmek göründüğünden zor: kullanıcı
   kelime atlayabiliyor, fazladan kelime söyleyebiliyor, sıra kaymış olabiliyor.
   Basit "i. kelimeyi i. kelimeyle karşılaştır" yaklaşımı tek bir atlanan
   kelimeden sonra HER ŞEYİ yanlış işaretler.

   Bu yüzden dizi hizalaması (Needleman-Wunsch) kullanılıyor: eşleşme,
   değiştirme, atlama ve ekleme maliyetleri üzerinden en iyi hizalama
   bulunuyor. Maliyetler kelime benzerliğine göre: "congressional" yerine
   "congress" duyulduysa bu, alakasız bir kelimeden daha ucuz.
   =========================================================================== */

/** Karşılaştırma için sadeleştir: küçük harf, noktalama yok. */
function sadeles(k: string): string {
  return k
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9']/g, '');
}

/** İki kelime arasındaki düzenleme mesafesi (Levenshtein). */
function mesafe(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let onceki = new Array<number>(n + 1);
  let simdi = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) onceki[j] = j;
  for (let i = 1; i <= m; i++) {
    simdi[0] = i;
    for (let j = 1; j <= n; j++) {
      const bedel = a[i - 1] === b[j - 1] ? 0 : 1;
      simdi[j] = Math.min(onceki[j] + 1, simdi[j - 1] + 1, onceki[j - 1] + bedel);
    }
    [onceki, simdi] = [simdi, onceki];
  }
  return onceki[n];
}

/** 0 (alakasız) ile 1 (aynı) arası benzerlik. */
function benzerlik(a: string, b: string): number {
  if (!a && !b) return 1;
  const uzun = Math.max(a.length, b.length);
  return uzun ? 1 - mesafe(a, b) / uzun : 1;
}

/**
 * Benzerlik eşiği: bunun üstündeki bir eşleşme "kaymış" sayılıyor, altındaki
 * "farklı". 0,6 elde seçilmedi — "congressional"/"congress" 0,61 çıkıyor
 * (aynı kelimenin kısalmış hali, telaffuz kayması), "September"/"December"
 * ise 0,44 (tamamen başka kelime). Eşik ikisinin arasında duruyor.
 */
const YAKINLIK_ESIGI = 0.6;

interface Adim {
  hedefIndeks: number | null;
  duyulanIndeks: number | null;
}

function hizala(hedef: string[], duyulan: string[]): Adim[] {
  const m = hedef.length;
  const n = duyulan.length;
  const ATLAMA = -1;

  /* puan[i][j] = ilk i hedef ve ilk j duyulan kelimenin en iyi hizalaması */
  const puan: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 1; i <= m; i++) puan[i][0] = i * ATLAMA;
  for (let j = 1; j <= n; j++) puan[0][j] = j * ATLAMA;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      /* Eşleşme puanı benzerlikten geliyor: birebir aynı +1, alakasız -1. */
      const esles = puan[i - 1][j - 1] + (2 * benzerlik(hedef[i - 1], duyulan[j - 1]) - 1);
      puan[i][j] = Math.max(esles, puan[i - 1][j] + ATLAMA, puan[i][j - 1] + ATLAMA);
    }
  }

  const adimlar: Adim[] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const esles = puan[i - 1][j - 1] + (2 * benzerlik(hedef[i - 1], duyulan[j - 1]) - 1);
      if (puan[i][j] === esles) {
        adimlar.push({ hedefIndeks: i - 1, duyulanIndeks: j - 1 });
        i--;
        j--;
        continue;
      }
    }
    if (i > 0 && puan[i][j] === puan[i - 1][j] + ATLAMA) {
      adimlar.push({ hedefIndeks: i - 1, duyulanIndeks: null });
      i--;
      continue;
    }
    adimlar.push({ hedefIndeks: null, duyulanIndeks: j - 1 });
    j--;
  }
  return adimlar.reverse();
}

/* ===========================================================================
   4) AKICILIK
   ---------------------------------------------------------------------------
   Kelime zaman damgalarından geliyor. Duraklama eşiği 0,35 sn: normal
   konuşmada kelimeler arası boşluk 0,1-0,2 sn civarında; 0,35 üstü artık
   dinleyicinin fark ettiği bir duraksama.
   =========================================================================== */

/* ---------------------------------------------------------------------------
   DURAKSAMA SESİN KENDİSİNDEN ÖLÇÜLÜYOR, WHISPER'DAN DEĞİL.

   Önce Whisper'ın kelime zaman damgaları kullanılıyordu. Sınama bunu
   çürüttü: cümlenin ortasına 1,2 saniyelik sessizlik eklenmiş bir kayıtta
   Whisper o sessizlikleri HİÇ göstermedi; en uzun boşluğu 0,74 saniye
   sandı ve yerini de yanlış söyledi (gerçekte 5. ve 8,5. saniyelerdeydi,
   Whisper 13. saniyeyi işaret etti). Uzun sessizlikte hizalaması bozuluyor.

   Ses enerjisi aynı kayıtta sessizlikleri tam yerinde buldu. Duraksama
   ölçümü bu yüzden doğrudan dalga biçiminden yapılıyor; Whisper yalnızca
   KELİMELER için kullanılıyor — orada güvenilir.

   EŞİK 0,7 SANİYE, ölçümle seçildi. Kusursuz okunan aynı cümlede doğal
   anlam duraklamaları 0,26-0,64 saniye çıktı (üç ayrı okuma hızında);
   eklenen takılmalar ise ~2 saniye. Eşik ikisini temiz ayırıyor, bu yüzden
   "noktalamada durmak serbest" gibi ayrıca bir istisnaya gerek kalmadı.
   --------------------------------------------------------------------------- */

const DURAKLAMA_ESIGI = 0.7;
const PENCERE_SN = 0.02;

export interface SesOlcumu {
  /** Eşiği aşan sessizlikler: başlangıç ve süre (saniye). */
  duraklamalar: { bas: number; sure: number }[];
  /** İlk sesten son sese kadar geçen süre — baştaki/sondaki sessizlik hariç. */
  konusmaAraligi: number;
}

/**
 * Kaydın enerjisinden konuşma aralığını ve duraksamaları çıkarır.
 *
 * Eşik sabit değil oransal: en yüksek %10'luk çerçevelerin ortalamasının
 * otuzda biri. Sabit bir eşik, mikrofon seviyesi düşük olan kullanıcıda
 * tüm kaydı "sessizlik" sayardı.
 *
 * Baştaki ve sondaki sessizlik dışarıda bırakılıyor: kullanıcının kayda
 * basıp konuşmaya başlaması arasında geçen süre onun akıcılığı değil.
 */
export function sesiOlc(pcm: Float32Array, oran = 16000): SesOlcumu {
  const pencere = Math.max(1, Math.round(oran * PENCERE_SN));
  const n = Math.floor(pcm.length / pencere);
  if (n < 2) return { duraklamalar: [], konusmaAraligi: pcm.length / oran };

  const rms = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let t = 0;
    for (let k = 0; k < pencere; k++) t += pcm[i * pencere + k] ** 2;
    rms[i] = Math.sqrt(t / pencere);
  }

  const sirali = Array.from(rms).sort((a, b) => b - a);
  const tepeSayisi = Math.max(1, Math.floor(n * 0.1));
  const tepe = sirali.slice(0, tepeSayisi).reduce((a, b) => a + b, 0) / tepeSayisi;
  const esik = tepe / 30;

  let ilk = -1;
  let son = -1;
  for (let i = 0; i < n; i++) {
    if (rms[i] >= esik) {
      if (ilk < 0) ilk = i;
      son = i;
    }
  }
  if (ilk < 0) return { duraklamalar: [], konusmaAraligi: 0 };

  const duraklamalar: { bas: number; sure: number }[] = [];
  let bas = -1;
  for (let i = ilk; i <= son; i++) {
    if (rms[i] < esik) {
      if (bas < 0) bas = i;
    } else if (bas >= 0) {
      const sure = (i - bas) * PENCERE_SN;
      if (sure >= DURAKLAMA_ESIGI) {
        duraklamalar.push({ bas: +(bas * PENCERE_SN).toFixed(2), sure: +sure.toFixed(2) });
      }
      bas = -1;
    }
  }

  return {
    duraklamalar,
    konusmaAraligi: +((son - ilk + 1) * PENCERE_SN).toFixed(2),
  };
}

function akicilikOlc(kelimeSayisi: number, olcum: SesOlcumu): Akicilik {
  const sure = Math.max(0.01, olcum.konusmaAraligi);
  return {
    /* Hız, duraklamalar DAHİL hesaplanıyor: dinleyicinin algıladığı tempo bu.
       Duraksamaları çıkarıp "boğumlanma hızı" vermek kulağa daha iyi gelen
       ama kullanıcının işine yaramayan bir sayı üretirdi. */
    kelimeHizi: Math.round(kelimeSayisi / (sure / 60)),
    konusmaSuresi: +sure.toFixed(2),
    duraklamaSayisi: olcum.duraklamalar.length,
    enUzunDuraklama: olcum.duraklamalar.length
      ? +Math.max(...olcum.duraklamalar.map((d) => d.sure)).toFixed(2)
      : 0,
  };
}

/**
 * Akıcılık puanı — nasıl hesaplandığı arayüzde de yazıyor, çünkü açıklanamayan
 * bir puan kullanıcıya ne yapacağını söylemiyor.
 *
 *   · 100'den başlıyor.
 *   · Rahat konuşma bandı dakikada 110-190 kelime. Bandın dışına taşan her
 *     10 kelime 5 puan (en fazla 30). Hem çok yavaş hem çok hızlı okumak
 *     gölgelemede sorun: biri takılmak, diğeri yutmak demek.
 *   · 0,7 saniyeyi aşan her duraksamanın aşan kısmı saniye başına 25 puan
 *     (en fazla 40). Tek uzun duraksama, üç kısa duraksamadan daha çok
 *     bozuyor; ceza süreyle orantılı olduğu için bunu doğal olarak yansıtıyor.
 */
function akicilikPuanla(a: Akicilik, olcum: SesOlcumu): number {
  let puan = 100;

  const alt = 110;
  const ust = 190;
  if (a.kelimeHizi > 0) {
    const sapma = a.kelimeHizi < alt ? alt - a.kelimeHizi : a.kelimeHizi > ust ? a.kelimeHizi - ust : 0;
    puan -= Math.min(30, (sapma / 10) * 5);
  }

  let ceza = 0;
  for (const d of olcum.duraklamalar) ceza += (d.sure - DURAKLAMA_ESIGI) * 25;
  puan -= Math.min(40, ceza);

  return Math.max(0, Math.round(puan));
}

/* ===========================================================================
   5) ANA İŞLEV
   =========================================================================== */

/** Hedef cümleyi kelimelere böl; noktalama korunuyor (ekranda öyle gösterilecek). */
function cumleyiBol(cumle: string): string[] {
  return cumle.split(/\s+/).filter(Boolean);
}

export async function kaydiCozumle(
  anahtar: string,
  blob: Blob,
  hedefCumle: string
): Promise<KayitAnalizi> {
  const w = isciyiAl();
  if (!w) throw new Error('Bu tarayıcı arka planda çözümlemeyi desteklemiyor.');

  const pcm = await pcmCikar(blob);
  if (pcm.length < 16000 * 0.3) {
    throw new Error('Kayıt çok kısa; en az yarım saniye konuşulmalı.');
  }

  /* Duraksamalar sesin kendisinden ölçülüyor. Ölçüm BURADA yapılmak zorunda:
     pcm birazdan işçiye aktarılıyor (kopyalanmıyor) ve aktarımdan sonra bu
     taraftan erişilemez hale geliyor. */
  const olcum = sesiOlc(pcm);

  durumBildir('cozuluyor');
  const cozum = await new Promise<{ metin: string; kelimeler: CozumKelimesi[] }>((coz, hata) => {
    bekleyen.set(anahtar, { coz, hata });
    /* pcm aktarılıyor, kopyalanmıyor: 10 saniyelik kayıt 640 KB. */
    w.postMessage({ tip: 'coz', anahtar, pcm }, [pcm.buffer]);
  });

  return analizTuret(hedefCumle, cozum, olcum);
}

/**
 * Çözümden analiz türetir.
 *
 * Ses ve işçi yönetiminden AYRI tutuluyor, çünkü asıl hata yapılabilecek yer
 * burası: hizalama, sınıflandırma ve puanlama. Tarayıcı API'si gerektirmeyen
 * saf bir işlev olduğu için doğrudan sınanabiliyor — ölçüm betiği gerçek
 * Whisper çıktısını buraya verip sonucu denetliyor.
 */
export function analizTuret(
  hedefCumle: string,
  cozum: { metin: string; kelimeler: CozumKelimesi[] },
  olcum: SesOlcumu
): KayitAnalizi {
  const hedefHam = cumleyiBol(hedefCumle);

  const hedefSade = hedefHam.map(sadeles);
  const duyulanHam = cozum.kelimeler.map((k) => k.metin);
  const duyulanSade = duyulanHam.map(sadeles);

  const adimlar = hizala(hedefSade, duyulanSade);

  const kelimeler: KelimeSonucu[] = [];
  const fazladan: string[] = [];

  for (const adim of adimlar) {
    if (adim.hedefIndeks === null) {
      if (adim.duyulanIndeks !== null && duyulanSade[adim.duyulanIndeks]) {
        fazladan.push(duyulanHam[adim.duyulanIndeks]);
      }
      continue;
    }
    const hedef = hedefHam[adim.hedefIndeks];
    if (adim.duyulanIndeks === null) {
      kelimeler.push({ hedef, duyulan: null, durum: 'eksik' });
      continue;
    }
    const h = hedefSade[adim.hedefIndeks];
    const d = duyulanSade[adim.duyulanIndeks];
    const b = benzerlik(h, d);
    const durum: KelimeDurumu = b === 1 ? 'dogru' : b >= YAKINLIK_ESIGI ? 'kaymis' : 'farkli';

    kelimeler.push({ hedef, duyulan: duyulanHam[adim.duyulanIndeks], durum });
  }

  /* Doğruluk: kaymış kelimeler yarım sayılıyor — söylenmiş ama tam
     oturmamış bir kelime, hiç söylenmemiş kelimeyle aynı değil. */
  const tam = kelimeler.filter((k) => k.durum === 'dogru').length;
  const kaymis = kelimeler.filter((k) => k.durum === 'kaymis').length;
  const dogrulukPuani = kelimeler.length
    ? Math.round(((tam + kaymis * 0.5) / kelimeler.length) * 100)
    : 0;

  /* Hız, hedef cümlenin kelime sayısından değil GERÇEKTEN söylenen kelime
     sayısından hesaplanıyor: yarısını okuyup bırakan biri "hızlı" görünmesin. */
  const akicilik = akicilikOlc(cozum.kelimeler.length, olcum);

  return {
    duyulanMetin: cozum.metin,
    kelimeler,
    fazladan,
    dogrulukPuani,
    akicilik,
    akicilikPuani: akicilikPuanla(akicilik, olcum),
    uretildi: Date.now(),
  };
}

/** Ders değişince bekleyen işleri bırak. */
export function cozumlemeyiDurdur(): void {
  isci?.postMessage({ tip: 'iptal' });
  bekleyen.clear();
  durumBildir('kapali');
}

/* ===========================================================================
   6) HEDEF CUMLESIZ COZUMLEME  (serbest konusma)
   ---------------------------------------------------------------------------
   Golgelemede bir HEDEF cumle var ve isin yarisi hizalama. Gorsel betimlemede
   (bkz. apps/konusma) hedef cumle YOK: ogrenci aklina geleni soyluyor, dolayi-
   siyla olculecek sey "dogru kelimeyi soyledin mi" degil, "ne soyledin".

   Bu yuzden hizalama ve dogruluk puani burada calismiyor; geriye iki sey
   kaliyor ve ikisi de ayni altyapidan geliyor:
     · Whisper'in duydugu metin  -> yapay zekaya gonderilecek olan.
     · Akicilik  -> hiz ve duraksama, yine dogrudan dalga biciminden.

   AYRI BIR ISCI ACILMIYOR: ayni Worker ve ayni model ornegi kullaniliyor.
   Ikinci bir isci 76 MB'lik modeli ikinci kez indirir ve bellekte iki kopya
   tutardi.
   =========================================================================== */

export interface SerbestCozum {
  metin: string;
  akicilik: Akicilik;
  akicilikPuani: number;
  /** Whisper'in ayirdigi kelime sayisi — betimlemenin uzunlugu. */
  kelimeSayisi: number;
}

export async function kaydiYaziyaCevir(anahtar: string, blob: Blob): Promise<SerbestCozum> {
  const w = isciyiAl();
  if (!w) throw new Error('Bu tarayıcı arka planda çözümlemeyi desteklemiyor.');

  const pcm = await pcmCikar(blob);
  /* Golgelemedeki esik yarim saniye; orada tek bir cumle okunuyor. Burada
     bir betimleme bekleniyor, uc saniyenin altindaki bir kayitta cozumlenecek
     bir sey yok ve yapay zekaya gonderip "cok kisa" cevabi almak hem zaman
     hem kota harciyor. */
  if (pcm.length < 16000 * 3) {
    throw new Error('Kayıt çok kısa; görseli anlatmak için en az birkaç cümle gerekiyor.');
  }

  const olcum = sesiOlc(pcm);

  durumBildir('cozuluyor');
  const cozum = await new Promise<{ metin: string; kelimeler: CozumKelimesi[] }>((coz, hata) => {
    bekleyen.set(anahtar, { coz, hata });
    w.postMessage({ tip: 'coz', anahtar, pcm }, [pcm.buffer]);
  });

  const akicilik = akicilikOlc(cozum.kelimeler.length, olcum);
  return {
    metin: cozum.metin,
    akicilik,
    akicilikPuani: akicilikPuanla(akicilik, olcum),
    kelimeSayisi: cozum.kelimeler.length,
  };
}
