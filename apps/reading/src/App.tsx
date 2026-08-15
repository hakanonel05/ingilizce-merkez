import { useState, useEffect, useMemo, useCallback } from 'react';
import { PASSAGES_DATA } from './data/passages';
import { PASSAGE_CATALOG } from './data/passageCatalog';
import { UserProgress, Passage } from './types';
import Dashboard from './components/Dashboard';
import PassageList from './components/PassageList';
import PassageCard from './components/PassageCard';
import VocabularyTrainer from './components/VocabularyTrainer';
import VocabularyList from './components/VocabularyList';
import VocabularyWorkbook from './components/VocabularyWorkbook';
import MistakesNotebook from './components/MistakesNotebook';
import ExamSimulator from './components/ExamSimulator';
import AppSwitcher from './AppSwitcher';
import AuthScreen from './components/AuthScreen';
import { supabase } from './lib/supabase';
import { getLocalFallbackPassage } from '../serverLocalPassage';
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  BookMarked,
  Zap,
  Clock,
  BookOpenCheck,
  BookText,
  Download,
  Upload,
  Smartphone,
  LogOut,
  CloudCog,
  BookX,
  Timer
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'english_reading_trainer_progress_v1';

const INITIAL_PROGRESS: UserProgress = {
  completedPassages: [],
  scores: {},
  wordStatus: {},
  favoritePassages: [],
  dailyStreak: 0,
  lastActiveDate: null,
  totalTimeSpent: 0,
  workbookState: {},
  mistakes: [],
  examHistory: []
};

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'passages' | 'trainer' | 'list' | 'workbook' | 'mistakes' | 'exam'>('dashboard');

  // PWA kurulum prompt'u
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowInstallBtn(false);
    setDeferredPrompt(null);
  };


  // Veri yedekleme — JSON olarak indir
  const handleBackupData = () => {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      progress: JSON.parse(localStorage.getItem('english_reading_trainer_progress_v1') || '{}'),
      generatedPassages: JSON.parse(localStorage.getItem('english_reading_trainer_generated_passages_v1') || '[]'),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lexis-trainer-yedek-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Veri geri yükleme — JSON dosyası yükle
  const handleRestoreData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const backup = JSON.parse(text);
        if (!backup.version || !backup.progress) {
          alert('Geçersiz yedek dosyası!');
          return;
        }
        if (window.confirm('Tüm mevcut çalışma verilerinizin üzerine yazılacak. Devam edilsin mi?')) {
          localStorage.setItem('english_reading_trainer_progress_v1', JSON.stringify(backup.progress));
          if (backup.generatedPassages) {
            localStorage.setItem('english_reading_trainer_generated_passages_v1', JSON.stringify(backup.generatedPassages));
          }
          window.location.reload();
        }
      } catch {
        alert('Dosya okunamadı. Lütfen geçerli bir yedek dosyası seçin.');
      }
    };
    input.click();
  };
  const [selectedPassageId, setSelectedPassageId] = useState<number | null>(null);

  // Initialize passages with predefined offline data + any custom generated passages from cache
  const [passages, setPassages] = useState<Passage[]>(() => {
    try {
      const stored = localStorage.getItem('english_reading_trainer_generated_passages_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const validPassages = parsed.filter((p): p is Passage => !!p && typeof p === 'object' && typeof (p as any).id === 'number' && Array.isArray((p as any).paragraphs));
          const seen = new Set(PASSAGES_DATA.map(x => x.id));
          return [...PASSAGES_DATA, ...validPassages.filter(p => !seen.has(p.id))];
        }
      }
    } catch (e) {
      console.error('Error loading generated passages', e);
    }
    return PASSAGES_DATA;
  });

  // Save generated passages cache to localStorage and Supabase
  useEffect(() => {
    const customPassages = passages.filter(p => p && p.id && !PASSAGES_DATA.some(original => original.id === p.id));
    localStorage.setItem('english_reading_trainer_generated_passages_v1', JSON.stringify(customPassages));

    if (session && customPassages.length > 0) {
      supabase.from('custom_passages').upsert({
        id: session.user.id,
        passages: customPassages,
        updated_at: new Date().toISOString()
      }).then(undefined, console.error);
    }
  }, [passages, session]);

  // Load from Supabase on Session Start
  useEffect(() => {
    if (session) {
      setIsSyncing(true);
      Promise.all([
        supabase.from('custom_passages').select('passages').eq('id', session.user.id).single(),
        supabase.from('user_progress').select('*').eq('id', session.user.id).single()
      ]).then(([customRes, progressRes]) => {
        if (customRes.data?.passages) {
          const cloudPassages = customRes.data.passages;
          if (Array.isArray(cloudPassages)) {
            setPassages(prev => {
              const merged = [...prev];
              cloudPassages.forEach((cp: any) => {
                if (cp && typeof cp === 'object' && typeof cp.id === 'number' && Array.isArray(cp.paragraphs)) {
                  if (!merged.find(p => p?.id === cp.id)) {
                    merged.push(cp);
                  }
                }
              });
              return merged;
            });
          }
        }

        if (progressRes.data) {
          const cp = progressRes.data;
          setProgress(prev => {
             // Merging strategy: simple overwrite for now if cloud is newer (or just overwrite since user wants sync)
             return {
               ...prev,
               completedPassages: cp.completed_passages || prev.completedPassages,
               scores: cp.scores || prev.scores,
               wordStatus: cp.word_status || prev.wordStatus,
               favoritePassages: cp.favorite_passages || prev.favoritePassages,
               dailyStreak: cp.daily_streak || prev.dailyStreak,
               totalTimeSpent: cp.total_time_spent || prev.totalTimeSpent,
               workbookState: cp.workbook_state || prev.workbookState,
             };
          });
        }
      }).finally(() => setIsSyncing(false));
    }
  }, [session]);

  // Initialize progress state with localStorage fallback
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProgress;
        return {
          ...INITIAL_PROGRESS,
          ...parsed
        };
      }
    } catch (e) {
      console.error('Error loading progress from localStorage', e);
    }
    return INITIAL_PROGRESS;
  });

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Save progress to Supabase periodically (debounced to avoid spamming from timer)
  useEffect(() => {
    if (session && !isSyncing) {
      const timeoutId = setTimeout(() => {
        supabase.from('user_progress').upsert({
          id: session.user.id,
          completed_passages: progress.completedPassages,
          scores: progress.scores,
          word_status: progress.wordStatus,
          favorite_passages: progress.favoritePassages,
          daily_streak: progress.dailyStreak,
          total_time_spent: progress.totalTimeSpent,
          workbook_state: progress.workbookState,
          updated_at: new Date().toISOString()
        }).then(undefined, console.error);
      }, 5000); // 5 second debounce
      return () => clearTimeout(timeoutId);
    }
  }, [progress.completedPassages, progress.scores, progress.wordStatus, progress.favoritePassages, progress.workbookState, session, isSyncing]);

  // Track study time using simple interval
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => ({
        ...prev,
        totalTimeSpent: prev.totalTimeSpent + 1
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update Daily Streak on mount
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastActive = progress.lastActiveDate;

    if (lastActive === null) {
      // First time active
      setProgress(prev => ({
        ...prev,
        dailyStreak: 1,
        lastActiveDate: todayStr
      }));
    } else if (lastActive !== todayStr) {
      const lastActiveDateObj = new Date(lastActive);
      const todayDateObj = new Date(todayStr);
      const diffTime = Math.abs(todayDateObj.getTime() - lastActiveDateObj.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive active day
        setProgress(prev => ({
          ...prev,
          dailyStreak: prev.dailyStreak + 1,
          lastActiveDate: todayStr
        }));
      } else if (diffDays > 1) {
        // Streak broken
        setProgress(prev => ({
          ...prev,
          dailyStreak: 1,
          lastActiveDate: todayStr
        }));
      }
    }
  }, []);

  // Reset progress callback
  const handleResetProgress = useCallback(() => {
    setProgress({
      ...INITIAL_PROGRESS,
      lastActiveDate: new Date().toISOString().split('T')[0],
      dailyStreak: 1
    });
    setSelectedPassageId(null);
    setActiveTab('dashboard');
  }, []);

  // Toggle favorite passage
  const handleToggleFavorite = useCallback((passageId: number) => {
    setProgress(prev => {
      const favoritePassages = [...prev.favoritePassages];
      const index = favoritePassages.indexOf(passageId);
      if (index > -1) {
        favoritePassages.splice(index, 1);
      } else {
        favoritePassages.push(passageId);
      }
      return { ...prev, favoritePassages };
    });
  }, []);

  // Update study status of any vocabulary word
  const handleWordStatusChange = useCallback((term: string, status: 'unstudied' | 'studied' | 'learned') => {
    setProgress(prev => {
      const wordStatus = { ...prev.wordStatus, [term]: status };
      return { ...prev, wordStatus };
    });
  }, []);

  // Save comprehension test score
  const handleSaveTestResult = useCallback((passageId: number, score: number, total: number) => {
    setProgress(prev => {
      const completedPassages = [...prev.completedPassages];
      if (!completedPassages.includes(passageId)) {
        completedPassages.push(passageId);
      }

      const scores = {
        ...prev.scores,
        [passageId]: {
          score,
          total,
          timestamp: new Date().toISOString()
        }
      };

      return {
        ...prev,
        completedPassages,
        scores
      };
    });
  }, []);

  // Grade a batch of questions (from a quiz, exercise, or exam) and update
  // the mistakes notebook: wrong answers are added/refreshed, questions the
  // user now gets right are removed (they've caught up).
  const handleGradeQuestions = useCallback((
    passage: { id: number; title: string; cefr: import('./types').CEFRLevel },
    source: 'quiz' | 'exercise' | 'exam',
    results: import('./types').GradedQuestionResult[]
  ) => {
    setProgress(prev => {
      const now = new Date().toISOString();
      let mistakes = [...prev.mistakes];

      results.forEach(r => {
        const key = `${source}-${passage.id}-${r.questionId}`;
        const existingIndex = mistakes.findIndex(m => m.key === key);

        if (r.isCorrect) {
          // No longer a mistake — remove it if it was tracked before.
          if (existingIndex !== -1) {
            mistakes = mistakes.filter(m => m.key !== key);
          }
          return;
        }

        if (existingIndex !== -1) {
          const existing = mistakes[existingIndex];
          mistakes[existingIndex] = {
            ...existing,
            yourAnswer: r.yourAnswer,
            lastMissedAt: now
          };
        } else {
          mistakes.push({
            key,
            passageId: passage.id,
            passageTitle: passage.title,
            cefr: passage.cefr,
            source,
            questionId: r.questionId,
            question: r.question,
            options: r.options,
            correctAnswer: r.correctAnswer,
            yourAnswer: r.yourAnswer,
            firstMissedAt: now,
            lastMissedAt: now,
            reviewCount: 0,
            lastReviewedAt: null
          });
        }
      });

      return { ...prev, mistakes };
    });
  }, []);

  // Mark a mistake as reviewed (called from the practice mode in the notebook)
  const handleReviewMistake = useCallback((key: string, gotItRight: boolean) => {
    setProgress(prev => {
      if (!gotItRight) {
        return {
          ...prev,
          mistakes: prev.mistakes.map(m =>
            m.key === key
              ? { ...m, reviewCount: m.reviewCount + 1, lastReviewedAt: new Date().toISOString() }
              : m
          )
        };
      }
      // Got it right in practice — remove it from the notebook entirely.
      return { ...prev, mistakes: prev.mistakes.filter(m => m.key !== key) };
    });
  }, []);

  // Manually remove a mistake from the notebook ("Artık biliyorum")
  const handleRemoveMistake = useCallback((key: string) => {
    setProgress(prev => ({ ...prev, mistakes: prev.mistakes.filter(m => m.key !== key) }));
  }, []);

  // Save a completed exam simulation attempt
  const handleSaveExamAttempt = useCallback((attempt: import('./types').ExamAttempt) => {
    setProgress(prev => ({
      ...prev,
      examHistory: [attempt, ...prev.examHistory].slice(0, 50)
    }));
  }, []);

  // Dynamic Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingMetadata, setGeneratingMetadata] = useState<{ id: number; title: string; cefr: string } | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Load / Generate Passage
  const handleSelectPassage = useCallback(async (id: number) => {
    const existing = passages.find(p => p?.id === id);
    if (existing) {
      setSelectedPassageId(id);
      setActiveTab('passages');
      return;
    }

    const catalogItem = PASSAGE_CATALOG.find(c => c.id === id);
    if (!catalogItem) {
      console.error(`Passage ID ${id} not found in catalog.`);
      return;
    }

    setIsGenerating(true);
    setGeneratingMetadata({ id: catalogItem.id, title: catalogItem.title, cefr: catalogItem.cefr });
    setGenerationError(null);

    try {
      // Use local fallback generator directly in frontend instead of missing backend API
      // Add a slight delay for better UI feedback
      await new Promise(resolve => setTimeout(resolve, 600));

      const generatedData = getLocalFallbackPassage(
        catalogItem.id,
        catalogItem.title,
        catalogItem.cefr,
        catalogItem.theme
      );

      (generatedData as any).isGenerated = true;

      setPassages(prev => [...prev, generatedData as Passage]);
      setSelectedPassageId(id);
      setActiveTab('passages');
    } catch (err: any) {
      console.error('Error generating passage:', err);
      setGenerationError(err.message || 'Bilinmeyen bir hata oluştu.');
    } finally {
      setIsGenerating(false);
    }
  }, [passages]);

  // Active Selected Passage details
  const activePassage = useMemo(() => {
    if (selectedPassageId === null) return null;
    return passages.find(p => p?.id === selectedPassageId) || null;
  }, [selectedPassageId, passages]);

  // Navigate to passage directly (e.g. from review cards)
  const handleSelectPassageDirectly = useCallback((passageId: number) => {
    handleSelectPassage(passageId);
  }, [handleSelectPassage]);

  // Loading quotes and study tips state
  const [tipIndex, setTipIndex] = useState(0);
  const studyTips = [
    "YDS ve YÖKDİL'de başarılı olmak için her gün en az bir İngilizce okuma parçası çözün.",
    "Bilinmeyen kelimeleri tek tek ezberlemek yerine, cümledeki bağlamından anlam çıkarmaya çalışın.",
    "Okuma parçası sorularını çözmeden önce soruları okursanız, metinde neyi arayacağınızı önceden bilirsiniz.",
    "Akademik bağlaçlar (although, moreover, thus vb.) cümleler arasındaki anlam akışını kuran en kritik kelimelerdir.",
    "Hatalı yaptığınız soruları analiz etmek ve neden yanlış seçeneğe gittiğinizi bulmak gelişimin anahtarıdır."
  ];

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setTipIndex(prev => (prev + 1) % studyTips.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const handleWorkbookStateChange = useCallback((tableId: string, state: { answers: Record<string, string | string[]>, checked: Record<number, boolean> }) => {
    setProgress(prev => ({
      ...prev,
      workbookState: {
        ...(prev.workbookState || {}),
        [tableId]: state
      }
    }));
  }, []);

  if (!session && !isOfflineMode) {
    return <AuthScreen onContinueOffline={() => setIsOfflineMode(true)} />;
  }

  return (
    <div id="app-root" className="min-h-screen bg-editorial-bg text-editorial-text font-sans flex flex-col justify-between">

      <AppSwitcher active="reading" />

      {/* Top Banner Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-editorial-border/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">

            {/* Brand Logo & Slogan */}
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center bg-editorial-accent text-white font-serif text-xl italic font-bold">
                L
              </div>
              <div>
                <p className="font-serif text-2xl font-bold tracking-tight text-editorial-text leading-none flex items-center gap-1.5">
                  Lexis <span className="text-xs font-sans font-normal tracking-widest uppercase opacity-40">Trainer</span>
                </p>
                <span className="text-[9px] text-editorial-text/50 font-bold tracking-widest uppercase block mt-1">
                  Okuma & Kelime Çalışması
                </span>
              </div>
            </div>

            {/* Streak, Timer & Backup Widgets */}
            <div className="flex items-center gap-2">

              {/* Cloud Sync Status */}
              {session && (
                <div className="flex items-center gap-1.5 border border-editorial-border/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500">
                  <CloudCog className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-editorial-accent' : ''}`} />
                  <span className="hidden sm:inline">{isSyncing ? 'Eşitleniyor...' : 'Eşitlendi'}</span>
                </div>
              )}

              {/* Logout Button */}
              {session ? (
                <button
                  onClick={() => supabase.auth.signOut()}
                  title="Çıkış Yap"
                  className="flex items-center gap-1.5 border border-editorial-border/40 hover:bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Çıkış</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsOfflineMode(false)}
                  className="flex items-center gap-1.5 border border-editorial-accent bg-white text-editorial-accent hover:bg-editorial-accent hover:text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Giriş Yap
                </button>
              )}

              {/* PWA Ana Ekrana Ekle Butonu */}
              {showInstallBtn && (
                <button
                  onClick={handleInstallPWA}
                  title="Ana ekrana uygulama olarak ekle"
                  className="flex items-center gap-1.5 border border-editorial-accent bg-editorial-accent text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:text-editorial-accent transition-colors cursor-pointer"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Ekle</span>
                </button>
              )}

              {/* Veri Yedekle */}
              <button
                onClick={handleBackupData}
                title="Tüm çalışma verilerini JSON dosyası olarak indir"
                className="flex items-center gap-1.5 border border-editorial-text/20 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-editorial-text/70 hover:border-editorial-accent hover:text-editorial-accent transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Yedekle</span>
              </button>

              {/* Veri Geri Yükle */}
              <button
                onClick={handleRestoreData}
                title="Yedek JSON dosyasından verileri geri yükle"
                className="flex items-center gap-1.5 border border-editorial-text/20 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-editorial-text/70 hover:border-editorial-accent hover:text-editorial-accent transition-colors cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Geri Yükle</span>
              </button>

              {/* Daily Streak Badge */}
              <div className="flex items-center gap-1.5 border border-editorial-text/10 bg-[#FFF3E0] px-3.5 py-1.5 text-xs font-bold text-[#E65100]">
                <Zap className="h-3.5 w-3.5 fill-current" />
                <span className="tracking-wide uppercase text-[10px]">{progress.dailyStreak} GÜN SERİ</span>
              </div>

              {/* Time Spent Badge */}
              <div className="hidden md:flex items-center gap-1.5 border border-editorial-text/10 bg-editorial-bg px-3.5 py-1.5 text-xs font-bold text-editorial-text">
                <Clock className="h-3.5 w-3.5 opacity-60" />
                <span className="tracking-wide uppercase text-[10px]">
                  {Math.floor(progress.totalTimeSpent / 60)} DK ÇALIŞILDI
                </span>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-1">

        {/* Navigation Tab Menu Grid (Only when not viewing specific Passage card) */}
        {selectedPassageId === null && (
          <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-10">
            {[
              { id: 'dashboard', label: 'Gösterge Paneli', subtitle: 'İSTATİSTİK & İLERLEME', icon: LayoutDashboard },
              { id: 'passages', label: 'Okuma Parçaları', subtitle: 'KÜTÜPHANE METİNLERİ', icon: BookOpen },
              { id: 'trainer', label: 'Kelime Çalışma', subtitle: 'HAFIZA KARTLARI & TEST', icon: Sparkles },
              { id: 'list', label: 'Kelime Haznesi', subtitle: 'KÜLLİYAT SÖZLÜĞÜ', icon: BookMarked },
              { id: 'workbook', label: 'Kelime Kitabı', subtitle: 'TABLOLAR & TESTLER', icon: BookText },
              { id: 'mistakes', label: 'Yanlışlar Defteri', subtitle: `${progress.mistakes.length} SORU`, icon: BookX },
              { id: 'exam', label: 'Sınav Simülasyonu', subtitle: 'DENEME SINAVI', icon: Timer }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setSelectedPassageId(null);
                  }}
                  className={`flex items-start gap-2.5 p-3 sm:p-4 border text-left transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-editorial-accent text-white border-editorial-accent shadow-md'
                      : 'bg-white border-editorial-border/40 hover:border-editorial-accent/40'
                  }`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center border ${
                    isActive
                      ? 'bg-white/10 text-white border-white/20'
                      : 'bg-editorial-bg text-editorial-text/70 border-editorial-border/40'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-serif font-bold leading-tight break-words ${isActive ? 'text-white' : 'text-editorial-text'}`}>{tab.label}</p>
                    <span className={`text-[9px] font-bold tracking-widest block mt-1.5 truncate ${isActive ? 'text-white/60' : 'text-editorial-text/40'}`}>{tab.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        )}

        {/* Tab Content Panels Rendering */}
        <div id="main-content-panel">
          {selectedPassageId !== null && activePassage ? (
            // Specific Active Passage Workspace
            <PassageCard
              passage={activePassage}
              progress={progress}
              onBackToList={() => setSelectedPassageId(null)}
              onToggleFavorite={handleToggleFavorite}
              onWordStatusChange={handleWordStatusChange}
              onSaveTestResult={handleSaveTestResult}
              onGradeQuestions={handleGradeQuestions}
            />
          ) : (
            // Tab Selection Panels
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  progress={progress}
                  passages={passages}
                  onSelectPassage={handleSelectPassageDirectly}
                  onResetProgress={handleResetProgress}
                />
              )}

              {activeTab === 'passages' && (
                <PassageList
                  passages={passages}
                  progress={progress}
                  onSelectPassage={handleSelectPassage}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}

              {activeTab === 'trainer' && (
                <VocabularyTrainer
                  passages={passages}
                  progress={progress}
                  onWordStatusChange={handleWordStatusChange}
                />
              )}

              {activeTab === 'list' && (
                <VocabularyList
                  passages={passages}
                  progress={progress}
                  onWordStatusChange={handleWordStatusChange}
                  onSelectPassage={handleSelectPassageDirectly}
                />
              )}

              {activeTab === 'workbook' && (
                <VocabularyWorkbook
                  workbookState={progress.workbookState || {}}
                  onWorkbookStateChange={handleWorkbookStateChange}
                />
              )}

              {activeTab === 'mistakes' && (
                <MistakesNotebook
                  mistakes={progress.mistakes}
                  onReviewMistake={handleReviewMistake}
                  onRemoveMistake={handleRemoveMistake}
                  onSelectPassage={handleSelectPassageDirectly}
                />
              )}

              {activeTab === 'exam' && (
                <ExamSimulator
                  passages={passages}
                  onFinishExam={(attempt, perPassageResults) => {
                    handleSaveExamAttempt(attempt);
                    perPassageResults.forEach(({ passage, results }) => {
                      handleGradeQuestions(passage, 'exam', results);
                    });
                  }}
                  onSelectPassage={handleSelectPassageDirectly}
                />
              )}
            </>
          )}
        </div>

      </main>

      {/* Footer Branding */}
      <footer className="bg-white border-t border-editorial-border/30 py-8 mt-16 text-center text-editorial-text/50 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="flex justify-center items-center gap-1.5">
            <BookOpenCheck className="h-4 w-4 text-editorial-accent opacity-60" />
            <span className="font-serif font-bold text-editorial-text tracking-wide">Lexis • English Reading Trainer</span>
          </div>
          <p className="text-[10px] text-editorial-text/40 font-mono">
            &copy; {new Date().getFullYear()} — Tüm Hakları Saklıdır. Geliştirici Sürümü.
          </p>
        </div>
      </footer>

      {/* Yapay Zeka Parça Oluşturma Yükleniyor Modalı */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-editorial-border max-w-lg w-full p-8 shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="flex justify-center">
              <div className="animate-spin rounded-none h-10 w-10 border-2 border-editorial-accent border-t-transparent"></div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-editorial-accent font-mono uppercase tracking-widest block">AI Yapay Zeka Motoru Aktif</span>
              <h3 className="text-xl font-serif font-extrabold text-editorial-text leading-tight">
                {generatingMetadata?.title}
              </h3>
              <p className="text-[10px] text-editorial-text/50 font-mono uppercase tracking-wider">
                Okuma Parçası #{generatingMetadata?.id} • CEFR: {generatingMetadata?.cefr}
              </p>
            </div>

            <div className="bg-editorial-bg p-5 border border-editorial-border/20 text-left">
              <span className="text-[9px] font-bold text-editorial-text/40 font-mono block mb-1.5 uppercase tracking-wider">💡 GÜNÜN ÇALIŞMA TAVSİYESİ</span>
              <p className="text-xs text-editorial-text/70 font-serif leading-relaxed italic">
                "{studyTips[tipIndex]}"
              </p>
            </div>

            <p className="text-xs text-editorial-accent font-sans leading-relaxed font-bold bg-[#E1F5FE]/50 p-4 border border-[#B3E5FC]/40">
              Yapay zeka, Google Search aracıyla interneti tarayarak Ahmet Akın ve İsmail Turasan'ın kaleme aldığı orijinal kitaptaki birebir aynı okuma parçasını, kelimeleri ve YDS tarzı soruları bulur ve saniyeler içinde kütüphanenize kalıcı olarak yükler.
            </p>
          </div>
        </div>
      )}

      {/* Yapay Zeka Hata Modalı */}
      {generationError && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-rose-500 max-w-lg w-full p-8 shadow-2xl text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-10 w-10 rounded-none bg-rose-50 flex items-center justify-center text-rose-600 font-extrabold font-mono text-lg border border-rose-200">
                !
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-rose-600 font-mono uppercase tracking-widest block">Yükleme Başarısız Oldu</span>
              <h3 className="text-lg font-serif font-extrabold text-editorial-text">
                Bağlantı veya API Yetkilendirme Hatası
              </h3>
            </div>

            <p className="text-xs text-editorial-text/70 leading-relaxed font-mono bg-rose-50 p-4 border border-rose-100 text-left">
              {generationError}
            </p>

            <div className="flex gap-2 justify-center font-mono">
              <button
                onClick={() => setGenerationError(null)}
                className="px-4 py-2 border border-editorial-border/30 bg-white text-editorial-text/60 hover:bg-editorial-bg text-[10px] font-bold uppercase tracking-wider cursor-pointer"
              >
                Kapat
              </button>
              <button
                onClick={() => handleSelectPassage(generatingMetadata?.id || 1)}
                className="px-4 py-2 bg-editorial-accent text-white hover:bg-white hover:text-editorial-text border border-editorial-accent text-[10px] font-bold uppercase tracking-wider cursor-pointer"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
