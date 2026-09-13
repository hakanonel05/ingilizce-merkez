/**
 * ÜST ÇUBUK — KONUŞMA
 *
 * Reading ve katmanlıdaki üst çubukların ikizi: solda marka, sağda sayaçlar
 * ve araçlar. Üç uygulama aynı sitede yan yana duruyor; farklı yükseklikte
 * ya da farklı hizalamada bir çubuk, sekme değiştirdiğinde sayfayı
 * zıplatırdı.
 *
 * SAYAÇ SEÇİMİ: alıştırma sayısı ve son seviye. "Toplam süre" bilerek yok —
 * burada geçirilen sürenin çoğu konuşmak değil, modelin inmesini ve
 * çözümlemeyi beklemek. Ölçtüğümüz şeyi göstermek, gösterdiğimiz şeyi
 * ölçtüğümüz anlamına gelmeli.
 */

import React from 'react';
import { Menu, Mic, Settings2, BookOpen, TrendingUp } from 'lucide-react';
import type { Cefr } from '../../types';

interface Props {
  onOpenSidebar: () => void;
  onGoHome: () => void;
  /** Bugüne kadar yapılan betimleme sayısı. */
  betimlemeSayisi: number;
  /** En son çözümlemenin seviyesi; hiç yapılmadıysa null. */
  sonSeviye: Cefr | null;
  onOpenSettings: () => void;
}

export const KonusmaTopBar: React.FC<Props> = ({
  onOpenSidebar, onGoHome, betimlemeSayisi, sonSeviye, onOpenSettings,
}) => (
  <header className="sticky top-0 z-30 border-b border-hairline bg-paper-2">
    <div className="flex h-16 items-center gap-3 px-3 sm:px-5">

      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Menüyü aç"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
          text-ink-2 transition-colors hover:bg-paper-3 hover:text-ink
          cursor-pointer lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* MARKA. Diğer iki uygulamadaki kuralın aynısı: serif yalnızca burada
          ve ifadenin ikinci kelimesi marka renginde. Dar ekranda tam ad
          sağdaki araçları taşırdığı için rozete iniyor. */}
      <button
        type="button"
        onClick={onGoHome}
        className="shrink-0 cursor-pointer whitespace-nowrap"
        aria-label="Alıştırmaya dön"
      >
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand
            text-white sm:hidden"
        >
          <Mic className="h-4 w-4" />
        </span>
        <span className="wordmark hidden text-[19px] text-ink sm:inline">
          Konuşma <span className="text-brand">Pratiği</span>
        </span>
      </button>

      <div className="flex-1" />

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">

        {/* Sayaçlar — tek şerit, diğer iki uygulamadaki ile aynı biçim */}
        {betimlemeSayisi > 0 && (
          <div className="hidden items-center gap-3 rounded-xl border border-hairline px-3 py-1.5 md:flex">
            <span className="flex items-center gap-1.5">
              <Mic className="h-3.5 w-3.5 text-ink-3" />
              <span className="timecode font-semibold text-ink">{betimlemeSayisi}</span>
              <span className="text-[10px] text-ink-3">betimleme</span>
            </span>
            {sonSeviye && (
              <>
                <span className="h-4 w-px bg-hairline" />
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-marker" />
                  <span className="timecode font-semibold text-ink">{sonSeviye}</span>
                </span>
              </>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onOpenSettings}
          title="API anahtarları"
          aria-label="API anahtarları"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-3
            transition-colors duration-150 hover:bg-paper-3 hover:text-ink cursor-pointer"
        >
          <Settings2 className="h-4 w-4" />
        </button>

        <a
          href="/kilavuz/"
          title="Kullanım kılavuzu"
          aria-label="Kullanım kılavuzu"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-3
            transition-colors duration-150 hover:bg-paper-3 hover:text-ink cursor-pointer"
        >
          <BookOpen className="h-4 w-4" />
        </a>
      </div>
    </div>
  </header>
);
