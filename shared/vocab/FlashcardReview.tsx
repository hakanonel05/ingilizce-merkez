import React, { useState, useEffect, useMemo, useRef } from 'react';
import { VocabCard, putCard, isNewCard, cardSources } from './vocabStore';
import { POS_LABELS_TR } from './pos';
import { logActivity } from '../analytics/activityLog';
import { bumpDailyCounter } from './vocabSettings';
import { FsrsScheduler, Rating, CardState, formatInterval } from './fsrs';
import { Volume2, RotateCcw, Check, Clock, PartyPopper, Pause, Play } from 'lucide-react';

interface Props {
  cards: VocabCard[];
  /** Günlük çalışma süresi hedefi (dakika). */
  sessionMinutes?: number;
  onCardUpdated: () => void;
  onExit?: () => void;
}

/** Hedef tutma oranı 0.90 — istenen ayar. */
const scheduler = new FsrsScheduler({ desiredRetention: 0.9 });

const KIND_LABEL: Record<string, string> = {
  word: 'Kelime',
  phrasal_verb: 'Phrasal Verb',
  collocation: 'Kalıp',
  idiom: 'Deyim',
  expression: 'Konuşma Kalıbı',
};

/**
 * Anki mantığında kart çalışma oturumu.
 * Yalnızca "Again" ve "Good" düğmeleri kullanılıyor (istenen çalışma biçimi).
 * Hard/Easy algoritmada mevcut ama arayüzde bilinçli olarak gösterilmiyor.
 */
export const FlashcardReview: React.FC<Props> = ({
  cards,
  sessionMinutes = 15,
  onCardUpdated,
  onExit,
}) => {
  const [queue, setQueue] = useState<VocabCard[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [againCount, setAgainCount] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const startedRef = useRef<number>(Date.now());

  // Kuyruğu ilk yüklemede kur. Kartlar üst bileşende günlük sınırlara göre
  // zaten süzülmüş halde geliyor.
  useEffect(() => {
    setQueue(cards);
    startedRef.current = Date.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Süre sayacı
  useEffect(() => {
    if (isPaused || timeUp) return;
    const id = setInterval(() => {
      setElapsedMs((prev) => {
        const next = prev + 1000;
        if (next >= sessionMinutes * 60 * 1000) setTimeUp(true);
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isPaused, timeUp, sessionMinutes]);

  const current = queue[0];

  const previews = useMemo(() => {
    if (!current) return null;
    const now = Date.now();
    return {
      again: formatInterval(scheduler.previewInterval(current, Rating.Again, now)),
      good: formatInterval(scheduler.previewInterval(current, Rating.Good, now)),
    };
  }, [current]);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  const grade = async (rating: Rating) => {
    if (!current) return;
    const now = Date.now();
    const wasNew = isNewCard(current);
    const updated = { ...current, ...scheduler.reviewCard(current, rating, now) };

    try {
      await putCard(updated);
    } catch (err) {
      console.warn('Kart kaydedilemedi:', err);
    }

    // Günlük sayaç: kart ilk kez çalışıldıysa "yeni", değilse "tekrar"
    bumpDailyCounter(wasNew ? 'new' : 'review');

    // Karne için: günlük sayaç yalnızca BUGÜNÜ tutuyor ve gece sıfırlanıyor;
    // takvimin geçmişi görebilmesi için tekrar ayrıca olay olarak yazılır.
    void logActivity({
      app: 'katmanli',
      skill: 'vocab',
      kind: 'review',
      count: 1,
      correct: rating === Rating.Again ? 0 : 1,
      total: 1,
      refId: current.id,
      refTitle: current.front,
    });

    setReviewedCount((c) => c + 1);
    if (rating === Rating.Again) setAgainCount((c) => c + 1);

    setQueue((prev) => {
      const rest = prev.slice(1);
      // Again ya da kısa aralıklı kartlar aynı oturumda tekrar gelsin
      const gap = updated.due - now;
      if (gap <= 20 * 60 * 1000) {
        // Kuyruğun ilerisine yerleştir (Anki'deki gibi araya sıkıştırma)
        const insertAt = Math.min(rest.length, rating === Rating.Again ? 3 : 8);
        return [...rest.slice(0, insertAt), updated, ...rest.slice(insertAt)];
      }
      return rest;
    });

    setShowAnswer(false);
    onCardUpdated();
  };

  // Klavye kısayolları: Anki alışkanlığı
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!current || timeUp) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (!showAnswer) setShowAnswer(true);
        else grade(Rating.Good);
      } else if (e.key === '1' && showAnswer) {
        grade(Rating.Again);
      } else if (e.key === '2' && showAnswer) {
        grade(Rating.Good);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const remainingMs = Math.max(0, sessionMinutes * 60 * 1000 - elapsedMs);
  const mm = String(Math.floor(remainingMs / 60000)).padStart(2, '0');
  const ss = String(Math.floor((remainingMs % 60000) / 1000)).padStart(2, '0');
  const timePct = Math.min(100, (elapsedMs / (sessionMinutes * 60 * 1000)) * 100);

  if (queue.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-3">
        <PartyPopper className="w-10 h-10 text-emerald-600 mx-auto" />
        <h3 className="text-base font-semibold text-ink">Bugünlük kart kalmadı</h3>
        <p className="text-xs text-ink-2 max-w-md mx-auto">
          Vadesi gelen tüm kartları çalıştınız. FSRS bir sonraki tekrarı en verimli
          zamana yerleştirdi; yarın yeni kartlar hazır olacak.
        </p>
        {reviewedCount > 0 && (
          <p className="text-xs font-semibold text-emerald-800">
            Bu oturumda {reviewedCount} tekrar yaptınız.
          </p>
        )}
      </div>
    );
  }

  if (timeUp) {
    return (
      <div className="bg-accent-soft border border-accent/25 rounded-xl p-8 text-center space-y-3">
        <Clock className="w-10 h-10 text-accent mx-auto" />
        <h3 className="text-base font-semibold text-ink">
          {sessionMinutes} dakikalık çalışma tamamlandı
        </h3>
        <p className="text-xs text-ink-2 max-w-md mx-auto">
          {reviewedCount} tekrar yaptınız, {againCount} kartı hatırlayamadınız.
          Günlük hedefe ulaştınız; kuyrukta {queue.length} kart kaldı ve yarın sizi bekliyor.
        </p>
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setTimeUp(false);
              setElapsedMs(0);
            }}
            className="px-4 py-2 bg-accent hover:bg-accent-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            Devam Et ({sessionMinutes} dk daha)
          </button>
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className="px-4 py-2 bg-paper-2 border border-hairline-2 text-ink-2 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Bitir
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Üst bar: süre ve sayaçlar */}
      <div className="bg-paper-2 border border-hairline rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2 text-xs">
            <Clock className="w-4 h-4 text-accent" />
            <span className="timecode text-ink font-medium">
              {mm}:{ss}
            </span>
            <span className="text-ink-3">kaldı</span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-semibold">
            <span className="px-2 py-0.5 bg-paper-3 text-ink-2 rounded-full">
              Kuyruk: {queue.length}
            </span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
              Tekrar: {reviewedCount}
            </span>
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              className="p-1.5 rounded-lg bg-paper-3 hover:bg-hairline text-ink-2 cursor-pointer"
              title={isPaused ? 'Devam et' : 'Duraklat'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="w-full bg-hairline rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-accent h-1.5 rounded-full transition-all"
            style={{ width: `${timePct}%` }}
          />
        </div>
      </div>

      {/* Kart */}
      <div className="bg-paper-2 border border-hairline rounded-2xl overflow-hidden">
        <div className="px-4 py-2 bg-paper border-b border-hairline flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 bg-accent-soft text-accent-700 font-semibold rounded">
              {current.level}
            </span>
            <span className="px-2 py-0.5 bg-hairline text-ink-2 font-semibold rounded">
              {KIND_LABEL[current.kind] || current.kind}
            </span>
            {current.pos && (
              <span className="px-2 py-0.5 bg-paper-3 text-ink-2 font-semibold rounded">
                {POS_LABELS_TR[current.pos]}
              </span>
            )}
            {current.state !== CardState.Review && (
              <span className="rounded bg-paper-3 px-2 py-0.5 text-ink-2">
                {current.state === CardState.Learning ? 'Öğreniliyor' : 'Yeniden'}
              </span>
            )}
          </div>
          {(() => {
            const sources = cardSources(current);
            const label =
              sources.length > 1
                ? `${sources[0].lessonTitle} +${sources.length - 1}`
                : sources[0].lessonTitle;
            return (
              <span
                className="text-ink-3 truncate max-w-[45%]"
                title={sources.map((s) => s.lessonTitle).join(', ')}
              >
                {label}
              </span>
            );
          })()}
        </div>

        <div className="p-6 sm:p-10 text-center space-y-4 min-h-[220px] flex flex-col justify-center">
          <div className="flex items-center justify-center gap-2">
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-ink">{current.front}</h2>
            <button
              type="button"
              onClick={() => speak(current.front)}
              className="p-2 rounded-lg bg-paper-3 hover:bg-accent-soft text-ink-2 hover:text-accent-700 cursor-pointer"
              title="Sesli oku"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {current.ipa && <p className="text-sm font-mono text-ink-3">{current.ipa}</p>}

          {showAnswer && (
            <div className="space-y-3 pt-3 border-t border-hairline">
              <p className="text-lg sm:text-xl font-medium text-ink">{current.back}</p>

              {current.exampleEn && (
                <div className="bg-paper border border-hairline rounded-lg p-3 text-left space-y-1">
                  <p className="text-sm text-ink font-medium">{current.exampleEn}</p>
                  {current.exampleTr && (
                    <p className="text-xs text-ink-2">{current.exampleTr}</p>
                  )}
                </div>
              )}

              {/* Kelimeyi nerede gördüğün: her kaynak kendi cümlesiyle.
                  Aynı kelime birden çok metinde geçtiyse hepsi burada. */}
              {cardSources(current)
                .filter((src) => src.contextEn && src.contextEn !== current.exampleEn)
                .map((src) => (
                  <p key={src.lessonId} className="text-[11px] text-ink-3 italic px-2 text-left">
                    <span className="not-italic font-semibold text-ink-2">
                      {src.lessonTitle}:
                    </span>{' '}
                    &ldquo;{src.contextEn}&rdquo;
                  </p>
                ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-paper border-t border-hairline">
          {!showAnswer ? (
            <button
              type="button"
              onClick={() => setShowAnswer(true)}
              className="w-full px-4 py-3 bg-ink hover:bg-ink-800 text-white text-sm font-semibold rounded-xl transition cursor-pointer"
            >
              Cevabı Göster <span className="text-ink-3 font-normal">(boşluk)</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => grade(Rating.Again)}
                className="flex flex-col items-center px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition cursor-pointer"
              >
                <span className="flex items-center space-x-1.5 text-sm font-semibold">
                  <RotateCcw className="w-4 h-4" />
                  <span>Again</span>
                </span>
                <span className="text-[11px] text-rose-100 font-mono">{previews?.again}</span>
              </button>

              <button
                type="button"
                onClick={() => grade(Rating.Good)}
                className="flex flex-col items-center px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer"
              >
                <span className="flex items-center space-x-1.5 text-sm font-semibold">
                  <Check className="w-4 h-4" />
                  <span>Good</span>
                </span>
                <span className="text-[11px] text-emerald-100 font-mono">{previews?.good}</span>
              </button>
            </div>
          )}

          <p className="text-[10px] text-ink-3 text-center pt-2">
            Kısayollar: boşluk = göster / Good &nbsp;·&nbsp; 1 = Again &nbsp;·&nbsp; 2 = Good
          </p>
        </div>
      </div>
    </div>
  );
};
