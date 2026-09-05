import React, { useState } from 'react';
import { VideoLesson, WritingEvaluationResult } from '../../types';
import { apiFetch } from '../../lib/userKeys';
import { Edit3, Sparkles, CheckCircle, Loader2, Lightbulb, AlertCircle, MessageSquareQuote, Check } from 'lucide-react';

interface Layer4WritingEvaluationProps {
  lesson: VideoLesson;
  onCompleteLayer: () => void;
  onSaveWriting: (summary: string, comment: string) => void;
}

export const Layer4WritingEvaluation: React.FC<Layer4WritingEvaluationProps> = ({
  lesson,
  onCompleteLayer,
  onSaveWriting,
}) => {
  const [summaryText, setSummaryText] = useState(lesson.userSummary || '');
  const [commentText, setCommentText] = useState(lesson.userComment || '');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<WritingEvaluationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    const combinedText = `${summaryText.trim()}\n\n${commentText.trim()}`.trim();
    if (!combinedText) {
      setErrorMsg('Lütfen önce İngilizce özetiniz veya yorumunuzu yazın.');
      return;
    }

    setIsEvaluating(true);
    setErrorMsg('');
    try {
      const res = await apiFetch('/api/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userText: combinedText,
          topicContext: lesson.title,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setEvaluationResult(data);
        onSaveWriting(summaryText, commentText);
      } else {
        setErrorMsg(data.error || 'Yazı değerlendirilemedi.');
      }
    } catch (err: any) {
      setErrorMsg('Sunucu bağlantı hatası oluştu.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-paper-2 border border-hairline rounded-xl p-5 space-y-3">
        <div className="flex items-center space-x-2.5">
          <span className="px-2.5 py-1 bg-accent-soft text-accent-700 border border-accent/25 text-xs font-semibold rounded-md">
            Layer 6
          </span>
          <h2 className="text-base sm:text-lg font-semibold text-ink">İngilizce Özet ve Yorum Değerlendirmesi</h2>
        </div>

        <p className="text-xs text-ink-2 leading-relaxed">
          İzlediğiniz ve dinlediğiniz videodan aklınızda kalanları <strong className="text-ink">çeviri yapmadan direkt İngilizce yazın</strong>. 
          Bilinmeyen kelime geldiğinde durmayın, Türkçe yazıp fikir akışını kesmeden devam edin.
        </p>

        <div className="bg-accent-soft/60 border border-accent/20 p-3.5 rounded-lg text-xs text-ink-2 space-y-1">
          <div className="flex items-center space-x-1.5 font-semibold text-accent-700">
            <Lightbulb className="w-4 h-4 text-accent shrink-0" />
            <span>Yazma Kuralları (Katmanlı Çalışma Metodu):</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-ink-2 pl-1 text-[11px]">
            <li>Basit cümlelerden çekinmeyin — nitelik değil, nicelik önemlidir.</li>
            <li>1. Kısım: Videonun İngilizce Özeti (Summary)</li>
            <li>2. Kısım: Konu hakkındaki kişisel İngilizce Yorumunuz (Commentary - Bağlam Kurma)</li>
          </ul>
        </div>
      </div>

      {/* Writing Inputs */}
      <form onSubmit={handleEvaluate} className="space-y-4">
        <div className="bg-paper-2 border border-hairline rounded-xl p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink flex items-center justify-between">
              <span>1. İngilizce Özetiniz (Summary)</span>
              <span className="text-[11px] text-ink-3 font-normal">1-2 Paragraf</span>
            </label>
            <textarea
              rows={4}
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              placeholder="In this video, the speaker explains layered learning which develops multiple language skills..."
              className="w-full p-3.5 bg-paper border border-hairline rounded-lg text-xs sm:text-sm text-ink placeholder-ink-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent leading-relaxed font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink flex items-center justify-between">
              <span>2. İngilizce Yorumunuz (Commentary & Personal Context)</span>
              <span className="text-[11px] text-ink-3 font-normal">Katılıyor musunuz? Kendi hayatınızla bağ kurun.</span>
            </label>
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="In my opinion, this method is very useful for adult learners because it connects grammar with real life..."
              className="w-full p-3.5 bg-paper border border-hairline rounded-lg text-xs sm:text-sm text-ink placeholder-ink-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent leading-relaxed font-sans"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-lg flex items-center space-x-1.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isEvaluating}
              className="flex items-center space-x-2 px-6 py-2.5 bg-accent hover:bg-accent-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini Koçu İnceliyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white/70" />
                  <span>Özet & Yorumu Değerlendir</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Evaluation Feedback Results */}
      {evaluationResult && (
        <div className="space-y-5 animate-fade-in">
          {/* General Encouragement */}
          <div className="bg-paper-2 border border-emerald-200 rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-semibold text-emerald-800 flex items-center space-x-2">
              <MessageSquareQuote className="w-5 h-5 text-emerald-600" />
              <span>Gemini Dil Koçu Genel Değerlendirmesi</span>
            </h3>
            <p className="text-xs text-ink-2 leading-relaxed bg-emerald-50/50 p-3.5 rounded-lg border border-emerald-100 font-medium">
              {evaluationResult.generalFeedback}
            </p>
          </div>

          {/* Grammar & Vocabulary Corrections */}
          <div className="bg-paper-2 border border-hairline rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-ink flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-accent" />
              <span>1. Gramer & Kelime Düzeltmeleri ({evaluationResult.grammarCorrections.length})</span>
            </h3>

            {evaluationResult.grammarCorrections.length === 0 ? (
              <p className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-lg border border-emerald-200 font-medium">
                Harika! Metninizde kritik gramer hatasına rastlanmadı.
              </p>
            ) : (
              <div className="space-y-3">
                {evaluationResult.grammarCorrections.map((corr, idx) => (
                  <div key={idx} className="bg-paper p-3.5 rounded-lg border border-hairline text-xs space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="text-rose-900 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                        <span className="text-[10px] text-rose-700 font-semibold block">Orijinal İfade:</span>
                        <span>"{corr.original}"</span>
                      </div>
                      <div className="text-emerald-900 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                        <span className="text-[10px] text-emerald-700 font-semibold block">Doğru Kullanım:</span>
                        <span>"{corr.corrected}"</span>
                      </div>
                    </div>
                    <p className="text-ink-2 text-[11px] bg-paper-2 p-2.5 rounded-lg border border-hairline">
                      <strong className="text-accent-700">Neden Değiştirildi? </strong> {corr.explanationTr}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Natural Phrasing Suggestions */}
          <div className="bg-paper-2 border border-hairline rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-ink flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>2. Ana Dili İngilizce Olan Biri Gibi İfade (Natural Phrasing - Native Suggestions)</span>
            </h3>

            <div className="space-y-3">
              {evaluationResult.naturalPhrasing.map((sug, idx) => (
                <div key={idx} className="bg-paper p-3.5 rounded-lg border border-hairline text-xs space-y-2">
                  <div className="text-ink-2">
                    <span className="text-ink-3 text-[10px] block font-semibold">Cümleniz:</span>
                    <span>"{sug.original}"</span>
                  </div>
                  <div className="text-accent-700 bg-accent-soft p-2.5 rounded-lg border border-accent/25">
                    <span className="text-[10px] text-accent-700 font-semibold block">Daha Doğal Alternatif (Native Speaker):</span>
                    <span className="font-semibold text-sm">"{sug.nativeSuggestion}"</span>
                  </div>
                  <p className="text-ink-2 text-[11px]">{sug.whyBetterTr}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Layer Completion */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onCompleteLayer}
              className="flex items-center space-x-2 px-5 py-2.5 bg-accent hover:bg-accent-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>6. Katmanı Tamamladım, 7. Katmana Geç</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
