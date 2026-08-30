import { useState, useMemo, useEffect, useCallback } from 'react';
import { Passage, VocabularyWord, UserProgress } from '../types';
import { CORE_VOCABULARY_DATA, CORE_VOCABULARY_CATEGORIES } from '../data/coreVocabulary';
import {
  addWordToVocabBank,
  getAllCards,
  VOCAB_CHANGED_EVENT,
  READING_CORE_LESSON_ID,
  READING_CORE_LESSON_TITLE,
  readingPassageLessonId,
} from '../lib/vocabBank';
import { Search, Volume2, CheckCircle2, Bookmark, ArrowRight, Eye, Sparkles, BookOpen, BrainCircuit, Check } from 'lucide-react';

interface VocabularyListProps {
  passages: Passage[];
  progress: UserProgress;
  onWordStatusChange: (term: string, status: 'unstudied' | 'studied' | 'learned') => void;
  onSelectPassage: (id: number) => void;
}

export default function VocabularyList({ passages, progress, onWordStatusChange, onSelectPassage }: VocabularyListProps) {
  const [sourceType, setSourceType] = useState<'passages' | 'core'>('passages');
  const [coreCategoryFilter, setCoreCategoryFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [posFilter, setPartOfSpeechFilter] = useState<string>('All');

  // Paylaşılan FSRS kelime bankasına eklenmiş terimler (küçük harfli set)
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

  const handleAddToBank = async (item: VocabularyWord & { passageId?: number; passageTitle?: string; isCore: boolean }) => {
    setAddingTerm(item.term);
    try {
      const source = item.isCore
        ? { lessonId: READING_CORE_LESSON_ID, lessonTitle: READING_CORE_LESSON_TITLE }
        : { lessonId: readingPassageLessonId(item.passageId!), lessonTitle: item.passageTitle || 'Okuma Parçası' };
      await addWordToVocabBank(item, source, passages.find(p => p.id === item.passageId)?.cefr || 'B1');
    } catch (err) {
      console.error('Kelime bankaya eklenemedi', err);
    } finally {
      setAddingTerm(null);
    }
  };

  // Unified vocabulary loader based on sourceType
  const flatVocabulary = useMemo(() => {
    if (sourceType === 'passages') {
      const list: (VocabularyWord & { passageId?: number; passageTitle?: string; isCore: boolean; category?: string })[] = [];
      passages.forEach(p => {
        if (!p) return;
        (p.vocabulary ?? []).forEach(v => {
          if (!list.some(item => item.term === v.term)) {
            list.push({
              ...v,
              passageId: p.id,
              passageTitle: p.title,
              isCore: false
            });
          }
        });
      });
      return list;
    } else {
      const list: (VocabularyWord & { passageId?: number; passageTitle?: string; isCore: boolean; category?: string })[] = [];
      CORE_VOCABULARY_DATA.forEach(v => {
        if (coreCategoryFilter === 'All' || v.category === coreCategoryFilter) {
          list.push({
            term: v.term,
            meaning: v.meaning,
            partOfSpeech: v.partOfSpeech,
            definition: v.definition,
            exampleSentence: v.exampleSentence,
            isCore: true,
            category: v.category
          });
        }
      });
      return list;
    }
  }, [passages, sourceType, coreCategoryFilter]);

  // Filtered vocabulary list
  const filteredVocabulary = useMemo(() => {
    return flatVocabulary.filter(item => {
      const matchesSearch = 
        item.term.toLowerCase().includes(search.toLowerCase()) ||
        item.meaning.toLowerCase().includes(search.toLowerCase()) ||
        (item.definition && item.definition.toLowerCase().includes(search.toLowerCase()));

      const status = progress.wordStatus[item.term] || 'unstudied';
      const matchesStatus = statusFilter === 'All' || status === statusFilter;

      const matchesPos = posFilter === 'All' || item.partOfSpeech === posFilter;

      return matchesSearch && matchesStatus && matchesPos;
    });
  }, [flatVocabulary, progress.wordStatus, search, statusFilter, posFilter]);

  // Word stats based on the active list
  const totalCount = flatVocabulary.length;
  const learnedCount = flatVocabulary.filter(item => progress.wordStatus[item.term] === 'learned').length;
  const studiedCount = flatVocabulary.filter(item => progress.wordStatus[item.term] === 'studied').length;
  const unstudiedCount = totalCount - learnedCount - studiedCount;

  // Speak word
  const speakWord = (term: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(term);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div id="vocabulary-list-container" className="space-y-6">
      
      {/* List Source Tabs Selector */}
      <div className="flex bg-white border border-hairline/40 p-1.5 shadow-xs font-mono text-xs justify-center sm:justify-start gap-2 rounded-lg">
        <button
          onClick={() => {
            setSourceType('passages');
            setSearch('');
            setStatusFilter('All');
            setPartOfSpeechFilter('All');
          }}
          className={`px-5 py-3 font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            sourceType === 'passages'
              ? 'bg-accent text-white border border-accent shadow-xs font-bold rounded-lg'
              : 'text-ink-3 hover:text-ink hover:bg-paper'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Okuma Parçası Kelimeleri
        </button>
        <button
          onClick={() => {
            setSourceType('core');
            setCoreCategoryFilter('All');
            setSearch('');
            setStatusFilter('All');
            setPartOfSpeechFilter('All');
          }}
          className={`px-5 py-3 font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            sourceType === 'core'
              ? 'bg-accent text-white border border-accent shadow-xs font-bold rounded-lg'
              : 'text-ink-3 hover:text-ink hover:bg-paper'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Temel Kelime Listeleri (Workbook)
        </button>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 bg-white border border-hairline/40 p-6 shadow-xs font-mono rounded-xl">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-ink-3 uppercase tracking-widest">LİSTE TOPLAMI</p>
          <p className="text-3xl font-bold text-ink">{totalCount}</p>
        </div>
        <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-hairline/20 pt-4 sm:pt-0 sm:pl-6">
          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">ÖĞRENİLEN</p>
          <p className="text-3xl font-bold text-emerald-700">{learnedCount}</p>
        </div>
        <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-hairline/20 pt-4 sm:pt-0 sm:pl-6">
          <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">ÇALIŞILAN</p>
          <p className="text-3xl font-bold text-amber-700">{studiedCount}</p>
        </div>
        <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-hairline/20 pt-4 sm:pt-0 sm:pl-6">
          <p className="text-[10px] font-bold text-ink-3 uppercase tracking-widest">KALAN</p>
          <p className="text-3xl font-bold text-ink-3">{unstudiedCount}</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-white border border-hairline/40 p-6 shadow-xs rounded-xl">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-ink-3" />
          <input
            type="text"
            placeholder={sourceType === 'passages' ? "Kelime, Türkçe anlam veya açıklamalarda ara..." : "Temel listelerde kelime ara..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-hairline/30 bg-paper focus:bg-white focus:outline-hidden focus:border-accent transition-all font-sans text-xs sm:text-sm text-ink rounded-lg"
          />
        </div>

        {/* Dropdown Filters Row */}
        <div className="flex flex-wrap gap-4 font-mono text-[11px] tracking-wider uppercase">
          
          {/* Core category filter (Only visible in 'core' source) */}
          {sourceType === 'core' && (
            <div className="flex items-center gap-2 text-ink/60 font-bold">
              <span>GRUP:</span>
              <select
                value={coreCategoryFilter}
                onChange={(e) => setCoreCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-hairline/30 bg-white font-bold text-ink focus:outline-hidden focus:border-accent text-xs cursor-pointer rounded-lg uppercase"
              >
                <option value="All">TÜMÜ</option>
                {Object.entries(CORE_VOCABULARY_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key}>{value.title.split(' ')[0]}</option>
                ))}
              </select>
            </div>
          )}

          {/* Status filter dropdown */}
          <div className="flex items-center gap-2 text-ink/60 font-bold">
            <span>DURUM:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-hairline/30 bg-white font-bold text-ink focus:outline-hidden focus:border-accent text-xs cursor-pointer rounded-lg uppercase"
            >
              <option value="All">HEPSİ</option>
              <option value="unstudied">ÇALIŞILMADI</option>
              <option value="studied">ÇALIŞILIYOR</option>
              <option value="learned">ÖĞRENİLDİ</option>
            </select>
          </div>

          {/* Part of speech dropdown filter */}
          <div className="flex items-center gap-2 text-ink/60 font-bold">
            <span>TÜR:</span>
            <select
              value={posFilter}
              onChange={(e) => setPartOfSpeechFilter(e.target.value)}
              className="px-3 py-2 border border-hairline/30 bg-white font-bold text-ink focus:outline-hidden focus:border-accent text-xs cursor-pointer rounded-lg uppercase"
            >
              <option value="All">TÜMÜ</option>
              <option value="n">Noun (İsim)</option>
              <option value="v">Verb (Fiil)</option>
              <option value="adj">Adjective (Sıfat)</option>
              <option value="adv">Adverb (Zarf)</option>
              <option value="phr. v">Phrasal Verb (Deyim Fiil)</option>
              <option value="prep">Preposition (Edat)</option>
            </select>
          </div>

        </div>

      </div>

      {/* Words Inventory Grid */}
      {filteredVocabulary.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVocabulary.map(item => {
            const status = progress.wordStatus[item.term] || 'unstudied';

            // Status Styling matching editorial styles
            let statusTag = '';
            if (status === 'unstudied') statusTag = 'bg-paper text-ink-3 border-hairline/20';
            else if (status === 'studied') statusTag = 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
            else if (status === 'learned') statusTag = 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';

            return (
              <div 
                key={item.term}
                className="group relative border border-hairline/40 bg-white p-6 shadow-xs hover:shadow-md hover:border-accent transition-all duration-300 flex flex-col justify-between rounded-xl"
              >
                <div>
                  {/* Top line Info */}
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="space-y-1">
                      <h4 className="text-lg font-display font-extrabold text-ink flex items-center gap-2">
                        {item.term}
                        <button
                          onClick={() => speakWord(item.term)}
                          className="p-1 rounded-xs text-ink/30 hover:text-accent hover:bg-paper transition-colors cursor-pointer"
                          title="Telaffuz Dinle"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </h4>
                      <span className="inline-block text-[9px] font-bold text-ink-3 bg-paper border border-hairline/30 px-1.5 py-0.5 uppercase font-mono tracking-wider rounded-lg">
                        {item.partOfSpeech === 'n' ? 'Noun' :
                         item.partOfSpeech === 'v' ? 'Verb' :
                         item.partOfSpeech === 'adj' ? 'Adjective' :
                         item.partOfSpeech === 'adv' ? 'Adverb' :
                         item.partOfSpeech === 'prep' ? 'Preposition' : 'Phrasal Verb'}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 text-[9px] uppercase font-bold tracking-widest border rounded-xs ${statusTag}`}>
                      {status === 'unstudied' ? 'Kalan' : status === 'studied' ? 'Çalışılıyor' : 'Öğrenildi'}
                    </span>
                  </div>

                  {/* Definition & Meaning info */}
                  <div className="space-y-3 mt-4">
                    <div className="bg-paper p-3.5 border border-hairline/20 rounded-lg">
                      <span className="text-[9px] text-ink-3 block font-bold tracking-wider uppercase font-mono mb-0.5">Anlamı</span>
                      <p className="font-bold text-accent text-sm font-sans">{item.meaning}</p>
                    </div>

                    {item.definition && (
                      <p className="text-xs text-ink/60 leading-relaxed font-display line-clamp-2">
                        {item.definition}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer status buttons & Backlink to Passage */}
                <div className="mt-6 pt-4 border-t border-hairline/20 flex items-center justify-between gap-3">
                  {!item.isCore && item.passageId && onSelectPassage ? (
                    <button
                      onClick={() => onSelectPassage(item.passageId!)}
                      className="text-[10px] font-bold text-accent hover:underline transition-colors flex items-center gap-1 uppercase tracking-wide cursor-pointer font-mono"
                      title={`Parçayı Gör: ${item.passageTitle}`}
                    >
                      <Eye className="h-3.5 w-3.5" /> Parçayı Gör
                    </button>
                  ) : item.isCore && item.category ? (
                    <span className="text-[10px] font-bold text-ink-3 font-mono uppercase tracking-wider bg-paper border border-hairline/20 px-2 py-0.5 rounded-lg">
                      🗂️ {CORE_VOCABULARY_CATEGORIES[item.category as keyof typeof CORE_VOCABULARY_CATEGORIES]?.title.split(' ')[0]}
                    </span>
                  ) : (
                    <div />
                  )}

                  <div className="flex gap-1 font-mono text-[9px]">
                    {[
                      { id: 'studied', label: 'ÇALIŞTIM', color: 'bg-amber-500 text-white border-amber-600 font-bold' },
                      { id: 'learned', label: 'ÖĞRENDİM', color: 'bg-emerald-600 text-white border-emerald-700 font-bold' }
                    ].map(btn => {
                      const isCurrent = status === btn.id;
                      return (
                        <button
                          key={btn.id}
                          onClick={() => onWordStatusChange(item.term, btn.id as any)}
                          className={`px-2.5 py-1.5 border text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer rounded-lg ${
                            isCurrent
                              ? btn.id === 'studied' ? 'bg-amber-500 text-white border-amber-500 font-bold' : 'bg-emerald-600 text-white border-emerald-600 font-bold'
                              : 'bg-white hover:bg-paper text-ink-3 border-hairline/30'
                          }`}
                        >
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Paylaşılan FSRS kelime bankasına ekle (Katmanlı'nın Kelime Kartları ekranıyla ortak) */}
                <button
                  onClick={() => handleAddToBank(item)}
                  disabled={bankedTerms.has(item.term.toLowerCase()) || addingTerm === item.term}
                  className={`mt-3 w-full flex items-center justify-center gap-1.5 py-2 border text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer disabled:cursor-default rounded-lg ${
                    bankedTerms.has(item.term.toLowerCase())
                      ? 'bg-paper text-emerald-700 border-emerald-200'
                      : 'bg-white text-ink/60 border-hairline/30 hover:border-accent hover:text-accent'
                  }`}
                  title="Bu kelimeyi katmanlı'daki FSRS tekrar destesine ekle"
                >
                  {bankedTerms.has(item.term.toLowerCase()) ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Tekrar Bankasında
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="h-3.5 w-3.5" />
                      {addingTerm === item.term ? 'Ekleniyor...' : 'Tekrar Bankasına Ekle'}
                    </>
                  )}
                </button>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 bg-white border border-hairline/40 text-center rounded-2xl">
          <Bookmark className="h-12 w-12 text-ink/20 mb-2" />
          <p className="text-base font-display font-bold text-ink">Hiç kelime bulunamadı.</p>
          <p className="text-xs text-ink-3 mt-1 max-w-sm font-display">
            Seçtiğiniz filtreleri veya arama kriterlerini değiştirerek tekrar aramayı deneyebilirsiniz.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('All');
              setPartOfSpeechFilter('All');
              if (sourceType === 'core') {
                setCoreCategoryFilter('All');
              }
            }}
            className="mt-5 px-5 py-2 bg-accent text-white text-xs font-bold hover:bg-white hover:text-ink border border-accent transition-colors cursor-pointer rounded-lg"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}

    </div>
  );
}
