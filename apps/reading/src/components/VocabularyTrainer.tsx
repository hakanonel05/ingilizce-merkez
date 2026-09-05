import { useState, useMemo, useEffect } from 'react';
import { Passage, VocabularyWord, UserProgress } from '../types';
import { CORE_VOCABULARY_DATA, CORE_VOCABULARY_CATEGORIES } from '../data/coreVocabulary';
import { CheckCircle2, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';

interface VocabularyTrainerProps {
  passages: Passage[];
  progress: UserProgress;
  onWordStatusChange: (term: string, status: 'unstudied' | 'studied' | 'learned') => void;
}

export default function VocabularyTrainer({ passages, progress, onWordStatusChange }: VocabularyTrainerProps) {
  const [mode, setMode] = useState<'cards' | 'test'>('cards');
  const [trainerSource, setTrainerSource] = useState<'all' | 'passages' | 'core'>('all');

  // Flatten words across all passages and/or core vocabulary
  const allWords = useMemo(() => {
    const list: (VocabularyWord & { passageTitle?: string; isCore?: boolean })[] = [];
    
    if (trainerSource === 'all' || trainerSource === 'passages') {
      passages.forEach(p => {
        if (!p) return;
        (p.vocabulary ?? []).forEach(v => {
          if (!list.some(item => item.term === v.term)) {
            list.push({ ...v, passageTitle: p.title, isCore: false });
          }
        });
      });
    }

    if (trainerSource === 'all' || trainerSource === 'core') {
      CORE_VOCABULARY_DATA.forEach(v => {
        if (!list.some(item => item.term === v.term)) {
          list.push({
            term: v.term,
            meaning: v.meaning,
            partOfSpeech: v.partOfSpeech,
            definition: v.definition,
            exampleSentence: v.exampleSentence,
            passageTitle: 'Temel Kelime Listesi',
            isCore: true
          });
        }
      });
    }

    return list;
  }, [passages, trainerSource]);

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardFilter, setCardFilter] = useState<'all' | 'unstudied' | 'studied' | 'learned'>('all');

  // Filtered flashcards list
  const filteredWords = useMemo(() => {
    return allWords.filter(w => {
      const status = progress.wordStatus[w.term] || 'unstudied';
      if (cardFilter === 'all') return true;
      return status === cardFilter;
    });
  }, [allWords, progress.wordStatus, cardFilter]);

  // Reset index when filter or trainer source changes
  useEffect(() => {
    setCardIndex(0);
    setIsFlipped(false);
  }, [cardFilter, trainerSource]);

  // Voice TTS
  const speakWord = (term: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(term);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Practice Test State
  const [testActive, setTestActive] = useState(false);
  const [testQuestions, setTestActiveQuestions] = useState<{ word: string; meaning: string; questionText: string; options: string[]; correctAnswer: string }[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);

  // Generate test questions
  const generateTest = () => {
    if (allWords.length < 4) return;
    
    // Choose 10 random words (or less if not enough words)
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));

    const generated = selected.map(word => {
      // Pick 3 other random words for wrong options
      const fillers = allWords
        .filter(w => w.term !== word.term)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.meaning);

      const correctAnswer = word.meaning;
      const options = [correctAnswer, ...fillers].sort(() => 0.5 - Math.random());

      // Randomly ask either meaning or term
      return {
        word: word.term,
        meaning: word.meaning,
        questionText: `What is the Turkish meaning of the word "${word.term}" (${word.partOfSpeech})?`,
        options,
        correctAnswer
      };
    });

    setTestActiveQuestions(generated);
    setCurrentTestIndex(0);
    setTestAnswers({});
    setTestSubmitted(false);
    setTestScore(0);
    setTestActive(true);
  };

  // Handle single question answer in test
  const handleSelectTestOption = (option: string) => {
    if (testSubmitted) return;
    setTestAnswers(prev => ({
      ...prev,
      [currentTestIndex]: option
    }));
  };

  // Proceed in test
  const nextTestQuestion = () => {
    if (currentTestIndex < testQuestions.length - 1) {
      setCurrentTestIndex(prev => prev + 1);
    } else {
      // Submit full test
      let score = 0;
      testQuestions.forEach((q, idx) => {
        if (testAnswers[idx] === q.correctAnswer) {
          score++;
          // Mark word as learned on success!
          onWordStatusChange(q.word, 'learned');
        } else if (testAnswers[idx]) {
          // If attempted but wrong, mark as studied so they can review it!
          onWordStatusChange(q.word, 'studied');
        }
      });
      setTestScore(score);
      setTestSubmitted(true);
    }
  };

  const activeCardWord = filteredWords[cardIndex];

  const cardStatus = activeCardWord
    ? (progress.wordStatus[activeCardWord.term] || 'unstudied')
    : 'unstudied';

  /** Segment düğmesi — bu depodaki tüm filtre/sekme denetimleriyle aynı. */
  const segment = (label: string, isActive: boolean, onClick: () => void) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-[12px] transition-colors duration-150 cursor-pointer ${
        isActive ? 'bg-paper-2 font-medium text-ink' : 'text-ink-2 hover:text-ink'
      }`}
    >
      {label}
    </button>
  );

  const selectClass =
    'rounded-xl border border-hairline bg-paper-2 px-2.5 py-2 text-[12px] text-ink ' +
    'transition-colors focus:border-accent focus:outline-none cursor-pointer';

  return (
    <div id="vocabulary-trainer-container" className="space-y-5">

      <div className="flex items-baseline justify-between gap-3">
        <h1 className="text-[22px] font-semibold tracking-tight text-brand">Kelime Çalışma</h1>
        {mode === 'cards' && filteredWords.length > 0 && (
          <span className="text-[12px] text-ink-3">
            <span className="timecode text-ink">{cardIndex + 1}</span> / {filteredWords.length} kart
          </span>
        )}
      </div>

      {/* ÜÇ AYRI KUTU TEK SATIRA İNDİ.
          Önce başlık kartı ("Pratik ve Gelişim Alanı" + emoji'li sekmeler),
          kaynak kartı ve filtre kartı üst üste duruyordu; üçü birlikte
          ekranın yarısını kaplıyor ve asıl kart aşağıda kalıyordu. */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="flex w-fit gap-0.5 rounded-xl bg-paper-3 p-1">
          {segment('Kelime kartları', mode === 'cards', () => { setMode('cards'); setTestActive(false); })}
          {segment('Hızlı test', mode === 'test', () => setMode('test'))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={trainerSource}
            onChange={(e) => { setTrainerSource(e.target.value as any); setTestActive(false); }}
            aria-label="Kelime kaynağı"
            className={selectClass}
          >
            <option value="all">Karışık</option>
            <option value="passages">Okuma parçaları</option>
            <option value="core">Temel liste</option>
          </select>

          {mode === 'cards' && (
            <select
              value={cardFilter}
              onChange={(e) => setCardFilter(e.target.value as any)}
              aria-label="Kart filtresi"
              className={selectClass}
            >
              <option value="all">Tüm kartlar</option>
              <option value="unstudied">Çalışılmayan</option>
              <option value="studied">Çalışılan</option>
              <option value="learned">Öğrenilen</option>
            </select>
          )}
        </div>
      </div>

      {mode === 'cards' ? (
        filteredWords.length > 0 && activeCardWord ? (
          <div className="mx-auto w-full max-w-2xl space-y-4">

            {/* KART.
                Önceki sürümde `rotate-y-180` ile 3B çevirme taklidi
                vardı ama ne `transform-style: preserve-3d` ne de
                `backface-visibility` tanımlıydı; sonuç dönmüyor,
                yalnızca opaklık değişiyordu. Sahte dönüş kaldırıldı:
                iki yüz sönerek yer değiştiriyor, yani ekranda görünen
                davranış koddaki davranışla aynı. */}
            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              aria-label={isFlipped ? 'Ön yüzü göster' : 'Arka yüzü göster'}
              className="flex min-h-72 w-full flex-col items-center justify-center gap-3
                rounded-2xl border border-hairline bg-paper-2 p-8 text-center
                transition-colors duration-150 hover:bg-paper-3/40 cursor-pointer"
            >
              <span className="text-[11px] text-ink-3">{activeCardWord.partOfSpeech}</span>

              {!isFlipped ? (
                <>
                  <span className="text-[30px] font-semibold tracking-tight text-ink">
                    {activeCardWord.term}
                  </span>
                  <span className="text-[12px] text-ink-3">Çevirmek için dokun</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); speakWord(activeCardWord.term); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault(); e.stopPropagation();
                        speakWord(activeCardWord.term);
                      }
                    }}
                    title="Telaffuzu dinle"
                    className="mt-2 rounded-lg p-2 text-ink-3 transition-colors
                      hover:bg-paper-3 hover:text-ink cursor-pointer"
                  >
                    <Volume2 className="h-5 w-5" />
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[22px] font-semibold tracking-tight text-ink">
                    {activeCardWord.term}
                  </span>
                  <span className="text-[18px] text-brand">{activeCardWord.meaning}</span>

                  {activeCardWord.definition && (
                    <span className="max-w-[46ch] text-[13px] leading-relaxed text-ink-2">
                      {activeCardWord.definition}
                    </span>
                  )}
                  {activeCardWord.exampleSentence && (
                    <span className="max-w-[46ch] text-[12px] italic leading-relaxed text-ink-3">
                      {activeCardWord.exampleSentence}
                    </span>
                  )}
                </>
              )}
            </button>

            {/* Gezinme ve durum — kutu değil, tek satır */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={cardIndex === 0}
                  onClick={() => { setCardIndex(prev => prev - 1); setIsFlipped(false); }}
                  aria-label="Önceki kart"
                  className="rounded-lg p-2 text-ink-3 transition-colors hover:bg-paper-3
                    hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={cardIndex === filteredWords.length - 1}
                  onClick={() => { setCardIndex(prev => prev + 1); setIsFlipped(false); }}
                  aria-label="Sonraki kart"
                  className="rounded-lg p-2 text-ink-3 transition-colors hover:bg-paper-3
                    hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex gap-0.5 rounded-lg bg-paper-3 p-0.5">
                {([
                  ['studied', 'Çalışıyorum'],
                  ['learned', 'Öğrendim'],
                ] as [string, string][]).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onWordStatusChange(activeCardWord.term, id as any)}
                    aria-pressed={cardStatus === id}
                    className={`rounded px-3 py-1.5 text-[12px] transition-colors cursor-pointer ${
                      cardStatus === id
                        ? id === 'studied'
                          ? 'bg-amber-500 font-medium text-white'
                          : 'bg-emerald-600 font-medium text-white'
                        : 'text-ink-3 hover:text-ink'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-hairline p-10 text-center">
            <p className="text-[14px] font-medium text-ink">Bu filtreye uyan kelime yok.</p>
            <p className="mx-auto mt-1 max-w-[46ch] text-[13px] leading-relaxed text-ink-2">
              Başka bir kart filtresi ya da kaynak seçmeyi dene.
            </p>
          </div>
        )
      ) : (
        <div className="rounded-2xl border border-hairline bg-paper-2 p-5 sm:p-6">
          {!testActive ? (
            <div className="py-8 text-center">
              {/* Baslik Turkce oldu: "Dynamic Vocabulary Challenge" arayuzun
                  geri kalani Turkceyken yer tutucu gibi duruyordu. */}
              <h2 className="text-[17px] font-semibold text-ink">Hızlı test</h2>
              <p className="mx-auto mt-2 max-w-[52ch] text-[13px] leading-relaxed text-ink-2">
                Seçili kaynaktan rastgele on kelime sorulur. Doğru bildiklerin
                otomatik olarak "öğrenildi" durumuna geçer.
              </p>
              <button
                type="button"
                onClick={generateTest}
                className="mt-6 rounded-xl bg-accent px-5 py-2.5 text-[13px] font-medium text-white
                  transition-colors duration-150 hover:bg-accent-700 cursor-pointer"
              >
                Testi başlat
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3 border-b border-hairline pb-4">
                <span className="text-[12px] text-ink-3">
                  Soru <span className="timecode text-ink">{currentTestIndex + 1}</span> / {testQuestions.length}
                </span>
                <div className="h-1 w-32 overflow-hidden rounded-full bg-paper-3">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-300"
                    style={{ width: `${((currentTestIndex + (testSubmitted ? 1 : 0)) / testQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-[17px] font-medium leading-relaxed text-ink">
                  {testQuestions[currentTestIndex].questionText}
                </h2>

                <div className="space-y-2">
                  {testQuestions[currentTestIndex].options.map(option => {
                    const isSelected = testAnswers[currentTestIndex] === option;
                    const isCorrectOption = option === testQuestions[currentTestIndex].correctAnswer;

                    let style = 'border-hairline text-ink hover:bg-paper-3';
                    if (isSelected && !testSubmitted) {
                      style = 'border-accent bg-accent-soft text-ink';
                    } else if (testSubmitted) {
                      if (isCorrectOption) style = 'border-emerald-500 bg-emerald-50 text-emerald-900';
                      else if (isSelected) style = 'border-rose-400 bg-rose-50 text-rose-900';
                      else style = 'border-hairline text-ink-3';
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={testSubmitted}
                        onClick={() => handleSelectTestOption(option)}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl border
                          px-4 py-3 text-left text-[13px] transition-colors duration-150
                          disabled:cursor-default cursor-pointer ${style}`}
                      >
                        <span>{option}</span>
                        {testSubmitted && isCorrectOption && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col items-start justify-between gap-3 border-t border-hairline pt-4 sm:flex-row sm:items-center">
                {testSubmitted ? (
                  <p className="text-[13px] text-ink-2">
                    Doğru yanıt{' '}
                    <span className="timecode font-semibold text-ink">
                      {testScore}/{testQuestions.length}
                    </span>
                  </p>
                ) : (
                  <p className="text-[12px] text-ink-3">
                    Doğru bilinen kelimeler "öğrenildi" durumuna yükseltilir.
                  </p>
                )}

                <div className="flex w-full gap-2 sm:w-auto">
                  {testSubmitted ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setTestActive(false)}
                        className="flex-1 rounded-xl border border-hairline px-4 py-2 text-[13px]
                          font-medium text-ink-2 transition-colors hover:bg-paper-3 hover:text-ink
                          cursor-pointer sm:flex-none"
                      >
                        Kapat
                      </button>
                      <button
                        type="button"
                        onClick={generateTest}
                        className="flex-1 rounded-xl bg-accent px-4 py-2 text-[13px] font-medium
                          text-white transition-colors hover:bg-accent-700 cursor-pointer sm:flex-none"
                      >
                        Yeni test
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={!testAnswers[currentTestIndex]}
                      onClick={nextTestQuestion}
                      className="flex w-full items-center justify-center gap-1 rounded-xl bg-accent
                        px-4 py-2 text-[13px] font-medium text-white transition-colors
                        hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-40
                        cursor-pointer sm:w-auto"
                    >
                      {currentTestIndex === testQuestions.length - 1 ? 'Testi bitir' : 'Sonraki soru'}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
