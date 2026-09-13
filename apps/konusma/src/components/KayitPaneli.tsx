/**
 * KAYIT PANELİ
 *
 * Mikrofonu açar, süreyi sayar, durdurulduğunda ses parçasını üst bileşene
 * verir ve KENDİ ELİNDE HİÇBİR ŞEY TUTMAZ. Blob buradan çıktıktan sonra
 * çözümlemeye gidiyor, metin alınınca bırakılıyor; ne bu bileşende ne
 * IndexedDB'de bir kopyası kalıyor.
 *
 * SÜRE SAYACI GEREKLİ, süs değil: konuşurken zaman algısı kayıyor ve iki
 * cümlede durmak bu alıştırmanın en sık hatası. Sayaç "hâlâ 12 saniyedesin"
 * diyor. Alt sınır 3 saniye — altındaki bir kayıtta çözümlenecek bir şey yok
 * ve çözümlemeye göndermek boşuna bekletir (bkz. kaydiYaziyaCevir).
 *
 * DALGA BİÇİMİ YOK. Kayıt sırasında hareketli bir ses görselleştirmesi
 * hoş dururdu ama söylediği tek şey "mikrofon açık" olurdu; onu zaten
 * yanıp sönen nokta ve sayaç söylüyor.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import {
  cozumDurumunuIzle,
  baglantiAgirMi,
  type CozumDurumu,
} from '../../../../shared/ses/konusmaCozumleme';

/** Bu süreden kısa kayıtlar çözümlemeye gönderilmiyor. */
const EN_AZ_SANIYE = 3;

interface Props {
  /* Sure GECMIYOR, bilerek: akicilik olcumu kaydin DALGA BICIMINDEN
     yapiliyor (bkz. sesiOlc) ve bastaki/sondaki sessizligi disarida
     birakiyor. Butona basmayla konusmaya baslamak arasindaki bosluk
     kullanicinin akiciligi degil; buradaki sayac yalnizca ekranda
     gosterilen sayi. */
  onKayitBitti: (blob: Blob) => void;
  /** Çözümleme sürerken yeni kayıt alınamaz. */
  kilitli: boolean;
}

function sureBicimle(sn: number): string {
  const d = Math.floor(sn / 60);
  const s = sn % 60;
  return `${d}:${String(s).padStart(2, '0')}`;
}

export const KayitPaneli: React.FC<Props> = ({ onKayitBitti, kilitli }) => {
  const [kaydediyor, setKaydediyor] = useState(false);
  const [sure, setSure] = useState(0);
  const [hata, setHata] = useState<string | null>(null);
  const [modelDurumu, setModelDurumu] = useState<CozumDurumu>('kapali');
  const [yuzde, setYuzde] = useState<number>(0);

  const kaydediciRef = useRef<MediaRecorder | null>(null);
  const parcalarRef = useRef<Blob[]>([]);
  const sayacRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const baslangicRef = useRef(0);

  useEffect(() => cozumDurumunuIzle((d, y) => {
    setModelDurumu(d);
    if (typeof y === 'number') setYuzde(y);
  }), []);

  /* Sekme kapanırken ya da bileşen kalkarken mikrofon açık kalmasın:
     tarayıcı sekmede kayıt göstergesini göstermeye devam ederdi. */
  useEffect(() => () => {
    if (sayacRef.current) clearInterval(sayacRef.current);
    kaydediciRef.current?.stream.getTracks().forEach((t) => t.stop());
  }, []);

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
          setHata(`Kayıt ${gecen} saniye sürdü. Görseli anlatmak için en az ${EN_AZ_SANIYE} saniye konuşman gerekiyor.`);
          return;
        }
        onKayitBitti(blob);
      };

      baslangicRef.current = Date.now();
      setSure(0);
      sayacRef.current = setInterval(
        () => setSure(Math.floor((Date.now() - baslangicRef.current) / 1000)),
        250
      );

      kaydedici.start();
      kaydediciRef.current = kaydedici;
      setKaydediyor(true);
    } catch (err) {
      console.warn('Mikrofon hatası:', err);
      setHata('Mikrofona erişilemedi. Tarayıcı izni verdiğinden ve sitenin HTTPS olduğundan emin ol.');
    }
  };

  const durdur = () => {
    if (sayacRef.current) { clearInterval(sayacRef.current); sayacRef.current = null; }
    kaydediciRef.current?.stop();
    kaydediciRef.current = null;
    setKaydediyor(false);
  };

  const modelIniyor = modelDurumu === 'yukleniyor';

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
            Kaydı bitir
          </button>
        ) : (
          <button
            type="button"
            onClick={basla}
            disabled={kilitli}
            className="flex items-center gap-2.5 rounded-xl bg-accent px-5 py-3
              text-[14px] font-medium text-white transition-colors
              hover:bg-accent-700 disabled:opacity-50 cursor-pointer"
          >
            {kilitli ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
            {kilitli ? 'Çözümleniyor' : 'Anlatmaya başla'}
          </button>
        )}

        {kaydediyor && (
          <span className="flex items-center gap-2.5">
            {/* Yanıp sönen nokta: mikrofonun açık olduğunu söyleyen tek
                işaret. Bu animasyon süs değil, durum bildirimi. */}
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-danger" />
            <span className="timecode text-[15px] font-semibold text-ink">
              {sureBicimle(sure)}
            </span>
            {sure < EN_AZ_SANIYE && (
              <span className="text-[12px] text-ink-3">en az {EN_AZ_SANIYE} sn</span>
            )}
          </span>
        )}
      </div>

      {/* Model indirme durumu. Kullanıcı düğmeye bastıktan sonra "hiçbir şey
          olmuyor" hissine kapılmasın: ilk çözümlemede 76 MB iniyor. */}
      {modelIniyor && (
        <p className="flex items-center gap-2 text-[12px] text-ink-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Konuşma çözümleme modeli indiriliyor{yuzde ? ` — %${yuzde}` : ''}. Bu
          yalnızca ilk seferde oluyor, sonra tarayıcıda kalıyor.
        </p>
      )}

      {!modelIniyor && baglantiAgirMi() && (
        <p className="flex items-start gap-2 text-[12px] leading-relaxed text-ink-2">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-marker" />
          Bağlantın yavaş görünüyor. İlk çözümlemede 76 MB'lık bir model
          iniyor; mobil veridesen kablosuz ağa geçmek isteyebilirsin.
        </p>
      )}

      {hata && (
        <p className="flex items-start gap-2 rounded-xl border border-danger-line
          bg-danger-soft p-3 text-[13px] leading-relaxed text-danger">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {hata}
        </p>
      )}

      <p className="flex items-start gap-2 text-[12px] leading-relaxed text-ink-3">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Ses kaydın bu bilgisayardan çıkmıyor ve hiçbir yere kaydedilmiyor:
        tarayıcıdaki model onu metne çeviriyor, kayıt hemen bırakılıyor.
        Yapay zekâya yalnızca metin ve görsel gidiyor.
      </p>
    </div>
  );
};
