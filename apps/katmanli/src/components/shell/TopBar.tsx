/**
 * ÜST ÇUBUK
 *
 * Yapışkan, yarı saydam ve tek satır. İçinde yalnızca her ekranda
 * gereken şeyler var:
 *
 *   SOL   marka + AKTİF DERS. Ders adı burada duruyor çünkü çalışırken
 *         "hangi ders üzerindeyim" sorusu sürekli sorulan bir soru;
 *         eskiden bunu görmek için sayfanın başına dönmek gerekiyordu.
 *   SAĞ   sayaçlar ve araçlar.
 *
 * DERS SEÇİMİ NEDEN BURADA: eskiden "Çalışma İçeriği Seçimi" paneli
 * sayfanın en üstünde sabit yer kaplıyordu ve her ders kartı ekranın
 * üçte birini yiyordu. Oysa ders seçmek nadir bir iş — bir kere seçilip
 * saatlerce çalışılıyor. Sürekli görünen bir panel yerine tek bir
 * hapa dönüştü; tıklayınca modal açılıyor.
 */

import React from 'react';
import {
  Menu, ChevronDown, Flame, Video, Sparkles, HelpCircle,
  CalendarRange, KeyRound, PlayCircle,
} from 'lucide-react';
import { UserProgress, VideoLesson } from '../../types';

interface Props {
  progress: UserProgress;
  activeLesson: VideoLesson | null;
  /** Dar ekranda katman çekmecesini açar. */
  onOpenSidebar: () => void;
  onOpenLessonPicker: () => void;
  onOpenGuide: () => void;
  onOpenGrammarCoach: () => void;
  onOpenSettings: () => void;
  onOpenReport: () => void;
  isReportActive: boolean;
  /** Hedef ve seri düzenleyicisini açar. */
  onEditGoals: () => void;
}

export const TopBar: React.FC<Props> = ({
  progress, activeLesson, onOpenSidebar, onOpenLessonPicker,
  onOpenGuide, onOpenGrammarCoach, onOpenSettings, onOpenReport,
  isReportActive, onEditGoals,
}) => {
  const goalPercentage = Math.min(
    100,
    Math.round((progress.completedVideoCount / Math.max(1, progress.goalVideoCount)) * 100)
  );

  /** İkon düğmeleri: aynı ölçü ve aynı geçiş. */
  const iconButton = (
    onClick: () => void,
    title: string,
    icon: React.ReactNode,
    active = false
  ) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border
        transition-all duration-200 ease-in-out cursor-pointer
        ${active
          ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900'}`}
    >
      {icon}
    </button>
  );

  return (
    <header
      className="sticky top-0 z-30 border-b border-slate-200
        bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70"
    >
      <div className="flex h-16 items-center gap-3 px-3 sm:px-5">

        {/* Dar ekranda katman çekmecesi */}
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Katmanları aç"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
            border border-slate-200 bg-white text-slate-600
            transition-colors hover:text-slate-900 cursor-pointer lg:hidden"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Marka.
            Telefonda GIZLI: 375px'te marka + ders hapi + dort dugme
            yan yana sigmiyor ve sag taraf 36px tasip sayfayi yatay
            kaydiriyordu (olculdu). Dar ekranda uygulamayi zaten
            cekmece dugmesi ve ders hapi tanitiyor. */}
        <div className="hidden shrink-0 items-baseline gap-2 sm:flex">
          <span className="text-[15px] font-semibold tracking-tight text-slate-900 whitespace-nowrap">
            Katmanlı İngilizce
          </span>
        </div>

        {/* Aktif ders — tıklanınca seçici açılır */}
        <button
          type="button"
          onClick={onOpenLessonPicker}
          title="Ders değiştir veya yeni ders ekle"
          className="group ml-1 flex min-w-0 flex-1 items-center gap-2 rounded-lg
            border border-slate-200 bg-white px-2.5 py-1.5 text-left
            transition-all duration-200 ease-in-out
            hover:border-indigo-300 hover:ring-2 hover:ring-indigo-500/10
            cursor-pointer sm:max-w-md"
        >
          <PlayCircle className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium leading-tight text-slate-900">
              {activeLesson ? activeLesson.title : 'Ders seç veya ekle'}
            </span>
            {activeLesson && (
              <span className="block truncate text-[11px] leading-tight text-slate-500">
                {[
                  activeLesson.cefrLevel,
                  `${activeLesson.sentences.length} cümle`,
                ].filter(Boolean).join(' · ')}
              </span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </button>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">

          {/* Seri ve hedef — tek bir sayı şeridi */}
          <button
            type="button"
            onClick={onEditGoals}
            title="Hedefi ve seriyi düzenle"
            className="hidden items-center gap-3 rounded-lg border border-slate-200 bg-white
              px-3 py-1.5 transition-all duration-200 ease-in-out
              hover:border-slate-300 cursor-pointer md:flex"
          >
            <span className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              <span className="timecode font-semibold text-slate-900">
                {progress.studyStreakDays}
              </span>
              <span className="text-[10px] text-slate-500">gün</span>
            </span>

            <span className="h-4 w-px bg-slate-200" />

            <span className="flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5 text-slate-400" />
              <span className="timecode font-semibold text-slate-900">
                {progress.completedVideoCount}
                <span className="text-slate-500">/{progress.goalVideoCount}</span>
              </span>
            </span>

            <span className="hidden h-1 w-12 overflow-hidden rounded-full bg-slate-100 lg:block">
              <span
                className="block h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${goalPercentage}%` }}
              />
            </span>
          </button>

          {/* Gramer koçu: birincil araç, dolgulu */}
          <button
            type="button"
            onClick={onOpenGrammarCoach}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-3
              text-[12px] font-medium text-white shadow-sm
              transition-all duration-200 ease-in-out
              hover:bg-indigo-700 hover:shadow-md cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Gramer Koçu</span>
          </button>

          {iconButton(onOpenReport, 'Karne', <CalendarRange className="w-4 h-4" />, isReportActive)}
          {iconButton(onOpenGuide, 'Metot rehberi', <HelpCircle className="w-4 h-4" />)}
          {iconButton(onOpenSettings, 'API anahtarları', <KeyRound className="w-4 h-4" />)}
        </div>
      </div>
    </header>
  );
};
