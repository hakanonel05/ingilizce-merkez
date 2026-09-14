import type { VocabularyWord } from '../types';

/**
 * Bir kelime kaydının kimliği.
 *
 * Kitap aynı yazımı birden fazla kez veriyor ve bunlar ayrı kayıtlar:
 * "fat (adj) şişman" ile "fat (n) yağ", "space (n) yer, boşluk" ile
 * "space (n) uzay" gibi. Listeler bir süre yalnız `term` üzerinden
 * tekilleştiriyordu; o yüzden 174 kaydın ikincisi kelime listesinde,
 * kartlarda ve gösterge panelinde hiç görünmüyordu.
 *
 * Anlam da kimliğe dahil: sözcük türü aynı olduğu halde anlamı farklı olan
 * çiftler ("space") yalnız terim+tür ile hâlâ birbirini eziyordu.
 */
export function kelimeKimligi(v: Pick<VocabularyWord, 'term'> & Partial<Pick<VocabularyWord, 'partOfSpeech' | 'meaning'>>): string {
  const d = (s?: string) => (s ?? '').trim().toLowerCase();
  return d(v.term) + '|' + d(v.partOfSpeech) + '|' + d(v.meaning);
}
