/**
 * ANA MENÜ PANELİ (~260px)
 *
 * Bu on bölüm eskiden sayfanın ORTASINDA, beş sütunlu bir kart ızgarası
 * olarak duruyordu. Üç sorunu vardı:
 *
 *   1. İçeriğin üstünde iki sıra kart, ekranın yarısını yiyordu; asıl
 *      okuma parçası katlamanın altında kalıyordu.
 *   2. Her kartta ikon kutusu + başlık + BÜYÜK HARF alt başlık vardı.
 *      On tanesi yan yana gelince alt başlıklar bilgi olmaktan çıkıp
 *      desen oluyordu ("KÜLLİYAT SÖZLÜĞÜ", "TABLOLAR & TESTLER"…).
 *   3. Bölümler arasında hiçbir gruplama yoktu: sınav simülasyonu ile
 *      kelime haznesi aynı görsel ağırlıktaydı.
 *
 * Dikey liste üçünü de çözüyor ve katmanlı uygulamanın menüsüyle aynı
 * dili konuşuyor — iki uygulama aynı sitede yan yana duruyor.
 *
 * GRUPLAMA: okuduğun şey / kelime çalışman / kendini ölçmen. Üçü farklı
 * işler ve farklı sıklıkta açılıyorlar.
 */

import React from 'react';
import { X, LayoutDashboard } from 'lucide-react';

export type ReadingTab =
  | 'dashboard' | 'passages' | 'stories' | 'trainer' | 'list'
  | 'workbook' | 'mistakes' | 'exam' | 'cards' | 'report';

interface NavItem {
  id: ReadingTab;
  label: string;
  emoji: string;
  /** Fare üstünde çıkan açıklama; ekranda sürekli durmuyor. */
  hint: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Okuma',
    items: [
      { id: 'passages', label: 'Okuma Parçaları', emoji: '📖', hint: 'Kütüphane metinleri' },
      { id: 'stories',  label: 'Hikayelerim',     emoji: '✨', hint: 'Sana özel, sesli hikayeler' },
    ],
  },
  {
    title: 'Kelime',
    items: [
      { id: 'trainer',  label: 'Kelime Çalışma', emoji: '🎯', hint: 'Hafıza kartları ve test' },
      { id: 'cards',    label: 'Kelime Kartları', emoji: '🗂️', hint: 'FSRS aralıklı tekrar' },
      { id: 'list',     label: 'Kelime Haznesi',  emoji: '📚', hint: 'Külliyat sözlüğü' },
      { id: 'workbook', label: 'Kelime Kitabı',   emoji: '📓', hint: 'Tablolar ve testler' },
    ],
  },
  {
    title: 'Ölçme & Takip',
    items: [
      { id: 'exam',     label: 'Sınav Simülasyonu', emoji: '⏱️', hint: 'Süreli deneme sınavı' },
      { id: 'mistakes', label: 'Yanlışlar Defteri', emoji: '📝', hint: 'Hatalı sorular' },
      { id: 'report',   label: 'Karne',             emoji: '🗓️', hint: 'Çalışma takvimi' },
    ],
  },
];

interface Props {
  activeTab: ReadingTab;
  onSelectTab: (tab: ReadingTab) => void;
  /** Yanlışlar defterindeki soru sayısı — satırda rozet olarak görünür. */
  mistakeCount: number;
  isOpen: boolean;
  onClose: () => void;
}

const GroupLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="eyebrow block px-3 pb-1.5 pt-1">{children}</span>
);

export const ReadingSidebar: React.FC<Props> = ({
  activeTab, onSelectTab, mistakeCount, isOpen, onClose,
}) => {
  const renderItem = (item: NavItem) => {
    const isActive = activeTab === item.id;
    // Sifir soru bir bilgi degil; rozet yalnizca gercekten is varken cikar.
    const badge = item.id === 'mistakes' && mistakeCount > 0 ? mistakeCount : null;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => { onSelectTab(item.id); onClose(); }}
        aria-current={isActive ? 'page' : undefined}
        title={item.hint}
        className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left
          text-[13px] transition-colors duration-150 cursor-pointer
          ${isActive
            ? 'bg-accent font-medium text-white'
            : 'text-ink hover:bg-paper-3'}`}
      >
        <span aria-hidden="true" className="w-5 shrink-0 text-center text-[15px] leading-none">
          {item.emoji}
        </span>
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        {badge !== null && (
          <span className={`timecode shrink-0 rounded px-1.5 text-[11px] ${
            isActive ? 'bg-white/20 text-white' : 'bg-paper-3 text-ink-2'
          }`}>
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Bölümler"
        data-open={isOpen ? 'true' : 'false'}
        className="layer-drawer fixed left-0 top-0 z-50 h-full w-[var(--sidebar-w)] shrink-0
          border-r border-hairline bg-paper-2
          lg:sticky lg:top-16 lg:z-20 lg:h-[calc(100dvh-4rem)]"
      >
        <div className="flex h-full flex-col overflow-y-auto px-3 pb-6 pt-4">

          <div className="mb-1 flex items-center justify-between px-3 lg:hidden">
            <span className="text-sm font-semibold text-ink">Bölümler</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-paper-3 hover:text-ink cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Gösterge paneli — panelin tek dolu düğmesi, girişin kendisi */}
          <button
            type="button"
            onClick={() => { onSelectTab('dashboard'); onClose(); }}
            aria-current={activeTab === 'dashboard' ? 'page' : undefined}
            className={`mb-4 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5
              text-[13px] font-medium transition-colors duration-150 cursor-pointer
              ${activeTab === 'dashboard'
                ? 'bg-accent text-white'
                : 'text-ink hover:bg-paper-3'}`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            Gösterge Paneli
          </button>

          {NAV_GROUPS.map((group, i) => (
            <div key={group.title} className={i === 0 ? '' : 'mt-5'}>
              <GroupLabel>{group.title}</GroupLabel>
              <div className="space-y-px">{group.items.map(renderItem)}</div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};
