/**
 * Kart kelimesi dizini iki uygulamada ortak: ../../../../shared/vocab/cardTerms.
 * Burada yalnızca katmanlı'ya özgü olan, bir video dersinin taranması var.
 */
import { cardTermsInTexts, CardMatcher } from '../../../../shared/vocab/cardTerms';
import type { VideoLesson } from '../types';

export * from '../../../../shared/vocab/cardTerms';

/** Bir dersin transkriptinde ve test sorularında geçen farklı kart kelimeleri. */
export function lessonCardTerms(lesson: VideoLesson, m: CardMatcher): string[] {
  const texts: string[] = (lesson.sentences || []).map((s) => s.en);
  for (const q of lesson.quizQuestions || []) texts.push(q.question, ...(q.options || []));
  return cardTermsInTexts(texts, m);
}
