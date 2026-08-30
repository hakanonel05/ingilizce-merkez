/**
 * HİKAYELERİM
 *
 * Üretilen hikayelerin kendi rafı. Ayrı bir sekme olması şart oldu:
 * hikayeler "Okuma Parçaları" listesinde HİÇ görünmüyordu, çünkü o
 * liste 100 parçalık sabit katalogdan (PASSAGE_CATALOG) kuruluyor.
 * Yani üretilen hikaye bir kez kapatıldığında bir daha açılamıyordu —
 * kaydedilmiş olmasına rağmen.
 *
 * Burada hikaye üreteci de var; hikayenin doğduğu ve saklandığı yer
 * aynı ekran, aralarında gezinmek gerekmiyor.
 */

import { useMemo, useState } from 'react';
import { Passage, UserProgress } from '../types';
import StoryComposer from './StoryComposer';
import {
  Sparkles, BookOpen, Trash2, CheckCircle2, Clock, HelpCircle,
  BrainCircuit, Library, AlertTriangle,
} from 'lucide-react';

interface Props {
  passages: Passage[];
  progress: UserProgress;
  onSelectPassage: (id: number) => void;
  onStoryReady: (passage: Passage) => void;
  onTasksReady: (
    passageId: number,
    questions: Passage['questions'],
    exercises: Passage['exercises']
  ) => void;
  onDeleteStory: (id: number) => void;
}

/** Bir hikaye kaç kelime içeriyor — okuma süresi tahmini için. */
function wordCount(p: Passage): number {
  return p.paragraphs.reduce((sum, para) => sum + para.trim().split(/\s+/).length, 0);
}

export default function StoryLibrary({
  passages, progress, onSelectPassage, onStoryReady, onTasksReady, onDeleteStory,
}: Props) {
  const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);

  // En yeni hikaye en üstte: kimlikler artan sırada veriliyor.
  const stories = useMemo(
    () => passages.filter(p => p && p.isGenerated).sort((a, b) => b.id - a.id),
    [passages]
  );

  return (
    <div className="space-y-8">
      <StoryComposer
        progress={progress}
        passages={passages}
        onStoryReady={onStoryReady}
        onTasksReady={onTasksReady}
      />

      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <Library className="h-4 w-4 text-editorial-accent" />
          <h2 className="font-serif text-lg font-bold text-editorial-text">
            Hikayelerim
          </h2>
          <span className="font-mono text-[11px] text-editorial-text/40">
            {stories.length} HİKAYE
          </span>
        </div>

        {stories.length === 0 ? (
          <div className="border border-dashed border-editorial-border/50 bg-white p-8 text-center">
            <BookOpen className="mx-auto h-6 w-6 text-editorial-text/20" />
            <p className="mt-3 text-xs leading-relaxed text-editorial-text/60">
              Henüz hikaye üretmedin. Yukarıdaki kutudan seviyeni seç ve
              <strong className="font-bold"> Hikayeyi Oluştur</strong>'a bas;
              ürettiğin her hikaye burada kalır.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {stories.map(story => {
              const score = progress.scores[story.id];
              const exScore = progress.exerciseScores?.[story.id];
              const isRead = progress.completedPassages.includes(story.id);
              const words = wordCount(story);
              const isConfirming = confirmingDelete === story.id;

              return (
                <article
                  key={story.id}
                  className="flex flex-col border border-editorial-border/40 bg-white transition-colors hover:border-editorial-accent/40"
                >
                  <button
                    type="button"
                    onClick={() => onSelectPassage(story.id)}
                    className="flex-1 p-4 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="border border-editorial-accent/30 bg-editorial-bg px-1.5 py-0.5 font-mono text-[10px] font-bold text-editorial-text">
                        {story.cefr}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-editorial-accent">
                        <Sparkles className="h-3 w-3" /> Sana özel
                      </span>
                      {isRead && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> Okundu
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-base font-bold leading-tight text-editorial-text break-words">
                      {story.title}
                    </h3>
                    <p className="mt-1 text-[11px] italic text-editorial-text/50 break-words">
                      {story.theme}
                    </p>

                    {/* Hikayenin hedef kelimeleri: neden bu hikayeyi
                        okuduğunu tek bakışta görmek için. */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {story.vocabulary.slice(0, 8).map(w => (
                        <span
                          key={w.term}
                          title={w.meaning}
                          className="border border-editorial-border/40 bg-editorial-bg px-1.5 py-0.5 text-[10px] font-bold text-editorial-text/80"
                        >
                          {w.term}
                        </span>
                      ))}
                      {story.vocabulary.length > 8 && (
                        <span className="px-1 py-0.5 text-[10px] text-editorial-text/40">
                          +{story.vocabulary.length - 8}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-editorial-text/45">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> ~{Math.max(1, Math.round(words / 130))} dk
                      </span>
                      <span className="flex items-center gap-1">
                        <HelpCircle className="h-3 w-3" />
                        {story.questions.length
                          ? score
                            ? `${score.score}/${score.total}`
                            : `${story.questions.length} soru`
                          : 'hazırlanıyor'}
                      </span>
                      <span className="flex items-center gap-1">
                        <BrainCircuit className="h-3 w-3" />
                        {story.exercises.length
                          ? exScore
                            ? `${exScore.score}/${exScore.total}`
                            : `${story.exercises.length} alıştırma`
                          : 'hazırlanıyor'}
                      </span>
                    </div>
                  </button>

                  {/* Silme: hikayeler birikince raf dolar, ama tek
                      tıkla silmek çalışılmış bir metni kazara yok eder. */}
                  <div className="border-t border-editorial-border/30 px-3 py-2">
                    {isConfirming ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-800">
                          <AlertTriangle className="h-3 w-3" /> Silinsin mi?
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteStory(story.id);
                            setConfirmingDelete(null);
                          }}
                          className="border border-rose-300 bg-rose-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-900 hover:bg-rose-100 cursor-pointer"
                        >
                          Sil
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingDelete(null)}
                          className="border border-editorial-border/40 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-editorial-text/60 hover:border-editorial-accent/40 cursor-pointer"
                        >
                          Vazgeç
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmingDelete(story.id)}
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-editorial-text/40 hover:text-rose-700 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" /> Hikayeyi sil
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
