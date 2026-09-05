import React, { useState } from 'react';
import { VideoLesson } from '../../types';
import { extractYouTubeId } from '../../lib/youtube';
import { useYouTubePlayer, formatSeconds } from '../../lib/useYouTubePlayer';
import { Headphones, Play, Pause, Eye, EyeOff } from 'lucide-react';

interface Props {
  lesson: VideoLesson;
  onCompleteLayer: () => void;
}

/**
 * 5. KATMAN — SADECE DİNLEME
 * Görüntü kapatılır, yalnızca ses kalır. Görsel ipuçları (jest, slayt, dudak
 * hareketi) ortadan kalkınca beyin doğrudan sese odaklanmak zorunda kalır.
 *
 * NOT: iframe DOM'dan kaldırılmıyor, üzeri örtülüyor. display:none yapılırsa
 * bazı tarayıcılarda oynatma duruyor.
 */
export const Layer5AudioOnly: React.FC<Props> = ({ lesson, onCompleteLayer }) => {
  const ytId = lesson.youtubeId || extractYouTubeId(lesson.youtubeUrl);
  const { containerRef, isPlaying, currentTime, duration, play, pause } = useYouTubePlayer(
    ytId,
    'yt-audio-only'
  );
  const [peek, setPeek] = useState(false);

  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-paper-2 border border-hairline rounded-xl p-4">
        {/* Rozet ve baslik kalkti: ikisi de bu bilesenin ustundeki
            LayerHeaderBar'da yaziyor (App.tsx). Ustelik rozet rengi her
            katmanda farkliydi - yedi katman yedi renge gidiyordu. */}
        <p className="text-xs text-ink-2 leading-relaxed">
          Videoyu görsel, jest ve slayt desteği olmadan <strong>sadece kulaklıkla</strong> ses
          modunda dinleyin. Görüntü kapalı olduğu için beyniniz doğrudan sese odaklanır.
        </p>
      </div>

      {!ytId ? (
        <div className="rounded-xl border border-hairline p-4 text-[13px] text-ink-2">
          Bu derste gömülü video yok.
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-ink rounded-2xl p-6 space-y-5">
            {/* Oynatıcı: görünmez ama DOM'da */}
            <div className="relative rounded-xl overflow-hidden bg-ink-950 aspect-video">
              <div ref={containerRef} className="w-full h-full" />
              {!peek && (
                <div className="absolute inset-0 bg-ink flex flex-col items-center justify-center space-y-3">
                  <Headphones className="w-14 h-14 text-ink-3" />
                  <p className="text-sm font-semibold text-hairline">Görüntü Kapalı</p>
                  <p className="text-[11px] text-ink-3 px-8 text-center">
                    Sadece sese odaklanın. Anlamadığınız yerleri not edin.
                  </p>
                </div>
              )}
            </div>

            {/* İlerleme */}
            <div className="space-y-1.5">
              <div className="w-full bg-ink-2 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-accent h-1.5 rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-ink-3">
                <span>{formatSeconds(currentTime)}</span>
                <span>{duration > 0 ? formatSeconds(duration) : '--:--'}</span>
              </div>
            </div>

            {/* Kontroller */}
            <div className="flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={() => (isPlaying ? pause() : play())}
                className="flex items-center space-x-2 px-6 py-3 bg-accent hover:bg-accent-700 text-white text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Duraklat</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Dinlemeye Başla</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPeek((p) => !p)}
                className="flex items-center space-x-1.5 px-4 py-3 bg-ink-800 hover:bg-ink-2 text-hairline-2 text-xs font-semibold rounded-xl transition cursor-pointer"
                title="Zorlandığınızda kısa süre görüntüye bakabilirsiniz"
              >
                {peek ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{peek ? 'Görüntüyü Kapat' : 'Kısa Bak'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
