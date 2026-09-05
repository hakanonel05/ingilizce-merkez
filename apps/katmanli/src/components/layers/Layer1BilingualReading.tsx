import React, { useState, useEffect, useRef, useMemo } from 'react';
import { VideoLesson, SentencePair } from '../../types';
import { extractYouTubeId } from '../../lib/youtube';
import { SelectionToCard } from '../vocab/SelectionToCard';
import { LessonInsightPanel } from '../LessonInsightPanel';
import { MarkedText } from '../MarkedText';
import { useLessonInsight } from '../../lib/useLessonInsight';
import { CefrLevel } from '../../../../../shared/vocab/cefr';
import { Volume2, Bookmark, Search, Eye, EyeOff, Youtube, Edit2, Check, X, LayoutGrid, List, Play, Sliders, AlertTriangle, RefreshCw, Pause } from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface Layer1BilingualReadingProps {
  lesson: VideoLesson;
  onBookmarkWord: (word: string, enContext: string, trContext: string) => void;
  bookmarkedWords: { word: string }[];
  onCompleteLayer: () => void;
  onUpdateVideoUrl?: (youtubeUrl: string) => void;
  /** Dersi videonun gerçek YouTube altyazısından yeniden üretir. */
  onResyncFromCaptions?: (onProgress?: (message: string) => void) => Promise<void>;
  /** Anlama oranı bu seviyeye göre hesaplanır. */
  userLevel?: CefrLevel;
  onChangeUserLevel?: (level: CefrLevel) => void;
}

/**
 * Bir cümlenin GERÇEK başlangıç saniyesini döndürür.
 * Öncelik sırası: startSec (sunucudan gelen gerçek değer) > timestamp metni.
 * Zaman bilgisi yoksa null döner. ESKİ "index * 7" TAHMİNİ KALDIRILDI:
 * o tahmin, videonun ilerleyen dakikalarında kaymanın ana sebebiydi.
 */
const getStartSeconds = (pair: SentencePair): number | null => {
  if (typeof pair.startSec === 'number' && isFinite(pair.startSec)) {
    return pair.startSec;
  }
  if (pair.timestamp) {
    const parts = pair.timestamp.split(':').map((p) => parseInt(p, 10));
    if (parts.length === 2 && parts.every((n) => !isNaN(n))) {
      return parts[0] * 60 + parts[1];
    }
    if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
  }
  return null;
};

const formatSeconds = (totalSeconds: number) => {
  const total = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
};

export const Layer1BilingualReading: React.FC<Layer1BilingualReadingProps> = ({
  lesson,
  onBookmarkWord,
  onCompleteLayer,
  onUpdateVideoUrl,
  onResyncFromCaptions,
  userLevel,
  onChangeUserLevel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hideTurkish, setHideTurkish] = useState(false);

  // Zorluk cozumlemesi: hem ozet paneli hem de metindeki alti cizme bunu kullanir
  const [insightRefresh, setInsightRefresh] = useState(0);
  const lessonText = useMemo(
    () => (lesson.sentences || []).map((s) => s.en).join(' '),
    [lesson.sentences]
  );
  const { insight, unknownSet, phraseSet } = useLessonInsight(lessonText, userLevel, insightRefresh);
  const [playingSentenceId, setPlayingSentenceId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'stacked'>('split');

  // İnce ayar ofseti. Gerçek altyazı zamanları kullanıldığında 0 olmalıdır.
  const [offsetSeconds, setOffsetSeconds] = useState<number>(0);

  const [showVideoUrlInput, setShowVideoUrlInput] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // Gerçek altyazıdan yeniden üretme durumu
  const [isResyncing, setIsResyncing] = useState(false);
  const [resyncError, setResyncError] = useState<string | null>(null);
  const [resyncProgress, setResyncProgress] = useState('');

  // YouTube Player State
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const activeSentenceRef = useRef<HTMLDivElement | null>(null);
  const transcriptAreaRef = useRef<HTMLDivElement | null>(null);

  const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);

  const ytId = lesson.youtubeId || extractYouTubeId(lesson.youtubeUrl);

  // Zaman bilgisi olan cümlelerin listesi (senkronizasyon tablosu)
  const syncPoints = useMemo(() => {
    return (lesson.sentences || [])
      .map((pair, index) => ({ index, id: pair.id, start: getStartSeconds(pair) }))
      .filter((p): p is { index: number; id: number; start: number } => p.start !== null)
      .sort((a, b) => a.start - b.start);
  }, [lesson.sentences]);

  const hasTimings = syncPoints.length > 0;

  const handleResync = async () => {
    if (!onResyncFromCaptions || isResyncing) return;
    setIsResyncing(true);
    setResyncError(null);
    setResyncProgress('Başlatılıyor...');
    try {
      await onResyncFromCaptions(setResyncProgress);
    } catch (err: any) {
      setResyncError(err?.message || 'Senkronizasyon başarısız oldu.');
    } finally {
      setIsResyncing(false);
      setResyncProgress('');
    }
  };

  const handleSaveVideoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateVideoUrl && newVideoUrl.trim()) {
      onUpdateVideoUrl(newVideoUrl.trim());
      setShowVideoUrlInput(false);
      setNewVideoUrl('');
    }
  };

  // Initialize YouTube Iframe Player
  useEffect(() => {
    if (!ytId) return;

    let isSubscribed = true;

    const createPlayer = () => {
      if (!window.YT || !window.YT.Player || !playerContainerRef.current) return;

      // DÜZELTME: ham HTML içinde "className" geçersizdir, "class" olmalı.
      playerContainerRef.current.innerHTML = '<div id="yt-embed-element" class="w-full h-full"></div>';

      try {
        playerRef.current = new window.YT.Player('yt-embed-element', {
          height: '100%',
          width: '100%',
          videoId: ytId,
          playerVars: {
            autoplay: 0,
            rel: 0,
            modestbranding: 1,
            enablejsapi: 1,
            playsinline: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : undefined,
          },
          events: {
            onReady: () => {
              if (isSubscribed) setIsPlayerReady(true);
            },
            onStateChange: (event: any) => {
              if (!isSubscribed) return;
              const state = event.data;
              // DÜZELTME: BUFFERING durumunda oynatma "durdu" sayılmamalı,
              // aksi halde tampon sırasında vurgu donuyordu.
              if (state === window.YT.PlayerState.PLAYING || state === window.YT.PlayerState.BUFFERING) {
                setIsVideoPlaying(true);
              } else {
                setIsVideoPlaying(false);
              }
            },
          },
        });
      } catch (err) {
        console.warn('YouTube Player initialization failed:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      if (!document.getElementById('yt-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const previousOnReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousOnReady) previousOnReady();
        createPlayer();
      };
    }

    return () => {
      isSubscribed = false;
      setIsPlayerReady(false);
      if (playerRef.current) {
        try {
          if (typeof playerRef.current.destroy === 'function') {
            playerRef.current.destroy();
          }
        } catch (e) {
          // ignore cleanup errors
        }
        playerRef.current = null;
      }
    };
  }, [ytId]);

  // DÜZELTME: Zamanlayıcı artık oynatıcı hazır olduğu sürece çalışıyor.
  // Böylece durdurulmuşken yapılan atlamalarda da vurgu doğru cümleye gidiyor.
  useEffect(() => {
    if (!isPlayerReady) return;

    const interval = setInterval(() => {
      const player = playerRef.current;
      if (player && typeof player.getCurrentTime === 'function') {
        const t = player.getCurrentTime();
        if (typeof t === 'number' && isFinite(t)) {
          setCurrentVideoTime(t);
        }
      }
    }, 150);

    return () => clearInterval(interval);
  }, [isPlayerReady]);

  // Intro/jenerik ofseti düşülmüş konuşma zamanı
  const speechTime = useMemo(
    () => Math.max(0, currentVideoTime - offsetSeconds),
    [currentVideoTime, offsetSeconds]
  );

  // Aktif cümleyi belirle
  const { activeSentenceId, activeSentenceIndex } = useMemo(() => {
    if (playingSentenceId !== null) {
      const idx = lesson.sentences.findIndex((s) => s.id === playingSentenceId);
      return { activeSentenceId: playingSentenceId, activeSentenceIndex: idx };
    }

    if (!hasTimings || currentVideoTime <= 0) {
      return { activeSentenceId: null as number | null, activeSentenceIndex: -1 };
    }

    // Zaman sırasına dizilmiş listede, speechTime'ı geçmeyen son cümle aktiftir
    let found: { index: number; id: number } | null = null;
    for (let i = 0; i < syncPoints.length; i++) {
      if (speechTime >= syncPoints[i].start) {
        found = { index: syncPoints[i].index, id: syncPoints[i].id };
      } else {
        break;
      }
    }

    if (!found) return { activeSentenceId: null as number | null, activeSentenceIndex: -1 };
    return { activeSentenceId: found.id, activeSentenceIndex: found.index };
  }, [speechTime, currentVideoTime, playingSentenceId, lesson.sentences, syncPoints, hasTimings]);

  // Aktif cümleyi görünür alana kaydır
  useEffect(() => {
    if (activeSentenceId && activeSentenceRef.current) {
      activeSentenceRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeSentenceId]);

  const filteredSentences = useMemo(() => {
    const term = searchTerm.toLowerCase();
    // DÜZELTME: orijinal index korunuyor. Eskiden filtrelenmiş dizinin index'i
    // kullanıldığı için arama yapılınca yanlış saniyeye atlanıyordu.
    return (lesson.sentences || [])
      .map((pair, originalIndex) => ({ pair, originalIndex }))
      .filter(
        ({ pair }) =>
          pair.en.toLowerCase().includes(term) || (pair.tr || '').toLowerCase().includes(term)
      );
  }, [lesson.sentences, searchTerm]);

  // Videoda ilgili saniyeye atla
  const jumpToSentenceInVideo = (pair: SentencePair) => {
    const start = getStartSeconds(pair);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setPlayingSentenceId(null);
    }

    if (start === null) {
      // Zaman bilgisi yoksa videoyu oynatmak yerine sadece seslendir
      speakText(pair.id, pair.en);
      return;
    }

    const actualVideoTime = Math.max(0, start + offsetSeconds);

    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(actualVideoTime, true);
      playerRef.current.playVideo();
      setCurrentVideoTime(actualVideoTime);
      setIsVideoPlaying(true);
    } else {
      speakText(pair.id, pair.en);
    }
  };

  /** Videoyu oynat/duraklat. Transkriptten ayrılmadan kontrol için. */
  const togglePlayback = () => {
    const player = playerRef.current;
    if (!player) return;
    try {
      if (isVideoPlaying) {
        player.pauseVideo();
        setIsVideoPlaying(false);
      } else {
        player.playVideo();
        setIsVideoPlaying(true);
      }
    } catch (err) {
      console.warn('Oynatma durumu değiştirilemedi:', err);
    }
  };

  // Boşluk tuşu: oynat/duraklat. Yazı alanlarında devre dışı.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || el?.isContentEditable) return;
      // Metin seçiliyken boşluk tuşu seçimi bozmasın
      if (window.getSelection()?.toString()) return;
      e.preventDefault();
      togglePlayback();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const speakText = (sentenceId: number, text: string) => {
    if ('speechSynthesis' in window) {
      if (playingSentenceId === sentenceId) {
        window.speechSynthesis.cancel();
        setPlayingSentenceId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onstart = () => setPlayingSentenceId(sentenceId);
      utterance.onend = () => setPlayingSentenceId(null);
      utterance.onerror = () => setPlayingSentenceId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metinde kelime seçilince "Karta Ekle" balonu */}
      <SelectionToCard
        containerRef={transcriptAreaRef}
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        onAdded={() => { /* VocabHub depo olayıyla kendini tazeliyor */ }}
      />

      {/* Control Header */}
      {/* KATMAN BAŞLIĞI BURADA TEKRARLANMIYOR.
          Burada "LAYER 1" rozeti ve "Çift Dilli Okuma & Canlı
          Senkronizasyon" başlığı vardı; ikisi de bu bileşenin hemen
          üstünde duran LayerHeaderBar'da zaten yazıyor (App.tsx).
          Aynı başlığı iki kez göstermek yer harcamaktan başka bir şey
          yapmıyordu. */}
      <div className="rounded-2xl border border-hairline bg-paper-2 p-4 space-y-3">
        <div className="flex items-center justify-end flex-wrap gap-2">
          <div className="flex items-center space-x-2 flex-wrap gap-1">
            <div className="flex items-center gap-0.5 rounded-lg bg-paper-3 p-1">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px]
                  transition-colors duration-150 cursor-pointer ${
                  viewMode === 'split' ? 'bg-paper-2 font-medium text-ink' : 'text-ink-2 hover:text-ink'
                }`}
                title="TED Stili Yan Yana Video ve Transkript Görünümü"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">TED Stili Yan Yana</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('stacked')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px]
                  transition-colors duration-150 cursor-pointer ${
                  viewMode === 'stacked' ? 'bg-paper-2 font-medium text-ink' : 'text-ink-2 hover:text-ink'
                }`}
                title="Tek Sütun Liste Görünümü"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tek Sütun</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setHideTurkish(!hideTurkish)}
              className="flex items-center gap-1.5 rounded-lg border border-hairline px-3 py-1.5
                text-[12px] text-ink-2 transition-colors duration-150
                hover:bg-paper-3 hover:text-ink cursor-pointer"
            >
              {hideTurkish ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{hideTurkish ? 'Türkçeyi göster' : 'Türkçeyi gizle'}</span>
            </button>
          </div>
        </div>

        {/* Zaman bilgisi yoksa uyarı + tek tıkla düzeltme */}
        {!hasTimings && (
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg text-xs text-rose-900 space-y-2.5">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p>
                Bu derste zaman bilgisi yok, bu yüzden cümleler videoyla senkronize edilemiyor.
                Hazır dersler elle yazıldığı için zaman damgası içermez.
                {ytId && onResyncFromCaptions
                  ? ' Aşağıdaki düğme, dersi videonun gerçek YouTube altyazısından yeniden üretir.'
                  : ' Senkron için önce geçerli bir YouTube linki ekleyin.'}
              </p>
            </div>

            {ytId && onResyncFromCaptions && (
              <button
                type="button"
                onClick={handleResync}
                disabled={isResyncing}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-3.5 py-2 text-[13px]
                  font-medium text-white transition-colors duration-150 hover:bg-rose-700
                  disabled:cursor-wait disabled:opacity-60 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResyncing ? 'animate-spin' : ''}`} />
                <span>
                  {isResyncing
                    ? (resyncProgress || 'Altyazı çekiliyor...')
                    : 'Gerçek Altyazıdan Senkronize Et'}
                </span>
              </button>
            )}

            {isResyncing && (
              <p className="text-[11px] text-rose-700 pl-0.5">
                Videonun altyazısı indiriliyor, cümlelere bölünüyor ve Türkçeye çevriliyor.
                Sayfadan ayrılma.
              </p>
            )}

            {resyncError && (
              <p className="rounded-lg border border-rose-300 bg-rose-100 px-2.5 py-1.5 text-[12px] text-rose-800">
                {resyncError}
              </p>
            )}
          </div>
        )}

          {/* KEHRİBAR BURADAN ÇIKTI.
              index.css kehribarı "ekrandaki tek sıcak renk — süs değil,
              şu an konuşulan cümleyi gösteriyor" diye tanımlıyor. Bu
              ayar şeridi kehribar zeminli, kehribar kenarlıklı ve
              kehribar yazılıydı; aşağıdaki aktif cümle de kehribardı.
              İkisi aynı renkte olunca işaret işaret olmaktan çıkıyordu.
              Şerit nötr; kehribar yalnızca transkriptte. */}
        {hasTimings && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-paper-3 p-3">
            <div className="flex items-center gap-2 text-[12px] text-ink-2">
              <Sliders className="w-4 h-4 shrink-0 text-ink-3" />
              <span>Senkron ince ayarı</span>
              <span className="timecode rounded bg-paper-2 px-2 py-0.5 text-ink">
                {offsetSeconds === 0 ? '0s' : offsetSeconds > 0 ? `+${offsetSeconds}s` : `${offsetSeconds}s`}
              </span>
              <span className="hidden text-ink-3 md:inline">
                Gerçek altyazı zamanları kullanılıyor, normalde 0 kalmalı.
              </span>
            </div>

            <div className="flex items-center space-x-1.5 flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setOffsetSeconds(0)}
                className={`rounded-lg px-2.5 py-1 text-[12px] transition-colors duration-150 cursor-pointer ${
                  offsetSeconds === 0
                    ? 'bg-paper-2 font-medium text-ink'
                    : 'text-ink-2 hover:text-ink'
                }`}
                title="Tam zamanında senkronizasyon (0s)"
              >
                Sıfırla (0s)
              </button>

              {ytId && onResyncFromCaptions && (
                <button
                  type="button"
                  onClick={handleResync}
                  disabled={isResyncing}
                  className="flex items-center gap-1 rounded-lg border border-hairline bg-paper-2 px-2.5 py-1
                    text-[12px] text-ink-2 transition-colors hover:text-ink
                    disabled:cursor-wait disabled:opacity-50 cursor-pointer"
                  title="Dersi videonun gerçek altyazısından yeniden üret"
                >
                  <RefreshCw className={`w-3 h-3 ${isResyncing ? 'animate-spin' : ''}`} />
                  <span>{isResyncing ? (resyncProgress || 'Yenileniyor...') : 'Altyazıdan Yenile'}</span>
                </button>
              )}

              <div className="flex items-center gap-1 border-l border-hairline-2 pl-2">
                {[-1, -0.5, 0.5, 1].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => setOffsetSeconds((prev) => parseFloat((prev + delta).toFixed(1)))}
                    className="timecode rounded-lg border border-hairline bg-paper-2 px-2 py-1
                      text-ink-2 transition-colors hover:text-ink cursor-pointer"
                    title={`${delta} saniye kaydır`}
                  >
                    {delta > 0 ? `+${delta}s` : `${delta}s`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bu ders senin icin ne kadar zor? */}
        <LessonInsightPanel
          insight={insight}
          userLevel={userLevel}
          onChangeUserLevel={onChangeUserLevel}
          onClassified={() => setInsightRefresh((n) => n + 1)}
        />

        {/* Search Bar */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cümle veya kelime ara..."
            className="w-full rounded-xl border border-hairline bg-paper-2 py-2.5 pl-9 pr-3 text-[13px]
              text-ink placeholder-ink-3 transition-colors focus:border-accent focus:outline-none
              focus:ring-2 focus:ring-accent/15"
          />
        </div>
      </div>

      {/* Main Layout */}
      <div className={viewMode === 'split' ? 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start' : 'space-y-6'}>

        {/* Video Player Column */}
        <div className={viewMode === 'split' ? 'lg:col-span-4 lg:sticky lg:top-4 space-y-3' : 'space-y-3'}>
          {ytId ? (
            <div className="rounded-2xl border border-hairline bg-paper-2 p-3 space-y-2">
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-ink-950 border border-hairline shadow-inner relative">
                <div ref={playerContainerRef} className="w-full h-full" />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2 truncate max-w-[260px]">
                  <button
                    type="button"
                    onClick={togglePlayback}
                    title={isVideoPlaying ? 'Duraklat' : 'Oynat'}
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--hairline)] hover:border-[var(--ink)] text-[var(--ink)] transition-colors cursor-pointer shrink-0"
                  >
                    {isVideoPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                  </button>
                  {isVideoPlaying ? (
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-ink-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <span className="timecode">{formatSeconds(currentVideoTime)}</span>
                    </span>
                  ) : (
                    <span className="truncate text-[12px] text-ink-3" title={lesson.title}>
                      {lesson.title}
                    </span>
                  )}
                </div>

                {onUpdateVideoUrl && (
                  <div>
                    {!showVideoUrlInput ? (
                      <button
                        type="button"
                        onClick={() => { setShowVideoUrlInput(true); setNewVideoUrl(lesson.youtubeUrl || ''); }}
                        className="text-[11px] font-semibold text-brand hover:text-brand flex items-center space-x-1 transition cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>URL Değiştir</span>
                      </button>
                    ) : (
                      <form onSubmit={handleSaveVideoUrl} className="flex items-center space-x-1.5 bg-paper p-1.5 rounded-lg border border-hairline">
                        <input
                          type="text"
                          value={newVideoUrl}
                          onChange={(e) => setNewVideoUrl(e.target.value)}
                          placeholder="YouTube URL..."
                          className="px-2 py-1 text-xs bg-paper-2 border border-hairline-2 rounded focus:outline-none w-36"
                        />
                        <button type="submit" className="rounded-lg bg-accent px-2 py-1 text-white transition-colors hover:bg-accent-700 cursor-pointer">
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowVideoUrlInput(false)}
                          className="p-1 text-ink-3 hover:text-ink-2 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2 rounded-2xl border border-hairline bg-paper-2 p-4">
              <div className="flex items-center gap-2 text-[14px] font-medium text-ink">
                <Youtube className="h-4 w-4 text-ink-3" />
                <span>Video ekle</span>
              </div>
              <p className="max-w-[52ch] text-[12px] leading-relaxed text-ink-2">
                Cümleleri videoyla senkron takip edebilmek için YouTube linkini yapıştır.
              </p>
              <form onSubmit={handleSaveVideoUrl} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1 rounded-xl border border-hairline bg-paper-2 px-3 py-2 text-[13px]
                    text-ink placeholder-ink-3 transition-colors focus:border-accent focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newVideoUrl.trim()}
                  className="rounded-xl bg-accent px-4 py-2 text-[13px] font-medium text-white
                    transition-colors hover:bg-accent-700 disabled:opacity-40 cursor-pointer"
                >
                  Göm
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Transcript Column */}
        <div ref={transcriptAreaRef} className={viewMode === 'split' ? 'lg:col-span-8' : 'w-full'}>
          <div className="overflow-hidden rounded-2xl border border-hairline bg-paper-2">

            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-hairline bg-paper-3 px-4 py-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                {ytId && (
                  <button
                    type="button"
                    onClick={togglePlayback}
                    title={isVideoPlaying ? 'Duraklat (boşluk)' : 'Oynat (boşluk)'}
                    className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-accent px-3 text-[12px]
                      font-medium text-white transition-colors hover:bg-accent-700 cursor-pointer"
                  >
                    {isVideoPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>{isVideoPlaying ? 'Duraklat' : 'Oynat'}</span>
                  </button>
                )}
                <h3 className="truncate text-[13px] font-medium text-ink">Transkript</h3>
              </div>
              <span className="timecode text-ink-3 shrink-0">
                {isVideoPlaying ? formatSeconds(currentVideoTime) : `${filteredSentences.length} cümle`}
              </span>
            </div>

            <div className={`divide-y divide-hairline ${viewMode === 'split' ? 'max-h-[75vh] overflow-y-auto' : ''}`}>
              {filteredSentences.map(({ pair }) => {
                const isActive = activeSentenceId === pair.id;
                const start = getStartSeconds(pair);
                const timeTag = start !== null ? (pair.timestamp || formatSeconds(start)) : null;

                return (
                  <div
                    key={pair.id}
                    ref={isActive ? activeSentenceRef : null}
                    className={`select-text border-l-4 p-4 transition-colors duration-200 sm:p-5 ${
                      isActive
                        ? 'border-[var(--marker)] bg-[var(--marker-bg)]'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
                      {/* English */}
                      <div className="flex items-start space-x-3">
                        {timeTag && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              jumpToSentenceInVideo(pair);
                            }}
                            className={`timecode mt-0.5 inline-flex shrink-0 items-center gap-1 rounded px-2 py-1
                              transition-colors duration-150 cursor-pointer ${
                              isActive
                                ? 'text-[var(--marker-ink)]'
                                : 'bg-paper-3 text-ink-2 hover:text-ink'
                            }`}
                            title="Videoda bu saniyeye atla"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>{timeTag}</span>
                          </button>
                        )}

                        <div className="flex-1">
                          {/* AKTİF CÜMLE ARTIK ALTI KEZ İŞARETLENMİYOR.
                              Önce aynı anda: satır zemini, sol kenarlık,
                              iç kutu, kalın yazı, kehribar zaman etiketi,
                              kalın Türkçe ve "CANLI KONUŞULUYOR" hapı
                              vardı. Yedi sinyal tek bir durum için. Geriye
                              satır zemini + sol kenarlık + küçük bir
                              "konuşuluyor" işareti kaldı. */}
                          <p className={`transcript-en ${isActive ? 'text-[var(--marker-ink)]' : 'text-ink'}`}>
                            <MarkedText text={pair.en} unknown={unknownSet} phrases={phraseSet} />
                          </p>
                          {isActive && (
                            <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-[var(--marker-ink)]">
                              <Volume2 className="h-3.5 w-3.5" />
                              konuşuluyor
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Turkish + actions */}
                      <div className="flex items-start justify-between gap-3 border-t md:border-t-0 md:border-l border-hairline pt-2.5 md:pt-0 md:pl-4">
                        {!hideTurkish ? (
                          <p className={`flex-1 text-sm leading-relaxed sm:text-base ${
                            isActive ? 'text-[var(--marker-ink)]' : 'text-ink-2'
                          }`}>
                            {pair.tr}
                          </p>
                        ) : (
                          <span className="text-xs text-ink-3 italic flex-1">Türkçe çeviri gizlendi</span>
                        )}

                        <div className="flex items-center space-x-1 shrink-0 ml-2">
                          {start !== null && (
                            <button
                              type="button"
                              onClick={() => jumpToSentenceInVideo(pair)}
                              className={`rounded-lg p-2 transition-colors duration-150 cursor-pointer ${
                                isActive
                                  ? 'text-[var(--marker-ink)] hover:bg-paper-2'
                                  : 'bg-paper-3 text-ink-2 hover:text-ink'
                              }`}
                              title="Videoda Oynat"
                            >
                              <Play className="w-4 h-4 fill-current" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => speakText(pair.id, pair.en)}
                            className="rounded-lg bg-paper-3 p-2 text-ink-2 transition-colors hover:text-ink cursor-pointer"
                            title="Sesli okunuşu dinle"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onBookmarkWord(pair.en.split(' ')[0], pair.en, pair.tr)}
                            className="rounded-lg bg-paper-3 p-2 text-ink-2 transition-colors hover:text-ink cursor-pointer"
                            title="Notlarıma ekle"
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
