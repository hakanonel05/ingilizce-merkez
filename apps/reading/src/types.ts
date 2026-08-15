export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface VocabularyWord {
  term: string;
  meaning: string;
  partOfSpeech: string; // e.g. 'n', 'v', 'adj', 'adv', 'phr. v'
  definition?: string;
  exampleSentence?: string;
}

export interface ComprehensionQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string; // e.g. 'A', 'B', 'C', 'D'
}

export interface VocabularyExercise {
  id: number;
  question: string;
  options: string[];
  answer: string; // e.g. 'A', 'B', 'C', 'D'
  explanation?: string;
}

export interface Passage {
  id: number;
  title: string;
  cefr: CEFRLevel;
  theme: string;
  paragraphs: string[];
  vocabulary: VocabularyWord[];
  questions: ComprehensionQuestion[];
  exercises: VocabularyExercise[];
  isGenerated?: boolean;
}

export interface UserProgress {
  completedPassages: number[]; // Array of completed passage IDs
  scores: Record<number, { score: number; total: number; timestamp: string }>; // passageId -> score details
  wordStatus: Record<string, 'unstudied' | 'studied' | 'learned'>; // word term -> status
  favoritePassages: number[]; // Array of favorited passage IDs
  dailyStreak: number;
  lastActiveDate: string | null;
  totalTimeSpent: number; // in seconds
  workbookState?: Record<string, {
    answers: Record<string, string | string[]>;
    checked: Record<number, boolean>;
  }>;
}
