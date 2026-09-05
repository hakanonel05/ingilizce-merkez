/**
 * ÜST ÇUBUK — READING
 *
 * Katmanlıdaki üst çubuğun ikizi: solda marka, sağda araçlar ve sayaçlar.
 *
 * YEDİ ÇERÇEVELİ DÜĞME GİTTİ. Burada Eşitlendi / Çıkış / Ekle / Ayarlar /
 * Yedekle / Geri Yükle / Seri / Süre yan yana duruyordu; hepsi kenarlıklı,
 * hepsi BÜYÜK HARF, hepsi aynı görsel ağırlıkta. Sekiz eşit vurgu, hiç
 * vurgu olmamasıyla aynı şey — üstelik dar ekranda satır sarıp üst çubuğu
 * iki-üç sıra yüksekliğe çıkarıyorlardı.
 *
 * Şimdi ikiye ayrılmış durumdalar:
 *   SAYAÇLAR  (seri, süre) tek bir şeritte, katmanlıdaki gibi.
 *   ARAÇLAR   etiketsiz ikon düğmeleri. Nadir kullanılan yedekleme ve
 *             geri yükleme buradan çıkıp "Veri" menüsünün altına indi;
 *             ikisi de yılda birkaç kez basılan düğmeler.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Menu, Zap, Clock, CloudCog, CloudOff, LogOut, Settings2,
  Download, Upload, Smartphone, Database,
} from 'lucide-react';

interface Props {
  onOpenSidebar: () => void;
  onGoHome: () => void;
  /** Oturum yoksa çevrimdışı moddayız. */
  hasSession: boolean;
  isSyncing: boolean;
  dailyStreak: number;
  /** Saniye cinsinden toplam çalışma süresi. */
  totalTimeSpent: number;
  showInstallBtn: boolean;
  onInstallPWA: () => void;
  onOpenSettings: () => void;
  onBackup: () => void;
  onRestore: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const ReadingTopBar: React.FC<Props> = ({
  onOpenSidebar, onGoHome, hasSession, isSyncing, dailyStreak, totalTimeSpent,
  showInstallBtn, onInstallPWA, onOpenSettings, onBackup, onRestore,
  onSignIn, onSignOut,
}) => {
  const [isDataMenuOpen, setIsDataMenuOpen] = useState(false);
  const dataMenuRef = useRef<HTMLDivElement>(null);

  // Disari tiklayinca ve Esc ile kapanir.
  useEffect(() => {
    if (!isDataMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!dataMenuRef.current?.contains(e.target as Node)) setIsDataMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsDataMenuOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isDataMenuOpen]);

  const iconButton = (
    onClick: () => void,
    title: string,
    icon: React.ReactNode
  ) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-3
        transition-colors duration-150 hover:bg-paper-3 hover:text-ink cursor-pointer"
    >
      {icon}
    </button>
  );

  return (
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

        {/* MARKA. Katmanlıdaki kuralın aynısı: serif yalnızca burada, ve
            ifadenin ikinci kelimesi marka renginde. Dar ekranda tam ad
            sağdaki araçları taşırdığı için rozete iniyor. */}
        <button
          type="button"
          onClick={onGoHome}
          className="shrink-0 cursor-pointer whitespace-nowrap"
          aria-label="Gösterge paneline dön"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand
              font-display text-[15px] font-semibold text-white sm:hidden"
          >
            L
          </span>
          <span className="wordmark hidden text-[19px] text-ink sm:inline">
            Lexis <span className="text-brand">Trainer</span>
          </span>
        </button>

        <div className="flex-1" />

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">

          {/* Sayaçlar — tek şerit, katmanlıdaki ile aynı biçim */}
          <div className="hidden items-center gap-3 rounded-xl border border-hairline px-3 py-1.5 md:flex">
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-marker" />
              <span className="timecode font-semibold text-ink">{dailyStreak}</span>
              <span className="text-[10px] text-ink-3">gün</span>
            </span>
            <span className="h-4 w-px bg-hairline" />
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-ink-3" />
              <span className="timecode font-semibold text-ink">
                {Math.floor(totalTimeSpent / 60)}
              </span>
              <span className="text-[10px] text-ink-3">dk</span>
            </span>
          </div>

          {/* Eşitleme durumu. Çevrimdışıyken bu bir DURUM değil bir
              çağrı: tıklanınca giriş ekranı açılıyor. */}
          {hasSession ? (
            <span
              title={isSyncing ? 'Eşitleniyor' : 'Eşitlendi'}
              className="flex h-9 w-9 items-center justify-center text-ink-3"
            >
              <CloudCog className={`h-4 w-4 ${isSyncing ? 'animate-spin text-brand' : ''}`} />
            </span>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-accent px-3
                text-[12px] font-medium text-white transition-colors duration-150
                hover:bg-accent-700 cursor-pointer"
            >
              <CloudOff className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Giriş yap</span>
            </button>
          )}

          {showInstallBtn && iconButton(onInstallPWA, 'Ana ekrana ekle', <Smartphone className="h-4 w-4" />)}

          {/* Veri menüsü — yedekle / geri yükle. İkisi de nadir. */}
          <div className="relative" ref={dataMenuRef}>
            {iconButton(
              () => setIsDataMenuOpen((v) => !v),
              'Veri yedekleme',
              <Database className="h-4 w-4" />
            )}
            {isDataMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-11 z-40 w-52 overflow-hidden rounded-xl
                  border border-hairline bg-paper-2 py-1 shadow-lg shadow-ink/5"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { setIsDataMenuOpen(false); onBackup(); }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]
                    text-ink transition-colors hover:bg-paper-3 cursor-pointer"
                >
                  <Download className="h-4 w-4 text-ink-3" />
                  Verileri yedekle
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { setIsDataMenuOpen(false); onRestore(); }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]
                    text-ink transition-colors hover:bg-paper-3 cursor-pointer"
                >
                  <Upload className="h-4 w-4 text-ink-3" />
                  Yedekten geri yükle
                </button>
              </div>
            )}
          </div>

          {iconButton(onOpenSettings, 'API anahtarları', <Settings2 className="h-4 w-4" />)}

          {hasSession && iconButton(onSignOut, 'Çıkış yap', <LogOut className="h-4 w-4" />)}
        </div>
      </div>
    </header>
  );
};
