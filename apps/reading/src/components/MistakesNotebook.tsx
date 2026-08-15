import { useMemo, useState } from 'react';
import { MistakeEntry, CEFRLevel } from '../types';
import { BookX, RotateCcw, CheckCircle2, XCircle, ArrowRight, Trash2, ExternalLink, PartyPopper } from 'lucide-react';

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
        <div className="border-b border-editorial-border/40 pb-6">
          <div className="flex items-center gap-2 text-editorial-accent mb-2">
            <BookX className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Yanlışlar Defteri</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-editorial-text">Yanlışlar Defteri</h2>
        </div>
        <div className="bg-white border border-editorial-border/40 p-12 text-center space-y-3">
          <PartyPopper className="h-10 w-10 text-editorial-accent mx-auto" />
          <p className="font-serif text-xl font-bold text-editorial-text">Harika! Hiç yanlışın yok.</p>
          <p className="text-sm text-editorial-text/60 max-w-md mx-auto">
            Anlama testlerinde veya kelime alıştırmalarında yanlış yaptığın sorular otomatik olarak burada birikir.
            Şimdilik temiz — okumaya devam et!
          </p>
        </div>
      </div>
    );
  }

  if (mode === 'practice' && currentItem) {
    const isCorrect = practiceSelected === currentItem.correctAnswer;
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between border-b border-editorial-border/40 pb-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-editorial-accent mb-1">Pratik Modu</p>
            <h2 className="font-serif text-2xl font-bold text-editorial-text">
              {queueIndex + 1} / {queue.length}
            </h2>
          </div>
          <button
            onClick={() => setMode('list')}
            className="text-xs font-bold text-editorial-text/50 hover:text-editorial-text"
          >
            Bitir
          </button>
        </div>

        <div className="bg-white border border-editorial-border/40 p-6 space-y-5">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-editorial-text/40">
            <span>{currentItem.passageTitle}</span>
            <span>·</span>
            <span>{SOURCE_LABEL[currentItem.source]}</span>
            <span>·</span>
            <span>{currentItem.cefr}</span>
          </div>
          <p className="font-serif text-lg font-bold text-editorial-text leading-relaxed">{currentItem.question}</p>

          <div className="grid grid-cols-1 gap-2.5">
            {currentItem.options.map(option => {
              const optLetter = letter(option);
              const isSelected = practiceSelected === optLetter;
              const isRight = optLetter === currentItem.correctAnswer;
              let cls = 'bg-editorial-bg border-editorial-border/40 text-editorial-text hover:border-editorial-accent/40';
              if (practiceChecked) {
                if (isRight) cls = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                else if (isSelected) cls = 'bg-rose-50 border-rose-500 text-rose-950';
                else cls = 'bg-white border-editorial-border/20 text-editorial-text/30 opacity-60';
              } else if (isSelected) {
                cls = 'bg-editorial-accent text-white border-editorial-accent font-bold';
              }
              return (
                <button
                  key={option}
                  disabled={practiceChecked}
                  onClick={() => setPracticeSelected(optLetter)}
                  className={`w-full text-left p-3.5 border text-sm font-sans flex justify-between items-center transition-all ${cls}`}
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
                className="ml-auto px-5 py-2 text-xs font-bold bg-editorial-accent text-white border border-editorial-accent hover:opacity-90 disabled:opacity-40"
              >
                Kontrol Et
              </button>
            ) : (
              <>
                <span className={`text-sm font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {isCorrect ? 'Doğru! Defterden çıkarıldı.' : 'Yanlış — tekrar karşına çıkacak.'}
                </span>
                <button
                  onClick={nextItem}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-editorial-text text-white hover:opacity-90"
                >
                  {queueIndex + 1 >= queue.length ? 'Bitir' : 'Sıradaki'} <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-editorial-text/40">
          Bu oturumda: {sessionCorrect} / {sessionDone} doğru
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-editorial-border/40 pb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-editorial-accent mb-2">
            <BookX className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Yanlışlar Defteri</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-editorial-text">
            {mistakes.length} yanlış soru birikti
          </h2>
          <p className="text-editorial-text/60 mt-2 text-sm">
            Anlama testleri, kelime alıştırmaları ve sınav simülasyonundaki yanlışların otomatik olarak burada toplanır.
          </p>
        </div>
        <button
          onClick={startPractice}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-editorial-accent text-white hover:opacity-90 disabled:opacity-40 shrink-0"
        >
          <RotateCcw className="h-4 w-4" /> Pratik Yap ({filtered.length})
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'] as const).map(lvl => (
          <button
            key={lvl}
            onClick={() => setCefrFilter(lvl)}
            className={`px-3.5 py-1.5 text-xs font-bold border transition-all ${
              cefrFilter === lvl
                ? 'bg-editorial-text text-white border-editorial-text'
                : 'bg-white text-editorial-text/70 border-editorial-border/50 hover:border-editorial-accent/50'
            }`}
          >
            {lvl === 'ALL' ? 'Tümü' : lvl}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {grouped.map(group => (
          <div key={group.passageId} className="bg-white border border-editorial-border/40">
            <div className="px-5 py-3 border-b border-editorial-border/30 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-editorial-bg border border-editorial-border/40 shrink-0">
                  {group.cefr}
                </span>
                <p className="font-serif font-bold text-sm text-editorial-text truncate">{group.title}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-editorial-text/50">{group.items.length} yanlış</span>
                <button
                  onClick={() => onSelectPassage(group.passageId)}
                  className="flex items-center gap-1 text-xs font-bold text-editorial-accent hover:underline"
                >
                  Parçaya Git <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="divide-y divide-editorial-border/20">
              {group.items.map(item => (
                <div key={item.key} className="px-5 py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-editorial-text leading-snug">{item.question}</p>
                    <p className="text-xs text-editorial-text/40 mt-1">
                      {SOURCE_LABEL[item.source]} · Doğru cevap: {item.correctAnswer} · Senin cevabın: {item.yourAnswer || '—'}
                      {item.reviewCount > 0 && ` · ${item.reviewCount}x tekrar edildi`}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveMistake(item.key)}
                    title="Artık biliyorum, listeden çıkar"
                    className="shrink-0 p-1.5 text-editorial-text/30 hover:text-rose-600 transition-colors"
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
