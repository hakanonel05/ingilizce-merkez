import express from "express";
import path from "path";
// NOT: vite yalnizca gelistirme modunda gerekli. Statik import birakilirsa
// Netlify fonksiyon paketine tum Vite girer. Bu yuzden startServer() icinde
// dinamik olarak yukleniyor.
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { YoutubeTranscript } from "youtube-transcript";
import { AsyncLocalStorage } from "async_hooks";

dotenv.config();

// Helper to extract 11-char YouTube ID
function extractYouTubeId(urlOrText: string): string {
  if (!urlOrText) return '';
  const trimmed = urlOrText.trim();
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/i);
  return (match && match[1]) ? match[1] : '';
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

/* ============================================================
   KULLANICI API ANAHTARLARI
   ------------------------------------------------------------
   Anahtarlar eskiden yalnizca sunucunun ortam degiskenlerinden
   okunuyordu; yani siteyi kim kullanirsa kullansin fatura site
   sahibine cikiyordu. Artik istemci kendi anahtarlarini baslikla
   gonderebiliyor ve o istek boyunca onlar kullaniliyor.

   Anahtarlar istek basina AsyncLocalStorage'da tutuluyor: her
   process.env okumasini fonksiyon imzalarindan tasimak yerine tek
   noktada cozuyoruz ve es zamanli isteklerin anahtarlari birbirine
   karismiyor.

   GERIYE DONUK UYUMLU: kullanici anahtar gondermezse ortam
   degiskeni kullanilir, yani mevcut davranis aynen korunur.
   ============================================================ */

interface UserKeys {
  gemini?: string;
  groq?: string;
  transcript?: string;
  libre?: string;
}

const userKeyStore = new AsyncLocalStorage<UserKeys>();

/** Once istegi yapan kullanicinin anahtari, yoksa sunucunun ortam degiskeni. */
function resolveKey(which: keyof UserKeys, envName: string): string {
  const fromUser = userKeyStore.getStore()?.[which];
  if (typeof fromUser === 'string' && fromUser.trim()) return fromUser.trim();
  return process.env[envName] || '';
}

function readKeyHeader(req: express.Request, name: string): string | undefined {
  const value = req.get(name);
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

// Anahtarlari istek baglamina koy. Deger ASLA loglanmaz.
app.use((req, _res, next) => {
  userKeyStore.run(
    {
      gemini: readKeyHeader(req, 'x-user-gemini-key'),
      groq: readKeyHeader(req, 'x-user-groq-key'),
      transcript: readKeyHeader(req, 'x-user-transcript-token'),
      libre: readKeyHeader(req, 'x-user-libretranslate-key'),
    },
    () => next()
  );
});

/**
 * Sunucunun hangi anahtarlara sahip oldugunu bildirir; boylece ayarlar
 * ekrani kullaniciya "bunu girmen sart" diyebilir.
 * YALNIZCA true/false doner, anahtarin kendisi asla disari verilmez.
 */
app.get("/api/settings/status", (_req, res) => {
  res.json({
    server: {
      gemini: !!process.env.GEMINI_API_KEY,
      groq: !!process.env.GROQ_API_KEY,
      transcript: !!process.env.YOUTUBE_TRANSCRIPT_IO_TOKEN,
      libre: !!process.env.LIBRETRANSLATE_API_KEY,
    },
  });
});

/* ============================================================
   YOUTUBE ALTYAZI (CUE) İŞLEME
   ------------------------------------------------------------
   KRİTİK NOT: youtube-transcript kütüphanesi iki farklı XML
   formatı parse ediyor:
     - srv3   <p t="65000" d="3000">        -> offset MİLİSANİYE
     - klasik <text start="65.0" dur="3.0"> -> offset SANİYE
   Eski kod her ikisini de saniye sayıyordu; 1:05'teki bir cümle
   1083:20 olarak damgalanıyor ve senkronizasyon tamamen bozuluyordu.
   ============================================================ */

interface Cue {
  text: string;
  startSec: number;
  endSec: number;
}

interface BuiltSentence {
  id: number;
  en: string;
  startSec?: number;
  endSec?: number;
  timestamp?: string;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

/** Cue listesinin birimini tespit edip her zaman SANİYE'ye normalize eder. */
function normalizeCues(items: any[]): Cue[] {
  const offsets = items.map((i) => Number(i.offset) || 0);
  const durations = items.map((i) => Number(i.duration) || 0);

  const allIntegerOffsets = offsets.every((o) => Number.isInteger(o));
  const sortedDur = [...durations].sort((a, b) => a - b);
  const medianDuration = sortedDur[Math.floor(sortedDur.length / 2)] || 0;
  const maxOffset = offsets.length ? Math.max(...offsets) : 0;

  // Bir altyazı satırı 100 saniye sürmez, 10 saatlik offset de olmaz -> ms demektir.
  const looksLikeMilliseconds =
    (allIntegerOffsets && medianDuration > 100) || maxOffset > 36000;

  const divisor = looksLikeMilliseconds ? 1000 : 1;

  console.log(
    `[Transcript] ${items.length} cue alindi. Birim: ${looksLikeMilliseconds ? 'MILISANIYE' : 'SANIYE'} (medyan sure: ${medianDuration})`
  );

  const cues: Cue[] = [];
  for (const item of items) {
    const rawText = decodeEntities(String(item.text || '')).replace(/\s+/g, ' ').trim();
    if (!rawText) continue;

    const startSec = (Number(item.offset) || 0) / divisor;
    const durSec = (Number(item.duration) || 0) / divisor;

    cues.push({
      text: rawText,
      startSec: Math.max(0, startSec),
      endSec: Math.max(0, startSec + (durSec > 0 ? durSec : 2)),
    });
  }

  cues.sort((a, b) => a.startSec - b.startSec);
  return cues;
}

/** İngilizce altyazıyı dil tercihine göre sırayla dener. */
/* ------------------------------------------------------------
   ALTYAZI KAYNAGI
   CAPTION_PROVIDER ortam degiskeni:
     - "auto"   (varsayilan) -> once dogrudan YouTube, olmazsa harici API
     - "direct" -> sadece dogrudan YouTube (youtube-transcript kutuphanesi)
     - "api"    -> sadece youtube-transcript.io
   YouTube, Netlify/Lambda gibi veri merkezi IP'lerini engelledigi icin
   bulutta "direct" yolu calismayabilir. Harici API kendi proxy havuzunu
   kullandigindan bu engeli asar.
   ------------------------------------------------------------ */

const CAPTION_PROVIDER = (process.env.CAPTION_PROVIDER || 'auto').toLowerCase();

/**
 * Gelen JSON'un icinde altyazi parcalarindan olusan TUM dizileri toplar.
 * youtube-transcript.io yanit semasini belgelemedigi icin sema tahmin
 * etmek yerine, "metin + baslangic zamani" iceren dizileri ariyoruz.
 * Bu sayede saglayici formatini degistirse de kod calismaya devam eder.
 *
 * KRITIK: Saglayici ayni video icin BIRDEN COK dil parcasi dondurur ve
 * istekte dil belirtilemiyor (API yalnizca "ids" aliyor). Eskiden bulunan
 * ILK dizi kullaniliyordu; TED gibi cok dilli videolarda bu Arnavutca gibi
 * rastgele bir parca demekti ve ders "Ingilizce" adi altinda yabanci dille
 * olusuyordu. Artik parcalar dil etiketiyle toplanip Ingilizce olan secilir.
 */
interface TranscriptTrack {
  segments: any[];
  language: string;
}

const LANGUAGE_KEYS = new Set([
  'language', 'languagecode', 'languagename', 'lang', 'langcode', 'tracklanguage',
]);

/** Bir nesnenin uzerindeki dil etiketini (varsa) okur. */
function readLanguageHint(node: any): string {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return '';
  for (const key of Object.keys(node)) {
    if (LANGUAGE_KEYS.has(key.toLowerCase())) {
      const value = node[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
  }
  return '';
}

/** Dizinin altyazi parcalarindan olusup olusmadigini anlar. */
function looksLikeSegments(node: any[]): boolean {
  return (
    node.length > 0 &&
    node.every(
      (item) =>
        item &&
        typeof item === 'object' &&
        (typeof item.text === 'string' || typeof item.snippet === 'string') &&
        (item.start !== undefined || item.offset !== undefined || item.startMs !== undefined)
    )
  );
}

function collectTranscriptTracks(
  node: any,
  depth = 0,
  languageHint = '',
  out: TranscriptTrack[] = []
): TranscriptTrack[] {
  if (!node || depth > 8) return out;

  if (Array.isArray(node)) {
    if (looksLikeSegments(node)) {
      out.push({ segments: node, language: languageHint });
      return out;
    }
    for (const item of node) collectTranscriptTracks(item, depth + 1, languageHint, out);
    return out;
  }

  if (typeof node === 'object') {
    const ownHint = readLanguageHint(node) || languageHint;
    for (const key of Object.keys(node)) {
      // Anahtarin kendisi dil kodu olabilir: tracks: { en: [...], sq: [...] }
      const keyIsLangCode = /^[a-z]{2}(?:[-_][A-Za-z]{2,4})?$/.test(key);
      collectTranscriptTracks(node[key], depth + 1, keyIsLangCode ? key : ownHint, out);
    }
  }

  return out;
}

/** Dil etiketinin Ingilizce'yi isaret edip etmedigini soyler. */
function isEnglishLanguage(language: string): boolean {
  const value = language.trim().toLowerCase();
  return value === 'en' || /^en[-_]/.test(value) || value.startsWith('english');
}

// Ingilizce islev kelimeleri: her metinde yuksek oranda gecerler ve
// dili etiket olmadan da guvenilir sekilde ele verirler.
const ENGLISH_MARKERS = new Set([
  'the', 'and', 'of', 'to', 'a', 'in', 'is', 'that', 'it', 'you',
  'for', 'we', 'this', 'are', 'with', 'on', 'have', 'was', 'but', 'not',
]);

/** Metnin Ingilizce olma orani (0-1). Ingilizce dusuz genelde 0.2 uzerindedir. */
function englishScore(text: string): number {
  const words = text.toLowerCase().match(/[a-z']+/g);
  if (!words || words.length === 0) return 0;
  const sample = words.slice(0, 400);
  const hits = sample.filter((w) => ENGLISH_MARKERS.has(w)).length;
  return hits / sample.length;
}

/** Parcanin ilk cue'larindan dil tespiti icin ornek metin cikarir. */
function sampleTrackText(segments: any[]): string {
  return segments
    .slice(0, 60)
    .map((seg: any) => String(seg.text ?? seg.snippet ?? ''))
    .join(' ');
}

/**
 * Toplanan parcalar arasindan Ingilizce olani secer.
 * Once dil etiketine, etiket yoksa metnin kendisine bakar.
 * Ingilizce bulunamazsa SESSIZCE baska bir dile dusmez; hata firlatir ki
 * cagiran taraf elle yapistirilan metne gecebilsin.
 */
function pickEnglishTrack(tracks: TranscriptTrack[]): TranscriptTrack {
  const labelled = tracks.find((t) => isEnglishLanguage(t.language));
  if (labelled) return labelled;

  const scored = tracks
    .map((t) => ({ track: t, score: englishScore(sampleTrackText(t.segments)) }))
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0 && scored[0].score >= 0.08) return scored[0].track;

  const available = tracks.map((t) => t.language || '(etiketsiz)').join(', ');
  throw new Error(
    `Bu videoda Ingilizce altyazi bulunamadi. Saglayicinin dondurdugu diller: ${available}`
  );
}

/** youtube-transcript.io uzerinden altyazi ceker. */
async function fetchCuesFromApi(videoId: string): Promise<{ cues: Cue[]; raw: any }> {
  const token = resolveKey('transcript', 'YOUTUBE_TRANSCRIPT_IO_TOKEN');
  if (!token) {
    throw new Error(
      "youtube-transcript.io anahtari bulunamadi. Ayarlar menusunden kendi anahtarinizi " +
      "girin veya sunucuda YOUTUBE_TRANSCRIPT_IO_TOKEN tanimlayin."
    );
  }

  const res = await fetch("https://www.youtube-transcript.io/api/transcripts", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids: [videoId] }),
  });

  if (!res.ok) {
    const body = await res.text();
    const error: any = new Error(`youtube-transcript.io ${res.status}: ${body.slice(0, 300)}`);
    error.httpStatus = res.status;
    const retryAfter = res.headers.get("retry-after");
    if (retryAfter) error.retryAfterMs = Math.ceil(parseFloat(retryAfter) * 1000);
    throw error;
  }

  const data: any = await res.json();
  const tracks = collectTranscriptTracks(data);

  if (tracks.length === 0) {
    throw new Error(
      "youtube-transcript.io yanitinda altyazi parcalari bulunamadi. Yanit semasi degismis olabilir."
    );
  }

  const track = pickEnglishTrack(tracks);
  console.log(
    `[Transcript] ${tracks.length} dil parcasi bulundu ` +
    `(${tracks.map((t) => t.language || '?').join(', ')}). ` +
    `Secilen: ${track.language || 'etiketsiz, metinden Ingilizce tespit edildi'}`
  );

  // Ortak bicime cevir; birim tespitini normalizeCues yapar
  const items = track.segments.map((seg: any) => ({
    text: seg.text ?? seg.snippet ?? '',
    offset: Number(seg.start ?? seg.offset ?? seg.startMs ?? 0),
    duration: Number(seg.dur ?? seg.duration ?? seg.durationMs ?? 0),
  }));

  return { cues: normalizeCues(items), raw: data };
}

/** Dogrudan YouTube'dan altyazi ceker (kutuphane yolu). */
async function fetchCuesDirect(videoId: string): Promise<Cue[]> {
  const langAttempts: (string | undefined)[] = ['en', 'en-US', 'en-GB', undefined];
  let lastError: any = null;

  for (const lang of langAttempts) {
    try {
      const items = await YoutubeTranscript.fetchTranscript(
        videoId,
        lang ? { lang } : undefined
      );
      if (items && items.length > 0) return normalizeCues(items);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Altyazi bulunamadi.');
}

/**
 * Secilen stratejiye gore altyaziyi ceker.
 * "auto" modunda once dogrudan denenir (bedava), olmazsa harici API'ye gecilir.
 */
async function fetchYoutubeCues(videoId: string): Promise<Cue[]> {
  const hasApiToken = !!resolveKey('transcript', 'YOUTUBE_TRANSCRIPT_IO_TOKEN');

  if (CAPTION_PROVIDER === 'api') {
    const { cues } = await fetchCuesFromApi(videoId);
    return cues;
  }

  try {
    return await fetchCuesDirect(videoId);
  } catch (directError: any) {
    if (CAPTION_PROVIDER === 'direct' || !hasApiToken) throw directError;

    console.warn(
      `[Captions] Dogrudan cekme basarisiz (${directError?.message || directError}). ` +
      `youtube-transcript.io deneniyor.`
    );
    const { cues } = await fetchCuesFromApi(videoId);
    return cues;
  }
}

/**
 * Ham cue'lari anlamli cumlelere birlestirir.
 * ZAMAN DAMGASI YAPAY ZEKAYA HESAPLATILMAZ; her cumlenin baslangici,
 * o cumleyi baslatan cue'nun GERCEK zamanidir.
 */
function buildSentencesFromCues(cues: Cue[]): BuiltSentence[] {
  const sentences: BuiltSentence[] = [];

  let buffer = '';
  let startSec: number | null = null;
  let endSec = 0;
  let previousCueEnd = 0;

  const flush = () => {
    const text = buffer.replace(/\s+/g, ' ').trim();
    if (text && startSec !== null) {
      sentences.push({
        id: sentences.length + 1,
        en: text,
        startSec: Number(startSec.toFixed(2)),
        endSec: Number(Math.max(endSec, startSec + 0.5).toFixed(2)),
      });
    }
    buffer = '';
    startSec = null;
  };

  for (const cue of cues) {
    const text = cue.text.replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();
    if (!text) continue;

    // Otomatik altyazilardaki tekrar eden (rolling) satirlari atla
    if (buffer && buffer.toLowerCase().endsWith(text.toLowerCase())) {
      previousCueEnd = cue.endSec;
      continue;
    }

    const gap = startSec === null ? 0 : cue.startSec - previousCueEnd;

    // Uzun sessizlikten sonra ve elde yeterli metin varsa cumleyi kapat
    if (buffer.length > 60 && gap > 1.2) flush();

    if (startSec === null) startSec = cue.startSec;
    buffer += (buffer ? ' ' : '') + text;
    endSec = cue.endSec;
    previousCueEnd = cue.endSec;

    const endsWithPunctuation = /[.!?\u2026]["'\u2019\u201d)\]]?$/.test(text);
    if (endsWithPunctuation || buffer.length > 240) flush();
  }

  flush();
  return sentences;
}

/* ------------------------------------------------------------
   ELLE YAPISTIRILAN ZAMAN DAMGALI TRANSKRIPT
   ------------------------------------------------------------
   Kullanicilar transkripti genellikle zaman damgalariyla birlikte
   yapistiriyor. Bu damgalar KESIN veridir; tahmine gerek birakmaz.
   Desteklenen bicimler:
     0:15 Metin                 (satir ici)
     0:15 \n Metin              (YouTube "transkripti kopyala" bicimi)
     [0:15] Metin  /  (0:15)    (koseli/normal parantez)
     1:02:03 Metin              (saat iceren)
     00:00:15,000 --> 00:00:18,000 \n Metin   (SRT / WebVTT)
   ------------------------------------------------------------ */

// Gruplar: 1=saat (istege bagli), 2=dakika, 3=saniye, 4=salise
const TIMESTAMP_CORE = String.raw`(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?:[.,](\d{1,3}))?`;
// Bitis damgasi yakalanmaz; grup numaralari sabit kalsin diye non-capturing
const TIMESTAMP_TAIL = String.raw`(?:\d{1,2}:)?\d{1,2}:\d{2}(?:[.,]\d{1,3})?`;

const LEADING_TIMESTAMP = new RegExp(
  String.raw`^\s*[\[\(<]?\s*${TIMESTAMP_CORE}\s*[\]\)>]?` +
  String.raw`(?:\s*-->\s*[\[\(<]?\s*${TIMESTAMP_TAIL}\s*[\]\)>]?)?` +
  String.raw`\s*[-–—:]?\s*`
);

function timestampToSeconds(h?: string, m?: string, s?: string, frac?: string): number {
  return (
    (Number(h) || 0) * 3600 +
    (Number(m) || 0) * 60 +
    (Number(s) || 0) +
    (frac ? Number(`0.${frac}`) : 0)
  );
}

/**
 * Elle yapistirilan metindeki zaman damgalarini ayristirip cue'ya cevirir.
 * Damga bulunamazsa bos dizi doner; cagiran taraf orantili hizalamaya duser.
 */
function parseTimestampedTranscript(raw: string): Cue[] {
  const segments: { startSec: number; text: string }[] = [];
  let pending: { startSec: number; text: string } | null = null;

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // WebVTT basligi, NOTE satirlari ve SRT sira numaralarini atla
    if (/^WEBVTT\b/i.test(trimmed) || /^NOTE\b/i.test(trimmed)) continue;
    if (/^\d{1,4}$/.test(trimmed)) continue;

    const match = trimmed.match(LEADING_TIMESTAMP);
    if (match) {
      if (pending) segments.push(pending);
      pending = {
        startSec: timestampToSeconds(match[1], match[2], match[3], match[4]),
        text: trimmed.slice(match[0].length).trim(),
      };
    } else if (pending) {
      // Damgasiz satir, bir onceki damganin metnine aittir
      pending.text += (pending.text ? ' ' : '') + trimmed;
    }
    // Ilk damgadan onceki basliklar/onsoz bilincli olarak atilir
  }
  if (pending) segments.push(pending);

  const usable = segments.filter((s) => s.text.length > 0);
  if (usable.length < 2) return [];

  // Damgalar buyuk olcude artan olmali; degilse bu bir transkript degildir
  let decreases = 0;
  for (let i = 1; i < usable.length; i++) {
    if (usable[i].startSec < usable[i - 1].startSec) decreases++;
  }
  if (decreases > usable.length * 0.1) return [];

  const cues: Cue[] = [];
  usable.forEach((seg, i) => {
    const text = decodeEntities(seg.text).replace(/\s+/g, ' ').trim();
    if (!text) return;
    const next = usable[i + 1]?.startSec;
    // Sure verilmedigi icin bitis, sonraki damgadir; son parcada
    // okuma hizindan (~15 karakter/saniye) tahmin edilir
    const endSec =
      next !== undefined && next > seg.startSec
        ? next
        : seg.startSec + Math.max(2, text.length / 15);
    cues.push({ text, startSec: seg.startSec, endSec });
  });

  return cues;
}

/** Elle yapistirilan metni cumlelere boler (gercek zaman bilgisi yoktur). */
function buildSentencesFromPlainText(raw: string): BuiltSentence[] {
  const cleaned = raw
    .split(/\r?\n/)
    .map((line) => line.replace(LEADING_TIMESTAMP, ''))
    .join(' ')
    .replace(/[\[\(]\s*(?:\d{1,2}:)?\d{1,2}:\d{2}(?:[.,]\d{1,3})?\s*[\]\)]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const parts = cleaned.match(/[^.!?\u2026]+[.!?\u2026]+["'\u2019\u201d)\]]?|\S[^.!?\u2026]*$/g) || [];

  return parts
    .map((p) => p.trim())
    .filter((p) => p.length > 1)
    .map((p, i) => ({ id: i + 1, en: p }));
}

/**
 * Elle yapistirilan cumleleri videonun GERCEK altyazi zamanlarina hizalar.
 *
 * Metin eslestirmesi yapilmaz; cunku altyazi baska bir dilde olabilir.
 * Bunun yerine cumlelerin karakter uzunluklari kullanilarak konusma
 * zaman cizgisi orantili bolunur. Cue ZAMANLARI dilden bagimsiz oldugu
 * icin bu, altyazi dili ne olursa olsun calisir.
 *
 * Bulunan her deger, gercek bir cue baslangicina yaslanir; boylece damga
 * her zaman videoda konusmanin fiilen basladigi bir ana denk gelir.
 */
function alignSentencesToCues(sentences: BuiltSentence[], cues: Cue[]): void {
  if (sentences.length === 0 || cues.length === 0) return;

  const timelineStart = cues[0].startSec;
  let timelineEnd = timelineStart;
  for (const cue of cues) timelineEnd = Math.max(timelineEnd, cue.endSec);

  const span = timelineEnd - timelineStart;
  if (span <= 0) return;

  const lengths = sentences.map((s) => Math.max(1, s.en.length));
  const totalChars = lengths.reduce((a, b) => a + b, 0);

  // 1. gecis: baslangiclari orantili hesapla ve gercek cue basina yasla
  const starts: number[] = [];
  const rawEnds: number[] = [];
  let consumedChars = 0;
  let cueIndex = 0;

  sentences.forEach((_, i) => {
    const rawStart = timelineStart + span * (consumedChars / totalChars);
    consumedChars += lengths[i];
    rawEnds.push(timelineStart + span * (consumedChars / totalChars));

    // Yalnizca ileri yuruyen isaretci: damgalar hicbir zaman geri gitmez
    while (cueIndex + 1 < cues.length && cues[cueIndex + 1].startSec <= rawStart) {
      cueIndex++;
    }
    starts.push(cues[cueIndex].startSec);
  });

  // 2. gecis: bitisi bir SONRAKI cumlenin baslangicina kilitle.
  // Baslangiclar cue'ya yaslanirken geri kaydigi icin, orantili bitis degeri
  // sonraki cumlenin uzerine tasabiliyordu. Layer3Shadowing endSec'i dongu
  // durdurma noktasi olarak kullandigindan bu, cumlenin sonraki cumlenin
  // sesine tasmasi demekti. Araliklar artik cakismaz.
  sentences.forEach((sentence, i) => {
    const startSec = starts[i];
    const nextStart = starts[i + 1];
    const endSec =
      nextStart !== undefined && nextStart > startSec
        ? nextStart
        : Math.max(rawEnds[i], startSec + 0.5);

    sentence.startSec = Number(startSec.toFixed(2));
    sentence.endSec = Number(endSec.toFixed(2));
  });

  console.log(
    `[Transcript] ${sentences.length} elle girilen cumle, ${cues.length} cue'nun ` +
    `zaman cizgisine hizalandi (${formatTimestamp(timelineStart)} - ${formatTimestamp(timelineEnd)}).`
  );
}

function formatTimestamp(totalSeconds: number): string {
  const total = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

/* ============================================================
   YAPAY ZEKA SAGLAYICI KATMANI
   ------------------------------------------------------------
   AI_PROVIDER ortam degiskeni ile saglayici secilir:
     - "gemini" (varsayilan) -> Google Gemini
     - "groq"                -> Groq uzerinden acik agirlikli modeller
   Groq, OpenAI uyumlu bir uc nokta sundugu icin ek SDK gerekmez.
   ============================================================ */

const AI_PROVIDER = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

// Groq model sirasi. Groq modelleri sik degisiyor; guncel liste:
// https://console.groq.com/docs/models
// 17 Haziran 2026'da llama-3.3-70b-versatile ve qwen/qwen3-32b kullanimdan
// kaldirildi, yerlerine asagidakiler onerildi.
const GROQ_MODELS = [
  "openai/gpt-oss-120b",
  "qwen/qwen3.6-27b",
  "openai/gpt-oss-20b",
];

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
];

/**
 * Saglayici oncelik sirasi. AI_PROVIDERS ile virgullu liste verilebilir:
 *   AI_PROVIDERS="gemini,groq"
 * Bir saglayici kota/limit hatasi verirse sistem otomatik olarak
 * sonrakine gecer. Anahtari tanimli olmayan saglayicilar atlanir.
 * Geriye donuk uyumluluk icin tekil AI_PROVIDER de desteklenir.
 */
function getProviderChain(): string[] {
  const raw = process.env.AI_PROVIDERS || process.env.AI_PROVIDER || 'gemini,groq';
  const requested = raw.split(',').map((p) => p.trim().toLowerCase()).filter(Boolean);

  const hasKey: Record<string, boolean> = {
    gemini: !!resolveKey('gemini', 'GEMINI_API_KEY'),
    groq: !!resolveKey('groq', 'GROQ_API_KEY'),
  };

  const available = requested.filter((p) => hasKey[p]);

  if (available.length === 0) {
    // Hicbiri tanimli degilse ilk isteneni birak ki hata mesaji anlamli olsun
    return requested.length ? [requested[0]] : ['gemini'];
  }
  return available;
}

// Helper to instantiate Gemini AI
function getGeminiClient() {
  const apiKey = resolveKey('gemini', 'GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error(
      "Gemini API anahtari bulunamadi. Ayarlar menusunden kendi anahtarinizi girin " +
      "veya sunucuda GEMINI_API_KEY tanimlayin."
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

/** Groq secildiginde Gemini istemcisi gerekmez. */
function getAIClient(): GoogleGenAI | null {
  // Zincirin ilk saglayicisi Gemini degilse istemci gerekmez.
  // Anahtar yoksa da hata firlatmayiz; zincirdeki diger saglayici devreye girer.
  if (!resolveKey('gemini', 'GEMINI_API_KEY')) return null;
  try {
    return getGeminiClient();
  } catch {
    return null;
  }
}

function isRateLimitError(err: any): boolean {
  const errStr = (err?.message || "") + JSON.stringify(err || {});
  return (
    err?.status === "RESOURCE_EXHAUSTED" ||
    err?.code === 429 ||
    err?.httpStatus === 429 ||
    errStr.includes("429") ||
    errStr.includes("RESOURCE_EXHAUSTED") ||
    errStr.includes("rate_limit") ||
    errStr.includes("quota")
  );
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 429 hatasinin GUNLUK mi DAKIKALIK mi oldugunu ayirt eder.
 * Ikisi cok farkli: dakikalik limitte beklemek yeter, gunluk limitte
 * kota UTC gece yarisina kadar geri gelmez.
 */
function describeRateLimit(error: any): string {
  const raw = (error?.message || '') + JSON.stringify(error || {});

  const retryMatch = raw.match(/retryDelay["':\s]+([0-9.]+)s/i);
  const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : null;

  const isDaily = /PerDay|RequestsPerDay|daily/i.test(raw);
  const isPerMinute = /PerMinute|RequestsPerMinute|TokensPerMinute/i.test(raw);

  if (isDaily) {
    return "GUNLUK ucretsiz kotan doldu. Bu kota UTC gece yarisinda (Turkiye saatiyle 03:00) sifirlanir. Beklemek istemiyorsan AI_PROVIDER ortam degiskenini 'groq' yapip Groq'un ayri kotasini kullanabilirsin.";
  }

  if (isPerMinute) {
    return retrySeconds
      ? `Dakikalik istek limitine takildin. Yaklasik ${retrySeconds} saniye sonra tekrar deneyin.`
      : "Dakikalik istek limitine takildin. Bir dakika bekleyip tekrar deneyin.";
  }

  return retrySeconds
    ? `Yapay zeka istek limitine ulasildi. Yaklasik ${retrySeconds} saniye sonra tekrar deneyin.`
    : "Yapay zeka istek limitine ulasildi. Lutfen 30 saniye sonra tekrar deneyin.";
}

/** Groq'un OpenAI uyumlu sohbet ucunu cagirir. */
async function callGroq(
  model: string,
  prompt: string,
  systemInstruction: string,
  jsonHint?: string
): Promise<{ text: string }> {
  const apiKey = resolveKey('groq', 'GROQ_API_KEY');
  if (!apiKey) {
    throw new Error(
      "Groq API anahtari bulunamadi. Ayarlar menusunden kendi anahtarinizi girin " +
      "veya sunucuda GROQ_API_KEY tanimlayin."
    );
  }

  const systemContent = jsonHint
    ? `${systemInstruction}\n\nSADECE gecerli JSON dondur. Markdown, aciklama veya kod bloğu isareti ekleme. Kullanilacak sema:\n${jsonHint}`
    : systemInstruction;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      ...(jsonHint ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const bodyText = await res.text();
    const error: any = new Error(`Groq ${res.status}: ${bodyText.slice(0, 300)}`);
    error.httpStatus = res.status;
    // 429 durumunda Groq, beklenmesi gereken sureyi bu baslikta bildirir
    const retryAfter = res.headers.get("retry-after");
    if (retryAfter) error.retryAfterMs = Math.ceil(parseFloat(retryAfter) * 1000);
    throw error;
  }

  const data: any = await res.json();
  const text = data?.choices?.[0]?.message?.content || "";
  return { text };
}

/**
 * Saglayicidan bagimsiz uretim. Model listesi sirayla denenir; 429 durumunda
 * ustel bekleme (exponential backoff) uygulanir ve varsa Retry-After basligina
 * uyulur. Cagiranlar response.text okumaya devam edebilir.
 */
async function generateContentWithRetry(
  ai: GoogleGenAI | null,
  params: {
    contents: any;
    config?: any;
    primaryModel?: string;
    /** Groq icin beklenen JSON semasinin kisa tarifi. Gemini bunu yok sayar. */
    jsonHint?: string;
  }
): Promise<{ text: string }> {
  const providers = getProviderChain();
  let lastError: any = null;

  // Saglayicilar sirayla denenir. Biri kotasini doldurursa digerine gecilir.
  for (const provider of providers) {
    const isGroq = provider === 'groq';
    const baseModels = isGroq ? GROQ_MODELS : GEMINI_MODELS;
    const models = params.primaryModel ? [params.primaryModel, ...baseModels] : baseModels;

    let providerExhausted = false;

    for (const modelName of models) {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          if (isGroq) {
            return await callGroq(
              modelName,
              typeof params.contents === 'string' ? params.contents : JSON.stringify(params.contents),
              params.config?.systemInstruction || '',
              params.jsonHint || (params.config?.responseMimeType === 'application/json' ? '{}' : undefined)
            );
          }

          const client = ai || getGeminiClient();
          const response = await client.models.generateContent({
            model: modelName,
            contents: params.contents,
            config: params.config,
          });
          return { text: response.text || "" };
        } catch (err: any) {
          lastError = err;

          if (isRateLimitError(err)) {
            const raw = (err?.message || '') + JSON.stringify(err || {});

            // GUNLUK kota dolduysa beklemenin faydasi yok; dogrudan
            // sonraki saglayiciya gec.
            if (/PerDay|RequestsPerDay|daily/i.test(raw)) {
              console.warn(`[AI] ${provider} gunluk kotasi dolmus, sonraki saglayiciya geciliyor.`);
              providerExhausted = true;
              break;
            }

            const backoffMs = err?.retryAfterMs || 2000 * Math.pow(2, attempt);
            console.warn(
              `[AI] ${provider}/${modelName} limite takildi (429). ${backoffMs} ms bekleniyor (deneme ${attempt + 1}/3).`
            );
            await sleep(backoffMs);
          } else {
            console.warn(`[AI] ${provider}/${modelName} hatasi:`, err?.message || err);
            break; // Sonraki modele gec
          }
        }
      }

      if (providerExhausted) break;
    }
  }

  throw lastError;
}

function formatErrorMessage(error: any, defaultMsg: string): string {
  if (!error) return defaultMsg;
  const rawMsg = error.message || (typeof error === 'string' ? error : '');
  if (rawMsg.startsWith('{') || rawMsg.includes('"error":')) {
    try {
      const parsed = typeof rawMsg === 'string' ? JSON.parse(rawMsg) : rawMsg;
      if (parsed.error?.message) {
        return `Yapay zeka yanıt veremedi: ${parsed.error.message}`;
      }
    } catch {}
  }
  return rawMsg || defaultMsg;
}

const SYSTEM_INSTRUCTION_COACH = `Sen "Katmanlı Çalışma" (Layered Learning) metodolojisi konusunda uzmanlaşmış profesyonel bir İngilizce Dil Koçusun.
Görevin, kullanıcının sunduğu YouTube veya TED Talks videolarının transkriptleri üzerinden 7 katmanlı öğrenme sürecini yönetmektir.

Temel Kuralların:
1. Kullanıcıyı adım adım yönlendir; tüm katmanları tek seferde verme.
2. Kullanıcının seviyesine uyum sağla; düzeltme yaparken motive edici ve yapıcı ol.
3. Gramer öğretiminde "Genelden Özele" (context-driven) yaklaş: Kullanıcının yaptığı hatalar veya metindeki kritik yapılar üzerinden sadece ilgili gramer kuralını, basit ve günlük hayattan 3 somut örnekle anlat.
4. Türkçe-İngilizce çift dilli metin oluştururken her satırın tam bir cümle olmasına ve çevirinin bağlamsal doğruluğuna dikkat et.`;

// API Endpoints

/**
 * TEK bir cumle grubunu cevirir. Zaman damgalari sunucuda hesaplandigi ve
 * eslesme "id" uzerinden yapildigi icin model cumleleri bolse bile senkron bozulmaz.
 */
/* ============================================================
   CEVIRI SAGLAYICISI
   ------------------------------------------------------------
   TRANSLATE_PROVIDER ortam degiskeni:
     - "ai"    (varsayilan) -> cumleleri LLM cevirir (baglami anlar,
                               kaliteli, ama kotayi hizli tuketir)
     - "libre" -> LibreTranslate cevirir (kota derdi yok, kalite daha duz)
   LibreTranslate hata verirse otomatik olarak LLM'e dusulur.
   ============================================================ */

const TRANSLATE_PROVIDER = (process.env.TRANSLATE_PROVIDER || 'ai').toLowerCase();
const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com/translate';

/**
 * LibreTranslate ile toplu ceviri. API birden fazla metni tek istekte
 * kabul ediyor, bu yuzden bir grup tek cagrida cevriliyor.
 */
async function translateWithLibre(
  chunk: { id: number; en: string }[]
): Promise<Record<number, string>> {
  const body: any = {
    q: chunk.map((s) => s.en),
    source: 'en',
    target: 'tr',
    format: 'text',
  };

  // Bazi ornekler (libretranslate.com dahil) anahtar istiyor, bazilari istemiyor
  const libreKey = resolveKey('libre', 'LIBRETRANSLATE_API_KEY');
  if (libreKey) {
    body.api_key = libreKey;
  }

  const res = await fetch(LIBRETRANSLATE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LibreTranslate ${res.status}: ${text.slice(0, 200)}`);
  }

  const data: any = await res.json();
  const translated = data?.translatedText;

  // Dizi gonderdigimizde dizi bekleriz; tek metin donerse de idare edelim
  const list: string[] = Array.isArray(translated)
    ? translated
    : (typeof translated === 'string' ? [translated] : []);

  if (list.length !== chunk.length) {
    throw new Error(
      `LibreTranslate ${chunk.length} cumle icin ${list.length} ceviri dondurdu.`
    );
  }

  const translations: Record<number, string> = {};
  chunk.forEach((s, i) => {
    translations[s.id] = list[i] || '';
  });
  return translations;
}

async function translateChunk(
  ai: GoogleGenAI | null,
  chunk: { id: number; en: string }[]
): Promise<Record<number, string>> {
  const translations: Record<number, string> = {};

  // LibreTranslate secilmisse once onu dene. Basarisiz olursa LLM'e dus,
  // boylece ceviri hic yapilamamis olmaz.
  if (TRANSLATE_PROVIDER === 'libre') {
    try {
      return await translateWithLibre(chunk);
    } catch (err: any) {
      console.warn('[Translate] LibreTranslate basarisiz, LLM ile deneniyor:', err?.message || err);
    }
  }

  const numbered = chunk.map((s) => `${s.id}. ${s.en}`).join('\n');

  const prompt = `Asagida numaralandirilmis Ingilizce cumleler var.
Her cumlenin DOGAL ve AKICI Turkce cevirisini yap.

KESIN KURALLAR:
- Cumleleri BIRLESTIRME, BOLME veya ATLAMA. Kac cumle verildiyse o kadar ceviri dondur.
- Her ceviriyi kendi "id" numarasiyla eslestir.
- Ceviri disinda hicbir sey ekleme.

CUMLELER:
${numbered}`;

  const response = await generateContentWithRetry(ai, {
    contents: prompt,
    jsonHint: '{"translations":[{"id":1,"tr":"Turkce ceviri"}]}',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_COACH,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          translations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                tr: { type: Type.STRING },
              },
              required: ["id", "tr"],
            },
          },
        },
        required: ["translations"],
      },
    },
  });

  try {
    const parsed = JSON.parse(response.text || "{}");
    const list = Array.isArray(parsed.translations) ? parsed.translations : [];
    for (const item of list) {
      if (typeof item?.id === 'number' && typeof item?.tr === 'string') {
        translations[item.id] = item.tr;
      }
    }
  } catch (e) {
    console.warn('[Translate] Grup parse edilemedi:', e);
  }

  return translations;
}

/**
 * Tum cumleleri gruplar halinde cevirir (tek istekte calisan eski akis icin).
 * Netlify'da bu yol zaman asimina ugrar; frontend parcali uc noktalari kullanir.
 */
async function translateSentencesInBatches(
  ai: GoogleGenAI | null,
  sentences: BuiltSentence[]
): Promise<Record<number, string>> {
  const BATCH_SIZE = 30;
  let translations: Record<number, string> = {};

  for (let i = 0; i < sentences.length; i += BATCH_SIZE) {
    if (i > 0) await sleep(1500);
    const chunk = sentences.slice(i, i + BATCH_SIZE);
    translations = { ...translations, ...(await translateChunk(ai, chunk)) };
  }

  return translations;
}

/** Kelime, gramer ve quiz verilerini tek cagrida uretir. */
async function generateStudyMaterial(ai: GoogleGenAI | null, fullText: string) {
  const prompt = `Asagidaki Ingilizce konusma metnini incele ve ogrenme materyali uret.

METIN:
"${fullText.slice(0, 14000)}"

TALIMATLAR:
1. "vocabulary": Metinde gecen 6-10 kritik B2/C1 kelime/phrasal verb, IPA okunusu, Turkce anlami, telaffuz ipucu ve ornek cumle.
2. "grammarRules": Metinde tespit edilen gramer yapilarini "Genelden Ozele" mantigiyla Turkce acikla. Her yapi icin 5-10 ornek cumle ve Turkce karsiliklari.
3. "quizQuestions": Metni test eden 5 Ingilizce soru. 3 tanesi coktan secmeli (4 sikli "options", "correctOptionIndex" 0-3, "explanationTr"), 2 tanesi acik uclu ("sampleAnswerEn", "explanationTr").`;

  const response = await generateContentWithRetry(ai, {
    contents: prompt,
    jsonHint: '{"vocabulary":[{"word":"","type":"","ipa":"","meaningTr":"","pronunciationNote":"","exampleSentence":""}],"grammarRules":[{"topic":"","explanationTr":"","examples":[{"en":"","tr":""}]}],"quizQuestions":[{"id":1,"type":"multiple_choice","question":"","options":["","","",""],"correctOptionIndex":0,"sampleAnswerEn":"","explanationTr":""}]}',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_COACH,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vocabulary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                type: { type: Type.STRING },
                ipa: { type: Type.STRING },
                meaningTr: { type: Type.STRING },
                pronunciationNote: { type: Type.STRING },
                exampleSentence: { type: Type.STRING }
              },
              required: ["word", "meaningTr", "pronunciationNote"]
            }
          },
          grammarRules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                explanationTr: { type: Type.STRING },
                examples: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      en: { type: Type.STRING },
                      tr: { type: Type.STRING }
                    },
                    required: ["en", "tr"]
                  }
                }
              },
              required: ["topic", "explanationTr", "examples"]
            }
          },
          quizQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                type: { type: Type.STRING },
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctOptionIndex: { type: Type.INTEGER },
                sampleAnswerEn: { type: Type.STRING },
                explanationTr: { type: Type.STRING }
              },
              required: ["id", "type", "question", "explanationTr"]
            }
          }
        },
        required: ["vocabulary", "grammarRules", "quizQuestions"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch {
    return { vocabulary: [], grammarRules: [], quizQuestions: [] };
  }
}

// API Endpoints

/**
 * TESHIS (adres cubugundan calisir):
 *   https://siten.netlify.app/api/check-captions?v=VIDEO_ID_VEYA_LINK
 * Gemini/Groq cagrilmaz. Altyazinin cekilip cekilemedigini ve cekilemiyorsa
 * TAM hata metnini dondurur.
 */
app.get("/api/check-captions", async (req, res) => {
  const started = Date.now();
  const input = String(req.query.v || req.query.url || '');
  const ytId = extractYouTubeId(input.trim());

  if (!ytId) {
    return res.status(400).json({
      ok: false,
      error: "Gecerli bir YouTube linki veya video ID gerekli. Ornek: /api/check-captions?v=arj7oStGLkU",
    });
  }

  try {
    const cues = await fetchYoutubeCues(ytId);
    const sentences = buildSentencesFromCues(cues);
    res.json({
      ok: true,
      videoId: ytId,
      captionProvider: CAPTION_PROVIDER,
      cueCount: cues.length,
      sentenceCount: sentences.length,
      elapsedMs: Date.now() - started,
      preview: sentences.slice(0, 3).map((s) => ({
        timestamp: formatTimestamp(s.startSec || 0),
        en: s.en.slice(0, 90),
      })),
    });
  } catch (error: any) {
    // ?raw=1 eklenirse youtube-transcript.io'nun ham yaniti donulur.
    // Yanit semasi belgelenmedigi icin sorun cikarsa buradan gorulur.
    let rawSample: any = undefined;
    const rawToken = resolveKey('transcript', 'YOUTUBE_TRANSCRIPT_IO_TOKEN');
    if (req.query.raw && rawToken) {
      try {
        const r = await fetch("https://www.youtube-transcript.io/api/transcripts", {
          method: "POST",
          headers: {
            "Authorization": `Basic ${rawToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: [ytId] }),
        });
        rawSample = JSON.stringify(await r.json()).slice(0, 1200);
      } catch (e: any) {
        rawSample = `ham yanit alinamadi: ${e?.message || e}`;
      }
    }

    res.status(502).json({
      ok: false,
      videoId: ytId,
      captionProvider: CAPTION_PROVIDER,
      elapsedMs: Date.now() - started,
      error: error?.message || String(error),
      rawSample,
      hint: "Bu hata sadece Netlify'da goruluyor ve her videoda tekrarliyorsa, YouTube veri merkezi IP'lerini engelliyor demektir. YOUTUBE_TRANSCRIPT_IO_TOKEN ekleyerek harici API'ye gecebilirsiniz.",
    });
  }
});

/**
 * 0. TESHIS UCU: Sadece altyaziyi cekip ozet dondurur, Gemini cagrilmaz.
 * Netlify/Lambda gibi ortamlarda YouTube'un veri merkezi IP'lerini engelleyip
 * engellemedigini 1-3 saniyede anlamak icin. Zaman asimina takilmaz.
 */
app.post("/api/check-captions", async (req, res) => {
  const started = Date.now();
  try {
    const { videoInput } = req.body;
    const ytId = extractYouTubeId(String(videoInput || '').trim());
    if (!ytId) {
      return res.status(400).json({ ok: false, error: "Gecerli bir YouTube linki gerekli." });
    }

    const cues = await fetchYoutubeCues(ytId);
    const sentences = buildSentencesFromCues(cues);

    res.json({
      ok: true,
      videoId: ytId,
      cueCount: cues.length,
      sentenceCount: sentences.length,
      elapsedMs: Date.now() - started,
      // Ilk 3 cumle: zaman damgalarinin makul olup olmadigini gozle dogrulamak icin
      preview: sentences.slice(0, 3).map((s) => ({
        timestamp: formatTimestamp(s.startSec || 0),
        startSec: s.startSec,
        en: s.en.slice(0, 90),
      })),
    });
  } catch (error: any) {
    console.error("Error in /api/check-captions:", error);
    res.status(502).json({
      ok: false,
      elapsedMs: Date.now() - started,
      error: error?.message || "Altyazi cekilemedi.",
      hint: "Bu hata Netlify/Lambda uzerinde goruluyorsa YouTube veri merkezi IP'sini engelliyor olabilir.",
    });
  }
});

// 1. Extract / Process Bilingual Transcript (Katman 1)
app.post("/api/extract-transcript", async (req, res) => {
  try {
    const { videoInput, youtubeUrl } = req.body;
    if (!videoInput || !videoInput.trim()) {
      return res.status(400).json({ error: "Video linki veya metin gereklidir." });
    }

    const inputTrimmed = videoInput.trim();
    const ytIdFromInput = extractYouTubeId(inputTrimmed);
    const ytIdFromUrlField = youtubeUrl ? extractYouTubeId(youtubeUrl.trim()) : '';
    const activeYtId = ytIdFromInput || ytIdFromUrlField;

    let fetchedTitle = "";
    let sentences: BuiltSentence[] = [];
    let hasRealTimings = false;
    let syncNotice = "";
    let captionError = "";

    if (activeYtId) {
      try {
        const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${activeYtId}&format=json`);
        if (oembedRes.ok) {
          const oembedData: any = await oembedRes.json();
          if (oembedData.title) fetchedTitle = oembedData.title;
        }
      } catch (e) {
        console.warn("Could not fetch YouTube title via oEmbed:", e);
      }
    }

    // Elle yapistirilan metni ayirt et. Girdi yalnizca bir linkten ibaretse
    // (bir-iki kelime) metin yok demektir; aksi halde kullanicinin
    // yapistirdigi transkript vardir. Not: eskiden girdide herhangi bir yerde
    // YouTube linki gecmesi metnin tamamen atilmasina yol aciyordu.
    const inputIsOnlyLink = !!ytIdFromInput && inputTrimmed.split(/\s+/).length <= 2;
    const manualText = inputIsOnlyLink ? '' : inputTrimmed;

    // Yapistirilan metin kendi zaman damgalarini tasiyor mu?
    // Tasiyorsa bu KESIN veridir: ne altyazi cekmeye ne de tahmine gerek var.
    const manualCues = manualText ? parseTimestampedTranscript(manualText) : [];
    if (manualCues.length > 0) {
      console.log(`[Transcript] Yapistirilan metinde ${manualCues.length} zaman damgasi bulundu; altyazi cekilmeyecek.`);
    }

    // Altyaziyi yalnizca gerektiginde cek. Elle girilen metin damgasizsa
    // cue ZAMANLARI hizalama icin kullanilir; bu zamanlar altyazinin
    // dilinden bagimsizdir.
    let cues: Cue[] = [];
    if (activeYtId && manualCues.length === 0) {
      try {
        cues = await fetchYoutubeCues(activeYtId);
      } catch (err: any) {
        captionError = err?.message || String(err);
        console.warn("YoutubeTranscript error:", captionError);
      }
    }

    // ONCELIK: Elle yapistirilan metin HER ZAMAN kazanir.
    // Eskiden cekilen altyazi metnin uzerine yaziliyordu; bu yuzden yanlis
    // dilde altyazi gelince kullanicinin elle duzeltmesi imkansizdi.
    if (manualCues.length > 0) {
      sentences = buildSentencesFromCues(manualCues);
      hasRealTimings = true;
    } else if (manualText) {
      sentences = buildSentencesFromPlainText(manualText);
      if (cues.length > 0) {
        alignSentencesToCues(sentences, cues);
        hasRealTimings = true;
        syncNotice = "Metin sizin yapistirdiginiz transkriptten alindi; zaman damgasi icermedigi icin damgalar videonun altyazi akisina orantili olarak hizalandi.";
      } else {
        syncNotice = "Bu ders elle yapistirilan metinden olusturuldu; YouTube altyazi zamanlari bulunamadigi icin cumle bazli otomatik senkronizasyon devre disi.";
      }
    } else if (cues.length > 0) {
      sentences = buildSentencesFromCues(cues);
      hasRealTimings = true;
    } else {
      return res.status(400).json({
        error: "Bu YouTube videosunun altyazisi (CC) alinamadi. Lutfen 'Ingilizce Metin / Transkript Yapistir' sekmesini secip metni manuel yapistirin.",
        reason: captionError || "bilinmiyor",
      });
    }

    if (sentences.length === 0) {
      return res.status(500).json({ error: "Cumleler ayristirilamadi." });
    }

    // Goruntulenecek zaman damgasi metnini burada uret (model uretmez)
    for (const s of sentences) {
      if (typeof s.startSec === 'number') {
        s.timestamp = formatTimestamp(s.startSec);
      }
    }

    const ai = getAIClient();
    const fullText = sentences.map((s) => s.en).join(' ');

    // Istekleri PARALEL degil SIRALI calistiriyoruz. Paralel calistirmak
    // dakikalik istek/token kotasini aninda tuketip 429 aliyordu.
    const translations = await translateSentencesInBatches(ai, sentences);
    const material = await generateStudyMaterial(ai, fullText);

    const finalSentences = sentences.map((s) => ({
      id: s.id,
      en: s.en,
      tr: translations[s.id] || '',
      startSec: s.startSec,
      endSec: s.endSec,
      timestamp: s.timestamp,
    }));

    res.json({
      title: fetchedTitle || "Video Transkripti",
      sentences: finalSentences,
      vocabulary: material.vocabulary || [],
      grammarRules: material.grammarRules || [],
      quizQuestions: material.quizQuestions || [],
      hasRealTimings,
      syncNotice,
    });
  } catch (error: any) {
    console.error("Error in /api/extract-transcript:", error);
    const isQuota = error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429 || JSON.stringify(error).includes("429");
    const statusCode = isQuota ? 429 : 500;
    const msg = isQuota
      ? describeRateLimit(error)
      : formatErrorMessage(error, "Transkript islenirken hata olustu.");
    res.status(statusCode).json({ error: msg });
  }
});

/* ============================================================
   PARCALI AKIS (Netlify / serverless icin)
   ------------------------------------------------------------
   /api/extract-transcript tek istekte her seyi yapiyor ve uzun
   videolarda Netlify'in 10 saniyelik fonksiyon sinirini asiyor.
   Asagidaki uc uc nokta isi kucuk parcalara boler; her biri
   birkac saniyede biter. Frontend bunlari sirayla cagirir.
   ============================================================ */

// 1a. Sadece cumleleri ve gercek zaman damgalarini dondurur. Yapay zeka cagrilmaz.
app.post("/api/transcript-sentences", async (req, res) => {
  try {
    const { videoInput, youtubeUrl } = req.body;
    if (!videoInput || !videoInput.trim()) {
      return res.status(400).json({ error: "Video linki veya metin gereklidir." });
    }

    const inputTrimmed = videoInput.trim();
    const ytIdFromInput = extractYouTubeId(inputTrimmed);
    const ytIdFromUrlField = youtubeUrl ? extractYouTubeId(youtubeUrl.trim()) : '';
    const activeYtId = ytIdFromInput || ytIdFromUrlField;

    let fetchedTitle = "";
    let sentences: BuiltSentence[] = [];
    let hasRealTimings = false;
    let syncNotice = "";
    let captionError = "";

    if (activeYtId) {
      try {
        const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${activeYtId}&format=json`);
        if (oembedRes.ok) {
          const oembedData: any = await oembedRes.json();
          if (oembedData.title) fetchedTitle = oembedData.title;
        }
      } catch (e) {
        console.warn("oEmbed basarisiz:", e);
      }

      try {
        const cues = await fetchYoutubeCues(activeYtId);
        const built = buildSentencesFromCues(cues);
        if (built.length > 0) {
          sentences = built;
          hasRealTimings = true;
        }
      } catch (err: any) {
        captionError = err?.message || String(err);
        console.warn("YoutubeTranscript error:", captionError);
      }
    }

    if (!hasRealTimings) {
      const manualText = ytIdFromInput ? '' : inputTrimmed;
      if (!manualText) {
        return res.status(400).json({
          error: "Bu YouTube videosunun altyazisi (CC) alinamadi. Lutfen 'Ingilizce Metin / Transkript Yapistir' sekmesini secip metni manuel yapistirin.",
          reason: captionError || "bilinmiyor",
        });
      }
      sentences = buildSentencesFromPlainText(manualText);
      syncNotice = "Bu ders elle yapistirilan metinden olusturuldu; otomatik senkronizasyon devre disi.";
    }

    if (sentences.length === 0) {
      return res.status(500).json({ error: "Cumleler ayristirilamadi." });
    }

    for (const s of sentences) {
      if (typeof s.startSec === 'number') s.timestamp = formatTimestamp(s.startSec);
    }

    res.json({
      title: fetchedTitle || "Video Transkripti",
      sentences,
      hasRealTimings,
      syncNotice,
    });
  } catch (error: any) {
    console.error("Error in /api/transcript-sentences:", error);
    res.status(500).json({ error: formatErrorMessage(error, "Transkript alinamadi.") });
  }
});

// 1b. Tek bir cumle grubunu cevirir. Frontend bunu sirayla cagirir.
app.post("/api/translate-batch", async (req, res) => {
  try {
    const { sentences } = req.body;
    if (!Array.isArray(sentences) || sentences.length === 0) {
      return res.status(400).json({ error: "Cevrilecek cumle yok." });
    }

    const ai = getAIClient();
    const translations = await translateChunk(ai, sentences);
    res.json({ translations });
  } catch (error: any) {
    console.error("Error in /api/translate-batch:", error);
    const isQuota = isRateLimitError(error);
    res.status(isQuota ? 429 : 500).json({
      error: isQuota
        ? describeRateLimit(error)
        : formatErrorMessage(error, "Ceviri yapilamadi."),
    });
  }
});

// 1c. Kelime, gramer ve quiz verilerini uretir.
app.post("/api/study-material", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "Metin gereklidir." });
    }

    const ai = getAIClient();
    const material = await generateStudyMaterial(ai, String(text));
    res.json({
      vocabulary: material.vocabulary || [],
      grammarRules: material.grammarRules || [],
      quizQuestions: material.quizQuestions || [],
    });
  } catch (error: any) {
    console.error("Error in /api/study-material:", error);
    const isQuota = isRateLimitError(error);
    res.status(isQuota ? 429 : 500).json({
      error: isQuota
        ? describeRateLimit(error)
        : formatErrorMessage(error, "Ogrenme materyali uretilemedi."),
    });
  }
});

// 1d. B2-C1 seviyesinde ifade ve gerçek diyalog kaliplarini ayiklar.
/* ------------------------------------------------------------
   Kart alanlarinin dogrulanmasi

   Model gecerli bir deger vermediyse alan BOS birakilir; uydurulmus bir
   varsayilan (eskiden "B2") gonderilmez. Istemci bos alani kendi yerel
   CEFR listesinden dolduruyor — bkz. shared/vocab/autoClassify.ts.
   ------------------------------------------------------------ */

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const PARTS_OF_SPEECH = [
  "noun", "verb", "adjective", "adverb", "preposition",
  "pronoun", "conjunction", "determiner", "interjection", "phrase",
];

function normalizeCefrLevel(raw: any): string | undefined {
  const value = String(raw || "").trim().toUpperCase();
  return CEFR_LEVELS.includes(value) ? value : undefined;
}

function normalizePartOfSpeech(raw: any): string | undefined {
  const value = String(raw || "").trim().toLowerCase();
  return PARTS_OF_SPEECH.includes(value) ? value : undefined;
}

/* ============================================================
   HIKAYE URETECI

   AMAC: kullanicinin HALA OGRENEMEDIGI kelimeleri tek bir metinde,
   dogal bir baglamda tekrar karsisina cikarmak. Kelimeyi listede
   ezberlemek yerine anlamli bir hikayede gormek hatirlamayi belirgin
   sekilde kolaylastiriyor.

   IKI ASAMA, BILEREK: kullanici beklemeden okumaya baslasin diye once
   YALNIZCA hikaye uretiliyor (/api/generate-story). Sorular ve
   alistirmalar ikinci bir cagriyla arkadan geliyor
   (/api/generate-story-tasks); tek cagrida uretmek bekleme suresini
   iki katina cikariyordu.
   ============================================================ */

app.post("/api/generate-story", async (req, res) => {
  try {
    const words: string[] = Array.isArray(req.body?.words)
      ? req.body.words.map((w: any) => String(w || '').trim()).filter(Boolean).slice(0, 15)
      : [];
    const level = String(req.body?.level || 'B1').toUpperCase();
    const topic = String(req.body?.topic || '').trim().slice(0, 120);

    if (words.length === 0) {
      return res.status(400).json({ error: "Hikaye icin en az bir kelime gerekli." });
    }
    if (!["B1", "B2", "C1"].includes(level)) {
      return res.status(400).json({ error: "Seviye B1, B2 veya C1 olmali." });
    }

    const ai = getAIClient();

    const wordList = words.map((w) => "- " + w).join("\n");
    const topicLine = topic
      ? "KONU: " + topic
      : "Konu GUNCEL ve ilgi cekici olsun: teknoloji, yapay zeka, iklim, saglik, uzay, sehir hayati, spor ya da calisma hayati gibi bugunun dunyasindan bir mesele.";

    const prompt = `Bir Ingilizce ogrencisi icin KISA BIR HIKAYE yaz.

SEVIYE: ${level} (CEFR). Cumle yapisi ve kelime secimi bu seviyeye uygun olsun.

HIKAYEDE MUTLAKA GECMESI GEREKEN KELIMELER:
${wordList}

KURALLAR:
- Yukaridaki kelimelerin HEPSI hikayede gecmeli. Cekimli hallerini
  kullanabilirsin (run -> ran, decide -> decided).
- Kelimeleri zorlama; hikaye once DOGAL ve akici olmali, kelimeler
  cumleye kendiliginden oturmali.
- 3-5 paragraf, her paragraf 3-6 cumle.
- ${topicLine}
- Hikayenin bir olay orgusu olsun: bir durum, bir gelisme, bir sonuc.
  Ansiklopedi maddesi gibi olmasin.
- "title": kisa ve merak uyandiran Ingilizce baslik.
- "theme": konuyu ozetleyen 2-4 kelimelik Ingilizce etiket.
- "paragraphs": paragraf metinleri dizisi. Markdown ya da isaret KULLANMA.`;

    const response = await generateContentWithRetry(ai, {
      contents: prompt,
      jsonHint: '{"title":"","theme":"","paragraphs":[""]}',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_COACH,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            theme: { type: Type.STRING },
            paragraphs: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["title", "theme", "paragraphs"],
        },
      },
    });

    let story: any = {};
    try {
      story = JSON.parse(response.text || "{}");
    } catch (e) {
      console.warn("[Story] parse hatasi:", e);
    }

    const paragraphs = Array.isArray(story.paragraphs)
      ? story.paragraphs.map((p: any) => String(p || '').trim()).filter(Boolean)
      : [];

    if (paragraphs.length === 0) {
      return res.status(502).json({ error: "Hikaye uretilemedi, tekrar deneyin." });
    }

    res.json({
      title: String(story.title || 'Untitled Story').trim(),
      theme: String(story.theme || 'Story').trim(),
      paragraphs,
    });
  } catch (error: any) {
    console.error("Error in /api/generate-story:", error);
    const isQuota = isRateLimitError(error);
    res.status(isQuota ? 429 : 500).json({
      error: isQuota ? describeRateLimit(error) : formatErrorMessage(error, "Hikaye uretilemedi."),
    });
  }
});

app.post("/api/generate-story-tasks", async (req, res) => {
  try {
    const text = String(req.body?.text || '').trim();
    const level = String(req.body?.level || 'B1').toUpperCase();
    const words: string[] = Array.isArray(req.body?.words)
      ? req.body.words.map((w: any) => String(w || '').trim()).filter(Boolean).slice(0, 15)
      : [];

    if (!text) return res.status(400).json({ error: "Hikaye metni gerekli." });

    const ai = getAIClient();

    const prompt = `Asagidaki ${level} seviyesindeki hikaye icin ALISTIRMA uret.

HIKAYE:
"${text.slice(0, 6000)}"

HEDEF KELIMELER: ${words.join(', ')}

URETILECEKLER:
1. "questions": 5 adet OKUDUGUNU ANLAMA sorusu. Yaniti metinde olan,
   ezber degil anlama olcen sorular. Her biri 4 secenekli.
2. "exercises": 5 adet KELIME alistirmasi. HEDEF KELIMELERI olcsun:
   cumlede bosluk doldurma ya da anlam esleme. Her biri 4 secenekli.

BICIM KURALLARI:
- "options" dizisindeki her secenek "A) ...", "B) ...", "C) ...", "D) ..."
  bicimde yazili olsun.
- "answer" alani yalnizca harf olsun: "A", "B", "C" veya "D".
- "explanation" alistirmalarda kisa Turkce aciklama.
- Sorular hikayenin diliyle ayni seviyede olsun.`;

    const questionSchema = {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        answer: { type: Type.STRING },
        explanation: { type: Type.STRING },
      },
      required: ["question", "options", "answer"],
    };

    const response = await generateContentWithRetry(ai, {
      contents: prompt,
      jsonHint: '{"questions":[{"question":"","options":["A) "],"answer":"A"}],"exercises":[{"question":"","options":["A) "],"answer":"A","explanation":""}]}',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_COACH,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: { type: Type.ARRAY, items: questionSchema },
            exercises: { type: Type.ARRAY, items: questionSchema },
          },
          required: ["questions", "exercises"],
        },
      },
    });

    let parsed: any = {};
    try {
      parsed = JSON.parse(response.text || "{}");
    } catch (e) {
      console.warn("[StoryTasks] parse hatasi:", e);
    }

    /** Yalnizca en az iki secenekli ve gecerli yanitli sorular gecer. */
    const clean = (list: any): any[] =>
      (Array.isArray(list) ? list : [])
        .filter((q) => q && typeof q.question === 'string' && Array.isArray(q.options))
        .map((q: any, index: number) => ({
          id: index + 1,
          question: String(q.question).trim(),
          options: q.options.map((o: any) => String(o || '').trim()).filter(Boolean),
          answer: String(q.answer || 'A').trim().toUpperCase().slice(0, 1),
          explanation: q.explanation ? String(q.explanation).trim() : undefined,
        }))
        .filter((q: any) => q.options.length >= 2 && ['A', 'B', 'C', 'D'].includes(q.answer));

    res.json({ questions: clean(parsed.questions), exercises: clean(parsed.exercises) });
  } catch (error: any) {
    console.error("Error in /api/generate-story-tasks:", error);
    const isQuota = isRateLimitError(error);
    res.status(isQuota ? 429 : 500).json({
      error: isQuota ? describeRateLimit(error) : formatErrorMessage(error, "Alistirmalar uretilemedi."),
    });
  }
});

/* ============================================================
   DOGAL SESLENDIRME  (/api/speak)

   NEDEN TARAYICININ KENDI SESI DEGIL: window.speechSynthesis
   ucretsiz ve aninda calisiyor ama sesin kalitesi tamamen cihaza
   bagli. Windows'ta "Microsoft ... Online (Natural)" sesleri iyi,
   ama ayni sayfa baska bir bilgisayarda ya da telefonda 2000'lerin
   robot sesiyle okuyor. Gemini'nin TTS modeli her cihazda AYNI ve
   dogal sesi veriyor; kullanicinin zaten girdigi anahtarla
   calistigi icin ek bir servis ya da ucret gerekmiyor.

   TARAYICI SESI YEDEKTE KALIYOR: bu uc hata verirse (kota, anahtar
   yok, cevrimdisi) istemci speechSynthesis'e dusuyor. Yani ses her
   zaman var, yalnizca kalitesi degisiyor.

   PARAGRAF PARAGRAF: Netlify fonksiyonu 26 saniyede kesiliyor
   (netlify.toml). Bes paragrafli bir hikayeyi tek istekte
   seslendirmek bu sureyi asardi. Istemci her paragrafi ayri
   istiyor; bu ayni zamanda ilk sesin ~2 saniyede baslamasini ve
   okunan paragrafin vurgulanmasini sagliyor.
   ============================================================ */

/** Gemini'nin TTS modelleri; ilki calismazsa sonraki denenir. */
const GEMINI_TTS_MODELS = [
  "gemini-2.5-flash-preview-tts",
  "gemini-2.5-pro-preview-tts",
];

/**
 * Anlatici sesler. Gemini'nin hazir ses listesinden hikaye anlatimina
 * uygun olanlar secildi; adlar API'nin bekledigi bicimde.
 */
const TTS_VOICES: Record<string, string> = {
  Kore: "Kore",
  Puck: "Puck",
  Charon: "Charon",
  Aoede: "Aoede",
  Leda: "Leda",
  Orus: "Orus",
};

/**
 * Ham PCM'i WAV'a cevirir.
 *
 * Gemini basliksiz 16-bit PCM donduruyor; <audio> etiketi bunu
 * calamaz. 44 baytlik standart WAV basligi eklemek tarayicinin
 * dosyayi tanimasi icin yeterli - yeniden kodlama, ek bagimlilik yok.
 */
function pcmToWav(pcm: Buffer, sampleRate: number, channels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);           // fmt yigin boyutu
  header.writeUInt16LE(1, 20);            // 1 = PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]);
}

/** mimeType "audio/L16;codec=pcm;rate=24000" icindeki ornekleme hizi. */
function sampleRateFromMime(mime: string): number {
  const match = /rate=(\d+)/i.exec(mime || "");
  const rate = match ? parseInt(match[1], 10) : NaN;
  return Number.isFinite(rate) && rate > 0 ? rate : 24000;
}

app.post("/api/speak", async (req, res) => {
  try {
    const text = String(req.body?.text || "").trim();
    const voice = TTS_VOICES[String(req.body?.voice || "")] || "Kore";

    if (!text) return res.status(400).json({ error: "Seslendirilecek metin gerekli." });

    // Tek paragraf sinirini asan metin fonksiyon suresini zorlar.
    if (text.length > 3000) {
      return res.status(400).json({ error: "Metin tek seferde seslendirilemeyecek kadar uzun." });
    }

    const ai = getGeminiClient();

    // Modele nasil OKUYACAGINI soyluyoruz: TTS modeli metnin basindaki
    // yonergeyi seslendirmiyor, uslup olarak uyguluyor.
    const prompt =
      "Read the following story aloud in a warm, natural storytelling voice, " +
      "at a calm pace suitable for an English learner. Do not add any words " +
      "of your own:\n\n" + text;

    let lastError: any = null;

    for (const model of GEMINI_TTS_MODELS) {
      try {
        const response: any = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
            },
          } as any,
        });

        const part = response?.candidates?.[0]?.content?.parts?.find(
          (p: any) => p?.inlineData?.data
        );
        const base64 = part?.inlineData?.data;

        if (!base64) {
          lastError = new Error("Model ses dondurmedi.");
          continue;
        }

        const mime = part.inlineData.mimeType || "";
        const pcm = Buffer.from(base64, "base64");

        // Model bazen dogrudan calinabilir bir bicim donebiliyor;
        // yalnizca ham PCM'i sarmaliyoruz.
        const isRawPcm = /L16|pcm/i.test(mime);
        const audio = isRawPcm ? pcmToWav(pcm, sampleRateFromMime(mime)) : pcm;

        return res.json({
          audio: audio.toString("base64"),
          mimeType: isRawPcm ? "audio/wav" : mime || "audio/wav",
          voice,
          model,
        });
      } catch (err) {
        lastError = err;
        // Kota hatasinda diger modeli denemek anlamsiz: ayni kotayi paylasirlar.
        if (isRateLimitError(err)) break;
      }
    }

    throw lastError || new Error("Ses uretilemedi.");
  } catch (error: any) {
    console.error("Error in /api/speak:", error);
    const isQuota = isRateLimitError(error);
    res.status(isQuota ? 429 : 500).json({
      error: isQuota ? describeRateLimit(error) : formatErrorMessage(error, "Ses uretilemedi."),
    });
  }
});

app.post("/api/extract-vocabulary", async (req, res) => {
  try {
    const { text, count } = req.body;
    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "Metin gereklidir." });
    }

    const target = Math.min(40, Math.max(8, Number(count) || 20));
    const ai = getAIClient();

    const prompt = `Asagidaki Ingilizce konusma metnini incele ve ogrenciye kart olarak calistirilacak ifadeleri ayikla.

METIN:
"${String(text).slice(0, 14000)}"

NE ARIYORUZ (onem sirasiyla):
1. B2-C1 seviyesinde tek kelimeler (A1-B1 seviyesi temel kelimeleri ALMA: go, make, good, people gibi)
2. Phrasal verb'ler (bring up, come across, figure out...)
3. Kalip ifadeler / collocation'lar (make a decision, take responsibility, raise awareness...)
4. Deyimler (idiom)
5. GERCEK DIYALOG KALIPLARI: konusma dilinde gecen, gunluk sohbette dogrudan kullanilabilecek ifadeler
   (to be honest, the thing is, that said, as far as I'm concerned...)

KESIN KURALLAR:
- SADECE metinde GERCEKTEN GECEN ifadeleri al. Uydurma.
- A2 ve altindaki basit kelimeleri alma.
- TAM OLARAK ${target} adet dondur. Metinde bu kadar ileri seviye ifade yoksa,\n  B1 seviyesindeki faydali kaliplarla tamamla. Sayiyi eksik birakma.
- "contextEn" alanina ifadenin metinde gectigi cumleyi AYNEN yaz.
- "level" alani A1, A2, B1, B2, C1 veya C2 olmali; agirlik B2-C1'de olsun.
  Her ifade icin GERCEKTEN karar ver, hepsine B2 yazma: olcut, ifadeyi
  hangi seviyedeki ogrencinin bilmesinin beklendigidir.
- "kind" alani: word, phrasal_verb, collocation, idiom veya expression.
- "pos" alani ifadenin SOZ TURU: noun, verb, adjective, adverb, preposition,
  pronoun, conjunction, determiner, interjection veya phrase. Metindeki
  KULLANIMINA gore sec (ayni kelime baska cumlede baska tur olabilir).
- Ceviriler ("back") dogal Turkce olsun, sozluk kalibi degil.`;

    const response = await generateContentWithRetry(ai, {
      contents: prompt,
      jsonHint: '{"items":[{"front":"","back":"","ipa":"","kind":"word","pos":"","level":"","exampleEn":"","exampleTr":"","contextEn":""}]}',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_COACH,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                  ipa: { type: Type.STRING },
                  kind: { type: Type.STRING },
                  pos: { type: Type.STRING },
                  level: { type: Type.STRING },
                  exampleEn: { type: Type.STRING },
                  exampleTr: { type: Type.STRING },
                  contextEn: { type: Type.STRING },
                },
                required: ["front", "back", "kind", "pos", "level"],
              },
            },
          },
          required: ["items"],
        },
      },
    });

    let items: any[] = [];
    try {
      const parsed = JSON.parse(response.text || "{}");
      items = Array.isArray(parsed.items) ? parsed.items : [];
    } catch (e) {
      console.warn("[Vocabulary] parse hatasi:", e);
    }

    const allowedKinds = ["word", "phrasal_verb", "collocation", "idiom", "expression"];
    const seen = new Set<string>();

    const cleaned = items
      .filter((it) => it && typeof it.front === 'string' && typeof it.back === 'string')
      .map((it) => ({
        front: String(it.front).trim(),
        back: String(it.back).trim(),
        ipa: it.ipa ? String(it.ipa).trim() : undefined,
        kind: allowedKinds.includes(it.kind) ? it.kind : undefined,
        pos: normalizePartOfSpeech(it.pos),
        level: normalizeCefrLevel(it.level),
        exampleEn: it.exampleEn ? String(it.exampleEn).trim() : undefined,
        exampleTr: it.exampleTr ? String(it.exampleTr).trim() : undefined,
        contextEn: it.contextEn ? String(it.contextEn).trim() : undefined,
      }))
      .filter((it) => {
        if (!it.front || !it.back) return false;
        const key = it.front.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, target);

    res.json({ items: cleaned });
  } catch (error: any) {
    console.error("Error in /api/extract-vocabulary:", error);
    const isQuota = isRateLimitError(error);
    res.status(isQuota ? 429 : 500).json({
      error: isQuota ? describeRateLimit(error) : formatErrorMessage(error, "Kelimeler ayiklanamadi."),
    });
  }
});

// 1e. Kullanicinin metinden sectigi tek bir kelime/ifade icin kart bilgisi uretir.
/**
 * Kelime listesinde bulunmayan kelimelerin CEFR seviyesini belirler.
 *
 * Yerel liste (shared/vocab/cefrWords.json) 9394 kelime kapsiyor ve gercek
 * metinlerin %86-99'unu karsiliyor; buraya yalnizca ARTAKALAN uzmanlik
 * kelimeleri gelir (neuroplasticity, acetylcholine gibi). Istemci sonuclari
 * onbellekte tuttugu icin ayni kelime ikinci kez sorulmaz.
 */
app.post("/api/classify-cefr", async (req, res) => {
  try {
    const raw = Array.isArray(req.body?.words) ? req.body.words : [];
    // Bosluk da kabul edilir: "carry out" gibi cok sozcuklu kaliplarin
    // seviyesi de buradan soruluyor.
    const words = [...new Set(
      raw.map((w: any) => String(w || '').trim().toLowerCase().replace(/\s+/g, ' '))
         .filter((w: string) => /^[a-z][a-z' -]*$/.test(w) && w.length <= 40)
    )].slice(0, 60);

    if (words.length === 0) {
      return res.json({ levels: {} });
    }

    const ai = getAIClient();

    const prompt = `Asagidaki Ingilizce kelime ve kaliplarin her birine CEFR seviyesi ver.

MADDELER: ${words.join(', ')}

Kurallar:
- Seviye yalnizca su altidan biri olabilir: A1, A2, B1, B2, C1, C2
- Zorlugu bir Ingilizce OGRENCISI icin dusun; ana dili Ingilizce olan
  biri icin degil.
- Uzmanlik/teknik terimler (tip, sinirbilim, hukuk) genellikle C1 veya C2.
- BOSLUK iceren maddeler cok sozcuklu kaliptir (phrasal verb, deyim).
  Seviyeyi kaliba BUTUN olarak ver, tek tek kelimelerine gore degil:
  "carry out" B2'dir, "carry" A1 olsa bile. Anlami parcalarindan
  cikarilabilen duz birlesimler ("talk to") dusuk seviyededir.
- Emin olamadigin maddede tahmin et, atlama; her madde icin bir satir
  dondur.
- Maddeyi verildigi gibi, kucuk harfle geri yaz.`;

    const response = await generateContentWithRetry(ai, {
      contents: prompt,
      jsonHint: '{"items":[{"word":"neuroplasticity","level":"C2"}]}',
      config: {
        systemInstruction:
          "Sen CEFR seviyelendirmesi yapan bir dil olcme uzmanisin. Yalnizca istenen JSON'u dondur.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  level: { type: Type.STRING },
                },
                required: ["word", "level"],
              },
            },
          },
          required: ["items"],
        },
      },
    });

    let parsed: any = {};
    try {
      parsed = JSON.parse(response.text || "{}");
    } catch (e) {
      console.warn("[ClassifyCEFR] parse hatasi:", e);
    }

    const ALLOWED = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const requested = new Set(words);
    const levels: Record<string, string> = {};

    for (const item of Array.isArray(parsed.items) ? parsed.items : []) {
      const word = String(item?.word || '').trim().toLowerCase();
      const level = String(item?.level || '').trim().toUpperCase();
      // Modelin uydurdugu, sorulmamis kelimeleri kabul etme
      if (requested.has(word) && ALLOWED.includes(level)) {
        levels[word] = level;
      }
    }

    res.json({ levels });
  } catch (error: any) {
    console.error("Error in /api/classify-cefr:", error);
    const isQuota = error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429;
    res.status(isQuota ? 429 : 500).json({
      error: isQuota
        ? describeRateLimit(error)
        : formatErrorMessage(error, "Kelime seviyeleri belirlenemedi."),
    });
  }
});

app.post("/api/define-word", async (req, res) => {
  try {
    const { word, context } = req.body;
    const term = String(word || '').trim();

    if (!term) {
      return res.status(400).json({ error: "Kelime veya ifade gereklidir." });
    }
    if (term.length > 120) {
      return res.status(400).json({ error: "Secilen metin cok uzun. Daha kisa bir ifade secin." });
    }

    const ai = getAIClient();

    const prompt = `Bir Ingilizce ogrencisi asagidaki ifadeyi karta eklemek istiyor.

IFADE: "${term}"
${context ? `GECTIGI CUMLE: "${String(context).slice(0, 500)}"` : ''}

Bu ifade icin kart bilgisi uret:
- "front": ifadenin duzeltilmis/normalize edilmis hali. Fiil cekimliyse mastar
  haline getir (running -> run, went -> go). Phrasal verb veya kalip ise oldugu
  gibi birak.
- "back": GECTIGI CUMLEDEKI anlamina gore dogal Turkce karsilik. Sozluk kalibi
  degil, akici bir ceviri. Kelimenin birden fazla anlami varsa bu baglamdakini sec.
- "ipa": telaffuz (IPA)
- "kind": word, phrasal_verb, collocation, idiom veya expression
- "pos": ifadenin SOZ TURU. Su degerlerden BIRI olmali:
    noun, verb, adjective, adverb, preposition, pronoun, conjunction,
    determiner, interjection, phrase
  BAGLAMA gore sec: ayni kelime cumleye gore farkli tur olabilir
  ("a long run" -> noun, "I run every day" -> verb). Cok kelimeli
  kaliplarda fiille baslayanlar "verb", digerleri "phrase".
- "level": ifadenin CEFR seviyesi. A1, A2, B1, B2, C1 veya C2.
  DIKKAT: burada varsayilan deger YOKTUR, her ifade icin gercekten karar ver.
  Olcut, ifadeyi hangi seviyedeki bir ogrencinin BILMESI beklenir:
    A1 = en temel 500 kelime (go, big, water)
    A2 = gunluk temel kelimeler (weather, decide, careful)
    B1 = orta duzey gunluk kelimeler (achieve, opportunity, complicated)
    B2 = soyut/akademik gunluk kelimeler (approach, significant, tackle)
    C1 = ileri, daha az sik kelimeler (compelling, undermine, discrepancy)
    C2 = nadir, edebi veya uzmanlik kelimeleri (ubiquitous, quintessential)
  Temel bir kelimeye B2 demek de nadir bir kelimeye B2 demek de hatadir.
- "exampleEn": ifadeyi kullanan YENI ve basit bir ornek cumle
- "exampleTr": ornek cumlenin Turkcesi`;

    const response = await generateContentWithRetry(ai, {
      contents: prompt,
      // NOT: sema orneginde seviye BOS birakiliyor. Burada "B2" yazdigi
      // surece model cogu kelimeye bakmadan B2 diyordu.
      jsonHint: '{"front":"","back":"","ipa":"","kind":"word","pos":"","level":"","exampleEn":"","exampleTr":""}',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_COACH,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING },
            back: { type: Type.STRING },
            ipa: { type: Type.STRING },
            kind: { type: Type.STRING },
            pos: { type: Type.STRING },
            level: { type: Type.STRING },
            exampleEn: { type: Type.STRING },
            exampleTr: { type: Type.STRING },
          },
          required: ["front", "back", "kind", "pos", "level"],
        },
      },
    });

    let item: any = {};
    try {
      item = JSON.parse(response.text || "{}");
    } catch (e) {
      console.warn("[DefineWord] parse hatasi:", e);
    }

    const allowedKinds = ["word", "phrasal_verb", "collocation", "idiom", "expression"];

    // Seviye ve soz turu DOGRULANIR ama uydurulmaz: model gecerli bir
    // deger vermediyse alan bos birakilir. Istemci o durumda yerel CEFR
    // listesinden karar veriyor (bkz. shared/vocab/autoClassify.ts);
    // burada "B2" yazmak o mekanizmayi devre disi birakiyordu.
    const level = normalizeCefrLevel(item.level);
    const pos = normalizePartOfSpeech(item.pos);

    res.json({
      front: String(item.front || term).trim(),
      back: String(item.back || '').trim(),
      ipa: item.ipa ? String(item.ipa).trim() : undefined,
      kind: allowedKinds.includes(item.kind) ? item.kind : undefined,
      pos,
      level,
      exampleEn: item.exampleEn ? String(item.exampleEn).trim() : undefined,
      exampleTr: item.exampleTr ? String(item.exampleTr).trim() : undefined,
    });
  } catch (error: any) {
    console.error("Error in /api/define-word:", error);
    const isQuota = isRateLimitError(error);
    res.status(isQuota ? 429 : 500).json({
      error: isQuota ? describeRateLimit(error) : formatErrorMessage(error, "Kelime bilgisi alinamadi."),
    });
  }
});

/* ============================================================
   SUPABASE SENKRONIZASYONU
   ------------------------------------------------------------
   GUVENLIK NOTU: Supabase anahtarlari YALNIZCA sunucuda tutulur;
   tarayiciya hicbir zaman gonderilmez. Istemci kendi "senkron
   kodunu" gonderir, sunucu bunu hash'leyip veri alanini (space)
   belirler. Boylece giris ekrani olmadan da baskasinin verisine
   erisilemez.
   ============================================================ */

import crypto from "crypto";

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function supabaseReady(): boolean {
  return !!(SUPABASE_URL && SUPABASE_SERVICE_KEY);
}

/**
 * Senkron kodundan veri alani (space) uretir.
 * Kod duz metin olarak saklanmaz; yalnizca hash'i veritabanina gider.
 */
function spaceFromCode(code: string): string {
  const salt = process.env.SYNC_SALT || 'katmanli-ingilizce';
  return crypto.createHash('sha256').update(`${salt}:${code}`).digest('hex').slice(0, 32);
}

function readSyncCode(req: any): string | null {
  const code = String(req.body?.syncCode || req.query?.code || '').trim();
  if (code.length < 6) return null;
  return code;
}

async function supabaseFetch(path: string, init: any = {}): Promise<any> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase ${res.status}: ${body.slice(0, 300)}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Senkronun kullanilabilir olup olmadigini bildirir
app.get("/api/sync/status", (_req, res) => {
  res.json({ enabled: supabaseReady() });
});

// Degisiklikleri gonder (son yazan kazanir)
app.post("/api/sync/push", async (req, res) => {
  try {
    if (!supabaseReady()) {
      return res.status(503).json({ error: "Senkronizasyon yapilandirilmamis." });
    }

    const code = readSyncCode(req);
    if (!code) {
      return res.status(400).json({ error: "Senkron kodu en az 6 karakter olmali." });
    }

    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    if (items.length === 0) return res.json({ pushed: 0, serverTime: new Date().toISOString() });
    if (items.length > 500) {
      return res.status(400).json({ error: "Tek seferde en fazla 500 kayit gonderilebilir." });
    }

    const space = spaceFromCode(code);
    const rows = items.map((it: any) => ({
      space,
      key: String(it.key),
      value: it.value ?? {},
      deleted: !!it.deleted,
      updated_at: new Date().toISOString(),
    }));

    await supabaseFetch('sync_kv?on_conflict=space,key', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(rows),
    });

    res.json({ pushed: rows.length, serverTime: new Date().toISOString() });
  } catch (error: any) {
    console.error("Error in /api/sync/push:", error);
    res.status(500).json({ error: formatErrorMessage(error, "Veriler gonderilemedi.") });
  }
});

// Belirtilen tarihten sonraki degisiklikleri cek
app.post("/api/sync/pull", async (req, res) => {
  try {
    if (!supabaseReady()) {
      return res.status(503).json({ error: "Senkronizasyon yapilandirilmamis." });
    }

    const code = readSyncCode(req);
    if (!code) {
      return res.status(400).json({ error: "Senkron kodu en az 6 karakter olmali." });
    }

    const space = spaceFromCode(code);
    const since = req.body?.since ? new Date(req.body.since).toISOString() : '1970-01-01T00:00:00Z';

    const rows = await supabaseFetch(
      `sync_kv?space=eq.${encodeURIComponent(space)}&updated_at=gt.${encodeURIComponent(since)}&select=key,value,deleted,updated_at&order=updated_at.asc&limit=2000`
    );

    res.json({
      items: rows || [],
      serverTime: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in /api/sync/pull:", error);
    res.status(500).json({ error: formatErrorMessage(error, "Veriler alinamadi.") });
  }
});

// Ses kaydi yukle (base64). Kayitlar kisa oldugu icin tek parcada gonderiliyor.
app.post("/api/sync/upload-audio", async (req, res) => {
  try {
    if (!supabaseReady()) {
      return res.status(503).json({ error: "Senkronizasyon yapilandirilmamis." });
    }

    const code = readSyncCode(req);
    if (!code) return res.status(400).json({ error: "Senkron kodu gerekli." });

    const { path, dataBase64 } = req.body || {};
    if (!path || !dataBase64) {
      return res.status(400).json({ error: "Dosya yolu ve veri gerekli." });
    }

    const buffer = Buffer.from(String(dataBase64), 'base64');
    if (buffer.length > 4 * 1024 * 1024) {
      return res.status(413).json({ error: "Ses kaydi cok buyuk (en fazla 4 MB)." });
    }

    const space = spaceFromCode(code);
    const safePath = `${space}/${String(path).replace(/[^a-zA-Z0-9._/-]/g, '_')}`;

    const upRes = await fetch(`${SUPABASE_URL}/storage/v1/object/recordings/${safePath}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'audio/webm',
        'x-upsert': 'true',
      },
      body: buffer,
    });

    if (!upRes.ok) {
      const body = await upRes.text();
      throw new Error(`Storage ${upRes.status}: ${body.slice(0, 200)}`);
    }

    res.json({ ok: true, path: safePath });
  } catch (error: any) {
    console.error("Error in /api/sync/upload-audio:", error);
    res.status(500).json({ error: formatErrorMessage(error, "Ses kaydi yuklenemedi.") });
  }
});

// Ses kaydi indir
app.post("/api/sync/download-audio", async (req, res) => {
  try {
    if (!supabaseReady()) {
      return res.status(503).json({ error: "Senkronizasyon yapilandirilmamis." });
    }

    const code = readSyncCode(req);
    if (!code) return res.status(400).json({ error: "Senkron kodu gerekli." });

    const { path } = req.body || {};
    if (!path) return res.status(400).json({ error: "Dosya yolu gerekli." });

    const space = spaceFromCode(code);
    const safePath = `${space}/${String(path).replace(/[^a-zA-Z0-9._/-]/g, '_')}`;

    const dlRes = await fetch(`${SUPABASE_URL}/storage/v1/object/recordings/${safePath}`, {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    });

    if (!dlRes.ok) {
      return res.status(404).json({ error: "Kayit bulunamadi." });
    }

    const buffer = Buffer.from(await dlRes.arrayBuffer());
    res.json({ dataBase64: buffer.toString('base64') });
  } catch (error: any) {
    console.error("Error in /api/sync/download-audio:", error);
    res.status(500).json({ error: formatErrorMessage(error, "Ses kaydi indirilemedi.") });
  }
});

// 2. Phonetic & Grammar Analysis (Katman 2)
app.post("/api/analyze-phonetics-grammar", async (req, res) => {
  try {
    const { transcriptSentences } = req.body;
    const ai = getAIClient();

    const fullText = Array.isArray(transcriptSentences)
      ? transcriptSentences.map((s: any) => s.en).join(" ")
      : String(transcriptSentences);

    const prompt = `Katman 2: Fonetik ve Gramer Analizi (Aktif Dinleme & Sesli Okuma Destek)
Aşağıdaki metni incele:
"${fullText}"

Lütfen şu analizleri yapıp JSON döndür:
1. B2/C1 seviyesinde geçen 5-8 kritik kelime/phrasal verb, IPA okunuşları, Türkçe anlamı ve telaffuz ipucu.
2. Metinde veya ilgili seviyede geçen 3 kilit gramer yapısını (örneğin Passive Voice, Would, Relative Clauses veya Metindeki Önemli Yapılar) "Genelden Özele" mantığıyla açıkla. Her kural için Günlük Hayattan 3 farklı İngilizce örnek cümle ve Türkçe anlamlarını ver.`;

    const response = await generateContentWithRetry(ai, {
      contents: prompt,
      jsonHint: '{"vocabulary":[{"word":"","type":"","ipa":"","meaningTr":"","pronunciationNote":"","exampleSentence":""}],"grammarRules":[{"topic":"","explanationTr":"","examples":[{"en":"","tr":""}]}]}',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_COACH,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  type: { type: Type.STRING },
                  ipa: { type: Type.STRING },
                  meaningTr: { type: Type.STRING },
                  pronunciationNote: { type: Type.STRING },
                  exampleSentence: { type: Type.STRING }
                },
                required: ["word", "meaningTr", "pronunciationNote"]
              }
            },
            grammarRules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  explanationTr: { type: Type.STRING },
                  examples: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        en: { type: Type.STRING },
                        tr: { type: Type.STRING }
                      },
                      required: ["en", "tr"]
                    }
                  }
                },
                required: ["topic", "explanationTr", "examples"]
              }
            }
          },
          required: ["vocabulary", "grammarRules"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error in /api/analyze-phonetics-grammar:", error);
    const isQuota = error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429 || JSON.stringify(error).includes("429");
    const statusCode = isQuota ? 429 : 500;
    const msg = isQuota
      ? describeRateLimit(error)
      : formatErrorMessage(error, "Gramer analizi oluşturulurken hata oluştu.");
    res.status(statusCode).json({ error: msg });
  }
});

// 3. Generate Comprehension Quiz (Katman 3)
app.post("/api/generate-quiz", async (req, res) => {
  try {
    const { transcriptText } = req.body;
    const ai = getAIClient();

    const prompt = `Katman 3: Anlama Kontrolü (Altyazısız İzleme & Dinleme Sonrası Test)
Metne dayalı 5 adet İngilizce soru oluştur. Soruların 3 tanesi Çoktan Seçmeli (Multiple Choice - 4 şık), 2 tanesi Açık Uçlu (Open-ended) olsun.
Metin: "${transcriptText}"

JSON Formatı:
{
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "English question text",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctOptionIndex": 0,
      "explanationTr": "Neden A şıkkı doğru açıklaması"
    },
    {
      "id": 4,
      "type": "open_ended",
      "question": "English open question text",
      "sampleAnswerEn": "Ideal answer",
      "explanationTr": "Cevapta aranacak anahtar noktalar"
    }
  ]
}`;

    const response = await generateContentWithRetry(ai, {
      contents: prompt,
      jsonHint: '{"quizQuestions":[{"id":1,"type":"multiple_choice","question":"","options":["","","",""],"correctOptionIndex":0,"sampleAnswerEn":"","explanationTr":""}]}',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_COACH,
        responseMimeType: "application/json"
      }
    });

    const parsedQuiz = JSON.parse(response.text || "{}");
    const quizList = parsedQuiz.quizQuestions || parsedQuiz.questions || [];
    // App.tsx "quizQuestions" okuyor, prompt "questions" uretiyordu.
    // Arka planda uretilen quiz bu yuzden bos kaliyordu; iki anahtari da donduruyoruz.
    res.json({ quizQuestions: quizList, questions: quizList });
  } catch (error: any) {
    console.error("Error in /api/generate-quiz:", error);
    const isQuota = error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429 || JSON.stringify(error).includes("429");
    const statusCode = isQuota ? 429 : 500;
    const msg = isQuota
      ? describeRateLimit(error)
      : formatErrorMessage(error, "Quiz oluşturulamadı.");
    res.status(statusCode).json({ error: msg });
  }
});

// 4. Writing Evaluation (Katman 4)
app.post("/api/evaluate-writing", async (req, res) => {
  try {
    const { userText, topicContext } = req.body;
    if (!userText || !userText.trim()) {
      return res.status(400).json({ error: "Yazı metni boş olamaz." });
    }

    const ai = getAIClient();
    const prompt = `4. KATMAN: İngilizce Özet ve Yorum Değerlendirmesi
Konu Bağlamı: ${topicContext || "General Video Context"}
Kullanıcının İngilizce Özeti ve Yorumu:
"${userText}"

Lütfen kullanıcı metnini dikkatle incele ve JSON formatında geri bildirim sağla:
1. "grammarCorrections": Hatalı cümlelerin doğrusu, düzeltme sebebi ("Genelden Özele" gramer kuralı).
2. "naturalPhrasing": Cümlelerin bir 'native speaker' gibi daha doğal söylenebileceği alternatif öneriler.
3. "generalFeedback": Akışı bozmadan motivasyon ve bağlamsal değerlendirme (Türkçe).`;

    const response = await generateContentWithRetry(ai, {
      contents: prompt,
      jsonHint: '{"grammarCorrections":[{"original":"","corrected":"","explanationTr":""}],"naturalPhrasing":[{"original":"","nativeSuggestion":"","whyBetterTr":""}],"generalFeedback":""}',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_COACH,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            grammarCorrections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  corrected: { type: Type.STRING },
                  explanationTr: { type: Type.STRING }
                },
                required: ["original", "corrected", "explanationTr"]
              }
            },
            naturalPhrasing: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  nativeSuggestion: { type: Type.STRING },
                  whyBetterTr: { type: Type.STRING }
                },
                required: ["original", "nativeSuggestion", "whyBetterTr"]
              }
            },
            generalFeedback: { type: Type.STRING }
          },
          required: ["grammarCorrections", "naturalPhrasing", "generalFeedback"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error in /api/evaluate-writing:", error);
    const isQuota = error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429 || JSON.stringify(error).includes("429");
    const statusCode = isQuota ? 429 : 500;
    const msg = isQuota
      ? describeRateLimit(error)
      : formatErrorMessage(error, "Yazı değerlendirilemedi.");
    res.status(statusCode).json({ error: msg });
  }
});

// 5. Speaking Simulation (Katman 5)
app.post("/api/speaking-chat", async (req, res) => {
  try {
    const { currentStep, userResponse, conversationHistory, topicContext } = req.body;
    const ai = getAIClient();

    const prompt = `5. KATMAN: Konuşma ve Sesli Anlatım Simülasyonu
Video Konusu: ${topicContext}
Şu anki Adım: ${currentStep} (1, 2 veya 3. soru adımı).
Önceki Konuşma Geçmişi: ${JSON.stringify(conversationHistory || [])}
Kullanıcının Son Yanıtı: "${userResponse || ""}"

Kurallar:
- Video konusuna dayalı, kullanıcının kendi düşüncelerini ifade edebileceği sırayla 3 farklı soru soracağız.
- Eğer kullanıcı henüz ilk adımdaysa (currentStep = 1 ve userResponse yoksa), doğrudan 1. soruyu sor.
- Eğer kullanıcı bir yanıt verdiyse:
  1) Yanıtı için motive edici, kısa ve samimi bir geri bildirim ver (akıcılığa odaklan, gramer takıntısı yapma).
  2) Eğer henüz 3 soru tamamlanmadıysa (örn. 1. yanıt verildi -> 2. soruya geç, 2. yanıt verildi -> 3. soruya geç).
  3) Eğer 3. yanıt verildiyse, genel harika bir kapanış değerlendirmesi ve tebrik mesajı ver.
- Her seferinde TEK BIR soru sor veya kapanış mesajı ver.

JSON Formatı:
{
  "feedback": "Kullanıcının yanıtına kısa motive edici değerlendirme (varsa)",
  "nextQuestion": "İngilizce soru metni (varsa)",
  "nextQuestionTr": "Sorunun Türkçe açıklaması/ipucu",
  "step": 1 | 2 | 3 | "completed",
  "isCompleted": boolean
}`;

    const response = await generateContentWithRetry(ai, {
      contents: prompt,
      jsonHint: '{"feedback":"","nextQuestion":"","nextQuestionTr":"","step":1,"isCompleted":false}',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_COACH,
        responseMimeType: "application/json"
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error in /api/speaking-chat:", error);
    const isQuota = error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429 || JSON.stringify(error).includes("429");
    const statusCode = isQuota ? 429 : 500;
    const msg = isQuota
      ? describeRateLimit(error)
      : formatErrorMessage(error, "Konuşma simülasyonunda hata oluştu.");
    res.status(statusCode).json({ error: msg });
  }
});

// Quick AI Grammar Assistant Drawer Endpoint
app.post("/api/ask-grammar-coach", async (req, res) => {
  try {
    const { question, context } = req.body;
    const ai = getAIClient();

    const prompt = `Bağlam: "${context || ""}"
Kullanıcı Sorusu: "${question}"

"Genelden Özele" gramer yaklaşımıyla açıkla:
1. Sadece soruyla doğrudan ilgili gramer kuralını karmaşaya girmeden özetle.
2. Günlük hayattan 3 anlaşılır İngilizce örnek cümle ve Türkçe karşılıklarını ver.
3. Motive edici ve samimi bir dil kullan.`;

    const response = await generateContentWithRetry(ai, {
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_COACH
      }
    });

    res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Error in /api/ask-grammar-coach:", error);
    const isQuota = error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429 || JSON.stringify(error).includes("429");
    const statusCode = isQuota ? 429 : 500;
    const msg = isQuota
      ? describeRateLimit(error)
      : formatErrorMessage(error, "Gramer koçu yanıt veremedi.");
    res.status(statusCode).json({ error: msg });
  }
});

// Netlify Functions ortaminda Express uygulamasi disaridan sarmalanir;
// kendi portunu dinlemez ve statik dosyalari kendisi servis etmez.
export { app };

async function startServer() {
  // Serve Vite dev server or static dist
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

// AI Studio / Cloud Run / yerel gelistirmede sunucuyu ayaga kaldir.
// Netlify Functions altinda calisirken bu blok atlanir.
if (!process.env.NETLIFY && !process.env.LAMBDA_TASK_ROOT) {
  startServer();
}
