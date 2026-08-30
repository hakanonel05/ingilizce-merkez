import { useState, useMemo } from 'react';
import { UserProgress, Passage, CEFRLevel } from '../types';
import { BookOpen, Award, CheckCircle, Zap, TrendingUp, RefreshCw, Star, Clock } from 'lucide-react';
import { motion } from 'motion/react';
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

  return (
    <div id="dashboard-container" className="space-y-8">
      {/* Welcome Banner */}
      <div id="welcome-banner" className="relative bg-accent p-10 text-white border border-hairline overflow-hidden rounded-2xl">
        {/* Buradaki dev "L" filigrani KALDIRILDI. Editoryal dilin bir
            parcasiydi: Playfair'in serif harf bicimi kose susu olarak
            calisiyordu. Inter'e gecince duz bir sans "L"ye dondu ve
            overflow-hidden onu kestigi icin ekranda anlamsiz bir
            dikdortgen gibi duruyordu. Katmanlida da boyle bir sus yok. */}

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-lg">
              <Award className="h-3.5 w-3.5" /> AKILLI ÖĞRENME PLATFORMU
            </span>
            <h1 className="text-3xl font-display font-bold tracking-tight md:text-5xl leading-tight">
              Tekrar Hoş Geldiniz, <br /><span className="font-normal text-white/90">Gelişiminizi Keşfedin.</span>
            </h1>
            <p className="text-white/90 text-sm md:text-base leading-relaxed font-display">
              "100 Reading Passages" kitabındaki zengin okuma parçalarını seviye seviye okuyun, kelimeleri pratik ederek hafızanıza kazıyın. İlerlemenizi buradan takip edebilirsiniz.
            </p>
          </div>
          
          {/* Daily Streak Card */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/15 p-5 backdrop-blur-md self-start md:self-auto min-w-[220px] rounded-xl">
            <div className="flex h-12 w-12 items-center justify-center bg-amber-400/15 text-amber-300 border border-amber-300/30 rounded-lg">
              <Zap className="h-7 w-7 fill-amber-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/90 font-bold tracking-widest uppercase">GÜNLÜK SERİ</p>
              <p className="text-3xl font-display font-bold text-amber-300">{progress.dailyStreak} Gün</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div id="main-stats-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Passages Completion Card */}
        <div className="bg-white border border-hairline/40 p-8 flex flex-col justify-between shadow-xs rounded-xl">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <h3 className="text-[10px] font-bold text-ink-3 uppercase tracking-widest">OKUMA PARÇALARI</h3>
              <p className="text-xl font-display font-bold text-ink">{completedPassagesCount} / {totalPassages} Tamamlandı</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center bg-paper text-ink border border-hairline/40 rounded-lg">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
          </div>
          
          {/* SVG Circular Progress */}
          <div className="my-8 flex justify-center">
            <div className="relative h-28 w-28">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <circle
                  className="text-paper"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="none"
                  cx="18"
                  cy="18"
                  r="15.9155"
                />
                <circle
                  className="text-accent transition-all duration-1000 ease-out"
                  strokeDasharray={`${completedPercent}, 100`}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  cx="18"
                  cy="18"
                  r="15.9155"
                  transform="rotate(-90 18 18)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-display font-bold text-ink">{completedPercent}%</span>
                <span className="text-[9px] text-ink-3 font-bold tracking-widest uppercase">BAŞARI</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between text-xs text-ink/60">
              <span className="font-medium">Kalan Parça Sayısı:</span>
              <span className="font-bold font-mono">{totalPassages - completedPassagesCount}</span>
            </div>
            <div className="h-1 bg-paper overflow-hidden">
              <div className="h-full bg-accent transition-all duration-500" style={{ width: `${completedPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Vocabulary Mastery Card */}
        <div className="bg-white border border-hairline/40 p-8 flex flex-col justify-between shadow-xs rounded-xl">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <h3 className="text-[10px] font-bold text-ink-3 uppercase tracking-widest">KELİME DAĞARCIĞI</h3>
              <p className="text-xl font-display font-bold text-ink">{wordsStatusStats.learned} / {totalWordsCount} Öğrenildi</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center bg-paper text-ink border border-hairline/40 rounded-lg">
              <CheckCircle className="h-4.5 w-4.5" />
            </div>
          </div>

          {/* Stacked Progress Bar */}
          <div className="my-8 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold tracking-tight">
                <span className="text-emerald-700 flex items-center gap-1">Öğrenildi: {wordsStatusStats.learned} ({learnedPercent}%)</span>
                <span className="text-amber-700 flex items-center gap-1">Çalışılıyor: {wordsStatusStats.studied} ({studiedPercent}%)</span>
              </div>
              <div className="flex h-2.5 w-full overflow-hidden bg-paper">
                <div className="bg-emerald-600 transition-all duration-500" style={{ width: `${learnedPercent}%` }} title="Öğrenildi" />
                <div className="bg-amber-500 transition-all duration-500" style={{ width: `${studiedPercent}%` }} title="Çalışılıyor" />
                <div className="bg-ink/10 transition-all duration-500" style={{ width: `${unstudiedPercent}%` }} title="Çalışılmadı" />
              </div>
            </div>
            <p className="text-[11px] text-ink-3 text-center font-display">
              Okuma parçalarını çözdükçe ve kelime kartlarıyla çalıştıkça bu oranlar güncellenir.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-hairline/20 pt-4">
            <div>
              <p className="text-ink-3 font-bold tracking-wider text-[10px] uppercase">Öğrenilen</p>
              <p className="text-base font-display font-bold text-emerald-600 mt-0.5">{wordsStatusStats.learned}</p>
            </div>
            <div>
              <p className="text-ink-3 font-bold tracking-wider text-[10px] uppercase">Çalışılan</p>
              <p className="text-base font-display font-bold text-amber-500 mt-0.5">{wordsStatusStats.studied}</p>
            </div>
            <div>
              <p className="text-ink-3 font-bold tracking-wider text-[10px] uppercase">Kalan</p>
              <p className="text-base font-display font-bold text-ink/60 mt-0.5">{wordsStatusStats.unstudied}</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics Card */}
        <div className="bg-white border border-hairline/40 p-8 flex flex-col justify-between shadow-xs rounded-xl">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <h3 className="text-[10px] font-bold text-ink-3 uppercase tracking-widest">PERFORMANS VE SÜRE</h3>
              <p className="text-xl font-display font-bold text-ink">Doğruluk: {avgAccuracy}%</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center bg-paper text-ink border border-hairline/40 rounded-lg">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>

          {/* Sub metrics list */}
          <div className="my-6 space-y-3">
            <div className="flex items-center justify-between border-b border-hairline/20 pb-2.5">
              <div className="flex items-center gap-2 text-ink/70">
                <Clock className="h-4 w-4 opacity-60" />
                <span className="text-xs font-semibold">Toplam Süre</span>
              </div>
              <span className="text-xs font-bold font-mono">{formatTime(progress.totalTimeSpent)}</span>
            </div>

            <div className="flex items-center justify-between border-b border-hairline/20 pb-2.5">
              <div className="flex items-center gap-2 text-ink/70">
                <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
                <span className="text-xs font-semibold">Favori Parçalarım</span>
              </div>
              <span className="text-xs font-bold font-mono">{progress.favoritePassages.length} Adet</span>
            </div>

            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2 text-ink/70">
                <Award className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-semibold">Başarı Puanı</span>
              </div>
              <span className="text-xs font-bold font-display">
                {avgAccuracy >= 85 ? '👑 Mükemmel' : avgAccuracy >= 60 ? '👍 İyi' : progress.completedPassages.length === 0 ? '🆕 Yeni' : '✍️ Geliştirilmeli'}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-ink-3 text-center font-display border-t border-hairline/20 pt-3">
            Puanlar tamamladığınız testlerin doğruluk derecelerine göre ölçülür.
          </p>
        </div>

      </div>

      {/* CEFR Level Breakdown & Kelime Tekrar Arena */}
      <div id="secondary-stats-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CEFR Seviye Dağılımı */}
        <div className="bg-white border border-hairline/40 p-8 shadow-xs rounded-xl">
          <h3 className="text-xl font-display font-bold text-ink mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" /> CEFR Seviye İlerlemesi
          </h3>
          <div className="space-y-5">
            {(Object.keys(cefrCompleted) as CEFRLevel[]).map(level => {
              const { completed, total } = cefrCompleted[level];
              const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
              
              // Custom styled editorial colors matching template
              let cefrBadgeStyle = '';
              let fillStyle = 'bg-accent';
              if (level.startsWith('A')) {
                cefrBadgeStyle = 'bg-sky-50 text-sky-700';
              } else if (level.startsWith('B')) {
                cefrBadgeStyle = 'bg-amber-50 text-amber-800';
              } else {
                cefrBadgeStyle = 'bg-violet-50 text-violet-800';
              }

              return (
                <div key={level} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-ink flex items-center gap-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider font-sans ${cefrBadgeStyle}`}>
                        {level}
                      </span> 
                      <span className="font-display">
                        {level === 'A1' ? 'Başlangıç (Beginner)' :
                         level === 'A2' ? 'Temel (Elementary)' :
                         level === 'B1' ? 'Orta (Intermediate)' :
                         level === 'B2' ? 'Üst Orta (Upper-Int)' : 'İleri Seviye (Advanced)'}
                      </span>
                    </span>
                    <span className="text-ink-3 font-bold font-mono">{completed} / {total} ({percent}%)</span>
                  </div>
                  <div className="h-1 bg-paper overflow-hidden">
                    <div className={`h-full ${fillStyle} transition-all duration-500`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Vocabulary Review Card */}
        <div className="bg-white border border-hairline/40 p-8 shadow-xs flex flex-col justify-between rounded-xl">
          <div>
            <h3 className="text-xl font-display font-bold text-ink mb-2 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-amber-500" /> Hızlı Kelime Tekrarı
            </h3>
            <p className="text-xs text-ink-3 mb-6 leading-relaxed font-display">
              "Çalışılıyor" olarak işaretlediğiniz ama henüz tam "Öğrenilmedi" durumundaki kelimelerinizi hızlıca gözden geçirin:
            </p>

            {wordsToReview.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wordsToReview.map(w => (
                  <div 
                    key={w.term} 
                    onClick={() => onSelectPassage(w.passageId)}
                    className="group border border-hairline/30 bg-paper p-4 hover:border-accent transition-all duration-300 cursor-pointer flex flex-col justify-between rounded-xl"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-display font-bold text-sm text-ink group-hover:text-accent transition-colors">{w.term}</span>
                        <span className="text-[9px] bg-white border border-hairline/30 text-ink/60 font-bold px-1.5 py-0.5 rounded-xs font-mono uppercase">{w.partOfSpeech}</span>
                      </div>
                      <p className="text-xs text-ink/70 line-clamp-2 leading-relaxed">{w.meaning}</p>
                    </div>
                    <span className="text-[9px] text-ink-3 block mt-3 truncate group-hover:text-ink/60 transition-colors">Parça: <span className="font-display font-semibold">{w.passageTitle}</span></span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 bg-paper border border-hairline/10 text-center space-y-2 rounded-2xl">
                <Award className="h-10 w-10 text-ink/20" />
                <p className="text-xs text-ink font-semibold">Hızlı tekrar listesi boş.</p>
                <p className="text-[11px] text-ink-3 max-w-xs mt-1 leading-relaxed font-display">
                  Çalıştığınız parçalardaki kelimeleri 'Çalıştım' olarak işaretlerseniz, burada hızlı tekrar kartları belirir.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-hairline/20 pt-5 flex justify-between items-center text-xs text-ink-3">
            <span className="font-display">Veriler yerel tarayıcı hafızasında saklanır.</span>
            <button
              onClick={() => setShowConfirmReset(true)}
              className="text-red-600 hover:text-red-800 font-bold tracking-wider uppercase text-[10px] hover:underline"
            >
              İlerlemeyi Sıfırla
            </button>
          </div>
        </div>

      </div>

      {/* Confirm Reset Progress Dialog */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-accent/30 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white p-8 border border-accent shadow-xl space-y-5 rounded-xl">
            <h4 className="text-xl font-display font-bold text-ink">İlerlemeyi Sıfırla?</h4>
            <p className="text-xs text-ink/70 leading-relaxed font-display">
              Uygulamadaki tüm tamamlanan okuma parçaları, test skorları ve öğrenilen kelime istatistikleriniz sıfırlanacaktır. Bu işlem geri alınamaz. Emin misiniz?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="border border-hairline/40 hover:bg-paper px-4 py-2 text-xs font-bold text-ink transition-colors cursor-pointer rounded-lg"
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  onResetProgress();
                  setShowConfirmReset(false);
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer rounded-lg"
              >
                Evet, Sıfırla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

