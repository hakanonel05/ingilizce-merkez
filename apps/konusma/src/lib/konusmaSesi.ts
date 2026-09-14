/* SESLENDİRME — taşınan telaffuz bileşenlerinin ses yardımcıları
 * ============================================================================
 * KAYNAK: AI Studio'daki pronunciation-assessment-ai projesinin
 * utils/speech.ts dosyası. İMZALAR BİREBİR KORUNDU (speakText, stopSpeaking,
 * formatDuration) — taşınan bileşenler bunları çağırıyor ve onlara
 * dokunmamak, taşımanın hata yüzeyini en aza indiriyor.
 *
 * İÇİ DEĞİŞTİ: özgün sürüm tarayıcının `speechSynthesis` motorunu
 * kullanıyordu. Bu depoda ondan iyisi var ve gerekçesi server.ts'te yazılı:
 * speechSynthesis'in kalitesi tamamen cihaza bağlı — Windows'ta doğal,
 * başka bir bilgisayarda 2000'lerin robot sesi. Telaffuz öğreten bir
 * ekranda "doğru okunuş" diye çalınan sesin cihazdan cihaza değişmesi
 * kabul edilebilir değil: öğrenci onu örnek alıyor.
 *
 * Bu yüzden /api/speak kullanılıyor (önce ElevenLabs, düşerse Gemini TTS).
 * TARAYICI SESİ YİNE YEDEKTE: ağ yoksa, kota dolmuşsa ya da anahtar
 * yoksa speechSynthesis devreye giriyor. Yani ses her zaman var, yalnızca
 * kalitesi değişiyor.
 */

import { apiFetch } from '../../../../shared/vocab/userKeys';

/** kelime/cümle -> objectURL. Aynı kelime bir oturumda defalarca isteniyor. */
const onbellek = new Map<string, string>();

let calan: HTMLAudioElement | null = null;

/** Saniyeyi 00:00 biçimine çevirir (taşınan bileşenler bunu kullanıyor). */
export function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '00:00';
  const dk = Math.floor(seconds / 60);
  const sn = Math.floor(seconds % 60);
  return `${String(dk).padStart(2, '0')}:${String(sn).padStart(2, '0')}`;
}

export function stopSpeaking(): void {
  if (calan) {
    calan.pause();
    calan = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/** Son çare: tarayıcının kendi sesi. */
function tarayiciSesi(text: string, lang: string, rate: number): Promise<void> {
  return new Promise((coz) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return coz();
    window.speechSynthesis.cancel();
    const soyle = new SpeechSynthesisUtterance(text);
    soyle.lang = lang;
    soyle.rate = rate;
    const sesler = window.speechSynthesis.getVoices();
    const ing =
      sesler.find(
        (v) =>
          (v.lang.startsWith('en-US') || v.lang.startsWith('en-GB')) &&
          (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Siri'))
      ) || sesler.find((v) => v.lang.startsWith('en'));
    if (ing) soyle.voice = ing;
    soyle.onend = () => coz();
    soyle.onerror = () => coz();
    window.speechSynthesis.speak(soyle);
  });
}

function cal(url: string): Promise<void> {
  return new Promise((coz) => {
    stopSpeaking();
    const ses = new Audio(url);
    calan = ses;
    const bitir = () => {
      if (calan === ses) calan = null;
      coz();
    };
    ses.onended = bitir;
    ses.onerror = bitir;
    void ses.play().catch(bitir);
  });
}

/**
 * Metni seslendirir ve bitene kadar bekler.
 *
 * `lang` ve `rate` imzada duruyor çünkü taşınan bileşenler gönderiyor;
 * /api/speak yolunda okuma PROFİLİ bunların yerini alıyor — tek kelime
 * yavaş ve net, cümle akıcı okunuyor. Tarayıcı yedeğinde ikisi de
 * kullanılıyor.
 */
export async function speakText(text: string, lang = 'en-US', rate = 0.95): Promise<void> {
  const temiz = text.trim();
  if (!temiz) return;

  /* Profil uzunluğa göre: /api/speak'te "kelime" profili tek kelimeyi
     yavaşlatıyor, "cumle" profili doğal tempoda okuyor. */
  const profil = temiz.split(/\s+/).length <= 2 ? 'kelime' : 'cumle';
  const anahtar = `${profil}:${temiz.toLowerCase()}`;

  let url = onbellek.get(anahtar);
  if (!url) {
    try {
      const yanit = await apiFetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: temiz, profil }),
      });
      if (!yanit.ok) throw new Error(String(yanit.status));
      const govde = await yanit.json();
      if (!govde?.audio) throw new Error('bos yanit');

      const ikili = atob(govde.audio);
      const bayt = new Uint8Array(ikili.length);
      for (let i = 0; i < ikili.length; i++) bayt[i] = ikili.charCodeAt(i);
      url = URL.createObjectURL(new Blob([bayt], { type: govde.mimeType || 'audio/mpeg' }));
      onbellek.set(anahtar, url);
    } catch {
      /* Ağ yok, kota dolu ya da anahtar yok: ses hiç çıkmamasındansa
         cihazın kendi sesiyle çıksın. */
      return tarayiciSesi(temiz, lang, rate);
    }
  }

  return cal(url);
}
