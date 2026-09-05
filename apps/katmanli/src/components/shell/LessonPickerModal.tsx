/**
 * DERS SEÇİCİ PENCERESİ
 *
 * Ders listesi ve "yeni video ekle" formu eskiden sayfanın en üstünde
 * SÜREKLİ duruyordu ve iki ders kartı ekranın üçte birini kaplıyordu.
 * Oysa ders seçmek nadir bir iş: bir kere seçilir, saatlerce çalışılır.
 * Kalıcı bir panel yerine, üst çubuktaki ders hapına tıklayınca açılan
 * bir pencere.
 *
 * Listenin KENDİSİ yeniden yazılmadı — LessonSelector çalışan ve
 * denenmiş bir bileşen (içe aktarma, altyazı çekme, hata durumları).
 * Burada yalnızca sarmalanıyor; böylece davranış birebir korunuyor.
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { VideoLesson } from '../../types';
import { LessonSelector } from '../LessonSelector';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lessons: VideoLesson[];
  activeLesson: VideoLesson | null;
  onSelectLesson: (lesson: VideoLesson) => void;
  onImportCustomLesson: (
    input: string,
    youtubeUrl?: string,
    onProgress?: (message: string) => void
  ) => Promise<void>;
  onDeleteLesson: (lessonId: string) => void;
  onEditLesson: (lesson: VideoLesson) => void;
  onRestorePresetLessons: () => void;
}

export const LessonPickerModal: React.FC<Props> = ({
  isOpen, onClose, lessons, activeLesson, onSelectLesson,
  onImportCustomLesson, onDeleteLesson, onEditLesson, onRestorePresetLessons,
}) => {
  // Esc ile kapanma ve arkadaki sayfanın kaymaması.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto
        bg-ink/40 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Ders seçimi"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-4xl overflow-hidden rounded-2xl border border-hairline
          bg-paper-2 shadow-ink/10"
      >
        <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold tracking-tight text-ink">
              Çalışma İçeriği
            </h2>
            <p className="mt-0.5 truncate text-[12px] text-ink-3">
              Bir ders seç ya da yeni bir YouTube videosu / metin ekle
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="shrink-0 rounded-lg p-1.5 text-ink-3 transition-colors
              hover:bg-paper-3 hover:text-ink cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5">
          <LessonSelector
            lessons={lessons}
            activeLesson={activeLesson}
            // Ders seçilince pencere kapanır: kullanıcı seçtiği dersle
            // çalışmaya başlamak istiyor, listeye bakmaya değil.
            onSelectLesson={(lesson) => { onSelectLesson(lesson); onClose(); }}
            onImportCustomLesson={onImportCustomLesson}
            onDeleteLesson={onDeleteLesson}
            onEditLesson={(lesson) => { onEditLesson(lesson); onClose(); }}
            onRestorePresetLessons={onRestorePresetLessons}
          />
        </div>
      </div>
    </div>
  );
};
