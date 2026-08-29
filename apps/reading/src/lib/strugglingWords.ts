/**
 * "ÇALIŞTIM AMA HÂLÂ ÖĞRENEMEDİM" KELİMELERİ
 *
 * Hikaye üreteci bu listeyi kullanıyor: amaç kullanıcının takıldığı
 * kelimeleri tek bir metinde, doğal bir bağlamda tekrar karşısına
 * çıkarmak.
 *
 * İKİ KAYNAK var ve ikisi de "öğrenildi" saymıyor:
 *
 *   1. Kelime kartları (FSRS destesi) — tekrarda UNUTULMUŞ kartlar
 *      (lapses > 0) ya da hâlâ öğrenme aşamasındakiler. Bunlar en
 *      güvenilir sinyal: kullanıcı kartı görmüş ve hatırlayamamış.
 *   2. Okuma parçalarındaki kelime durumları — "çalıştım" işaretli ama
 *      "öğrendim" işaretlenmemiş kelimeler. Kullanıcının kendi beyanı.
 *
 * "öğrendim"/"learned" işaretliler ve hiç dokunulmamışlar dışarıda
 * kalır: biri artık gerek duymuyor, diğeri henüz çalışılmamış.
 */

import { Passage, UserProgress } from '../types';
import { getAllCards, VocabCard } from './vocabBank';
import { CardState } from '../../../../shared/vocab/fsrs';
import { PartOfSpeech } from '../../../../shared/vocab/pos';

/**
 * Kart tarafindaki tam soz turu adlarini reading'in kisa bicimine cevirir;
 * uretilen hikayenin sozlugu hazir parcalarla ayni gorunsun diye.
 */
const POS_SHORT: Partial<Record<PartOfSpeech, string>> = {
  noun: 'n',
  verb: 'v',
  adjective: 'adj',
  adverb: 'adv',
  preposition: 'prep',
  conjunction: 'conj',
  pronoun: 'pron',
  determiner: 'det',
  interjection: 'int',
  phrase: 'phr',
};

export interface StrugglingWord {
  term: string;
  /** Reading tarafinin kisa soz turu bicimi: n, v, adj, adv, phr. */
  partOfSpeech: string;
  /** Türkçe karşılık — kartlardan ya da parça sözlüğünden. */
  meaning: string;
  /** 'card' | 'reading' — nereden geldiği, arayüzde gösteriliyor. */
  source: 'card' | 'reading';
  /** Kaç kez unutulmuş (kartlarda). Sıralamada kullanılır. */
  lapses: number;
}

/** Hikayeye sığdırılabilecek makul üst sınır. */
export const MAX_STORY_WORDS = 12;

/**
 * Kart hâlâ öğrenilmemiş sayılır mı?
 *
 * Unutulmuş (lapses > 0) ya da çalışılmaya başlanmış ama tekrar
 * aşamasına geçmemiş kartlar. Hiç çalışılmamış kartlar hariç: onlar
 * "öğrenemediğim" değil, "henüz bakmadığım".
 */
function cardIsUnlearned(card: VocabCard): boolean {
  if (card.suspended) return false;
  if (card.reps === 0) return false;
  return card.lapses > 0 || card.state !== CardState.Review;
}

/**
 * Kelimeleri toplar, tekilleştirir ve önceliklendirir.
 *
 * Sıralama: en çok unutulan önce, sonra karttan gelenler, sonra okuma
 * tarafından gelenler. Hikayeye yalnızca ilk MAX_STORY_WORDS tanesi
 * girer — daha fazlası metni zorlama ve yapay yapıyor.
 */
export async function collectStrugglingWords(
  progress: UserProgress,
  passages: Passage[]
): Promise<StrugglingWord[]> {
  const byTerm = new Map<string, StrugglingWord>();

  // 1) Kartlar
  try {
    const cards = await getAllCards();
    for (const card of cards) {
      if (!cardIsUnlearned(card)) continue;
      const key = card.front.trim().toLowerCase();
      if (!key) continue;
      byTerm.set(key, {
        term: card.front.trim(),
        meaning: card.back?.trim() || '',
        partOfSpeech: (card.pos && POS_SHORT[card.pos]) || '',
        source: 'card',
        lapses: card.lapses || 0,
      });
    }
  } catch (err) {
    console.warn('Kelime kartları okunamadı:', err);
  }

  // 2) Okuma parçalarında "çalıştım" işaretliler
  const fromPassages = new Map<string, { meaning: string; partOfSpeech: string }>();
  for (const passage of passages) {
    for (const word of passage?.vocabulary || []) {
      const key = word.term.trim().toLowerCase();
      if (key && !fromPassages.has(key)) {
        fromPassages.set(key, { meaning: word.meaning, partOfSpeech: word.partOfSpeech || '' });
      }
    }
  }

  for (const [term, status] of Object.entries(progress.wordStatus || {})) {
    if (status !== 'studied') continue;
    const key = term.trim().toLowerCase();
    if (!key || byTerm.has(key)) continue;
    const known = fromPassages.get(key);
    byTerm.set(key, {
      term: term.trim(),
      meaning: known?.meaning || '',
      partOfSpeech: known?.partOfSpeech || '',
      source: 'reading',
      lapses: 0,
    });
  }

  return [...byTerm.values()].sort(
    (a, b) =>
      b.lapses - a.lapses ||
      (a.source === b.source ? 0 : a.source === 'card' ? -1 : 1) ||
      a.term.localeCompare(b.term)
  );
}
