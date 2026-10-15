export interface SentencePair {
  id: number;
  en: string;
  tr: string;
  /** Görüntüleme amaçlı zaman etiketi, örn. "01:23" */
  timestamp?: string;
  /** YouTube altyazısından gelen GERÇEK başlangıç saniyesi. Senkronizasyonun tek kaynağı. */
  startSec?: number;
  /** Cümlenin bittiği saniye. */
  endSec?: number;
  /**
   * Cümleyi oluşturan ALTYAZI PARÇALARI, kendi gerçek zamanlarıyla.
   *
   * TED'in transkriptindeki gibi "şu an konuşulan bölümü" sarıyla
   * vurgulayabilmek için gerekiyor: cümlenin tamamını boyamak, nerede
   * olunduğunu söylemiyor. YouTube altyazısı zaten bu parçalar halinde
   * geliyor; buildSentencesFromCues onları cümleye birleştirirken
   * sınırları da saklıyor.
   *
   * Elle yapıştırılmış transkriptlerde ve eski derslerde YOK; o durumda
   * arayüz kelime sayısına göre tahmin ediyor (bkz. aktifVurguAraligi).
   */
  parcalar?: { bas: number; son: number; basHarf: number; sonHarf: number }[];
  notes?: string;
}

export interface VocabularyItem {
  word: string;
  type?: string;
  ipa?: string;
  meaningTr: string;
  pronunciationNote?: string;
  exampleSentence?: string;
}

export interface GrammarExample {
  en: string;
  tr: string;
}

export interface GrammarRuleItem {
  topic: string;
  explanationTr: string;
  examples: GrammarExample[];
}

export interface QuizQuestion {
  id: number;
  type: 'multiple_choice' | 'open_ended';
  question: string;
  options?: string[];
  correctOptionIndex?: number;
  sampleAnswerEn?: string;
  explanationTr: string;
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanationTr: string;
}

export interface NaturalPhrasingSuggestion {
  original: string;
  nativeSuggestion: string;
  whyBetterTr: string;
}

export interface WritingEvaluationResult {
  grammarCorrections: GrammarCorrection[];
  naturalPhrasing: NaturalPhrasingSuggestion[];
  generalFeedback: string;
}

/* YAPAY ZEKA DEGERLENDIRMELERI DERSTE SAKLANIYOR.
 *
 * Uc degerlendirme de (yazma, test, konusma) yalnizca bilesen
 * durumundaydi: katmandan cikinca yok oluyordu. Kullanici acisindan
 * tuhafti - emek verip aldigi geri bildirimi bir daha goremiyordu - ve
 * ders raporunu imkansiz kiliyordu. Artik derse yaziliyorlar, yani
 * localStorage'a ve oradan senkronla diger cihaza da gidiyorlar.
 *
 * Hepsi ISTEGE BAGLI: eski derslerde bu alanlar yok ve rapor o
 * bolumleri "kayit yok" diye gosteriyor.
 */

/** Katman 6'daki yazma degerlendirmesi, alindigi zamanla birlikte. */
export interface SavedWritingEvaluation extends WritingEvaluationResult {
  evaluatedAt: number;
  /** Degerlendirilen metin: ders sonradan duzenlenirse hangi metne
      bakildigi kaybolmasin. */
  evaluatedText: string;
}

/** Katman 4'teki anlama testinin sonucu. */
export interface SavedQuizResult {
  completedAt: number;
  dogru: number;
  toplam: number;
  /** Soru basina verilen cevap; rapor yanlislari da gosterebilsin diye. */
  cevaplar: {
    soruId: number;
    soru: string;
    verilen: string;
    dogruCevap: string;
    dogruMu: boolean;
    aciklamaTr?: string;
  }[];
}

/** Katman 7'deki konusma simulasyonunun dokumu. */
export interface SavedSpeakingSession {
  completedAt: number;
  turlar: {
    step: number;
    coachFeedback?: string;
    coachQuestion: string;
    coachQuestionTr?: string;
    userResponse?: string;
  }[];
}

export interface VideoLesson {
  id: string;
  title: string;
  speaker?: string;
  youtubeUrl: string;
  youtubeId?: string;
  description: string;
  level: 'B1' | 'B2' | 'C1';
  durationMinutes: number;
  sentences: SentencePair[];
  vocabulary?: VocabularyItem[];
  grammarRules?: GrammarRuleItem[];
  quizQuestions?: QuizQuestion[];
  userSummary?: string;
  userComment?: string;
  /** Katman 6: yazdigi metne gelen yapay zeka degerlendirmesi. */
  writingEvaluation?: SavedWritingEvaluation;
  /** Katman 4: anlama testi sonucu. */
  quizResult?: SavedQuizResult;
  /** Katman 7: konusma simulasyonu dokumu. */
  speakingSession?: SavedSpeakingSession;
  completedLayers: number[]; // e.g. [1, 2, 3]
  /**
   * Bu dersin son degisme zamani. SENKRON ICIN SART: dersler artik tek
   * bir blok olarak degil DERS DERS esitleniyor ve iki cihazdaki ayni
   * dersten hangisinin yeni oldugunu bu alan soyluyor.
   *
   * Eski kayitlarda yok; yoksa 0 sayiliyor, yani damgasi olan her surum
   * ondan yeni kabul ediliyor.
   */
  updatedAt?: number;
  /** true ise cümlelerde YouTube'dan gelen gerçek zaman bilgisi var. */
  hasRealTimings?: boolean;
}

export interface MistakeEntry {
  id: string;
  lessonId: string;
  lessonTitle: string;
  question: string;
  options?: string[];
  userAnswer: string;
  correctAnswer: string;
  explanationTr?: string;
  timestamp: string;
}

export interface UserProgress {
  completedVideoCount: number;
  goalVideoCount: number;
  /**
   * Kullanicinin kendi CEFR seviyesi. Anlama oraninin hesabinda kullanilir:
   * bu seviyenin altindaki kelimeler "biliniyor" sayilir, ustundekiler icin
   * kart destesine bakilir. Tanimsizsa B1 varsayilir.
   */
  cefrLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  studyStreakDays: number;
  lastStudyDate: string;
  /** Calisma yapilan gunler (YYYY-MM-DD). Seri bu listeden hesaplanir. */
  studyDates?: string[];
  bookmarkedWords: { word: string; enContext: string; trContext: string }[];
  weeklyStudyMinutes?: { day: string; date?: string; minutes: number }[];
}
