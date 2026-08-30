/**
 * HEDEF VE SERİ DÜZENLEYİCİ
 *
 * Eski Header'ın içinde açılan küçük bir açılır panel olarak duruyordu.
 * Üst çubuk yeniden yazılınca buraya taşındı: mantığı aynı, yalnızca
 * kendi dosyasında ve modern kabuğun diliyle çizilmiş.
 */

import React, { useEffect, useState } from 'react';
import { Check, X, Target } from 'lucide-react';
import { UserProgress } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateProgress: (patch: Partial<UserProgress>) => void;
}

export const GoalEditorModal: React.FC<Props> = ({
  isOpen, onClose, progress, onUpdateProgress,
}) => {
  const [goalDraft, setGoalDraft] = useState(String(progress.goalVideoCount));
  const [streakDraft, setStreakDraft] = useState(String(progress.studyStreakDays));

  // Pencere her açıldığında güncel değerlerle başlar; kapatılıp
  // tekrar açıldığında eski taslak kalmaz.
  useEffect(() => {
    if (!isOpen) return;
    setGoalDraft(String(progress.goalVideoCount));
    setStreakDraft(String(progress.studyStreakDays));
  }, [isOpen, progress.goalVideoCount, progress.studyStreakDays]);

  if (!isOpen) return null;

  const save = () => {
    const goal = Math.max(1, Math.min(999, parseInt(goalDraft, 10) || 1));
    const streak = Math.max(0, Math.min(9999, parseInt(streakDraft, 10) || 0));

    // Seri elle değiştirilirse, geçmiş günler o sayıya uyacak şekilde
    // yeniden kurulur; aksi halde bir sonraki hesaplamada eski değere
    // geri dönerdi.
    const dates: string[] = [];
    for (let i = streak - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      dates.push(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      );
    }

    onUpdateProgress({ goalVideoCount: goal, studyStreakDays: streak, studyDates: dates });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Hedefi ve seriyi düzenle"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
          if (e.key === 'Enter') save();
        }}
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200
          bg-white shadow-2xl shadow-slate-900/10"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-indigo-600" />
            <h2 className="text-sm font-semibold tracking-tight text-slate-900">
              Hedef ve seri
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="rounded-lg p-1.5 text-slate-400 transition-colors
              hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <label className="block space-y-1.5">
            <span className="text-[12px] font-medium text-slate-700">Video hedefi</span>
            <input
              type="number"
              min={1}
              max={999}
              value={goalDraft}
              autoFocus
              onChange={(e) => setGoalDraft(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2
                text-sm text-slate-900 transition-colors
                focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[12px] font-medium text-slate-700">Gün serisi</span>
            <input
              type="number"
              min={0}
              max={9999}
              value={streakDraft}
              onChange={(e) => setStreakDraft(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2
                text-sm text-slate-900 transition-colors
                focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15"
            />
          </label>

          <p className="text-[11px] leading-relaxed text-slate-400">
            Tamamlanan video sayısı derslerin durumundan türetilir, elle
            değiştirilmez.
          </p>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4">
          <button
            type="button"
            onClick={save}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg
              bg-indigo-600 text-[13px] font-medium text-white shadow-sm
              transition-all duration-200 ease-in-out hover:bg-indigo-700 cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" />
            Kaydet
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center justify-center rounded-lg border
              border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-600
              transition-colors hover:text-slate-900 cursor-pointer"
          >
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
};
