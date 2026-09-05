import { useState, useEffect, useCallback, useRef } from 'react';
import { Passage, UserProgress, GradedQuestionResult, VocabularyWord } from '../types';
import { ChevronLeft, Star, Volume2, AlertCircle, Check, X, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { addWordToVocabBank, getAllCards, VOCAB_CHANGED_EVENT, readingPassageLessonId } from '../lib/vocabBank';
import { SelectionToCard } from '../../../../shared/vocab/SelectionToCard';
import { useNarration } from '../lib/narration';
import NarrationBar from './NarrationBar';

interface PassageCardProps {
  passage: Passage;
  progress: UserProgress;
  onBackToList: () => void;
  onToggleFavorite: (id: number) => void;
  onWordStatusChange: (term: string, status: 'unstudied' | 'studied' | 'learned') => void;
  onSaveTestResult: (passageId: number, score: number, total: number) => void;
  onSaveExerciseResult: (passageId: number, score: number, total: number) => void;
  onGradeQuestions: (passage: Passage, source: 'quiz' | 'exercise', results: GradedQuestionResult[]) => void;
}

export default function PassageCard({
  passage,
  progress,
  onBackToList,
  onToggleFavorite,
  onWordStatusChange,
  onSaveTestResult,
  onSaveExerciseResult,
  onGradeQuestions
}: PassageCardProps) {
  // Tabs inside specific passage
  const [activeTab, setActiveTab] = useState<'text' | 'quiz' | 'exercises'>('text');

  // Selected interactive word detail
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // Comprehension test states
  const [comprehensionAnswers, setComprehensionAnswers] = useState<Record<number, string>>({});
  const [comprehensionSubmitted, setComprehensionSubmitted] = useState(false);
  const [comprehensionScore, setComprehensionScore] = useState(0);

  // Vocabulary exercises states
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<number, string>>({});
  const [exercisesSubmitted, setExercisesSubmitted] = useState(false);
  const [exercisesScore, setExercisesScore] = useState(0);

  const isFavorite = progress.favoritePassages.includes(passage.id);

  /**
   * Metin gövdesi. Katmanlıdaki gibi, buradan yapılan HER seçim (yalnızca
   * önceden tanımlı kelimeler değil) karta eklenebilsin diye
   * SelectionToCard'a veriliyor.
   */
  const textRef = useRef<HTMLDivElement | null>(null);

  /**
   * Sesli okuma. Parca degisince otomatik sifirlanmasi icin passage.id
   * veriliyor; okunan paragraf asagida vurgulaniyor.
   */
  const narration = useNarration(passage.id, passage.paragraphs);

  // Paylaşılan FSRS kelime bankasına eklenmiş terimler (katmanlı ile ortak)
  const [bankedTerms, setBankedTerms] = useState<Set<string>>(new Set());
  const [addingTerm, setAddingTerm] = useState<string | null>(null);

  const refreshBankedTerms = useCallback(() => {
    getAllCards()
      .then(cards => setBankedTerms(new Set(cards.map(c => c.front.toLowerCase()))))
      .catch(err => console.warn('Kelime bankası okunamadı', err));
  }, []);

  useEffect(() => {
    refreshBankedTerms();
    window.addEventListener(VOCAB_CHANGED_EVENT, refreshBankedTerms);
    return () => window.removeEventListener(VOCAB_CHANGED_EVENT, refreshBankedTerms);
  }, [refreshBankedTerms]);

  const handleAddWordToBank = async (word: VocabularyWord) => {
    setAddingTerm(word.term);
    try {
      await addWordToVocabBank(
        word,
        { lessonId: readingPassageLessonId(passage.id), lessonTitle: passage.title },
        passage.cefr
      );
    } catch (err) {
      console.error('Kelime bankaya eklenemedi', err);
    } finally {
      setAddingTerm(null);
    }
  };

  /**
   * Parca degisince ekrani sifirla — ama DAHA ONCE COZULDUYSE sonucu geri
   * yukle. Eskiden her donuste testler bos ve gonderilmemis gorunuyordu;
   * puan kayitliyken bile kullanici hic cozmemis sanıyordu.
   */
  useEffect(() => {
    setActiveTab('text');
    setSelectedWord(null);
    setComprehensionAnswers({});
    setExerciseAnswers({});

    const savedQuiz = progress.scores?.[passage.id];
    setComprehensionSubmitted(!!savedQuiz);
    setComprehensionScore(savedQuiz?.score ?? 0);

    const savedExercise = progress.exerciseScores?.[passage.id];
    setExercisesSubmitted(!!savedExercise);
    setExercisesScore(savedExercise?.score ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passage]);

  // Handle highlighted word click in text
  const handleWordClick = (word: string) => {
    // Sanitize word (remove punctuation)
    const sanitized = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").toLowerCase();
    const found = (passage.vocabulary ?? []).find(v => v.term.toLowerCase() === sanitized);
    if (found) {
      setSelectedWord(found.term);
    }
  };

  // Helper to highlight key words in paragraphs
  const renderParagraphWithHighlights = (paragraph: string) => {
    // Splitting by spaces but keeping track of punctuation
    const words = paragraph.split(/(\s+)/);
    return words.map((chunk, index) => {
      // Find clean alphanumeric word for matching
      const cleanWord = chunk.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").trim().toLowerCase();
      const isVocabulary = (passage.vocabulary ?? []).some(v => v.term.toLowerCase() === cleanWord);

      if (isVocabulary) {
        const foundTerm = (passage.vocabulary ?? []).find(v => v.term.toLowerCase() === cleanWord)?.term || "";
        const isSelected = selectedWord === foundTerm;
        const status = progress.wordStatus[foundTerm] || 'unstudied';

        // Styling based on study status matching Editorial Aesthetic
        let underlineStyle = 'border-b border-dashed border-ink/60';
        if (status === 'studied') underlineStyle = 'border-b-2 border-marker';
        if (status === 'learned') underlineStyle = 'border-b-2 border-ok';

        return (
          <span
            key={index}
            onClick={() => handleWordClick(chunk)}
            className={`passage-word cursor-pointer px-1 transition-all duration-150 ${underlineStyle} ${
              isSelected
                ? 'bg-accent text-white border-none'
                : 'text-ink hover:bg-paper'
            }`}
          >
            {chunk}
          </span>
        );
      }
      return <span key={index}>{chunk}</span>;
    });
  };

  // Handle comprehension answer click
  const selectComprehensionOption = (questionId: number, optionLetter: string) => {
    if (comprehensionSubmitted) return;
    setComprehensionAnswers(prev => ({
      ...prev,
      [questionId]: optionLetter
    }));
  };

  // Handle exercise answer click
  const selectExerciseOption = (exerciseId: number, optionLetter: string) => {
    if (exercisesSubmitted) return;
    setExerciseAnswers(prev => ({
      ...prev,
      [exerciseId]: optionLetter
    }));
  };

  // Submit comprehension quiz
  const submitComprehensionQuiz = () => {
    let score = 0;
    const gradedResults: GradedQuestionResult[] = passage.questions.map(q => {
      const selected = comprehensionAnswers[q.id] || '';
      const isCorrect = selected === q.answer;
      if (isCorrect) score++;
      return {
        questionId: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.answer,
        yourAnswer: selected,
        isCorrect
      };
    });

    setComprehensionScore(score);
    setComprehensionSubmitted(true);

    // Save to overall scores
    onSaveTestResult(passage.id, score, passage.questions.length);
    // Update the "Yanlışlar Defteri" (mistakes notebook)
    onGradeQuestions(passage, 'quiz', gradedResults);
  };

  // Submit vocabulary exercises
  const submitExercisesQuiz = () => {
    let score = 0;
    const gradedResults: GradedQuestionResult[] = passage.exercises.map(ex => {
      const selected = exerciseAnswers[ex.id] || '';
      const isCorrect = selected === ex.answer;
      if (isCorrect) score++;
      return {
        questionId: ex.id,
        question: ex.question,
        options: ex.options,
        correctAnswer: ex.answer,
        yourAnswer: selected,
        isCorrect
      };
    });

    setExercisesScore(score);
    setExercisesSubmitted(true);
    // Sonucu kalici yaz: eskiden yalnizca bilesen durumunda kaliyordu ve
    // parcadan cikip donunce alistirmalar hic yapilmamis gibi gorunuyordu.
    onSaveExerciseResult(passage.id, score, passage.exercises.length);
    // Update the "Yanlışlar Defteri" (mistakes notebook)
    onGradeQuestions(passage, 'exercise', gradedResults);
  };

  // Trigger TTS voice representing term
  const speakWord = (term: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(term);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Active word details
  const activeWordDetail = passage.vocabulary.find(v => v.term === selectedWord);

  return (
    <div id="passage-card-container" className="space-y-6">

      {/* BAŞLIK BÖLGESİ.
          Burada üst üste ÜÇ kutu vardı: gezinme kartı, başlık kartı ve
          sekme çubuğu. Asıl iş — okuma metni — üçünün altında kalıyordu.
          Bu bir çalışma ekranı; metin başrolde olmalı, arayüz kenarda.
          Üçü tek bir başlık bloğuna indi ve hiçbiri kutu değil. */}
      <div>
        <button
          type="button"
          onClick={onBackToList}
          className="-ml-1 inline-flex items-center gap-1 rounded-lg px-1 py-0.5 text-[12px]
            text-ink-2 transition-colors hover:text-ink cursor-pointer"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Kütüphaneye dön
        </button>

        <div className="mt-2 flex items-start justify-between gap-4">
          <h1 className="min-w-0 text-[22px] font-semibold leading-tight tracking-tight text-ink sm:text-[26px]">
            {passage.title}
          </h1>

          <button
            type="button"
            onClick={() => onToggleFavorite(passage.id)}
            title={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            aria-pressed={isFavorite}
            className={`shrink-0 rounded-lg p-2 transition-colors cursor-pointer hover:bg-paper-3 ${
              isFavorite ? 'text-marker' : 'text-ink-3'
            }`}
          >
            <Star className={`h-4.5 w-4.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Künye — rozet değil, tek satır metin */}
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[12px] text-ink-3">
          <span className="rounded bg-paper-3 px-1.5 py-0.5 font-medium text-ink-2">
            {passage.cefr}
          </span>
          <span className="min-w-0 truncate">{passage.theme}</span>
        </p>
      </div>

      {/* Sekmeler. Emoji ve büyük harf kalktı: üç sekme zaten kısa ve
          aktif olan dolu menekşe ile belli. Liste ekranındaki filtre
          segmentleriyle aynı dil. */}
      <div className="flex gap-0.5 rounded-xl bg-paper-3 p-1">
        {[
          { id: 'text', label: 'Okuma metni' },
          { id: 'quiz', label: 'Anlama testi' },
          { id: 'exercises', label: 'Kelime alıştırmaları' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            className={`flex-1 rounded-lg py-2 text-center text-[13px] transition-colors duration-150 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-accent font-medium text-white'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid Container for Main Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Left Column: METİN / SORULAR */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">

            {/* okuma metni tab */}
            {activeTab === 'text' && (
              <motion.div
                key="text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="rounded-2xl border border-hairline bg-paper-2 p-4 sm:p-8 space-y-8"
              >
                {/* Paragraphs Panel */}
                {/* Sesli okuma kumandasi */}
                <NarrationBar narration={narration} total={passage.paragraphs.length} />

                <div
                  ref={textRef}
                  className="passage-body space-y-6 text-ink/90"
                >
                  {passage.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      /* Okunan paragrafi isaretlemek gozun sesi takip
                         etmesini sagliyor; dinlerken okumak, yalnizca
                         dinlemekten cok daha ogretici. */
                      className={
                        narration.currentIndex === i
                          ? 'bg-[var(--marker-bg)] -mx-2 px-2 py-1 transition-colors rounded-lg'
                          : 'transition-colors'
                      }
                    >
                      {renderParagraphWithHighlights(p)}
                    </p>
                  ))}
                </div>

                {/* Metinde herhangi bir ifadeyi seçince "Karta Ekle" balonu */}
                <SelectionToCard
                  containerRef={textRef}
                  lessonId={readingPassageLessonId(passage.id)}
                  lessonTitle={passage.title}
                  onAdded={refreshBankedTerms}
                />

                {/* Subtitle / Note */}
                <p className="flex items-start gap-2 text-[12px] leading-relaxed text-ink-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  Altı çizili kelimelere tıklayarak karşılıklarını görebilir,
                  durumlarını aşağıdaki listeden güncelleyebilirsin.
                </p>

                {/* Inline Vocabulary Mastery Table */}
                <div className="border-t border-hairline pt-6">
                  <h2 className="mb-4 text-[15px] font-semibold text-ink">
                    Anahtar kelimeler{' '}
                    <span className="timecode font-normal text-ink-3">{passage.vocabulary.length}</span>
                  </h2>
                  <div className="divide-y divide-hairline">
                    {passage.vocabulary.map(word => {
                      const status = progress.wordStatus[word.term] || 'unstudied';
                      return (
                        <div key={word.term} className="group flex flex-col justify-between gap-3 py-3.5 sm:flex-row sm:items-center">
                          <div className="min-w-0">
                            <div className="flex items-baseline gap-2">
                              <span className="text-[14px] font-medium text-ink">{word.term}</span>
                              <span className="text-[11px] text-ink-3">{word.partOfSpeech}</span>
                              <button
                                type="button"
                                onClick={() => speakWord(word.term)}
                                title="Telaffuzu dinle"
                                aria-label="Telaffuzu dinle"
                                className="row-actions rounded p-1 text-ink-3 opacity-0 transition-opacity
                                  hover:text-ink focus:opacity-100 group-hover:opacity-100 cursor-pointer"
                              >
                                <Volume2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <p className="mt-0.5 text-[13px] text-ink-2">{word.meaning}</p>
                          </div>

                          {/* Durum. Uc secenek: burada "calismadim"a geri donus de
                              mumkun — kelime haznesi ekraninda olmayan bir imkan. */}
                          <div className="flex shrink-0 gap-0.5 self-start rounded-lg bg-paper-3 p-0.5 sm:self-auto">
                            {([
                              ['unstudied', 'Çalışmadım'],
                              ['studied', 'Çalışıyorum'],
                              ['learned', 'Öğrendim'],
                            ] as [string, string][]).map(([id, label]) => (
                              <button
                                key={id}
                                type="button"
                                onClick={() => onWordStatusChange(word.term, id as any)}
                                aria-pressed={status === id}
                                className={`rounded px-2.5 py-1 text-[11px] transition-colors cursor-pointer ${
                                  status === id
                                    ? id === 'studied'
                                      ? 'bg-marker-bg font-medium text-marker-ink ring-1 ring-marker'
                                      : id === 'learned'
                                        ? 'bg-ok-soft font-medium text-ok ring-1 ring-ok-line'
                                        : 'bg-paper-3 font-medium text-ink ring-1 ring-hairline-2'
                                    : 'text-ink-3 hover:text-ink'
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            )}

            {/* Comprehension Quiz Tab */}
            {activeTab === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="bg-paper-2 border border-hairline p-6 sm:p-10  space-y-6 rounded-2xl"
              >
                <div className="flex items-baseline justify-between gap-3 border-b border-hairline pb-4">
                  <h2 className="text-[15px] font-semibold text-ink">Okuduğunu anlama testi</h2>
                  <span className="text-[12px] text-ink-3">
                    <span className="timecode text-ink">{passage.questions.length}</span> soru
                  </span>
                </div>

                <div className="divide-y divide-hairline">
                  {passage.questions.map((q, qIndex) => {
                    const selected = comprehensionAnswers[q.id];
                    const isCorrect = q.options.find(o => o.startsWith(selected))?.startsWith(q.answer);

                    return (
                      <div key={q.id} className="space-y-3">
                        <div className="flex items-baseline gap-2.5">
                          <span className="timecode shrink-0 text-ink-3">{qIndex + 1}</span>
                          <h3 className="text-[15px] font-medium leading-relaxed text-ink">{q.question}</h3>
                        </div>

                        <div className="space-y-2 pl-6">
                          {q.options.map(option => {
                            const optionLetter = option.trim().charAt(0); // A, B, C, D
                            const isOptionSelected = selected === optionLetter;
                            const isOptionCorrect = option.startsWith(q.answer);

                            let buttonStyle = 'border-hairline text-ink hover:bg-paper-3';

                            if (isOptionSelected && !comprehensionSubmitted) {
                              buttonStyle = 'border-accent bg-accent-soft text-ink';
                            } else if (comprehensionSubmitted) {
                              if (isOptionCorrect) {
                                buttonStyle = 'border-ok bg-ok-soft text-ok';
                              } else if (isOptionSelected) {
                                buttonStyle = 'border-danger bg-danger-soft text-danger';
                              } else {
                                buttonStyle = 'border-hairline text-ink-3';
                              }
                            }

                            return (
                              <button
                                key={option}
                                disabled={comprehensionSubmitted}
                                onClick={() => selectComprehensionOption(q.id, optionLetter)}
                                className={`flex w-full items-center justify-between gap-3 rounded-xl border
                                  px-4 py-3 text-left text-[13px] transition-colors duration-150
                                  disabled:cursor-default cursor-pointer ${buttonStyle}`}
                              >
                                <span>{option}</span>
                                {comprehensionSubmitted && isOptionCorrect && (
                                  <Check className="h-4 w-4 text-ok shrink-0 ml-2" />
                                )}
                                {comprehensionSubmitted && isOptionSelected && !isOptionCorrect && (
                                  <X className="h-4 w-4 text-danger shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Score / Submit Footer */}
                <div className="border-t border-hairline pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {comprehensionSubmitted ? (
                    <p className="text-[13px] text-ink-2">
                      Doğru yanıt{' '}
                      <span className="timecode font-semibold text-ink">
                        {comprehensionScore}/{passage.questions.length}
                      </span>{' '}
                      <span className="text-ink-3">
                        (%{Math.round((comprehensionScore / passage.questions.length) * 100)})
                      </span>
                    </p>
                  ) : (
                    <span className="text-[12px] text-ink-3">
                      Tüm soruları yanıtlayınca gönderebilirsin.
                    </span>
                  )}

                  {!comprehensionSubmitted ? (
                    <button
                      onClick={submitComprehensionQuiz}
                      disabled={Object.keys(comprehensionAnswers).length < passage.questions.length}
                      className="w-full rounded-xl bg-accent px-5 py-2.5 text-[13px] font-medium text-white
                        transition-colors duration-150 hover:bg-accent-700
                        disabled:cursor-not-allowed disabled:bg-paper-3 disabled:text-ink-3
                        cursor-pointer sm:w-auto"
                    >
                      Testi gönder
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setComprehensionAnswers({});
                        setComprehensionSubmitted(false);
                        setComprehensionScore(0);
                      }}
                      className="w-full rounded-xl border border-hairline px-5 py-2.5 text-[13px] font-medium
                        text-ink-2 transition-colors duration-150 hover:bg-paper-3 hover:text-ink
                        cursor-pointer sm:w-auto"
                    >
                      Yeniden çöz
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Vocabulary Exercises Tab */}
            {activeTab === 'exercises' && (
              <motion.div
                key="exercises"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="bg-paper-2 border border-hairline p-6 sm:p-10  space-y-6 rounded-2xl"
              >
                <div className="flex items-baseline justify-between gap-3 border-b border-hairline pb-4">
                  <h2 className="text-[15px] font-semibold text-ink">Kelime alıştırmaları</h2>
                  <span className="text-[12px] text-ink-3">
                    <span className="timecode text-ink">{passage.exercises.length}</span> alıştırma
                  </span>
                </div>

                <div className="divide-y divide-hairline">
                  {passage.exercises.map((ex, exIndex) => {
                    const selected = exerciseAnswers[ex.id];
                    const isCorrect = ex.options.find(o => o.startsWith(selected))?.startsWith(ex.answer);

                    return (
                      <div key={ex.id} className="space-y-3">
                        <div className="flex items-baseline gap-2.5">
                          <span className="timecode shrink-0 text-ink-3">{exIndex + 1}</span>
                          <h3 className="text-[15px] font-medium leading-relaxed text-ink">{ex.question}</h3>
                        </div>

                        <div className="space-y-2 pl-6">
                          {ex.options.map(option => {
                            const optionLetter = option.trim().charAt(0);
                            const isOptionSelected = selected === optionLetter;
                            const isOptionCorrect = option.startsWith(ex.answer);

                            let buttonStyle = 'border-hairline text-ink hover:bg-paper-3';

                            if (isOptionSelected && !exercisesSubmitted) {
                              // Secili sik ACCENT: turuncu/kehribar bu depoda
                              // eylem rengi degil (bkz. frontend-design skill'i).
                              buttonStyle = 'border-accent bg-accent-soft text-ink';
                            } else if (exercisesSubmitted) {
                              if (isOptionCorrect) {
                                buttonStyle = 'border-ok bg-ok-soft text-ok';
                              } else if (isOptionSelected) {
                                buttonStyle = 'border-danger bg-danger-soft text-danger';
                              } else {
                                buttonStyle = 'border-hairline text-ink-3';
                              }
                            }

                            return (
                              <button
                                key={option}
                                disabled={exercisesSubmitted}
                                onClick={() => selectExerciseOption(ex.id, optionLetter)}
                                className={`flex w-full items-center justify-between gap-3 rounded-xl border
                                  px-4 py-3 text-left text-[13px] transition-colors duration-150
                                  disabled:cursor-default cursor-pointer ${buttonStyle}`}
                              >
                                <span>{option}</span>
                                {exercisesSubmitted && isOptionCorrect && (
                                  <Check className="h-4 w-4 text-ok shrink-0 ml-2" />
                                )}
                                {exercisesSubmitted && isOptionSelected && !isOptionCorrect && (
                                  <X className="h-4 w-4 text-danger shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Score Footer */}
                <div className="border-t border-hairline pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {exercisesSubmitted ? (
                    <p className="text-[13px] text-ink-2">
                      Doğru yanıt{' '}
                      <span className="timecode font-semibold text-ink">
                        {exercisesScore}/{passage.exercises.length}
                      </span>{' '}
                      <span className="text-ink-3">
                        (%{Math.round((exercisesScore / passage.exercises.length) * 100)})
                      </span>
                    </p>
                  ) : (
                    <span className="text-[12px] text-ink-3">
                      Tüm alıştırmaları yanıtlayınca gönderebilirsin.
                    </span>
                  )}

                  {!exercisesSubmitted ? (
                    <button
                      onClick={submitExercisesQuiz}
                      disabled={Object.keys(exerciseAnswers).length < passage.exercises.length}
                      className="w-full rounded-xl bg-accent px-5 py-2.5 text-[13px] font-medium text-white
                        transition-colors duration-150 hover:bg-accent-700
                        disabled:cursor-not-allowed disabled:bg-paper-3 disabled:text-ink-3
                        cursor-pointer sm:w-auto"
                    >
                      Alıştırmayı gönder
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setExerciseAnswers({});
                        setExercisesSubmitted(false);
                        setExercisesScore(0);
                      }}
                      className="w-full rounded-xl border border-hairline px-5 py-2.5 text-[13px] font-medium
                        text-ink-2 transition-colors duration-150 hover:bg-paper-3 hover:text-ink
                        cursor-pointer sm:w-auto"
                    >
                      Yeniden çöz
                    </button>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right Column: WORD DETAILS / QUICK INFO PANEL */}
        <div className="space-y-6 sticky top-6">

          {/* Word Dictionary Peek Card */}
          <div className="bg-paper-2 border border-hairline p-6  rounded-xl">
            <h2 className="mb-4 border-b border-hairline pb-3 text-[15px] font-semibold text-ink">
              Sözlük
            </h2>

            {activeWordDetail ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="flex items-center gap-1.5 text-[18px] font-semibold tracking-tight text-ink">
                      {activeWordDetail.term}
                      <button
                        type="button"
                        onClick={() => speakWord(activeWordDetail.term)}
                        title="Telaffuzu dinle"
                        aria-label="Telaffuzu dinle"
                        className="rounded p-1 text-ink-3 transition-colors hover:text-ink cursor-pointer"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </h3>
                    <span className="text-[12px] text-ink-3">
                      {activeWordDetail.partOfSpeech === 'n' ? 'isim' :
                       activeWordDetail.partOfSpeech === 'v' ? 'fiil' :
                       activeWordDetail.partOfSpeech === 'adj' ? 'sıfat' :
                       activeWordDetail.partOfSpeech === 'adv' ? 'zarf' : 'phrasal verb'}
                    </span>
                  </div>
                </div>

                {/* KUTULAR KALKTI. Anlam, tanim ve ornek her biri kendi
                    cerceveli kutusundaydi ve ustlerinde BUYUK HARF birer
                    etiket vardi ("TURKCE ANLAMI", "TANIMLAMA (DEFINITION)").
                    Uc satirlik icerik icin uc kutu; hiyerarsi boyut ve
                    renkle zaten kuruluyor. */}
                <div className="space-y-3">
                  <p className="text-[17px] text-brand">{activeWordDetail.meaning}</p>

                  {activeWordDetail.definition && (
                    <p className="text-[13px] leading-relaxed text-ink-2">
                      {activeWordDetail.definition}
                    </p>
                  )}

                  {activeWordDetail.exampleSentence && (
                    <p className="border-l-2 border-hairline-2 pl-3 text-[13px] italic leading-relaxed text-ink-3">
                      {activeWordDetail.exampleSentence}
                    </p>
                  )}
                </div>

                {/* Status Toggle Box inside panel */}
                <div className="flex gap-0.5 rounded-lg bg-paper-3 p-0.5">
                  {([
                    ['studied', 'Çalışıyorum'],
                    ['learned', 'Öğrendim'],
                  ] as [string, string][]).map(([id, label]) => {
                    const isCurrent = (progress.wordStatus[activeWordDetail.term] || 'unstudied') === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onWordStatusChange(activeWordDetail.term, id as any)}
                        aria-pressed={isCurrent}
                        className={`flex-1 rounded px-2 py-1.5 text-[12px] transition-colors cursor-pointer ${
                          isCurrent
                            ? id === 'studied'
                              ? 'bg-marker-bg font-medium text-marker-ink ring-1 ring-marker'
                              : 'bg-ok-soft font-medium text-ok ring-1 ring-ok-line'
                            : 'text-ink-3 hover:text-ink'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Paylaşılan FSRS kelime bankasına ekle (katmanlı'nın Kelime Kartları ekranıyla ortak) */}
                <button
                  onClick={() => handleAddWordToBank(activeWordDetail)}
                  disabled={bankedTerms.has(activeWordDetail.term.toLowerCase()) || addingTerm === activeWordDetail.term}
                  className={`flex w-full items-center justify-center gap-1.5 rounded-xl border py-2.5
                    text-[12px] font-medium transition-colors duration-150
                    disabled:cursor-default cursor-pointer ${
                    bankedTerms.has(activeWordDetail.term.toLowerCase())
                      ? 'border-ok-line bg-ok-soft text-ok'
                      : 'border-hairline text-ink-2 hover:bg-paper-3 hover:text-ink'
                  }`}
                  title="Bu kelimeyi katmanlı'daki FSRS tekrar destesine ekle"
                >
                  {bankedTerms.has(activeWordDetail.term.toLowerCase()) ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Tekrar bankasında
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="h-3.5 w-3.5" />
                      {addingTerm === activeWordDetail.term ? 'Ekleniyor…' : 'Tekrar bankasına ekle'}
                    </>
                  )}
                </button>
              </div>
            ) : (
              <p className="text-[13px] leading-relaxed text-ink-2">
                Metindeki altı çizili bir kelimeye dokun; karşılığı burada açılır.
              </p>
            )}
          </div>

          {/* Quick Stats of Current Passage */}
          <div className="bg-paper-2 border border-hairline p-6 space-y-4 rounded-xl">
            <h2 className="text-[15px] font-semibold text-ink">Bu parçadaki ilerlemen</h2>

            <dl className="space-y-2.5 text-[13px]">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-2">Okuma durumu</dt>
                <dd className={progress.completedPassages.includes(passage.id) ? 'text-ok' : 'text-ink-3'}>
                  {progress.completedPassages.includes(passage.id) ? 'tamamlandı' : 'sürüyor'}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-2">Öğrenilen kelime</dt>
                <dd className="timecode text-ink">
                  {passage.vocabulary.filter(v => progress.wordStatus[v.term] === 'learned').length}/{passage.vocabulary.length}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-2">Test sonucu</dt>
                <dd className="timecode text-ink">
                  {/* Onceki metin "HAK YOK" idi; test cozulmemis olmasi bir
                      hak kaybi degil, henuz olmayan bir veri. */}
                  {progress.scores[passage.id]
                    ? `${progress.scores[passage.id].score}/${progress.scores[passage.id].total}`
                    : '—'}
                </dd>
              </div>
            </dl>
          </div>

        </div>

      </div>

    </div>
  );
}
