import { FsrsCardFields, CardState, createNewCard } from './fsrs';
import { CefrLevel } from './cefr';
import { CardKindName, resolveCardMeta, localLevelOf } from './autoClassify';
import { PartOfSpeech } from './pos';

/**
 * Kelime kartları için IndexedDB deposu.
 * Kart sayısı yüzlere/binlere çıkabildiği ve her tekrarda güncellendiği için
 * localStorage yerine IndexedDB kullanılıyor.
 *
 * apps/katmanli ve apps/reading ORTAK bir kelime bankası paylaşır: ikisi de
 * aynı origin altında çalıştığı için (bkz. AppSwitcher, netlify.toml) burada
 * kullanılan IndexedDB veritabanı tarayıcıda otomatik olarak paylaşılır —
 * hangi uygulamadan kart eklenirse eklensin, tek FSRS destesinde birikir.
 */

const DB_NAME = 'layered_learning_vocab';
const DB_VERSION = 1;
const STORE = 'cards';

/**
 * A1 dahil TUM CEFR basamaklari. Eskiden A1 yoktu ve reading tarafindaki
 * A1 kelimeler A2'ye yuvarlaniyordu; artik kelime listesinde ne yaziyorsa
 * kart da onu gosteriyor.
 */
export type CardLevel = CefrLevel;
export type CardKind = CardKindName;

export interface VocabCard extends FsrsCardFields {
  id: string;
  lessonId: string;
  lessonTitle: string;
  /** İngilizce ifade (kartın ön yüzü). */
  front: string;
  /** Türkçe karşılık (kartın arka yüzü). */
  back: string;
  ipa?: string;
  kind: CardKind;
  level: CardLevel;
  /**
   * Söz türü (isim / fiil / sıfat ...). Kart eklenirken otomatik belirlenir;
   * eski kartlarda bulunmayabilir, o yüzden isteğe bağlı.
   */
  pos?: PartOfSpeech;
  /** İfadenin geçtiği örnek cümle. */
  exampleEn?: string;
  exampleTr?: string;
  /** Transkriptte geçtiği asıl cümle. */
  contextEn?: string;
  note?: string;
  suspended?: boolean;
  createdAt: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('lessonId', 'lessonId', { unique: false });
        store.createIndex('due', 'due', { unique: false });
        store.createIndex('front', 'front', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const req = fn(t.objectStore(STORE));
        req.onsuccess = () => {
          resolve(req.result);
        };
        req.onerror = () => reject(req.error);
        t.oncomplete = () => db.close();
        t.onerror = () => {
          db.close();
          reject(t.error);
        };
      })
  );
}

/**
 * Kart deposu her değiştiğinde tetiklenen olay.
 * Kartlar birden çok ekrandan eklenebildiği için (transkriptte seçim,
 * elle ekleme, ayıklama) listeyi gösteren bileşenin haberdar olması gerekiyor.
 */
export const VOCAB_CHANGED_EVENT = 'vocab-cards-changed';

function notifyChanged() {
  try {
    window.dispatchEvent(new CustomEvent(VOCAB_CHANGED_EVENT));
  } catch {
    /* tarayıcı dışı ortamlarda yoksay */
  }
}

export function makeCardId(lessonId: string, front: string): string {
  return `${lessonId}::${front.toLowerCase().trim()}`;
}

/**
 * Kart olusturur.
 *
 * SEVIYE / TUR / SOZ TURU alanlari verilmezse resolveCardMeta ile
 * OTOMATIK belirlenir (bkz. autoClassify.ts): once yerel CEFR listesi,
 * sonra yapay zekanin onerisi, sonra bicimsel tahmin. Eskiden burada
 * sabit `level: 'B2'` vardi ve alani doldurmayan her cagri kartlari B2
 * yapiyordu — destedeki seviye bilgisi bu yuzden anlamsizdi.
 *
 * `level`/`kind`/`pos` alanlarina yapay zeka yaniti oldugu gibi
 * verilebilir: dogrulama ve gerekirse duzeltme resolveCardMeta icinde.
 */
export function buildCard(input: {
  lessonId: string;
  lessonTitle: string;
  front: string;
  back: string;
  ipa?: string;
  kind?: CardKind | string;
  level?: CardLevel | string;
  pos?: PartOfSpeech | string;
  exampleEn?: string;
  exampleTr?: string;
  contextEn?: string;
}): VocabCard {
  const front = input.front.trim();
  const meta = resolveCardMeta(front, {
    level: input.level,
    kind: input.kind,
    pos: input.pos,
    context: input.contextEn || input.exampleEn,
  });

  return {
    id: makeCardId(input.lessonId, input.front),
    lessonId: input.lessonId,
    lessonTitle: input.lessonTitle,
    front,
    back: input.back.trim(),
    ipa: input.ipa,
    kind: meta.kind,
    level: meta.level,
    pos: meta.pos,
    exampleEn: input.exampleEn,
    exampleTr: input.exampleTr,
    contextEn: input.contextEn,
    createdAt: Date.now(),
    ...createNewCard(Date.now()),
  };
}

export async function getAllCards(): Promise<VocabCard[]> {
  return tx<VocabCard[]>('readonly', (s) => s.getAll());
}

export async function getCardsByLesson(lessonId: string): Promise<VocabCard[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, 'readonly');
    const req = t.objectStore(STORE).index('lessonId').getAll(lessonId);
    req.onsuccess = () => {
      db.close();
      resolve(req.result || []);
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

export async function putCard(card: VocabCard): Promise<void> {
  await tx('readwrite', (s) => s.put({ ...card, updatedAt: Date.now() } as any));
  notifyChanged();
}

/**
 * Senkronizasyon sirasinda kullanilir: her kayitta olay firlatmaz.
 * Yuzlerce kart cekilirken arayuzun surekli yeniden cizilmesini onler.
 */
export async function putCardSilently(card: VocabCard): Promise<void> {
  await tx('readwrite', (s) => s.put(card));
}

/**
 * Birden fazla kartı TEK işlemde günceller.
 * Her kart için ayrı bağlantı açmak yüzlerce kartta çok yavaş; toplu
 * yeniden sınıflandırma bunu kullanır.
 */
export async function putCardsBulk(cards: VocabCard[]): Promise<void> {
  if (cards.length === 0) return;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const t = db.transaction(STORE, 'readwrite');
    const store = t.objectStore(STORE);
    const now = Date.now();
    // updatedAt damgası senkronizasyon için şart: "son yazan kazanır"
    // karşılaştırması bu alana bakıyor (bkz. syncClient).
    for (const card of cards) store.put({ ...card, updatedAt: now } as any);
    t.oncomplete = () => { db.close(); resolve(); };
    t.onerror = () => { db.close(); reject(t.error); };
  });
  notifyChanged();
}

export interface ReclassifyResult {
  /** Bakılan kart sayısı. */
  scanned: number;
  /** Seviyesi değişen kart sayısı. */
  levelUpdated: number;
  /** Türü düzeltilen kart sayısı (ör. "word" -> "phrasal_verb"). */
  kindUpdated: number;
  /** Söz türü ilk kez yazılan veya değişen kart sayısı. */
  posUpdated: number;
}

/**
 * MEVCUT kartları yerel listelere göre yeniden sınıflandırır.
 *
 * Neden gerekli: bu özellik gelmeden önce eklenen kartların hepsi "B2" ve
 * söz türü olmadan kaydedildi. Ağ isteği yapılmaz — yalnızca
 * cefrWords.json / phrasalLevels.json kullanılır, saniyeler sürer.
 *
 * SEVIYE yalnızca yerel listede KESIN karşılığı olan ifadelerde değişir
 * (word-list / phrase-list). Listede olmayan kelimelerde eski seviye
 * korunur: orada tek bilgi kaynağı zamanında yapay zekadan gelen yanıttı,
 * onu tahminle bozmanın anlamı yok.
 */
export async function reclassifyAllCards(): Promise<ReclassifyResult> {
  const cards = await getAllCards();
  const result: ReclassifyResult = {
    scanned: cards.length,
    levelUpdated: 0,
    kindUpdated: 0,
    posUpdated: 0,
  };

  const changed: VocabCard[] = [];

  for (const card of cards) {
    const meta = resolveCardMeta(card.front, {
      // Eski değerler yapay zeka önerisi yerine geçer: liste bilmiyorsa korunur
      level: card.level,
      kind: card.kind,
      pos: card.pos,
      context: card.contextEn || card.exampleEn,
    });

    const local = localLevelOf(card.front);
    const nextLevel =
      local && local.source !== 'phrase-parts' ? local.level : card.level;

    const levelChanged = nextLevel !== card.level;
    const kindChanged = meta.kind !== card.kind;
    const posChanged = meta.pos !== card.pos;
    if (!levelChanged && !kindChanged && !posChanged) continue;

    if (levelChanged) result.levelUpdated++;
    if (kindChanged) result.kindUpdated++;
    if (posChanged) result.posUpdated++;

    changed.push({ ...card, level: nextLevel, kind: meta.kind, pos: meta.pos });
  }

  await putCardsBulk(changed);
  return result;
}

/**
 * Kartları toplu ekler. AYNI kart varsa ÜZERİNE YAZMAZ — tekrar geçmişi
 * korunur. Aynı dersten kelimeler yeniden çıkarıldığında ilerleme kaybolmaz.
 */
export async function addCardsIfMissing(cards: VocabCard[]): Promise<number> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, 'readwrite');
    const store = t.objectStore(STORE);
    let added = 0;
    let pending = cards.length;

    if (pending === 0) {
      db.close();
      return resolve(0);
    }

    cards.forEach((card) => {
      const getReq = store.get(card.id);
      getReq.onsuccess = () => {
        if (!getReq.result) {
          store.put(card);
          added++;
        }
        if (--pending === 0) {
          /* transaction oncomplete halleder */
        }
      };
      getReq.onerror = () => {
        if (--pending === 0) {
          /* yoksay */
        }
      };
    });

    t.oncomplete = () => {
      db.close();
      notifyChanged();
      resolve(added);
    };
    t.onerror = () => {
      db.close();
      reject(t.error);
    };
  });
}

export async function deleteCard(id: string): Promise<void> {
  await tx('readwrite', (s) => s.delete(id) as unknown as IDBRequest<void>);
  notifyChanged();
}

export async function deleteCardsByLesson(lessonId: string): Promise<void> {
  const cards = await getCardsByLesson(lessonId);
  for (const c of cards) await deleteCard(c.id);
}

export interface DueSelectionLimits {
  /** Bugün kaç YENİ kart daha tanıtılabilir. undefined veya 0 = sınırsız. */
  newRemaining?: number;
  /** Bugün kaç tekrar kartı daha gösterilebilir. undefined veya 0 = sınırsız. */
  reviewRemaining?: number;
}

/** Kart daha önce hiç çalışılmamışsa "yeni" sayılır. */
export function isNewCard(c: VocabCard): boolean {
  return c.reps === 0;
}

/**
 * Bugün çalışılabilecek kartlar: vadesi gelmiş, askıya alınmamış ve
 * günlük sınırların içinde kalanlar (Anki'deki gibi).
 */
export function selectDueCards(
  cards: VocabCard[],
  now = Date.now(),
  limits: DueSelectionLimits = {}
): VocabCard[] {
  const due = cards
    .filter((c) => !c.suspended && c.due <= now)
    .sort((a, b) => {
      // Önce öğrenme/yeniden öğrenme kartları, sonra vadesi en eski olan
      const rank = (c: VocabCard) => (c.state === CardState.Review ? 1 : 0);
      const r = rank(a) - rank(b);
      return r !== 0 ? r : a.due - b.due;
    });

  const newLimit = limits.newRemaining;
  const reviewLimit = limits.reviewRemaining;

  if (!newLimit && !reviewLimit) return due;

  let newLeft = newLimit && newLimit > 0 ? newLimit : Infinity;
  let reviewLeft = reviewLimit && reviewLimit > 0 ? reviewLimit : Infinity;

  const result: VocabCard[] = [];
  for (const c of due) {
    if (isNewCard(c)) {
      if (newLeft > 0) {
        result.push(c);
        newLeft--;
      }
    } else {
      if (reviewLeft > 0) {
        result.push(c);
        reviewLeft--;
      }
    }
  }
  return result;
}

export interface DeckStats {
  total: number;
  due: number;
  learning: number;
  review: number;
  relearning: number;
  suspended: number;
}

export function computeStats(cards: VocabCard[], now = Date.now()): DeckStats {
  return {
    total: cards.length,
    due: cards.filter((c) => !c.suspended && c.due <= now).length,
    learning: cards.filter((c) => c.state === CardState.Learning).length,
    review: cards.filter((c) => c.state === CardState.Review).length,
    relearning: cards.filter((c) => c.state === CardState.Relearning).length,
    suspended: cards.filter((c) => c.suspended).length,
  };
}
