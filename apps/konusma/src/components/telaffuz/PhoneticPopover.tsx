import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Volume2, X, Sparkles, Mic, Play, Pause, RotateCcw } from "lucide-react";
import { ParsedSentenceToken } from '../../lib/telaffuzRaporu';
import { speakText } from '../../lib/konusmaSesi';

interface PhoneticPopoverProps {
  token: ParsedSentenceToken | null;
  isOpen: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  hasAudio?: boolean;
  timeRangeText?: string;
  onPlayUserAudio?: (word: string, token: ParsedSentenceToken) => void;
  onPlayTargetAudio?: (word: string) => void;
  onPlayComparison?: (word: string, token: ParsedSentenceToken) => void;
  snippetPlaying?: {
    word: string;
    mode: "user" | "target" | "compare-user" | "compare-target";
  } | null;
}

export const PhoneticPopover: React.FC<PhoneticPopoverProps> = ({
  token,
  isOpen,
  anchorEl,
  onClose,
  onMouseEnter,
  onMouseLeave,
  hasAudio = false,
  timeRangeText,
  onPlayUserAudio,
  onPlayTargetAudio,
  onPlayComparison,
  snippetPlaying,
}) => {
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const [position, setPosition] = useState<{
    top: number;
    left: number;
    arrowLeft: number;
    placement: "top" | "bottom";
  }>({
    top: 0,
    left: 0,
    arrowLeft: 100,
    placement: "top",
  });

  const updatePosition = () => {
    if (!anchorEl || !popoverRef.current) return;

    const anchorRect = anchorEl.getBoundingClientRect();
    const popover = popoverRef.current;
    const popoverRect = popover.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const popoverWidth = popoverRect.width || 320;
    const popoverHeight = popoverRect.height || 220;

    // Anchor center in viewport coordinates
    const anchorCenterX = anchorRect.left + anchorRect.width / 2;

    // Desired horizontal left coordinate
    let targetLeft = anchorCenterX - popoverWidth / 2;

    // Clamp horizontal position so it is strictly within viewport with 12px padding
    const minLeft = 12;
    const maxLeft = Math.max(12, viewportWidth - popoverWidth - 12);
    const clampedLeft = Math.max(minLeft, Math.min(maxLeft, targetLeft));

    // Arrow position relative to the popover card (clamped so it stays on the card)
    const arrowX = anchorCenterX - clampedLeft;
    const clampedArrowX = Math.max(20, Math.min(popoverWidth - 20, arrowX));

    // Vertical placement: decide if popover fits above anchor
    let placement: "top" | "bottom" = "top";
    let targetTop: number;

    const spaceAbove = anchorRect.top;
    const spaceBelow = viewportHeight - anchorRect.bottom;

    if (spaceAbove >= popoverHeight + 14) {
      // Fits above
      placement = "top";
      targetTop = anchorRect.top - popoverHeight - 10;
    } else if (spaceBelow >= popoverHeight + 14) {
      // Fits below
      placement = "bottom";
      targetTop = anchorRect.bottom + 10;
    } else {
      // Fallback: put where there is more space
      if (spaceAbove > spaceBelow) {
        placement = "top";
        targetTop = Math.max(10, anchorRect.top - popoverHeight - 8);
      } else {
        placement = "bottom";
        targetTop = Math.min(viewportHeight - popoverHeight - 10, anchorRect.bottom + 8);
      }
    }

    setPosition({
      top: Math.round(targetTop),
      left: Math.round(clampedLeft),
      arrowLeft: Math.round(clampedArrowX),
      placement,
    });
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, anchorEl, token?.id]);

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorEl &&
        !anchorEl.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, anchorEl, onClose]);

  if (!isOpen || !token) return null;

  return (
    <div
      ref={popoverRef}
      style={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
      }}
      className="w-[calc(100vw-24px)] max-w-[320px] sm:max-w-[340px] p-3.5 bg-slate-900 text-white rounded-xl shadow-2xl border border-rose-500/60 pointer-events-auto text-left font-sans select-text animate-in fade-in zoom-in-95 duration-150"
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Dynamic Clamped Pointer Arrow */}
      {position.placement === "top" ? (
        <div
          style={{ left: `${position.arrowLeft}px` }}
          className="absolute top-full -mt-1.5 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45 border-r border-b border-rose-500/60 pointer-events-none"
        />
      ) : (
        <div
          style={{ left: `${position.arrowLeft}px` }}
          className="absolute bottom-full -mb-1.5 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45 border-l border-t border-rose-500/60 pointer-events-none"
        />
      )}

      {/* Popover Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white uppercase tracking-wider shadow-2xs">
            Zayıf Telaffuz
          </span>
          <span className="text-sm font-bold text-white font-serif">
            {token.cleanWord}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition cursor-pointer"
          title="Kapat"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Target Phonetic IPA Box */}
      <div className="flex items-center justify-between bg-slate-800/90 rounded-lg p-2.5 mb-2.5 border border-slate-700/80">
        <div className="flex flex-col min-w-0 pr-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">
            Hedef Fonetik Okunuş (IPA)
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-rose-300 tracking-wide truncate">
            {token.phoneticDetail?.ipa || `/${token.cleanWord}/`}
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onPlayTargetAudio) {
              onPlayTargetAudio(token.cleanWord);
            } else {
              speakText(token.cleanWord);
            }
          }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer shrink-0 active:scale-95"
          title="Doğru telaffuzu dinle"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Dinle</span>
        </button>
      </div>

      {/* Audio Comparison & User Playback Section */}
      <div className="bg-slate-800/80 rounded-lg p-2.5 mb-2.5 border border-slate-700/80 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider flex items-center gap-1">
            <Mic className="w-3 h-3" />
            <span>Ses Kaydınızdaki Söyleyişiniz</span>
          </span>
          {timeRangeText && (
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-700">
              ⏱ {timeRangeText}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            disabled={!hasAudio}
            onClick={(e) => {
              e.stopPropagation();
              if (onPlayUserAudio) onPlayUserAudio(token.cleanWord, token);
            }}
            className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer active:scale-95 border ${
              snippetPlaying?.word === token.cleanWord && snippetPlaying.mode === "user"
                ? "bg-sky-500 text-white border-sky-400 animate-pulse"
                : hasAudio
                ? "bg-sky-950/60 hover:bg-sky-900 text-sky-200 border-sky-800"
                : "bg-slate-800 text-slate-500 border-slate-700 opacity-60 cursor-not-allowed"
            }`}
            title={hasAudio ? "Kaydınızdaki bu kelimeyi dinleyin" : "Ses kaydı henüz yüklenmedi"}
          >
            {snippetPlaying?.word === token.cleanWord && snippetPlaying.mode === "user" ? (
              <>
                <Pause className="w-3.5 h-3.5 text-white" />
                <span>Çalıyor...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                <span>Benim Sesim</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={!hasAudio}
            onClick={(e) => {
              e.stopPropagation();
              if (onPlayComparison) onPlayComparison(token.cleanWord, token);
            }}
            className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer active:scale-95 border ${
              snippetPlaying?.word === token.cleanWord &&
              (snippetPlaying.mode === "compare-user" || snippetPlaying.mode === "compare-target")
                ? "bg-purple-600 text-white border-purple-500 animate-pulse"
                : hasAudio
                ? "bg-purple-950/60 hover:bg-purple-900 text-purple-200 border-purple-800"
                : "bg-slate-800 text-slate-500 border-slate-700 opacity-60 cursor-not-allowed"
            }`}
            title="Önce sizin söyleyişinizi, hemen ardından doğru telaffuzu dinletir"
          >
            <RotateCcw className="w-3 h-3 text-purple-300" />
            <span>
              {snippetPlaying?.word === token.cleanWord &&
              (snippetPlaying.mode === "compare-user" || snippetPlaying.mode === "compare-target")
                ? snippetPlaying.mode === "compare-user"
                  ? "1/2: Sesiniz..."
                  : "2/2: Doğru..."
                : "Karşılaştır"}
            </span>
          </button>
        </div>

        {!hasAudio && (
          <p className="text-[10px] text-slate-400 italic text-center">
            Kendi söyleyişinizi dinlemek için mikrofonla ses kaydı yapın.
          </p>
        )}
      </div>

      {/* Word Stress (if available) */}
      {token.phoneticDetail?.stress && (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-medium mb-2.5">
          <span className="text-slate-400">Hece Vurgusu:</span>
          <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 text-[11px]">
            {token.phoneticDetail.stress}
          </span>
        </div>
      )}

      {/* Phonetic Suggestion & Articulation Guidance */}
      <div className="text-[11px] text-slate-200 leading-relaxed bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/70 mb-2.5">
        <span className="font-semibold text-rose-300 block mb-0.5">
          Fonetik Düzeltme Önerisi:
        </span>
        <p>
          {token.phoneticDetail?.tip ||
            "Bu kelimedeki fonemleri ve hece vurgusunu netleştirerek tekrar deneyin."}
        </p>
      </div>

      {/* Popover Footer */}
      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1.5 border-t border-slate-800">
        <span>Ağız pozisyonunu dinleyip tekrar edin</span>
        <span className="text-rose-400 font-semibold">Hata Vurgulayıcı</span>
      </div>
    </div>
  );
};
