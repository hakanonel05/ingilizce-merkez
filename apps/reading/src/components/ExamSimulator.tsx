import { useEffect, useMemo, useRef, useState } from 'react';
import { Passage, CEFRLevel, ExamAttempt, GradedQuestionResult } from '../types';
import { Timer, Play, Flag, CheckCircle2, XCircle, RotateCcw, ExternalLink, ListChecks } from 'lucide-react';

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
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="border-b border-hairline/40 pb-6">
          <div className="flex items-center gap-2 text-accent mb-2">
            <Timer className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Sınav Simülasyonu</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-ink">YDS / YÖKDİL Deneme Sınavı</h2>
          <p className="text-ink/60 mt-2 text-sm leading-relaxed">
            Gerçek sınav temposunu hissetmek için süreli bir okuma denemesi başlat. Bitince net sonucun ve
            yanlışların otomatik olarak Yanlışlar Defteri'ne eklenir.
          </p>
        </div>

        <div className="bg-white border border-hairline/40 p-6 space-y-6 rounded-xl">
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-ink-3 mb-3">Kaç Parça?</p>
            <div className="flex gap-2">
              {PASSAGE_COUNT_OPTIONS.map(n => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 py-3 text-sm font-bold border transition-all rounded-lg ${
                    count === n
                      ? 'bg-accent text-white border-accent'
                      : 'bg-paper text-ink/70 border-hairline/40 hover:border-accent/40'
                  }`}
                >
                  {n} Parça
                  <span className="block text-[10px] font-normal opacity-70 mt-0.5">~{n * MINUTES_PER_PASSAGE} dk</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-ink-3 mb-3">Seviye</p>
            <div className="flex flex-wrap gap-2">
              {(['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setCefr(lvl)}
                  className={`px-3.5 py-1.5 text-xs font-bold border transition-all rounded-lg ${
                    cefr === lvl
                      ? 'bg-ink text-white border-ink'
                      : 'bg-white text-ink/70 border-hairline/50 hover:border-accent/50'
                  }`}
                >
                  {lvl === 'ALL' ? 'Karışık' : lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-hairline/20 flex items-center justify-between">
            <p className="text-xs text-ink-3">
              Havuzda {eligiblePassages.length} uygun parça var.
            </p>
            <button
              onClick={startExam}
              disabled={eligiblePassages.length === 0}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold bg-accent text-white hover:opacity-90 disabled:opacity-40 rounded-lg"
            >
              <Play className="h-4 w-4" /> Sınavı Başlat
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
          isLowTime ? 'bg-rose-50 border-rose-300' : 'bg-white/95 backdrop-blur border-hairline/40'
        }`}>
          <div className="flex items-center gap-2">
            <Timer className={`h-4 w-4 ${isLowTime ? 'text-rose-600' : 'text-accent'}`} />
            <span className={`font-mono text-lg font-bold ${isLowTime ? 'text-rose-700' : 'text-ink'}`}>
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
                className="w-7 h-7 flex items-center justify-center text-[11px] font-bold border border-hairline/40 bg-paper text-ink/70 hover:border-accent rounded-lg"
              >
                {i + 1}
              </a>
            ))}
          </div>
          <button
            onClick={finishExam}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-ink text-white hover:opacity-90 rounded-lg"
          >
            <Flag className="h-3.5 w-3.5" /> Sınavı Bitir
          </button>
        </div>

        <div className="space-y-10">
          {examPassages.map((p, pIndex) => (
            <div key={p.id} id={`exam-passage-${p.id}`} className="bg-white border border-hairline/40 scroll-mt-24 rounded-lg">
              <div className="px-6 py-4 border-b border-hairline/30 flex items-center gap-3">
                <span className="w-7 h-7 flex items-center justify-center bg-accent text-white text-xs font-bold shrink-0">
                  {pIndex + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">{p.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-ink-3">{p.cefr} · {p.theme}</span>
                </div>
              </div>

              <div className="px-6 py-5 space-y-4 border-b border-hairline/20 font-display text-sm leading-relaxed text-ink/90">
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
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-paper border border-hairline/40 text-ink text-xs font-bold font-mono rounded-lg">
                          {qIndex + 1}
                        </span>
                        <h4 className="text-sm font-display font-bold text-ink leading-relaxed">{q.question}</h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                        {q.options.map(option => {
                          const optLetter = option.trim().charAt(0);
                          const isSelected = selected === optLetter;
                          return (
                            <button
                              key={option}
                              onClick={() => selectAnswer(p.id, q.id, optLetter)}
                              className={`text-left p-2.5 border text-xs font-sans transition-all rounded-lg ${
                                isSelected
                                  ? 'bg-accent text-white border-accent font-bold'
                                  : 'bg-paper border-hairline/30 text-ink hover:border-accent/40'
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
            className="flex items-center gap-2 px-8 py-3.5 text-sm font-bold bg-ink text-white hover:opacity-90 rounded-lg"
          >
            <Flag className="h-4 w-4" /> Sınavı Bitir ve Sonuçları Gör
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
        <div className="border-b border-hairline/40 pb-6">
          <div className="flex items-center gap-2 text-accent mb-2">
            <ListChecks className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Sonuçlar</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-ink">Sınav Tamamlandı</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Doğru', value: attempt.correctCount, color: 'text-emerald-700' },
            { label: 'Yanlış', value: attempt.wrongCount, color: 'text-rose-700' },
            { label: 'Boş', value: attempt.blankCount, color: 'text-ink-3' },
            { label: 'Başarı', value: `%${percentage}`, color: 'text-accent' },
          ].map(stat => (
            <div key={stat.label} className="bg-white border border-hairline/40 p-5 text-center rounded-xl">
              <p className={`font-display text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-3 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-ink-3">
          Süre: {formatTime(attempt.timeTakenSeconds)} / {formatTime(attempt.durationSeconds)} kullanıldı ·
          {attempt.wrongCount + attempt.blankCount > 0 ? ' Yanlış ve boş sorular Yanlışlar Defteri\'ne eklendi.' : ' Tebrikler, hiç yanlışın yok!'}
        </p>

        <div className="space-y-4">
          {perPassageResults.map(({ passage, results }) => {
            const correct = results.filter(r => r.isCorrect).length;
            return (
              <div key={passage.id} className="bg-white border border-hairline/40 rounded-lg">
                <div className="px-5 py-3 border-b border-hairline/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-paper border border-hairline/40 shrink-0 rounded-lg">
                      {passage.cefr}
                    </span>
                    <p className="font-display font-bold text-sm text-ink truncate">{passage.title}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-ink/60">{correct} / {results.length}</span>
                    <button
                      onClick={() => onSelectPassage(passage.id)}
                      className="flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                    >
                      Parçaya Git <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                {results.some(r => !r.isCorrect) && (
                  <div className="divide-y divide-hairline/20">
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
            className="flex items-center gap-2 px-6 py-3 text-sm font-bold bg-accent text-white hover:opacity-90 rounded-lg"
          >
            <RotateCcw className="h-4 w-4" /> Yeni Sınav Başlat
          </button>
        </div>
      </div>
    );
  }

  return null;
}
