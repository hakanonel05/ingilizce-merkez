import { useState, useMemo } from 'react';
import { Passage, UserProgress } from '../types';
import { Search, CheckCircle2, BookOpen, Star, FileText, Sparkles } from 'lucide-react';
import { PASSAGE_CATALOG } from '../data/passageCatalog';

interface PassageListProps {
  passages: Passage[];
  progress: UserProgress;
  onSelectPassage: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

export default function PassageList({ passages, progress, onSelectPassage, onToggleFavorite }: PassageListProps) {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Combine PASSAGE_CATALOG with full loaded passages
  const combinedPassages = useMemo(() => {
    return PASSAGE_CATALOG.map(catItem => {
      const loaded = passages.find(p => p?.id === catItem.id);
      return {
        id: catItem.id,
        title: catItem.title,
        cefr: catItem.cefr,
        theme: catItem.theme,
        isLoaded: !!loaded,
        paragraphs: loaded ? loaded.paragraphs : [`Akın Dil Eğitim Workbook - Okuma Parçası #${catItem.id}`],
        vocabulary: loaded ? loaded.vocabulary : Array(10).fill({}), // Default YDS passage has 10 words
        questions: loaded ? loaded.questions : Array(5).fill({}), // Default YDS passage has 5 questions
        isGenerated: loaded ? loaded.isGenerated : false
      };
    });
  }, [passages]);

  // Filter the combined list of all 100 passages
  const filteredPassages = useMemo(() => {
    return combinedPassages.filter(p => {
      const matchesSearch = 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.theme.toLowerCase().includes(search.toLowerCase()) ||
        p.paragraphs.some(para => para.toLowerCase().includes(search.toLowerCase())) ||
        p.vocabulary.some(v => 
          v.term && (
            v.term.toLowerCase().includes(search.toLowerCase()) || 
            v.meaning.toLowerCase().includes(search.toLowerCase())
          )
        );

      const matchesLevel = levelFilter === 'All' || p.cefr === levelFilter;

      const isCompleted = progress.completedPassages.includes(p.id);
      const matchesStatus = 
        statusFilter === 'All' ||
        (statusFilter === 'Completed' && isCompleted) ||
        (statusFilter === 'Remaining' && !isCompleted);

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [combinedPassages, progress.completedPassages, search, levelFilter, statusFilter]);

  return (
    <div id="passage-list-container" className="space-y-8">
      
      {/* Header and Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center bg-white border border-editorial-border/40 p-8 shadow-xs">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-serif font-extrabold text-editorial-text flex items-center gap-2">
            Müfredat Okuma Parçaları Kütüphanesi
          </h2>
          <p className="text-xs text-editorial-text/50 font-serif italic">
            YDS, YÖKDİL ve YKS-DİL çalışma programınızdaki orijinal okuma parçaları ve kelimeler.
          </p>
        </div>
        
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-editorial-text/40" />
          <input
            type="text"
            placeholder="Başlık, tema veya kelimelerde ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-editorial-border/30 bg-editorial-bg focus:bg-white focus:outline-hidden focus:border-editorial-accent transition-all font-sans text-xs sm:text-sm text-editorial-text"
          />
        </div>
      </div>

      {/* Filter Tabs Grid */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        
        {/* CEFR Level Filters */}
        <div className="flex flex-wrap gap-1 bg-editorial-bg p-1 border border-editorial-border/30">
          {['All', 'A1', 'A2', 'B1', 'B2', 'C1'].map(level => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={`px-3.5 py-2 text-[10px] font-bold tracking-wide transition-all cursor-pointer font-mono ${
                levelFilter === level
                  ? 'bg-editorial-accent text-white font-bold'
                  : 'text-editorial-text/60 hover:text-editorial-text hover:bg-white/50'
              }`}
            >
              {level === 'All' ? 'TÜM SEVİYELER' : level}
            </button>
          ))}
        </div>

        {/* Completion Status Filters */}
        <div className="flex flex-wrap gap-1 bg-editorial-bg p-1 border border-editorial-border/30">
          {[
            { id: 'All', label: 'TÜM PARÇALAR' },
            { id: 'Remaining', label: 'ÇALIŞILACAKLAR' },
            { id: 'Completed', label: 'TAMAMLANANLAR' }
          ].map(status => (
            <button
              key={status.id}
              onClick={() => setStatusFilter(status.id)}
              className={`px-3.5 py-2 text-[10px] font-bold tracking-wide transition-all cursor-pointer font-mono ${
                statusFilter === status.id
                  ? 'bg-editorial-accent text-white font-bold'
                  : 'text-editorial-text/60 hover:text-editorial-text hover:bg-white/50'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

      </div>

      {/* Passages Grid */}
      {filteredPassages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPassages.map(p => {
            const isCompleted = progress.completedPassages.includes(p.id);
            const isFavorite = progress.favoritePassages.includes(p.id);
            const scoreDetail = progress.scores[p.id];

            // Badges color coding matching editorial styles
            let cefrBadgeStyle = '';
            if (p.cefr === 'A1' || p.cefr === 'A2') {
              cefrBadgeStyle = 'bg-[#E1F5FE] text-[#01579B]';
            } else if (p.cefr === 'B1' || p.cefr === 'B2') {
              cefrBadgeStyle = 'bg-[#FFF3E0] text-[#E65100]';
            } else {
              cefrBadgeStyle = 'bg-[#F3E5F5] text-[#4A148C]';
            }

            return (
              <div
                key={p.id}
                className={`group flex flex-col justify-between border p-6 transition-all duration-300 bg-white hover:shadow-md ${
                  isCompleted 
                    ? 'border-emerald-600/40 bg-emerald-50/5 hover:border-emerald-600' 
                    : 'border-editorial-border/40 hover:border-editorial-accent'
                }`}
              >
                <div>
                  {/* Header Row */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold font-mono text-editorial-text/40">
                        #{String(p.id).padStart(3, '0')}
                      </span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold font-mono tracking-wider uppercase rounded-xs ${cefrBadgeStyle}`}>
                        {p.cefr} LEVEL
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(p.id);
                        }}
                        className="p-1 rounded-xs hover:bg-editorial-bg transition-colors group/fav"
                        title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                      >
                        <Star className={`h-4.5 w-4.5 transition-all ${
                          isFavorite 
                            ? 'text-amber-500 fill-amber-400 scale-110' 
                            : 'text-editorial-text/30 hover:text-amber-500 group-hover/fav:scale-110'
                        }`} />
                      </button>
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-[8px] text-emerald-800 bg-emerald-50 border border-emerald-200/50 font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-xs">
                          <CheckCircle2 className="h-2.5 w-2.5 fill-emerald-600 text-white" /> OKUNDU
                        </span>
                      ) : !p.isLoaded ? (
                        <span className="flex items-center gap-1 text-[8px] text-amber-800 bg-amber-50 border border-amber-200/50 font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-xs" title="Google Search destekli Yapay Zeka ile orijinal kitaptan yüklenecektir">
                          <Sparkles className="h-2.5 w-2.5 text-amber-600 animate-pulse" /> AI-YÜKLE
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[8px] text-sky-800 bg-sky-50 border border-sky-200/50 font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-xs">
                          HAZIR
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Theme */}
                  <div className="space-y-1">
                    <h4 className="text-lg font-serif font-extrabold text-editorial-text leading-snug group-hover:text-editorial-accent transition-colors line-clamp-2 min-h-[3.5rem]">
                      {p.title}
                    </h4>
                    <p className="text-[9px] text-editorial-accent/70 font-bold uppercase tracking-widest font-mono">
                      📚 {p.theme}
                    </p>
                  </div>

                  {/* Snippet */}
                  <p className="text-editorial-text/70 text-xs mt-3.5 line-clamp-2 leading-relaxed font-serif">
                    {p.paragraphs[0]}
                  </p>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 gap-2 mt-4.5 pt-3.5 border-t border-editorial-border/20 text-[9px] text-editorial-text/40 font-bold tracking-wide uppercase">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 opacity-60" />
                      <span>{p.vocabulary.length} KELİME</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-right justify-end font-mono">
                      <span>{p.questions.length} TEST SORUSU</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Section */}
                <div className="mt-6 pt-4 border-t border-editorial-border/20 flex items-center justify-between">
                  {scoreDetail ? (
                    <div className="text-xs">
                      <span className="text-editorial-text/40 font-bold tracking-wider text-[8px] uppercase">SKOR:</span>{' '}
                      <span className="font-bold text-editorial-text font-mono text-xs text-emerald-800">
                        {scoreDetail.score}/{scoreDetail.total}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-editorial-text/40 font-mono uppercase tracking-wider">
                      ⏳ ÇALIŞILMADI
                    </span>
                  )}

                  <button
                    onClick={() => onSelectPassage(p.id)}
                    className="px-4 py-2 text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer font-mono uppercase tracking-wider bg-editorial-accent text-white border border-editorial-accent hover:bg-white hover:text-editorial-text"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    {isCompleted ? 'TEKRAR ÇALIŞ' : 'OKUMAYA BAŞLA'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 bg-white border border-editorial-border/40 text-center">
          <BookOpen className="h-12 w-12 text-editorial-text/20 mb-3" />
          <p className="text-base font-serif font-bold text-editorial-text">Hiç okuma parçası bulunamadı.</p>
          <p className="text-xs text-editorial-text/50 max-w-sm mt-1 font-serif italic">
            Seçtiğiniz filtreleri veya arama kriterlerini değiştirerek tekrar aramayı deneyebilirsiniz.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setLevelFilter('All');
              setStatusFilter('All');
            }}
            className="mt-5 px-5 py-2 bg-editorial-accent text-white text-xs font-bold hover:bg-white hover:text-editorial-text border border-editorial-accent transition-colors cursor-pointer"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}
    </div>
  );
}
