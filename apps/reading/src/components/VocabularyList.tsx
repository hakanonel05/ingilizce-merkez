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
import { Search, Volume2, Eye, BrainCircuit, Check } from 'lucide-react';

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

  /** Söz türü kısaltmasının okunabilir karşılığı. */
  const posLabel = (p: string) =>
    p === 'n' ? 'isim' :
    p === 'v' ? 'fiil' :
    p === 'adj' ? 'sıfat' :
    p === 'adv' ? 'zarf' :
    p === 'prep' ? 'edat' : 'phrasal verb';

  /** Segment düğmesi — liste ve parça ekranlarıyla aynı dil. */
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
    <div id="vocabulary-list-container" className="space-y-5">

      <div className="flex items-baseline justify-between gap-3">
        <h1 className="text-[22px] font-semibold tracking-tight text-brand">Kelime Haznesi</h1>
        {/* DÖRT BÜYÜK SAYI KARTI YERİNE TEK SATIR.
            Toplam / öğrenilen / çalışılan / kalan dört sütunlu bir kartta
            36px rakamlarla duruyordu; dördü de aynı ağırlıkta olduğu için
            hiçbiri öne çıkmıyordu ve kartın kendisi ekranın üçte birini
            alıyordu. Sayılar burada bağlam bilgisi, ekranın konusu değil. */}
        <span className="text-[12px] text-ink-3">
          <span className="timecode text-ink">{learnedCount}</span> öğrenildi{' · '}
          <span className="timecode text-ink">{studiedCount}</span> çalışılıyor{' · '}
          <span className="timecode text-ink">{unstudiedCount}</span> kaldı
        </span>
      </div>

      {/* Kaynak seçimi ve filtreler — hepsi tek satırda, aynı sakinlikte */}
      <div className="flex flex-col gap-3">
        <div className="flex w-fit gap-0.5 rounded-xl bg-paper-3 p-1">
          {segment('Okuma parçası kelimeleri', sourceType === 'passages', () => {
            setSourceType('passages');
            setSearch(''); setStatusFilter('All'); setPartOfSpeechFilter('All');
          })}
          {segment('Temel kelime listeleri', sourceType === 'core', () => {
            setSourceType('core');
            setCoreCategoryFilter('All');
            setSearch(''); setStatusFilter('All'); setPartOfSpeechFilter('All');
          })}
        </div>

        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="relative lg:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
            <input
              type="text"
              placeholder={sourceType === 'passages' ? 'Kelime veya anlam ara…' : 'Temel listelerde ara…'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-hairline bg-paper-2 py-2.5 pl-9 pr-3
                text-[13px] text-ink placeholder-ink-3 transition-colors
                focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {sourceType === 'core' && (
              <select
                value={coreCategoryFilter}
                onChange={(e) => setCoreCategoryFilter(e.target.value)}
                aria-label="Grup"
                className={selectClass}
              >
                <option value="All">Tüm gruplar</option>
                {Object.entries(CORE_VOCABULARY_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key}>{value.title.split(' ')[0]}</option>
                ))}
              </select>
            )}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Durum"
              className={selectClass}
            >
              <option value="All">Tüm durumlar</option>
              <option value="unstudied">Çalışılmadı</option>
              <option value="studied">Çalışılıyor</option>
              <option value="learned">Öğrenildi</option>
            </select>

            <select
              value={posFilter}
              onChange={(e) => setPartOfSpeechFilter(e.target.value)}
              aria-label="Söz türü"
              className={selectClass}
            >
              <option value="All">Tüm türler</option>
              <option value="n">İsim</option>
              <option value="v">Fiil</option>
              <option value="adj">Sıfat</option>
              <option value="adv">Zarf</option>
              <option value="phr. v">Phrasal verb</option>
              <option value="prep">Edat</option>
            </select>
          </div>
        </div>
      </div>

      {/* IZGARA DEĞİL LİSTE. Kelimeler üç sütunlu kartlardaydı ve her kart
          kendi içinde bir kutu daha taşıyordu ("Anlamı" kutusu). Bir kelime
          + karşılığı iki satırlık bilgi; kutuya gerek yok. */}
      {filteredVocabulary.length > 0 ? (
        <ul className="divide-y divide-hairline border-y border-hairline">
          {filteredVocabulary.map(item => {
            const status = progress.wordStatus[item.term] || 'unstudied';
            const inBank = bankedTerms.has(item.term.toLowerCase());

            return (
              <li key={item.term} className="group px-3 py-3.5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[14px] font-medium text-ink">{item.term}</span>
                      <span className="text-[11px] text-ink-3">{posLabel(item.partOfSpeech)}</span>

                      <button
                        type="button"
                        onClick={() => speakWord(item.term)}
                        title="Telaffuzu dinle"
                        aria-label="Telaffuzu dinle"
                        className="row-actions rounded p-1 text-ink-3 opacity-0 transition-opacity
                          hover:text-ink focus:opacity-100 group-hover:opacity-100 cursor-pointer"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="mt-0.5 text-[13px] text-ink-2">{item.meaning}</p>

                    {item.definition && (
                      <p className="mt-0.5 line-clamp-1 text-[12px] leading-relaxed text-ink-3">
                        {item.definition}
                      </p>
                    )}

                    {!item.isCore && item.passageId && onSelectPassage ? (
                      <button
                        type="button"
                        onClick={() => onSelectPassage(item.passageId!)}
                        title={item.passageTitle}
                        className="mt-1 inline-flex items-center gap-1 text-[11px] text-ink-3
                          transition-colors hover:text-brand cursor-pointer"
                      >
                        <Eye className="h-3 w-3" />
                        {item.passageTitle}
                      </button>
                    ) : item.isCore && item.category ? (
                      <span className="mt-1 block text-[11px] text-ink-3">
                        {CORE_VOCABULARY_CATEGORIES[item.category as keyof typeof CORE_VOCABULARY_CATEGORIES]?.title.split(' ')[0]}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    {/* Durum. Önce hem sağ üstte bir rozet hem altta iki
                        renkli düğme vardı — aynı bilgi iki kez, üstelik
                        rozet tıklanabilir değildi. Tek denetim kaldı. */}
                    <div className="flex gap-0.5 rounded-lg bg-paper-3 p-0.5">
                      {([
                        ['studied', 'Çalışıyorum'],
                        ['learned', 'Öğrendim'],
                      ] as [string, string][]).map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => onWordStatusChange(item.term, id as any)}
                          aria-pressed={status === id}
                          className={`rounded px-2 py-1 text-[11px] transition-colors cursor-pointer ${
                            status === id
                              ? id === 'studied'
                                ? 'bg-marker-bg font-medium text-marker-ink ring-1 ring-marker'
                                : 'bg-ok-soft font-medium text-ok ring-1 ring-ok-line'
                              : 'text-ink-3 hover:text-ink'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToBank(item)}
                      disabled={inBank || addingTerm === item.term}
                      title={inBank
                        ? 'Tekrar bankasında'
                        : 'FSRS tekrar destesine ekle (katmanlı ile ortak)'}
                      aria-label={inBank ? 'Tekrar bankasında' : 'Tekrar bankasına ekle'}
                      className={`rounded-lg p-1.5 transition-colors cursor-pointer disabled:cursor-default ${
                        inBank
                          ? 'text-ok'
                          : 'row-actions text-ink-3 opacity-0 hover:bg-paper-3 hover:text-ink focus:opacity-100 group-hover:opacity-100'
                      }`}
                    >
                      {inBank
                        ? <Check className="h-4 w-4" strokeWidth={3} />
                        : <BrainCircuit className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-2xl border border-hairline p-10 text-center">
          <p className="text-[14px] font-medium text-ink">Eşleşen kelime yok.</p>
          <p className="mx-auto mt-1 max-w-[46ch] text-[13px] leading-relaxed text-ink-2">
            Arama terimini ya da seçili filtreleri değiştirmeyi dene.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setStatusFilter('All');
              setPartOfSpeechFilter('All');
              if (sourceType === 'core') setCoreCategoryFilter('All');
            }}
            className="mt-5 rounded-xl bg-accent px-4 py-2 text-[13px] font-medium text-white
              transition-colors duration-150 hover:bg-accent-700 cursor-pointer"
          >
            Filtreleri temizle
          </button>
        </div>
      )}
    </div>
  );
}
