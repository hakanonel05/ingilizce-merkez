/**
 * ÇALIŞMA KAYITLARI (gün + cihaz başına toplam)
 *
 * NEDEN VAR: uygulama bugüne kadar yalnızca DURUM tuttu — "bu katman
 * tamamlandı", "bu kelime öğrenildi". Ne zaman ve ne kadar süreyle
 * çalışıldığı hiçbir yere yazılmadı, dolayısıyla "ne kadar reading, ne
 * kadar listening çalıştım" sorusunun karşılığı yoktu.
 *
 * NEDEN OLAY DEĞİL DE GÜNLÜK TOPLAM: ilk sürüm her ölçümü ayrı bir olay
 * olarak yazıyordu. Süre sayacı dakikada bir yazdığı için günde iki saat
 * çalışan biri yılda ~44.000 kayıt üretiyordu; bu hacim senkronizasyona
 * sığmıyor (sunucu istek başına 500 kayıt alıyor ve her senkronda tüm
 * kayıtlar gönderiliyor). Panoda gösterilen her şey zaten GÜNLÜK toplam
 * olduğu için kayıtlar doğrudan o biçimde tutuluyor: yılda ~365 satır.
 *
 * CİHAZ KİMLİĞİ: satır anahtarı `gün|cihaz`. İki cihaz aynı gün çalışırsa
 * ayrı satır yazarlar ve pano ikisini toplar. Ortak tek satır olsaydı
 * senkronda "son yazan kazanır" kuralı diğer cihazın dakikalarını
 * silerdi.
 *
 * SENKRON: satırlar `stat:<gün|cihaz>` anahtarıyla kartlarla aynı yoldan
 * gider (bkz. apps/katmanli/src/lib/syncClient.ts). Tarayıcı verisi
 * silinse ya da başka bir cihazdan girilse takvim geri gelir.
 */

const DB_NAME = 'layered_learning_activity';
const DB_VERSION = 2;
const STORE = 'stats';
/** İlk sürümün olay deposu; sürüm 2'ye geçerken içeriği toplamlara katlanıyor. */
const LEGACY_STORE = 'events';
const DEVICE_KEY = 'layered_learning_device_id_v1';

/** Ölçtüğümüz beceriler. Katman numaraları ve ekranlar buraya eşlenir. */
export type Skill =
  | 'reading'
  | 'listening'
  | 'speaking'
  | 'writing'
  | 'vocab'
  | 'grammar'
  | 'exam';

export const SKILL_LABELS_TR: Record<Skill, string> = {
  reading: 'Okuma',
  listening: 'Dinleme',
  speaking: 'Konuşma',
  writing: 'Yazma',
  vocab: 'Kelime',
  grammar: 'Dilbilgisi',
  exam: 'Sınav',
};

export type ActivityKind =
  /** Ekranda geçirilen süre (zamanlayıcıdan). */
  | 'session'
  /** Bir katman/parça tamamlandı. */
  | 'complete'
  /** Kelime kartı tekrarı yapıldı. */
  | 'review'
  /** Yeni kart(lar) eklendi — kartın kendi createdAt'i de var, sayaç bilgi amaçlı. */
  | 'card-added'
  /** Quiz / alıştırma / sınav sonucu. */
  | 'quiz'
  /** Gölgeleme kaydı alındı. */
  | 'recording';

/** Bir günün, bir cihazdaki toplamı. */
export interface DayStatRow {
  /** `${day}|${deviceId}` */
  id: string;
  /** Yerel gün anahtarı, 'YYYY-MM-DD'. */
  day: string;
  deviceId: string;
  /** Beceri başına saniye. Dakikaya pano tarafında çevriliyor. */
  secondsBySkill: Partial<Record<Skill, number>>;
  reviews: number;
  /** Doğru hatırlanan tekrar sayısı (tutma oranı için). */
  reviewsCorrect: number;
  quizzes: number;
  completions: number;
  recordings: number;
  cardsAdded: number;
  updatedAt: number;
}

/** Yerel güne göre 'YYYY-MM-DD'. */
export function dayKey(date: Date | number = Date.now()): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Bu tarayıcıya özel, kalıcı kimlik. */
export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    // Depolama kapalıysa oturumluk kimlik: kayıt tutulur ama senkronlanmaz
    return 'dgecici';
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('day', 'day', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Pano açıkken kayıt değişirse kendini tazeleyebilsin diye. */
export const ACTIVITY_CHANGED_EVENT = 'activity-log-changed';

function notifyChanged(): void {
  try {
    window.dispatchEvent(new CustomEvent(ACTIVITY_CHANGED_EVENT));
  } catch {
    /* tarayıcı dışı ortamlarda yoksay */
  }
}

function emptyRow(day: string, deviceId: string): DayStatRow {
  return {
    id: `${day}|${deviceId}`,
    day,
    deviceId,
    secondsBySkill: {},
    reviews: 0,
    reviewsCorrect: 0,
    quizzes: 0,
    completions: 0,
    recordings: 0,
    cardsAdded: 0,
    updatedAt: Date.now(),
  };
}

export interface ActivityInput {
  app: 'katmanli' | 'reading';
  skill: Skill;
  kind: ActivityKind;
  /** Süre (saniye) — 'session' için. */
  seconds?: number;
  /** Adet: tekrar, kart, soru. */
  count?: number;
  /** Doğru sayısı (review/quiz). */
  correct?: number;
  total?: number;
  refId?: string;
  refTitle?: string;
  /** Farklı bir güne yazmak için (geriye dönük aktarım). */
  ts?: number;
}

/**
 * Kaydı ilgili günün satırına ekler.
 *
 * Sessizce başarısız olur: kayıt tutmak çalışmanın kendisinden daha
 * önemli değil. Kota dolduğunda ya da özel sekmede IndexedDB kapalı
 * olduğunda ders ekranı çalışmaya devam etmeli.
 */
export async function logActivity(input: ActivityInput): Promise<void> {
  const ts = input.ts ?? Date.now();
  const day = dayKey(ts);
  const deviceId = getDeviceId();
  const id = `${day}|${deviceId}`;

  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const t = db.transaction(STORE, 'readwrite');
      const store = t.objectStore(STORE);
      const getReq = store.get(id);

      getReq.onsuccess = () => {
        const row: DayStatRow = getReq.result || emptyRow(day, deviceId);

        switch (input.kind) {
          case 'session':
            row.secondsBySkill[input.skill] =
              (row.secondsBySkill[input.skill] || 0) + (input.seconds || 0);
            break;
          case 'review':
            row.reviews += input.count || 1;
            row.reviewsCorrect += input.correct ?? 0;
            break;
          case 'quiz':
            row.quizzes += input.count || 1;
            break;
          case 'complete':
            row.completions += input.count || 1;
            break;
          case 'recording':
            row.recordings += input.count || 1;
            break;
          case 'card-added':
            row.cardsAdded += input.count || 1;
            break;
        }

        row.updatedAt = Date.now();
        store.put(row);
      };

      t.oncomplete = () => { db.close(); resolve(); };
      t.onerror = () => { db.close(); reject(t.error); };
    });
    notifyChanged();
  } catch (err) {
    console.warn('[activity] kayıt yazılamadı:', err);
  }
}

/** Tüm günlük satırlar (tüm cihazlar), gün sırasıyla. */
export async function getAllDayStats(): Promise<DayStatRow[]> {
  try {
    await migrateLegacyEvents();
    const db = await openDb();
    const rows = await new Promise<DayStatRow[]>((resolve, reject) => {
      const t = db.transaction(STORE, 'readonly');
      const req = t.objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
      t.oncomplete = () => db.close();
    });
    return rows.sort((a, b) => a.day.localeCompare(b.day));
  } catch (err) {
    console.warn('[activity] kayıtlar okunamadı:', err);
    return [];
  }
}

/**
 * Senkronizasyondan gelen satırı yazar.
 * Satırların sahibi cihazdır: aynı kimlikli satırda son yazan kazanır,
 * farklı cihazların satırları birbirine dokunmaz.
 */
export async function putDayStatSilently(row: DayStatRow): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const t = db.transaction(STORE, 'readwrite');
    t.objectStore(STORE).put(row);
    t.oncomplete = () => { db.close(); resolve(); };
    t.onerror = () => { db.close(); reject(t.error); };
  });
}

/** Kayıtları siler (ayarlardaki veri sıfırlama için). */
export async function clearActivity(): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const t = db.transaction(STORE, 'readwrite');
    t.objectStore(STORE).clear();
    t.oncomplete = () => { db.close(); resolve(); };
    t.onerror = () => { db.close(); reject(t.error); };
  });
  notifyChanged();
}

/**
 * İlk sürümdeki olay kayıtlarını günlük toplamlara katlar.
 *
 * Olay deposu yalnızca kısa bir süre yayında kaldı, ama o sırada
 * çalışılmışsa takvimde boşluk kalmasın. Bir kez çalışır: katlanan
 * olaylar silinir.
 */
let migrationDone = false;
async function migrateLegacyEvents(): Promise<void> {
  if (migrationDone) return;
  migrationDone = true;

  try {
    const db = await openDb();
    if (!db.objectStoreNames.contains(LEGACY_STORE)) {
      db.close();
      return;
    }

    const events = await new Promise<any[]>((resolve) => {
      const t = db.transaction(LEGACY_STORE, 'readonly');
      const req = t.objectStore(LEGACY_STORE).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
    db.close();

    if (events.length === 0) return;

    for (const event of events) {
      if (!event?.day || !event?.kind) continue;
      await logActivity({
        app: event.app || 'katmanli',
        skill: event.skill || 'reading',
        kind: event.kind,
        seconds: event.seconds,
        count: event.count,
        correct: event.correct,
        ts: event.ts,
      });
    }

    const db2 = await openDb();
    await new Promise<void>((resolve) => {
      const t = db2.transaction(LEGACY_STORE, 'readwrite');
      t.objectStore(LEGACY_STORE).clear();
      t.oncomplete = () => { db2.close(); resolve(); };
      t.onerror = () => { db2.close(); resolve(); };
    });
    console.info(`[activity] ${events.length} eski olay günlük toplamlara aktarıldı.`);
  } catch (err) {
    console.warn('[activity] eski olaylar aktarılamadı:', err);
  }
}

/* ============================================================
   SÜRE ÖLÇÜMÜ
   ============================================================ */

/** Bu süreden uzun duraklamalar "çalışmıyor" sayılır. */
const IDLE_TIMEOUT_MS = 90_000;
/** Bu kadar kısa oturumlar kaydedilmez; sekmeler arası gezinme gürültüsü. */
const MIN_SESSION_SECONDS = 10;
/** Açık ekran uzun sürerse arada yazılır ki sekme kapanırsa veri gitmesin. */
const FLUSH_INTERVAL_MS = 60_000;

/**
 * Bir ekranda geçirilen süreyi ölçer.
 *
 * Yalnızca sekme GÖRÜNÜRKEN ve kullanıcı son 90 saniye içinde bir şey
 * yapmışken sayar: video açıp başka sekmeye geçtiğinde ya da bilgisayarı
 * bırakıp gittiğinde saatler "çalışma" olarak yazılmasın. Ölçüm kaba
 * ama tutarlı; amaç saniyesi saniyesine muhasebe değil, beceriler
 * arasındaki dağılımı görebilmek.
 */
export class ActivityTimer {
  private accumulated = 0;
  private lastTick: number | null = null;
  private lastInteraction = Date.now();
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private disposed = false;

  constructor(
    private readonly meta: {
      app: 'katmanli' | 'reading';
      skill: Skill;
      refId?: string;
      refTitle?: string;
    }
  ) {
    this.lastTick = Date.now();
    this.bind();
    this.flushTimer = setInterval(() => { void this.flush(); }, FLUSH_INTERVAL_MS);
  }

  private onInteraction = () => { this.lastInteraction = Date.now(); };

  private onVisibility = () => {
    if (document.visibilityState === 'hidden') {
      this.tick();
      this.lastTick = null;
      void this.flush();
    } else {
      this.lastInteraction = Date.now();
      this.lastTick = Date.now();
    }
  };

  private bind(): void {
    document.addEventListener('visibilitychange', this.onVisibility);
    for (const e of ['keydown', 'pointerdown', 'wheel', 'touchstart'] as const) {
      window.addEventListener(e, this.onInteraction, { passive: true });
    }
  }

  private unbind(): void {
    document.removeEventListener('visibilitychange', this.onVisibility);
    for (const e of ['keydown', 'pointerdown', 'wheel', 'touchstart'] as const) {
      window.removeEventListener(e, this.onInteraction);
    }
  }

  /** Son ölçümden bu yana geçen süreyi, boştaysa saymadan, biriktirir. */
  private tick(): void {
    if (this.lastTick === null) return;
    const now = Date.now();
    const elapsed = now - this.lastTick;
    this.lastTick = now;

    if (document.visibilityState === 'hidden') return;
    if (now - this.lastInteraction > IDLE_TIMEOUT_MS) return;

    this.accumulated += elapsed;
  }

  /** Biriken süreyi güne yazar ve sayacı sıfırlar. */
  async flush(): Promise<void> {
    this.tick();
    const seconds = Math.round(this.accumulated / 1000);
    if (seconds < MIN_SESSION_SECONDS) return;

    this.accumulated = 0;
    await logActivity({
      app: this.meta.app,
      skill: this.meta.skill,
      kind: 'session',
      seconds,
      refId: this.meta.refId,
      refTitle: this.meta.refTitle,
    });
  }

  /** Ekrandan çıkarken çağrılır. */
  async stop(): Promise<void> {
    if (this.disposed) return;
    this.disposed = true;
    if (this.flushTimer) clearInterval(this.flushTimer);
    this.unbind();
    await this.flush();
  }
}
