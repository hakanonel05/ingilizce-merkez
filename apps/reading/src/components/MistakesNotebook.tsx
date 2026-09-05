import { useMemo, useState } from 'react';
import { MistakeEntry, CEFRLevel } from '../types';
import { RotateCcw, CheckCircle2, XCircle, ArrowRight, Trash2, ExternalLink } from 'lucide-react';

interface MistakesNotebookProps {
  mistakes: MistakeEntry[];
  onReviewMistake: (key: string, gotItRight: boolean) => void;
  onRemoveMistake: (key: string) => void;
  onSelectPassage: (passageId: number) => void;
}

function letter(option: string) {
  return option.trim().charAt(0);
}

const SOURCE_LABEL: Record<MistakeEntry['source'], string> = {
  quiz: 'Anlama Testi',
  exercise: 'Kelime Alıştırması',
  exam: 'Sınav Simülasyonu'
};

export default function MistakesNotebook({ mistakes, onReviewMistake, onRemoveMistake, onSelectPassage }: MistakesNotebookProps) {
  const [cefrFilter, setCefrFilter] = useState<CEFRLevel | 'ALL'>('ALL');
  const [mode, setMode] = useState<'list' | 'practice'>('list');
  const [queue, setQueue] = useState<MistakeEntry[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [practiceSelected, setPracticeSelected] = useState<string | null>(null);
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [sessionDone, setSessionDone] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);

  const filtered = useMemo(() => {
    if (cefrFilter === 'ALL') return mistakes;
    return mistakes.filter(m => m.cefr === cefrFilter);
  }, [mistakes, cefrFilter]);

  const grouped = useMemo(() => {
    const byPassage: Record<number, { title: string; cefr: CEFRLevel; items: MistakeEntry[] }> = {};
    filtered.forEach(m => {
      if (!byPassage[m.passageId]) {
        byPassage[m.passageId] = { title: m.passageTitle, cefr: m.cefr, items: [] };
      }
      byPassage[m.passageId].items.push(m);
    });
    return Object.entries(byPassage)
      .map(([id, v]) => ({ passageId: Number(id), ...v }))
      .sort((a, b) => b.items.length - a.items.length);
  }, [filtered]);

  const startPractice = () => {
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setQueueIndex(0);
    setPracticeSelected(null);
    setPracticeChecked(false);
    setSessionDone(0);
    setSessionCorrect(0);
    setMode('practice');
  };

  const currentItem = queue[queueIndex];

  const checkAnswer = () => {
    if (!practiceSelected || !currentItem) return;
    setPracticeChecked(true);
    const gotItRight = practiceSelected === currentItem.correctAnswer;
    if (gotItRight) setSessionCorrect(c => c + 1);
    setSessionDone(d => d + 1);
    onReviewMistake(currentItem.key, gotItRight);
  };

  const nextItem = () => {
    setPracticeSelected(null);
    setPracticeChecked(false);
    if (queueIndex + 1 >= queue.length) {
      setMode('list');
    } else {
      setQueueIndex(i => i + 1);
    }
  };

  if (mistakes.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-[22px] font-semibold tracking-tight text-brand">Yanlışlar Defteri</h1>
        <div className="rounded-2xl border border-hairline p-10 text-center">
          <p className="text-[14px] font-medium text-ink">Hiç yanlışın yok.</p>
          <p className="mx-auto mt-1 max-w-[52ch] text-[13px] leading-relaxed text-ink-2">
            Anlama testleri, kelime alıştırmaları ve sınav simülasyonundaki
            yanlışların otomatik olarak burada birikir.
          </p>
        </div>
      </div>
    );
  }

  if (mode === 'practice' && currentItem) {
    const isCorrect = practiceSelected === currentItem.correctAnswer;
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-baseline justify-between gap-3 border-b border-hairline pb-4">
          <h1 className="text-[22px] font-semibold tracking-tight text-brand">
            Pratik{' '}
            <span className="timecode text-[16px] font-normal text-ink-3">
              {queueIndex + 1}/{queue.length}
            </span>
          </h1>
          <button
            type="button"
            onClick={() => setMode('list')}
            className="text-[13px] text-ink-3 transition-colors hover:text-ink cursor-pointer"
          >
            Bitir
          </button>
        </div>

        <div className="space-y-5 rounded-2xl border border-hairline bg-paper-2 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink-3">
            <span>{currentItem.passageTitle}</span>
            <span>·</span>
            <span>{SOURCE_LABEL[currentItem.source]}</span>
            <span>·</span>
            <span>{currentItem.cefr}</span>
          </div>
          <p className="text-[15px] font-medium leading-relaxed text-ink">{currentItem.question}</p>

          <div className="space-y-2">
            {currentItem.options.map(option => {
              const optLetter = letter(option);
              const isSelected = practiceSelected === optLetter;
              const isRight = optLetter === currentItem.correctAnswer;
              let cls = 'border-hairline text-ink hover:bg-paper-3';
              if (practiceChecked) {
                if (isRight) cls = 'border-emerald-500 bg-emerald-50 text-emerald-900';
                else if (isSelected) cls = 'border-rose-400 bg-rose-50 text-rose-900';
                else cls = 'border-hairline text-ink-3';
              } else if (isSelected) {
                cls = 'border-accent bg-accent-soft text-ink';
              }
              return (
                <button
                  key={option}
                  disabled={practiceChecked}
                  onClick={() => setPracticeSelected(optLetter)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3
                    text-left text-[13px] transition-colors duration-150
                    disabled:cursor-default cursor-pointer ${cls}`}
                >
                  <span>{option}</span>
                  {practiceChecked && isRight && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />}
                  {practiceChecked && isSelected && !isRight && <XCircle className="h-4 w-4 text-rose-500 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between">
            {!practiceChecked ? (
              <button
                onClick={checkAnswer}
                disabled={!practiceSelected}
                className="ml-auto rounded-xl bg-accent px-5 py-2.5 text-[13px] font-medium text-white
                  transition-colors duration-150 hover:bg-accent-700
                  disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                Kontrol et
              </button>
            ) : (
              <>
                <span className={`text-[13px] ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {isCorrect ? 'Doğru — defterden çıkarıldı.' : 'Yanlış — tekrar karşına çıkacak.'}
                </span>
                <button
                  onClick={nextItem}
                  className="flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2.5 text-[13px]
                    font-medium text-white transition-colors hover:bg-accent-700 cursor-pointer"
                >
                  {queueIndex + 1 >= queue.length ? 'Bitir' : 'Sıradaki'} <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-[12px] text-ink-3">
          Bu oturumda <span className="timecode text-ink">{sessionCorrect}/{sessionDone}</span> doğru
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-[22px] font-semibold tracking-tight text-brand">Yanlışlar Defteri</h1>
        <span className="text-[12px] text-ink-3">
          <span className="timecode text-ink">{mistakes.length}</span> soru birikti
        </span>
      </div>

      <p className="max-w-[62ch] text-[13px] leading-relaxed text-ink-2">
        Anlama testleri, kelime alıştırmaları ve sınav simülasyonundaki
        yanlışların otomatik olarak burada toplanır.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-fit flex-wrap gap-0.5 rounded-xl bg-paper-3 p-1">
        {(['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'] as const).map(lvl => (
          <button
            key={lvl}
            onClick={() => setCefrFilter(lvl)}
            className={`rounded-lg px-3 py-1.5 text-[12px] transition-colors duration-150 cursor-pointer ${
              cefrFilter === lvl
                ? 'bg-paper-2 font-medium text-ink'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            {lvl === 'ALL' ? 'Tümü' : lvl}
          </button>
        ))}
        </div>

        <button
          type="button"
          onClick={startPractice}
          disabled={filtered.length === 0}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-accent px-4 py-2 text-[13px]
            font-medium text-white transition-colors duration-150 hover:bg-accent-700
            disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" /> Pratik yap ({filtered.length})
        </button>
      </div>

      <div className="space-y-4">
        {grouped.map(group => (
          <div key={group.passageId} className="overflow-hidden rounded-2xl border border-hairline bg-paper-2">
            <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
              <div className="flex min-w-0 items-baseline gap-2">
                <span className="shrink-0 rounded bg-paper-3 px-1.5 py-0.5 text-[11px] text-ink-2">
                  {group.cefr}
                </span>
                <p className="truncate text-[14px] font-medium text-ink">{group.title}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-[12px] text-ink-3">
                  <span className="timecode text-ink-2">{group.items.length}</span> yanlış
                </span>
                <button
                  type="button"
                  onClick={() => onSelectPassage(group.passageId)}
                  className="flex items-center gap-1 text-[12px] text-ink-3
                    transition-colors hover:text-brand cursor-pointer"
                >
                  Parçaya git <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="divide-y divide-hairline">
              {group.items.map(item => (
                <div key={item.key} className="group flex items-start justify-between gap-4 px-5 py-3
                  transition-colors hover:bg-paper-3">
                  <div className="min-w-0">
                    <p className="text-[13px] leading-snug text-ink">{item.question}</p>
                    <p className="mt-1 text-[12px] text-ink-3">
                      {SOURCE_LABEL[item.source]} · Doğru cevap: {item.correctAnswer} · Senin cevabın: {item.yourAnswer || '—'}
                      {item.reviewCount > 0 && ` · ${item.reviewCount}x tekrar edildi`}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveMistake(item.key)}
                    title="Artık biliyorum, listeden çıkar"
                    className="row-actions shrink-0 rounded-lg p-1.5 text-ink-3 opacity-0
                      transition-all hover:bg-paper-2 hover:text-rose-600
                      focus:opacity-100 group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
