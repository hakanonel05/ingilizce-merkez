import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PRESET_LESSONS } from './data/presetLessons';
import { VideoLesson, UserProgress, VocabularyItem, GrammarRuleItem, QuizQuestion, MistakeEntry } from './types';
import { TopBar } from './components/shell/TopBar';
import { GoalEditorModal } from './components/shell/GoalEditorModal';
import { LessonPickerModal } from './components/shell/LessonPickerModal';
import { LayerHeaderBar } from './components/shell/LayerHeaderBar';
import { NextLayerBar } from './components/shell/NextLayerBar';
import {
  LayerSidebar, CORE_LAYERS, LAYER_TABS, CORE_LAYER_COUNT, findLayer, HOME_LAYER,
} from './components/shell/LayerSidebar';
import { IconRail } from './components/shell/IconRail';
import { HomeFeed } from './components/HomeFeed';
import { Layer1BilingualReading } from './components/layers/Layer1BilingualReading';
import { Layer2ActiveListening } from './components/layers/Layer2ActiveListening';
import { Layer3Shadowing } from './components/layers/Layer3Shadowing';
import { Layer4NoSubtitles } from './components/layers/Layer4NoSubtitles';
import { Layer5AudioOnly } from './components/layers/Layer5AudioOnly';
import { VocabHub } from './components/vocab/VocabHub';
import { Layer2PhoneticsGrammar } from './components/layers/Layer2PhoneticsGrammar';
import { Layer3ComprehensionQuiz } from './components/layers/Layer3ComprehensionQuiz';
import { Layer4WritingEvaluation } from './components/layers/Layer4WritingEvaluation';
import { Layer5SpeakingSimulation } from './components/layers/Layer5SpeakingSimulation';
import { ProgressDashboard } from './components/ProgressDashboard';
import { MistakesNotebook } from './components/MistakesNotebook';
import { Dashboard } from '../../../shared/analytics/Dashboard';
import { useActivityTimer } from '../../../shared/analytics/useActivityTimer';
import { LAYER_SKILLS } from '../../../shared/analytics/collect';
import { logActivity, ACTIVITY_CHANGED_EVENT } from '../../../shared/analytics/activityLog';
import { MethodologyGuideModal } from './components/MethodologyGuideModal';
import { GrammarCoachDrawer } from './components/GrammarCoachDrawer';
import { EditLessonModal } from './components/EditLessonModal';
import { SettingsModal } from './components/SettingsModal';
import { extractYouTubeId } from './lib/youtube';
import { apiFetch } from './lib/userKeys';
import { stampLocalChange, scheduleAutoSync, syncOnStartup, onSynced } from './lib/syncClient';
import { PlayCircle } from 'lucide-react';
import AppSwitcher from './AppSwitcher';

// Sürüm anahtarı: eski kayıtlarda bozuk/eksik zaman damgaları vardı.
// Anahtar değiştiği için eski dersler otomatik devre dışı kalır ve
// kullanıcının localStorage'ı elle temizlemesine gerek kalmaz.
const LESSONS_STORAGE_KEY = 'layered_learning_lessons_v2';
const PROGRESS_STORAGE_KEY = 'layered_learning_progress_v1';
const MISTAKES_STORAGE_KEY = 'layered_learning_mistakes_v1';

/**
 * Bir degeri localStorage'a yazar, gercekten degistiyse senkron damgasi
 * vurup otomatik senkronu tetikler.
 *
 * Iki incelik var:
 * - ILK calistirma atlanir. O, sayfanin acilisidir; orada damga vurmak
 *   hicbir sey degistirmemis bir cihazi "en son yazan" yapar ve baska bir
 *   cihazdaki gercek duzenlemeyi ezmesine yol acardi.
 * - Yazilacak deger oncekiyle AYNIYSA damga vurulmaz. Senkron cektigi
 *   veriyi dogrudan localStorage'a yazip state'i tazeledigi icin, bu
 *   kontrol olmasa her cekme islemi gereksiz bir gonderme daha dogururdu.
 */
function usePersistedSync<T>(storageKey: string, value: T): void {
  const isFirstRun = useRef(true);

  useEffect(() => {
    let serialized: string;
    try {
      serialized = JSON.stringify(value);
    } catch (e) {
      console.error('Veri JSON’a cevrilemedi:', storageKey, e);
      return;
    }

    let previous: string | null = null;
    try {
      previous = localStorage.getItem(storageKey);
      localStorage.setItem(storageKey, serialized);
    } catch (e) {
      console.error('Veri kaydedilemedi:', storageKey, e);
      return;
    }

    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (previous === serialized) return;

    stampLocalChange(storageKey);
    scheduleAutoSync();
  }, [storageKey, value]);
}

/** Bugunun tarihi, YYYY-MM-DD (yerel saat). */
function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Ardisik calisma gunu sayisini hesaplar.
 * Seri bugunden veya dunden geriye dogru kesintisiz devam ettigi surece sayilir;
 * bir gun atlanirsa sifirlanir. Boylece sayi gercek kullanimi yansitir.
 */
function calculateStreak(dates: string[]): number {
  if (!dates || dates.length === 0) return 0;

  const unique = Array.from(new Set(dates)).sort().reverse();
  const today = todayKey();
  const yesterday = todayKey(new Date(Date.now() - 86400000));

  // Seri ancak bugun veya dun calisilmissa canlidir
  if (unique[0] !== today && unique[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1] + 'T00:00:00');
    const curr = new Date(unique[i] + 'T00:00:00');
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
}

export default function App() {
  const [lessons, setLessons] = useState<VideoLesson[]>(() => {
    try {
      const saved = localStorage.getItem(LESSONS_STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load lessons from localStorage:', e);
    }
    return PRESET_LESSONS;
  });

  const [activeLessonId, setActiveLessonId] = useState<string>(() => lessons[0]?.id || '');
  /* Uygulama Akis ekraninda aciliyor, dogrudan Katman 1'de degil: hangi
     derste kalindigi, sirada hangi adim oldugu ve bugun kac kelime tekrari
     dustugu orada bir arada duruyor. Katman 1'de acilmak, dun 4. katmanda
     birakmis birini her seferinde basa donduruyordu. */
  const [activeLayer, setActiveLayer] = useState<number>(HOME_LAYER);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isGrammarCoachOpen, setIsGrammarCoachOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [editingLesson, setEditingLesson] = useState<VideoLesson | null>(null);
  /** Dar ekranda katman cekmecesi; genis ekranda sidebar zaten acik. */
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  /** Ders listesi artik sayfada degil, bu pencerede. */
  const [isLessonPickerOpen, setIsLessonPickerOpen] = useState<boolean>(false);
  /** Hedef ve seri duzenleyicisi ust cubuktan aciliyor. */
  const [isGoalEditorOpen, setIsGoalEditorOpen] = useState<boolean>(false);

  // Dersleri sakla ve degistiyse Supabase'e gonder
  usePersistedSync(LESSONS_STORAGE_KEY, lessons);

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load progress:', e);
    }
    return {
    completedVideoCount: 0,
    goalVideoCount: 20,
    studyStreakDays: 0,
    lastStudyDate: new Date().toISOString(),
    studyDates: [],
    bookmarkedWords: [
      {
        word: 'Holistic',
        enContext: 'Layered learning takes a holistic approach to language acquisition.',
        trContext: 'Katmanlı çalışma dil edinimine bütüncül bir yaklaşım getirir.',
      },
    ],
    };
  });

  // Ilerlemeyi kalici sakla ve degistiyse Supabase'e gonder
  usePersistedSync(PROGRESS_STORAGE_KEY, progress);

  /** Bugunu calisma gunu olarak isaretler ve seriyi yeniden hesaplar. */
  const recordStudyToday = () => {
    setProgress((prev) => {
      const dates = Array.from(new Set([...(prev.studyDates || []), todayKey()]));
      return {
        ...prev,
        studyDates: dates,
        studyStreakDays: calculateStreak(dates),
        lastStudyDate: new Date().toISOString(),
      };
    });
  };

  /** Hedef ve seri gibi degerleri kullanicinin duzenlemesine izin verir. */
  const handleUpdateProgress = (patch: Partial<UserProgress>) => {
    setProgress((prev) => ({ ...prev, ...patch }));
  };

  const activeLesson = lessons.find((l) => l.id === activeLessonId) || lessons[0] || null;

  /**
   * Tamamlanan video sayisi artik sayacla degil, derslerin gercek durumundan
   * turetiliyor. Boylece ders silinince veya katman geri alininca sayi da
   * dogru kaliyor; ayni dersi iki kez bitirmek sayiyi sisirmiyor.
   */
  const displayProgress: UserProgress = useMemo(() => {
    // Son cekirdek katman tamamlandiysa ders bitmis sayilir
    const completed = lessons.filter((l) => l.completedLayers?.includes(CORE_LAYER_COUNT)).length;
    return {
      ...progress,
      completedVideoCount: completed,
      studyStreakDays: calculateStreak(progress.studyDates || []),
    };
  }, [lessons, progress]);

  // Delete Lesson handler
  const handleDeleteLesson = (lessonId: string) => {
    const updated = lessons.filter((l) => l.id !== lessonId);
    setLessons(updated);
    if (updated.length > 0) {
      if (activeLessonId === lessonId) {
        setActiveLessonId(updated[0].id);
      }
    } else {
      setActiveLessonId('');
    }
    setActiveLayer(1);
  };

  // Restore Default Preset Lessons handler
  const handleRestorePresetLessons = () => {
    setLessons(PRESET_LESSONS);
    setActiveLessonId(PRESET_LESSONS[0].id);
    setActiveLayer(1);
  };

  // Edit Lesson handler
  const handleSaveEditedLesson = (updatedLesson: VideoLesson) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === updatedLesson.id ? updatedLesson : l))
    );
  };

  // Bookmark Word handler
  const handleBookmarkWord = (word: string, enContext: string, trContext: string) => {
    setProgress((prev) => {
      if (prev.bookmarkedWords.some((b) => b.word.toLowerCase() === word.toLowerCase())) {
        return prev;
      }
      return {
        ...prev,
        bookmarkedWords: [...prev.bookmarkedWords, { word, enContext, trContext }],
      };
    });
  };

  // Complete Layer handler
  /**
   * SURE OLCUMU.
   *
   * Her katman bilesenine ayri ayri kanca eklemek yerine tek yerden:
   * aktif katman numarasi hangi beceriye karsilik geliyorsa (LAYER_SKILLS)
   * sure ona yazilir. Kelime Kartlari sekmesi (10) 'vocab' sayilir.
   * Ders secili degilken ya da pano/defter sekmelerindeyken olcum durur —
   * orada calisma degil, bakinma yapiliyor.
   */
  const timedSkill = activeLayer === 10 ? 'vocab' : LAYER_SKILLS[activeLayer];
  useActivityTimer(
    'katmanli',
    timedSkill || 'reading',
    activeLesson?.id,
    activeLesson?.title,
    !!timedSkill && (activeLayer === 10 || !!activeLesson)
  );

  const handleCompleteLayer = (layerNum: number) => {
    setLessons((prev) =>
      prev.map((l) => {
        if (l.id === activeLesson.id) {
          const updatedLayers = Array.from(new Set([...l.completedLayers, layerNum]));
          return { ...l, completedLayers: updatedLayers };
        }
        return l;
      })
    );

    // Herhangi bir katman tamamlandiginda bugun "calisilmis" sayilir
    recordStudyToday();

    // Karne icin: hangi katman NE ZAMAN bitti. Eski kayitlarda yalnizca
    // "bitti" bilgisi vardi, tarihi hicbir yerde tutulmuyordu.
    void logActivity({
      app: 'katmanli',
      skill: LAYER_SKILLS[layerNum] || 'reading',
      kind: 'complete',
      refId: activeLesson.id,
      refTitle: activeLesson.title,
    });

    // Çekirdek 7 katman içinde otomatik ilerle. 8 ekstra çalışma olduğu için
    // oradan otomatik geçiş yapılmıyor.
    if (layerNum < 7) {
      setActiveLayer(layerNum + 1);
    }
  };

/**
 * Sunucudan gelen yaniti guvenle okur. Netlify zaman asiminda JSON yerine
 * HTML hata sayfasi donuyor ve JSON.parse "Unexpected token '<'" hatasi
 * veriyordu. Burada anlasilir bir mesaja cevriliyor.
 */
async function readJsonResponse(res: Response, fallbackMsg: string): Promise<any> {
  const raw = await res.text();
  try {
    return JSON.parse(raw);
  } catch {
    if (res.status === 502 || res.status === 504 || /timed?\s*out|gateway/i.test(raw)) {
      throw new Error(
        'Sunucu zaman asimina ugradi. Video cok uzun olabilir; daha kisa bir videoyla deneyin.'
      );
    }
    throw new Error(`${fallbackMsg} (HTTP ${res.status})`);
  }
}

/** Frontend'in cagirdigi grup boyutu. Her istek birkac saniyede biter. */
const TRANSLATE_BATCH_SIZE = 20;

/**
 * Bir ceviri grubunu ister; basarisiz olursa GRUBU IKIYE BOLUP tekrar dener.
 *
 * Neden gerekli: otomatik altyazi metni noktalamasiz ve dolgu sesleriyle dolu
 * ("um", "like"). Yapay zeka saglayicisi boyle bir metinde 20 cumlelik grubu
 * ara sira gecerli JSON'a ceviremiyor ve istek hata donuyor. Ayni grup ikinci
 * denemede ya da kucuk parcalar halinde sorunsuz geciyor; yani hata iceriksel
 * degil, KARARSIZ.
 *
 * Eskiden ilk basarisiz grup tum ice aktarmayi durduruyordu: 61 cumlelik bir
 * ders, tek bir aksayan grup yuzunden bastan kayboluyordu. Artik grup
 * kuculterek yeniden deneniyor; tek cumle bile cevrilemezse yalnizca o cumle
 * cevirisiz kaliyor ve ders olusmaya devam ediyor (duzenleme ekranindan
 * sonradan tamamlanabilir).
 */
async function translateBatchWithSplit(
  chunk: { id: number; en: string }[],
  onNote?: (message: string) => void
): Promise<Record<number, string>> {
  try {
    const res = await apiFetch('/api/translate-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sentences: chunk }),
    });
    const data = await readJsonResponse(res, 'Ceviri yapilamadi.');
    if (!res.ok) throw new Error(data.error || 'Ceviri yapilamadi.');
    return data.translations || {};
  } catch (err) {
    // Tek cumle de cevrilemiyorsa daha fazla bolunemez; bosluk birakip devam et
    if (chunk.length <= 1) {
      console.warn('Cumle cevrilemedi, cevirisiz birakildi:', chunk[0]?.en?.slice(0, 60), err);
      return {};
    }

    onNote?.(`Grup yeniden deneniyor (${chunk.length} → ${Math.ceil(chunk.length / 2)})...`);
    const mid = Math.ceil(chunk.length / 2);
    const [left, right] = [chunk.slice(0, mid), chunk.slice(mid)];
    return {
      ...(await translateBatchWithSplit(left, onNote)),
      ...(await translateBatchWithSplit(right, onNote)),
    };
  }
}

/**
 * Dersi PARCA PARCA olusturur: once cumleler ve gercek zaman damgalari,
 * sonra sirayla ceviri gruplari, en son ogrenme materyali. Boylece hicbir
 * istek serverless zaman sinirina takilmaz.
 */
async function buildLessonData(
  input: string,
  youtubeUrlInput?: string,
  onProgress?: (message: string) => void
) {
  onProgress?.('Altyazi aliniyor...');

  const sentRes = await apiFetch('/api/transcript-sentences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoInput: input, youtubeUrl: youtubeUrlInput }),
  });
  const sentData = await readJsonResponse(sentRes, 'Transkript alinamadi.');
  if (!sentRes.ok) {
    // Sunucu gercek sebebi "reason" alaninda dondurur; teshis icin gorunur yap
    const detail = sentData.reason ? ` (Sunucu: ${sentData.reason})` : '';
    throw new Error((sentData.error || 'Transkript alınamadı.') + detail);
  }

  const sentences: any[] = sentData.sentences || [];
  if (sentences.length === 0) throw new Error('Transkriptten cumle cikarilamadi.');

  // Ceviriyi gruplar halinde, sirayla iste
  const translations: Record<number, string> = {};
  const totalBatches = Math.ceil(sentences.length / TRANSLATE_BATCH_SIZE);

  for (let i = 0; i < sentences.length; i += TRANSLATE_BATCH_SIZE) {
    const batchNo = Math.floor(i / TRANSLATE_BATCH_SIZE) + 1;
    onProgress?.(`Ceviriliyor... (${batchNo}/${totalBatches})`);

    const chunk = sentences
      .slice(i, i + TRANSLATE_BATCH_SIZE)
      .map((s) => ({ id: s.id, en: s.en }));

    Object.assign(
      translations,
      await translateBatchWithSplit(chunk, (note) =>
        onProgress?.(`Ceviriliyor... (${batchNo}/${totalBatches}) ${note}`)
      )
    );
  }

  // Hicbir sey cevrilemediyse ders anlamsiz olur; bu gercek bir hatadir
  if (Object.keys(translations).length === 0) {
    throw new Error(
      'Ceviri yapilamadi. Yapay zeka saglayicisi yanit vermiyor olabilir; ' +
      'birkac dakika sonra tekrar deneyin.'
    );
  }

  const finalSentences = sentences.map((s) => ({
    ...s,
    tr: translations[s.id] || '',
  }));

  // Ogrenme materyali: basarisiz olursa ders yine de olusur,
  // eksik katmanlar arka planda tamamlanir.
  let material: any = {};
  try {
    onProgress?.('Kelime, gramer ve quiz hazirlaniyor...');
    const fullText = sentences.map((s) => s.en).join(' ');
    const matRes = await apiFetch('/api/study-material', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: fullText }),
    });
    if (matRes.ok) material = await readJsonResponse(matRes, '');
  } catch (e) {
    console.warn('Ogrenme materyali uretilemedi, arka planda tekrar denenecek:', e);
  }

  return {
    title: sentData.title,
    sentences: finalSentences,
    hasRealTimings: !!sentData.hasRealTimings,
    vocabulary: material.vocabulary || [],
    grammarRules: material.grammarRules || [],
    quizQuestions: material.quizQuestions || [],
  };
}

  // Custom Video Import Handler
  const handleImportCustomLesson = async (
    input: string,
    youtubeUrlInput?: string,
    onProgress?: (message: string) => void
  ) => {
    const data = await buildLessonData(input, youtubeUrlInput, onProgress);

    const activeYtUrl = (youtubeUrlInput && youtubeUrlInput.trim()) ? youtubeUrlInput.trim() : input;
    const ytId = extractYouTubeId(activeYtUrl);

    const newLesson: VideoLesson = {
      id: `custom-${Date.now()}`,
      title: data.title || 'Yeni İçe Aktarılan Video',
      youtubeUrl: activeYtUrl,
      youtubeId: ytId,
      description: 'YouTube altyazısından otomatik oluşturulan çift dilli transkript.',
      level: 'B2',
      durationMinutes: 8,
      completedLayers: [],
      sentences: data.sentences || [],
      hasRealTimings: data.hasRealTimings,
      vocabulary: data.vocabulary || [],
      grammarRules: data.grammarRules || [],
      quizQuestions: data.quizQuestions || [],
    };

    setLessons((prev) => [newLesson, ...prev]);
    setActiveLessonId(newLesson.id);
    setActiveLayer(1);
  };

  // Background Auto-Generation for Katman 2 & 3 if missing
  useEffect(() => {
    if (
      activeLesson &&
      activeLesson.sentences &&
      activeLesson.sentences.length > 0 &&
      ((!activeLesson.vocabulary || activeLesson.vocabulary.length === 0) ||
       (!activeLesson.grammarRules || activeLesson.grammarRules.length === 0) ||
       (!activeLesson.quizQuestions || activeLesson.quizQuestions.length === 0))
    ) {
      let isCancelled = false;
      const generateAllLayersInBackground = async () => {
        try {
          const fullText = activeLesson.sentences.map((s) => s.en).join(' ');

          const phoneticsPromise = apiFetch('/api/analyze-phonetics-grammar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcriptSentences: activeLesson.sentences }),
          }).then((r) => r.json());

          const quizPromise = apiFetch('/api/generate-quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcriptText: fullText }),
          }).then((r) => r.json());

          const [phoneticsData, quizData] = await Promise.all([phoneticsPromise, quizPromise]);

          if (!isCancelled) {
            setLessons((prev) =>
              prev.map((l) => {
                if (l.id === activeLesson.id) {
                  return {
                    ...l,
                    vocabulary: (l.vocabulary && l.vocabulary.length > 0) ? l.vocabulary : (phoneticsData.vocabulary || []),
                    grammarRules: (l.grammarRules && l.grammarRules.length > 0) ? l.grammarRules : (phoneticsData.grammarRules || []),
                    quizQuestions: (l.quizQuestions && l.quizQuestions.length > 0) ? l.quizQuestions : (quizData.quizQuestions || []),
                  };
                }
                return l;
              })
            );
          }
        } catch (e) {
          console.warn('Background analysis generation failed:', e);
        }
      };

      generateAllLayersInBackground();
      return () => { isCancelled = true; };
    }
  }, [activeLessonId, activeLesson?.id, activeLesson?.vocabulary?.length, activeLesson?.grammarRules?.length, activeLesson?.quizQuestions?.length]);

  /**
   * Mevcut bir dersi (özellikle elle yazılmış hazır dersleri) videonun
   * GERÇEK YouTube altyazısından yeniden üretir. Cümleler ve zaman
   * damgaları sunucuda gerçek cue verisinden hesaplanır.
   */
  const handleResyncLessonFromCaptions = async (
    lessonId: string,
    onProgress?: (message: string) => void
  ) => {
    const target = lessons.find((l) => l.id === lessonId);
    if (!target) throw new Error('Ders bulunamadı.');

    const url = target.youtubeUrl || target.youtubeId || '';
    if (!extractYouTubeId(url)) {
      throw new Error('Bu derste geçerli bir YouTube linki yok. Önce "URL Değiştir" ile link ekleyin.');
    }

    const data = await buildLessonData(url, undefined, onProgress);

    if (!data.hasRealTimings) {
      throw new Error('Bu videoda zaman bilgisi içeren bir altyazı bulunamadı.');
    }

    setLessons((prev) =>
      prev.map((l) => {
        if (l.id !== lessonId) return l;
        return {
          ...l,
          title: data.title || l.title,
          sentences: data.sentences || l.sentences,
          hasRealTimings: true,
          vocabulary: data.vocabulary?.length ? data.vocabulary : l.vocabulary,
          grammarRules: data.grammarRules?.length ? data.grammarRules : l.grammarRules,
          quizQuestions: data.quizQuestions?.length ? data.quizQuestions : l.quizQuestions,
        };
      })
    );
  };

  // Update Lesson YouTube Video URL
  const handleUpdateLessonVideoUrl = (youtubeUrl: string) => {
    const ytId = extractYouTubeId(youtubeUrl);
    setLessons((prev) =>
      prev.map((l) => {
        if (l.id === activeLesson.id) {
          return { ...l, youtubeUrl, youtubeId: ytId };
        }
        return l;
      })
    );
  };

  // Update Layer 2 Vocabulary & Grammar Rules
  const handleUpdateLessonData = (
    vocabulary: VocabularyItem[],
    grammarRules: GrammarRuleItem[]
  ) => {
    setLessons((prev) =>
      prev.map((l) => {
        if (l.id === activeLesson.id) {
          return { ...l, vocabulary, grammarRules };
        }
        return l;
      })
    );
  };

  // Update Layer 3 Quiz Data
  const handleUpdateQuizData = (quizQuestions: QuizQuestion[]) => {
    setLessons((prev) =>
      prev.map((l) => {
        if (l.id === activeLesson.id) {
          return { ...l, quizQuestions };
        }
        return l;
      })
    );
  };

  // Update Layer 4 User Summary & Comment
  const handleSaveWriting = (summary: string, comment: string) => {
    setLessons((prev) =>
      prev.map((l) => {
        if (l.id === activeLesson.id) {
          return { ...l, userSummary: summary, userComment: comment };
        }
        return l;
      })
    );
  };

  // Yanlışlar Defteri: quiz sırasında yanlış cevaplanan sorular
  const [mistakes, setMistakes] = useState<MistakeEntry[]>(() => {
    try {
      const saved = localStorage.getItem(MISTAKES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load mistakes:', e);
    }
    return [];
  });

  usePersistedSync(MISTAKES_STORAGE_KEY, mistakes);

  /**
   * Acilista bir kez senkronla, sonrasinda cekilen veri geldikce ekrani tazele.
   * runSync localStorage'i dogrudan yaziyor; React state'i acilista okundugu
   * icin cekme sonrasi ekran eski kalirdi. Bu yuzden cekilen kayit varsa
   * state'i yeniden localStorage'dan besliyoruz.
   */
  useEffect(() => {
    const unsubscribe = onSynced((result) => {
      if (result.pulled === 0) return;
      try {
        const savedLessons = localStorage.getItem(LESSONS_STORAGE_KEY);
        if (savedLessons) {
          const parsed = JSON.parse(savedLessons);
          if (Array.isArray(parsed)) setLessons(parsed);
        }

        const savedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
        if (savedProgress) setProgress(JSON.parse(savedProgress));

        const savedMistakes = localStorage.getItem(MISTAKES_STORAGE_KEY);
        if (savedMistakes) {
          const parsed = JSON.parse(savedMistakes);
          if (Array.isArray(parsed)) setMistakes(parsed);
        }
      } catch (e) {
        console.error('Senkron sonrasi veriler okunamadi:', e);
      }
    });

    syncOnStartup();

    // Karne satirlari degistikce senkronu tetikle. scheduleAutoSync zaten
    // 8 saniyelik bir sessizlik bekliyor; sure sayaci dakikada bir yazdigi
    // icin bu, "calismayi birakinca gonder" davranisina donusuyor.
    const onActivity = () => scheduleAutoSync();
    window.addEventListener(ACTIVITY_CHANGED_EVENT, onActivity);

    return () => {
      unsubscribe();
      window.removeEventListener(ACTIVITY_CHANGED_EVENT, onActivity);
    };
  }, []);

  const handleRecordMistakes = (entries: Omit<MistakeEntry, 'id' | 'timestamp'>[]) => {
    const timestamp = new Date().toISOString();
    setMistakes((prev) => [
      ...entries.map((entry, idx) => ({
        ...entry,
        id: `${timestamp}-${idx}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp,
      })),
      ...prev,
    ]);
  };

  const handleRemoveMistake = (id: string) => {
    setMistakes((prev) => prev.filter((m) => m.id !== id));
  };

  const handleClearMistakes = () => {
    setMistakes([]);
  };

  /* --- Kabuk turetilmis degerleri ---
     Aktif katmanin basligi, kacinci adim oldugu ve sirasindaki katman.
     Ust bilgi bari ve alt aksiyon bari bunlari kullaniyor. */
  const activeItem = findLayer(activeLayer);
  const coreIndex = CORE_LAYERS.findIndex((l) => l.id === activeLayer);
  const isCoreLayer = coreIndex >= 0;
  const nextCore = isCoreLayer ? CORE_LAYERS[coreIndex + 1] : undefined;
  const completedLayers = activeLesson ? activeLesson.completedLayers : [];
  const isActiveLayerDone = completedLayers.includes(activeLayer);

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col">

      <AppSwitcher active="katmanli" />

      <TopBar
        progress={displayProgress}
        activeLayer={activeLayer}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onGoHome={() => setActiveLayer(HOME_LAYER)}
        onOpenLessonPicker={() => setIsLessonPickerOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenGrammarCoach={() => setIsGrammarCoachOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenReport={() => setActiveLayer(12)}
        isReportActive={activeLayer === 12}
        onEditGoals={() => setIsGoalEditorOpen(true)}
      />

      {/* Calisma alani: solda ikon seridi + menu paneli, ortada tek odak.
          Ders secici artik ust cubukta degil - "Dersler" sekmesinin ve
          seritteki arama dugmesinin actigi pencerede. */}
      <div className="flex flex-1 w-full">

        <IconRail
          onOpenLessonPicker={() => setIsLessonPickerOpen(true)}
          onAddLesson={() => setIsLessonPickerOpen(true)}
          onGoHome={() => setActiveLayer(HOME_LAYER)}
        />

        <LayerSidebar
          activeLayer={activeLayer}
          onSelectLayer={setActiveLayer}
          completedLayers={completedLayers}
          hasLesson={!!activeLesson}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenGuide={() => setIsGuideOpen(true)}
          onOpenGrammarCoach={() => setIsGrammarCoachOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <main className="min-w-0 flex-1">
          {/* Akis kendi genislik ve dolgusunu tasiyor (uc sutunlu bir
              duzeni var), o yuzden asagidaki tek sutunlu kabin disinda. */}
          {activeLayer === HOME_LAYER ? (
            <HomeFeed
              activeLesson={activeLesson ?? null}
              lessons={lessons}
              progress={displayProgress}
              completedLayers={completedLayers}
              onSelectLayer={setActiveLayer}
              onOpenLessonPicker={() => setIsLessonPickerOpen(true)}
              onOpenGuide={() => setIsGuideOpen(true)}
            />
          ) : (
          <div className="min-h-[500px] w-full max-w-[1180px] xl:max-w-[1440px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {!activeLesson &&
          activeLayer !== 9 &&
          activeLayer !== 10 &&
          activeLayer !== 11 &&
          activeLayer !== 12 ? (
            <div className="max-w-md mx-auto my-20 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 bg-accent-soft">
                <PlayCircle className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-ink">
                Bir ders seç ya da ekle
              </h3>
              <p className="text-sm leading-relaxed text-ink-3">
                Bir YouTube linki ver; altyazı çekilip cümlelere bölünür ve yedi
                katmanlı çalışma başlar. Dilersen örnek derslerle de deneyebilirsin.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsLessonPickerOpen(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4
                    text-[13px] font-medium text-white
                    transition-colors duration-150 hover:bg-accent-700 cursor-pointer"
                >
                  <PlayCircle className="h-4 w-4" />
                  Ders seç veya ekle
                </button>
                <button
                  type="button"
                  onClick={handleRestorePresetLessons}
                  className="inline-flex h-10 items-center rounded-xl border border-hairline
                    bg-paper-2 px-4 text-[13px] font-medium text-ink-2
                    transition-colors hover:border-hairline-2 hover:text-ink cursor-pointer"
                >
                  Örnek dersleri yükle
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* AKTIF DERS SERIDI.
                  Ders adi ust cubuktan buraya indi: ust cubugun ortasi
                  artik bolumler arasi gezinme. Ders "hangi bolumdeyim"
                  degil "ne uzerinde calisiyorum" bilgisi, yani calistigin
                  sutunun kendi icinde durmasi dogru yer. */}
              {activeLesson && (
                <button
                  type="button"
                  onClick={() => setIsLessonPickerOpen(true)}
                  title="Ders değiştir veya yeni ders ekle"
                  className="group mb-4 flex w-full min-w-0 items-center gap-2 rounded-xl
                    border border-hairline bg-paper-2 px-3 py-2 text-left
                    transition-colors duration-150 hover:bg-paper-3 cursor-pointer"
                >
                  <PlayCircle className="h-4 w-4 shrink-0 text-ink-3 transition-colors group-hover:text-accent" />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">
                    {activeLesson.title}
                  </span>
                  <span className="timecode shrink-0 text-ink-3">
                    {[activeLesson.cefrLevel, `${activeLesson.sentences.length} cümle`]
                      .filter(Boolean).join(' · ')}
                  </span>
                </button>
              )}

              {/* Aktif katmanin basligi: sol liste dar ekranda gizli
                  oldugu icin calisma alani kendini tanitmali. */}
              {activeItem && (
                <LayerHeaderBar
                  step={isCoreLayer ? coreIndex + 1 : null}
                  title={activeItem.label}
                  subtitle={activeItem.subLabel}
                  icon={activeItem.icon}
                  isCompleted={isActiveLayerDone}
                />
              )}

              {activeLayer === 1 && activeLesson && (
                <Layer1BilingualReading
                  lesson={activeLesson}
                  onBookmarkWord={handleBookmarkWord}
                  bookmarkedWords={progress.bookmarkedWords}
                  onCompleteLayer={() => handleCompleteLayer(1)}
                  onUpdateVideoUrl={handleUpdateLessonVideoUrl}
                  onResyncFromCaptions={(onProgress) => handleResyncLessonFromCaptions(activeLesson.id, onProgress)}
                  userLevel={progress.cefrLevel}
                  onChangeUserLevel={(level) => handleUpdateProgress({ cefrLevel: level })}
                />
              )}

              {activeLayer === 2 && activeLesson && (
                <Layer2ActiveListening
                  lesson={activeLesson}
                  onCompleteLayer={() => handleCompleteLayer(2)}
                />
              )}

              {activeLayer === 3 && activeLesson && (
                <Layer3Shadowing
                  lesson={activeLesson}
                  onCompleteLayer={() => handleCompleteLayer(3)}
                />
              )}

              {activeLayer === 4 && activeLesson && (
                <Layer4NoSubtitles
                  lesson={activeLesson}
                  onCompleteLayer={() => handleCompleteLayer(4)}
                  onUpdateQuizData={handleUpdateQuizData}
                  onRecordMistakes={handleRecordMistakes}
                />
              )}

              {activeLayer === 5 && activeLesson && (
                <Layer5AudioOnly
                  lesson={activeLesson}
                  onCompleteLayer={() => handleCompleteLayer(5)}
                />
              )}

              {activeLayer === 6 && activeLesson && (
                <Layer4WritingEvaluation
                  lesson={activeLesson}
                  onCompleteLayer={() => handleCompleteLayer(6)}
                  onSaveWriting={handleSaveWriting}
                />
              )}

              {activeLayer === 7 && activeLesson && (
                <Layer5SpeakingSimulation
                  lesson={activeLesson}
                  onCompleteLayer={() => handleCompleteLayer(7)}
                />
              )}

              {/* Ekstra katman: metodolojinin çekirdeğinde yok, destek çalışması */}
              {activeLayer === 8 && activeLesson && (
                <Layer2PhoneticsGrammar
                  lesson={activeLesson}
                  onCompleteLayer={() => handleCompleteLayer(8)}
                  onUpdateLessonData={handleUpdateLessonData}
                />
              )}

              {activeLayer === 10 && (
                <VocabHub lesson={activeLesson} lessons={lessons} />
              )}

              {activeLayer === 9 && (
                <ProgressDashboard
                  progress={displayProgress}
                  lessons={lessons}
                  onSelectLesson={(lesson) => {
                    setActiveLessonId(lesson.id);
                    setActiveLayer(1);
                  }}
                />
              )}

              {activeLayer === 11 && (
                <MistakesNotebook
                  mistakes={mistakes}
                  lessons={lessons}
                  onRemoveMistake={handleRemoveMistake}
                  onClearMistakes={handleClearMistakes}
                  onSelectLesson={(lessonId) => {
                    setActiveLessonId(lessonId);
                    setActiveLayer(4);
                  }}
                />
              )}

              {activeLayer === 12 && <Dashboard />}
            </>
          )}

          {/* Alt sabit aksiyon bari. Yalnizca cekirdek katmanlarda:
              araclarin (kelime kartlari, pano) "tamamlanmasi" diye bir
              sey yok, orada bar yaniltici olurdu. */}
          {isCoreLayer && activeLesson && (
            <NextLayerBar
              step={coreIndex + 1}
              totalSteps={CORE_LAYERS.length}
              isCompleted={isActiveLayerDone}
              nextLabel={nextCore ? nextCore.label : null}
              onComplete={() => handleCompleteLayer(activeLayer)}
              onGoNext={() => nextCore && setActiveLayer(nextCore.id)}
            />
          )}
          </div>
          )}
        </main>
      </div>

      {/* Alt bilgi. Eskiden koyu bir serit halindeydi ve uzerindeki
          yazi ayni koyulukta oldugu icin okunmuyordu (kontrast orani
          1.0). Ayrica sayfanin en dikkat cekici ogesi oydu; oysa
          soyledigi sey bir imza. */}
      <footer className="border-t border-hairline py-5 text-center text-[11px] text-ink-3">
        <p>Katmanlı Çalışma (Layered Learning) Metodolojisi</p>
      </footer>

      {/* Modals & Drawers */}
      <MethodologyGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <GrammarCoachDrawer
        isOpen={isGrammarCoachOpen}
        onClose={() => setIsGrammarCoachOpen(false)}
        activeLessonTitle={activeLesson ? activeLesson.title : ''}
      />

      <EditLessonModal
        isOpen={!!editingLesson}
        lesson={editingLesson}
        onClose={() => setEditingLesson(null)}
        onSaveLesson={handleSaveEditedLesson}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <LessonPickerModal
        isOpen={isLessonPickerOpen}
        onClose={() => setIsLessonPickerOpen(false)}
        lessons={lessons}
        activeLesson={activeLesson ?? null}
        onSelectLesson={(lesson) => {
          setActiveLessonId(lesson.id);
          setActiveLayer(1);
        }}
        onImportCustomLesson={handleImportCustomLesson}
        onDeleteLesson={handleDeleteLesson}
        onEditLesson={(lesson) => setEditingLesson(lesson)}
        onRestorePresetLessons={handleRestorePresetLessons}
      />

      <GoalEditorModal
        isOpen={isGoalEditorOpen}
        onClose={() => setIsGoalEditorOpen(false)}
        progress={displayProgress}
        onUpdateProgress={handleUpdateProgress}
      />
    </div>
  );
}
