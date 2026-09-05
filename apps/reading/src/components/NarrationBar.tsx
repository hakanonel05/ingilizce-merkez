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

import type { ReactNode } from 'react';
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
    <div className="rounded-xl border border-hairline bg-paper-3">
      <div className="flex flex-wrap items-center gap-2 p-2.5">

        {/* Ana denetim */}
        <button
          type="button"
          onClick={() => (isPlaying ? pause() : play())}
          disabled={isBusy}
          className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-[12px]
            font-medium text-white transition-colors duration-150
            hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
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
          <div className="flex items-center gap-0.5">
            {([
              [previous, 'Önceki paragraf', <SkipBack key="b" className="h-3.5 w-3.5" />],
              [next, 'Sonraki paragraf', <SkipForward key="f" className="h-3.5 w-3.5" />],
              [stop, 'Durdur', <Square key="s" className="h-3.5 w-3.5" />],
            ] as [() => void, string, ReactNode][]).map(([fn, label, icon]) => (
              <button
                key={label}
                type="button"
                onClick={fn}
                title={label}
                aria-label={label}
                className="rounded-lg p-2 text-ink-3 transition-colors
                  hover:bg-paper-2 hover:text-ink cursor-pointer"
              >
                {icon}
              </button>
            ))}
          </div>
        )}

        {isActive && currentIndex !== null && (
          <span className="timecode text-ink-3">
            {currentIndex + 1} / {total}
          </span>
        )}

        <div className="flex-1" />

        {/* Hız */}
        <div className="flex items-center gap-0.5 rounded-lg bg-paper-2 p-0.5">
          {SPEEDS.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={`timecode rounded px-2 py-1 transition-colors cursor-pointer ${
                speed === s ? 'bg-accent text-white' : 'text-ink-3 hover:text-ink'
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
            className="rounded-lg border border-hairline bg-paper-2 px-2 py-1.5 text-[12px]
              text-ink transition-colors focus:border-accent focus:outline-none cursor-pointer"
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
        <p className="flex items-start gap-1.5 border-t border-hairline px-3 py-2 text-[11px] leading-relaxed text-ink-2">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>{notice || 'Cihazının kendi sesiyle okunuyor.'}</span>
        </p>
      )}

      {error && (
        <p className="border-t border-danger-line bg-danger-soft px-3 py-2 text-[12px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
