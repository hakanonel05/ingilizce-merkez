import React, { useState } from 'react';
import { BookOpen, Sparkles, Award, HelpCircle, Flame, Layers, Settings2, Check, X, KeyRound } from 'lucide-react';
import { UserProgress } from '../types';

interface HeaderProps {
  progress: UserProgress;
  onOpenGuide: () => void;
  onOpenGrammarCoach: () => void;
  /** Hedef ve seri degerlerini duzenlemek icin. */
  onUpdateProgress?: (patch: Partial<UserProgress>) => void;
  /** Kullanicinin kendi API anahtarlarini girecegi ekran. */
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  onOpenGuide,
  onOpenGrammarCoach,
  onUpdateProgress,
  onOpenSettings,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [goalDraft, setGoalDraft] = useState(String(progress.goalVideoCount));
  const [streakDraft, setStreakDraft] = useState(String(progress.studyStreakDays));

  const goalPercentage = Math.min(
    100,
    Math.round((progress.completedVideoCount / Math.max(1, progress.goalVideoCount)) * 100)
  );

  const openEditor = () => {
    setGoalDraft(String(progress.goalVideoCount));
    setStreakDraft(String(progress.studyStreakDays));
    setIsEditing(true);
  };

  const saveEdits = () => {
    if (!onUpdateProgress) return setIsEditing(false);

    const goal = Math.max(1, Math.min(999, parseInt(goalDraft, 10) || 1));
    const streak = Math.max(0, Math.min(9999, parseInt(streakDraft, 10) || 0));

    // Seri elle degistirilirse, gecmis gunler o sayiya uyacak sekilde yeniden
    // kurulur; aksi halde bir sonraki hesaplamada eski degere geri donerdi.
    const dates: string[] = [];
    for (let i = streak - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      dates.push(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      );
    }

    onUpdateProgress({
      goalVideoCount: goal,
      studyStreakDays: streak,
      studyDates: dates,
    });
    setIsEditing(false);
  };

  return (
    <header className="bg-[var(--paper)] border-b border-[var(--hairline)] sticky top-0 z-30">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Marka — kelime işareti, ikon kutusu yok */}
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="font-display text-[19px] sm:text-[21px] font-medium text-[var(--ink)] whitespace-nowrap">
            Katmanlı <em className="italic font-light text-[var(--ink-2)]">İngilizce</em>
          </span>
          <span className="eyebrow hidden lg:inline">Yedi Katmanlı Çalışma</span>
        </div>

        {/* Ölçüler ve araçlar */}
        <div className="flex items-center gap-1 sm:gap-2 relative">
          {/* Seri ve hedef: tek bir sayı şeridi */}
          <button
            type="button"
            onClick={openEditor}
            title="Hedefi ve seriyi düzenle"
            className="group flex items-stretch divide-x divide-[var(--hairline)] border border-[var(--hairline)] rounded-[10px] overflow-hidden hover:border-[var(--hairline-2)] transition-colors cursor-pointer"
          >
            <span className="flex flex-col items-start px-3 py-1.5 leading-tight">
              <span className="timecode text-[var(--ink)] font-medium">
                {progress.studyStreakDays}
              </span>
              <span className="text-[9px] uppercase tracking-[0.12em] text-[var(--ink-3)]">
                gün seri
              </span>
            </span>

            <span className="flex flex-col items-start px-3 py-1.5 leading-tight">
              <span className="timecode text-[var(--ink)] font-medium">
                {progress.completedVideoCount}<span className="text-[var(--ink-3)]">/{progress.goalVideoCount}</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.12em] text-[var(--ink-3)]">
                video
              </span>
            </span>

            {/* İlerleme: ince dikey şerit */}
            <span className="hidden sm:flex items-center px-2.5">
              <span className="w-14 h-[3px] bg-[var(--hairline)] rounded-full overflow-hidden">
                <span
                  className="block h-full bg-[var(--ink)] transition-all duration-500"
                  style={{ width: `${goalPercentage}%` }}
                />
              </span>
            </span>
          </button>

          {/* Hedef ve seri duzenleyici.
              Bu panel eksikti: openEditor isEditing'i true yapiyordu ama
              hicbir yerde okunmadigi icin rozete tiklamak gorunurde hicbir
              sey yapmiyor, hedef de hep varsayilan degerde kaliyordu. */}
          {isEditing && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsEditing(false)}
                aria-hidden="true"
              />
              <div
                role="dialog"
                aria-label="Hedefi ve seriyi duzenle"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsEditing(false);
                  if (e.key === 'Enter') saveEdits();
                }}
                className="absolute top-full right-0 mt-2 z-50 w-64 p-3.5 rounded-[10px] border border-[var(--hairline-2)] bg-[var(--paper-2)] shadow-lg space-y-3"
              >
                <div className="flex items-center gap-1.5 text-[var(--ink-2)]">
                  <Settings2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em]">
                    Hedef ve seri
                  </span>
                </div>

                <label className="block space-y-1">
                  <span className="text-[11px] text-[var(--ink-2)]">Video hedefi</span>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={goalDraft}
                    autoFocus
                    onChange={(e) => setGoalDraft(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-[8px] border border-[var(--hairline)] bg-[var(--paper)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--ink-3)]"
                  />
                </label>

                <label className="block space-y-1">
                  <span className="text-[11px] text-[var(--ink-2)]">Gun serisi</span>
                  <input
                    type="number"
                    min={0}
                    max={9999}
                    value={streakDraft}
                    onChange={(e) => setStreakDraft(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-[8px] border border-[var(--hairline)] bg-[var(--paper)] text-[var(--ink)] text-sm focus:outline-none focus:border-[var(--ink-3)]"
                  />
                </label>

                <p className="text-[10px] leading-relaxed text-[var(--ink-3)]">
                  Tamamlanan video sayisi derslerin durumundan turetilir, elle
                  degistirilmez.
                </p>

                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={saveEdits}
                    className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-[8px] bg-[var(--ink)] text-[var(--paper-2)] text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>Kaydet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex items-center justify-center gap-1.5 h-8 px-3 rounded-[8px] border border-[var(--hairline)] text-[var(--ink-2)] text-xs font-medium hover:border-[var(--hairline-2)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5 shrink-0" />
                    <span>Iptal</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            onClick={onOpenGrammarCoach}
            title="Gramer koçuna sor"
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-[10px] bg-[var(--ink)] text-[var(--paper-2)] text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline">Gramer Koçu</span>
          </button>

          <button
            onClick={onOpenGuide}
            title="Yöntem rehberi"
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-[10px] border border-[var(--hairline)] text-[var(--ink-2)] text-xs font-medium hover:border-[var(--hairline-2)] hover:text-[var(--ink)] transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Metot</span>
          </button>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              title="Ayarlar — API anahtarları ve senkron"
              className="flex items-center justify-center h-9 w-9 rounded-[10px] border border-[var(--hairline)] text-[var(--ink-2)] hover:border-[var(--hairline-2)] hover:text-[var(--ink)] transition-colors cursor-pointer shrink-0"
            >
              <KeyRound className="w-3.5 h-3.5 shrink-0" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
