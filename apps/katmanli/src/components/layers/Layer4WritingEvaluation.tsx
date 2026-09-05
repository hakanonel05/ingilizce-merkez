import React, { useState } from 'react';
import { VideoLesson, WritingEvaluationResult } from '../../types';
import { apiFetch } from '../../lib/userKeys';
import { Edit3, Sparkles, CheckCircle, Loader2, Lightbulb, AlertCircle, Check } from 'lucide-react';

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
        {/* "Layer 6" rozeti ve baslik kalkti: ikisi de bu bilesenin
            ustundeki LayerHeaderBar'da zaten yaziyor (App.tsx). */}
        <p className="max-w-[62ch] text-[13px] leading-relaxed text-ink-2">
          İzlediğiniz ve dinlediğiniz videodan aklınızda kalanları <strong className="text-ink">çeviri yapmadan direkt İngilizce yazın</strong>. 
          Bilinmeyen kelime geldiğinde durmayın, Türkçe yazıp fikir akışını kesmeden devam edin.
        </p>

        {/* Renkli uyari kutusu degil, sade bir not. Uc maddenin ikisi
            zaten asagidaki iki alanin etiketiydi; tekrar ediyorlardi. */}
        <p className="flex items-start gap-2 text-[12px] leading-relaxed text-ink-3">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
          Basit cümlelerden çekinme — burada nitelik değil, nicelik önemli.
        </p>
      </div>

      {/* Writing Inputs */}
      <form onSubmit={handleEvaluate} className="space-y-4">
        <div className="space-y-4 rounded-2xl border border-hairline bg-paper-2 p-5">
          <div className="space-y-1.5">
            <label className="flex items-baseline justify-between gap-3 text-[13px] font-medium text-ink">
              <span>Özet</span>
              <span className="text-[11px] font-normal text-ink-3">1-2 paragraf, İngilizce</span>
            </label>
            <textarea
              rows={4}
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              placeholder="In this video, the speaker explains layered learning which develops multiple language skills..."
              className="w-full rounded-xl border border-hairline bg-paper-2 p-3.5 text-[13px]
                leading-relaxed text-ink placeholder-ink-3 transition-colors
                focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-baseline justify-between gap-3 text-[13px] font-medium text-ink">
              <span>Yorum</span>
              <span className="text-[11px] font-normal text-ink-3">Kendi hayatınla bağ kur</span>
            </label>
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="In my opinion, this method is very useful for adult learners because it connects grammar with real life..."
              className="w-full rounded-xl border border-hairline bg-paper-2 p-3.5 text-[13px]
                leading-relaxed text-ink placeholder-ink-3 transition-colors
                focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
            />
          </div>

          {errorMsg && (
            <p className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-[12px] text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isEvaluating}
              className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[13px]
                font-medium text-white transition-colors duration-150 hover:bg-accent-700
                disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>İnceleniyor…</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Değerlendir</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Evaluation Feedback Results */}
      {evaluationResult && (
        <div className="space-y-5 animate-fade-in">
          {/* Genel degerlendirme. Yesil kenarlikli bir kartin icinde bir
              yesil kutu daha vardi; iki kenarlik ayni seyi soyluyordu. */}
          <div className="rounded-2xl border border-hairline bg-paper-2 p-5">
            <h2 className="text-[15px] font-semibold text-ink">Genel değerlendirme</h2>
            <p className="mt-2 max-w-[68ch] text-[13px] leading-relaxed text-ink-2">
              {evaluationResult.generalFeedback}
            </p>
          </div>

          {/* Grammar & Vocabulary Corrections */}
          {/* KUTU ICINDE KUTU ICINDE KUTU kalkti. Her duzeltme bir kutuydu;
              icinde pembe ve yesil iki kutu daha, altinda aciklama icin bir
              tane daha. Uc yuvalanma seviyesi iki satirlik bilgi icin.
              Simdi kart basina bir satir: yanlis, dogru, sebep. Renk
              kenarlik olarak degil METIN olarak kaldi - bilgiyi tasiyan
              zaten yazinin kendisi. */}
          <div className="rounded-2xl border border-hairline bg-paper-2 p-5">
            <h2 className="text-[15px] font-semibold text-ink">
              Gramer ve kelime düzeltmeleri{' '}
              <span className="timecode font-normal text-ink-3">
                {evaluationResult.grammarCorrections.length}
              </span>
            </h2>

            {evaluationResult.grammarCorrections.length === 0 ? (
              <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
                Kritik bir gramer hatasına rastlanmadı.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-hairline border-t border-hairline">
                {evaluationResult.grammarCorrections.map((corr, idx) => (
                  <li key={idx} className="py-3.5">
                    <p className="text-[13px] leading-relaxed text-rose-800 line-through decoration-rose-300">
                      {corr.original}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-emerald-800">
                      {corr.corrected}
                    </p>
                    <p className="mt-1.5 max-w-[68ch] text-[12px] leading-relaxed text-ink-3">
                      {corr.explanationTr}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Natural Phrasing Suggestions */}
          <div className="rounded-2xl border border-hairline bg-paper-2 p-5">
            <h2 className="text-[15px] font-semibold text-ink">Daha doğal söyleyiş</h2>
            <ul className="mt-3 divide-y divide-hairline border-t border-hairline">
              {evaluationResult.naturalPhrasing.map((sug, idx) => (
                <li key={idx} className="py-3.5">
                  <p className="text-[13px] leading-relaxed text-ink-3">{sug.original}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink">{sug.nativeSuggestion}</p>
                  <p className="mt-1.5 max-w-[68ch] text-[12px] leading-relaxed text-ink-3">
                    {sug.whyBetterTr}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Layer Completion */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onCompleteLayer}
              className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[13px]
                font-medium text-white transition-colors duration-150 hover:bg-accent-700 cursor-pointer"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Bu katmanı tamamladım</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
