/**
 * HİKAYE SESLENDİRME
 *
 * Bir okuma parçasını paragraf paragraf sesli okur ve o an okunan
 * paragrafı dışarıya bildirir (metinde vurgulanabilsin diye).
 *
 * İKİ SES KAYNAĞI, BİLEREK:
 *
 *   1. DOĞAL SES (varsayılan) — /api/speak, Gemini'nin TTS modeli.
 *      Her cihazda aynı ve doğal; kullanıcının zaten girdiği Gemini
 *      anahtarıyla çalışıyor, ek servis ya da ücret yok.
 *   2. CİHAZ SESİ (yedek) — window.speechSynthesis. Anında ve
 *      çevrimdışı çalışır ama kalitesi tamamen cihaza bağlı: aynı
 *      metin bir bilgisayarda doğal, başka birinde robot gibi okunur.
 *
 * Doğal ses herhangi bir sebeple gelmezse (kota bitti, anahtar yok,
 * çevrimdışı) sessizce cihaz sesine düşülür. Ses HER ZAMAN çıkar,
 * yalnızca kalitesi değişir; kullanıcı hangisinin çaldığını görür.
 *
 * ÖN YÜKLEME: bir paragraf çalarken bir sonrakinin sesi arka planda
 * indirilir. Paragraf araları böylece sessiz kalmıyor — tek istekle
 * tüm hikayeyi seslendirmek ise Netlify'ın 26 saniyelik fonksiyon
 * sınırını aşardı.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { apiFetch } from '../../../../shared/vocab/userKeys';

export type NarrationVoice = 'Kore' | 'Puck' | 'Charon' | 'Aoede' | 'Leda' | 'Orus';

export const NARRATION_VOICES: { id: NarrationVoice; label: string }[] = [
  { id: 'Kore', label: 'Kore — sakin kadın' },
  { id: 'Puck', label: 'Puck — canlı erkek' },
  { id: 'Charon', label: 'Charon — derin erkek' },
  { id: 'Aoede', label: 'Aoede — yumuşak kadın' },
  { id: 'Leda', label: 'Leda — genç kadın' },
  { id: 'Orus', label: 'Orus — sıcak erkek' },
];

export type NarrationStatus = 'idle' | 'loading' | 'playing' | 'paused';
/** Sesi kimin ürettiği: doğal (Gemini) ya da cihazın kendi sesi. */
export type NarrationSource = 'natural' | 'device';

const VOICE_PREF_KEY = 'reading_narration_voice_v1';
const SPEED_PREF_KEY = 'reading_narration_speed_v1';

/* =====================================================================
   CİHAZ SESİ: EN İYİ SESİ SEÇME

   speechSynthesis varsayılan sesi genelde sistemin en eski, en robot
   sesidir. Modern tarayıcılarda çok daha iyileri kurulu olduğu halde
   seçilmezler. Bu yüzden adlarına bakarak sıralıyoruz:

   - "Natural" / "Online" → Microsoft'un sinir ağı sesleri (Edge,
     Windows 11). İnsan sesinden ayırt etmesi zor.
   - "Google" → Chrome ve Android'in sesleri; iyi.
   - Apple'ın "Samantha", "Daniel" gibi gelişmiş sesleri.
   Geri kalanlar ancak hiçbiri yoksa kullanılır.
   ===================================================================== */

function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase();
  let score = 0;

  if (/natural|neural/.test(name)) score += 100;
  if (/online/.test(name)) score += 60;
  if (/google/.test(name)) score += 50;
  if (/samantha|daniel|karen|moira|serena|aaron|nicky/.test(name)) score += 40;
  if (/premium|enhanced/.test(name)) score += 35;

  // Anadili İngilizce olan sesler; en-US ve en-GB önce.
  if (/^en[-_]us/i.test(v.lang)) score += 20;
  else if (/^en[-_]gb/i.test(v.lang)) score += 18;
  else if (/^en/i.test(v.lang)) score += 10;
  else score -= 100; // İngilizce olmayan ses hikayeyi okuyamaz

  // "Microsoft David/Zira Desktop" gibi eski SAPI sesleri en sonda.
  if (/desktop/.test(name)) score -= 30;

  if (v.localService) score += 2; // eşitlikte çevrimdışı çalışanı seç

  return score;
}

/** Cihazda kurulu en iyi İngilizce sesi döndürür (yoksa null). */
export function pickBestDeviceVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const english = voices.filter(v => /^en/i.test(v.lang));
  const pool = english.length ? english : voices;

  return pool.reduce((best, v) => (scoreVoice(v) > scoreVoice(best) ? v : best), pool[0]);
}

/**
 * Ses listesi Chrome'da eşzamansız dolar: ilk getVoices() çağrısı boş
 * dizi döndürür ve voiceschanged olayı beklenir. Beklemezsek her zaman
 * varsayılan (robot) sesle okuruz.
 */
export function warmUpDeviceVoices(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.getVoices();
}

/* =====================================================================
   SES ÖNBELLEĞİ

   Aynı paragrafı ikinci kez dinlemek (geri sarmak, duraklatıp devam
   etmek) yeni bir istek üretmesin diye üretilen sesler parça
   kimliğine göre bellekte tutuluyor. Sayfa yenilenince silinir; ses
   dosyalarını kalıcı saklamak birkaç megabaytlık bir depolama
   yükü getirir ve buna değmiyor.
   ===================================================================== */

const audioCache = new Map<string, string>();

function cacheKey(passageId: number, index: number, voice: string): string {
  return `${passageId}|${index}|${voice}`;
}

/** Bir paragrafın sesini üretir ve çalınabilir bir blob adresi döndürür. */
async function fetchParagraphAudio(
  passageId: number,
  index: number,
  text: string,
  voice: NarrationVoice,
  signal: AbortSignal
): Promise<string> {
  const key = cacheKey(passageId, index, voice);
  const cached = audioCache.get(key);
  if (cached) return cached;

  const res = await apiFetch('/api/speak', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice }),
    signal,
  });

  const raw = await res.text();
  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error('Sunucu beklenmeyen bir yanıt döndürdü.');
  }
  if (!res.ok) throw new Error(data?.error || 'Ses üretilemedi.');
  if (!data?.audio) throw new Error('Ses verisi boş geldi.');

  // base64 -> Blob: <audio src="data:..."> uzun metinlerde adres
  // uzunluğu sınırlarına takılıyor, blob URL'i takılmıyor.
  const bytes = Uint8Array.from(atob(data.audio), c => c.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: data.mimeType || 'audio/wav' }));

  audioCache.set(key, url);
  return url;
}

export interface Narration {
  status: NarrationStatus;
  /** O an okunan paragrafın sırası; hiçbiri okunmuyorsa null. */
  currentIndex: number | null;
  source: NarrationSource;
  voice: NarrationVoice;
  speed: number;
  error: string | null;
  /** Doğal ses alınamadığında bir kez gösterilen açıklama. */
  notice: string | null;
  play: (fromIndex?: number) => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  setVoice: (voice: NarrationVoice) => void;
  setSpeed: (speed: number) => void;
  available: boolean;
}

/**
 * @param passageId  Ses önbelleğini parçaya bağlamak için.
 * @param paragraphs Sırayla okunacak paragraflar.
 */
export function useNarration(passageId: number, paragraphs: string[]): Narration {
  const [status, setStatus] = useState<NarrationStatus>('idle');
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [source, setSource] = useState<NarrationSource>('natural');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [voice, setVoiceState] = useState<NarrationVoice>(() => {
    const saved = localStorage.getItem(VOICE_PREF_KEY) as NarrationVoice | null;
    return saved && NARRATION_VOICES.some(v => v.id === saved) ? saved : 'Kore';
  });
  const [speed, setSpeedState] = useState<number>(() => {
    const saved = parseFloat(localStorage.getItem(SPEED_PREF_KEY) || '');
    return Number.isFinite(saved) && saved >= 0.5 && saved <= 2 ? saved : 1;
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  /** Doğal ses bir kez başarısız olduysa her paragrafta yeniden denemeyiz. */
  const naturalFailedRef = useRef(false);
  /** Kullanıcı durdurduktan sonra geciken bir isteğin sesi çalmasın. */
  const runIdRef = useRef(0);

  const paragraphsRef = useRef(paragraphs);
  paragraphsRef.current = paragraphs;

  /**
   * playFrom kendi kendini cagiriyor (bir paragraf bitince sonraki).
   * Fonksiyonun kendisine dogrudan referans vermek eskimis bir kapanis
   * birakirdi; ref her zaman en guncel surumu tutuyor. Tanimdan once
   * kullanildigi icin burada, bos bir islevle baslatiliyor.
   */
  const playFromRef = useRef<(index: number) => void>(() => {});

  const setVoice = useCallback((v: NarrationVoice) => {
    setVoiceState(v);
    localStorage.setItem(VOICE_PREF_KEY, v);
  }, []);

  const setSpeed = useCallback((s: number) => {
    setSpeedState(s);
    localStorage.setItem(SPEED_PREF_KEY, String(s));
    if (audioRef.current) audioRef.current.playbackRate = s;
  }, []);

  /** Çalan her şeyi susturur; hem <audio> hem cihaz sesi. */
  const hardStop = useCallback(() => {
    runIdRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  /* --- Cihaz sesiyle okuma (yedek yol) --- */
  const speakWithDevice = useCallback(
    (index: number, runId: number) => {
      if (!('speechSynthesis' in window)) {
        setError('Bu tarayıcı sesli okumayı desteklemiyor.');
        setStatus('idle');
        return;
      }

      const text = paragraphsRef.current[index];
      if (!text) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const best = pickBestDeviceVoice();
      if (best) {
        utterance.voice = best;
        utterance.lang = best.lang;
      } else {
        utterance.lang = 'en-US';
      }
      utterance.rate = speed;

      utterance.onend = () => {
        if (runId !== runIdRef.current) return;
        playFromRef.current(index + 1);
      };
      utterance.onerror = () => {
        if (runId !== runIdRef.current) return;
        setStatus('idle');
        setCurrentIndex(null);
      };

      setSource('device');
      setStatus('playing');
      setCurrentIndex(index);
      window.speechSynthesis.speak(utterance);
    },
    [speed]
  );

  /* --- Asıl akış --- */
  const playFrom = useCallback(
    async (index: number) => {
      const list = paragraphsRef.current;

      if (index >= list.length) {
        // Hikaye bitti.
        setStatus('idle');
        setCurrentIndex(null);
        return;
      }

      hardStop();
      const runId = runIdRef.current;
      setError(null);

      if (naturalFailedRef.current) {
        speakWithDevice(index, runId);
        return;
      }

      setStatus('loading');
      setCurrentIndex(index);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const url = await fetchParagraphAudio(passageId, index, list[index], voice, controller.signal);
        if (runId !== runIdRef.current) return;

        const audio = new Audio(url);
        audio.playbackRate = speed;
        audioRef.current = audio;

        audio.onended = () => {
          if (runId !== runIdRef.current) return;
          playFromRef.current(index + 1);
        };
        audio.onerror = () => {
          if (runId !== runIdRef.current) return;
          setError('Ses çalınamadı.');
          setStatus('idle');
        };

        await audio.play();
        if (runId !== runIdRef.current) return;
        setSource('natural');
        setStatus('playing');

        // Sıradaki paragrafı arkadan indir: paragraf arası sessiz kalmasın.
        const nextIndex = index + 1;
        if (nextIndex < list.length) {
          void fetchParagraphAudio(
            passageId,
            nextIndex,
            list[nextIndex],
            voice,
            new AbortController().signal
          ).catch(() => {
            /* ön yükleme başarısızsa sırası gelince tekrar denenir */
          });
        }
      } catch (err: any) {
        if (controller.signal.aborted || runId !== runIdRef.current) return;

        // Doğal ses alınamadı: bir daha denemeden cihaz sesine geç.
        naturalFailedRef.current = true;
        setNotice(
          'Doğal ses kullanılamadı (' +
            (err?.message || 'bilinmeyen hata') +
            '). Cihazının kendi sesiyle okunuyor.'
        );
        speakWithDevice(index, runIdRef.current);
      }
    },
    [hardStop, passageId, speakWithDevice, speed, voice]
  );

  playFromRef.current = playFrom;

  const play = useCallback(
    (fromIndex?: number) => {
      // Duraklatılmışsa kaldığı yerden devam.
      if (status === 'paused') {
        if (audioRef.current) {
          void audioRef.current.play();
          setStatus('playing');
          return;
        }
        if ('speechSynthesis' in window && window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          setStatus('playing');
          return;
        }
      }
      void playFromRef.current(fromIndex ?? currentIndex ?? 0);
    },
    [currentIndex, status]
  );

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setStatus('paused');
      return;
    }
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setStatus('paused');
    }
  }, []);

  const stop = useCallback(() => {
    hardStop();
    setStatus('idle');
    setCurrentIndex(null);
  }, [hardStop]);

  const next = useCallback(() => {
    void playFromRef.current((currentIndex ?? 0) + 1);
  }, [currentIndex]);

  const previous = useCallback(() => {
    void playFromRef.current(Math.max(0, (currentIndex ?? 0) - 1));
  }, [currentIndex]);

  // Ses seçilince önbellek anahtarı da değiştiği için yeniden üretilir;
  // çalan sesi durdurup kullanıcının yeni sesle başlamasını bekliyoruz.
  useEffect(() => {
    hardStop();
    setStatus('idle');
    setCurrentIndex(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voice, passageId]);

  // Parçadan çıkılınca ses arkada çalmaya devam etmesin.
  useEffect(() => () => hardStop(), [hardStop]);

  // Chrome'un ses listesi geç dolduğu için erkenden tetikliyoruz.
  useEffect(() => {
    warmUpDeviceVoices();
    if ('speechSynthesis' in window) {
      const handler = () => warmUpDeviceVoices();
      window.speechSynthesis.addEventListener?.('voiceschanged', handler);
      return () => window.speechSynthesis.removeEventListener?.('voiceschanged', handler);
    }
  }, []);

  return {
    status,
    currentIndex,
    source,
    voice,
    speed,
    error,
    notice,
    play,
    pause,
    stop,
    next,
    previous,
    setVoice,
    setSpeed,
    available: paragraphs.length > 0,
  };
}
