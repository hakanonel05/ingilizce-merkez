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
import { CheckCircle2, Trash2 } from 'lucide-react';

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

      {/* IZGARA DEGIL LISTE. Hikayeler iki sutunlu kartlardaydi ve her
          kart bes rozete kadar tasiyabiliyordu (seviye, "Sana ozel",
          hangi model yazdi, "Okundu"), altinda sekiz kelime cipi, sonra
          uc olcu ve bir silme satiri. Yedi kati bir kutu. Baslik zaten
          ayirt edici olan sey; gerisi tek bir kunye satirina sigiyor. */}
      <div>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-[15px] font-semibold text-ink">Hikayelerim</h2>
          <span className="text-[12px] text-ink-3">
            <span className="timecode text-ink">{stories.length}</span> hikaye
          </span>
        </div>

        {stories.length === 0 ? (
          <div className="rounded-2xl border border-hairline p-10 text-center">
            <p className="mx-auto max-w-[52ch] text-[13px] leading-relaxed text-ink-2">
              Henüz hikaye üretmedin. Yukarıdaki kutudan seviyeni seç ve
              hikayeyi oluştur; ürettiğin her hikaye burada kalır.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-hairline border-y border-hairline">
            {stories.map(story => {
              const score = progress.scores[story.id];
              const exScore = progress.exerciseScores?.[story.id];
              const isRead = progress.completedPassages.includes(story.id);
              const words = wordCount(story);
              const isConfirming = confirmingDelete === story.id;

              return (
                <li key={story.id} className="group">
                  <div className="flex items-start gap-3 px-3 py-3.5 transition-colors hover:bg-paper-3">
                    <button
                      type="button"
                      onClick={() => onSelectPassage(story.id)}
                      className="min-w-0 flex-1 text-left cursor-pointer"
                    >
                      <div className="flex items-baseline gap-2">
                        <h3 className="min-w-0 flex-1 truncate text-[14px] font-medium text-ink">
                          {story.title}
                        </h3>
                        {isRead && (
                          <span className="flex shrink-0 items-center gap-1 text-[11px] text-ok">
                            <CheckCircle2 className="h-3.5 w-3.5" /> okundu
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 line-clamp-1 text-[12px] text-ink-3">{story.theme}</p>

                      {/* Tek kunye satiri. Rozetler yerine ayracli metin. */}
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[11px] text-ink-3">
                        <span className="rounded bg-paper-3 px-1.5 py-0.5 text-ink-2 group-hover:bg-paper-2">
                          {story.cefr}
                        </span>
                        <span className="timecode">~{Math.max(1, Math.round(words / 130))} dk</span>
                        <span>·</span>
                        <span className="timecode">
                          {story.questions.length
                            ? score ? `${score.score}/${score.total} soru` : `${story.questions.length} soru`
                            : 'sorular hazırlanıyor'}
                        </span>
                        <span>·</span>
                        <span className="timecode">
                          {story.exercises.length
                            ? exScore ? `${exScore.score}/${exScore.total} alıştırma` : `${story.exercises.length} alıştırma`
                            : 'alıştırmalar hazırlanıyor'}
                        </span>
                        {story.generatedBy && (
                          <>
                            <span>·</span>
                            <span>{story.generatedBy}</span>
                          </>
                        )}
                      </p>

                      {/* Hedef kelimeler: neden bu hikayeyi okudugun. */}
                      <p className="mt-1.5 line-clamp-1 text-[11px] text-ink-3">
                        {story.vocabulary.slice(0, 8).map(w => w.term).join(' · ')}
                        {story.vocabulary.length > 8 && ` +${story.vocabulary.length - 8}`}
                      </p>
                    </button>

                    {/* Silme: cift adim, cunku calisilmis bir metni kazara
                        yok etmek geri alinamiyor. */}
                    <div className="shrink-0">
                      {isConfirming ? (
                        <span className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-ink-2">Silinsin mi?</span>
                          <button
                            type="button"
                            onClick={() => { onDeleteStory(story.id); setConfirmingDelete(null); }}
                            className="rounded-lg bg-danger px-2 py-1 font-medium text-white
                              transition-colors hover:bg-danger-strong cursor-pointer"
                          >
                            Evet
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmingDelete(null)}
                            className="rounded-lg px-2 py-1 text-ink-2 transition-colors
                              hover:bg-hairline hover:text-ink cursor-pointer"
                          >
                            İptal
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmingDelete(story.id)}
                          title="Hikayeyi sil"
                          aria-label="Hikayeyi sil"
                          className="row-actions rounded-lg p-1.5 text-ink-3 opacity-0
                            transition-all hover:bg-paper-2 hover:text-danger
                            focus:opacity-100 group-hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
