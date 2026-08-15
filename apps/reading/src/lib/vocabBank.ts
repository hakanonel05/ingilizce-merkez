import { VocabularyWord, CEFRLevel } from '../types';
import {
  VocabCard,
  CardKind,
  CardLevel,
  buildCard,
  addCardsIfMissing,
  getAllCards,
  VOCAB_CHANGED_EVENT,
} from './vocabStore';

/**
 * Reading tarafındaki kelimeleri katmanlı'nın FSRS-6 tekrar destesine
 * ekleyen köprü. Kartlar aynı paylaşılan IndexedDB'de biriktiği için
 * gerçek tekrar/çalışma katmanlı'daki "Kelime Kartları" ekranından yapılır.
 */

export const READING_CORE_LESSON_ID = 'reading:core';
export const READING_CORE_LESSON_TITLE = 'Temel Kelime Listesi (Reading)';

export function readingPassageLessonId(passageId: number): string {
  return `reading:passage:${passageId}`;
}

function mapPartOfSpeechToKind(partOfSpeech: string): CardKind {
  return partOfSpeech === 'phr. v' ? 'phrasal_verb' : 'word';
}

function mapCefrToCardLevel(cefr: CEFRLevel): CardLevel {
  return cefr === 'A1' ? 'A2' : cefr;
}

export function addWordToVocabBank(
  word: VocabularyWord,
  source: { lessonId: string; lessonTitle: string },
  cefr: CEFRLevel
): Promise<number> {
  const card = buildCard({
    lessonId: source.lessonId,
    lessonTitle: source.lessonTitle,
    front: word.term,
    back: word.meaning,
    kind: mapPartOfSpeechToKind(word.partOfSpeech),
    level: mapCefrToCardLevel(cefr),
    exampleEn: word.exampleSentence,
  });
  return addCardsIfMissing([card]);
}

export { getAllCards, VOCAB_CHANGED_EVENT };
export type { VocabCard };
