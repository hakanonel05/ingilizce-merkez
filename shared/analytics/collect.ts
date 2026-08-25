/**
 * PANO VERİSİNİN TOPLANMASI
 *
 * İki uygulama da aynı origin altında çalıştığı için (netlify.toml'daki
 * yönlendirmeler) localStorage ve IndexedDB ikisi arasında paylaşılıyor.
 * Bu dosya her iki tarafın deposunu okuyup tek bir tabloya indirger;
 * pano bileşeni yalnızca bu tabloyu çizer.
 *
 * VERİNİN İKİ SINIFI VAR ve ayrı tutulmaları önemli:
 *
 *   1. ZAMAN DAMGALI — takvime düşebilir. Eklenen kartlar (createdAt),
 *      quiz ve sınav sonuçları, yanlışlar, çalışılan günler ve bundan
 *      sonrası için olay günlüğü.
 *   2. DAMGASIZ — yalnızca toplam olarak bilinebilir. Tamamlanan
 *      katmanlar, okunan parçalar, kelime durumları, toplam süre.
 *      Bunlar "bitti" bilgisiyle kaydedilmiş, ne zaman bittiği hiçbir
 *      yerde yok; geriye dönük uydurmak yerine panoda ayrı bir başlıkta
 *      "tarihsiz toplam" olarak gösteriliyor.
 *
 * Eksik ya da bozuk depo içeriği panoyu düşürmemeli: her okuma kendi
 * içinde korumalı, hata durumunda o kaynak boş sayılır.
 */

import { getAllCards, VocabCard, cardSources } from '../vocab/vocabStore';
import { CefrLevel, CEFR_ORDER } from '../vocab/cefr';
import { PartOfSpeech } from '../vocab/pos';
import {
  DayStatRow,
  Skill,
  dayKey,
  getAllDayStats,
} from './activityLog';

/* ------------------------------------------------------------------ */
/* Depo anahtarları                                                     */
/* ------------------------------------------------------------------ */

const KEY_KATMANLI_PROGRESS = 'layered_learning_progress_v1';
const KEY_KATMANLI_LESSONS = 'layered_learning_lessons_v2';
const KEY_KATMANLI_MISTAKES = 'layered_learning_mistakes_v1';
const KEY_READING_PROGRESS = 'english_reading_trainer_progress_v1';
const RECORDINGS_DB = 'layered_learning_recordings';
/** recordingStore ile ayni surum olmali; aciklama countRecordings'te. */
const RECORDINGS_DB_VERSION = 2;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

/**
 * Katman numarası -> beceri.
 * Katmanlar sabit bir sırayla tanımlı (bkz. LayerNavigation); numaraların
 * hangi beceriye karşılık geldiği yalnızca burada yazılı.
 */
export const LAYER_SKILLS: Record<number, Skill> = {
  1: 'reading',    // Çift Dilli Okuma
  2: 'listening',  // Aktif Dinleme
  3: 'speaking',   // Sesli Okuma / Gölgeleme
  4: 'listening',  // Altyazısız İzleme
  5: 'listening',  // Sadece Dinleme
  6: 'writing',    // Özet & Yorum
  7: 'speaking',   // Sesli Anlatım
  8: 'grammar',    // Fonetik & Gramer
};

export const LAYER_NAMES: Record<number, string> = {
  1: 'Çift Dilli Okuma',
  2: 'Aktif Dinleme',
  3: 'Sesli Okuma (Gölgeleme)',
  4: 'Altyazısız İzleme',
  5: 'Sadece Dinleme',
  6: 'Özet & Yorum',
  7: 'Sesli Anlatım',
  8: 'Fonetik & Gramer',
};

const EMPTY_SKILL_MINUTES = (): Record<Skill, number> => ({
  reading: 0, listening: 0, speaking: 0, writing: 0, vocab: 0, grammar: 0, exam: 0,
});

/* ------------------------------------------------------------------ */
/* Çıktı tipleri                                                        */
/* ------------------------------------------------------------------ */

export interface DayStat {
  day: string;
  minutesBySkill: Record<Skill, number>;
  minutesTotal: number;
  /** O gün eklenen kelime kartı sayısı. */
  wordsAdded: number;
  /** O gün yapılan kart tekrarı sayısı. */
  reviews: number;
  /** Çözülen quiz / alıştırma / sınav sayısı. */
  quizzes: number;
  /** Tamamlanan katman veya parça sayısı. */
  completions: number;
  /** Yapılan yanlış sayısı (yanlışlar defterine düşen). */
  mistakes: number;
  /** Eski kayıtlardan "bugün çalışıldı" bilgisi (süre bilinmiyor). */
  markedActive: boolean;
  /** Herhangi bir hareket var mı? */
  active: boolean;
}

export interface WordRow {
  front: string;
  back: string;
  level: CefrLevel;
  pos?: PartOfSpeech;
  kind: string;
  lessonTitle: string;
  /** Kelimenin görüldüğü tüm yerler, geçtiği cümleyle birlikte. */
  sources: { lessonTitle: string; contextEn?: string }[];
  /** 'reading' veya 'katmanli' — kartın İLK eklendiği uygulama. */
  source: 'reading' | 'katmanli';
  createdAt: number;
  day: string;
  reps: number;
  lapses: number;
  due: number;
  /** Hiç tekrar edilmemişse true. */
  isNew: boolean;
}

export interface Snapshot {
  /** İlk hareketten bugüne kadar boşluksuz gün dizisi. */
  days: DayStat[];
  byDay: Map<string, DayStat>;
  firstDay: string | null;

  totals: {
    /** Olay günlüğünden gelen gerçek süre (dakika). */
    minutesBySkill: Record<Skill, number>;
    minutesTotal: number;
    activeDays: number;
    currentStreak: number;
    longestStreak: number;
    wordsAdded: number;
    reviews: number;
    quizzes: number;
    completions: number;
  };

  vocab: {
    total: number;
    /** Hiç çalışılmamış kartlar. */
    fresh: number;
    /** En az bir kez doğru hatırlanmış, tekrara geçmiş kartlar. */
    mature: number;
    due: number;
    suspended: number;
    byLevel: Record<CefrLevel, number>;
    byPos: Record<string, number>;
    byKind: Record<string, number>;
    /** Ders/parça başına kart sayısı, çoktan aza. */
    bySource: { title: string; count: number }[];
    totalReps: number;
    totalLapses: number;
    /** Tutma oranı: 1 - (unutma / toplam tekrar). */
    retention: number | null;
    /** Önümüzdeki 30 günün tekrar yükü. */
    forecast: { day: string; count: number }[];
    /** En çok unutulan kartlar. */
    hardest: WordRow[];
  };

  words: WordRow[];

  /** Zaman damgası olmayan, yalnızca toplam olarak bilinen veriler. */
  undated: {
    katmanli: {
      lessons: number;
      completedLayers: number;
      layerCounts: Record<number, number>;
      skillCompletions: Record<Skill, number>;
      recordings: number;
    };
    reading: {
      passagesCompleted: number;
      wordsStudied: number;
      wordsLearned: number;
      totalMinutes: number;
      favorites: number;
    };
  };

  /** Quiz/sınav başarımının zaman içindeki seyri. */
  scoreTrend: { ts: number; day: string; percent: number; label: string }[];
}

/* ------------------------------------------------------------------ */
/* Yardımcılar                                                          */
/* ------------------------------------------------------------------ */

function emptyDay(day: string): DayStat {
  return {
    day,
    minutesBySkill: EMPTY_SKILL_MINUTES(),
    minutesTotal: 0,
    wordsAdded: 0,
    reviews: 0,
    quizzes: 0,
    completions: 0,
    mistakes: 0,
    markedActive: false,
    active: false,
  };
}

function addDays(day: string, count: number): string {
  const [y, m, d] = day.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + count);
  return dayKey(date);
}

/** Ardışık gün serisi: bugünden ya da dünden geriye doğru sayar. */
function computeStreaks(activeDays: Set<string>): { current: number; longest: number } {
  if (activeDays.size === 0) return { current: 0, longest: 0 };

  const sorted = [...activeDays].sort();
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (addDays(sorted[i - 1], 1) === sorted[i]) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  // Güncel seri: bugün çalışılmadıysa dünden başlar (gün henüz bitmedi)
  const today = dayKey();
  let cursor = activeDays.has(today) ? today : addDays(today, -1);
  let current = 0;
  while (activeDays.has(cursor)) {
    current++;
    cursor = addDays(cursor, -1);
  }

  return { current, longest };
}

/**
 * Ses kaydı sayısı. Blob'ları belleğe almamak için yalnızca sayılır.
 *
 * DİKKAT — SÜRÜM VE ŞEMA: veritabanı sürüm verilmeden açılırsa ve henüz
 * yoksa, tarayıcı onu SÜRÜM 1'de ve BOŞ olarak yaratır. recordingStore
 * daha sonra aynı veritabanını sürüm 1 ile açtığında onupgradeneeded
 * tetiklenmez, 'recordings' deposu hiç oluşmaz ve her kayıt işlemi
 * "object store not found" ile patlar — senkronizasyon dahil, çünkü
 * runSync kayıtları listeliyor.
 *
 * Bu yüzden burada recordingStore ile AYNI sürüm ve şema kullanılıyor:
 * hangisi önce açarsa açsın depo doğru kurulur.
 * (Şema değişirse iki dosyanın birlikte güncellenmesi gerekir.)
 */
async function countRecordings(): Promise<number> {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(RECORDINGS_DB, RECORDINGS_DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('recordings')) {
          const store = db.createObjectStore('recordings', { keyPath: 'key' });
          store.createIndex('lessonId', 'lessonId', { unique: false });
        }
      };
      req.onsuccess = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('recordings')) {
          db.close();
          return resolve(0);
        }
        const countReq = db.transaction('recordings', 'readonly')
          .objectStore('recordings')
          .count();
        countReq.onsuccess = () => { db.close(); resolve(countReq.result || 0); };
        countReq.onerror = () => { db.close(); resolve(0); };
      };
      // Baska sekme yukseltmeyi engelliyorsa bekleme; kayit sayisi
      // panonun calismasi icin sart degil.
      req.onblocked = () => resolve(0);
      req.onerror = () => resolve(0);
    } catch {
      resolve(0);
    }
  });
}

/* ------------------------------------------------------------------ */
/* Ana toplama                                                          */
/* ------------------------------------------------------------------ */

export async function collectSnapshot(): Promise<Snapshot> {
  const [cards, statRows, recordings] = await Promise.all([
    getAllCards().catch(() => [] as VocabCard[]),
    getAllDayStats(),
    countRecordings(),
  ]);

  const katmanliProgress = readJson<any>(KEY_KATMANLI_PROGRESS, {});
  const lessons = readJson<any[]>(KEY_KATMANLI_LESSONS, []);
  const katmanliMistakes = readJson<any[]>(KEY_KATMANLI_MISTAKES, []);
  const reading = readJson<any>(KEY_READING_PROGRESS, {});

  const byDay = new Map<string, DayStat>();
  const touch = (day: string): DayStat => {
    let stat = byDay.get(day);
    if (!stat) { stat = emptyDay(day); byDay.set(day, stat); }
    return stat;
  };

  /* --- 1. Günlük çalışma kayıtları (süre ve sayaçlar) ---
     Satırlar gün + CİHAZ başına tutuluyor; aynı günü birden çok cihazda
     çalıştıysan hepsi toplanır. Kart eklemeleri buradan değil, kartların
     kendi createdAt'inden sayılıyor (iki kez saymamak için). */
  for (const row of statRows as DayStatRow[]) {
    const stat = touch(row.day);
    for (const [skill, seconds] of Object.entries(row.secondsBySkill || {})) {
      const minutes = (seconds as number) / 60;
      stat.minutesBySkill[skill as Skill] += minutes;
      stat.minutesTotal += minutes;
    }
    stat.reviews += row.reviews || 0;
    stat.quizzes += row.quizzes || 0;
    stat.completions += row.completions || 0;
  }

  /* --- 2. Kelime kartları --- */
  const words: WordRow[] = [];
  const byLevel = CEFR_ORDER.reduce((acc, l) => { acc[l] = 0; return acc; }, {} as Record<CefrLevel, number>);
  const byPos: Record<string, number> = {};
  const byKind: Record<string, number> = {};
  const bySourceMap = new Map<string, number>();
  const forecastMap = new Map<string, number>();

  let totalReps = 0;
  let totalLapses = 0;
  let fresh = 0;
  let mature = 0;
  let due = 0;
  let suspended = 0;
  const now = Date.now();

  for (const card of cards) {
    const day = dayKey(card.createdAt);
    touch(day).wordsAdded += 1;

    const sources = cardSources(card);

    const row: WordRow = {
      front: card.front,
      back: card.back,
      level: card.level,
      pos: card.pos,
      kind: card.kind,
      lessonTitle: card.lessonTitle,
      sources: sources.map((s) => ({ lessonTitle: s.lessonTitle, contextEn: s.contextEn })),
      source: card.lessonId.startsWith('reading:') ? 'reading' : 'katmanli',
      createdAt: card.createdAt,
      day,
      reps: card.reps,
      lapses: card.lapses,
      due: card.due,
      isNew: card.reps === 0,
    };
    words.push(row);

    byLevel[card.level] = (byLevel[card.level] || 0) + 1;
    const posKey = card.pos || 'bilinmiyor';
    byPos[posKey] = (byPos[posKey] || 0) + 1;
    byKind[card.kind] = (byKind[card.kind] || 0) + 1;
    // Kelime birden cok metinde gectiyse her birinde sayilir; toplam kart
    // sayisindan buyuk cikabilir, bu yuzden basligi "gecis" degil "kart".
    for (const src of sources) {
      bySourceMap.set(src.lessonTitle, (bySourceMap.get(src.lessonTitle) || 0) + 1);
    }

    totalReps += card.reps;
    totalLapses += card.lapses;
    if (card.reps === 0) fresh++;
    if (card.reps > 0 && card.lapses === 0) mature++;
    if (card.suspended) suspended++;
    else if (card.due <= now) due++;

    // Gelecek 30 günün tekrar yükü
    if (!card.suspended && card.due > now) {
      const dueDay = dayKey(card.due);
      forecastMap.set(dueDay, (forecastMap.get(dueDay) || 0) + 1);
    }
  }

  words.sort((a, b) => b.createdAt - a.createdAt);

  const forecast: { day: string; count: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const day = addDays(dayKey(), i);
    forecast.push({ day, count: forecastMap.get(day) || 0 });
  }

  const hardest = [...words]
    .filter((w) => w.lapses > 0)
    .sort((a, b) => b.lapses - a.lapses)
    .slice(0, 12);

  /* --- 3. Okuma uygulaması: quiz ve sınav geçmişi --- */
  const scoreTrend: Snapshot['scoreTrend'] = [];

  const scores = (reading.scores || {}) as Record<string, any>;
  for (const [passageId, entry] of Object.entries(scores)) {
    const ts = Date.parse(entry?.timestamp || '');
    if (!Number.isFinite(ts)) continue;
    const day = dayKey(ts);
    touch(day).quizzes += 1;
    if (entry.total > 0) {
      scoreTrend.push({
        ts,
        day,
        percent: Math.round((entry.score / entry.total) * 100),
        label: `Parça ${passageId}`,
      });
    }
  }

  for (const attempt of (reading.examHistory || []) as any[]) {
    const ts = Date.parse(attempt?.timestamp || '');
    if (!Number.isFinite(ts)) continue;
    const day = dayKey(ts);
    const stat = touch(day);
    stat.quizzes += 1;
    stat.minutesBySkill.exam += (attempt.timeTakenSeconds || 0) / 60;
    stat.minutesTotal += (attempt.timeTakenSeconds || 0) / 60;
    if (attempt.totalQuestions > 0) {
      scoreTrend.push({
        ts,
        day,
        percent: Math.round((attempt.correctCount / attempt.totalQuestions) * 100),
        label: 'Deneme sınavı',
      });
    }
  }

  /* --- 4. Yanlışlar (iki uygulama da tarih tutuyor) --- */
  for (const mistake of (reading.mistakes || []) as any[]) {
    const ts = Date.parse(mistake?.firstMissedAt || '');
    if (Number.isFinite(ts)) touch(dayKey(ts)).mistakes += 1;
  }
  for (const mistake of katmanliMistakes) {
    const ts = Date.parse(mistake?.timestamp || '');
    if (Number.isFinite(ts)) touch(dayKey(ts)).mistakes += 1;
  }

  /* --- 5. Eski "çalışıldı" işaretleri --- */
  for (const day of (katmanliProgress.studyDates || []) as string[]) {
    if (typeof day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(day)) {
      touch(day).markedActive = true;
    }
  }
  // Katmanlı yalnızca son 7 günün dakikasını tutuyordu; olay günlüğü
  // yokken geçen günler için elimizdeki tek süre bilgisi bu.
  for (const entry of (katmanliProgress.weeklyStudyMinutes || []) as any[]) {
    if (!entry?.date || !entry?.minutes) continue;
    const stat = touch(entry.date);
    if (stat.minutesTotal === 0) {
      stat.minutesTotal = entry.minutes;
      stat.minutesBySkill.listening += entry.minutes;
    }
  }

  /* --- 6. Günleri boşluksuz diziye çevir --- */
  for (const stat of byDay.values()) {
    stat.active =
      stat.markedActive ||
      stat.minutesTotal > 0 ||
      stat.wordsAdded > 0 ||
      stat.reviews > 0 ||
      stat.quizzes > 0 ||
      stat.completions > 0;
  }

  const sortedDays = [...byDay.keys()].sort();
  const firstDay = sortedDays[0] || null;
  const days: DayStat[] = [];
  if (firstDay) {
    const today = dayKey();
    let cursor = firstDay;
    // Güvenlik sınırı: bozuk bir tarih sonsuz döngüye sokmasın
    for (let guard = 0; guard < 4000 && cursor <= today; guard++) {
      days.push(byDay.get(cursor) || emptyDay(cursor));
      cursor = addDays(cursor, 1);
    }
  }

  const activeDaySet = new Set(days.filter((d) => d.active).map((d) => d.day));
  const streaks = computeStreaks(activeDaySet);

  const totalsBySkill = EMPTY_SKILL_MINUTES();
  let minutesTotal = 0;
  let reviews = 0;
  let quizzes = 0;
  let completions = 0;
  for (const day of days) {
    for (const skill of Object.keys(totalsBySkill) as Skill[]) {
      totalsBySkill[skill] += day.minutesBySkill[skill];
    }
    minutesTotal += day.minutesTotal;
    reviews += day.reviews;
    quizzes += day.quizzes;
    completions += day.completions;
  }

  /* --- 7. Tarihsiz toplamlar --- */
  const layerCounts: Record<number, number> = {};
  const skillCompletions = EMPTY_SKILL_MINUTES();
  let completedLayers = 0;
  for (const lesson of lessons) {
    for (const layer of (lesson?.completedLayers || []) as number[]) {
      layerCounts[layer] = (layerCounts[layer] || 0) + 1;
      completedLayers++;
      const skill = LAYER_SKILLS[layer];
      if (skill) skillCompletions[skill] += 1;
    }
  }

  const wordStatus = (reading.wordStatus || {}) as Record<string, string>;
  const statusValues = Object.values(wordStatus);

  return {
    days,
    byDay,
    firstDay,
    totals: {
      minutesBySkill: totalsBySkill,
      minutesTotal,
      activeDays: activeDaySet.size,
      currentStreak: streaks.current,
      longestStreak: streaks.longest,
      wordsAdded: cards.length,
      reviews,
      quizzes,
      completions,
    },
    vocab: {
      total: cards.length,
      fresh,
      mature,
      due,
      suspended,
      byLevel,
      byPos,
      byKind,
      bySource: [...bySourceMap.entries()]
        .map(([title, count]) => ({ title, count }))
        .sort((a, b) => b.count - a.count),
      totalReps,
      totalLapses,
      retention: totalReps > 0 ? 1 - totalLapses / totalReps : null,
      forecast,
      hardest,
    },
    words,
    undated: {
      katmanli: {
        lessons: lessons.length,
        completedLayers,
        layerCounts,
        skillCompletions,
        recordings,
      },
      reading: {
        passagesCompleted: (reading.completedPassages || []).length,
        wordsStudied: statusValues.filter((s) => s === 'studied').length,
        wordsLearned: statusValues.filter((s) => s === 'learned').length,
        totalMinutes: Math.round((reading.totalTimeSpent || 0) / 60),
        favorites: (reading.favoritePassages || []).length,
      },
    },
    scoreTrend: scoreTrend.sort((a, b) => a.ts - b.ts),
  };
}
