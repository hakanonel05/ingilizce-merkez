import { useState, useEffect } from 'react';
import { Passage, UserProgress } from '../types';
import { ChevronLeft, Star, Volume2, CheckCircle2, AlertCircle, Bookmark, ArrowRight, HelpCircle, Award, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PassageCardProps {
  passage: Passage;
  progress: UserProgress;
  onBackToList: () => void;
  onToggleFavorite: (id: number) => void;
  onWordStatusChange: (term: string, status: 'unstudied' | 'studied' | 'learned') => void;
  onSaveTestResult: (passageId: number, score: number, total: number) => void;
}

export default function PassageCard({
  passage,
  progress,
  onBackToList,
  onToggleFavorite,
  onWordStatusChange,
  onSaveTestResult
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

  // Reset states when passage changes
  useEffect(() => {
    setActiveTab('text');
    setSelectedWord(null);
    setComprehensionAnswers({});
    setComprehensionSubmitted(false);
    setComprehensionScore(0);
    setExerciseAnswers({});
    setExercisesSubmitted(false);
    setExercisesScore(0);
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
        let underlineStyle = 'border-b border-dashed border-editorial-text/60';
        if (status === 'studied') underlineStyle = 'border-b-2 border-amber-500';
        if (status === 'learned') underlineStyle = 'border-b-2 border-emerald-600';

        return (
          <span
            key={index}
            onClick={() => handleWordClick(chunk)}
            className={`font-serif font-bold cursor-pointer px-1 transition-all duration-150 ${underlineStyle} ${
              isSelected 
                ? 'bg-editorial-accent text-white border-none' 
                : 'text-editorial-text hover:bg-editorial-bg'
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
    passage.questions.forEach(q => {
      const selected = comprehensionAnswers[q.id];
      if (selected && q.options.find(o => o.startsWith(selected))?.startsWith(q.answer)) {
        score++;
      } else {
        // Double check simple exact match
        const option = q.options.find(o => o.startsWith(selected));
        if (option && option.trim().startsWith(q.answer)) {
          score++;
        }
      }
    });

    setComprehensionScore(score);
    setComprehensionSubmitted(true);
    
    // Save to overall scores
    onSaveTestResult(passage.id, score, passage.questions.length);
  };

  // Submit vocabulary exercises
  const submitExercisesQuiz = () => {
    let score = 0;
    passage.exercises.forEach(ex => {
      const selected = exerciseAnswers[ex.id];
      if (selected && ex.options.find(o => o.startsWith(selected))?.startsWith(ex.answer)) {
        score++;
      } else {
        const option = ex.options.find(o => o.startsWith(selected));
        if (option && option.trim().startsWith(ex.answer)) {
          score++;
        }
      }
    });

    setExercisesScore(score);
    setExercisesSubmitted(true);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-editorial-border/40 p-4 gap-4">
        <button
          onClick={onBackToList}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-editorial-text hover:bg-editorial-bg transition-colors py-2 px-4 border border-editorial-border/40 cursor-pointer uppercase tracking-wider font-mono"
        >
          <ChevronLeft className="h-4 w-4" /> Kütüphaneye Dön
        </button>

        <div className="flex flex-wrap gap-2.5 items-center font-mono">
          <span className="inline-flex items-center gap-1 border border-editorial-border/40 px-2.5 py-1 text-xs font-bold text-editorial-text">
            CEFR: {passage.cefr}
          </span>
          <span className="inline-flex items-center gap-1 border border-editorial-border/40 bg-editorial-bg px-2.5 py-1 text-xs font-bold text-editorial-text/70 uppercase">
            Tema: {passage.theme}
          </span>
          <button
            onClick={() => onToggleFavorite(passage.id)}
            className="inline-flex items-center gap-1 text-xs font-bold text-editorial-text hover:bg-editorial-bg transition-colors p-2 border border-editorial-border/40 cursor-pointer"
          >
            <Star className={`h-4.5 w-4.5 ${isFavorite ? 'text-amber-500 fill-amber-400' : 'text-editorial-text/30'}`} />
            {isFavorite ? 'FAVORİLERİMDE' : 'FAVORİLERE EKLE'}
          </button>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="bg-white border border-editorial-border/40 p-8 shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-editorial-text tracking-tight mb-2.5">
          {passage.title}
        </h1>
        <p className="text-xs text-editorial-text/50 font-serif italic">
          Okurken kalın ve altı çizili kelimelerin üzerine tıklayarak Türkçe karşılıklarını ve açıklamalarını görebilirsiniz.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border border-editorial-border/40 bg-editorial-bg p-1 gap-1">
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
                ? 'bg-editorial-accent text-white font-bold'
                : 'text-editorial-text/60 hover:text-editorial-text hover:bg-white/50'
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
                className="bg-white border border-editorial-border/40 p-6 sm:p-10 shadow-xs space-y-8"
              >
                {/* Paragraphs Panel */}
                <div className="space-y-6 leading-relaxed text-[15px] sm:text-base text-editorial-text/90 font-serif tracking-wide">
                  {passage.paragraphs.map((p, i) => (
                    <p key={i} className="text-justify indent-6">
                      {renderParagraphWithHighlights(p)}
                    </p>
                  ))}
                </div>

                {/* Subtitle / Note */}
                <div className="flex gap-3 bg-editorial-bg p-5 text-xs text-editorial-text/80 border border-editorial-border/30">
                  <AlertCircle className="h-5 w-5 shrink-0 text-editorial-accent" />
                  <div className="font-serif leading-relaxed">
                    <span className="font-bold">Öğrenme İpucu:</span> Metni dikkatlice okuduktan sonra kelimelerin durumlarını aşağıdaki tablodan veya kelimelere tıklayarak güncelleyebilirsiniz. Ardından sağdaki testlere geçin.
                  </div>
                </div>

                {/* Inline Vocabulary Mastery Table */}
                <div className="border-t border-editorial-border/20 pt-8">
                  <h3 className="text-lg font-serif font-bold text-editorial-text mb-6">Parçanın Anahtar Kelimeleri ({passage.vocabulary.length} Kelime)</h3>
                  <div className="divide-y divide-editorial-border/20">
                    {passage.vocabulary.map(word => {
                      const status = progress.wordStatus[word.term] || 'unstudied';
                      return (
                        <div key={word.term} className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-base text-editorial-text">{word.term}</span>
                              <span className="text-[10px] bg-editorial-bg border border-editorial-border/30 text-editorial-text/60 px-1.5 py-0.5 font-bold uppercase font-mono">{word.partOfSpeech}</span>
                              <button onClick={() => speakWord(word.term)} className="p-1 rounded-xs text-editorial-text/40 hover:text-editorial-accent hover:bg-editorial-bg transition-colors cursor-pointer">
                                <Volume2 className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-xs text-editorial-text/60 font-serif">Anlamı: <span className="text-editorial-accent font-bold font-sans">{word.meaning}</span></p>
                          </div>

                          {/* Action Buttons to Master Word */}
                          <div className="flex flex-wrap gap-1">
                            {[
                              { id: 'unstudied', label: 'ÇALIŞMADIM', color: 'text-editorial-text/60 bg-white border-editorial-border/40' },
                              { id: 'studied', label: 'ÇALIŞTIM', color: 'text-amber-800 bg-amber-50 border-amber-300' },
                              { id: 'learned', label: 'ÖĞRENDİM', color: 'text-emerald-800 bg-emerald-50 border-emerald-300' }
                            ].map(btn => (
                              <button
                                key={btn.id}
                                onClick={() => onWordStatusChange(word.term, btn.id as any)}
                                className={`px-3 py-1.5 border text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                                  status === btn.id
                                    ? btn.id === 'unstudied' ? 'bg-editorial-text text-white border-editorial-text' :
                                      btn.id === 'studied' ? 'bg-amber-500 text-white border-amber-500 font-black' :
                                      'bg-emerald-600 text-white border-emerald-600 font-black'
                                    : 'bg-white hover:bg-editorial-bg text-editorial-text/50'
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
                className="bg-white border border-editorial-border/40 p-6 sm:p-10 shadow-xs space-y-6"
              >
                <div className="flex justify-between items-center border-b border-editorial-border/20 pb-4">
                  <h3 className="text-lg font-serif font-bold text-editorial-text">Okuduğunu Anlama Testi</h3>
                  <span className="text-xs font-bold text-editorial-text/40 font-mono">{passage.questions.length} SORU</span>
                </div>

                <div className="space-y-8">
                  {passage.questions.map((q, qIndex) => {
                    const selected = comprehensionAnswers[q.id];
                    const isCorrect = q.options.find(o => o.startsWith(selected))?.startsWith(q.answer);

                    return (
                      <div key={q.id} className="space-y-4 p-6 bg-editorial-bg/30 border border-editorial-border/30">
                        <div className="flex gap-2.5 items-start">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-editorial-accent text-white text-xs font-bold font-mono">
                            {qIndex + 1}
                          </span>
                          <h4 className="text-base font-serif font-bold text-editorial-text leading-relaxed">{q.question}</h4>
                        </div>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 gap-2.5 pl-8">
                          {q.options.map(option => {
                            const optionLetter = option.trim().charAt(0); // A, B, C, D
                            const isOptionSelected = selected === optionLetter;
                            const isOptionCorrect = option.startsWith(q.answer);

                            let buttonStyle = 'bg-white border-editorial-border/30 text-editorial-text hover:bg-editorial-bg';
                            
                            if (isOptionSelected && !comprehensionSubmitted) {
                              buttonStyle = 'bg-editorial-accent text-white border-editorial-accent font-bold';
                            } else if (comprehensionSubmitted) {
                              if (isOptionCorrect) {
                                buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                              } else if (isOptionSelected) {
                                buttonStyle = 'bg-rose-50 border-rose-500 text-rose-950';
                              } else {
                                buttonStyle = 'bg-white border-editorial-border/20 text-editorial-text/30 opacity-60';
                              }
                            }

                            return (
                              <button
                                key={option}
                                disabled={comprehensionSubmitted}
                                onClick={() => selectComprehensionOption(q.id, optionLetter)}
                                className={`w-full text-left p-3.5 border text-xs sm:text-sm font-sans flex justify-between items-center transition-all cursor-pointer ${buttonStyle}`}
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
                <div className="border-t border-editorial-border/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {comprehensionSubmitted ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center bg-editorial-bg border border-editorial-border/30 text-editorial-text">
                        <Award className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[10px] text-editorial-text/40 font-bold tracking-wider uppercase font-mono">TEST SKORU</p>
                        <p className="text-sm font-bold text-editorial-text">
                          Doğruluk Derecesi:{' '}
                          <span className="text-editorial-accent font-mono text-base font-extrabold">
                            {comprehensionScore} / {passage.questions.length}
                          </span>{' '}
                          ({Math.round((comprehensionScore / passage.questions.length) * 100)}%)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-editorial-text/40 font-serif italic">
                      Lütfen tüm soruları yanıtlayıp ardından testi gönderin.
                    </span>
                  )}

                  {!comprehensionSubmitted ? (
                    <button
                      onClick={submitComprehensionQuiz}
                      disabled={Object.keys(comprehensionAnswers).length < passage.questions.length}
                      className="px-6 py-2.5 bg-editorial-accent hover:bg-white hover:text-editorial-text border border-editorial-accent text-white font-bold text-xs sm:text-sm disabled:bg-editorial-bg disabled:text-editorial-text/30 disabled:border-editorial-border/20 transition-all uppercase tracking-wider cursor-pointer w-full sm:w-auto"
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
                      className="px-6 py-2.5 border border-editorial-border/40 bg-white hover:bg-editorial-bg text-editorial-text font-bold text-xs sm:text-sm transition-all uppercase tracking-wider cursor-pointer w-full sm:w-auto"
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
                className="bg-white border border-editorial-border/40 p-6 sm:p-10 shadow-xs space-y-6"
              >
                <div className="flex justify-between items-center border-b border-editorial-border/20 pb-4">
                  <h3 className="text-lg font-serif font-bold text-editorial-text">Kelime Alıştırmaları</h3>
                  <span className="text-xs font-bold text-editorial-text/40 font-mono">{passage.exercises.length} ALIŞTIRMA</span>
                </div>

                <div className="space-y-8">
                  {passage.exercises.map((ex, exIndex) => {
                    const selected = exerciseAnswers[ex.id];
                    const isCorrect = ex.options.find(o => o.startsWith(selected))?.startsWith(ex.answer);

                    return (
                      <div key={ex.id} className="space-y-4 p-6 bg-editorial-bg/30 border border-editorial-border/30">
                        <div className="flex gap-2.5 items-start">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-amber-500 text-white text-xs font-bold font-mono">
                            {exIndex + 1}
                          </span>
                          <h4 className="text-base font-serif font-bold text-editorial-text leading-relaxed">{ex.question}</h4>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 gap-2.5 pl-8">
                          {ex.options.map(option => {
                            const optionLetter = option.trim().charAt(0);
                            const isOptionSelected = selected === optionLetter;
                            const isOptionCorrect = option.startsWith(ex.answer);

                            let buttonStyle = 'bg-white border-editorial-border/30 text-editorial-text hover:bg-editorial-bg';
                            
                            if (isOptionSelected && !exercisesSubmitted) {
                              buttonStyle = 'bg-amber-500 text-white border-amber-500 font-bold';
                            } else if (exercisesSubmitted) {
                              if (isOptionCorrect) {
                                buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                              } else if (isOptionSelected) {
                                buttonStyle = 'bg-rose-50 border-rose-500 text-rose-950';
                              } else {
                                buttonStyle = 'bg-white border-editorial-border/20 text-editorial-text/30 opacity-60';
                              }
                            }

                            return (
                              <button
                                key={option}
                                disabled={exercisesSubmitted}
                                onClick={() => selectExerciseOption(ex.id, optionLetter)}
                                className={`w-full text-left p-3.5 border text-xs sm:text-sm font-sans flex justify-between items-center transition-all cursor-pointer ${buttonStyle}`}
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
                <div className="border-t border-editorial-border/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {exercisesSubmitted ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center bg-editorial-bg border border-editorial-border/30 text-editorial-text">
                        <Award className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-editorial-text/40 font-bold tracking-wider uppercase font-mono">ALIŞTIRMA SKORU</p>
                        <p className="text-sm font-bold text-editorial-text">
                          Doğruluk Derecesi:{' '}
                          <span className="text-amber-600 font-mono text-base font-extrabold">
                            {exercisesScore} / {passage.exercises.length}
                          </span>{' '}
                          ({Math.round((exercisesScore / passage.exercises.length) * 100)}%)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-editorial-text/40 font-serif italic">
                      Lütfen tüm alıştırma sorularını yanıtlayıp testi gönderin.
                    </span>
                  )}

                  {!exercisesSubmitted ? (
                    <button
                      onClick={submitExercisesQuiz}
                      disabled={Object.keys(exerciseAnswers).length < passage.exercises.length}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm disabled:bg-editorial-bg disabled:text-editorial-text/30 disabled:border-editorial-border/20 transition-all uppercase tracking-wider cursor-pointer w-full sm:w-auto"
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
                      className="px-6 py-2.5 border border-editorial-border/40 bg-white hover:bg-editorial-bg text-editorial-text font-bold text-xs sm:text-sm transition-all uppercase tracking-wider cursor-pointer w-full sm:w-auto"
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
          <div className="bg-white border border-editorial-border/40 p-6 shadow-xs">
            <h3 className="text-base font-serif font-bold text-editorial-text mb-4 pb-2 border-b border-editorial-border/20 flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-editorial-accent" /> İnteraktif Sözlük
            </h3>

            {activeWordDetail ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xl font-serif font-extrabold text-editorial-text flex items-center gap-2">
                      {activeWordDetail.term}
                      <button
                        onClick={() => speakWord(activeWordDetail.term)}
                        className="p-1 rounded-xs text-editorial-text/40 hover:text-editorial-accent hover:bg-editorial-bg transition-colors cursor-pointer"
                        title="Telaffuz Dinle"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </h4>
                    <span className="inline-block text-[10px] font-bold font-mono text-editorial-text/70 bg-editorial-bg border border-editorial-border/30 px-2 py-0.5 rounded-xs uppercase">
                      {activeWordDetail.partOfSpeech === 'n' ? 'Noun (İsim)' :
                       activeWordDetail.partOfSpeech === 'v' ? 'Verb (Fiil)' :
                       activeWordDetail.partOfSpeech === 'adj' ? 'Adjective (Sıfat)' :
                       activeWordDetail.partOfSpeech === 'adv' ? 'Adverb (Zarf)' : 'Phrasal Verb (Deyim Fiil)'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-editorial-text">
                  <div className="bg-editorial-bg p-4 border border-editorial-border/20">
                    <p className="text-[10px] text-editorial-text/40 font-bold tracking-wider uppercase mb-1">Türkçe Anlamı</p>
                    <p className="font-bold text-editorial-accent text-base">{activeWordDetail.meaning}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-editorial-text/40 font-bold tracking-wider uppercase">Tanımlama (Definition)</p>
                    <p className="text-xs text-editorial-text/70 italic leading-relaxed font-serif">{activeWordDetail.definition || "İngilizce tanımı mevcut."}</p>
                  </div>

                  {activeWordDetail.exampleSentence && (
                    <div className="space-y-1 pt-3 border-t border-editorial-border/20">
                      <p className="text-[10px] text-editorial-text/40 font-bold tracking-wider uppercase">Örnek Cümle (Example)</p>
                      <p className="text-xs text-editorial-text/80 bg-editorial-bg p-3 border-l-2 border-editorial-accent font-mono leading-relaxed">
                        "{activeWordDetail.exampleSentence}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Toggle Box inside panel */}
                <div className="pt-4 border-t border-editorial-border/20 space-y-2">
                  <p className="text-xs font-serif font-bold text-editorial-text/70">Bu kelimenin çalışma durumu:</p>
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
                          className={`flex-1 py-2 border text-[10px] font-bold tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            isCurrent 
                              ? btn.id === 'studied' ? 'bg-amber-500 text-white border-amber-500 font-bold' : 'bg-emerald-600 text-white border-emerald-600 font-bold'
                              : 'bg-white hover:bg-editorial-bg text-editorial-text/50 border-editorial-border/30'
                          }`}
                        >
                          {isCurrent && <Check className="h-3 w-3 shrink-0" />}
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-editorial-bg border border-editorial-border/20">
                <HelpCircle className="h-10 w-10 text-editorial-text/20 mb-2" />
                <p className="text-xs text-editorial-text font-bold">Kelimelere Tıklayın</p>
                <p className="text-[10px] text-editorial-text/50 mt-1 max-w-[200px] font-serif italic leading-relaxed">
                  Metin içindeki kalın veya altı çizili kelimelerin üzerine tıklayarak anlamlarına hızlıca göz atabilirsiniz.
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats of Current Passage */}
          <div className="bg-white border border-editorial-border/40 p-6 space-y-4">
            <h4 className="text-xs font-bold tracking-wider uppercase text-editorial-text">PARÇA ÇALIŞMA İLERLEMESİ</h4>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center text-editorial-text/70 border-b border-editorial-border/10 pb-2">
                <span className="font-serif italic">Okuma Durumu</span>
                <span className={`font-bold uppercase text-[10px] tracking-wider ${progress.completedPassages.includes(passage.id) ? 'text-emerald-700' : 'text-editorial-text/40'}`}>
                  {progress.completedPassages.includes(passage.id) ? '🏆 TAMAMLANDI' : '✍️ KALAN'}
                </span>
              </div>

              <div className="flex justify-between items-center text-editorial-text/70 border-b border-editorial-border/10 pb-2">
                <span className="font-serif italic">Kelime Öğrenme Oranı</span>
                <span className="font-bold text-editorial-text">
                  {passage.vocabulary.filter(v => progress.wordStatus[v.term] === 'learned').length} / {passage.vocabulary.length}
                </span>
              </div>

              <div className="flex justify-between items-center text-editorial-text/70">
                <span className="font-serif italic">Quiz Başarı Derecesi</span>
                <span className="font-bold text-editorial-text font-mono">
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

