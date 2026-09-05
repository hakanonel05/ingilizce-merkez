import { useMemo, useState } from 'react';
import { WORKBOOK_TABLES, WorkbookTable, WorkbookExercise } from '../data/vocabularyWorkbook';
import { ListChecks, CheckCircle2, XCircle, RotateCcw, Grid3x3 } from 'lucide-react';

// Answers keyed by "exIdx-qIdx" -> string (single) or string[] (multi)
type AnswerMap = Record<string, string | string[]>;

function letter(i: number) {
  return String.fromCharCode(65 + i);
}

interface Props {
  workbookState: Record<string, { answers: Record<string, string | string[]>; checked: Record<number, boolean> }>;
  onWorkbookStateChange: (tableId: string, state: { answers: Record<string, string | string[]>; checked: Record<number, boolean> }) => void;
}

export default function VocabularyWorkbook({ workbookState, onWorkbookStateChange }: Props) {
  const adjectiveTables = useMemo(() => WORKBOOK_TABLES.filter(t => t.category === 'adjectives'), []);
  const verbTables = useMemo(() => WORKBOOK_TABLES.filter(t => t.category === 'verbs'), []);

  const [activeId, setActiveId] = useState<string>(WORKBOOK_TABLES[0]?.id ?? '');
  const table: WorkbookTable | undefined = WORKBOOK_TABLES.find(t => t.id === activeId);

  const tableState = workbookState[activeId] || { answers: {}, checked: {} };
  const answers = tableState.answers || {};
  const checked = tableState.checked || {};

  const resetTable = () => {
    // Only reset the current table's progress
    onWorkbookStateChange(activeId, { answers: {}, checked: {} });
  };

  const selectSingle = (exIdx: number, qIdx: number, opt: string) => {
    if (checked[exIdx]) return;
    onWorkbookStateChange(activeId, {
      ...tableState,
      answers: { ...answers, [`${exIdx}-${qIdx}`]: opt }
    });
  };

  const toggleMulti = (exIdx: number, qIdx: number, opt: string) => {
    if (checked[exIdx]) return;
    const key = `${exIdx}-${qIdx}`;
    const cur = Array.isArray(answers[key]) ? (answers[key] as string[]) : [];
    const next = cur.includes(opt) ? cur.filter(o => o !== opt) : [...cur, opt];
    onWorkbookStateChange(activeId, {
      ...tableState,
      answers: { ...answers, [key]: next }
    });
  };

  const setCheckedLocal = (exIdx: number, isChecked: boolean) => {
    onWorkbookStateChange(activeId, {
      ...tableState,
      checked: { ...checked, [exIdx]: isChecked }
    });
  };

  const scoreExercise = (ex: WorkbookExercise, exIdx: number) => {
    let correct = 0;
    ex.questions.forEach((q, qIdx) => {
      const given = answers[`${exIdx}-${qIdx}`];
      if (ex.multi) {
        const g = Array.isArray(given) ? [...given].sort() : [];
        const a = [...q.answers].sort();
        if (g.length === a.length && g.every((x, i) => x === a[i])) correct++;
      } else {
        if (given && q.answers.includes(given as string)) correct++;
      }
    });
    return correct;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-brand">Kelime Kitabı</h1>
        <p className="mt-2 max-w-[68ch] text-[13px] leading-relaxed text-ink-2">
          Kitabın başındaki gibi: anlamına göre gruplanmış eş anlamlı kelime tabloları ve her tablonun yanında
          Collocation, Synonyms ve Sentence testleri. Bir tablo seçin, kelimeleri çalışın, sonra testleri çözün.
        </p>
      </div>

      {/* Table selector */}
      <div className="space-y-3">
        <div>
          <span className="eyebrow">Temel sıfatlar</span>
          <div className="mt-2 flex w-fit flex-wrap gap-0.5 rounded-xl bg-paper-3 p-1">
            {adjectiveTables.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`rounded-lg px-3 py-1.5 text-[12px] transition-colors duration-150 cursor-pointer ${
                  activeId === t.id
                    ? 'bg-paper-2 font-medium text-ink'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                <span className="timecode">{t.tableNo}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="eyebrow">Temel fiiller</span>
          <div className="mt-2 flex w-fit flex-wrap gap-0.5 rounded-xl bg-paper-3 p-1">
            {verbTables.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`rounded-lg px-3 py-1.5 text-[12px] transition-colors duration-150 cursor-pointer ${
                  activeId === t.id
                    ? 'bg-paper-2 font-medium text-ink'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                <span className="timecode">{t.tableNo}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {table && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT: Word table (PDF-like) */}
          <div className="bg-paper-2 border border-hairline rounded-lg">
            <div className="bg-ink text-white px-4 py-3 flex items-center gap-2 rounded-lg">
              <Grid3x3 className="h-4 w-4 opacity-70" />
              <span className="font-display font-semibold text-sm tracking-wide">
                {table.category === 'adjectives' ? 'TEMEL SIFAT LİSTESİ' : 'TEMEL FİİL LİSTESİ'} · TABLO {table.tableNo}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {table.groups.map((g, gi) => (
                <div key={gi} className="border-b border-r border-hairline p-3">
                  <p className="text-[11px] font-semibold tracking-wide text-brand mb-1.5">
                    {gi + 1}. {g.theme}
                  </p>
                  <ol className="space-y-0.5">
                    {g.words.map((w, wi) => (
                      <li key={wi} className="text-sm text-ink flex gap-1.5">
                        <span className="text-ink-3 text-xs w-3 shrink-0">{wi + 1}.</span>
                        <span className="font-medium">{w}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Exercises */}
          <div className="space-y-6">
            {table.exercises.map((ex, exIdx) => {
              const isChecked = !!checked[exIdx];
              return (
                <div key={exIdx} className="bg-paper-2 border border-hairline rounded-lg">
                  <div className="px-4 py-3 border-b border-hairline flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-brand" />
                    <div>
                      <p className="font-display font-semibold text-sm text-ink">{ex.title}</p>
                      <p className="text-[11px] text-ink-3 mt-0.5">{ex.instruction}</p>
                    </div>
                  </div>

                  <div className="divide-y divide-hairline">
                    {ex.questions.map((q, qIdx) => {
                      const key = `${exIdx}-${qIdx}`;
                      const given = answers[key];
                      return (
                        <div key={qIdx} className="px-4 py-3">
                          <p className="text-sm text-ink mb-2">
                            <span className="text-ink-3 mr-1.5">{qIdx + 1}.</span>
                            {ex.type === 'synonyms' ? (
                              <span>
                                <span className="font-semibold">"{q.prompt}"</span> ile eş anlamlı olan(lar):
                              </span>
                            ) : (
                              <span>{q.prompt}</span>
                            )}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {q.options.map((opt, oi) => {
                              const selected = ex.multi
                                ? Array.isArray(given) && given.includes(opt)
                                : given === opt;
                              const isCorrect = q.answers.includes(opt);
                              let cls = 'bg-paper border-hairline text-ink/80 hover:border-accent/50';
                              if (isChecked) {
                                if (isCorrect) cls = 'border-emerald-500 bg-emerald-50 text-emerald-900';
                                else if (selected) cls = 'border-rose-400 bg-rose-50 text-rose-900';
                                else cls = 'bg-paper border-hairline text-ink-3';
                              } else if (selected) {
                                cls = 'bg-accent text-white border-accent';
                              }
                              return (
                                <button
                                  key={oi}
                                  onClick={() => ex.multi ? toggleMulti(exIdx, qIdx, opt) : selectSingle(exIdx, qIdx, opt)}
                                  disabled={isChecked}
                                  className={`px-3 py-1.5 text-xs font-medium border transition-all rounded-lg ${cls}`}
                                >
                                  <span className="opacity-50 mr-1">{letter(oi)})</span>{opt}
                                  {isChecked && isCorrect && <CheckCircle2 className="inline h-3.5 w-3.5 ml-1" />}
                                  {isChecked && selected && !isCorrect && <XCircle className="inline h-3.5 w-3.5 ml-1" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="px-4 py-3 border-t border-hairline flex items-center justify-between">
                    {isChecked ? (
                      <>
                        <span className="text-sm font-semibold text-ink">
                          Sonuç: {scoreExercise(ex, exIdx)} / {ex.questions.length} doğru
                        </span>
                        <button
                          onClick={() => setCheckedLocal(exIdx, false)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Tekrar Dene
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setCheckedLocal(exIdx, true)}
                        className="ml-auto px-4 py-1.5 text-xs font-semibold bg-accent text-white border border-accent hover:opacity-90 rounded-lg"
                      >
                        Kontrol Et
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
