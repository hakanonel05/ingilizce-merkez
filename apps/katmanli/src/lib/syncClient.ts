import { VocabCard, getAllCards, mergeRemoteCard, VOCAB_CHANGED_EVENT } from './vocabStore';
import { listAllRecordings, saveRecordingSilently, StoredRecording } from './recordingStore';
import {
  ACTIVITY_CHANGED_EVENT,
  DayStatRow,
  getAllDayStats,
  putDayStatSilently,
} from '../../../../shared/analytics/activityLog';

/**
 * Cihazlar arası senkronizasyon.
 *
 * Tasarım kararları:
 * - Supabase anahtarları tarayıcıya hiç inmez; her şey sunucudaki
 *   /api/sync/* uçlarından geçer.
 * - Çakışmalarda "son yazan kazanır" (updatedAt karşılaştırması).
 *   Tek kullanıcı için yeterli ve öngörülebilir.
 * - Ses kayıtları ayrı yükleniyor çünkü ikili veri; JSON'a sığmaz.
 */

const SYNC_CODE_KEY = 'layered_learning_sync_code_v1';
const SYNC_LAST_KEY = 'layered_learning_sync_last_v1';

export interface SyncResult {
  pushed: number;
  pulled: number;
  audioUp: number;
  audioDown: number;
  at: string;
}

export function getSyncCode(): string {
  try {
    return localStorage.getItem(SYNC_CODE_KEY) || '';
  } catch {
    return '';
  }
}

export function setSyncCode(code: string): void {
  try {
    if (code) localStorage.setItem(SYNC_CODE_KEY, code);
    else localStorage.removeItem(SYNC_CODE_KEY);
  } catch (e) {
    console.error('Senkron kodu kaydedilemedi:', e);
  }
}

export function getLastSync(): string | null {
  try {
    return localStorage.getItem(SYNC_LAST_KEY);
  } catch {
    return null;
  }
}

function setLastSync(iso: string): void {
  try {
    localStorage.setItem(SYNC_LAST_KEY, iso);
  } catch {
    /* yoksay */
  }
}

export async function isSyncAvailable(): Promise<boolean> {
  try {
    const res = await fetch('/api/sync/status');
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.enabled;
  } catch {
    return false;
  }
}

async function api(path: string, body: any): Promise<any> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const raw = await res.text();
  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error('Sunucu beklenmeyen bir yanıt döndürdü.');
  }
  if (!res.ok) throw new Error(data.error || 'Senkronizasyon başarısız.');
  return data;
}

/* ---------------- Yerel veri toplama ---------------- */

const LOCAL_KEYS = [
  { storageKey: 'layered_learning_lessons_v2', syncKey: 'lessons' },
  { storageKey: 'layered_learning_progress_v1', syncKey: 'progress' },
  { storageKey: 'layered_learning_vocab_settings_v1', syncKey: 'vocabSettings' },
  { storageKey: 'layered_learning_speaking_reps_v1', syncKey: 'speakingReps' },
  // Yanlislar Defteri de senkronlanir; eskiden listede yoktu ve bu yuzden
  // cihaz degistirildiginde sessizce kayboluyordu.
  { storageKey: 'layered_learning_mistakes_v1', syncKey: 'mistakes' },
  // Yapay zekaya sorulmus CEFR seviyeleri. Senkronlanmasi kota tasarrufu:
  // bir cihazda sorulan kelime digerlerinde bedava gelir.
  { storageKey: 'layered_learning_cefr_cache_v1', syncKey: 'cefrCache' },
];

/**
 * Yerel bir kaydin DEGISTIGINI damgalar.
 *
 * "Son yazan kazanir" karsilastirmasi `<anahtar>__ts` degerine dayaniyor
 * (bkz. runSync). Bu damgayi eskiden yalnizca runSync'in kendisi yaziyordu;
 * uygulama veriyi degistirdiginde kimse yazmiyordu. Dolayisiyla bir cihazda
 * yapilan gercek duzenleme, hicbir sey yapmamis baska bir cihazin verisiyle
 * ayni "yas"ta gorunuyordu. Veri degisince burasi cagrilmali.
 */
export function stampLocalChange(storageKey: string): void {
  writeLocalJson(`${storageKey}__ts`, Date.now());
}

function readLocalJson(key: string): any | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLocalJson(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Yerel veri yazılamadı:', key, e);
  }
}

/* ---------------- Ana senkron akışı ---------------- */

export async function runSync(
  onProgress?: (message: string) => void
): Promise<SyncResult> {
  const syncCode = getSyncCode();
  if (!syncCode || syncCode.length < 6) {
    throw new Error('Önce en az 6 karakterlik bir senkron kodu belirleyin.');
  }

  const since = getLastSync();

  /* --- 1) Sunucudan çek --- */
  onProgress?.('Sunucudan değişiklikler alınıyor...');
  const pullData = await api('/api/sync/pull', { syncCode, since });
  const remoteItems: any[] = pullData.items || [];

  const localStats = await getAllDayStats();
  const localStatMap = new Map(localStats.map((r) => [r.id, r]));

  let pulled = 0;
  let audioDown = 0;
  let statsPulled = 0;

  for (const item of remoteItems) {
    const { key, value, deleted } = item;

    if (key.startsWith('card:')) {
      if (deleted) continue;
      // Kimlik normalizasyonu ve kaynak birlestirmesi mergeRemoteCard'da:
      // buluttaki eski `ders::kelime` kayitlari yinelenen kart uretmesin.
      const remote = value as VocabCard & { updatedAt?: number };
      if (await mergeRemoteCard(remote)) pulled++;
      continue;
    }

    if (key.startsWith('stat:')) {
      // Calisma karnesinin gunluk satirlari. Anahtar `gun|cihaz` oldugu
      // icin iki cihaz birbirinin satirini ezmez; ayni satirda son yazan
      // kazanir.
      if (deleted) continue;
      const remote = value as DayStatRow;
      const local = localStatMap.get(remote.id);
      if (!local || (remote.updatedAt || 0) > (local.updatedAt || 0)) {
        await putDayStatSilently(remote);
        pulled++;
        statsPulled++;
      }
      continue;
    }

    if (key.startsWith('recmeta:')) {
      // Ses kaydının kendisi ayrı indirilecek; burada sadece varlığı biliniyor
      continue;
    }

    const match = LOCAL_KEYS.find((k) => k.syncKey === key);
    if (match) {
      const localRaw = readLocalJson(match.storageKey);
      const remoteWrapped = value as { data: any; updatedAt: number };
      const localTime = readLocalJson(match.storageKey + '__ts') || 0;
      if (!localRaw || (remoteWrapped?.updatedAt || 0) > localTime) {
        writeLocalJson(match.storageKey, remoteWrapped?.data ?? remoteWrapped);
        writeLocalJson(match.storageKey + '__ts', remoteWrapped?.updatedAt || Date.now());
        pulled++;
      }
    }
  }

  /* --- 2) Eksik ses kayıtlarını indir --- */
  const remoteRecMeta = remoteItems.filter((i) => i.key.startsWith('recmeta:') && !i.deleted);
  if (remoteRecMeta.length > 0) {
    const localRecs = await listAllRecordings();
    const localRecKeys = new Set(localRecs.map((r) => r.key));

    for (const meta of remoteRecMeta) {
      const info = meta.value as { key: string; lessonId: string; sentenceId: number; sentenceText: string; path: string };
      if (localRecKeys.has(info.key)) continue;

      try {
        onProgress?.(`Ses kaydı indiriliyor (${audioDown + 1}/${remoteRecMeta.length})...`);
        const dl = await api('/api/sync/download-audio', { syncCode, path: info.path });
        const bytes = Uint8Array.from(atob(dl.dataBase64), (c) => c.charCodeAt(0));
        await saveRecordingSilently({
          key: info.key,
          lessonId: info.lessonId,
          sentenceId: info.sentenceId,
          sentenceText: info.sentenceText,
          blob: new Blob([bytes], { type: 'audio/webm' }),
          createdAt: Date.now(),
        });
        audioDown++;
      } catch (err) {
        console.warn('Ses kaydı indirilemedi:', info.path, err);
      }
    }
  }

  /* --- 3) Yereli gönder --- */
  onProgress?.('Yerel değişiklikler gönderiliyor...');
  const items: any[] = [];

  const freshCards = await getAllCards();
  for (const card of freshCards) {
    items.push({
      key: `card:${card.id}`,
      value: { ...card, updatedAt: (card as any).updatedAt || card.lastReview || card.createdAt },
    });
  }

  // Karne satirlari: gun basina bir kayit oldugu icin hacim kucuk
  // (yilda ~365). Kartlarla ayni yoldan gider, ayri bir uc gerekmez.
  for (const row of await getAllDayStats()) {
    items.push({ key: `stat:${row.id}`, value: row });
  }

  for (const { storageKey, syncKey } of LOCAL_KEYS) {
    const data = readLocalJson(storageKey);
    if (data === null) continue;
    items.push({
      key: syncKey,
      value: { data, updatedAt: readLocalJson(storageKey + '__ts') || Date.now() },
    });
  }

  // 500'lük gruplar halinde gönder (sunucu sınırı)
  let pushed = 0;
  for (let i = 0; i < items.length; i += 400) {
    const chunk = items.slice(i, i + 400);
    const r = await api('/api/sync/push', { syncCode, items: chunk });
    pushed += r.pushed || 0;
  }

  /* --- 4) Ses kayıtlarını yükle --- */
  const localRecs = await listAllRecordings();
  const remoteRecKeys = new Set(
    remoteItems.filter((i) => i.key.startsWith('recmeta:')).map((i) => i.key)
  );

  let audioUp = 0;
  const metaItems: any[] = [];

  for (const rec of localRecs) {
    const metaKey = `recmeta:${rec.key}`;
    if (remoteRecKeys.has(metaKey)) continue;

    try {
      onProgress?.(`Ses kaydı yükleniyor (${audioUp + 1})...`);
      const base64 = await blobToBase64(rec.blob);
      const path = `${rec.lessonId}/${rec.sentenceId}.webm`;
      await api('/api/sync/upload-audio', { syncCode, path, dataBase64: base64 });

      metaItems.push({
        key: metaKey,
        value: {
          key: rec.key,
          lessonId: rec.lessonId,
          sentenceId: rec.sentenceId,
          sentenceText: rec.sentenceText,
          path,
        },
      });
      audioUp++;
    } catch (err) {
      console.warn('Ses kaydı yüklenemedi:', rec.key, err);
    }
  }

  if (metaItems.length > 0) {
    await api('/api/sync/push', { syncCode, items: metaItems });
  }

  const serverTime = pullData.serverTime || new Date().toISOString();
  setLastSync(serverTime);

  // Listeleri tazele. Karne satirlari sessizce yaziliyor
  // (putDayStatSilently), yoksa yuzlerce satirlik bir cekimde pano her
  // satirda yeniden ciziliyordu; cekim bitince tek sefer haber veriliyor.
  //
  // DIKKAT: ACTIVITY_CHANGED_EVENT'i App dinliyor ve senkron planliyor.
  // Kosulsuz yayinlanirsa her senkron bir sonrakini tetikler ve donguye
  // girer. Yalnizca GERCEKTEN satir cekildiginde yayinlaniyor: bir sonraki
  // senkron ayni satirlari getirmeyecegi icin dongu tek turda kapanir.
  try {
    window.dispatchEvent(new CustomEvent(VOCAB_CHANGED_EVENT));
    if (statsPulled > 0) {
      window.dispatchEvent(new CustomEvent(ACTIVITY_CHANGED_EVENT));
    }
  } catch {
    /* yoksay */
  }

  return { pushed, pulled, audioUp, audioDown, at: serverTime };
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.split(',')[1] || '');
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** Bir sonraki senkronda her şeyin yeniden çekilmesini sağlar. */
export function resetSyncState(): void {
  try {
    localStorage.removeItem(SYNC_LAST_KEY);
  } catch {
    /* yoksay */
  }
}

/* ============================================================
   OTOMATIK SENKRON
   ------------------------------------------------------------
   Senkron eskiden yalnizca elle calisiyordu ve panel hicbir yere
   monte edilmedigi icin pratikte hic calismiyordu. Artik: kod bir
   kez girilir, gerisi kendiliginden olur.

   - Tek ucus kurali: ayni anda birden fazla senkron calismaz.
     Ust uste calisirsa "son yazan kazanir" karsilastirmasi
     kendi yazdigi damgalarla yarisir ve sonuc ongorulemez olur.
   - Geciktirme: her tus vurusunda degil, degisiklikler durulunca
     bir kez gonderilir.
   - Sessiz basarisizlik: cevrimdisiyken veya sunucu hata verirse
     uygulama calismaya devam eder; veri yerelde durur ve bir
     sonraki firsatta gonderilir.
   ============================================================ */

const AUTO_SYNC_DELAY_MS = 8000;

let autoSyncTimer: ReturnType<typeof setTimeout> | null = null;
let syncInFlight: Promise<SyncResult> | null = null;
let rerunRequested = false;

export type SyncListener = (result: SyncResult) => void;

const listeners = new Set<SyncListener>();

/** Senkron bittiginde haber verir; cagiran taraf ekrani tazeleyebilir. */
export function onSynced(listener: SyncListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify(result: SyncResult): void {
  listeners.forEach((listener) => {
    try {
      listener(result);
    } catch (e) {
      console.error('Senkron dinleyicisi hata verdi:', e);
    }
  });
}

/** Senkron kodu tanimliysa true. */
export function hasSyncCode(): boolean {
  return getSyncCode().trim().length >= 6;
}

/**
 * Senkronu simdi calistirir. Zaten calisiyorsa yenisini baslatmaz;
 * bunun yerine mevcut olani bekler ve ardindan bir tur daha ister.
 */
export function syncNow(onProgress?: (message: string) => void): Promise<SyncResult> {
  if (!hasSyncCode()) {
    return Promise.reject(new Error('Önce en az 6 karakterlik bir senkron kodu belirleyin.'));
  }

  if (syncInFlight) {
    rerunRequested = true;
    return syncInFlight;
  }

  syncInFlight = runSync(onProgress)
    .then((result) => {
      notify(result);
      return result;
    })
    .finally(() => {
      syncInFlight = null;
      if (rerunRequested) {
        rerunRequested = false;
        scheduleAutoSync();
      }
    });

  return syncInFlight;
}

/**
 * Veri degistikten sonra cagrilir: kisa bir sessizlikten sonra senkronu
 * tetikler. Kod yoksa hicbir sey yapmaz, boylece senkronu hic kurmamis
 * kullaniciya masraf cikmaz.
 */
export function scheduleAutoSync(): void {
  if (!hasSyncCode()) return;

  if (autoSyncTimer) clearTimeout(autoSyncTimer);
  autoSyncTimer = setTimeout(() => {
    autoSyncTimer = null;
    syncNow().catch((err) => {
      // Cevrimdisi olmak hata degil; veri yerelde, sonra gonderilir.
      console.warn('Otomatik senkron simdilik basarisiz:', err?.message || err);
    });
  }, AUTO_SYNC_DELAY_MS);
}

/** Uygulama acilisinda bir kez: uzaktaki daha yeni veriyi getirir. */
export function syncOnStartup(): void {
  if (!hasSyncCode()) return;
  syncNow().catch((err) => {
    console.warn('Acilis senkronu basarisiz:', err?.message || err);
  });
}
