/**
 * ALT SABİT AKSİYON BARI
 *
 * "Bu katmanı tamamladım, sıradakine geç" düğmesi eskiden her katmanın
 * EN ALTINDA duruyordu. Katman içerikleri uzun — transkript yüzlerce
 * satır olabiliyor — yani ilerlemek için her seferinde sayfanın sonuna
 * kadar kaydırmak gerekiyordu.
 *
 * Bar artık ekranın altına yapışık. İçinde ayrıca kaçıncı adımda
 * olunduğu yazıyor; sol menü dar ekranda gizli olduğu için tek
 * göstergesi bu.
 *
 * TAMAMLANMIŞ KATMANDA GÖRÜNÜM DEĞİŞİR: aynı düğme tekrar
 * "tamamla" demez, doğrudan sıradakine geçirir. Bir işi bitirdikten
 * sonra aynı düğmeyi tekrar görmek "acaba kaydolmadı mı" hissi
 * veriyordu.
 */

import React from 'react';
import { ArrowRight, Check, CircleCheck } from 'lucide-react';

interface Props {
  /** Çekirdek adım sırası (1-7). Araç ekranlarında bar gösterilmez. */
  step: number;
  totalSteps: number;
  isCompleted: boolean;
  /** Sıradaki katmanın adı; yoksa bu sonuncusudur. */
  nextLabel: string | null;
  onComplete: () => void;
  onGoNext: () => void;
}

export const NextLayerBar: React.FC<Props> = ({
  step, totalSteps, isCompleted, nextLabel, onComplete, onGoNext,
}) => (
  <div
    className="sticky bottom-0 z-20 -mx-4 mt-8 border-t border-hairline
      bg-white/85 px-4 py-3 backdrop-blur-md
      supports-[backdrop-filter]:bg-white/75 sm:-mx-6 sm:px-6"
  >
    <div className="flex flex-wrap items-center justify-between gap-3">

      {/* Nerede olduğunu gösteren nokta şeridi */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1">
          {Array.from({ length: totalSteps }, (_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ease-in-out ${
                i + 1 === step
                  ? 'w-5 bg-accent'
                  : i + 1 < step
                    ? 'w-1.5 bg-emerald-500'
                    : 'w-1.5 bg-hairline'
              }`}
            />
          ))}
        </div>
        <span className="text-[12px] text-ink-3">
          Adım <span className="font-semibold text-ink">{step}</span> / {totalSteps}
        </span>
      </div>

      {isCompleted ? (
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-700">
            <CircleCheck className="h-4 w-4" />
            Bu katman tamamlandı
          </span>
          {nextLabel && (
            <button
              type="button"
              onClick={onGoNext}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-hairline
                bg-paper-2 px-4 text-[13px] font-medium text-ink
                transition-all duration-200 ease-in-out
                hover:border-accent/40 hover:text-accent-700 cursor-pointer"
            >
              <span className="max-w-[10rem] truncate sm:max-w-none">{nextLabel}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={onComplete}
          className="inline-flex h-10 items-center gap-2 rounded-xl
            bg-accent px-4 text-[13px] font-medium text-white shadow-accent/20
            transition-all duration-200 ease-in-out
            hover:bg-accent-700 hover:shadow-accent/25
            cursor-pointer"
        >
          <Check className="h-4 w-4" strokeWidth={2.5} />
          <span className="max-w-[12rem] truncate sm:max-w-none">
            {nextLabel ? `Tamamla, ${nextLabel}'e geç` : 'Bu katmanı tamamla'}
          </span>
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  </div>
);
