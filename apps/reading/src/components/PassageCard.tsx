import { useState, useEffect, useCallback, useRef } from 'react';
import { Passage, UserProgress, GradedQuestionResult, VocabularyWord } from '../types';
import { ChevronLeft, Star, Volume2, CheckCircle2, AlertCircle, Bookmark, ArrowRight, HelpCircle, Award, Check, X, BrainCircuit } from 'lucide-react';
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
        if (status === 'studied') underlineStyle = 'border-b-2 border-amber-500';
        if (status === 'learned') underlineStyle = 'border-b-2 border-emerald-600';

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

      {/* Passage Top Nav & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-hairline/40 p-4 gap-4 rounded-xl">
        <button
          onClick={onBackToList}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-ink hover:bg-paper transition-colors py-2 px-4 border border-hairline/40 cursor-pointer uppercase tracking-wider font-mono rounded-lg"
        >
          <ChevronLeft className="h-4 w-4" /> Kütüphaneye Dön
        </button>

        <div className="flex flex-wrap gap-2.5 items-center font-mono">
          <span className="inline-flex items-center gap-1 border border-hairline/40 px-2.5 py-1 text-xs font-bold text-ink rounded-lg">
            CEFR: {passage.cefr}
          </span>
          <span className="inline-flex items-center gap-1 border border-hairline/40 bg-paper px-2.5 py-1 text-xs font-bold text-ink/70 uppercase rounded-lg">
            Tema: {passage.theme}
          </span>
          <button
            onClick={() => onToggleFavorite(passage.id)}
            className="inline-flex items-center gap-1 text-xs font-bold text-ink hover:bg-paper transition-colors p-2 border border-hairline/40 cursor-pointer rounded-lg"
          >
            <Star className={`h-4.5 w-4.5 ${isFavorite ? 'text-amber-500 fill-amber-400' : 'text-ink/30'}`} />
            {isFavorite ? 'FAVORİLERİMDE' : 'FAVORİLERE EKLE'}
          </button>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="bg-white border border-hairline/40 p-8 shadow-xs rounded-xl">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink tracking-tight mb-2.5">
          {passage.title}
        </h1>
        <p className="text-xs text-ink-3 font-display">
          Okurken kalın ve altı çizili kelimelerin üzerine tıklayarak Türkçe karşılıklarını ve açıklamalarını görebilirsiniz.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border border-hairline/40 bg-paper p-1 gap-1 rounded-lg">
        {[
          { id: 'text', label: '📖 Okuma Metni & Sözlük' },
          { id: 'quiz', label: '📝 Okuduğunu Anlama Testi' },
          { id: 'exercises', label: '🧠 Kelime Alıştırmaları' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 text-center text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-accent text-white font-bold'
                : 'text-ink/60 hover:text-ink hover:bg-white/50'
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-hairline/40 p-4 sm:p-10 shadow-xs space-y-8 rounded-2xl"
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
                          ? 'bg-amber-100/70 -mx-2 px-2 py-1 transition-colors rounded-lg'
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
                <div className="flex gap-3 bg-paper p-5 text-xs text-ink/80 border border-hairline/30 rounded-xl">
                  <AlertCircle className="h-5 w-5 shrink-0 text-accent" />
                  <div className="font-display leading-relaxed">
                    <span className="font-bold">Öğrenme İpucu:</span> Metni dikkatlice okuduktan sonra kelimelerin durumlarını aşağıdaki tablodan veya kelimelere tıklayarak güncelleyebilirsiniz. Ardından sağdaki testlere geçin.
                  </div>
                </div>

                {/* Inline Vocabulary Mastery Table */}
                <div className="border-t border-hairline/20 pt-8">
                  <h3 className="text-lg font-display font-bold text-ink mb-6">Parçanın Anahtar Kelimeleri ({passage.vocabulary.length} Kelime)</h3>
                  <div className="divide-y divide-hairline/20">
                    {passage.vocabulary.map(word => {
                      const status = progress.wordStatus[word.term] || 'unstudied';
                      return (
                        <div key={word.term} className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-base text-ink">{word.term}</span>
                              <span className="text-[10px] bg-paper border border-hairline/30 text-ink/60 px-1.5 py-0.5 font-bold uppercase font-mono rounded-lg">{word.partOfSpeech}</span>
                              <button onClick={() => speakWord(word.term)} className="p-1 rounded-xs text-ink-3 hover:text-accent hover:bg-paper transition-colors cursor-pointer">
                                <Volume2 className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-xs text-ink/60 font-display">Anlamı: <span className="text-accent font-bold font-sans">{word.meaning}</span></p>
                          </div>

                          {/* Action Buttons to Master Word */}
                          <div className="flex flex-wrap gap-1">
                            {[
                              { id: 'unstudied', label: 'ÇALIŞMADIM', color: 'text-ink/60 bg-white border-hairline/40' },
                              { id: 'studied', label: 'ÇALIŞTIM', color: 'text-amber-800 bg-amber-50 border-amber-300' },
                              { id: 'learned', label: 'ÖĞRENDİM', color: 'text-emerald-800 bg-emerald-50 border-emerald-300' }
                            ].map(btn => (
                              <button
                                key={btn.id}
                                onClick={() => onWordStatusChange(word.term, btn.id as any)}
                                className={`px-3 py-1.5 border text-[10px] font-bold tracking-wider transition-all cursor-pointer rounded-lg ${
                                  status === btn.id
                                    ? btn.id === 'unstudied' ? 'bg-ink text-white border-ink' :
                                      btn.id === 'studied' ? 'bg-amber-500 text-white border-amber-500 font-black' :
                                      'bg-emerald-600 text-white border-emerald-600 font-black'
                                    : 'bg-white hover:bg-paper text-ink-3'
                                  }`}
                              >
                                {btn.label}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-hairline/40 p-6 sm:p-10 shadow-xs space-y-6 rounded-2xl"
              >
                <div className="flex justify-between items-center border-b border-hairline/20 pb-4">
                  <h3 className="text-lg font-display font-bold text-ink">Okuduğunu Anlama Testi</h3>
                  <span className="text-xs font-bold text-ink-3 font-mono">{passage.questions.length} SORU</span>
                </div>

                <div className="space-y-8">
                  {passage.questions.map((q, qIndex) => {
                    const selected = comprehensionAnswers[q.id];
                    const isCorrect = q.options.find(o => o.startsWith(selected))?.startsWith(q.answer);

                    return (
                      <div key={q.id} className="space-y-4 p-6 bg-paper/30 border border-hairline/30 rounded-xl">
                        <div className="flex gap-2.5 items-start">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-accent text-white text-xs font-bold font-mono">
                            {qIndex + 1}
                          </span>
                          <h4 className="text-base font-display font-bold text-ink leading-relaxed">{q.question}</h4>
                        </div>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 gap-2.5 pl-8">
                          {q.options.map(option => {
                            const optionLetter = option.trim().charAt(0); // A, B, C, D
                            const isOptionSelected = selected === optionLetter;
                            const isOptionCorrect = option.startsWith(q.answer);

                            let buttonStyle = 'bg-white border-hairline/30 text-ink hover:bg-paper';

                            if (isOptionSelected && !comprehensionSubmitted) {
                              buttonStyle = 'bg-accent text-white border-accent font-bold';
                            } else if (comprehensionSubmitted) {
                              if (isOptionCorrect) {
                                buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                              } else if (isOptionSelected) {
                                buttonStyle = 'bg-rose-50 border-rose-500 text-rose-950';
                              } else {
                                buttonStyle = 'bg-white border-hairline/20 text-ink/30 opacity-60';
                              }
                            }

                            return (
                              <button
                                key={option}
                                disabled={comprehensionSubmitted}
                                onClick={() => selectComprehensionOption(q.id, optionLetter)}
                                className={`w-full text-left p-3.5 border text-xs sm:text-sm font-sans flex justify-between items-center transition-all cursor-pointer rounded-lg ${buttonStyle}`}
                              >
                                <span>{option}</span>
                                {comprehensionSubmitted && isOptionCorrect && (
                                  <Check className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                                )}
                                {comprehensionSubmitted && isOptionSelected && !isCorrect && isOptionCorrect === false && (
                                  <X className="h-4 w-4 text-rose-500 shrink-0 ml-2" />
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
                <div className="border-t border-hairline/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {comprehensionSubmitted ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center bg-paper border border-hairline/30 text-ink rounded-lg">
                        <Award className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[10px] text-ink-3 font-bold tracking-wider uppercase font-mono">TEST SKORU</p>
                        <p className="text-sm font-bold text-ink">
                          Doğruluk Derecesi:{' '}
                          <span className="text-accent font-mono text-base font-extrabold">
                            {comprehensionScore} / {passage.questions.length}
                          </span>{' '}
                          ({Math.round((comprehensionScore / passage.questions.length) * 100)}%)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-ink-3 font-display">
                      Lütfen tüm soruları yanıtlayıp ardından testi gönderin.
                    </span>
                  )}

                  {!comprehensionSubmitted ? (
                    <button
                      onClick={submitComprehensionQuiz}
                      disabled={Object.keys(comprehensionAnswers).length < passage.questions.length}
                      className="px-6 py-2.5 bg-accent hover:bg-white hover:text-ink border border-accent text-white font-bold text-xs sm:text-sm disabled:bg-paper disabled:text-ink/30 disabled:border-hairline/20 transition-all uppercase tracking-wider cursor-pointer w-full sm:w-auto rounded-lg"
                    >
                      Testi Gönder
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setComprehensionAnswers({});
                        setComprehensionSubmitted(false);
                        setComprehensionScore(0);
                      }}
                      className="px-6 py-2.5 border border-hairline/40 bg-white hover:bg-paper text-ink font-bold text-xs sm:text-sm transition-all uppercase tracking-wider cursor-pointer w-full sm:w-auto rounded-lg"
                    >
                      Yeniden Çöz
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Vocabulary Exercises Tab */}
            {activeTab === 'exercises' && (
              <motion.div
                key="exercises"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-hairline/40 p-6 sm:p-10 shadow-xs space-y-6 rounded-2xl"
              >
                <div className="flex justify-between items-center border-b border-hairline/20 pb-4">
                  <h3 className="text-lg font-display font-bold text-ink">Kelime Alıştırmaları</h3>
                  <span className="text-xs font-bold text-ink-3 font-mono">{passage.exercises.length} ALIŞTIRMA</span>
                </div>

                <div className="space-y-8">
                  {passage.exercises.map((ex, exIndex) => {
                    const selected = exerciseAnswers[ex.id];
                    const isCorrect = ex.options.find(o => o.startsWith(selected))?.startsWith(ex.answer);

                    return (
                      <div key={ex.id} className="space-y-4 p-6 bg-paper/30 border border-hairline/30 rounded-xl">
                        <div className="flex gap-2.5 items-start">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-amber-500 text-white text-xs font-bold font-mono">
                            {exIndex + 1}
                          </span>
                          <h4 className="text-base font-display font-bold text-ink leading-relaxed">{ex.question}</h4>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 gap-2.5 pl-8">
                          {ex.options.map(option => {
                            const optionLetter = option.trim().charAt(0);
                            const isOptionSelected = selected === optionLetter;
                            const isOptionCorrect = option.startsWith(ex.answer);

                            let buttonStyle = 'bg-white border-hairline/30 text-ink hover:bg-paper';

                            if (isOptionSelected && !exercisesSubmitted) {
                              buttonStyle = 'bg-amber-500 text-white border-amber-500 font-bold';
                            } else if (exercisesSubmitted) {
                              if (isOptionCorrect) {
                                buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                              } else if (isOptionSelected) {
                                buttonStyle = 'bg-rose-50 border-rose-500 text-rose-950';
                              } else {
                                buttonStyle = 'bg-white border-hairline/20 text-ink/30 opacity-60';
                              }
                            }

                            return (
                              <button
                                key={option}
                                disabled={exercisesSubmitted}
                                onClick={() => selectExerciseOption(ex.id, optionLetter)}
                                className={`w-full text-left p-3.5 border text-xs sm:text-sm font-sans flex justify-between items-center transition-all cursor-pointer rounded-lg ${buttonStyle}`}
                              >
                                <span>{option}</span>
                                {exercisesSubmitted && isOptionCorrect && (
                                  <Check className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                                )}
                                {exercisesSubmitted && isOptionSelected && !isCorrect && isOptionCorrect === false && (
                                  <X className="h-4 w-4 text-rose-500 shrink-0 ml-2" />
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
                <div className="border-t border-hairline/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {exercisesSubmitted ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center bg-paper border border-hairline/30 text-ink rounded-lg">
                        <Award className="h-6 w-6 text-amber-700" />
                      </div>
                      <div>
                        <p className="text-[10px] text-ink-3 font-bold tracking-wider uppercase font-mono">ALIŞTIRMA SKORU</p>
                        <p className="text-sm font-bold text-ink">
                          Doğruluk Derecesi:{' '}
                          <span className="text-amber-700 font-mono text-base font-extrabold">
                            {exercisesScore} / {passage.exercises.length}
                          </span>{' '}
                          ({Math.round((exercisesScore / passage.exercises.length) * 100)}%)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-ink-3 font-display">
                      Lütfen tüm alıştırma sorularını yanıtlayıp testi gönderin.
                    </span>
                  )}

                  {!exercisesSubmitted ? (
                    <button
                      onClick={submitExercisesQuiz}
                      disabled={Object.keys(exerciseAnswers).length < passage.exercises.length}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm disabled:bg-paper disabled:text-ink/30 disabled:border-hairline/20 transition-all uppercase tracking-wider cursor-pointer w-full sm:w-auto rounded-lg"
                    >
                      Alıştırmayı Gönder
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setExerciseAnswers({});
                        setExercisesSubmitted(false);
                        setExercisesScore(0);
                      }}
                      className="px-6 py-2.5 border border-hairline/40 bg-white hover:bg-paper text-ink font-bold text-xs sm:text-sm transition-all uppercase tracking-wider cursor-pointer w-full sm:w-auto rounded-lg"
                    >
                      Yeniden Çöz
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
          <div className="bg-white border border-hairline/40 p-6 shadow-xs rounded-xl">
            <h3 className="text-base font-display font-bold text-ink mb-4 pb-2 border-b border-hairline/20 flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-accent" /> İnteraktif Sözlük
            </h3>

            {activeWordDetail ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xl font-display font-extrabold text-ink flex items-center gap-2">
                      {activeWordDetail.term}
                      <button
                        onClick={() => speakWord(activeWordDetail.term)}
                        className="p-1 rounded-xs text-ink-3 hover:text-accent hover:bg-paper transition-colors cursor-pointer"
                        title="Telaffuz Dinle"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </h4>
                    <span className="inline-block text-[10px] font-bold font-mono text-ink/70 bg-paper border border-hairline/30 px-2 py-0.5 rounded-xs uppercase">
                      {activeWordDetail.partOfSpeech === 'n' ? 'Noun (İsim)' :
                       activeWordDetail.partOfSpeech === 'v' ? 'Verb (Fiil)' :
                       activeWordDetail.partOfSpeech === 'adj' ? 'Adjective (Sıfat)' :
                       activeWordDetail.partOfSpeech === 'adv' ? 'Adverb (Zarf)' : 'Phrasal Verb (Deyim Fiil)'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-ink">
                  <div className="bg-paper p-4 border border-hairline/20 rounded-xl">
                    <p className="text-[10px] text-ink-3 font-bold tracking-wider uppercase mb-1">Türkçe Anlamı</p>
                    <p className="font-bold text-accent text-base">{activeWordDetail.meaning}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-ink-3 font-bold tracking-wider uppercase">Tanımlama (Definition)</p>
                    <p className="text-xs text-ink/70 leading-relaxed font-display">{activeWordDetail.definition || "İngilizce tanımı mevcut."}</p>
                  </div>

                  {activeWordDetail.exampleSentence && (
                    <div className="space-y-1 pt-3 border-t border-hairline/20">
                      <p className="text-[10px] text-ink-3 font-bold tracking-wider uppercase">Örnek Cümle (Example)</p>
                      <p className="text-xs text-ink/80 bg-paper p-3 border-l-2 border-accent font-mono leading-relaxed">
                        "{activeWordDetail.exampleSentence}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Toggle Box inside panel */}
                <div className="pt-4 border-t border-hairline/20 space-y-2">
                  <p className="text-xs font-display font-bold text-ink/70">Bu kelimenin çalışma durumu:</p>
                  <div className="flex gap-1">
                    {[
                      { id: 'studied', label: 'ÇALIŞTIM', color: 'bg-amber-500 text-white border-amber-600' },
                      { id: 'learned', label: 'ÖĞRENDİM', color: 'bg-emerald-600 text-white border-emerald-700' }
                    ].map(btn => {
                      const isCurrent = (progress.wordStatus[activeWordDetail.term] || 'unstudied') === btn.id;
                      return (
                        <button
                          key={btn.id}
                          onClick={() => onWordStatusChange(activeWordDetail.term, btn.id as any)}
                          className={`flex-1 py-2 border text-[10px] font-bold tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer rounded-lg ${
                            isCurrent
                              ? btn.id === 'studied' ? 'bg-amber-500 text-white border-amber-500 font-bold' : 'bg-emerald-600 text-white border-emerald-600 font-bold'
                              : 'bg-white hover:bg-paper text-ink-3 border-hairline/30'
                          }`}
                        >
                          {isCurrent && <Check className="h-3 w-3 shrink-0" />}
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Paylaşılan FSRS kelime bankasına ekle (katmanlı'nın Kelime Kartları ekranıyla ortak) */}
                <button
                  onClick={() => handleAddWordToBank(activeWordDetail)}
                  disabled={bankedTerms.has(activeWordDetail.term.toLowerCase()) || addingTerm === activeWordDetail.term}
                  className={`w-full flex items-center justify-center gap-1.5 py-2.5 border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer disabled:cursor-default rounded-lg ${
                    bankedTerms.has(activeWordDetail.term.toLowerCase())
                      ? 'bg-paper text-emerald-700 border-emerald-200'
                      : 'bg-white text-ink/60 border-hairline/30 hover:border-accent hover:text-accent'
                  }`}
                  title="Bu kelimeyi katmanlı'daki FSRS tekrar destesine ekle"
                >
                  {bankedTerms.has(activeWordDetail.term.toLowerCase()) ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Tekrar Bankasında
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="h-3.5 w-3.5" />
                      {addingTerm === activeWordDetail.term ? 'Ekleniyor...' : 'Tekrar Bankasına Ekle'}
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-paper border border-hairline/20 rounded-xl">
                <HelpCircle className="h-10 w-10 text-ink/20 mb-2" />
                <p className="text-xs text-ink font-bold">Kelimelere Tıklayın</p>
                <p className="text-[10px] text-ink-3 mt-1 max-w-[200px] font-display leading-relaxed">
                  Metin içindeki kalın veya altı çizili kelimelerin üzerine tıklayarak anlamlarına hızlıca göz atabilirsiniz.
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats of Current Passage */}
          <div className="bg-white border border-hairline/40 p-6 space-y-4 rounded-xl">
            <h4 className="text-xs font-bold tracking-wider uppercase text-ink">PARÇA ÇALIŞMA İLERLEMESİ</h4>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center text-ink/70 border-b border-hairline/10 pb-2">
                <span className="font-display">Okuma Durumu</span>
                <span className={`font-bold uppercase text-[10px] tracking-wider ${progress.completedPassages.includes(passage.id) ? 'text-emerald-700' : 'text-ink-3'}`}>
                  {progress.completedPassages.includes(passage.id) ? '🏆 TAMAMLANDI' : '✍️ KALAN'}
                </span>
              </div>

              <div className="flex justify-between items-center text-ink/70 border-b border-hairline/10 pb-2">
                <span className="font-display">Kelime Öğrenme Oranı</span>
                <span className="font-bold text-ink">
                  {passage.vocabulary.filter(v => progress.wordStatus[v.term] === 'learned').length} / {passage.vocabulary.length}
                </span>
              </div>

              <div className="flex justify-between items-center text-ink/70">
                <span className="font-display">Quiz Başarı Derecesi</span>
                <span className="font-bold text-ink font-mono">
                  {progress.scores[passage.id] ? `${progress.scores[passage.id].score} / ${progress.scores[passage.id].total}` : 'HAK YOK'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
