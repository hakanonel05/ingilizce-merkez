/**
 * ÜST ÇUBUK
 *
 * Üç bölge, üç ayrı soru:
 *
 *   SOL    marka.
 *   ORTA   üst seviye gezinme — hangi BÖLÜMDEYİM.
 *   SAĞ    her ekranda elimin altında olması gereken araçlar ve sayaçlar.
 *
 * AKTİF DERS ARTIK BURADA DEĞİL. Eskiden ders adı ortada bir hap olarak
 * duruyordu; orta bölge üst seviye gezinmeye ayrılınca ders bilgisi bir
 * seviye aşağı, içerik sütununa indi (Akış ekranındaki "Aktif Çalışma"
 * kartı ve katman ekranlarındaki ders şeridi). Ders seçmek nadir bir iş —
 * bir kere seçilip saatlerce çalışılıyor — ama hangi derste olduğunu
 * görmek sık, ve o bilgi artık çalıştığın sütunun kendi içinde duruyor.
 *
 * ORTADA İKİ SEKME VAR, DÖRT DEĞİL. Bir süre "Etkinlikler" ve "Sıralama"
 * da duruyordu — kapalı, tıklanmayan, soluk. Gerekçe "tasarımdaki yerlerini
 * koruyorlar" idi ve bu geçersiz bir gerekçeydi: ikisi de referans alınan
 * siteden gelen boş kabuklardı. Bu uygulamada ne etkinlik takvimi var, ne
 * de kullanıcılar arası bir sıralama OLABİLİR — tek kullanıcılı, bütün
 * veri kullanıcının kendi cihazında. Soluk bir sekme "yakında geliyor"
 * demektir; gelmeyecek bir şey için söylenen bu, yer tutucu içeriktir.
 */

import React from 'react';
import {
  Menu, Flame, Video, Sparkles, HelpCircle, CalendarRange, KeyRound, BookOpen,
} from 'lucide-react';
import { UserProgress } from '../../types';
import { HOME_LAYER } from './LayerSidebar';

interface Props {
  progress: UserProgress;
  activeLayer: number;
  /** Dar ekranda menü panelini açar. */
  onOpenSidebar: () => void;
  onGoHome: () => void;
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
  progress, activeLayer, onOpenSidebar, onGoHome, onOpenLessonPicker,
  onOpenGuide, onOpenGrammarCoach, onOpenSettings, onOpenReport,
  isReportActive, onEditGoals,
}) => {
  const goalPercentage = Math.min(
    100,
    Math.round((progress.completedVideoCount / Math.max(1, progress.goalVideoCount)) * 100)
  );

  /**
   * Orta gezinme sekmesi. Aktif olan açık gri bir hap — menü panelindeki
   * dolu menekşeden bilerek FARKLI: iki ayrı gezinme seviyesi, iki ayrı
   * aktiflik dili. Aynı olsalardı hangisinin hangisini kapsadığı
   * okunmazdı.
   *
   * `onClick` verilmeyen sekme kapalıdır (bkz. dosya başındaki not).
   */
  const navTab = (
    label: string,
    isActive: boolean,
    onClick?: () => void
  ) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      disabled={!onClick}
      title={onClick ? undefined : 'Bu bölüm henüz açılmadı'}
      aria-current={isActive ? 'page' : undefined}
      className={`rounded-lg px-3 py-1.5 text-[13px] transition-colors duration-150
        ${!onClick
          ? 'cursor-not-allowed text-ink-3 opacity-50'
          : isActive
            ? 'bg-paper-3 font-medium text-ink cursor-pointer'
            : 'text-ink-2 hover:text-ink cursor-pointer'}`}
    >
      {label}
    </button>
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
      className={`flex h-9 w-9 items-center justify-center rounded-xl
        transition-colors duration-150 cursor-pointer
        ${active
          ? 'bg-accent-soft text-accent'
          : 'text-ink-3 hover:bg-paper-3 hover:text-ink'}`}
    >
      {icon}
    </button>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-paper-2">
      <div className="flex h-16 items-center gap-3 px-3 sm:px-5">

        {/* Dar ekranda menü paneli */}
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

        {/* MARKA.
            Serif YALNIZCA burada. Başlıklarda serif denenmiş ve
            bırakılmıştı (bkz. index.css tipografi notu): yan yana duran
            onlarca küçük başlıkta dağınık duruyordu. Tek bir kelime
            işaretinde ise tam tersi işe yarıyor — arayüzün geri kalanı
            sans olduğu için marka kendiliğinden ayrışıyor.

            Turuncu ikinci kelimede: bir ifadenin tek kelimesini marka
            rengine ayırma hareketi. Ekrandaki tek turuncu bu. */}
        <button
          type="button"
          onClick={onGoHome}
          className="shrink-0 cursor-pointer whitespace-nowrap"
          aria-label="Akışa dön"
        >
          {/* DAR EKRANDA ROZET, GENİŞ EKRANDA TAM AD.
              Tam ad 19px serif ve ~150px yer kaplıyor; 375px'te menü
              düğmesi + ad + sağdaki araçlar yan yana sığmıyor ve sağ grup
              41px taşıp sayfayı yatay kaydırıyordu (ölçüldü: 417/375).
              Rozet, geniş ekranda ikon şeridinin taşıdığı işaretin
              aynısı — marka mobilde kaybolmuyor, yalnızca kısalıyor. */}
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand
              font-display text-[15px] font-semibold text-white sm:hidden"
          >
            K
          </span>
          <span className="wordmark hidden text-[19px] text-ink sm:inline">
            Katmanlı <span className="text-brand">İngilizce</span>
          </span>
        </button>

        {/* ORTA GEZİNME */}
        <nav
          aria-label="Bölümler"
          className="ml-2 hidden min-w-0 flex-1 items-center gap-1 md:flex"
        >
          {navTab('Akış', activeLayer === HOME_LAYER, onGoHome)}
          {navTab('Dersler', false, onOpenLessonPicker)}
        </nav>

        {/* Orta gezinme gizliyken sağ grup sağa yaslansın */}
        <div className="flex-1 md:hidden" />

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">

          {/* Seri ve hedef — tek bir sayı şeridi */}
          <button
            type="button"
            onClick={onEditGoals}
            title="Hedefi ve seriyi düzenle"
            className="hidden items-center gap-3 rounded-xl border border-hairline
              px-3 py-1.5 transition-colors duration-150
              hover:bg-paper-3 cursor-pointer md:flex"
          >
            <span className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-marker" />
              <span className="timecode font-semibold text-ink">
                {progress.studyStreakDays}
              </span>
              <span className="text-[10px] text-ink-3">gün</span>
            </span>

            <span className="h-4 w-px bg-hairline" />

            <span className="flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5 text-ink-3" />
              <span className="timecode font-semibold text-ink">
                {progress.completedVideoCount}
                <span className="text-ink-3">/{progress.goalVideoCount}</span>
              </span>
            </span>

            <span className="hidden h-1 w-12 overflow-hidden rounded-full bg-paper-3 lg:block">
              <span
                className="block h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${goalPercentage}%` }}
              />
            </span>
          </button>

          {/* Gramer koçu: birincil araç, dolgulu ve düz */}
          <button
            type="button"
            onClick={onOpenGrammarCoach}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-accent px-3
              text-[12px] font-medium text-white
              transition-colors duration-150 hover:bg-accent-700 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Gramer Koçu</span>
          </button>

          {iconButton(onOpenReport, 'Karne', <CalendarRange className="h-4 w-4" />, isReportActive)}
          {iconButton(onOpenGuide, 'Metot rehberi', <HelpCircle className="h-4 w-4" />)}
          {iconButton(onOpenSettings, 'API anahtarları', <KeyRound className="h-4 w-4" />)}

          {/* Kullanim kilavuzu: sitenin kendi statik sayfasi (/kilavuz/).
              Ayni sekmede aciliyor. Once yeni sekmeye aciyordu, gerekcesi
              "yarim kalan calisma kaybolmasin" idi; ama o kayip gercek bir
              hataydi ve yeni sekme yalnizca BU yolu koruyordu - geri tusuna
              basan yine kaybediyordu. Kayip kaynagindan kapatildi
              (Layer4WritingEvaluation'daki otomatik kayit), yeni sekmeye
              gerek kalmadi. Kullanici isterse zaten orta tikla acabilir. */}
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
};
