/**
 * ÇALIŞMA OLAY GÜNLÜĞÜ (append-only)
 *
 * NEDEN VAR: uygulama bugüne kadar yalnızca DURUM tuttu — "bu katman
 * tamamlandı", "bu kelime öğrenildi". Ne zaman ve ne kadar süreyle
 * çalışıldığı hiçbir yere yazılmadı. Bu yüzden "ne kadar reading, ne
 * kadar listening çalıştım" sorusu mevcut veriyle yanıtlanamıyordu:
 * tamamlanan katman SAYISI biliniyor ama tarihi de süresi de bilinmiyor.
 *
 * Buradaki günlük bunu düzeltir. Her kayıt olup bitmiş tek bir olaydır;
 * hiçbir zaman güncellenmez, yalnızca eklenir. Böylece takvim, beceri
 * dağılımı ve süre grafikleri tek bir kaynaktan hesaplanabilir.
 *
 * AYRI VERİTABANI: kelime kartları 'layered_learning_vocab' içinde
 * yaşıyor. Oraya yeni bir store eklemek sürüm yükseltmesi gerektirir ve
 * servis çalışanının önbelleğinde kalmış eski bir istemci o veritabanını
 * açamaz hale gelir. Olaylar bu yüzden kendi veritabanında.
 *
 * GÜN SINIRI: takvim yerel güne göre çizilir, o yüzden her olay epoch
 * damgasının yanında yerel 'YYYY-MM-DD' anahtarını da taşır. Sonradan
 * hesaplamak, kaydı başka saat diliminde okumak gerektiğinde yanıltırdı.
 */

const DB_NAME = 'layered_learning_activity';
const DB_VERSION = 1;
const STORE = 'events';

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

/** Olayın türü — süre mi, tamamlama mı, tekrar mı olduğunu ayırır. */
export type ActivityKind =
  /** Ekranda geçirilen süre (zamanlayıcıdan). */
  | 'session'
  /** Bir katman/parça tamamlandı. */
  | 'complete'
  /** Kelime kartı tekrarı yapıldı. */
  | 'review'
  /** Yeni kart(lar) eklendi. */
  | 'card-added'
  /** Quiz / alıştırma / sınav sonucu. */
  | 'quiz'
  /** Gölgeleme kaydı alındı. */
  | 'recording';

export interface ActivityEvent {
  id: string;
  /** Epoch milisaniye. */
  ts: number;
  /** Yerel gün anahtarı, 'YYYY-MM-DD'. Takvim bunu kullanır. */
  day: string;
  app: 'katmanli' | 'reading';
  skill: Skill;
  kind: ActivityKind;
  /** Süre (saniye) — yalnızca 'session' olaylarında dolu. */
  seconds?: number;
  /** Adet: eklenen kart, çalışılan kart, çözülen soru sayısı. */
  count?: number;
  /** Doğru sayısı (quiz/review). */
  correct?: number;
  /** Toplam soru (quiz). */
  total?: number;
  /** Ders veya parça kimliği. */
  refId?: string;
  /** Ders veya parça başlığı — sonradan silinse bile panoda okunabilsin. */
  refTitle?: string;
}

/** Yerel güne göre 'YYYY-MM-DD'. */
export function dayKey(date: Date | number = Date.now()): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        // Takvim gün gün okuyor; beceri kırılımı da sık sorulan sorgu.
        store.createIndex('day', 'day', { unique: false });
        store.createIndex('ts', 'ts', { unique: false });
        store.createIndex('skill', 'skill', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Pano açıkken yeni olay düşerse kendini tazeleyebilsin diye. */
export const ACTIVITY_CHANGED_EVENT = 'activity-log-changed';

function notifyChanged(): void {
  try {
    window.dispatchEvent(new CustomEvent(ACTIVITY_CHANGED_EVENT));
  } catch {
    /* tarayıcı dışı ortamlarda yoksay */
  }
}

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Olayı yazar.
 *
 * Sessizce başarısız olur: günlük tutmak çalışmanın kendisinden daha
 * önemli değil. Depolama kotası dolduğunda ya da özel sekmede
 * IndexedDB kapalı olduğunda ders ekranı çalışmaya devam etmeli.
 */
export async function logActivity(
  event: Omit<ActivityEvent, 'id' | 'ts' | 'day'> & { ts?: number }
): Promise<void> {
  const ts = event.ts ?? Date.now();
  const record: ActivityEvent = { ...event, id: makeId(), ts, day: dayKey(ts) };

  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const t = db.transaction(STORE, 'readwrite');
      t.objectStore(STORE).put(record);
      t.oncomplete = () => { db.close(); resolve(); };
      t.onerror = () => { db.close(); reject(t.error); };
    });
    notifyChanged();
  } catch (err) {
    console.warn('[activity] olay yazılamadı:', err);
  }
}

/** Tüm olaylar, eskiden yeniye. */
export async function getAllActivity(): Promise<ActivityEvent[]> {
  try {
    const db = await openDb();
    const rows = await new Promise<ActivityEvent[]>((resolve, reject) => {
      const t = db.transaction(STORE, 'readonly');
      const req = t.objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
      t.oncomplete = () => db.close();
    });
    return rows.sort((a, b) => a.ts - b.ts);
  } catch (err) {
    console.warn('[activity] olaylar okunamadı:', err);
    return [];
  }
}

/** Günlüğü siler (ayarlardaki veri sıfırlama için). */
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

  /** Biriken süreyi olay olarak yazar ve sayacı sıfırlar. */
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
