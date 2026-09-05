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
import { ReadingTopBar } from './components/shell/ReadingTopBar';
import { ReadingSidebar } from './components/shell/ReadingSidebar';
import AuthScreen from './components/AuthScreen';
import StoryLibrary from './components/StoryLibrary';
import { SettingsModal } from '../../../shared/vocab/SettingsModal';
import { Dashboard as StudyReport } from '../../../shared/analytics/Dashboard';
import { VocabHub, VocabHubLesson } from '../../../shared/vocab/VocabHub';
import { readingPassageLessonId, READING_CORE_LESSON_ID, READING_CORE_LESSON_TITLE } from './lib/vocabBank';
import { useActivityTimer } from '../../../shared/analytics/useActivityTimer';
import { Skill } from '../../../shared/analytics/activityLog';
import { supabase } from './lib/supabase';
import { mergeCloudProgress } from './lib/mergeProgress';
import { syncOnStartup, scheduleAutoSync } from '../../../shared/vocab/syncClient';
import { ACTIVITY_CHANGED_EVENT } from '../../../shared/analytics/activityLog';
import { getLocalFallbackPassage } from '../serverLocalPassage';
import { CloudOff } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'english_reading_trainer_progress_v1';

/**
 * "user_progress tablosunda mistakes/exam_history sutunlari yok" bayragi.
 * Bir kez 42703 alindiginda kurulur; sutunlar eklenirse elle silmek ya da
 * tarayici verisini temizlemek yerine asagidaki not gecerlidir: bayrak
 * yalnizca hata halinde kuruldugu icin, sutunlar eklendikten sonra
 * temizlenmesi yeter.
 */
const EXTRA_COLUMNS_FLAG = 'reading_sync_extra_columns_missing_v1';

const INITIAL_PROGRESS: UserProgress = {
  completedPassages: [],
  scores: {},
  exerciseScores: {},
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

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  /** Dar ekranda menu cekmecesi; genis ekranda panel zaten acik. */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'passages' | 'stories' | 'trainer' | 'list' | 'workbook' | 'mistakes' | 'exam' | 'cards' | 'report'>('dashboard');

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

  /**
   * SURE OLCUMU (karne icin).
   *
   * Bir parca acikken okuma, kelime ekranlarindayken kelime, sinav
   * simulasyonunda sinav sayilir. Liste/pano ekranlarinda olcum yapilmaz:
   * orada calisilmiyor, bakiniliyor. Ayrintili aciklama:
   * shared/analytics/activityLog.ts
   */
  const timedSkill: Skill | null =
    selectedPassageId !== null
      ? 'reading'
      : activeTab === 'trainer' || activeTab === 'workbook' || activeTab === 'list'
        ? 'vocab'
        : activeTab === 'exam'
          ? 'exam'
          : null;

  /**
   * ÇALIŞMA TAKVİMİNİN GÖNDERİLMESİ.
   *
   * Takvim satırları iki uygulamanın paylaştığı IndexedDB'de birikiyor
   * ama senkronu yalnızca katmanlı tetikliyordu: sadece okuma çalışılan
   * bir cihazda satırlar buluta hiç çıkmıyor, başka bilgisayarda takvim
   * eksik kalıyordu. Artık reading de açılışta ve kayıt değiştikçe
   * gönderiyor.
   *
   * Senkron kodu yoksa scheduleAutoSync hiçbir şey yapmaz, yani senkron
   * kurmamış kullanıcı için bir maliyet yok.
   */
  useEffect(() => {
    syncOnStartup();
    const onActivity = () => scheduleAutoSync();
    window.addEventListener(ACTIVITY_CHANGED_EVENT, onActivity);
    return () => window.removeEventListener(ACTIVITY_CHANGED_EVENT, onActivity);
  }, []);

  useActivityTimer(
    'reading',
    timedSkill || 'reading',
    selectedPassageId !== null ? `passage:${selectedPassageId}` : activeTab,
    undefined,
    timedSkill !== null
  );

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

          // Sutunlar sonradan eklendiyse select('*') artik onlari da
          // dondurur; bayragi burada temizlemek, kullanicinin tarayici
          // verisini elle temizlemesini gereksiz kilar.
          if ('mistakes' in cp || 'exam_history' in cp) {
            localStorage.removeItem(EXTRA_COLUMNS_FLAG);
          }

          // Uzerine yazma YOK: iki taraf birlestirilir (bkz. mergeCloudProgress)
          setProgress(prev => mergeCloudProgress(prev, cp));
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
        const base = {
          id: session.user.id,
          completed_passages: progress.completedPassages,
          scores: progress.scores,
          word_status: progress.wordStatus,
          favorite_passages: progress.favoritePassages,
          daily_streak: progress.dailyStreak,
          total_time_spent: progress.totalTimeSpent,
          workbook_state: progress.workbookState,
          updated_at: new Date().toISOString()
        };

        /**
         * Yanlislar defteri ve sinav gecmisi tabloya SONRADAN eklenen
         * sutunlar. Henuz eklenmemis bir veritabaninda bunlari gondermek
         * TUM upsert'i 42703 ile dusurur ve ilerlemenin tamami senkronsuz
         * kalir. Bu yuzden: once tam veriyle dene, sutun yoksa bir daha
         * deneme ve sutunsuz gonder. Sutunlar eklendigi an kendiliginden
         * calismaya baslar (bayrak yalnizca hatada kurulur).
         */
        const extrasUnsupported = localStorage.getItem(EXTRA_COLUMNS_FLAG) === '1';
        const payload = extrasUnsupported
          ? base
          : {
              ...base,
              mistakes: progress.mistakes,
              exam_history: progress.examHistory,
              exercise_scores: progress.exerciseScores || {},
            };

        supabase.from('user_progress').upsert(payload).then(({ error }: any) => {
          if (!error) return;
          if (error.code === '42703') {
            console.warn(
              '[sync] user_progress tablosunda mistakes/exam_history sutunlari yok; ' +
                'ilerlemenin geri kalani gonderiliyor.'
            );
            localStorage.setItem(EXTRA_COLUMNS_FLAG, '1');
            supabase.from('user_progress').upsert(base).then(undefined, console.error);
            return;
          }
          console.error(error);
        }, console.error);
      }, 5000); // 5 second debounce
      return () => clearTimeout(timeoutId);
    }
  }, [progress.completedPassages, progress.scores, progress.exerciseScores, progress.wordStatus, progress.favoritePassages, progress.workbookState, progress.mistakes, progress.examHistory, session, isSyncing]);

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
  /** Kelime alıştırması sonucunu kalıcı yazar. */
  /**
   * Uretilen hikaye listeye eklenir ve hemen acilir. Sorular/alistirmalar
   * bos gelir; arkadan onTasksReady ile doldurulur.
   */
  const handleStoryReady = useCallback((story: Passage) => {
    setPassages(prev => [...prev, story]);
    setActiveTab('stories');
    setSelectedPassageId(story.id);
  }, []);

  /**
   * Hikayeyi raftan kaldirir. Yalnizca uretilen parcalar silinebilir;
   * katalog parcalari listeden gelir, silinemez.
   */
  const handleDeleteStory = useCallback((id: number) => {
    setPassages(prev => prev.filter(p => !(p && p.id === id && p.isGenerated)));
    setSelectedPassageId(prev => (prev === id ? null : prev));
  }, []);

  /** Arka planda gelen sorular ve alistirmalar hikayeye islenir. */
  const handleStoryTasksReady = useCallback(
    (passageId: number, questions: Passage['questions'], exercises: Passage['exercises']) => {
      setPassages(prev =>
        prev.map(p => (p && p.id === passageId ? { ...p, questions, exercises } : p))
      );
    },
    []
  );

  const handleSaveExerciseResult = useCallback((passageId: number, score: number, total: number) => {
    setProgress(prev => ({
      ...prev,
      exerciseScores: {
        ...(prev.exerciseScores || {}),
        [passageId]: { score, total, timestamp: new Date().toISOString() },
      },
    }));
  }, []);

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
      // Parcayi kapatinca geldigi listeye donsun: hikayeler katalog
      // listesinde yer almadigi icin "passages" sekmesi onlar icin bos.
      setActiveTab(existing.isGenerated ? 'stories' : 'passages');
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
  /**
   * Kart merkezindeki "ders" filtresi icin: kartlar hangi kimliklerle
   * kaydediliyorsa (bkz. lib/vocabBank) burada da ayni kimlikler uretilir.
   */
  const cardLessons: VocabHubLesson[] = useMemo(
    () => [
      { id: READING_CORE_LESSON_ID, title: READING_CORE_LESSON_TITLE },
      // Onbellekten gelen ozel parcalar arasinda bozuk kayit olabiliyor;
      // bu yuzden listenin baska yerlerinde de p?.id ile korunuluyor.
      ...passages
        .filter((p) => p && typeof p.id === 'number')
        .map((p) => ({
          id: readingPassageLessonId(p.id),
          title: p.title || `Parça ${p.id}`,
        })),
    ],
    [passages]
  );

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
    <div id="app-root" className="min-h-screen bg-paper text-ink font-sans flex flex-col">

      <AppSwitcher active="reading" />

      <ReadingTopBar
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onGoHome={() => { setActiveTab('dashboard'); setSelectedPassageId(null); }}
        hasSession={!!session}
        isSyncing={isSyncing}
        dailyStreak={progress.dailyStreak}
        totalTimeSpent={progress.totalTimeSpent}
        showInstallBtn={showInstallBtn}
        onInstallPWA={handleInstallPWA}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onBackup={handleBackupData}
        onRestore={handleRestoreData}
        onSignIn={() => setIsOfflineMode(false)}
        onSignOut={() => supabase.auth.signOut()}
      />

      <div className="flex w-full flex-1">

        <ReadingSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => { setActiveTab(tab); setSelectedPassageId(null); }}
          mistakeCount={progress.mistakes.length}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />


      {/* Main Body Layout */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8">

        {/*
          ÇEVRİMDIŞI UYARISI.

          Bu uygulamada senkron kodu yok; eşitleme hesapla girişe bağlı.
          Oturum açık değilken ekranda bunu söyleyen hiçbir şey yoktu:
          kullanıcı katmanlıdaki gibi bir "kod" alanı arıyor, bulamıyor ve
          çalışmasının neden diğer bilgisayara gelmediğini anlamıyordu.
        */}
        {!session && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline bg-paper-2 px-4 py-3">
            <div className="flex min-w-0 items-start gap-2.5">
              <CloudOff className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" />
              <p className="text-[12px] leading-relaxed text-ink-2">
                <span className="font-medium text-ink">Çevrimdışı moddasın.</span>{' '}
                Okuduğun parçalar, kelime durumların ve alıştırma cevapların
                yalnızca <strong>bu bilgisayarda</strong> tutuluyor. Başka bir
                cihazda görebilmek için hesabınla giriş yapman gerekiyor —
                bu tarafta senkron kodu yoktur.
              </p>
            </div>
            <button
              onClick={() => setIsOfflineMode(false)}
              className="shrink-0 rounded-xl bg-accent px-3.5 py-2 text-[12px] font-medium
                text-white transition-colors duration-150 hover:bg-accent-700 cursor-pointer"
            >
              Giriş yap ve eşitle
            </button>
          </div>
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
              onSaveExerciseResult={handleSaveExerciseResult}
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

              {activeTab === 'stories' && (
                <StoryLibrary
                  passages={passages}
                  progress={progress}
                  onSelectPassage={handleSelectPassage}
                  onStoryReady={handleStoryReady}
                  onTasksReady={handleStoryTasksReady}
                  onDeleteStory={handleDeleteStory}
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

              {activeTab === 'cards' && (
                <div className="space-y-5">
                  {/* Bölüm başlığı VocabHub'ın içinden buraya taşındı:
                      orada olunca katmanlıda katman başlığıyla üst üste
                      geliyordu. Bkz. shared/vocab/VocabHub.tsx. */}
                  <h1 className="text-[22px] font-semibold tracking-tight text-brand">
                    Kelime Kartları
                  </h1>
                  <VocabHub lesson={null} lessons={cardLessons} />
                </div>
              )}

              {activeTab === 'report' && (
                <div className="space-y-5">
                  {/* Başlık StudyReport'un içinden buraya taşındı;
                      katmanlıda katman başlığıyla üst üste geliyordu. */}
                  <h1 className="text-[22px] font-semibold tracking-tight text-brand">Karne</h1>
                  <StudyReport />
                </div>
              )}
            </>
          )}
          </div>
        </div>
        </main>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        subtitle="API anahtarları — isteğe bağlı, site kendi anahtarlarıyla çalışır"
      />

      {/* Footer Branding */}
      {/* Alt bilgi. Ortalanmış marka bloğu + ikon + mono telif satırı
          vardı; söylediği şey bir imza, ekranın en dikkat çeken öğesi
          olmamalı. Tek satır. */}
      <footer className="border-t border-hairline py-6 text-center">
        <p className="text-[11px] text-ink-3">
          Lexis Trainer · {new Date().getFullYear()}
        </p>
      </footer>

      {/* Yapay Zeka Parça Oluşturma Yükleniyor Modalı */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg space-y-5 rounded-2xl border border-hairline bg-paper-2 p-8">
            <div className="flex items-center gap-3">
              <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              <div className="min-w-0">
                <h3 className="truncate text-[17px] font-semibold text-ink">
                  {generatingMetadata?.title}
                </h3>
                <p className="mt-0.5 text-[12px] text-ink-3">
                  Parça <span className="timecode">{generatingMetadata?.id}</span>
                  {' · '}{generatingMetadata?.cefr} · yapay zekâ ile yükleniyor
                </p>
              </div>
            </div>

            <p className="max-w-[62ch] text-[13px] leading-relaxed text-ink-2">
              Orijinal kitaptaki parça, kelimeler ve YDS tarzı sorular aranıp
              kütüphanene kalıcı olarak ekleniyor. Bu biraz sürebilir.
            </p>

            {/* Bekleme sirasindaki calisma tavsiyesi. Once "💡 GÜNÜN
                ÇALIŞMA TAVSİYESİ" diye emoji'li, buyuk harf bir etiketi
                vardi; tavsiyenin kendisi zaten tirnak icinde. */}
            <p className="border-l-2 border-hairline-2 pl-3 text-[13px] italic leading-relaxed text-ink-3">
              {studyTips[tipIndex]}
            </p>
          </div>
        </div>
      )}

      {/* Yapay Zeka Hata Modalı */}
      {generationError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg space-y-4 rounded-2xl border border-hairline bg-paper-2 p-6">
            <h3 className="text-[17px] font-semibold text-ink">Parça yüklenemedi</h3>
            <p className="text-[13px] leading-relaxed text-ink-2">
              Bağlantı ya da API yetkilendirmesi başarısız oldu.
            </p>

            <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-[12px] leading-relaxed text-rose-800">
              {generationError}
            </p>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setGenerationError(null)}
                className="rounded-xl border border-hairline px-4 py-2 text-[13px] font-medium
                  text-ink-2 transition-colors hover:bg-paper-3 hover:text-ink cursor-pointer"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => handleSelectPassage(generatingMetadata?.id || 1)}
                className="rounded-xl bg-accent px-4 py-2 text-[13px] font-medium text-white
                  transition-colors hover:bg-accent-700 cursor-pointer"
              >
                Tekrar dene
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
