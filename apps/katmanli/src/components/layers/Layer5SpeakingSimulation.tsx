import React, { useState, useEffect, useRef } from 'react';
import { VideoLesson } from '../../types';
import { apiFetch } from '../../lib/userKeys';
import { Mic, MicOff, Volume2, Send, Sparkles, CheckCircle, Loader2, Award, RefreshCw, AlertCircle, Repeat, Plus, Minus } from 'lucide-react';

/** Tekrar sayaçları ders bazında saklanır. */
const REPS_STORAGE_KEY = 'layered_learning_speaking_reps_v1';
const REP_TARGET = 15;
const REP_MINIMUM = 10;

interface Layer5SpeakingSimulationProps {
  lesson: VideoLesson;
  onCompleteLayer: () => void;
}

interface ChatTurn {
  step: number;
  coachFeedback?: string;
  coachQuestion: string;
  coachQuestionTr?: string;
  userResponse?: string;
}

export const Layer5SpeakingSimulation: React.FC<Layer5SpeakingSimulationProps> = ({
  lesson,
  onCompleteLayer,
}) => {
  // Sesli anlatım tekrar sayacı: metodoloji 10-15 tekrar öneriyor
  const [repCount, setRepCount] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(REPS_STORAGE_KEY);
      if (raw) return JSON.parse(raw)[lesson.id] || 0;
    } catch (e) {
      console.error('Tekrar sayacı okunamadı:', e);
    }
    return 0;
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(REPS_STORAGE_KEY);
      const all = raw ? JSON.parse(raw) : {};
      all[lesson.id] = repCount;
      localStorage.setItem(REPS_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.error('Tekrar sayacı kaydedilemedi:', e);
    }
  }, [repCount, lesson.id]);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [userSpeechInput, setUserSpeechInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const recognitionRef = useRef<any>(null);

  // Start initial conversation question when component mounts
  useEffect(() => {
    if (history.length === 0) {
      startSimulation();
    }
  }, []);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingText === text && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setSpeakingText(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onstart = () => setSpeakingText(text);
      utterance.onend = () => setSpeakingText(null);
      utterance.onerror = () => setSpeakingText(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startSimulation = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await apiFetch('/api/speaking-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStep: 1,
          topicContext: lesson.title,
        }),
      });
      const data = await res.json();
      if (res.ok && data.nextQuestion) {
        setHistory([
          {
            step: 1,
            coachQuestion: data.nextQuestion,
            coachQuestionTr: data.nextQuestionTr,
          },
        ]);
        speakText(data.nextQuestion);
      } else {
        setErrorMsg(data.error || 'Konuşma simülasyonu başlatılamadı.');
      }
    } catch (err) {
      console.error('Failed to start speaking simulation', err);
      setErrorMsg('Sunucu bağlantı hatası oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Tarayıcınız mikrofon ses tanımayı desteklemiyor. Metin yazarak devam edebilirsiniz.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserSpeechInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSubmitResponse = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userSpeechInput.trim() || isLoading) return;

    const speechText = userSpeechInput.trim();
    setUserSpeechInput('');
    setIsLoading(true);
    setErrorMsg('');

    try {
      const currentTurn = history[history.length - 1];
      const res = await apiFetch('/api/speaking-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStep,
          userResponse: speechText,
          conversationHistory: history,
          topicContext: lesson.title,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Yanıtınız değerlendirilemedi.');
        setUserSpeechInput(speechText);
        return;
      }

      // Update current turn with user response & feedback
      const updatedHistory = [...history];
      updatedHistory[updatedHistory.length - 1].userResponse = speechText;
      if (data.feedback) {
        updatedHistory[updatedHistory.length - 1].coachFeedback = data.feedback;
      }

      if (data.nextQuestion) {
        const nextStepNum = currentStep + 1;
        setCurrentStep(nextStepNum);
        updatedHistory.push({
          step: nextStepNum,
          coachQuestion: data.nextQuestion,
          coachQuestionTr: data.nextQuestionTr,
        });
        speakText(data.nextQuestion);
      } else if (data.isCompleted || data.step === 'completed') {
        setIsCompleted(true);
      }

      setHistory(updatedHistory);
    } catch (err) {
      console.error('Failed to submit speaking response', err);
      setErrorMsg('Sunucu bağlantı hatası oluştu.');
      setUserSpeechInput(speechText);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* "Layer 7" rozeti ve baslik kalkti: LayerHeaderBar'da zaten var. */}
      <div className="space-y-3 rounded-2xl border border-hairline bg-paper-2 p-5">
        <p className="max-w-[62ch] text-[13px] leading-relaxed text-ink-2">
          Gemini AI Dil Koçunuz video konusu üzerinden size <strong className="text-ink">sırayla 3 soru</strong> soracak. 
          Her soruyu mikrofonunuzu kullanarak veya yazarak cevaplayabilirsiniz. Koçunuz konuşma dilinizin akıcılığına odaklanacak ve kısa geri bildirimlerle sizi destekleyecektir.
        </p>

        {/* Sesli Anlatım Tekrar Sayacı */}
        {/* KEHRİBAR TEMA KALKTI. Bu sayaç baştan sona kehribardı — zemin,
            kenarlık, başlık, sayı rozeti, ilerleme çubuğu ve iki düğme.
            Kehribar bu depoda "şu an konuşulan cümle" işareti (index.css);
            bir sayacın teması değil. */}
        <div className="space-y-3 rounded-xl bg-paper-3 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Repeat className="h-4 w-4 text-ink-3" />
              <h3 className="text-[14px] font-medium text-ink">Sesli anlatım tekrarı</h3>
            </div>
            <span className="timecode text-ink-2">
              {repCount}/{REP_TARGET}
            </span>
          </div>

          <p className="max-w-[62ch] text-[12px] leading-relaxed text-ink-2">
            Yazdığınız özet ve yorumu kendinize sesli anlatın. Metodoloji
            <strong> {REP_MINIMUM}-{REP_TARGET} tekrar</strong> öneriyor. Dışarıda kulaklıkla
            yürürken biriyle konuşuyormuş gibi pratik yapabilirsiniz. Her tekrardan sonra
            aşağıdaki düğmeye basın.
          </p>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                repCount >= REP_MINIMUM ? 'bg-ok' : 'bg-accent'
              }`}
              style={{ width: `${Math.min(100, (repCount / REP_TARGET) * 100)}%` }}
            />
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRepCount((c) => c + 1)}
              className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-[13px]
                font-medium text-white transition-colors duration-150 hover:bg-accent-700 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Bir tekrar yaptım</span>
            </button>

            <button
              type="button"
              onClick={() => setRepCount((c) => Math.max(0, c - 1))}
              disabled={repCount === 0}
              className="flex items-center gap-1 rounded-xl border border-hairline bg-paper-2 px-3 py-2
                text-[13px] text-ink-2 transition-colors hover:text-ink
                disabled:opacity-40 cursor-pointer"
              title="Yanlışlıkla arttırdıysan"
            >
              <Minus className="h-3.5 w-3.5" />
              <span>Geri al</span>
            </button>

            <button
              type="button"
              onClick={() => setRepCount(0)}
              disabled={repCount === 0}
              className="rounded-lg px-3 py-2 text-[12px] text-ink-3 transition-colors hover:text-ink disabled:opacity-40 cursor-pointer"
            >
              Sıfırla
            </button>

            {repCount >= REP_MINIMUM && (
              <span className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-ok">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>
                  {repCount >= REP_TARGET
                    ? 'Hedefi tamamladınız'
                    : `Alt sınırı geçtiniz, ${REP_TARGET}'e kadar devam edebilirsiniz`}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center space-x-2 pt-2 border-t border-paper-3">
          {[1, 2, 3].map((stepNum) => (
            <div
              key={stepNum}
              className={`flex-1 p-2 rounded-lg text-center text-xs font-semibold border transition ${
                currentStep === stepNum && !isCompleted
                  ? 'bg-accent text-white border-accent'
                  : currentStep > stepNum || isCompleted
                  ? 'bg-ok-soft text-ok border-ok-line'
                  : 'bg-paper text-ink-3 border-hairline'
              }`}
            >
              Soru {stepNum} / 3
            </div>
          ))}
        </div>

        {errorMsg && (
          <div className="mt-2 flex items-center justify-between rounded-xl border border-danger-line bg-danger-soft p-3 text-[12px] text-danger">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-danger shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={startSimulation}
              className="ml-3 shrink-0 rounded-lg bg-danger px-2.5 py-1 text-[12px] font-medium
                text-white transition-colors hover:bg-danger-strong cursor-pointer"
            >
              Tekrar Yenile
            </button>
          </div>
        )}
      </div>

      {/* Conversation Thread Container */}
      <div className="bg-paper-2 border border-hairline rounded-xl p-4 sm:p-5 space-y-4 min-h-[300px]">
        {history.map((turn, index) => (
          <div key={index} className="space-y-3">
            {/* Coach Question Bubble */}
            <div className="bg-paper p-4 rounded-xl border border-hairline space-y-2 max-w-3xl">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-brand tracking-wide flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand" />
                  <span>Gemini Dil Koçu (Soru {turn.step}):</span>
                </span>
                <button
                  onClick={() => speakText(turn.coachQuestion)}
                  className="p-1.5 text-ink-3 hover:text-brand transition cursor-pointer"
                  title="Soruyu Sesli Dinle"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-ink leading-relaxed">
                "{turn.coachQuestion}"
              </p>

              {turn.coachQuestionTr && (
                <p className="text-[11px] text-ink-3 italic">
                  İpucu / Türkçe: {turn.coachQuestionTr}
                </p>
              )}
            </div>

            {/* User Response Bubble */}
            {turn.userResponse && (
              <div className="flex justify-end">
                <div className="bg-accent-soft p-4 rounded-xl border border-accent/25 text-xs sm:text-sm text-ink max-w-2xl space-y-1">
                  <span className="text-[10px] text-brand font-semibold block">Yanıtınız:</span>
                  <p className="leading-relaxed font-medium">"{turn.userResponse}"</p>
                </div>
              </div>
            )}

            {/* Coach Feedback for this answer */}
            {turn.coachFeedback && (
              <div className="rounded-xl border border-ok-line bg-ok-soft p-3 text-[13px] leading-relaxed text-ok">
                <strong className="text-ok block font-semibold">Geri Bildirim: </strong>
                {turn.coachFeedback}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-brand text-xs p-3">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Gemini koçunuz yanıtınızı dinliyor ve hazırlanıyor...</span>
          </div>
        )}
      </div>

      {/* Mic / Text Input Controls */}
      {!isCompleted ? (
        <form onSubmit={handleSubmitResponse} className="bg-paper-2 border border-hairline p-3 sm:p-4 rounded-xl space-y-3">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={toggleMic}
              className={`p-3 rounded-lg border transition flex items-center justify-center cursor-pointer ${
                isListening
                  ? 'bg-danger text-white border-danger animate-pulse'
                  : 'bg-paper-3 hover:bg-hairline text-brand border-hairline'
              }`}
              title={isListening ? 'Konuşmayı durdur' : 'Mikrofonu açıp İngilizce konuşun'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={userSpeechInput}
              onChange={(e) => setUserSpeechInput(e.target.value)}
              placeholder={isListening ? 'Mikrofon dinliyor... İngilizce konuşun...' : 'Sesinizi veya metninizi buraya yazın...'}
              className="flex-1 min-w-0 px-4 py-3 bg-paper border border-hairline rounded-lg text-xs sm:text-sm text-ink placeholder-ink-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading || !userSpeechInput.trim()}
              className="px-5 py-3 bg-accent hover:bg-accent-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-lg transition flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Gönder</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3 rounded-2xl border border-hairline bg-paper-2 p-6 text-center">
          <Award className="w-10 h-10 text-ok mx-auto" />
          <h3 className="text-lg font-semibold text-ink">Tebrikler! 7. Katman Konuşma Simülasyonunu Tamamladınız!</h3>
          <p className="text-xs text-ink-2 max-w-xl mx-auto">
            3 soruluk karşılıklı konuşma pratiğini başarıyla gerçekleştirdiniz. Kendi kendinize 10-15 kez sesli anlatım tekrarı yapmayı unutmayın!
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={onCompleteLayer}
              className="flex items-center space-x-2 px-6 py-2.5 bg-accent hover:bg-accent-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Ders Katmanlarını Tamamla</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
