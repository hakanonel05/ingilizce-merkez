import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  Play,
  Pause,
  Download,
  Info,
  Volume2,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Highlighter,
  Activity,
  Mic,
  SlidersHorizontal,
} from "lucide-react";
import {
  ParsedReport,
  ErrorFilterState,
  parseAssessmentReport,
  ParsedSentenceToken,
  WordTimeRange,
} from '../../lib/telaffuzRaporu';
import { speakText, stopSpeaking, formatDuration } from '../../lib/konusmaSesi';
import { AudioWaveformVisualizer } from "./AudioWaveformVisualizer";
import { PhoneticPopover } from "./PhoneticPopover";

interface VisualAssessmentResultProps {
  markdown: string;
  targetText?: string;
  audioUrl?: string | null;
  audioBlob?: Blob | null;
}

export const VisualAssessmentResult: React.FC<VisualAssessmentResultProps> = ({
  markdown,
  targetText = "",
  audioUrl,
  audioBlob,
}) => {
  const parsed: ParsedReport = parseAssessmentReport(markdown, targetText);

  // Error type definitions with badge color, counts and tooltips
  const errorItems: Array<{
    key: keyof ErrorFilterState;
    label: string;
    count: number;
    badgeBg: string;
    badgeText: string;
    desc: string;
  }> = [
    {
      key: "mispronounced",
      label: "Hatalı telaffuzlar",
      count: parsed.errors.mispronounced,
      badgeBg: "bg-rose-600",
      badgeText: "text-white",
      desc: "Zayıf veya hatalı sesletilen kelimeler. Kırmızı ile işaretlenir; üzerine gelindiğinde IPA fonetik önerisi gösterilir.",
    },
    {
      key: "omission",
      label: "Çıkarmalar",
      count: parsed.errors.omission,
      badgeBg: "bg-[#64748b]",
      badgeText: "text-white",
      desc: "Metinde yer aldığı halde okunmayan veya atlanan kelimeler",
    },
    {
      key: "addition",
      label: "Eklemeler",
      count: parsed.errors.addition,
      badgeBg: "bg-[#991b1b]",
      badgeText: "text-white",
      desc: "Metinde bulunmadığı halde fazladan söylenen kelimeler",
    },
    {
      key: "unexpectedPause",
      label: "Beklenmeyen duraklama",
      count: parsed.errors.unexpectedPause,
      badgeBg: "bg-[#fbcfe8]",
      badgeText: "text-[#9d174d]",
      desc: "Cümle veya kelime öbeği akışını bozan yersiz duraksamalar",
    },
    {
      key: "missingPause",
      label: "Duraklama eksik",
      count: parsed.errors.missingPause,
      badgeBg: "bg-[#94a3b8]",
      badgeText: "text-white",
      desc: "Noktalama işaretlerinde veya doğal nefes paylarında yapılmayan duraklamalar",
    },
    {
      key: "monotone",
      label: "Monoton",
      count: parsed.errors.monotone,
      badgeBg: "bg-[#7e22ce]",
      badgeText: "text-white",
      desc: "Doğal tonlama ve vurgu içermeyen düz konuşma uyarısı",
    },
  ];

  // Filter toggles for Hatalar sidebar
  const [filters, setFilters] = useState<ErrorFilterState>({
    mispronounced: true,
    omission: true,
    addition: true,
    unexpectedPause: true,
    missingPause: true,
    monotone: true,
    errorHighlighter: true,
  });

  // Metric explanations data
  const METRIC_EXPLANATIONS: Record<
    string,
    { title: string; subtitle: string; description: string; impact: string; iconColor: string }
  > = {
    overall: {
      title: "Genel Telaffuz Puanı",
      subtitle: "Konuşmanın genel anlaşılırlık ve doğallık düzeyi",
      description:
        "Tüm fonetik doğruluk, akıcılık, tamlık ve prosodi (tonlama) ölçümlerinin ağırlıklı ortalamasıdır. 80 ve üzeri puan, ana dili İngilizce olan biri için son derece net ve akıcı bir seviyeyi temsil eder.",
      impact: "Doğruluk (%40), Akıcılık (%25), Tamamlanma (%20) ve Prosodi (%15) ağırlıklıdır.",
      iconColor: "text-sky-600",
    },
    accuracy: {
      title: "Doğruluk Puanı (Accuracy)",
      subtitle: "Sesletim ve Fonem Doğruluğu",
      description:
        "Hedef metindeki kelimelerin ve içlerindeki ses birimlerinin (ünlü/ünsüz fonemler) uluslararası fonetik alfabeye (IPA) göre ne kadar doğru sesletildiğini ölçer.",
      impact: "Hatalı çıkarılan harfler, yutulan sesler veya ana dilden aktarılan yanlış telaffuzlar puanı düşürür.",
      iconColor: "text-emerald-600",
    },
    fluency: {
      title: "Akıcılık Puanı (Fluency)",
      subtitle: "Konuşma Ritmi ve Duraklama Doğallığı",
      description:
        "Konuşmanın ne kadar pürüzsüz aktığını ve doğal konuşma temposunu (hız, ritim, bağlama) ölçer. Cümledeki kelimelerin birbirine akıcı bir şekilde bağlanması (connected speech) değerlendirilir.",
      impact: "Cümle ortasında yapılan yersiz duraksamalar ([--]), tereddütler ve kekelemeler puanı düşürür.",
      iconColor: "text-blue-600",
    },
    completeness: {
      title: "Tamamlanma Puanı (Completeness)",
      subtitle: "Hedef Metnin Eksiksiz Okunma Oranı",
      description:
        "Hedef metinde yer alan kelimelerin kaçının okunduğunu denetler. Metindeki tüm kelimeler atlanmadan seslendirildiğinde bu puan 100/100 tam puan olur.",
      impact: "Okunmadan atlanan (~~kelime~~) veya yarıda kesilen kelimeler doğrudan puan kaybına neden olur.",
      iconColor: "text-purple-600",
    },
    prosody: {
      title: "Prozodi / Tonlama Puanı (Prosody)",
      subtitle: "Hece Vurgusu, Melodi ve Perde İniş-Çıkışı",
      description:
        "İngilizcedeki kelime içi hece vurgularını (stress) ve cümle seviyesindeki ses perdesi melodisini (intonation) inceler. Doğal konuşmada cümle sonları veya soru tonlamaları bu metrikle değerlendirilir.",
      impact: "Robotik, tekdüze (monoton) konuşma veya yanlış heceye yapılan aşırı vurgular puanı düşürür.",
      iconColor: "text-amber-600",
    },
  };

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Tooltip hover states
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [activePhoneticPopover, setActivePhoneticPopover] = useState<{
    token: ParsedSentenceToken;
    anchorEl: HTMLElement;
  } | null>(null);
  const phoneticHoverTimeoutRef = useRef<number | null>(null);
  const [showMetricGuide, setShowMetricGuide] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [showWaveformVisualizer, setShowWaveformVisualizer] = useState(true);

  // Active word snippet player state
  const [snippetPlaying, setSnippetPlaying] = useState<{
    word: string;
    mode: "user" | "target" | "compare-user" | "compare-target";
  } | null>(null);

  // Custom user adjustments for word boundaries (+/- seconds)
  const [wordTimeOffsets, setWordTimeOffsets] = useState<
    Record<string, { startOffset: number; endOffset: number }>
  >({});
  const snippetTimeoutRef = useRef<number | null>(null);

  const safeSetAudioCurrentTime = (time: number) => {
    if (audioRef.current && Number.isFinite(time) && !isNaN(time)) {
      try {
        const maxDur =
          Number.isFinite(audioRef.current.duration) && audioRef.current.duration > 0
            ? audioRef.current.duration
            : Math.max(10, Number.isFinite(duration) && duration > 0 ? duration : 10);
        const clamped = Math.max(0, Math.min(maxDur, time));
        audioRef.current.currentTime = clamped;
      } catch (e) {
        console.warn("Could not set audio currentTime:", e);
      }
    }
  };

  const formatSeconds = (sec: number) => {
    if (!Number.isFinite(sec) || isNaN(sec)) return "00.0";
    return sec < 10 ? `0${sec.toFixed(1)}` : sec.toFixed(1);
  };

  const getWordTiming = (
    word: string,
    timeRange?: WordTimeRange,
    fallbackIndex: number = 0
  ) => {
    const norm = word.toLowerCase().replace(/[^a-z0-9]/g, "");
    const offset = wordTimeOffsets[norm] || { startOffset: 0, endOffset: 0 };
    const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 6;

    if (
      timeRange &&
      Number.isFinite(timeRange.start) &&
      Number.isFinite(timeRange.end) &&
      timeRange.end > timeRange.start
    ) {
      const start = Math.max(
        0,
        timeRange.start + (Number.isFinite(offset.startOffset) ? offset.startOffset : 0)
      );
      const end = Math.min(
        safeDuration,
        timeRange.end + (Number.isFinite(offset.endOffset) ? offset.endOffset : 0)
      );
      const cleanStart = Number.isFinite(start) ? Math.round(start * 10) / 10 : 0;
      const cleanEnd = Number.isFinite(end)
        ? Math.max(cleanStart + 0.4, Math.round(end * 10) / 10)
        : cleanStart + 0.8;
      return {
        start: cleanStart,
        end: cleanEnd,
        text: `${formatSeconds(cleanStart)}s - ${formatSeconds(cleanEnd)}s`,
        isEstimated: false,
      };
    }

    const tokenIdx = parsed.tokens.findIndex(
      (t) => t.cleanWord.toLowerCase().replace(/[^a-z0-9]/g, "") === norm
    );
    const resolvedIdx = tokenIdx >= 0 ? tokenIdx : fallbackIndex;
    const totalTokens = Math.max(1, parsed.tokens.length);
    const totalDur = safeDuration;

    const startRatio = resolvedIdx / totalTokens;
    const endRatio = (resolvedIdx + 1.25) / totalTokens;

    let start = Math.max(
      0,
      startRatio * totalDur - 0.25 + (Number.isFinite(offset.startOffset) ? offset.startOffset : 0)
    );
    let end = Math.min(
      totalDur,
      endRatio * totalDur + 0.35 + (Number.isFinite(offset.endOffset) ? offset.endOffset : 0)
    );

    if (!Number.isFinite(start)) start = 0;
    if (!Number.isFinite(end) || end <= start) end = start + 0.8;

    if (end - start < 0.8) {
      end = Math.min(totalDur, start + 0.8);
    }

    const cleanStart = Math.round(start * 10) / 10;
    const cleanEnd = Math.max(cleanStart + 0.5, Math.round(end * 10) / 10);

    return {
      start: Number.isFinite(cleanStart) ? cleanStart : 0,
      end: Number.isFinite(cleanEnd) ? cleanEnd : 1,
      text: `${formatSeconds(Number.isFinite(cleanStart) ? cleanStart : 0)}s - ${formatSeconds(
        Number.isFinite(cleanEnd) ? cleanEnd : 1
      )}s`,
      isEstimated: true,
    };
  };

  const adjustWordTime = (word: string, deltaStart: number, deltaEnd: number) => {
    const norm = word.toLowerCase().replace(/[^a-z0-9]/g, "");
    setWordTimeOffsets((prev) => {
      const curr = prev[norm] || { startOffset: 0, endOffset: 0 };
      return {
        ...prev,
        [norm]: {
          startOffset: Math.round((curr.startOffset + deltaStart) * 10) / 10,
          endOffset: Math.round((curr.endOffset + deltaEnd) * 10) / 10,
        },
      };
    });
  };

  const stopAllSnippet = () => {
    if (snippetTimeoutRef.current) {
      clearTimeout(snippetTimeoutRef.current);
      snippetTimeoutRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    stopSpeaking();
    setSnippetPlaying(null);
  };

  const playUserWordSnippet = (
    word: string,
    timeRange?: WordTimeRange,
    fallbackIndex: number = 0,
    onEnd?: () => void
  ) => {
    stopAllSnippet();

    if (!audioUrl || !audioRef.current) {
      alert(
        "Bu cümlenin ses kaydı bulunamadı. Kendi söyleyişinizi dinleyebilmek için mikrofonla sesinizi kaydedin."
      );
      return false;
    }

    const { start, end } = getWordTiming(word, timeRange, fallbackIndex);
    const validStart = Number.isFinite(start) ? Math.max(0, start) : 0;
    const validEnd = Number.isFinite(end) ? Math.max(validStart + 0.4, end) : validStart + 0.8;
    const audio = audioRef.current;
    const durationMs = Math.max(400, (validEnd - validStart) * 1000);

    safeSetAudioCurrentTime(validStart);
    setCurrentTime(validStart);
    audio
      .play()
      .then(() => {
        setSnippetPlaying({
          word,
          mode: onEnd ? "compare-user" : "user",
        });

        snippetTimeoutRef.current = window.setTimeout(() => {
          audio.pause();
          snippetTimeoutRef.current = null;
          if (onEnd) {
            onEnd();
          } else {
            setSnippetPlaying(null);
          }
        }, durationMs);
      })
      .catch((err) => {
        console.warn("Audio play error:", err);
        setSnippetPlaying(null);
      });

    return true;
  };

  const playTargetWord = async (word: string) => {
    stopAllSnippet();
    setSnippetPlaying({ word, mode: "target" });
    await speakText(word);
    setSnippetPlaying(null);
  };

  const playComparison = (
    word: string,
    timeRange?: WordTimeRange,
    fallbackIndex: number = 0
  ) => {
    stopAllSnippet();

    const started = playUserWordSnippet(
      word,
      timeRange,
      fallbackIndex,
      async () => {
        setSnippetPlaying({ word, mode: "compare-target" });
        await new Promise((r) => setTimeout(r, 450));
        await speakText(word);
        setSnippetPlaying(null);
      }
    );

    if (!started) {
      playTargetWord(word);
    }
  };

  const seekToWord = (word: string, timeRange?: WordTimeRange, fallbackIndex: number = 0) => {
    const { start } = getWordTiming(word, timeRange, fallbackIndex);
    if (Number.isFinite(start)) {
      safeSetAudioCurrentTime(start);
      setCurrentTime(start);
    }
  };

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.load();
    }
    return () => {
      stopAllSnippet();
    };
  }, [audioUrl]);

  const toggleFilter = (key: keyof ErrorFilterState) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSeek = (time: number) => {
    if (Number.isFinite(time)) {
      safeSetAudioCurrentTime(time);
      setCurrentTime(time);
    }
  };

  const handlePlayToggle = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      // Fallback: speak the target text
      if (isPlaying) {
        window.speechSynthesis?.cancel();
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
        speakText(parsed.targetText || targetText).then(() => setIsPlaying(false));
      }
    }
  };

  const handleDownloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = `telaffuz_kaydi_${Date.now()}.webm`;
      a.click();
    } else {
      // Download markdown report
      const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `telaffuz_raporu_${Date.now()}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  // Color logic for scores
  const getScoreColor = (score: number) => {
    if (score < 60) return { bg: "bg-[#b91c1c]", text: "text-[#b91c1c]", stroke: "#b91c1c" };
    if (score < 80) return { bg: "bg-[#d97706]", text: "text-[#d97706]", stroke: "#d97706" };
    return { bg: "bg-[#15803d]", text: "text-[#15803d]", stroke: "#15803d" };
  };

  const overallColor = getScoreColor(parsed.overallScore);

  // SVG Gauge calculations
  const gaugeRadius = 46;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const scorePercent = Math.min(100, Math.max(0, parsed.overallScore));
  const strokeDashoffset = gaugeCircumference - (scorePercent / 100) * gaugeCircumference;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Visual Evaluation Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs text-stone-900 relative">
        {/* Top Header & Audio Player Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-100 rounded-t-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] sm:text-xs font-bold text-stone-400 tracking-widest uppercase">
              Değerlendirme Sonucu & Fonetik Analiz
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowWaveformVisualizer(!showWaveformVisualizer)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                  showWaveformVisualizer
                    ? "bg-orange-50 text-[#c2410c] border-orange-200"
                    : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
                }`}
                title="Sese göre değişen ses dalgalarını göster veya gizle"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{showWaveformVisualizer ? "Ses Dalgalarını Gizle" : "Ses Dalgaları"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMarkdown(!showMarkdown)}
                className="text-xs text-stone-500 hover:text-stone-800 font-medium px-2 py-1 rounded-lg hover:bg-stone-100 transition cursor-pointer"
              >
                {showMarkdown ? "Grafik Görünümüne Dön" : "Ham Markdown Raporu"}
              </button>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-3 w-full bg-[#fbfbf9] p-2.5 rounded-xl border border-stone-200/80">
            <button
              id="btn-eval-audio-play"
              type="button"
              onClick={handlePlayToggle}
              className="w-9 h-9 rounded-full bg-[#18181b] hover:bg-stone-800 text-white flex items-center justify-center transition shrink-0 active:scale-95 cursor-pointer shadow-xs"
              title={isPlaying ? "Durdur" : "Kaydı Dinle"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-white text-white" />
              ) : (
                <Play className="w-4 h-4 fill-white text-white ml-0.5" />
              )}
            </button>

            {/* Scrub bar */}
            <div className="flex-1 flex items-center gap-2">
              <div
                className="relative w-full h-2 bg-stone-200/80 rounded-full cursor-pointer overflow-visible"
                onClick={(e) => {
                  if (audioRef.current) {
                    const validDur = Number.isFinite(duration) && duration > 0 ? duration : 6;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = Math.max(0, Math.min(1, clickX / (rect.width || 1)));
                    const targetTime = pct * validDur;
                    if (Number.isFinite(targetTime)) {
                      safeSetAudioCurrentTime(targetTime);
                      setCurrentTime(targetTime);
                    }
                  }
                }}
              >
                {/* Active progress */}
                <div
                  className="absolute left-0 top-0 h-full bg-[#c2410c] rounded-full transition-all duration-75"
                  style={{
                    width: `${
                      Number.isFinite(duration) && duration > 0
                        ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
                        : 0
                    }%`,
                  }}
                />
                {/* Knob */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-[#c2410c] rounded-full shadow-xs -ml-1.5 pointer-events-none"
                  style={{
                    left: `${
                      Number.isFinite(duration) && duration > 0
                        ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
                        : 0
                    }%`,
                  }}
                />
              </div>

              <span className="text-xs font-mono text-stone-500 whitespace-nowrap min-w-[50px] text-right">
                {formatDuration(currentTime)}s
              </span>
            </div>

            <button
              id="btn-eval-audio-download"
              type="button"
              onClick={handleDownloadAudio}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition cursor-pointer"
              title="Kaydı / Raporu İndir"
            >
              <Download className="w-4 h-4" />
            </button>

            {audioUrl && (
              <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={() => {
                  if (audioRef.current && Number.isFinite(audioRef.current.currentTime)) {
                    setCurrentTime(audioRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (audioRef.current) {
                    const d = audioRef.current.duration;
                    if (Number.isFinite(d) && d > 0) {
                      setDuration(d);
                    } else {
                      setDuration(6);
                    }
                  }
                }}
                onDurationChange={() => {
                  if (audioRef.current) {
                    const d = audioRef.current.duration;
                    if (Number.isFinite(d) && d > 0) {
                      setDuration(d);
                    }
                  }
                }}
                onEnded={() => {
                  setIsPlaying(false);
                  setCurrentTime(0);
                }}
                className="hidden"
              />
            )}
          </div>

          {/* Waveform & Frequency Visualizer Component */}
          {showWaveformVisualizer && (
            <div className="mt-3.5">
              <AudioWaveformVisualizer
                audioUrl={audioUrl}
                audioBlob={audioBlob}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                onPlayToggle={handlePlayToggle}
                onSeek={handleSeek}
                audioRef={audioRef}
              />
            </div>
          )}
        </div>

        {/* Center Section: Sentence Display (Left) + Hatalar Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-slate-200">
          {/* Left: Sentence Canvas */}
          <div className="lg:col-span-8 p-5 sm:p-7 flex flex-col justify-between min-h-[220px] bg-white relative">
            {/* Hata Vurgulayıcı Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <Highlighter className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 tracking-tight">
                      Hata Vurgulayıcı
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        filters.errorHighlighter && filters.mispronounced
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {filters.errorHighlighter && filters.mispronounced
                        ? "Aktif (Kırmızı)"
                        : "Kapalı"}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 leading-tight">
                    Zayıf telaffuzlu kelimeler kırmızıyla işaretlenir. Fonetik (IPA) okunuş ve öneri için üzerine gelin.
                  </span>
                </div>
              </div>

              {/* Quick toggle button */}
              <button
                type="button"
                onClick={() => toggleFilter("errorHighlighter")}
                className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                  filters.errorHighlighter && filters.mispronounced
                    ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                }`}
                title="Kırmızı hata vurgulayıcıyı aç veya kapat"
              >
                <Highlighter className="w-3.5 h-3.5" />
                <span>
                  {filters.errorHighlighter && filters.mispronounced
                    ? "Vurguyu Kapat"
                    : "Kırmızı Vurguyu Aç"}
                </span>
              </button>
            </div>

            {/* Sentence Tokens Flow */}
            <div className="text-xl sm:text-2xl font-serif text-slate-900 leading-loose flex flex-wrap items-center gap-x-2 gap-y-3 py-2">
              {parsed.tokens.length > 0 ? (
                parsed.tokens.map((token) => {
                  // Check if highlight should be active based on filters
                  const isWeak =
                    (token.type === "mispronounced" || token.isWeak) &&
                    filters.mispronounced &&
                    filters.errorHighlighter;
                  const isOmission = token.type === "omission" && filters.omission;
                  const isAddition = token.type === "addition" && filters.addition;
                  const isPause = token.type === "pause" && filters.unexpectedPause;

                  if (isPause) {
                    return (
                      <motion.span
                        key={token.id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center justify-center px-1.5 py-0.5 mx-0.5 rounded bg-pink-100 text-pink-900 border border-pink-300 font-mono text-sm font-semibold tracking-tighter select-none"
                        title="Beklenmeyen Duraklama: Cümle akışını bölen yapay bekleme"
                      >
                        [--]
                      </motion.span>
                    );
                  }

                  if (isWeak) {
                    const isSelected = activePhoneticPopover?.token.id === token.id;
                    return (
                      <motion.span
                        key={token.id}
                        initial={{ opacity: 0.85 }}
                        animate={{ opacity: 1 }}
                        onMouseEnter={(e) => {
                          if (phoneticHoverTimeoutRef.current) {
                            clearTimeout(phoneticHoverTimeoutRef.current);
                            phoneticHoverTimeoutRef.current = null;
                          }
                          setActivePhoneticPopover({
                            token,
                            anchorEl: e.currentTarget,
                          });
                        }}
                        onMouseLeave={() => {
                          if (phoneticHoverTimeoutRef.current) {
                            clearTimeout(phoneticHoverTimeoutRef.current);
                          }
                          phoneticHoverTimeoutRef.current = window.setTimeout(() => {
                            setActivePhoneticPopover((prev) =>
                              prev?.token.id === token.id ? null : prev
                            );
                          }, 300);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (phoneticHoverTimeoutRef.current) {
                            clearTimeout(phoneticHoverTimeoutRef.current);
                            phoneticHoverTimeoutRef.current = null;
                          }
                          if (activePhoneticPopover?.token.id === token.id) {
                            setActivePhoneticPopover(null);
                          } else {
                            setActivePhoneticPopover({
                              token,
                              anchorEl: e.currentTarget,
                            });
                          }
                        }}
                        className={`px-2 py-0.5 rounded border-b-2 font-semibold cursor-pointer transition-all inline-flex items-center gap-1 shadow-2xs group select-none ${
                          isSelected
                            ? "bg-rose-200 text-rose-950 border-rose-700 ring-2 ring-rose-400/50"
                            : "bg-rose-100 text-rose-900 border-rose-600 hover:bg-rose-200 hover:text-rose-950"
                        }`}
                        title={`Zayıf telaffuz: '${token.cleanWord}' - Fonetik (IPA) önerisi ve sesletimi dinlemek için üzerine gelin veya dokunun`}
                      >
                        <span>{token.cleanWord}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse shrink-0" />
                      </motion.span>
                    );
                  }

                  if (isOmission) {
                    return (
                      <motion.span
                        key={token.id}
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                        className="line-through decoration-red-600 text-red-700 bg-red-50 px-1 py-0.5 rounded border border-red-200"
                        title="Atlanan (Okunmayan) Kelime"
                      >
                        {token.cleanWord}
                      </motion.span>
                    );
                  }

                  if (isAddition) {
                    return (
                      <motion.span
                        key={token.id}
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                        className="italic text-purple-700 bg-purple-50 px-1 py-0.5 rounded border border-purple-200"
                        title="Eklenen (Metinde Olmayan) Kelime"
                      >
                        ({token.cleanWord})
                      </motion.span>
                    );
                  }

                  // Normal word
                  return (
                    <span
                      key={token.id}
                      onClick={() => speakText(token.cleanWord)}
                      className="cursor-pointer hover:text-emerald-700 hover:underline transition"
                      title={`'${token.cleanWord}' sesletimini dinlemek için tıklayın`}
                    >
                      {token.raw}
                    </span>
                  );
                })
              ) : (
                <p className="text-slate-700">{parsed.rawSentence || targetText}</p>
              )}
            </div>

            {/* Quick Legend Footer */}
            <div className="pt-3 mt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-sans">
              <span className="font-semibold text-slate-700">İşaretler:</span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
                <span className="text-rose-800 font-medium">Kırmızı: Zayıf Telaffuz (IPA Önerili)</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-500" />
                <span className="line-through text-slate-600">Atlanan</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-purple-600" />
                <span className="italic text-purple-700">Eklenen</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-pink-300" />
                <span className="text-pink-800">[--] Duraklama</span>
              </span>
            </div>

            {/* Smart Clamped Phonetic Recommendation Popover */}
            <PhoneticPopover
              token={activePhoneticPopover?.token || null}
              isOpen={Boolean(activePhoneticPopover)}
              anchorEl={activePhoneticPopover?.anchorEl || null}
              onClose={() => setActivePhoneticPopover(null)}
              hasAudio={Boolean(audioUrl)}
              timeRangeText={
                activePhoneticPopover
                  ? getWordTiming(
                      activePhoneticPopover.token.cleanWord,
                      activePhoneticPopover.token.timeRange
                    ).text
                  : undefined
              }
              onPlayUserAudio={(word, token) => playUserWordSnippet(word, token.timeRange)}
              onPlayTargetAudio={(word) => playTargetWord(word)}
              onPlayComparison={(word, token) => playComparison(word, token.timeRange)}
              snippetPlaying={snippetPlaying}
              onMouseEnter={() => {
                if (phoneticHoverTimeoutRef.current) {
                  clearTimeout(phoneticHoverTimeoutRef.current);
                  phoneticHoverTimeoutRef.current = null;
                }
              }}
              onMouseLeave={() => {
                if (phoneticHoverTimeoutRef.current) {
                  clearTimeout(phoneticHoverTimeoutRef.current);
                }
                phoneticHoverTimeoutRef.current = window.setTimeout(() => {
                  setActivePhoneticPopover(null);
                }, 250);
              }}
            />
          </div>

          {/* Right: Hatalar Toggle Panel */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50/50 p-4 sm:p-5 flex flex-col justify-center">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Hatalar
            </h4>

            <div className="flex flex-col divide-y divide-slate-200/70">
              {errorItems.map((item) => {
                const isActive = filters[item.key];
                const isTooltipOpen = activeTooltip === item.key;

                return (
                  <div key={item.key} className="py-2 flex items-center justify-between gap-2 relative">
                    {/* Left: Badge + Label + Info */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-xs ${item.badgeBg} ${item.badgeText} text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs`}
                      >
                        {item.count}
                      </span>
                      <span className="text-xs font-medium text-slate-700">{item.label}</span>
                      <button
                        type="button"
                        onMouseEnter={() => setActiveTooltip(item.key)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        onClick={() => setActiveTooltip(isTooltipOpen ? null : item.key)}
                        className="text-slate-400 hover:text-slate-600 transition p-0.5"
                        title={item.desc}
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>

                      {/* Tooltip Popover */}
                      {isTooltipOpen && (
                        <div className="absolute left-6 top-8 z-30 w-52 p-2 bg-slate-900 text-white text-[11px] rounded-md shadow-lg border border-slate-700 pointer-events-none">
                          <p className="font-semibold text-slate-200 mb-0.5">{item.label}</p>
                          <p className="text-slate-300 leading-tight">{item.desc}</p>
                        </div>
                      )}
                    </div>

                    {/* Right: Switch + "Açık" text */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleFilter(item.key)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isActive ? "bg-sky-600" : "bg-slate-300"
                        }`}
                        title={`${item.label} vurgusunu aç/kapat`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                            isActive ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <span className="text-xs text-slate-600 font-medium min-w-[34px]">
                        {isActive ? "Açık" : "Kapalı"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section: Telaffuz Puanı Gauge (Left) + Puan Dökümü Progress Bars (Right) */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white">
          {/* Left: Telaffuz Puanı Gauge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6 relative">
            <div className="relative mb-3">
              <button
                type="button"
                onMouseEnter={() => setActiveTooltip("overall")}
                onMouseLeave={() => setActiveTooltip(null)}
                onClick={() => setActiveTooltip(activeTooltip === "overall" ? null : "overall")}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide hover:text-sky-600 transition cursor-pointer p-1 rounded-md"
                title={METRIC_EXPLANATIONS.overall.description}
              >
                <span>Telaffuz puanı</span>
                <Info className="w-3.5 h-3.5 text-sky-500" />
              </button>

              {/* Tooltip Popover for Overall Score */}
              {activeTooltip === "overall" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-8 z-40 w-72 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl border border-slate-700 pointer-events-auto">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 mb-1.5">
                    <span className="font-bold text-sky-400">
                      {METRIC_EXPLANATIONS.overall.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(null)}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium mb-1">
                    {METRIC_EXPLANATIONS.overall.subtitle}
                  </p>
                  <p className="text-[11px] text-slate-200 leading-relaxed mb-2">
                    {METRIC_EXPLANATIONS.overall.description}
                  </p>
                  <div className="text-[10px] bg-slate-800 p-2 rounded-lg text-slate-300 border border-slate-700">
                    <span className="font-semibold text-sky-300">Hesaplama: </span>
                    {METRIC_EXPLANATIONS.overall.impact}
                  </div>
                </div>
              )}
            </div>

            {/* Radial Donut Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                {/* Background track circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={gaugeRadius}
                  stroke="#e2e8f0"
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Animated colored score arc */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r={gaugeRadius}
                  stroke={overallColor.stroke}
                  strokeWidth="12"
                  strokeLinecap="round"
                  fill="transparent"
                  initial={{ strokeDashoffset: gaugeCircumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  style={{
                    strokeDasharray: gaugeCircumference,
                  }}
                />
              </svg>

              {/* Centered Score Number */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-4xl font-extrabold text-slate-900 tracking-tight"
                >
                  {parsed.overallScore}
                </motion.span>
              </div>
            </div>

            {/* Color Range Legend */}
            <div className="flex items-center justify-center gap-3 text-[11px] font-medium text-slate-600 mt-4">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#b91c1c] rounded-xs inline-block" />
                <span>0 ~ 59</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#d97706] rounded-xs inline-block" />
                <span>60 ~ 79</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#15803d] rounded-xs inline-block" />
                <span>80 ~ 100</span>
              </span>
            </div>
          </div>

          {/* Right: Puan Dökümü Grid */}
          <div className="md:col-span-8 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Puan dökümü
              </h4>
              <button
                type="button"
                onClick={() => setShowMetricGuide(!showMetricGuide)}
                className="text-xs text-sky-600 hover:text-sky-800 font-medium transition cursor-pointer flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{showMetricGuide ? "Rehberi Kapat" : "Metrikler Nedir?"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {[
                {
                  key: "accuracy",
                  label: "Doğruluk puanı",
                  score: parsed.metrics.accuracy,
                  delay: 0,
                },
                {
                  key: "fluency",
                  label: "Akıcılık puanı",
                  score: parsed.metrics.fluency,
                  delay: 0.15,
                },
                {
                  key: "completeness",
                  label: "Tamamlanma puanı",
                  score: parsed.metrics.completeness,
                  delay: 0.25,
                },
                {
                  key: "prosody",
                  label: "Prozodi puanı",
                  score: parsed.metrics.prosody,
                  delay: 0.35,
                },
              ].map((metric, idx) => {
                const info = METRIC_EXPLANATIONS[metric.key];
                const isTooltipOpen = activeTooltip === metric.key;
                const isRightCol = idx % 2 === 1;

                return (
                  <div key={metric.key} className="flex flex-col gap-1.5 relative">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                      {/* Metric Name + Info Button */}
                      <button
                        type="button"
                        onMouseEnter={() => setActiveTooltip(metric.key)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        onClick={() =>
                          setActiveTooltip(isTooltipOpen ? null : metric.key)
                        }
                        className="flex items-center gap-1.5 hover:text-sky-600 transition cursor-pointer text-left group"
                        title={info ? `${info.title}: ${info.description}` : metric.label}
                      >
                        <span className="group-hover:underline underline-offset-2">
                          {metric.label}
                        </span>
                        <Info className="w-3.5 h-3.5 text-sky-500 group-hover:text-sky-600 shrink-0" />
                      </button>

                      <span className="font-mono font-semibold text-slate-900">
                        {metric.score} / 100
                      </span>
                    </div>

                    {/* Metric Progress Bar */}
                    <div className="w-full h-2.5 bg-slate-200 rounded-xs overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.score}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: metric.delay }}
                        className={`h-full ${getScoreColor(metric.score).bg}`}
                      />
                    </div>

                    {/* Interactive Tooltip Popover */}
                    {isTooltipOpen && info && (
                      <div
                        className={`absolute ${
                          isRightCol ? "right-0" : "left-0"
                        } top-7 z-40 w-72 sm:w-80 max-w-[calc(100vw-2.5rem)] p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl border border-slate-700 pointer-events-auto`}
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 mb-1.5">
                          <span className={`font-bold ${info.iconColor}`}>
                            {info.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveTooltip(null)}
                            className="text-slate-400 hover:text-white text-xs"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-300 font-medium mb-1">
                          {info.subtitle}
                        </p>
                        <p className="text-[11px] text-slate-200 leading-relaxed mb-2">
                          {info.description}
                        </p>
                        <div className="text-[10px] bg-slate-800 p-2 rounded-lg text-slate-300 border border-slate-700">
                          <span className="font-semibold text-amber-300">Puanı Ne Etkiler? </span>
                          {info.impact}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expandable Metric Guide Section */}
        {showMetricGuide && (
          <div className="bg-slate-50 border-t border-slate-200 p-5 sm:p-6 text-xs text-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Telaffuz Değerlendirme Metrikleri Rehberi</span>
              </h5>
              <button
                type="button"
                onClick={() => setShowMetricGuide(false)}
                className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Kapat
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(METRIC_EXPLANATIONS)
                .filter(([key]) => key !== "overall")
                .map(([key, info]) => (
                  <div
                    key={key}
                    className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col justify-between gap-2"
                  >
                    <div>
                      <h6 className="font-bold text-slate-900 text-xs mb-0.5">
                        {info.title}
                      </h6>
                      <span className="text-[11px] text-slate-500 font-medium block mb-1.5">
                        {info.subtitle}
                      </span>
                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        {info.description}
                      </p>
                    </div>
                    <div className="text-[10px] bg-slate-50 p-2 rounded border border-slate-200 text-slate-600">
                      <span className="font-semibold text-slate-800">Puanı Düşürenler: </span>
                      {info.impact}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Düzeltme Önerileri (Phonetic Corrections & Audio) */}
      {parsed.suggestions.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span>Düzeltme Önerileri & Fonetik (IPA) Rehberi</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">
              {parsed.suggestions.length} öneri mevcut
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {parsed.suggestions.map((suggestion, idx) => {
              const itemData = parsed.parsedSuggestions?.[idx];
              const ipaRegex = /(?:\*\*|\*|")?([a-zA-Z'\-]+)(?:\*\*|\*|")?\s*(?:[\(\[])?(\/[^\/\n\r]+\/)(?:[\)\]])?\s*(?:\*\*)?\s*[:\-–]\s*([\s\S]+)/i;
              const match = suggestion.match(ipaRegex);

              const word = itemData?.word || (match ? match[1] : (suggestion.match(/([a-zA-Z'\-]+)/)?.[1] || null));
              const ipa = itemData?.ipa || (match ? match[2] : null);
              const rawTip = itemData?.tip || (match ? match[3] : suggestion);
              const explanation = rawTip.replace(/\s*\(Ses Kaydı:\s*\d{1,2}(?:\.\d+)?s?\s*[-–]\s*\d{1,2}(?:\.\d+)?s?\)/gi, "");
              const timeRange = itemData?.timeRange;

              const timing = word ? getWordTiming(word, timeRange, idx) : null;
              const isUserPlaying = word ? snippetPlaying?.word === word && snippetPlaying.mode === "user" : false;
              const isComparePlaying = word ? snippetPlaying?.word === word && (snippetPlaying.mode === "compare-user" || snippetPlaying.mode === "compare-target") : false;
              const isTargetPlaying = word ? snippetPlaying?.word === word && snippetPlaying.mode === "target" : false;

              return (
                <div
                  key={idx}
                  className={`flex flex-col gap-3 p-3.5 sm:p-4 rounded-xl border transition ${
                    isUserPlaying || isComparePlaying
                      ? "bg-sky-50/70 border-sky-300 ring-2 ring-sky-200"
                      : "bg-slate-50/80 border-slate-200/90 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  {/* Top row: Word header, badges, and action buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {word && (
                        <span className="font-bold text-slate-900 font-serif text-base">
                          {word}
                        </span>
                      )}
                      {ipa && (
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 shadow-2xs">
                          {ipa}
                        </span>
                      )}
                      {timing && (
                        <span
                          className="font-mono text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200/90 shadow-2xs flex items-center gap-1"
                          title="Bu kelimenin ses kaydındaki yaklaşık zaman aralığı"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                          <span>⏱ {timing.text}</span>
                        </span>
                      )}
                    </div>

                    {/* Action button cluster: Kaydımdan Dinle / Doğru Telaffuz / Karşılaştır */}
                    {word && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* 1. Kaydımdan Dinle (User Audio Snippet) */}
                        <button
                          type="button"
                          disabled={!audioUrl}
                          onClick={() => playUserWordSnippet(word, timeRange, idx)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer active:scale-95 border ${
                            isUserPlaying
                              ? "bg-sky-600 text-white border-sky-600 animate-pulse"
                              : audioUrl
                              ? "bg-white hover:bg-sky-50 text-sky-700 border-sky-200 hover:border-sky-300"
                              : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                          }`}
                          title={
                            audioUrl
                              ? `Kendi ses kaydınızda '${word}' kelimesini nasıl söylediğinizi dinleyin`
                              : "Kendi sesinizi dinlemek için ses kaydedin"
                          }
                        >
                          {isUserPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5" />
                              <span>Kaydınız Çalıyor...</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
                              <span>Kaydımdan Dinle</span>
                            </>
                          )}
                        </button>

                        {/* 2. Doğru Telaffuz (Hedef Model Okunuşu) */}
                        <button
                          type="button"
                          onClick={() => playTargetWord(word)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer active:scale-95 border ${
                            isTargetPlaying
                              ? "bg-emerald-600 text-white border-emerald-600 animate-pulse"
                              : "bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300"
                          }`}
                          title={`'${word}' doğru İngilizce sesletimini dinleyin`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Doğru Okunuş</span>
                        </button>

                        {/* 3. Karşılaştır (A/B: Sesiniz -> Doğru Okunuş) */}
                        <button
                          type="button"
                          disabled={!audioUrl}
                          onClick={() => playComparison(word, timeRange, idx)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer active:scale-95 border ${
                            isComparePlaying
                              ? "bg-purple-600 text-white border-purple-600 animate-pulse"
                              : audioUrl
                              ? "bg-white hover:bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-300"
                              : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                          }`}
                          title="Önce kendi söyleyişinizi, hemen ardından doğru telaffuzu peş peşe dinletir"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>
                            {isComparePlaying
                              ? snippetPlaying?.mode === "compare-user"
                                ? "1/2: Kaydınız..."
                                : "2/2: Doğru Telaffuz..."
                              : "Karşılaştır"}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Middle: Pedagogical explanation */}
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                    {explanation}
                  </p>

                  {/* Bottom: Micro adjustments & seek bar sync */}
                  {word && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/70 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-slate-600">Aralık İnce Ayarı:</span>
                        <button
                          type="button"
                          onClick={() => adjustWordTime(word, -0.3, 0)}
                          className="px-1.5 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[11px] text-slate-700 transition cursor-pointer"
                          title="Başlangıcı 0.3 sn geriye alarak biraz daha erken başlatır"
                        >
                          -0.3s Başa Al
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustWordTime(word, 0, 0.3)}
                          className="px-1.5 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[11px] text-slate-700 transition cursor-pointer"
                          title="Bitişi 0.3 sn uzatarak kelimenin sonunu daha rahat duymanızı sağlar"
                        >
                          +0.3s Sona Ekle
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustWordTime(word, 0, 0)}
                          className="px-1.5 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[10px] text-slate-500 transition cursor-pointer"
                          title="Varsayılan zamana sıfırlar"
                        >
                          Sıfırla
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {audioUrl ? (
                          <button
                            type="button"
                            onClick={() => seekToWord(word, timeRange, idx)}
                            className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-semibold cursor-pointer transition"
                            title="Ana ses dalgasını bu kelimenin başladığı saniyeye götürür"
                          >
                            <SlidersHorizontal className="w-3 h-3" />
                            <span>Cümledeki Yerine Git ({timing?.start}s)</span>
                          </button>
                        ) : (
                          <span className="italic text-slate-400">
                            Kendi sesinizi dinlemek için okuma sekmesinde kayıt yapın.
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Optional Raw Markdown View */}
      {showMarkdown && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Markdown Şablon Çıktısı
            </span>
            <button
              type="button"
              onClick={copyMarkdown}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Kopyala</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed border border-slate-800">
            {markdown}
          </pre>
        </div>
      )}
    </div>
  );
};
