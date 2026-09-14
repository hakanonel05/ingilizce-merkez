import React, { useState, useRef } from "react";
import { Mic, Square, Upload, Play, Volume2, ChevronDown, Check, Sparkles } from "lucide-react";
import { speakText, formatDuration } from '../../lib/konusmaSesi';

interface ReadingTabProps {
  targetText: string;
  onTargetTextChange: (text: string) => void;
  onAudioReady: (blob: Blob, url: string) => void;
  onFileSelected: (file: File, url: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  hasAudio: boolean;
  audioUrl: string | null;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const PRESET_EXAMPLES = [
  {
    id: "ex1",
    label: "Örnek 1",
    text: "We had a great time taking a long walk outside in the morning.",
  },
  {
    id: "ex2",
    label: "Örnek 2",
    text: "question the plausibility of one explanation.",
  },
  {
    id: "ex3",
    label: "Örnek 3",
    text: "Technology is advancing at an unprecedented pace around the world.",
  },
  {
    id: "ex4",
    label: "Örnek 4",
    text: "Effective communication requires active listening and clear articulation.",
  },
];

export const ReadingTab: React.FC<ReadingTabProps> = ({
  targetText,
  onTargetTextChange,
  onAudioReady,
  onFileSelected,
  onAnalyze,
  isLoading,
  hasAudio,
  audioUrl,
  selectedLanguage,
  onLanguageChange,
}) => {
  const [activePreset, setActivePreset] = useState<string>("ex1");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPlayingTarget, setIsPlayingTarget] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectPreset = (presetId: string, text: string) => {
    setActivePreset(presetId);
    onTargetTextChange(text);
  };

  const handleSelectCustom = () => {
    setActivePreset("custom");
    if (PRESET_EXAMPLES.some((ex) => ex.text === targetText)) {
      onTargetTextChange("");
    }
  };

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        onAudioReady(blob, url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordDuration(0);

      const startTime = Date.now();
      timerRef.current = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setRecordDuration(elapsed);
        /* SINIR 600 DEGIL 120 SANIYE. Ozgun surum 10 dakikaya izin
           veriyordu; bu depoda kayit Netlify fonksiyonuna gidiyor ve istek
           govdesi 6 MB ile sinirli. webm/opus dakikada ~500 KB, base64e
           cevrilince ~680 KB: 10 dakika ~7 MB eder ve CANLI SITEDE HIC
           CALISMAZ. Iki dakika hem sinirin altinda hem bir paragrafi
           okumaya fazlasiyla yetiyor. */
        if (elapsed >= 120) {
          stopRecording();
        }
      }, 500);
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Mikrofon izni alınamadı. Lütfen tarayıcı izinlerinizi kontrol edin.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      onFileSelected(file, url);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      onFileSelected(file, url);
    }
  };

  const handleListenTarget = async () => {
    if (!targetText.trim()) return;
    setIsPlayingTarget(true);
    await speakText(targetText);
    setIsPlayingTarget(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controls Bar: Language + Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Preset Chips matching screenshot's clean pill design */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100/80 rounded-xl border border-stone-200/70 text-xs">
          {PRESET_EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => handleSelectPreset(ex.id, ex.text)}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activePreset === ex.id
                  ? "bg-[#18181b] text-white font-semibold shadow-2xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
              }`}
            >
              {ex.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleSelectCustom}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activePreset === "custom"
                ? "bg-[#18181b] text-white font-semibold shadow-2xs"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
            }`}
          >
            Kendi Metniniz
          </button>
        </div>

        {/* Language selector */}
        <div className="relative inline-block w-full sm:w-64">
          <select
            id="select-language"
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            disabled={isLoading}
            className="w-full appearance-none bg-white border border-stone-200/90 rounded-xl px-3.5 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer pr-8 shadow-xs"
          >
            <option value="en-US">İngilizce (Birleşik Devletler - US)</option>
            <option value="en-GB">İngilizce (Birleşik Krallık - UK)</option>
            <option value="en-AU">İngilizce (Avustralya - AU)</option>
            <option value="en-CA">İngilizce (Kanada - CA)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Two Column Workstation Cards matching the screenshot's card aesthetic */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Left Card: Target Text */}
        <div className="md:col-span-6 bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between min-h-[260px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
                Hedef Metin (Model Cümle)
              </span>
              <span className="text-xs text-stone-400">
                {targetText.trim().split(/\s+/).filter(Boolean).length} kelime
              </span>
            </div>

            {activePreset === "custom" ? (
              <textarea
                id="textarea-custom-text"
                rows={5}
                value={targetText}
                onChange={(e) => onTargetTextChange(e.target.value)}
                placeholder="Okumak ve telaffuzunuzu değerlendirmek istediğiniz metni buraya yazın..."
                className="w-full text-sm sm:text-base text-stone-900 focus:outline-none resize-none placeholder:text-stone-400 leading-relaxed font-normal"
                disabled={isLoading}
              />
            ) : (
              <p className="text-base sm:text-lg text-stone-900 font-serif leading-relaxed">
                "{targetText}"
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-4">
            <button
              type="button"
              onClick={handleListenTarget}
              disabled={isPlayingTarget || !targetText.trim()}
              className="inline-flex items-center gap-1.5 text-xs text-[#c2410c] hover:text-orange-800 font-semibold transition cursor-pointer disabled:opacity-50"
              title="Metnin orijinal telaffuzunu dinle"
            >
              <Volume2 className="w-4 h-4 text-[#c2410c]" />
              <span>{isPlayingTarget ? "Seslendiriliyor..." : "Orijinal Telaffuzu Dinle"}</span>
            </button>

            <span className="text-[11px] text-stone-400 font-medium">
              IPA Fonetik & Duraklama Analizi
            </span>
          </div>
        </div>

        {/* Right Card: Record & Upload Studio */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`md:col-span-6 bg-white border rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between min-h-[260px] transition-all ${
            isDragOver
              ? "border-[#c2410c] bg-orange-50/20"
              : "border-stone-200/90"
          }`}
        >
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-3">
              Ses Kaydı & Giriş
            </span>

            <div className="grid grid-cols-2 gap-4 py-2">
              {/* Mic action */}
              <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                <button
                  id="btn-record-mic"
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-xs cursor-pointer mb-2 ${
                    isRecording
                      ? "bg-rose-600 text-white animate-pulse ring-4 ring-rose-200"
                      : "bg-[#18181b] hover:bg-stone-800 text-white"
                  }`}
                  title={isRecording ? "Kaydı Bitir" : "Mikrofonla Kaydet"}
                >
                  {isRecording ? (
                    <Square className="w-4 h-4 fill-white text-white" />
                  ) : (
                    <Mic className="w-5 h-5 text-amber-300" />
                  )}
                </button>

                <span className="text-xs font-bold text-stone-900 leading-tight">
                  {isRecording ? (
                    <span className="text-rose-600 font-mono">
                      {formatDuration(recordDuration)} / 10:00
                    </span>
                  ) : (
                    "Mikrofonla Kaydet"
                  )}
                </span>
                <span className="text-[10px] text-stone-400 mt-0.5">
                  2 dk. kesintisiz kayıt
                </span>
              </div>

              {/* Upload action */}
              <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a,.webm,.ogg"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="w-12 h-12 rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-200/80 flex items-center justify-center transition-all active:scale-95 shadow-2xs cursor-pointer mb-2"
                  title="Ses Dosyası Seç"
                >
                  <Upload className="w-5 h-5 text-stone-600" />
                </button>

                <span className="text-xs font-bold text-stone-900 leading-tight">
                  Dosya Yükle
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[10px] text-[#c2410c] hover:underline font-semibold mt-0.5 cursor-pointer"
                >
                  Göz atın veya bırakın
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
            <span>Desteklenen: WAV, MP3, M4A, WEBM</span>
            {hasAudio && (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Ses hazır
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Trigger Analysis Banner */}
      {hasAudio && !isLoading && (
        <div className="bg-[#fbfbf9] border border-stone-200/90 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-stone-900">
                Ses kaydınız analize hazır!
              </h5>
              <p className="text-[11px] text-stone-500">
                Azure kalitesinde fonem, kelime ve duraklama analizi çalıştırılacaktır.
              </p>
            </div>
          </div>

          <button
            id="btn-trigger-analyze"
            type="button"
            onClick={onAnalyze}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#c2410c] hover:bg-orange-700 active:scale-95 text-white text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer inline-flex items-center justify-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Telaffuzu Değerlendir & Analiz Et</span>
          </button>
        </div>
      )}
    </div>
  );
};
