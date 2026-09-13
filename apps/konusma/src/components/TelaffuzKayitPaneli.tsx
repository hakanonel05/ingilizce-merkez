/**
 * TELAFFUZ İÇİN KAYIT PANELİ
 *
 * Betimlemedeki KayitPaneli'nden AYRI bir dosya, ve bu bilerek. İkisi
 * birbirine benziyor ama iki temel farkı var ve ikisi de kullanıcıya
 * söylenen sözü değiştiriyor:
 *
 *   1. BURADA SES SUNUCUYA GİDİYOR. Betimlemede gitmiyor. Tek bir bileşene
 *      "bazen gider bazen gitmez" dedirtmek, o cümleyi ikisinde de
 *      güvenilmez yapardı.
 *   2. SÜRE SINIRI VAR. Netlify'da istek gövdesi 6 MB; webm/opus dakikada
 *      ~500 KB, base64'e çevrilince ~680 KB. İki dakika hem sınırın
 *      altında kalıyor hem bir paragrafı okumaya fazlasıyla yetiyor.
 *      Kayıt sınırda kendiliğinden duruyor — kullanıcıyı "gönderilemedi"
 *      hatasıyla karşılamaktansa, dolmadan kesmek dürüst olan.
 *
 * DOSYA YÜKLEME DE VAR: telefonla ya da başka bir programla alınmış bir
 * kaydı değerlendirmek isteyen olabiliyor (AI Studio sürümünde de vardı).
 */

import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Upload, Loader2, AlertTriangle } from 'lucide-react';

/** Netlify gövde sınırı için seçildi; yukarıdaki nota bakın. */
const EN_UZUN_SANIYE = 120;
const EN_AZ_SANIYE = 1;

interface Props {
  onKayitBitti: (blob: Blob) => void;
  kilitli: boolean;
  /** Rıza verilmeden mikrofon ve yükleme açılmıyor. */
  izinVerildi: boolean;
}

function sureBicimle(sn: number): string {
  return `${Math.floor(sn / 60)}:${String(sn % 60).padStart(2, '0')}`;
}

export const TelaffuzKayitPaneli: React.FC<Props> = ({ onKayitBitti, kilitli, izinVerildi }) => {
  const [kaydediyor, setKaydediyor] = useState(false);
  const [sure, setSure] = useState(0);
  const [hata, setHata] = useState<string | null>(null);

  const kaydediciRef = useRef<MediaRecorder | null>(null);
  const parcalarRef = useRef<Blob[]>([]);
  const sayacRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const baslangicRef = useRef(0);
  const dosyaRef = useRef<HTMLInputElement>(null);

  const temizle = () => {
    if (sayacRef.current) { clearInterval(sayacRef.current); sayacRef.current = null; }
  };

  useEffect(() => () => {
    temizle();
    kaydediciRef.current?.stream.getTracks().forEach((t) => t.stop());
  }, []);

  const durdur = () => {
    temizle();
    kaydediciRef.current?.stop();
    kaydediciRef.current = null;
    setKaydediyor(false);
  };

  const basla = async () => {
    setHata(null);
    try {
      const akis = await navigator.mediaDevices.getUserMedia({ audio: true });
      const kaydedici = new MediaRecorder(akis);
      parcalarRef.current = [];

      kaydedici.ondataavailable = (e) => {
        if (e.data.size > 0) parcalarRef.current.push(e.data);
      };
      kaydedici.onstop = () => {
        const blob = new Blob(parcalarRef.current, { type: 'audio/webm' });
        parcalarRef.current = [];
        akis.getTracks().forEach((t) => t.stop());
        const gecen = Math.round((Date.now() - baslangicRef.current) / 1000);
        if (gecen < EN_AZ_SANIYE) {
          setHata('Kayıt çok kısa.');
          return;
        }
        onKayitBitti(blob);
      };

      baslangicRef.current = Date.now();
      setSure(0);
      sayacRef.current = setInterval(() => {
        const gecen = Math.floor((Date.now() - baslangicRef.current) / 1000);
        setSure(gecen);
        /* Sınırda KENDİLİĞİNDEN duruyor. Kullanıcı okumaya dalıp sınırı
           aşarsa kaydı çöpe atmak yerine sınıra kadarını değerlendirmek
           daha iyi — okuduğu metin zaten kısa. */
        if (gecen >= EN_UZUN_SANIYE) durdur();
      }, 250);

      kaydedici.start();
      kaydediciRef.current = kaydedici;
      setKaydediyor(true);
    } catch (err) {
      console.warn('Mikrofon hatası:', err);
      setHata('Mikrofona erişilemedi. Tarayıcı izni verdiğinden ve sitenin HTTPS olduğundan emin ol.');
    }
  };

  const kalan = EN_UZUN_SANIYE - sure;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        {kaydediyor ? (
          <button
            type="button"
            onClick={durdur}
            className="flex items-center gap-2.5 rounded-xl bg-danger px-5 py-3
              text-[14px] font-medium text-white transition-colors
              hover:bg-danger-strong cursor-pointer"
          >
            <Square className="h-4 w-4 fill-current" />
            Okumayı bitir
          </button>
        ) : (
          <button
            type="button"
            onClick={basla}
            disabled={kilitli || !izinVerildi}
            className="flex items-center gap-2.5 rounded-xl bg-accent px-5 py-3
              text-[14px] font-medium text-white transition-colors
              hover:bg-accent-700 disabled:opacity-50 cursor-pointer"
          >
            {kilitli ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
            {kilitli ? 'Değerlendiriliyor' : 'Okumaya başla'}
          </button>
        )}

        <input
          ref={dosyaRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => {
            const dosya = e.target.files?.[0];
            e.target.value = '';
            if (!dosya) return;
            setHata(null);
            onKayitBitti(dosya);
          }}
        />
        <button
          type="button"
          onClick={() => dosyaRef.current?.click()}
          disabled={kilitli || !izinVerildi || kaydediyor}
          className="flex items-center gap-2 rounded-xl border border-hairline bg-paper-2
            px-4 py-3 text-[13px] font-medium text-ink-2 transition-colors
            hover:bg-paper-3 hover:text-ink disabled:opacity-50 cursor-pointer"
        >
          <Upload className="h-4 w-4 text-ink-3" />
          Ses dosyası yükle
        </button>

        {kaydediyor && (
          <span className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-danger" />
            <span className="timecode text-[15px] font-semibold text-ink">
              {sureBicimle(sure)}
            </span>
            {kalan <= 20 && (
              <span className="text-[12px] text-marker-ink">{kalan} sn kaldı</span>
            )}
          </span>
        )}
      </div>

      {hata && (
        <p className="flex items-start gap-2 rounded-xl border border-danger-line
          bg-danger-soft p-3 text-[13px] leading-relaxed text-danger">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {hata}
        </p>
      )}

      <p className="text-[11px] leading-relaxed text-ink-3">
        En fazla {EN_UZUN_SANIYE / 60} dakika; sınıra gelince kayıt kendiliğinden
        durur. WAV, MP3, M4A ve WEBM dosyaları da yüklenebilir.
      </p>
    </div>
  );
};
