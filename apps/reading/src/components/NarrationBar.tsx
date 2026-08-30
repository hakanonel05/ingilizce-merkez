/**
 * SESLİ OKUMA ÇUBUĞU
 *
 * Parçanın üstünde duran ince bir kumanda: oynat/duraklat, paragraf
 * atlama, hız ve ses seçimi.
 *
 * Sesi üreten mantık burada değil, useNarration'da (lib/narration.ts).
 * Bu dosya yalnızca onu gösteriyor; böylece aynı seslendirme başka bir
 * ekrana da takılabilir.
 */

import { Narration, NARRATION_VOICES, NarrationVoice } from '../lib/narration';
import { Play, Pause, Square, SkipBack, SkipForward, Loader2, Volume2, Info } from 'lucide-react';

interface Props {
  narration: Narration;
  /** Kaç paragraf var — "3 / 5" göstergesi için. */
  total: number;
}

const SPEEDS = [0.75, 1, 1.25, 1.5];

export default function NarrationBar({ narration, total }: Props) {
  const {
    status, currentIndex, source, voice, speed,
    error, notice, play, pause, stop, next, previous, setVoice, setSpeed,
  } = narration;

  const isBusy = status === 'loading';
  const isPlaying = status === 'playing';
  const isActive = status !== 'idle';

  return (
    <div className="border border-hairline/40 bg-paper rounded-lg">
      <div className="flex flex-wrap items-center gap-2 p-2.5">

        {/* Ana denetim */}
        <button
          type="button"
          onClick={() => (isPlaying ? pause() : play())}
          disabled={isBusy}
          className="flex items-center gap-2 border border-accent bg-accent px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-accent disabled:opacity-50 cursor-pointer rounded-lg"
        >
          {isBusy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
          {isBusy ? 'Ses hazırlanıyor' : isPlaying ? 'Duraklat' : isActive ? 'Devam et' : 'Sesli dinle'}
        </button>

        {isActive && (
          <div className="flex">
            <button
              type="button"
              onClick={previous}
              title="Önceki paragraf"
              className="border border-hairline/40 bg-white px-2.5 py-2 text-ink/60 hover:text-accent transition-colors cursor-pointer rounded-lg"
            >
              <SkipBack className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={next}
              title="Sonraki paragraf"
              className="border border-l-0 border-hairline/40 bg-white px-2.5 py-2 text-ink/60 hover:text-accent transition-colors cursor-pointer rounded-lg"
            >
              <SkipForward className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={stop}
              title="Durdur"
              className="border border-l-0 border-hairline/40 bg-white px-2.5 py-2 text-ink/60 hover:text-accent transition-colors cursor-pointer rounded-lg"
            >
              <Square className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {isActive && currentIndex !== null && (
          <span className="font-mono text-[11px] text-ink-3 tabular-nums">
            {currentIndex + 1} / {total}
          </span>
        )}

        <div className="flex-1" />

        {/* Hız */}
        <div className="flex">
          {SPEEDS.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={`border px-2 py-1.5 text-[11px] font-bold transition-colors cursor-pointer rounded-lg ${i > 0 ? 'border-l-0' : ''} ${
                speed === s
                  ? 'border-accent bg-accent text-white'
                  : 'border-hairline/40 bg-white text-ink/60 hover:border-accent/40'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>

        {/* Ses seçimi — yalnızca doğal seste anlamlı; cihaz sesinde
            hangi sesin kullanıldığına tarayıcı karar veriyor. */}
        <label className="flex items-center gap-1.5">
          <Volume2 className="h-3.5 w-3.5 text-ink-3" />
          <select
            value={voice}
            onChange={e => setVoice(e.target.value as NarrationVoice)}
            className="border border-hairline/40 bg-white px-2 py-1.5 text-[11px] text-ink focus:outline-none focus:border-accent cursor-pointer rounded-lg"
          >
            {NARRATION_VOICES.map(v => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Doğal ses yerine cihaz sesine düşüldüyse sebebini söyle:
          kullanıcı sesin neden değiştiğini merak etmesin. */}
      {(notice || source === 'device') && isActive && (
        <p className="flex items-start gap-1.5 border-t border-hairline/30 px-3 py-2 text-[11px] leading-relaxed text-ink/60">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>{notice || 'Cihazının kendi sesiyle okunuyor.'}</span>
        </p>
      )}

      {error && (
        <p className="border-t border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-900">
          {error}
        </p>
      )}
    </div>
  );
}
