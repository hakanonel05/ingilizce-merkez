/* TELAFFUZ RAPORU AYRIŞTIRICISI (Markdown -> yapı)
 *
 * KAYNAK: AI Studio'da ayrı bir uygulama olarak geliştirilen telaffuz
 * değerlendirme projesinden taşındı (pronunciation-assessment-ai).
 * Mantığı büyük ölçüde olduğu gibi korundu — çalışan bir ayrıştırıcıyı
 * yeniden yazmak, kazancı olmayan bir hata kaynağı olurdu.
 *
 * TEK DEĞİŞEN YER, ve ölçümle bulundu: 4. bölümdeki (düzeltme önerileri)
 * kelime/IPA çıkarma. Özgün desen, düz metin bir maddedeki "en-US"
 * tiresini ve cümle içindeki iki eğik çizgiyi IPA sanıp anlamsız satırlar
 * üretiyordu. Gerekçesi ve iki somut örnek, aşağıda ilgili bloğun başında.
 * Gerisi (bölüm ayrıştırma, işaretler, sayımlar, zaman damgası) aynen
 * duruyor.
 */

import { getWordPhonetics, normalizeWord } from '../data/ipaSozlugu';

export interface ParsedMetric {
  name: string;
  key: "accuracy" | "fluency" | "completeness" | "prosody";
  score: number;
  rating: string;
  description: string;
}

export interface ErrorFilterState {
  mispronounced: boolean;
  omission: boolean;
  addition: boolean;
  unexpectedPause: boolean;
  missingPause: boolean;
  monotone: boolean;
  errorHighlighter: boolean; // New highlighter toggle state
}

export interface PhoneticDetail {
  ipa: string;
  tip: string;
  stress?: string;
  isCustomSuggestion?: boolean;
}

export interface WordTimeRange {
  start: number;
  end: number;
  text?: string;
}

export interface ParsedSentenceToken {
  id: string;
  text: string;
  type: "normal" | "mispronounced" | "omission" | "addition" | "pause";
  raw: string;
  cleanWord: string;
  isWeak?: boolean;
  phoneticDetail?: PhoneticDetail;
  timeRange?: WordTimeRange;
}

export interface PhoneticSuggestionItem {
  raw: string;
  word: string;
  cleanWord: string;
  ipa: string;
  tip: string;
  timeRange?: WordTimeRange;
}

export interface ParsedReport {
  overallScore: number;
  rawSentence: string;
  tokens: ParsedSentenceToken[];
  errors: {
    mispronounced: number;
    omission: number;
    addition: number;
    unexpectedPause: number;
    missingPause: number;
    monotone: number;
  };
  metrics: {
    accuracy: number;
    fluency: number;
    completeness: number;
    prosody: number;
  };
  suggestions: string[];
  parsedSuggestions: PhoneticSuggestionItem[];
  targetText: string;
}

export function parseAssessmentReport(markdown: string, fallbackTarget = ""): ParsedReport {
  // 1. Extract Overall Score
  let overallScore = 0;
  const overallMatch = markdown.match(/Genel Telaffuz Puanı:\s*\*?\*?\s*(\d{1,3})/i);
  if (overallMatch) {
    overallScore = parseInt(overallMatch[1], 10);
  }

  // 2. Extract Reviewed Sentence (Section 1)
  let rawSentence = "";
  const sentenceMatch = markdown.match(/#### 1\. İncelenen Cümle\s*\n+([\s\S]*?)(?=\n+#### 2|\n+---|$)/i);
  if (sentenceMatch) {
    rawSentence = sentenceMatch[1]
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("-") && !line.startsWith("["))
      .join(" ")
      .trim();
    
    // If empty because user guidelines were in brackets, find first non-bracket line
    if (!rawSentence) {
      const lines = sentenceMatch[1].split("\n").map(l => l.trim()).filter(Boolean);
      rawSentence = lines.find(l => !l.startsWith("-") && !l.startsWith("[")) || lines[0] || "";
    }
  }

  // Tokenize sentence into visual parts
  const tokens: ParsedSentenceToken[] = [];
  if (rawSentence) {
    // Regex for:
    // **[word]** -> mispronounced
    // ~~word~~ -> omission
    // *(word)* or *(word)* -> addition
    // [--] or `--` -> pause
    const regex = /(\*\*\[.*?\]\*\*|\~\~.*?\~\~|\*\([^\)]*\)\*|\[--\]|[^\s]+)/g;
    let match: RegExpExecArray | null;
    let idx = 0;

    while ((match = regex.exec(rawSentence)) !== null) {
      const piece = match[0];
      let type: ParsedSentenceToken["type"] = "normal";
      let cleanWord = piece;

      if (piece.includes("[--]")) {
        type = "pause";
        cleanWord = "[--]";
      } else if (piece.startsWith("**[") || (piece.startsWith("[") && piece.endsWith("]"))) {
        type = "mispronounced";
        cleanWord = piece.replace(/[\*\[\]]/g, "").trim();
      } else if (piece.startsWith("~~") && piece.endsWith("~~")) {
        type = "omission";
        cleanWord = piece.replace(/[\~]/g, "").trim();
      } else if (piece.startsWith("*(") && piece.endsWith(")*")) {
        type = "addition";
        cleanWord = piece.replace(/[\*\(\)]/g, "").trim();
      } else {
        cleanWord = piece.replace(/[.,!?;:"'()]/g, "").trim();
      }

      tokens.push({
        id: `tok-${idx++}`,
        text: cleanWord || piece,
        type,
        raw: piece,
        cleanWord,
      });
    }
  }

  // 3. Extract Error Summary (Section 2)
  const errors = {
    mispronounced: 0,
    omission: 0,
    addition: 0,
    unexpectedPause: 0,
    missingPause: 0,
    monotone: 0,
  };

  const getCount = (regex: RegExp): number => {
    const m = markdown.match(regex);
    return m ? parseInt(m[1], 10) : 0;
  };

  errors.mispronounced = getCount(/Hatalı Telaffuzlar:\*?\*?\s*(\d+)/i);
  errors.omission = getCount(/Çıkarmalar.*:\*?\*?\s*(\d+)/i);
  errors.addition = getCount(/Eklemeler:\*?\*?\s*(\d+)/i);
  errors.unexpectedPause = getCount(/Beklenmeyen Duraklama:\*?\*?\s*(\d+)/i);
  errors.missingPause = getCount(/Duraklama Eksik:\*?\*?\s*(\d+)/i);
  errors.monotone = getCount(/Monotonluk:\*?\*?\s*(\d+)/i);

  // If counts were 0 from text but tokens exist, infer minimums
  if (errors.mispronounced === 0) {
    errors.mispronounced = tokens.filter((t) => t.type === "mispronounced").length;
  }
  if (errors.omission === 0) {
    errors.omission = tokens.filter((t) => t.type === "omission").length;
  }
  if (errors.addition === 0) {
    errors.addition = tokens.filter((t) => t.type === "addition").length;
  }
  if (errors.unexpectedPause === 0) {
    errors.unexpectedPause = tokens.filter((t) => t.type === "pause").length;
  }

  // 4. Extract Metrics (Section 3)
  const metrics = {
    accuracy: 75,
    fluency: 70,
    completeness: 85,
    prosody: 70,
  };

  const parseMetricScore = (name: string): number => {
    const reg = new RegExp(`${name}[^|\\n]*\\|\\s*(\\d{1,3})\\s*\\/\\s*100`, "i");
    const m = markdown.match(reg);
    if (m) return parseInt(m[1], 10);
    // fallback search:
    const reg2 = new RegExp(`${name}[^\\d]*(\\d{1,3})`, "i");
    const m2 = markdown.match(reg2);
    return m2 ? Math.min(100, parseInt(m2[1], 10)) : 70;
  };

  metrics.accuracy = parseMetricScore("Doğruluk Puanı");
  metrics.fluency = parseMetricScore("Akıcılık Puanı");
  metrics.completeness = parseMetricScore("Tamamlanma Puanı");
  metrics.prosody = parseMetricScore("Prosodi");

  // 5. Extract Suggestions (Section 4)
  const suggestions: string[] = [];
  const parsedSuggestions: PhoneticSuggestionItem[] = [];
  const sugMatch = markdown.match(/#### 4\. Düzeltme Önerileri\s*\n+([\s\S]*?)(?=\n+---|$)/i);
  if (sugMatch) {
    const lines = sugMatch[1].split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
        const cleanLine = trimmed.replace(/^[\*\-]\s*/, "");
        suggestions.push(cleanLine);

        // Extract optional timestamp e.g. (Ses Kaydı: 01.2s - 02.4s) or (Ses Kaydı: 01:24 - 01:30) or [75.2s - 78.4s]
        const timeMatch = cleanLine.match(
          /(?:\(|\[)(?:ses kaydı|kayıt|zaman|time)?\s*[:\-–]?\s*(\d{1,4}(?:\.\d+)?|\d{1,2}:\d{2}(?:\.\d+)?)\s*(?:s|sn|saniye)?\s*[-–]\s*(\d{1,4}(?:\.\d+)?|\d{1,2}:\d{2}(?:\.\d+)?)\s*(?:s|sn|saniye)?(?:\)|\])/i
        );
        let timeRange: WordTimeRange | undefined;
        if (timeMatch) {
          const parseTimeStr = (t: string) => {
            if (t.includes(":")) {
              const parts = t.split(":");
              if (parts.length === 2) {
                return (parseFloat(parts[0]) || 0) * 60 + (parseFloat(parts[1]) || 0);
              }
            }
            return parseFloat(t) || 0;
          };
          const start = parseTimeStr(timeMatch[1]);
          const end = parseTimeStr(timeMatch[2]);
          if (end > start) {
            timeRange = {
              start,
              end,
              text: `${timeMatch[1]}s - ${timeMatch[2]}s`,
            };
          }
        }

        /* YAPILANDIRILMIŞ AYRIŞTIRMA — kaynaktaki hâlinden DEĞİŞTİRİLDİ.
         *
         * Özgün sürüm satırdaki ilk `[a-zA-Z]+` dizisini kelime, ilk
         * `/.../` arasını da IPA sayıyordu. Ölçümde bu iki gerçek satırı
         * birden bozdu:
         *
         *   "…standart Amerikan İngilizcesi (en-US) kurallarına uygundur."
         *      -> kelime "en", tip "US) kurallarına uygundur."
         *      Düz metin bir cümleydi; "en-US"taki tire, yedek desendeki
         *      "kelime - tip" ayracına benzedi.
         *
         *   "**plausibility** (…): /ˌplɑː.zəˈbɪl.ə.t̬i/ - … ötümlü /z/ …"
         *      -> kelime "i", IPA "/ - Çok heceli … ötümlü /"
         *      Cümlenin İÇİNDEKİ iki eğik çizgi arasını IPA sandı.
         *
         * İki şart bunu kökten kesiyor:
         *   1. KALIN KELİME ŞART. Şablon düzeltmeleri "**Kelime**" ya da
         *      "**[Kelime]**" diye yazıyor; işareti olmayan satır düz
         *      metindir ve zorla alanlara sokulmamalı. Böyle satırlar
         *      `suggestions` içinde duruyor ve ekranda düz metin olarak
         *      gösteriliyor — kaybolmuyorlar.
         *   2. IPA BOŞLUK İÇEREMEZ. Gerçek bir sesletim ("/θɔːt/") bitişik
         *      yazılır; cümle ortasından kazara yakalanan aralıkta her
         *      zaman boşluk var. Tek koşul, yukarıdaki ikinci hatayı
         *      olanaksız kılıyor.
         */
        const kalin = cleanLine.match(/\*\*\[?([A-Za-z][A-Za-z'’\-]*)\]?\*\*/);
        if (kalin) {
          const kalinSonu = (kalin.index ?? 0) + kalin[0].length;
          const kalan = cleanLine.slice(kalinSonu);
          const ipaEsi = kalan.match(/\/([^\/\s]{1,48})\//);
          const ipa = ipaEsi ? `/${ipaEsi[1]}/` : "";

          /* Tip: IPA'dan sonrası; IPA yoksa kalın kelimeden sonrası.
             Baştaki ayraçlar ve zaman damgası parantezi atılıyor. */
          const tipHam = ipaEsi
            ? kalan.slice((ipaEsi.index ?? 0) + ipaEsi[0].length)
            : kalan;
          const tip = tipHam
            .replace(/^\s*\([^)]*\)\s*/, "")
            .replace(/^\s*[:\-–]\s*/, "")
            .trim();

          parsedSuggestions.push({
            raw: cleanLine,
            word: kalin[1].trim(),
            cleanWord: normalizeWord(kalin[1]),
            ipa,
            tip: tip || cleanLine,
            timeRange,
          });
        }
      }
    }
  }

  // Build suggestion lookup map
  const suggestionMap = new Map<string, PhoneticSuggestionItem>();
  for (const s of parsedSuggestions) {
    if (s.cleanWord) {
      suggestionMap.set(s.cleanWord, s);
    }
  }

  /* TEKRAR EDEN KELİMELER — kaynaktaki hâlinden DEĞİŞTİRİLDİ.
   *
   * Öneri eşlemesi kelimeye göre kurulu ("thought" -> öneri), tokenlar da
   * kelimeye göre aranıyordu. Sonuç: bir kelime cümlede birden çok geçiyorsa
   * HEPSİ hatalı işaretleniyordu. Ölçtüm: model "I **[thought]** a thought
   * … I ~~thought~~ I **[thought]**" diye İKİ kelimeyi işaretlediği bir
   * raporda ekranda ALTI kelime kehribar çıktı — doğru söylenenler ve
   * atlanan bile dahil. Kullanıcıya yapmadığı hatayı göstermek, bu
   * özelliğin en zarar verici kusuru.
   *
   * Özgün davranışın AMACI yine de geçerli: model bazen bir kelimeyi
   * önerilerde anlatıp cümlede işaretlemeyi unutuyor; o kelimenin de
   * görünmesi gerekiyor. Ayrım şu: model o kelimeyi cümlede HİÇ
   * işaretlememişse öneriye güvenip işaretliyoruz; bir kez bile
   * işaretlemişse onun işaretine güveniyoruz ve başka geçişlerini
   * kendiliğinden boyamıyoruz. */
  const acikcaIsaretliler = new Set(
    tokens
      .filter((t) => t.type === "mispronounced")
      .map((t) => normalizeWord(t.cleanWord))
  );

  // 6. Enrich Tokens with Phonetic Information & Error Highlighting
  for (const token of tokens) {
    const norm = normalizeWord(token.cleanWord);
    const matchedSuggestion = suggestionMap.get(norm);
    const isMispronounced = token.type === "mispronounced";

    // Mark as weak if tagged mispronounced or mentioned specifically in suggestions
    if (isMispronounced || (matchedSuggestion && !acikcaIsaretliler.has(norm))) {
      token.isWeak = true;
      if (token.type === "normal" && matchedSuggestion && !acikcaIsaretliler.has(norm)) {
        token.type = "mispronounced";
      }
    }

    // Attach phonetic details
    if (token.type === "mispronounced" || token.isWeak) {
      if (matchedSuggestion?.timeRange) {
        token.timeRange = matchedSuggestion.timeRange;
      }
      if (matchedSuggestion && matchedSuggestion.ipa) {
        const dictInfo = getWordPhonetics(token.cleanWord);
        token.phoneticDetail = {
          ipa: matchedSuggestion.ipa,
          tip: matchedSuggestion.tip,
          stress: dictInfo.stress,
          isCustomSuggestion: true,
        };
      } else {
        const dictInfo = getWordPhonetics(
          token.cleanWord,
          matchedSuggestion?.tip
        );
        token.phoneticDetail = {
          ipa: dictInfo.ipa,
          tip: dictInfo.tip,
          stress: dictInfo.stress,
          isCustomSuggestion: false,
        };
      }
    } else if (norm && token.type === "normal") {
      // Normal word phonetics on demand
      const dictInfo = getWordPhonetics(token.cleanWord);
      token.phoneticDetail = {
        ipa: dictInfo.ipa,
        tip: dictInfo.tip,
        stress: dictInfo.stress,
        isCustomSuggestion: false,
      };
    }
  }

  // 7. Extract Target Text
  let targetText = fallbackTarget;
  const targetMatch = markdown.match(/Hedef Metin:\s*([^\n\r]+)/i);
  if (targetMatch && targetMatch[1].trim()) {
    targetText = targetMatch[1].trim();
  }

  return {
    overallScore,
    rawSentence,
    tokens,
    errors,
    metrics,
    suggestions,
    parsedSuggestions,
    targetText,
  };
}
