import React, { useState, useEffect } from 'react';
import { VideoLesson, VocabularyItem, GrammarRuleItem } from '../../types';
import { apiFetch } from '../../lib/userKeys';
import { Sparkles, Volume2, BookOpen, Lightbulb, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

interface Layer2PhoneticsGrammarProps {
  lesson: VideoLesson;
  onCompleteLayer: () => void;
  onUpdateLessonData: (vocabulary: VocabularyItem[], grammarRules: GrammarRuleItem[]) => void;
}

export const Layer2PhoneticsGrammar: React.FC<Layer2PhoneticsGrammarProps> = ({
  lesson,
  onCompleteLayer,
  onUpdateLessonData,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'vocab' | 'grammar'>('vocab');
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const vocabularyList = lesson.vocabulary || [];
  const grammarList = lesson.grammarRules || [];

  // Auto generate if empty on mount
  useEffect(() => {
    if (vocabularyList.length === 0 && grammarList.length === 0 && !isGenerating && lesson.sentences?.length > 0) {
      handleGenerateAnalysis();
    }
  }, [lesson.id]);

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingText === text && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setSpeakingText(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.onstart = () => setSpeakingText(text);
      utterance.onend = () => setSpeakingText(null);
      utterance.onerror = () => setSpeakingText(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleGenerateAnalysis = async () => {
    setIsGenerating(true);
    setErrorMsg('');
    try {
      const res = await apiFetch('/api/analyze-phonetics-grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcriptSentences: lesson.sentences }),
      });
      const data = await res.json();
      if (res.ok && data.vocabulary && data.grammarRules) {
        onUpdateLessonData(data.vocabulary, data.grammarRules);
      } else {
        setErrorMsg(data.error || 'Fonetik ve gramer analizi oluşturulamadı.');
      }
    } catch (err: any) {
      console.error('Failed to generate analysis', err);
      setErrorMsg('Sunucu bağlantı hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-paper-2 border border-hairline rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Rozet ve baslik kalkti: LayerHeaderBar zaten "Fonetik &
              Gramer / Genelden ozele analiz" yaziyor. */}
          <div />

          <button
            onClick={handleGenerateAnalysis}
            disabled={isGenerating}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-accent hover:bg-accent-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analiz Ediliyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-white/70" />
                <span>{vocabularyList.length > 0 ? 'AI Analizini Yenile' : 'AI Fonetik & Gramer Analizi Yap'}</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-ink-2 leading-relaxed">
          Metindeki B2/C1 seviyesindeki kritik kelimeler, phrasal verb'ler ve telaffuz ipuçları aşağıda listelenmiştir. 
          Gramer öğretiminde <strong className="text-ink">"Genelden Özele" (context-driven)</strong> yaklaşım esastır: Karmaşık teorik kurallara girmeden, günlük hayattan 3 somut örnekle açıklanır.
        </p>

        {errorMsg && (
          <div className="flex items-center justify-between bg-rose-50 border border-rose-200 p-3 rounded-lg text-xs text-rose-800">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={handleGenerateAnalysis}
              className="ml-3 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-semibold shrink-0 cursor-pointer"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Sub Navigation */}
        <div className="flex items-center space-x-2 pt-2 border-t border-paper-3">
          <button
            onClick={() => setActiveTab('vocab')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'vocab'
                ? 'bg-ink text-white font-semibold'
                : 'bg-paper-3 text-ink-2 hover:text-ink'
            }`}
          >
            Kritik Kelimeler & Fonetik ({vocabularyList.length})
          </button>

          <button
            onClick={() => setActiveTab('grammar')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'grammar'
                ? 'bg-ink text-white font-semibold'
                : 'bg-paper-3 text-ink-2 hover:text-ink'
            }`}
          >
            Gramer Yapıları & Örnek Cümleler ({grammarList.length})
          </button>
        </div>
      </div>

      {/* Content Section */}
      {activeTab === 'vocab' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vocabularyList.length === 0 ? (
            <div className="col-span-1 md:col-span-2 bg-paper-2 border border-hairline p-8 rounded-xl text-center space-y-3">
              <Loader2 className="w-8 h-8 text-brand animate-spin mx-auto" />
              <h3 className="text-sm font-semibold text-ink-800">2. Katman Analizi Arka Planda Oluşturuluyor...</h3>
              <p className="text-xs text-ink-3 max-w-md mx-auto">
                Gemini AI transkriptteki B2/C1 kelimeleri, IPA okunuşlarını ve gramer kurallarını analiz ediyor. Birkaç saniye içinde hazır olur.
              </p>
              <button
                type="button"
                onClick={handleGenerateAnalysis}
                disabled={isGenerating}
                className="mt-2 inline-flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Tekrar Analiz Et</span>
              </button>
            </div>
          ) : (
            vocabularyList.map((item, idx) => (
              <div
                key={idx}
                className="bg-paper-2 border border-hairline rounded-xl p-4 space-y-2.5 hover:border-hairline-2 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-semibold text-ink">{item.word}</h3>
                      {item.type && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-accent-soft text-accent-700 border border-accent/25 font-semibold">
                          {item.type}
                        </span>
                      )}
                    </div>
                    {item.ipa && <p className="text-xs text-brand font-mono mt-0.5">{item.ipa}</p>}
                  </div>

                  <button
                    onClick={() => speakWord(item.word)}
                    className="p-2 bg-paper-3 hover:bg-hairline text-ink-2 rounded-lg transition cursor-pointer"
                    title="Sesli Telaffuz Dinle"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="bg-paper p-2.5 rounded-lg border border-hairline text-ink-800 font-medium">
                    <span className="text-ink-3 font-normal">Anlam: </span>
                    {item.meaningTr}
                  </div>

                  {item.pronunciationNote && (
                    <div className="rounded-lg bg-paper-3 p-2.5 text-[12px] text-ink-2">
                      <strong className="font-medium text-ink">Telaffuz ipucu: </strong>
                      {item.pronunciationNote}
                    </div>
                  )}

                  {item.exampleSentence && (
                    <div className="text-ink-3 italic text-[11px] pt-1">
                      "{item.exampleSentence}"
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {grammarList.length === 0 ? (
            <div className="bg-paper-2 border border-hairline p-8 rounded-xl text-center space-y-3">
              <Sparkles className="w-8 h-8 text-brand mx-auto animate-bounce" />
              <p className="text-xs text-ink-2">
                Gramer analizi için butonla Gemini AI koçunuzu tetikleyebilirsiniz.
              </p>
            </div>
          ) : (
            grammarList.map((rule, idx) => (
              <div key={idx} className="bg-paper-2 border border-hairline rounded-xl p-5 space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                  <h3 className="text-sm sm:text-base font-semibold text-ink">{rule.topic}</h3>
                </div>

                <p className="text-xs text-ink-2 leading-relaxed bg-accent-soft/50 p-3 rounded-lg border border-accent/20">
                  {rule.explanationTr}
                </p>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-ink-3">
                    İlgili Örnek Cümleler & Metin İçi Kullanımlar ({rule.examples?.length || 0} Adet):
                  </h4>
                  <div className="space-y-2">
                    {rule.examples.map((ex, eIdx) => (
                      <div
                        key={eIdx}
                        className="bg-paper p-3.5 rounded-lg border border-hairline text-sm space-y-1.5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                          <div className="flex items-center justify-between text-ink font-semibold text-sm sm:text-base">
                            <span>{eIdx + 1}. {ex.en}</span>
                            <button
                              onClick={() => speakWord(ex.en)}
                              className="p-1 text-ink-3 hover:text-brand transition cursor-pointer shrink-0 ml-2"
                              title="Sesli Dinle"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-ink-2 font-medium text-xs sm:text-sm border-t md:border-t-0 md:border-l border-hairline pt-1 md:pt-0 md:pl-3">
                            {ex.tr}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
