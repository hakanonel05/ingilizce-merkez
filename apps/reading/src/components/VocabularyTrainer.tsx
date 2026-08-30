import { useState, useMemo, useEffect } from 'react';
import { Passage, VocabularyWord, UserProgress } from '../types';
import { CORE_VOCABULARY_DATA, CORE_VOCABULARY_CATEGORIES } from '../data/coreVocabulary';
import { CheckCircle2, ChevronLeft, ChevronRight, HelpCircle, RefreshCw, Volume2, Award, BookOpen, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

  return (
    <div id="vocabulary-trainer-container" className="space-y-6">
      
      {/* Mode Switch Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-hairline/40 p-6 shadow-xs gap-4 rounded-xl">
        <div className="space-y-1">
          <h2 className="text-xl font-display font-extrabold text-ink flex items-center gap-2">
            <Sparkles className="h-5.5 w-5.5 text-accent" /> Pratik ve Gelişim Alanı
          </h2>
          <p className="text-xs text-ink-3 font-display">Kelime kartlarıyla çalışın ya da bilginizi ölçmek için test alanına geçin.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-paper border border-hairline/20 p-1 rounded-xl self-stretch sm:self-auto font-mono text-[10px]">
          <button
            onClick={() => { setMode('cards'); setTestActive(false); }}
            className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer rounded-lg uppercase tracking-wider ${
              mode === 'cards' ? 'bg-white text-ink border border-hairline/30 shadow-xs rounded-lg' : 'text-ink-3 hover:text-ink'
            }`}
          >
            📇 KELİME KARTLARI
          </button>
          <button
            onClick={() => { setMode('test'); }}
            className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer rounded-lg uppercase tracking-wider ${
              mode === 'test' ? 'bg-white text-ink border border-hairline/30 shadow-xs rounded-lg' : 'text-ink-3 hover:text-ink'
            }`}
          >
            ⚡ HIZLI TEST
          </button>
        </div>
      </div>

      {/* Kelime Kaynağı Seçici */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white border border-hairline/40 p-5 shadow-xs font-mono text-[10px] rounded-xl">
        <span className="text-ink/60 font-bold uppercase tracking-widest flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5 text-accent" />
          KAYNAK GRUBU:
        </span>
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'all', label: 'KARIŞIK (HEPSİ)' },
            { id: 'passages', label: 'SADECE OKUMA PARÇALARI' },
            { id: 'core', label: 'SADECE TEMEL WORKBOOK KELİMELERİ' }
          ].map(src => (
            <button
              key={src.id}
              onClick={() => {
                setTrainerSource(src.id as any);
                setTestActive(false); // Reset active tests to avoid out-of-sync states
              }}
              className={`px-3 py-1.5 border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer rounded-full ${
                trainerSource === src.id
                  ? 'bg-accent text-white border-accent font-bold shadow-xs'
                  : 'bg-white border-hairline/30 text-ink-3 hover:bg-paper hover:text-ink'
              }`}
            >
              {src.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Panel Switch Rendering */}
      {mode === 'cards' ? (
        <div className="space-y-6">
          
          {/* Filter Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-paper border border-hairline/30 p-4 rounded-xl font-mono text-[10px]">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-ink-3 font-bold uppercase tracking-wider">Kart Filtresi:</span>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'all', label: 'TÜMÜ' },
                  { id: 'unstudied', label: 'ÇALIŞILMAYAN' },
                  { id: 'studied', label: 'ÇALIŞILAN' },
                  { id: 'learned', label: 'ÖĞRENİLEN' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setCardFilter(opt.id as any)}
                    className={`px-3 py-1.5 border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer rounded-full ${
                      cardFilter === opt.id
                        ? 'bg-ink text-white border-ink shadow-xs'
                        : 'bg-white border-hairline/30 text-ink-3 hover:bg-paper hover:text-ink'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs font-bold text-ink/60 font-mono uppercase tracking-wider">
              KART: {filteredWords.length > 0 ? cardIndex + 1 : 0} / {filteredWords.length}
            </span>
          </div>

          {/* Flashcard Area */}
          {filteredWords.length > 0 ? (
            <div className="flex flex-col items-center justify-center space-y-6">
              
              {/* Card Surface Frame */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative w-full max-w-xl h-72 cursor-pointer shadow-xs transition-all duration-500 transform border border-hairline/40 bg-white rounded-2xl ${
                  isFlipped ? 'rotate-y-180 bg-paper border-accent' : 'hover:shadow-md'
                }`}
              >
                {/* Front Side */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 space-y-4 ${
                  isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-300'
                }`}>
                  <span className="text-[9px] bg-paper border border-hairline/30 text-ink-3 font-bold px-2 py-0.5 font-mono uppercase tracking-widest rounded-lg">{activeCardWord.partOfSpeech}</span>
                  <h3 className="text-3xl font-display font-extrabold text-ink tracking-tight">{activeCardWord.term}</h3>
                  <p className="text-[10px] text-ink-3 font-display">Çevirmek için karta dokunun</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); speakWord(activeCardWord.term); }}
                    className="p-2.5 rounded-lg bg-paper text-ink-3 border border-hairline/30 hover:bg-ink hover:text-white transition-colors cursor-pointer"
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Back Side */}
                <div className={`absolute inset-0 flex flex-col justify-between p-6 rotate-y-180 ${
                  isFlipped ? 'opacity-100 transition-opacity duration-300' : 'opacity-0 pointer-events-none'
                }`}>
                  <div className="space-y-4 text-center">
                    <span className="inline-block text-[9px] bg-paper text-accent border border-hairline/30 font-bold px-2 py-0.5 uppercase font-mono tracking-widest rounded-lg">{activeCardWord.partOfSpeech}</span>
                    <h3 className="text-2xl font-display font-extrabold text-accent">{activeCardWord.term}</h3>
                    
                    <div className="space-y-2 max-w-md mx-auto">
                      <p className="text-lg font-bold text-ink bg-paper p-3.5 border border-hairline/20 rounded-lg">{activeCardWord.meaning}</p>
                      {activeCardWord.definition && (
                        <p className="text-xs text-ink/60 font-display leading-relaxed">{activeCardWord.definition}</p>
                      )}
                      {activeCardWord.exampleSentence && (
                        <p className="text-xs text-ink-3 font-mono italic pt-1">"{activeCardWord.exampleSentence}"</p>
                      )}
                    </div>
                  </div>

                  <p className="text-[9px] text-ink-3 font-mono tracking-wider uppercase text-center">Öğrenildi / Çalışıldı olarak işaretlemek için aşağıdaki butonları kullanabilirsiniz</p>
                </div>

              </div>

              {/* Navigation and State Toggle Toolbar */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl justify-between bg-white border border-hairline/40 p-4 rounded-xl shadow-xs font-mono">
                
                {/* Card navigation */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={cardIndex === 0}
                    onClick={() => { setCardIndex(prev => prev - 1); setIsFlipped(false); }}
                    className="p-2 bg-white border border-hairline/30 hover:bg-paper text-ink/60 disabled:opacity-30 cursor-pointer rounded-lg"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-xs font-bold text-ink-3">
                    {cardIndex + 1} / {filteredWords.length}
                  </span>
                  <button
                    disabled={cardIndex === filteredWords.length - 1}
                    onClick={() => { setCardIndex(prev => prev + 1); setIsFlipped(false); }}
                    className="p-2 bg-white border border-hairline/30 hover:bg-paper text-ink/60 disabled:opacity-30 cursor-pointer rounded-lg"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Mark status of card */}
                <div className="flex gap-2">
                  {[
                    { id: 'studied', label: 'ÇALIŞTIM', color: 'bg-amber-500 text-white border-amber-600 font-bold' },
                    { id: 'learned', label: 'ÖĞRENDİM', color: 'bg-emerald-600 text-white border-emerald-700' }
                  ].map(btn => {
                    const status = progress.wordStatus[activeCardWord.term] || 'unstudied';
                    const isCurrent = status === btn.id;

                    return (
                      <button
                        key={btn.id}
                        onClick={() => onWordStatusChange(activeCardWord.term, btn.id as any)}
                        className={`px-4 py-2 border text-[10px] uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer rounded-lg ${
                          isCurrent
                            ? btn.id === 'studied' ? 'bg-amber-500 text-white border-amber-500 font-bold' : 'bg-emerald-600 text-white border-emerald-700 font-bold shadow-xs'
                            : 'bg-white hover:bg-paper text-ink-3 border-hairline/30'
                        }`}
                      >
                        {isCurrent && <CheckCircle2 className="h-3.5 w-3.5" />}
                        {btn.label}
                      </button>
                    );
                  })}
                </div>

              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-16 bg-white border border-hairline/40 text-center rounded-2xl">
              <BookOpen className="h-12 w-12 text-ink/20 mb-2" />
              <p className="text-base font-display font-bold text-ink">Bu çalışma durumuna uygun kelime bulunamadı.</p>
              <p className="text-xs text-ink-3 mt-1 max-w-sm font-display">
                Farklı bir filtre seçerek kelime kartlarını listeleyebilirsiniz.
              </p>
            </div>
          )}

        </div>
      ) : (
        // Practice Test Mode
        <div className="bg-white border border-hairline/40 p-6 shadow-xs space-y-6 rounded-xl">
          {!testActive ? (
            <div className="flex flex-col items-center justify-center text-center p-12 space-y-5">
              <div className="flex h-16 w-14 items-center justify-center border border-hairline/30 bg-paper text-ink/60 rounded-lg">
                <HelpCircle className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-display font-extrabold text-ink">Dynamic Vocabulary Challenge</h3>
                <p className="text-xs text-ink-3 font-display max-w-md leading-relaxed">
                  Tüm okuma parçalarından rastgele seçilen 10 kelimelik bir pratik quizi oluşturun. Yanıtlarınız kelime durumunu doğrudan günceller!
                </p>
              </div>
              <button
                onClick={generateTest}
                className="px-6 py-3 bg-accent hover:bg-white hover:text-ink border border-accent text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer font-mono rounded-lg"
              >
                Testi Başlat
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Test Header */}
              <div className="flex justify-between items-center border-b border-hairline/20 pb-4">
                <span className="text-[10px] font-bold text-ink-3 uppercase tracking-widest font-mono">
                  Soru {currentTestIndex + 1} / {testQuestions.length}
                </span>
                
                {/* Progress Mini Bar */}
                <div className="h-1.5 w-32 bg-paper border border-hairline/20 overflow-hidden rounded-lg">
                  <div 
                    className="h-full bg-accent transition-all" 
                    style={{ width: `${((currentTestIndex + (testSubmitted ? 1 : 0)) / testQuestions.length) * 100}%` }} 
                  />
                </div>
              </div>

              {/* Single Question Frame */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-display font-extrabold text-ink leading-relaxed">
                  {testQuestions[currentTestIndex].questionText}
                </h3>

                {/* Question options */}
                <div className="grid grid-cols-1 gap-2.5">
                  {testQuestions[currentTestIndex].options.map(option => {
                    const isSelected = testAnswers[currentTestIndex] === option;
                    const isCorrectOption = option === testQuestions[currentTestIndex].correctAnswer;

                    let buttonStyle = 'bg-white border-hairline/30 text-ink hover:bg-paper hover:border-accent';
                    
                    if (isSelected && !testSubmitted) {
                      buttonStyle = 'bg-paper border-accent text-ink font-bold';
                    } else if (testSubmitted) {
                      if (isCorrectOption) {
                        buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                      } else if (isSelected) {
                        buttonStyle = 'bg-rose-50 border-rose-500 text-rose-950';
                      } else {
                        buttonStyle = 'bg-white border-hairline/20 text-ink/30 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={option}
                        disabled={testSubmitted}
                        onClick={() => handleSelectTestOption(option)}
                        className={`w-full text-left p-4 border text-xs sm:text-sm transition-all flex justify-between items-center cursor-pointer rounded-xl ${buttonStyle}`}
                      >
                        <span>{option}</span>
                        {testSubmitted && isCorrectOption && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer controls inside quiz */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-hairline/20">
                {testSubmitted ? (
                  <div className="text-xs">
                    <p className="text-ink-3 font-bold uppercase tracking-wider font-mono">Test Tamamlandı</p>
                    <p className="text-sm font-bold text-ink">
                      Doğru Yanıt:{' '}
                      <span className="text-emerald-700 font-mono text-base font-extrabold">{testScore} / {testQuestions.length}</span>
                    </p>
                  </div>
                ) : (
                  <span className="text-xs text-ink-3 font-display">Doğru bilinen kelimeler otomatik olarak 'Öğrenildi' durumuna yükseltilir.</span>
                )}

                <div className="flex gap-2 w-full sm:w-auto">
                  {testSubmitted ? (
                    <>
                      <button
                        onClick={() => setTestActive(false)}
                        className="flex-1 sm:flex-none px-5 py-2.5 border border-hairline/30 bg-white hover:bg-paper text-ink/60 font-bold text-xs rounded-lg transition-colors uppercase font-mono tracking-wider cursor-pointer"
                      >
                        Kapat
                      </button>
                      <button
                        onClick={generateTest}
                        className="flex-1 sm:flex-none px-5 py-2.5 bg-accent hover:bg-white hover:text-ink border border-accent text-white font-bold text-xs rounded-lg transition-colors uppercase font-mono tracking-wider cursor-pointer"
                      >
                        Yeni Test
                      </button>
                    </>
                  ) : (
                    <button
                      disabled={!testAnswers[currentTestIndex]}
                      onClick={nextTestQuestion}
                      className="w-full sm:w-auto px-5 py-2.5 bg-accent hover:bg-white hover:text-ink border border-accent text-white font-bold text-xs rounded-lg disabled:bg-paper disabled:text-ink/30 disabled:border-hairline/20 transition-colors shadow-xs flex items-center justify-center gap-1 font-mono uppercase tracking-wider cursor-pointer"
                    >
                      {currentTestIndex === testQuestions.length - 1 ? 'Testi Bitir' : 'Sonraki Soru'}
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
