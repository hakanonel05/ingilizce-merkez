import React, { useState, useEffect } from 'react';
import { VideoLesson, QuizQuestion, MistakeEntry } from '../../types';
import { apiFetch } from '../../lib/userKeys';
import { HelpCircle, CheckCircle2, XCircle, Sparkles, CheckCircle, Loader2, Award, AlertCircle } from 'lucide-react';

interface Layer3ComprehensionQuizProps {
  lesson: VideoLesson;
  onCompleteLayer: () => void;
  onUpdateQuizData: (questions: QuizQuestion[]) => void;
  onRecordMistakes: (entries: Omit<MistakeEntry, 'id' | 'timestamp'>[]) => void;
}

export const Layer3ComprehensionQuiz: React.FC<Layer3ComprehensionQuizProps> = ({
  lesson,
  onCompleteLayer,
  onUpdateQuizData,
  onRecordMistakes,
}) => {
  const [userAnswers, setUserAnswers] = useState<{ [questionId: number]: any }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const quizQuestions = lesson.quizQuestions || [];

  // Auto generate if empty on mount
  useEffect(() => {
    if (quizQuestions.length === 0 && !isGenerating && lesson.sentences?.length > 0) {
      handleGenerateQuiz();
    }
  }, [lesson.id]);

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    setErrorMsg('');
    try {
      const fullText = lesson.sentences.map((s) => s.en).join(' ');
      const res = await apiFetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcriptText: fullText }),
      });
      const data = await res.json();
      if (res.ok && data.questions) {
        onUpdateQuizData(data.questions);
        setIsSubmitted(false);
        setUserAnswers({});
      } else {
        setErrorMsg(data.error || 'Quiz oluşturulamadı.');
      }
    } catch (err: any) {
      console.error('Quiz generation failed', err);
      setErrorMsg('Sunucu bağlantı hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleOpenEndedChange = (qId: number, text: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: text }));
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q) => {
      if (q.type === 'multiple_choice' && userAnswers[q.id] === q.correctOptionIndex) {
        score += 1;
      } else if (q.type === 'open_ended' && userAnswers[q.id]?.trim()?.length > 10) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);

    const mistakes: Omit<MistakeEntry, 'id' | 'timestamp'>[] = [];
    quizQuestions.forEach((q) => {
      if (q.type !== 'multiple_choice' || !q.options) return;
      const selectedIdx = userAnswers[q.id];
      const isCorrect = selectedIdx === q.correctOptionIndex;
      if (!isCorrect) {
        mistakes.push({
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          question: q.question,
          options: q.options,
          userAnswer: typeof selectedIdx === 'number' ? q.options[selectedIdx] : 'Boş bırakıldı',
          correctAnswer: typeof q.correctOptionIndex === 'number' ? q.options[q.correctOptionIndex] : '',
          explanationTr: q.explanationTr,
        });
      }
    });

    if (mistakes.length > 0) {
      onRecordMistakes(mistakes);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-paper-2 border border-hairline rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Rozet ve baslik kalkti: ikisi de bu bilesenin ustundeki
              LayerHeaderBar'da yaziyor (App.tsx). Ustelik rozet rengi her
              katmanda farkliydi - yedi katman yedi renge gidiyordu. */}

          <button
            onClick={handleGenerateQuiz}
            disabled={isGenerating}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-accent hover:bg-accent-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Test Hazırlanıyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-white/70" />
                <span>{quizQuestions.length > 0 ? 'Soruları Yenile' : 'AI Testi Oluştur'}</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-ink-2 leading-relaxed">
          Videoyu altyazısız izledikten ve kulaklıkla dinledikten sonra kavrayışınızı test etmek için 5 soru hazırlanmıştır. 
          Yanıtlarınızı girdikten sonra cevap anahtarını ve analizini inceleyebilirsiniz.
        </p>

        {errorMsg && (
          <div className="flex items-center justify-between bg-rose-50 border border-rose-200 p-3 rounded-lg text-xs text-rose-800">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={handleGenerateQuiz}
              className="ml-3 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-semibold shrink-0 cursor-pointer"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {isSubmitted && (
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-lg flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center space-x-2 font-semibold">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Test Sonucu: {calculateScore()} / {quizQuestions.length} Doğru Kavrayış</span>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
            >
              Yeniden Çöz
            </button>
          </div>
        )}
      </div>

      {/* Quiz Questions List */}
      <div className="space-y-4">
        {quizQuestions.length === 0 ? (
          <div className="bg-paper-2 border border-hairline p-8 rounded-xl text-center space-y-3">
            <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto" />
            <h3 className="text-sm font-semibold text-ink-800">Anlama Testi Arka Planda Oluşturuluyor...</h3>
            <p className="text-xs text-ink-3 max-w-md mx-auto">
              Gemini AI transkript içeriğini analiz ederek 5 özel anlama sorusu hazırlıyor. Birkaç saniye içinde tamamlanacaktır.
            </p>
            <button
              type="button"
              onClick={handleGenerateQuiz}
              disabled={isGenerating}
              className="mt-2 inline-flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer disabled:opacity-50"
            >
              <HelpCircle className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Tekrar Soru Üret</span>
            </button>
          </div>
        ) : (
          quizQuestions.map((q, qIdx) => {
            const isMultipleChoice = q.type === 'multiple_choice';
            const isCorrect = isMultipleChoice && userAnswers[q.id] === q.correctOptionIndex;

            return (
              <div
                key={q.id || qIdx}
                className={`bg-paper-2 border rounded-xl p-5 space-y-3 transition ${
                  isSubmitted
                    ? isMultipleChoice
                      ? isCorrect
                        ? 'border-emerald-300 bg-emerald-50/30'
                        : 'border-rose-300 bg-rose-50/30'
                      : 'border-hairline'
                    : 'border-hairline'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-accent-soft text-accent-700 border border-accent/25">
                    Soru {qIdx + 1}
                  </span>
                  <h3 className="text-xs sm:text-sm font-semibold text-ink leading-relaxed">
                    {q.question}
                  </h3>
                </div>

                {/* Multiple Choice Options */}
                {isMultipleChoice && q.options && (
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswers[q.id] === optIdx;
                      const isRightOption = q.correctOptionIndex === optIdx;

                      let btnStyle = 'bg-paper border-hairline text-ink-2 hover:bg-paper-3 hover:border-hairline-2';
                      if (isSubmitted) {
                        if (isRightOption) {
                          btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
                        } else if (isSelected && !isRightOption) {
                          btnStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-accent-soft border-accent/60 text-accent-700 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-lg border text-xs transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isSubmitted && isRightOption && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                          {isSubmitted && isSelected && !isRightOption && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Open Ended Answer Field */}
                {!isMultipleChoice && (
                  <div className="space-y-2 pt-1">
                    <textarea
                      rows={3}
                      value={userAnswers[q.id] || ''}
                      onChange={(e) => handleOpenEndedChange(q.id, e.target.value)}
                      disabled={isSubmitted}
                      placeholder="İngilizce veya Türkçe yanıtınızı yazın..."
                      className="w-full p-3 bg-paper border border-hairline-2 rounded-lg text-xs text-ink placeholder-ink-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    />

                    {isSubmitted && q.sampleAnswerEn && (
                      <div className="bg-accent-soft p-3 rounded-lg border border-accent/25 text-xs space-y-1">
                        <strong className="text-accent-700 block font-semibold">Örnek Doğru Yanıt (İngilizce):</strong>
                        <p className="text-ink-800 font-mono text-[11px]">{q.sampleAnswerEn}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Explanation Box on Submit */}
                {isSubmitted && q.explanationTr && (
                  <div className="bg-paper p-3 rounded-lg border border-hairline text-xs text-ink-2 space-y-1">
                    <strong className="text-ink block font-semibold">Çözüm Analizi:</strong>
                    <p className="text-ink-2 leading-relaxed text-[11px]">{q.explanationTr}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Actions Bar */}
      {quizQuestions.length > 0 && !isSubmitted && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-accent hover:bg-accent-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer"
          >
            Yanıtları Kontrol Et & Analiz Et
          </button>
        </div>
      )}

      {isSubmitted && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onCompleteLayer}
            className="flex items-center space-x-2 px-5 py-2.5 bg-accent hover:bg-accent-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>4. Katmanı Tamamladım, 5. Katmana Geç</span>
          </button>
        </div>
      )}
    </div>
  );
};
