/**
 * İKON ŞERİDİ (64px)
 *
 * Menü panelinin solundaki dar şerit. Paneldeki gezinmeden farklı bir işi
 * var ve ayrı durmasının sebebi bu: panel "hangi bölümdeyim" sorusunu,
 * şerit "nereden olursa olsun yapabileceğim şey" sorusunu karşılıyor.
 * Bu yüzden şeritteki üç düğme de hangi katmanda olursan ol aynı işi
 * yapıyor ve hiçbiri "aktif" duruma girmiyor.
 *
 * Ders arama ile ders ekleme AYNI pencereyi açıyor (LessonPickerModal):
 * pencerede hem arama kutusu hem "yeni ders" var. İki ayrı düğmenin tek
 * hedefe gitmesi tekrar gibi duruyor ama değil — biri var olanı bulmak,
 * diğeri yenisini eklemek için basılıyor ve pencere ikisini de karşılıyor.
 */

import React from 'react';
import { Search, Plus } from 'lucide-react';

interface Props {
  /** Ders arama / seçme penceresini açar. */
  onOpenLessonPicker: () => void;
  /** Yeni ders ekleme akışını başlatır. */
  onAddLesson: () => void;
  /** Akış ekranına döner. */
  onGoHome: () => void;
}

export const IconRail: React.FC<Props> = ({
  onOpenLessonPicker, onAddLesson, onGoHome,
}) => {
  const railButton = (
    onClick: () => void,
    label: string,
    icon: React.ReactNode
  ) => (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-2
        transition-colors duration-150 hover:bg-paper-3 hover:text-ink cursor-pointer"
    >
      {icon}
    </button>
  );

  return (
    <nav
      aria-label="Kısayollar"
      className="hidden w-16 shrink-0 flex-col items-center gap-1 border-r border-hairline
        bg-paper-2 py-3 lg:sticky lg:top-16 lg:flex lg:h-[calc(100dvh-4rem)]"
    >
      {/* Marka rozeti — şeritteki tek renkli öğe, aynı zamanda ana sayfa */}
      <button
        type="button"
        onClick={onGoHome}
        title="Akışa dön"
        aria-label="Akışa dön"
        className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brand
          font-display text-[17px] font-semibold text-white
          transition-opacity duration-150 hover:opacity-90 cursor-pointer"
      >
        K
      </button>

      {railButton(onOpenLessonPicker, 'Ders ara', <Search className="h-[18px] w-[18px]" />)}
      {railButton(onAddLesson, 'Yeni ders ekle', <Plus className="h-[18px] w-[18px]" />)}
    </nav>
  );
};
