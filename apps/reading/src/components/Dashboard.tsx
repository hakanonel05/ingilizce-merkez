/**
 * GÖSTERGE PANELİ — READING
 *
 * KARŞILAMA AFİŞİ KALDIRILDI. Ekranın tepesinde dolu menekşe zeminli,
 * 48px'lik "Tekrar Hoş Geldiniz, Gelişiminizi Keşfedin" başlığı ve içine
 * gömülü bir seri kartı vardı. Bir pazarlama sayfasının açılışıydı; oysa
 * burası her gün açılan bir çalışma ekranı ve o afiş her açılışta asıl
 * sayıları katlamanın altına itiyordu. Seri ve süre zaten üst çubukta.
 *
 * ÜÇ SİMETRİK KART BİRLEŞTİ. Okuma / kelime / performans üç ayrı kartta
 * üç ayrı grafik diliyle anlatılıyordu: dairesel SVG, yığılmış çubuk ve
 * ikonlu liste. Yan yana üç farklı idiom karşılaştırmayı imkânsız
 * kılıyor. Şimdi üç sayı tek satırda (kutusuz — büyüklük zaten vurgu),
 * ayrıntı ise konusuna göre iki kartta.
 *
 * CEFR ROZETLERİ NÖTR. Önce A'lar gök mavisi, B'ler kehribar, C'ler mor
 * idi: paletin dışından üç renk. Seviye zaten harfin kendisinde yazıyor.
 *
 * EMOJİ PUANLAR GİTTİ. Başarı "👑 Mükemmel / 👍 İyi / 🆕 Yeni" diye
 * gösteriliyordu; ölçülen bir yüzdeyi emojiye çevirmek bilgiyi
 * azaltıyordu.
 */

import { useState, useMemo, type ReactNode } from "react";
import { UserProgress, Passage, CEFRLevel } from '../types';
import { Clock, Star } from 'lucide-react';
import { PASSAGE_CATALOG } from '../data/passageCatalog';

interface DashboardProps {
  progress: UserProgress;
  passages: Passage[];
  onSelectPassage: (id: number) => void;
  onResetProgress: () => void;
}

export default function Dashboard({ progress, passages, onSelectPassage, onResetProgress }: DashboardProps) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Math metrics
  const totalPassages = PASSAGE_CATALOG.length;
  const completedPassagesCount = progress.completedPassages.length;
  const completedPercent = totalPassages > 0 ? Math.round((completedPassagesCount / totalPassages) * 100) : 0;

  // Words metrics
  const allWords = useMemo(() => {
    const list: { term: string; meaning: string; partOfSpeech: string; passageTitle: string; passageId: number }[] = [];
    passages.forEach(p => {
      if (!p) return;
      (p.vocabulary ?? []).forEach(w => {
        // Prevent duplicate terms if any, but associate with passage
        if (!list.some(item => item.term === w.term)) {
          list.push({
            term: w.term,
            meaning: w.meaning,
            partOfSpeech: w.partOfSpeech,
            passageTitle: p.title,
            passageId: p.id
          });
        }
      });
    });
    return list;
  }, [passages]);

  const totalWordsCount = allWords.length;
  const wordsStatusStats = useMemo(() => {
    let unstudied = 0;
    let studied = 0;
    let learned = 0;

    allWords.forEach(w => {
      const status = progress.wordStatus[w.term] || 'unstudied';
      if (status === 'unstudied') unstudied++;
      else if (status === 'studied') studied++;
      else if (status === 'learned') learned++;
    });

    return { unstudied, studied, learned };
  }, [allWords, progress.wordStatus]);

  const studiedPercent = totalWordsCount > 0 ? Math.round((wordsStatusStats.studied / totalWordsCount) * 100) : 0;
  const learnedPercent = totalWordsCount > 0 ? Math.round((wordsStatusStats.learned / totalWordsCount) * 100) : 0;
  const unstudiedPercent = 100 - studiedPercent - learnedPercent;

  // Average test score
  const avgAccuracy = useMemo(() => {
    const scoresArray = Object.values(progress.scores);
    if (scoresArray.length === 0) return 0;
    const totalPercentage = scoresArray.reduce((acc, curr) => {
      return acc + (curr.score / curr.total) * 100;
    }, 0);
    return Math.round(totalPercentage / scoresArray.length);
  }, [progress.scores]);

  // CEFR Distribution of Completed Passages
  const cefrCompleted = useMemo(() => {
    const dist: Record<CEFRLevel, { completed: number; total: number }> = {
      A1: { completed: 0, total: 0 },
      A2: { completed: 0, total: 0 },
      B1: { completed: 0, total: 0 },
      B2: { completed: 0, total: 0 },
      C1: { completed: 0, total: 0 },
    };

    PASSAGE_CATALOG.forEach(p => {
      dist[p.cefr].total++;
      if (progress.completedPassages.includes(p.id)) {
        dist[p.cefr].completed++;
      }
    });

    return dist;
  }, [progress.completedPassages]);

  // Words that are currently being studied but not yet fully learned (Review list)
  const wordsToReview = useMemo(() => {
    return allWords
      .filter(w => progress.wordStatus[w.term] === 'studied')
      .slice(0, 4);
  }, [allWords, progress.wordStatus]);

  // Format time spent
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) {
      return `${mins} dk`;
    }
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs} sa ${remMins} dk`;
  };

  /** Kart yüzeyi — gölge yok, 1px çizgi, yumuşak köşe. */
  const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <section className={`rounded-2xl border border-hairline bg-paper-2 p-5 sm:p-6 ${className}`}>
      {children}
    </section>
  );

  /** Tek bir büyük sayı. Kutu ve ikon yok: büyüklüğün kendisi vurgu. */
  const Stat = ({ label, value, sub }: { label: string; value: string; sub: string }) => (
    <div className="min-w-0 flex-1 px-5 py-4 first:pl-0 last:pr-0">
      <span className="eyebrow">{label}</span>
      <p className="timecode mt-1.5 text-[26px] font-semibold leading-none text-ink">{value}</p>
      <p className="mt-1 truncate text-[12px] text-ink-3">{sub}</p>
    </div>
  );

  const testSayisi = Object.keys(progress.scores).length;

  return (
    <div id="dashboard-container" className="space-y-5">

      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h1 className="text-[22px] font-semibold tracking-tight text-brand">Gösterge Paneli</h1>
        <span className="text-[12px] text-ink-3">
          toplam <span className="timecode text-ink">{formatTime(progress.totalTimeSpent)}</span> çalışma
        </span>
      </div>

      {/* ÜÇ SAYI — tek satır, aralarında yalnızca çizgi */}
      <section className="rounded-2xl border border-hairline bg-paper-2">
        <div className="flex flex-col divide-y divide-hairline px-5 sm:flex-row sm:divide-x sm:divide-y-0">
          <Stat
            label="Okuma Parçaları"
            value={`${completedPassagesCount}/${totalPassages}`}
            sub={`%${completedPercent} tamamlandı`}
          />
          <Stat
            label="Kelime"
            value={`${wordsStatusStats.learned}/${totalWordsCount}`}
            sub={`%${learnedPercent} öğrenildi`}
          />
          <Stat
            label="Test Doğruluğu"
            value={testSayisi > 0 ? `%${avgAccuracy}` : '—'}
            sub={testSayisi > 0 ? `${testSayisi} testin ortalaması` : 'henüz test çözülmedi'}
          />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">

        {/* OKUMA — genel ilerleme ve seviye dağılımı AYNI konu, tek kart */}
        <Card>
          <h2 className="text-[15px] font-semibold text-ink">Okuma ilerlemesi</h2>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-paper-3">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{ width: `${completedPercent}%` }}
            />
          </div>
          <p className="mt-2 text-[12px] text-ink-3">
            {totalPassages - completedPassagesCount} parça kaldı
          </p>

          <div className="mt-6 space-y-4">
            {(Object.keys(cefrCompleted) as CEFRLevel[]).map(level => {
              const { completed, total } = cefrCompleted[level];
              const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
              const adi =
                level === 'A1' ? 'Başlangıç' :
                level === 'A2' ? 'Temel' :
                level === 'B1' ? 'Orta' :
                level === 'B2' ? 'Üst orta' : 'İleri';

              return (
                <div key={level}>
                  <div className="flex items-baseline justify-between gap-2 text-[12px]">
                    <span className="flex min-w-0 items-baseline gap-2">
                      <span className="rounded bg-paper-3 px-1.5 py-0.5 text-[11px] font-medium text-ink-2">
                        {level}
                      </span>
                      <span className="truncate text-ink-2">{adi}</span>
                    </span>
                    <span className="timecode shrink-0 text-ink-3">
                      {completed}/{total}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-paper-3">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* KELİME */}
        <Card>
          <h2 className="text-[15px] font-semibold text-ink">Kelime dağarcığı</h2>
          <p className="mt-1 text-[12px] text-ink-3">
            Parçaları çözdükçe ve kartlarla çalıştıkça güncellenir.
          </p>

          {/* Üç durumun tek şeridi. Renk burada VERİ: öğrenildi ile
              çalışılıyor birbirinden ayrılmak zorunda. */}
          <div className="mt-5 flex h-2 w-full overflow-hidden rounded-full bg-paper-3">
            <div className="bg-emerald-600 transition-all duration-500" style={{ width: `${learnedPercent}%` }} title="Öğrenildi" />
            <div className="bg-amber-500 transition-all duration-500" style={{ width: `${studiedPercent}%` }} title="Çalışılıyor" />
          </div>

          <dl className="mt-5 space-y-2.5">
            {([
              ['Öğrenildi', wordsStatusStats.learned, 'bg-emerald-600'],
              ['Çalışılıyor', wordsStatusStats.studied, 'bg-amber-500'],
              ['Henüz görülmedi', wordsStatusStats.unstudied, 'bg-paper-3'],
            ] as [string, number, string][]).map(([label, count, dot]) => (
              <div key={label} className="flex items-center justify-between text-[13px]">
                <dt className="flex items-center gap-2 text-ink-2">
                  <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${dot}`} />
                  {label}
                </dt>
                <dd className="timecode font-medium text-ink">{count}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 space-y-2.5 border-t border-hairline pt-4 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-ink-2">
                <Clock className="h-4 w-4 text-ink-3" />
                Toplam süre
              </span>
              <span className="timecode text-ink">{formatTime(progress.totalTimeSpent)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-ink-2">
                <Star className="h-4 w-4 text-ink-3" />
                Favori parçalar
              </span>
              <span className="timecode text-ink">{progress.favoritePassages.length}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* HIZLI TEKRAR */}
      <Card>
        <h2 className="text-[15px] font-semibold text-ink">Hızlı tekrar</h2>
        <p className="mt-1 max-w-[62ch] text-[12px] leading-relaxed text-ink-3">
          Çalışılıyor olarak işaretlediğin ama henüz öğrenilmemiş kelimeler.
        </p>

        {wordsToReview.length > 0 ? (
          <ul className="mt-4 divide-y divide-hairline border-t border-hairline">
            {wordsToReview.map(w => (
              <li key={w.term}>
                <button
                  type="button"
                  onClick={() => onSelectPassage(w.passageId)}
                  className="group flex w-full items-baseline gap-3 py-3 text-left
                    transition-colors hover:bg-paper-3 cursor-pointer"
                >
                  <span className="w-40 shrink-0 truncate text-[14px] font-medium text-ink
                    transition-colors group-hover:text-accent">
                    {w.term}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px] text-ink-2">
                    {w.meaning}
                  </span>
                  <span className="hidden shrink-0 text-[11px] text-ink-3 sm:block">
                    {w.passageTitle}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 max-w-[62ch] text-[13px] leading-relaxed text-ink-2">
            Liste boş. Bir parçadaki kelimeyi Çalıştım olarak işaretlediğinde
            burada tekrar için belirir.
          </p>
        )}
      </Card>

      {/* Veri notu ve sıfırlama — sayfanın en sonunda, sessiz */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[12px] text-ink-3">
        <span>Veriler bu tarayıcıda saklanıyor.</span>
        <button
          type="button"
          onClick={() => setShowConfirmReset(true)}
          className="text-rose-700 transition-colors hover:text-rose-800 hover:underline cursor-pointer"
        >
          İlerlemeyi sıfırla
        </button>
      </div>

      {/* Sıfırlama onayı */}
      {showConfirmReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowConfirmReset(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-hairline bg-paper-2 p-6"
          >
            <h3 className="text-[17px] font-semibold text-ink">İlerlemeyi sıfırla?</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
              Tamamlanan parçalar, test sonuçları ve kelime durumların silinecek.
              Bu işlem geri alınamaz.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="rounded-xl border border-hairline px-4 py-2 text-[13px] font-medium
                  text-ink-2 transition-colors hover:bg-paper-3 hover:text-ink cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => { onResetProgress(); setShowConfirmReset(false); }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-[13px] font-medium text-white
                  transition-colors hover:bg-rose-700 cursor-pointer"
              >
                Evet, sıfırla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
