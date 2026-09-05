import React, { useMemo, useEffect, useRef } from 'react';
import { VideoLesson } from '../../types';
import { extractYouTubeId } from '../../lib/youtube';
import { useYouTubePlayer, formatSeconds, getSentenceStart } from '../../lib/useYouTubePlayer';
import { Ear, AlertTriangle } from 'lucide-react';
import { SelectionToCard } from '../vocab/SelectionToCard';

interface Props {
  lesson: VideoLesson;
  onCompleteLayer: () => void;
}

/**
 * 2. KATMAN — AKTİF DİNLEME
 * Video oynatılırken metin gözle takip edilir. Türkçe çeviri bilinçli olarak
 * gösterilmez: amaç sesle yazıyı eşleştirmek, anlamı Türkçeden hatırlamak değil.
 */
export const Layer2ActiveListening: React.FC<Props> = ({ lesson, onCompleteLayer }) => {
  const ytId = lesson.youtubeId || extractYouTubeId(lesson.youtubeUrl);
  const { containerRef, isPlaying, currentTime } = useYouTubePlayer(ytId, 'yt-active-listening');
  const activeRef = useRef<HTMLDivElement | null>(null);
  const transcriptAreaRef = useRef<HTMLDivElement | null>(null);

  const syncPoints = useMemo(
    () =>
      (lesson.sentences || [])
        .map((pair, index) => ({ index, id: pair.id, start: getSentenceStart(pair) }))
        .filter((p): p is { index: number; id: number; start: number } => p.start !== null)
        .sort((a, b) => a.start - b.start),
    [lesson.sentences]
  );

  const hasTimings = syncPoints.length > 0;

  const activeId = useMemo(() => {
    if (!hasTimings || currentTime <= 0) return null;
    let found: number | null = null;
    for (const p of syncPoints) {
      if (currentTime >= p.start) found = p.id;
      else break;
    }
    return found;
  }, [currentTime, syncPoints, hasTimings]);

  useEffect(() => {
    if (activeId && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeId]);

  return (
    <div className="space-y-6">
      <SelectionToCard
        containerRef={transcriptAreaRef}
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        onAdded={() => { /* VocabHub depo olayıyla kendini tazeliyor */ }}
      />

      <div className="bg-paper-2 border border-hairline rounded-xl p-4">
        {/* Rozet ve baslik kalkti: ikisi de bu bilesenin ustundeki
            LayerHeaderBar'da yaziyor (App.tsx). Ustelik rozet rengi her
            katmanda farkliydi - yedi katman yedi renge gidiyordu. */}
        <p className="text-xs text-ink-2 leading-relaxed">
          Videoyu oynatın ve metni <strong>gözlerinizle</strong> takip edin. Bu katmanda Türkçe
          çeviri bilinçli olarak gösterilmiyor; amaç duyduğunuz sesi yazıyla eşleştirmek. Bu
          çalışma fonetik bilginizi ve kelimelerin ses karşılıklarını zihninize yükler.
        </p>
      </div>

      {!ytId ? (
        <div className="rounded-xl border border-hairline p-4 text-[13px] text-ink-2">
          Bu derste gömülü video yok. Katman 1'den video linki ekleyebilirsiniz.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-4">
            <div className="bg-paper-2 border border-hairline rounded-xl p-3 space-y-2">
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-ink-950">
                <div ref={containerRef} className="w-full h-full" />
              </div>
              <div className="flex items-center space-x-2 pt-1">
                {isPlaying ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Dinleniyor ({formatSeconds(currentTime)})</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-ink-3">
                    Videoyu başlatın ve metni takip edin
                  </span>
                )}
              </div>
            </div>
          </div>

          <div ref={transcriptAreaRef} className="lg:col-span-7">
            <div className="bg-paper-2 border border-hairline rounded-xl overflow-hidden">
              <div className="bg-ink text-white px-4 py-3 flex items-center space-x-2">
                <Ear className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs sm:text-sm font-semibold">
                  İngilizce Metin (Türkçe Gizli)
                </h3>
              </div>

              {!hasTimings && (
                <div className="flex items-start space-x-2 bg-rose-50 border-b border-rose-200 p-3 text-xs text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p>
                    Bu derste zaman bilgisi yok, canlı vurgu çalışmıyor. Katman 1'deki
                    &quot;Gerçek Altyazıdan Senkronize Et&quot; düğmesini kullanabilirsiniz.
                  </p>
                </div>
              )}

              <div className="divide-y divide-hairline max-h-[70vh] overflow-y-auto">
                {(lesson.sentences || []).map((pair) => {
                  const isActive = activeId === pair.id;
                  return (
                    <div
                      key={pair.id}
                      ref={isActive ? activeRef : null}
                      className={`p-4 border-l-4 transition-all ${
                        isActive
                          ? 'bg-[var(--marker-bg)] border-amber-500'
                          : 'border-transparent'
                      }`}
                    >
                      <p
                        className={`transcript-en ${
                          isActive ? 'text-[var(--marker-ink)] font-medium' : 'text-ink-2'
                        }`}
                      >
                        {pair.en}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
