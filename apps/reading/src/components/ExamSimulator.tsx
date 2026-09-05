import { useEffect, useMemo, useRef, useState } from 'react';
import { Passage, CEFRLevel, ExamAttempt, GradedQuestionResult } from '../types';
import { Timer, Play, Flag, CheckCircle2, XCircle, RotateCcw, ExternalLink } from 'lucide-react';

interface ExamSimulatorProps {
  passages: Passage[];
  onFinishExam: (attempt: ExamAttempt, perPassageResults: { passage: Passage; results: GradedQuestionResult[] }[]) => void;
  onSelectPassage: (passageId: number) => void;
}

const PASSAGE_COUNT_OPTIONS = [3, 5, 8] as const;
const MINUTES_PER_PASSAGE = 6;

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

type Phase = 'setup' | 'running' | 'results';

export default function ExamSimulator({ passages, onFinishExam, onSelectPassage }: ExamSimulatorProps) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [count, setCount] = useState<number>(5);
  const [cefr, setCefr] = useState<CEFRLevel | 'ALL'>('ALL');
  const [examPassages, setExamPassages] = useState<Passage[]>([]);
  const [answers, setAnswers] = useState<Record<number, Record<number, string>>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [totalDurationSeconds, setTotalDurationSeconds] = useState(0);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [perPassageResults, setPerPassageResults] = useState<{ passage: Passage; results: GradedQuestionResult[] }[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const eligiblePassages = useMemo(
    () => passages.filter(p => p && !p.isGenerated && p.questions && p.questions.length > 0 && (cefr === 'ALL' || p.cefr === cefr)),
    [passages, cefr]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startExam = () => {
    const shuffled = [...eligiblePassages].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    if (selected.length === 0) return;

    const duration = selected.length * MINUTES_PER_PASSAGE * 60;
    setExamPassages(selected);
    setAnswers({});
    setRemainingSeconds(duration);
    setTotalDurationSeconds(duration);
    setStartedAt(Date.now());
    setPhase('running');

    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Auto-submit when the timer hits zero
  useEffect(() => {
    if (phase === 'running' && remainingSeconds === 0 && startedAt > 0) {
      finishExam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeconds, phase]);

  const selectAnswer = (passageId: number, questionId: number, optionLetter: string) => {
    setAnswers(prev => ({
      ...prev,
      [passageId]: { ...(prev[passageId] || {}), [questionId]: optionLetter }
    }));
  };

  const finishExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    let correctCount = 0;
    let blankCount = 0;
    const perPassage: { passage: Passage; results: GradedQuestionResult[] }[] = [];

    examPassages.forEach(p => {
      const pAnswers = answers[p.id] || {};
      const results: GradedQuestionResult[] = p.questions.map(q => {
        const yourAnswer = pAnswers[q.id] || '';
        const isCorrect = yourAnswer === q.answer;
        if (!yourAnswer) blankCount++;
        if (isCorrect) correctCount++;
        return {
          questionId: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.answer,
          yourAnswer,
          isCorrect
        };
      });
      perPassage.push({ passage: p, results });
    });

    const totalQuestions = examPassages.reduce((sum, p) => sum + p.questions.length, 0);
    const timeTaken = totalDurationSeconds - remainingSeconds;

    const finishedAttempt: ExamAttempt = {
      id: `exam-${Date.now()}`,
      timestamp: new Date().toISOString(),
      passageIds: examPassages.map(p => p.id),
      durationSeconds: totalDurationSeconds,
      timeTakenSeconds: timeTaken,
      totalQuestions,
      correctCount,
      wrongCount: totalQuestions - correctCount - blankCount,
      blankCount
    };

    setAttempt(finishedAttempt);
    setPerPassageResults(perPassage);
    setPhase('results');
    onFinishExam(finishedAttempt, perPassage);
  };

  const resetToSetup = () => {
    setPhase('setup');
    setAttempt(null);
    setPerPassageResults([]);
    setExamPassages([]);
    setAnswers({});
  };

  // ---------------------------------------------------------------- SETUP
  if (phase === 'setup') {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-brand">Sınav Simülasyonu</h1>
          <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-ink-2">
            Süreli bir okuma denemesi. Bitince netin hesaplanır, yanlış ve boş
            sorular Yanlışlar Defteri'ne eklenir.
          </p>
        </div>

        <div className="space-y-5 rounded-2xl border border-hairline bg-paper-2 p-5 sm:p-6">
          <div>
            <span className="eyebrow">Kaç parça</span>
            <div className="mt-2 flex gap-2">
              {PASSAGE_COUNT_OPTIONS.map(n => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 rounded-xl border py-3 text-[13px] transition-colors duration-150 cursor-pointer ${
                    count === n
                      ? 'border-accent bg-accent-soft font-medium text-ink'
                      : 'border-hairline text-ink-2 hover:bg-paper-3'
                  }`}
                >
                  {n} parça
                  <span className="timecode mt-0.5 block text-[11px] text-ink-3">
                    ~{n * MINUTES_PER_PASSAGE} dk
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="eyebrow">Seviye</span>
            <div className="mt-2 flex w-fit flex-wrap gap-0.5 rounded-xl bg-paper-3 p-1">
              {(['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setCefr(lvl)}
                  className={`rounded-lg px-3 py-1.5 text-[12px] transition-colors duration-150 cursor-pointer ${
                    cefr === lvl
                      ? 'bg-paper-2 font-medium text-ink'
                      : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  {lvl === 'ALL' ? 'Karışık' : lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
            <p className="text-[12px] text-ink-3">
              Havuzda <span className="timecode text-ink">{eligiblePassages.length}</span> uygun parça var.
            </p>
            <button
              type="button"
              onClick={startExam}
              disabled={eligiblePassages.length === 0}
              className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[13px]
                font-medium text-white transition-colors duration-150 hover:bg-accent-700
                disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              <Play className="h-4 w-4" /> Sınavı başlat
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------- RUNNING
  if (phase === 'running') {
    const answeredCount = examPassages.reduce(
      (sum, p) => sum + Object.keys(answers[p.id] || {}).length,
      0
    );
    const totalQ = examPassages.reduce((sum, p) => sum + p.questions.length, 0);
    const isLowTime = remainingSeconds <= 60;

    return (
      <div className="space-y-6">
        <div className={`sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 border-b flex items-center justify-between gap-4 flex-wrap ${
          isLowTime ? 'border-rose-300 bg-rose-50' : 'border-hairline bg-paper-2'
        }`}>
          <div className="flex items-center gap-2">
            <Timer className={`h-4 w-4 ${isLowTime ? 'text-rose-600' : 'text-accent'}`} />
            <span className={`timecode text-[18px] font-semibold ${isLowTime ? 'text-rose-700' : 'text-ink'}`}>
              {formatTime(remainingSeconds)}
            </span>
          </div>
          <span className="text-xs text-ink-3">
            {answeredCount} / {totalQ} soru cevaplandı
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {examPassages.map((p, i) => (
              <a
                key={p.id}
                href={`#exam-passage-${p.id}`}
                className="timecode flex h-7 w-7 items-center justify-center rounded-lg bg-paper-3
                  text-ink-2 transition-colors hover:text-ink"
              >
                {i + 1}
              </a>
            ))}
          </div>
          <button
            onClick={finishExam}
            className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-[12px]
              font-medium text-white transition-colors hover:bg-accent-700 cursor-pointer"
          >
            <Flag className="h-3.5 w-3.5" /> Sınavı bitir
          </button>
        </div>

        <div className="space-y-10">
          {examPassages.map((p, pIndex) => (
            <div key={p.id} id={`exam-passage-${p.id}`} className="scroll-mt-24 overflow-hidden rounded-2xl border border-hairline bg-paper-2">
              <div className="flex items-center gap-3 border-b border-hairline px-6 py-4">
                <span className="timecode shrink-0 text-ink-3">{pIndex + 1}</span>
                <div className="min-w-0">
                  <h2 className="truncate text-[16px] font-semibold text-ink">{p.title}</h2>
                  <span className="text-[11px] text-ink-3">{p.cefr} · {p.theme}</span>
                </div>
              </div>

              <div className="passage-body space-y-4 border-b border-hairline px-6 py-5">
                {p.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="px-6 py-5 space-y-6">
                {p.questions.map((q, qIndex) => {
                  const selected = (answers[p.id] || {})[q.id];
                  return (
                    <div key={q.id} className="space-y-3">
                      <div className="flex gap-2.5 items-start">
                        <span className="timecode shrink-0 text-ink-3">{qIndex + 1}</span>
                        <h3 className="text-[15px] font-medium leading-relaxed text-ink">{q.question}</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-2 pl-6 sm:grid-cols-2">
                        {q.options.map(option => {
                          const optLetter = option.trim().charAt(0);
                          const isSelected = selected === optLetter;
                          return (
                            <button
                              key={option}
                              onClick={() => selectAnswer(p.id, q.id, optLetter)}
                              className={`rounded-xl border px-4 py-3 text-left text-[13px]
                                transition-colors duration-150 cursor-pointer ${
                                isSelected
                                  ? 'border-accent bg-accent-soft text-ink'
                                  : 'border-hairline text-ink hover:bg-paper-3'
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pb-6">
          <button
            onClick={finishExam}
            className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-[13px]
              font-medium text-white transition-colors hover:bg-accent-700 cursor-pointer"
          >
            <Flag className="h-4 w-4" /> Sınavı bitir ve sonuçları gör
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------- RESULTS
  if (phase === 'results' && attempt) {
    const percentage = attempt.totalQuestions > 0 ? Math.round((attempt.correctCount / attempt.totalQuestions) * 100) : 0;

    return (
      <div className="space-y-8">
        <h1 className="text-[22px] font-semibold tracking-tight text-brand">Sınav sonucu</h1>

        {/* DÖRT KUTU DEĞİL TEK YÜZEY. Doğru/yanlış/boş/başarı dördü de
            aynı sınavın parçası; ayrı kartlara bölünce kıyaslanamaz
            oluyorlardı. Renk yalnızca doğru ve yanlışta — orada bir şey
            ifade ediyor. */}
        <div className="grid grid-cols-2 divide-x divide-y divide-hairline overflow-hidden
          rounded-2xl border border-hairline bg-paper-2 sm:grid-cols-4 sm:divide-y-0">
          {([
            ['Doğru', String(attempt.correctCount), 'text-emerald-700'],
            ['Yanlış', String(attempt.wrongCount), 'text-rose-700'],
            ['Boş', String(attempt.blankCount), 'text-ink'],
            ['Başarı', `%${percentage}`, 'text-ink'],
          ] as [string, string, string][]).map(([label, value, tone]) => (
            <div key={label} className="px-4 py-3">
              <p className="text-[11px] text-ink-3">{label}</p>
              <p className={`timecode mt-1 text-[22px] font-semibold leading-tight ${tone}`}>{value}</p>
            </div>
          ))}
        </div>

        <p className="text-[13px] leading-relaxed text-ink-2">
          <span className="timecode">{formatTime(attempt.timeTakenSeconds)}</span> /{' '}
          <span className="timecode">{formatTime(attempt.durationSeconds)}</span> kullanıldı.
          {attempt.wrongCount + attempt.blankCount > 0
            ? " Yanlış ve boş sorular Yanlışlar Defteri'ne eklendi."
            : ' Hiç yanlışın yok.'}
        </p>

        <div className="space-y-4">
          {perPassageResults.map(({ passage, results }) => {
            const correct = results.filter(r => r.isCorrect).length;
            return (
              <div key={passage.id} className="overflow-hidden rounded-2xl border border-hairline bg-paper-2">
                <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
                  <div className="flex min-w-0 items-baseline gap-2">
                    <span className="shrink-0 rounded bg-paper-3 px-1.5 py-0.5 text-[11px] text-ink-2">
                      {passage.cefr}
                    </span>
                    <p className="truncate text-[14px] font-medium text-ink">{passage.title}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="timecode text-ink-2">{correct}/{results.length}</span>
                    <button
                      type="button"
                      onClick={() => onSelectPassage(passage.id)}
                      className="flex items-center gap-1 text-[12px] text-ink-3
                        transition-colors hover:text-accent cursor-pointer"
                    >
                      Parçaya git <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                {results.some(r => !r.isCorrect) && (
                  <div className="divide-y divide-hairline">
                    {results.filter(r => !r.isCorrect).map(r => (
                      <div key={r.questionId} className="px-5 py-2.5 flex items-center gap-3 text-xs">
                        <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                        <span className="text-ink/80 truncate flex-1">{r.question}</span>
                        <span className="text-ink-3 shrink-0">
                          Doğru: {r.correctAnswer} · Sen: {r.yourAnswer || '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {results.every(r => r.isCorrect) && (
                  <div className="px-5 py-2.5 flex items-center gap-2 text-xs text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Tüm sorular doğru!
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center pb-6">
          <button
            onClick={resetToSetup}
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[13px]
              font-medium text-white transition-colors hover:bg-accent-700 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" /> Yeni sınav başlat
          </button>
        </div>
      </div>
    );
  }

  return null;
}
