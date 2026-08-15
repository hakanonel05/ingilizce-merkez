import React, { useMemo, useState } from 'react';
import { MistakeEntry, VideoLesson } from '../types';
import { ListX, Trash2, Eye, X, CheckCircle2, XCircle } from 'lucide-react';

interface MistakesNotebookProps {
  mistakes: MistakeEntry[];
  lessons: VideoLesson[];
  onRemoveMistake: (id: string) => void;
  onClearMistakes: () => void;
  onSelectLesson: (lessonId: string) => void;
}

export const MistakesNotebook: React.FC<MistakesNotebookProps> = ({
  mistakes,
  lessons,
  onRemoveMistake,
  onClearMistakes,
  onSelectLesson,
}) => {
  const [lessonFilter, setLessonFilter] = useState<string>('all');

  const filteredMistakes = useMemo(() => {
    if (lessonFilter === 'all') return mistakes;
    return mistakes.filter((m) => m.lessonId === lessonFilter);
  }, [mistakes, lessonFilter]);

  const lessonIdsWithMistakes = useMemo(
    () => Array.from(new Set(mistakes.map((m) => m.lessonId))),
    [mistakes]
  );

  return (
    <div className="space-y-6">
      {/* Header / Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center space-x-1">
              <ListX className="w-4 h-4 text-indigo-600" />
              <span>Yanlışlar Defteri</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Anlama Testlerinde Yanlış Cevapladığınız Sorular ({mistakes.length})
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              4. katmandaki anlama testlerinde yanlış işaretlediğiniz her soru otomatik olarak
              burada listelenir. Tekrar gözden geçirerek eksiklerinizi kapatabilirsiniz.
            </p>
          </div>

          {mistakes.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Yanlışlar defterindeki tüm kayıtlar silinecek. Devam edilsin mi?')) {
                  onClearMistakes();
                }
              }}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg transition cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Defteri Temizle</span>
            </button>
          )}
        </div>

        {lessonIdsWithMistakes.length > 1 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setLessonFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                lessonFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Tüm Dersler
            </button>
            {lessonIdsWithMistakes.map((lessonId) => {
              const lesson = lessons.find((l) => l.id === lessonId);
              return (
                <button
                  key={lessonId}
                  onClick={() => setLessonFilter(lessonId)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    lessonFilter === lessonId
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lesson?.title || 'Silinmiş Ders'}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Mistakes List */}
      {filteredMistakes.length > 0 ? (
        <div className="space-y-4">
          {filteredMistakes.map((mistake) => {
            const lessonExists = lessons.some((l) => l.id === mistake.lessonId);
            return (
              <div
                key={mistake.id}
                className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    {lessonExists ? (
                      <button
                        onClick={() => onSelectLesson(mistake.lessonId)}
                        className="flex items-center space-x-1.5 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 hover:underline cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{mistake.lessonTitle}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400">{mistake.lessonTitle} (silinmiş ders)</span>
                    )}
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                      {mistake.question}
                    </h3>
                  </div>
                  <button
                    onClick={() => onRemoveMistake(mistake.id)}
                    title="Kaydı sil"
                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-rose-700">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Senin Cevabın</span>
                    </div>
                    <p className="text-rose-900">{mistake.userAnswer}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Doğru Cevap</span>
                    </div>
                    <p className="text-emerald-900">{mistake.correctAnswer}</p>
                  </div>
                </div>

                {mistake.explanationTr && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 block font-bold mb-0.5">Çözüm Analizi:</strong>
                    {mistake.explanationTr}
                  </div>
                )}

                <p className="text-[10px] text-slate-400">
                  {new Date(mistake.timestamp).toLocaleString('tr-TR')}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-2 shadow-sm">
          <ListX className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Yanlışlar defteri boş.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            4. katmandaki anlama testlerinde yanlış cevapladığınız çoktan seçmeli sorular
            otomatik olarak burada listelenir.
          </p>
        </div>
      )}
    </div>
  );
};
