/**
 * OKUMA PARÇALARI
 *
 * IZGARA DEĞİL LİSTE. Yüz parça üç sütunlu kart ızgarasındaydı. Her kart
 * beş katlı bir kutuydu (numara+rozet satırı / başlık / tema / alıntı /
 * ölçüler / eylem çubuğu), aralarında ayraç çizgileriyle. Yüz tanesi yan
 * yana gelince ekran "kutu içinde kutu" desenine dönüşüyor ve asıl iş —
 * aradığın parçayı bulmak — zorlaşıyordu. Başlıklar da iki satırda
 * kırpılıyordu (`min-h-[3.5rem]` ile zorla eşitlenmişti).
 *
 * Alt alta satırlarda başlık tam genişliği kullanıyor, göz tek bir sol
 * kenarı takip ediyor ve bir ekrana üç kat fazla parça sığıyor.
 *
 * ROZET ENFLASYONU TEMİZLENDİ. Bir kartta aynı anda şunlar olabiliyordu:
 * "#012", "B2 LEVEL", "OKUNDU", "10 KELİME", "5 TEST SORUSU", "TEST:",
 * "ALIŞTIRMA:", "OKUMAYA BAŞLA" — sekiz büyük harf etiket, dördü renkli
 * hap (zümrüt / kehribar / gök mavisi / mor). Renk hiçbirinde bilgi
 * taşımıyordu; seviye zaten harfin kendisinde yazıyor.
 *
 * DURUM YALNIZCA VARSA GÖRÜNÜR. "ÇALIŞILMADI" diye bir rozet vardı;
 * varsayılan hâli etiketlemek gürültüden başka bir şey değil.
 */

import { useState, useMemo } from 'react';
import { Search, Check, Star } from 'lucide-react';
import { Passage, UserProgress } from '../types';
import { PASSAGE_CATALOG } from '../data/passageCatalog';

interface PassageListProps {
  passages: Passage[];
  progress: UserProgress;
  onSelectPassage: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

const LEVELS = ['All', 'A1', 'A2', 'B1', 'B2', 'C1'];
const STATUSES = [
  { id: 'All', label: 'Tümü' },
  { id: 'Remaining', label: 'Çalışılacak' },
  { id: 'Completed', label: 'Tamamlanan' },
];

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
        paragraphs: loaded ? loaded.paragraphs : [`Okuma Parçası #${catItem.id}`],
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

  /** Segment düğmesi — aktif olan açık gri hap, üst gezinmeyle aynı dil. */
  const segment = (
    label: string,
    isActive: boolean,
    onClick: () => void
  ) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1.5 text-[12px] transition-colors duration-150 cursor-pointer ${
        isActive ? 'bg-paper-2 font-medium text-ink' : 'text-ink-2 hover:text-ink'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div id="passage-list-container" className="space-y-5">

      <div className="flex items-baseline justify-between gap-3">
        <h1 className="text-[22px] font-semibold tracking-tight text-brand">Okuma Parçaları</h1>
        <span className="text-[12px] text-ink-3">
          <span className="timecode text-ink">{filteredPassages.length}</span>
          {filteredPassages.length !== combinedPassages.length && ` / ${combinedPassages.length}`} parça
        </span>
      </div>

      {/* Arama ve filtreler — tek satır, hepsi aynı sakinlikte */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
          <input
            type="text"
            placeholder="Başlık, tema veya kelime ara…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-hairline bg-paper-2 py-2.5 pl-9 pr-3
              text-[13px] text-ink placeholder-ink-3 transition-colors
              focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-0.5 rounded-xl bg-paper-3 p-1">
            {LEVELS.map(level =>
              segment(
                level === 'All' ? 'Tüm seviyeler' : level,
                levelFilter === level,
                () => setLevelFilter(level)
              )
            )}
          </div>

          <div className="flex flex-wrap gap-0.5 rounded-xl bg-paper-3 p-1">
            {STATUSES.map(s =>
              segment(s.label, statusFilter === s.id, () => setStatusFilter(s.id))
            )}
          </div>
        </div>
      </div>

      {/* Liste */}
      {filteredPassages.length > 0 ? (
        <ul className="divide-y divide-hairline border-y border-hairline">
          {filteredPassages.map(p => {
            const isCompleted = progress.completedPassages.includes(p.id);
            const isFavorite = progress.favoritePassages.includes(p.id);
            const scoreDetail = progress.scores[p.id];
            const exerciseDetail = progress.exerciseScores?.[p.id];

            /**
             * "Okundu" yalnizca ANLAMA TESTI gonderildiginde isaretleniyor.
             * Parcayi okuyup kelimelerini calisan ama testi cozmemis
             * kullaniciya kart "hic calisilmadi" diyordu. Elimizdeki tum
             * izlere bakip ara bir durum gosteriyoruz.
             */
            const studiedWordCount = (p.vocabulary || []).filter(
              (w) => {
                const status = progress.wordStatus[w.term];
                return status === 'studied' || status === 'learned';
              }
            ).length;
            const hasActivity = !!exerciseDetail || studiedWordCount > 0;

            return (
              <li key={p.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectPassage(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectPassage(p.id);
                    }
                  }}
                  className="group flex cursor-pointer items-baseline gap-3 px-3 py-3
                    transition-colors duration-150 hover:bg-paper-3"
                >
                  <span className="timecode w-9 shrink-0 text-ink-3">
                    {String(p.id).padStart(3, '0')}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <h3 className={`min-w-0 flex-1 truncate text-[14px] font-medium ${
                        isCompleted ? 'text-ink-2' : 'text-ink'
                      }`}>
                        {p.title}
                      </h3>

                      {/* Durum. Varsayilan hal etiketlenmiyor. */}
                      {isCompleted ? (
                        <span className="flex shrink-0 items-center gap-1 text-[11px] text-emerald-700">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          okundu
                        </span>
                      ) : hasActivity ? (
                        <span className="shrink-0 text-[11px] text-ink-2">çalışılıyor</span>
                      ) : !p.isLoaded ? (
                        <span
                          className="shrink-0 text-[11px] text-ink-3"
                          title="Parça ilk açılışta yapay zekâ ile kitaptan yüklenir"
                        >
                          yüklenecek
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-ink-3">
                      <span className="rounded bg-paper-3 px-1.5 py-0.5 font-medium text-ink-2 group-hover:bg-paper-2">
                        {p.cefr}
                      </span>
                      <span className="min-w-0 truncate">{p.theme}</span>
                      <span>·</span>
                      <span className="timecode">{p.vocabulary.length} kelime</span>
                      <span>·</span>
                      <span className="timecode">{p.questions.length} soru</span>

                      {scoreDetail && (
                        <>
                          <span>·</span>
                          <span>
                            test{' '}
                            <span className="timecode text-ink-2">
                              {scoreDetail.score}/{scoreDetail.total}
                            </span>
                          </span>
                        </>
                      )}
                      {exerciseDetail && (
                        <>
                          <span>·</span>
                          <span>
                            alıştırma{' '}
                            <span className="timecode text-ink-2">
                              {exerciseDetail.score}/{exerciseDetail.total}
                            </span>
                          </span>
                        </>
                      )}
                      {!scoreDetail && !exerciseDetail && studiedWordCount > 0 && (
                        <>
                          <span>·</span>
                          <span>
                            <span className="timecode text-ink-2">{studiedWordCount}</span> kelime çalışıldı
                          </span>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Favori. Isaretliyse hep gorunur; degilse fare ustunde.
                      `row-actions` dokunmatikte surekli aciyor (index.css). */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(p.id); }}
                    title={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                    aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                    aria-pressed={isFavorite}
                    className={`row-actions shrink-0 rounded-lg p-1.5 transition-all cursor-pointer
                      hover:bg-paper-2 ${
                        isFavorite
                          ? 'text-amber-500 opacity-100'
                          : 'text-ink-3 opacity-0 focus:opacity-100 group-hover:opacity-100'
                      }`}
                  >
                    <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-2xl border border-hairline p-10 text-center">
          <p className="text-[14px] font-medium text-ink">Eşleşen parça yok.</p>
          <p className="mx-auto mt-1 max-w-[46ch] text-[13px] leading-relaxed text-ink-2">
            Arama terimini ya da seçili filtreleri değiştirmeyi dene.
          </p>
          <button
            type="button"
            onClick={() => { setSearch(''); setLevelFilter('All'); setStatusFilter('All'); }}
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
