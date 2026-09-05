import React, { useState } from 'react';
import { VideoLesson, MistakeEntry } from '../../types';
import { extractYouTubeId } from '../../lib/youtube';
import { useYouTubePlayer, formatSeconds } from '../../lib/useYouTubePlayer';
import { Layer3ComprehensionQuiz } from './Layer3ComprehensionQuiz';
import { EyeOff, Check } from 'lucide-react';

interface Props {
  lesson: VideoLesson;
  onCompleteLayer: () => void;
  onUpdateQuizData: (data: any) => void;
  onRecordMistakes: (entries: Omit<MistakeEntry, 'id' | 'timestamp'>[]) => void;
}

/**
 * 4. KATMAN — ALTYAZISIZ İZLEME
 * Önce metin görmeden izleme, ardından anlama kontrolü.
 * Anlama testi bölümü mevcut (çalışan) quiz bileşeninden geliyor;
 * yeniden yazılmadı, sadece bu akışın içine alındı.
 */
export const Layer4NoSubtitles: React.FC<Props> = ({
  lesson,
  onCompleteLayer,
  onUpdateQuizData,
  onRecordMistakes,
}) => {
  const ytId = lesson.youtubeId || extractYouTubeId(lesson.youtubeUrl);
  const { containerRef, currentTime } = useYouTubePlayer(ytId, 'yt-no-subs');
  const [watched, setWatched] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-paper-2 border border-hairline rounded-xl p-4">
        {/* Rozet ve baslik kalkti: ikisi de bu bilesenin ustundeki
            LayerHeaderBar'da yaziyor (App.tsx). Ustelik rozet rengi her
            katmanda farkliydi - yedi katman yedi renge gidiyordu. */}
        <p className="text-xs text-ink-2 leading-relaxed">
          Altyazıyı tamamen kapatın ve videoyu izleyin. <strong>%100 anlamak zorunda
          değilsiniz</strong>; başlangıçta %60-70 yakalamak yeterlidir. İzledikten sonra
          aşağıdaki anlama testine geçin.
        </p>
      </div>

      {!ytId ? (
        <div className="rounded-xl border border-hairline p-4 text-[13px] text-ink-2">
          Bu derste gömülü video yok.
        </div>
      ) : (
        <div className="mx-auto max-w-5xl space-y-3">
          <div className="bg-paper-2 border border-hairline rounded-xl p-3">
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-ink-950">
              <div ref={containerRef} className="w-full h-full" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-mono text-ink-3">
                {formatSeconds(currentTime)}
              </span>
              <span className="inline-flex items-center space-x-1.5 text-[11px] text-ink-3">
                <EyeOff className="w-3.5 h-3.5" />
                <span>Metin gösterilmiyor — bu katmanda kasıtlı</span>
              </span>
            </div>
          </div>

          {!watched && (
            <button
              type="button"
              onClick={() => setWatched(true)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-accent hover:bg-accent-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Videoyu altyazısız izledim, teste geç</span>
            </button>
          )}
        </div>
      )}

      {watched && (
        <div className="pt-2 border-t border-hairline">
          <Layer3ComprehensionQuiz
            lesson={lesson}
            onCompleteLayer={onCompleteLayer}
            onUpdateQuizData={onUpdateQuizData}
            onRecordMistakes={onRecordMistakes}
          />
        </div>
      )}
    </div>
  );
};
