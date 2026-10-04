/**
 * MOR KELİMENİN PENCERESİ
 *
 * Mor işaretli bir kelimenin (data-card-front) üzerine fareyle gelince
 * kartın Türkçe karşılığını, okunuşunu ve bir hoparlör düğmesini gösterir.
 * Dokunmatik ekranda kelimeye dokununca açılır.
 *
 * Uygulama başına BİR kez kökte durur ve olay devretmeyle çalışır: bir
 * transkriptte yüzlerce mor kelime olabiliyor, her birine ayrı dinleyici
 * ve ayrı pencere bağlamak yerine belge düzeyinde tek dinleyici var.
 *
 * Fare kelimeden pencereye geçerken pencere hemen kapanmıyor (kısa bir
 * bekleme var) — yoksa hoparlöre basmak imkânsız olurdu.
 *
 * SES: varsayılan tarayıcı sesi. Katmanlı kendi doğal seslendirmesini
 * setCardWordSpeaker ile bağlıyor; reading tarayıcı sesinde kalıyor.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, Loader2 } from 'lucide-react';
import { cardInfo, CardInfo } from './cardTerms';
import { CardSenses, fillCardSenses } from './CardSenses';

type Speaker = (text: string) => void;

const browserSpeak: Speaker = (text) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
};

let speaker: Speaker = browserSpeak;

/** Hoparlör düğmesinin sesi. Uygulama açılışında bir kez çağrılır. */
export function setCardWordSpeaker(fn: Speaker): void {
  speaker = fn;
}

interface Open {
  info: CardInfo;
  /** Metinde geçtiği biçim ("engages"); kartın ön yüzünden farklıysa gösteriliyor. */
  surface: string;
  rect: DOMRect;
}

const OPEN_DELAY = 120;
const CLOSE_DELAY = 220;
const WIDTH = 264;

export const CardWordHover: React.FC = () => {
  const [open, setOpen] = useState<Open | null>(null);
  // Eski kartın anlamları çekiliyor mu / çekilemediyse neden.
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const anchorRef = useRef<Element | null>(null);

  const clearTimers = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  };

  const show = useCallback((el: Element) => {
    const front = el.getAttribute('data-card-front');
    const info = front ? cardInfo(front) : undefined;
    if (!info) return;
    anchorRef.current = el;
    setFetchError(null);
    setOpen({ info, surface: el.textContent?.trim() || info.front, rect: el.getBoundingClientRect() });
  }, []);

  const close = useCallback(() => {
    clearTimers();
    anchorRef.current = null;
    setOpen(null);
  }, []);

  const scheduleClose = useCallback(() => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(close, CLOSE_DELAY);
  }, [close]);

  useEffect(() => {
    const target = (e: Event) =>
      (e.target as Element | null)?.closest?.('[data-card-front]') ?? null;

    const inPopover = (n: EventTarget | null) =>
      !!(n as Element | null)?.closest?.('[data-card-popover]');

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      // Fare pencereye geçti: kapanmayı iptal et ki hoparlöre basılabilsin.
      if (inPopover(e.target)) { window.clearTimeout(closeTimer.current); return; }
      const el = target(e);
      if (!el) return;
      window.clearTimeout(closeTimer.current);
      if (el === anchorRef.current) return;
      window.clearTimeout(openTimer.current);
      openTimer.current = window.setTimeout(() => show(el), OPEN_DELAY);
    };
    const onOut = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const to = e.relatedTarget as Element | null;
      if (inPopover(e.target)) {
        // Pencerenin içinde bir öğeden ötekine geçiş "çıkış" değil.
        if (!inPopover(to)) scheduleClose();
        return;
      }
      const el = target(e);
      if (!el) return;
      // Kelimenin içindeki bir alt öğeye geçiş "çıkış" değil.
      if (to && el.contains(to)) return;
      scheduleClose();
    };
    // Dokunmatik: mor kelimeye dokununca aç, başka yere dokununca kapat.
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.('[data-card-popover]')) return;
      const el = target(e);
      const isTouch = (e as PointerEvent).pointerType && (e as PointerEvent).pointerType !== 'mouse';
      if (el && isTouch) {
        if (el === anchorRef.current) close(); else show(el);
        return;
      }
      if (!el && anchorRef.current) close();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    // Sayfa ya da transkript kayınca pencere kelimeden kopmasın.
    const onScroll = () => { if (anchorRef.current) close(); };

    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      clearTimers();
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [show, close, scheduleClose]);

  if (!open) return null;

  const loadSenses = async () => {
    setFetching(true);
    setFetchError(null);
    try {
      const senses = await fillCardSenses(open.info.card);
      setOpen((o) => (o ? { ...o, info: { ...o.info, senses } } : o));
    } catch (err: any) {
      setFetchError(err?.message || 'Anlamlar alınamadı.');
    } finally {
      setFetching(false);
    }
  };

  // Kelimenin altında; altta yer yoksa üstünde. Yatayda ekrandan taşmaz.
  const { rect, info, surface } = open;
  const left = Math.max(8, Math.min(rect.left + rect.width / 2 - WIDTH / 2, window.innerWidth - WIDTH - 8));
  const below = window.innerHeight - rect.bottom > 150;
  const pos: React.CSSProperties = below
    ? { top: rect.bottom + 6 }
    : { bottom: window.innerHeight - rect.top + 6 };
  const showSurface = surface.toLowerCase() !== info.front.toLowerCase();

  return createPortal(
    <div
      data-card-popover
      role="dialog"
      aria-label={`${info.front}: ${info.back || 'Türkçe karşılığı yok'}`}
      style={{ position: 'fixed', left, width: WIDTH, zIndex: 80, ...pos }}
      className="rounded-xl border border-hairline bg-paper-2 p-3 shadow-lg"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-cardword">{info.front}</p>
          {(info.ipa || showSurface) && (
            <p className="mt-0.5 truncate text-[11px] text-ink-3">
              {info.ipa && <span>/{info.ipa.replace(/^\/|\/$/g, '')}/</span>}
              {info.ipa && showSurface && ' · '}
              {showSurface && <span>metinde: {surface}</span>}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => speaker(info.front)}
          aria-label={`Sesli dinle: ${info.front}`}
          title="Sesli dinle"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline
            text-ink-2 transition-colors hover:bg-paper-3 hover:text-ink cursor-pointer"
        >
          <Volume2 className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 text-[14px] leading-snug text-ink">
        {info.back || <span className="text-ink-3">Türkçe karşılığı yok</span>}
      </p>
      {/* Üstteki karşılık kelimenin karta eklendiği cümledeki anlamı;
          altta sözlükteki öteki anlamları. Eski kartlarda bu bilgi yok,
          bir dokunuşla çekiliyor ve karta kaydediliyor. */}
      {info.senses?.length ? (
        <div className="mt-2.5 border-t border-hairline pt-2">
          <CardSenses senses={info.senses} back={info.back} compact />
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={loadSenses}
            disabled={fetching}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-cardword
              hover:underline disabled:cursor-wait disabled:opacity-60 cursor-pointer"
          >
            {fetching && <Loader2 className="h-3 w-3 animate-spin" />}
            {fetching ? 'Anlamlar getiriliyor…' : 'Diğer anlamları getir'}
          </button>
          {fetchError && <span className="truncate text-[11px] text-danger">{fetchError}</span>}
        </div>
      )}
      <p className="mt-2 text-[11px] text-ink-3">Kelime kartında var</p>
    </div>,
    document.body
  );
};
