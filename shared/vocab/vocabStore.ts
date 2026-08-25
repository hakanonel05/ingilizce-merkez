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

/**
 * Kartın geldiği bir yer: hangi ders/parça ve orada geçtiği cümle.
 *
 * Aynı kelimeyi birden çok yerde görürsen kart çoğalmıyor, bu liste
 * uzuyor: tekrar geçmişi tek elde kalırken kelimeyi nerede gördüğün
 * bilgisi de kaybolmuyor.
 */
export interface CardSource {
  lessonId: string;
  lessonTitle: string;
  /** İfadenin o metinde geçtiği cümle. */
  contextEn?: string;
  addedAt: number;
}

export interface VocabCard extends FsrsCardFields {
  id: string;
  /** İlk eklendiği yer. sources[0] ile aynıdır; eski kayıtlarla uyum için duruyor. */
  lessonId: string;
  lessonTitle: string;
  /** Kelimenin görüldüğü TÜM yerler, eklenme sırasıyla. */
  sources?: CardSource[];
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

/**
 * Kart kimliği YALNIZCA ifadeden üretilir.
 *
 * Eskiden `ders::kelime` idi; aynı kelimeyi hem bir videoda hem bir okuma
 * parçasında görünce iki ayrı kart oluşuyor, ikisi ayrı ayrı sorulup
 * tekrar geçmişi bölünüyordu. Artık tek kart var, geldiği yerler
 * `sources` listesinde birikiyor.
 */
export function makeCardId(front: string): string {
  return front.toLowerCase().trim().replace(/\s+/g, ' ');
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

  const now = Date.now();

  return {
    id: makeCardId(front),
    lessonId: input.lessonId,
    lessonTitle: input.lessonTitle,
    sources: [
      {
        lessonId: input.lessonId,
        lessonTitle: input.lessonTitle,
        contextEn: input.contextEn,
        addedAt: now,
      },
    ],
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
  await mergeDuplicateCards();
  return tx<VocabCard[]>('readonly', (s) => s.getAll());
}

/** Kartın bu ders/parçadan gelip gelmediği (tüm kaynaklara bakar). */
export function cardBelongsTo(card: VocabCard, lessonId: string): boolean {
  if (card.lessonId === lessonId) return true;
  return (card.sources || []).some((s) => s.lessonId === lessonId);
}

/** Kartın geldiği yerlerin listesi; eski kartlarda tek kayıt üretir. */
export function cardSources(card: VocabCard): CardSource[] {
  if (card.sources?.length) return card.sources;
  return [
    {
      lessonId: card.lessonId,
      lessonTitle: card.lessonTitle,
      contextEn: card.contextEn,
      addedAt: card.createdAt,
    },
  ];
}

/**
 * ESKİ KİMLİKLERİN BİRLEŞTİRİLMESİ (bir kez çalışır).
 *
 * Kart kimliği `ders::kelime` iken aynı kelime birden çok derste ayrı
 * kartlar olarak duruyordu. Kimlik artık yalnızca kelime olduğu için
 * bu kayıtların tek karta indirilmesi gerekiyor.
 *
 * Hayatta kalan kart, tekrar geçmişi EN ZENGİN olandır (en çok tekrar,
 * eşitlikte en eski kayıt): amaç FSRS ilerlemesini korumak. Diğerlerinin
 * geldiği yerler `sources` listesine eklenir, boş alanları da tamamlar.
 */
let mergeDone = false;
async function mergeDuplicateCards(): Promise<void> {
  if (mergeDone) return;
  mergeDone = true;

  try {
    const cards = await tx<VocabCard[]>('readonly', (s) => s.getAll());
    if (cards.length === 0) return;

    const groups = new Map<string, VocabCard[]>();
    for (const card of cards) {
      const key = makeCardId(card.front);
      const list = groups.get(key);
      if (list) list.push(card);
      else groups.set(key, [card]);
    }

    const writes: VocabCard[] = [];
    const deletes: string[] = [];

    for (const [id, group] of groups.entries()) {
      const needsWork = group.length > 1 || group[0].id !== id || !group[0].sources?.length;
      if (!needsWork) continue;

      const survivor = [...group].sort(
        (a, b) => (b.reps || 0) - (a.reps || 0) || (a.createdAt || 0) - (b.createdAt || 0)
      )[0];

      let merged: VocabCard = { ...survivor, id };
      merged.sources = cardSources(survivor);

      for (const other of group) {
        if (other === survivor) continue;
        const next = withSource(merged, other);
        if (next) merged = next;
      }

      writes.push(merged);
      for (const other of group) {
        if (other.id !== id) deletes.push(other.id);
      }
    }

    if (writes.length === 0 && deletes.length === 0) return;

    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const t = db.transaction(STORE, 'readwrite');
      const store = t.objectStore(STORE);
      for (const id of deletes) store.delete(id);
      for (const card of writes) store.put({ ...card, updatedAt: Date.now() } as any);
      t.oncomplete = () => { db.close(); resolve(); };
      t.onerror = () => { db.close(); reject(t.error); };
    });

    console.info(
      `[vocab] ${writes.length} kart tek kimliğe indirildi, ${deletes.length} yinelenen kayıt kaldırıldı.`
    );
    notifyChanged();
  } catch (err) {
    console.warn('[vocab] kartlar birleştirilemedi:', err);
  }
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
 * Senkronizasyondan gelen kartı yerelle birleştirir.
 *
 * İki iş birden yapıyor:
 *  - Eski `ders::kelime` kimlikleriyle gelen kayıtları yeni kimliğe
 *    çeviriyor, yoksa buluttaki eski kayıtlar her çekişte yinelenen
 *    kartları geri getirirdi.
 *  - Tekrar durumunda "son yazan kazanır" kuralı sürüyor, ama kelimenin
 *    geldiği yerler İKİ TARAFTAN da birleştiriliyor: bir cihazda videodan,
 *    başka cihazda okuma parçasından eklenmişse ikisi de kalır.
 *
 * Değişiklik yapıldıysa true döner; olay fırlatmaz (toplu çekimde arayüz
 * her satırda yeniden çizilmesin diye).
 */
export async function mergeRemoteCard(remote: VocabCard): Promise<boolean> {
  const id = makeCardId(remote.front || remote.id);
  const incoming: VocabCard = { ...remote, id, sources: cardSources({ ...remote, id }) };

  const db = await openDb();
  return new Promise<boolean>((resolve, reject) => {
    const t = db.transaction(STORE, 'readwrite');
    const store = t.objectStore(STORE);
    const getReq = store.get(id);
    let changed = false;

    getReq.onsuccess = () => {
      const local: VocabCard | undefined = getReq.result;

      if (!local) {
        store.put(incoming);
        changed = true;
        return;
      }

      const localTime = (local as any).updatedAt || local.lastReview || local.createdAt || 0;
      const remoteTime = (remote as any).updatedAt || remote.lastReview || remote.createdAt || 0;

      // Once tekrar durumunu sec, sonra iki tarafin kaynaklarini birlestir
      const base = remoteTime > localTime ? incoming : local;
      const other = remoteTime > localTime ? local : incoming;
      const merged = withSource(base, other);

      if (merged) {
        store.put(merged);
        changed = true;
      } else if (base !== local) {
        store.put(base);
        changed = true;
      }
    };

    t.oncomplete = () => { db.close(); resolve(changed); };
    t.onerror = () => { db.close(); reject(t.error); };
  });
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
 * Var olan karta yeni bir kaynak ekler. Eklenecek bir şey yoksa null
 * döner ki gereksiz yazma (ve senkron trafiği) olmasın.
 *
 * Eksik alanlar da bu sırada tamamlanır: kelime ilk kez anlamsız/örneksiz
 * eklendiyse ikinci karşılaşmada gelen bilgi boşlukları doldurur, ama
 * dolu bir alanın üzerine asla yazılmaz.
 */
function withSource(existing: VocabCard, incoming: VocabCard): VocabCard | null {
  const sources = existing.sources?.length
    ? [...existing.sources]
    : [
        {
          lessonId: existing.lessonId,
          lessonTitle: existing.lessonTitle,
          contextEn: existing.contextEn,
          addedAt: existing.createdAt,
        },
      ];

  const incomingSources = incoming.sources?.length
    ? incoming.sources
    : [
        {
          lessonId: incoming.lessonId,
          lessonTitle: incoming.lessonTitle,
          contextEn: incoming.contextEn,
          addedAt: incoming.createdAt,
        },
      ];

  let changed = !existing.sources?.length;
  for (const source of incomingSources) {
    if (sources.some((s) => s.lessonId === source.lessonId)) continue;
    sources.push(source);
    changed = true;
  }

  const filled: Partial<VocabCard> = {};
  if (!existing.back?.trim() && incoming.back?.trim()) filled.back = incoming.back;
  if (!existing.ipa && incoming.ipa) filled.ipa = incoming.ipa;
  if (!existing.exampleEn && incoming.exampleEn) filled.exampleEn = incoming.exampleEn;
  if (!existing.exampleTr && incoming.exampleTr) filled.exampleTr = incoming.exampleTr;
  if (!existing.pos && incoming.pos) filled.pos = incoming.pos;
  if (Object.keys(filled).length > 0) changed = true;

  if (!changed) return null;
  return { ...existing, ...filled, sources, updatedAt: Date.now() } as VocabCard;
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
        const existing: VocabCard | undefined = getReq.result;

        if (!existing) {
          store.put(card);
          added++;
        } else {
          // Kart zaten var: tekrar gecmisine DOKUNULMAZ, yalnizca kelimeyi
          // bu kez nerede gordugun kaydedilir. Ayni yerden tekrar eklenirse
          // liste sismesin diye ders kimligi kontrol ediliyor.
          const merged = withSource(existing, card);
          if (merged) store.put(merged);
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
