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
  mistakes: MistakeEntry[];
  examHistory: ExamAttempt[];
}

// A single wrong answer, tracked for the "Yanlışlar Defteri" (Mistakes Notebook)
export interface MistakeEntry {
  key: string; // unique key: `${source}-${passageId}-${questionId}`
  passageId: number;
  passageTitle: string;
  cefr: CEFRLevel;
  source: 'quiz' | 'exercise' | 'exam'; // comprehension test, vocab exercise, or exam simulation
  questionId: number;
  question: string;
  options: string[];
  correctAnswer: string;
  yourAnswer: string;
  firstMissedAt: string;
  lastMissedAt: string;
  reviewCount: number; // how many times reviewed in the notebook
  lastReviewedAt: string | null;
}

// A single graded question result, passed up from quiz/exercise/exam components
export interface GradedQuestionResult {
  questionId: number;
  question: string;
  options: string[];
  correctAnswer: string;
  yourAnswer: string;
  isCorrect: boolean;
}

// One completed exam attempt, kept for history/stats
export interface ExamAttempt {
  id: string;
  timestamp: string;
  passageIds: number[];
  durationSeconds: number;
  timeTakenSeconds: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  blankCount: number;
}
