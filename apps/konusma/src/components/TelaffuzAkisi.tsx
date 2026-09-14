/**
 * TELAFFUZ ALIŞTIRMASI
 *
 * Akış: metni seç -> sesli oku -> değerlendirme.
 *
 * EKRANLAR AI STUDIO SÜRÜMÜNDEN OLDUĞU GİBİ TAŞINDI (components/telaffuz/).
 * Önce bu deponun görsel diline çevrilmişti; sonuç istenen tasarım
 * olmadığı için özgün bileşenler taşındı. Taşımak yeniden çizmekten hem
 * hızlı hem birebir: o proje özel bir tema kullanmıyor, hepsi standart
 * Tailwind sınıfı, yani bu depoda da aynı görünüyorlar.
 *
 * BU DOSYA KABUK: taşınan ekranları bu uygulamanın gerçekleriyle
 * birleştiriyor — rıza kapısı, sunucu ucu, kayıt deposu ve bulut
 * düştüğünde devreye giren yerel çözümleme. Taşınan bileşenlerin
 * içine dokunulmadı.
 *
 * BU SAYFANIN BETİMLEMEDEN AYRILDIĞI YER: ses sunucuya gidiyor. Betimleme
 * tarafında kayıt tarayıcıda Whisper'a veriliyor ve cihazdan hiç çıkmıyor;
 * burada çıkmak zorunda, çünkü ölçülen şey FONEM ve Whisper bir sesletim
 * modeli değil (bkz. shared/ses/konusmaCozumleme.ts'teki "ölçülemez" notu).
 *
 * BU YÜZDEN RIZA KAPISI VAR ve kapı bir kez açılıyor:
 *   · İlk kullanımda kayıt ekranı KAPALI; ne olduğu yazıyor ve kullanıcı
 *     açıkça kabul ediyor.
 *   · Kabul edildikten sonra her seferinde tekrar sorulmuyor — aynı şeyi
 *     her gün onaylatmak rızayı bilgi olmaktan çıkarıp tıklanacak bir
 *     engele çevirir. Yerine kalıcı ve görünür tek satır duruyor, ve
 *     kararı geri almak tek tık.
 *   · Karar bu tarayıcıda tutuluyor (localStorage), sunucuya yazılmıyor.
 */

import React, { useState } from 'react';
import { Loader2, AlertTriangle, RotateCcw, ShieldAlert, Check } from 'lucide-react';
import { ReadingTab } from './telaffuz/ReadingTab';
import { VisualAssessmentResult } from './telaffuz/VisualAssessmentResult';
import { YerelTelaffuzSonucu } from './YerelTelaffuzSonucu';
import { telaffuzDegerlendir } from '../lib/api';
import { telaffuzYaz } from '../lib/telaffuzDeposu';
import { yeniKimlik } from '../lib/betimlemeDeposu';
import { logActivity } from '../../../../shared/analytics/activityLog';
import { kaydiCozumle, type KayitAnalizi } from '../../../../shared/ses/konusmaCozumleme';

const IZIN_ANAHTARI = 'konusma_telaffuz_ses_izni_v1';

function izinOku(): boolean {
  try {
    return localStorage.getItem(IZIN_ANAHTARI) === '1';
  } catch {
    return false;
  }
}

/** Blob -> base64 (ön eksiz). */
function base64Yap(blob: Blob): Promise<string> {
  return new Promise((coz, hata) => {
    const okuyucu = new FileReader();
    okuyucu.onload = () => {
      const s = String(okuyucu.result);
      coz(s.includes(',') ? s.split(',')[1] : s);
    };
    okuyucu.onerror = () => hata(new Error('Kayıt okunamadı.'));
    okuyucu.readAsDataURL(blob);
  });
}

interface Props {
  onKaydedildi: () => void;
}

export const TelaffuzAkisi: React.FC<Props> = ({ onKaydedildi }) => {
  const [izin, setIzin] = useState(izinOku);

  const [hedefMetin, setHedefMetin] = useState(
    'We had a great time taking a long walk outside in the morning.'
  );
  const [dil, setDil] = useState('İngilizce (Birleşik Devletler - US)');

  /* Kayıt oturum boyunca bellekte: raporu okurken tekrar dinlemek ve
     kelime kesitlerini çalmak için gerekiyor. Hiçbir yere yazılmıyor. */
  const [sesBlob, setSesBlob] = useState<Blob | null>(null);
  const [sesUrl, setSesUrl] = useState<string | null>(null);

  const [mesgul, setMesgul] = useState(false);
  const [yerelMesgul, setYerelMesgul] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [rapor, setRapor] = useState<string | null>(null);
  const [yerel, setYerel] = useState<{ analiz: KayitAnalizi; sebep: string } | null>(null);

  const izniAyarla = (deger: boolean) => {
    setIzin(deger);
    try {
      if (deger) localStorage.setItem(IZIN_ANAHTARI, '1');
      else localStorage.removeItem(IZIN_ANAHTARI);
    } catch {
      /* depo kapalıysa karar yalnızca bu oturum boyunca geçerli olur */
    }
  };

  const sesiAl = (blob: Blob, url: string) => {
    setHata(null);
    setSesBlob(blob);
    setSesUrl((onceki) => {
      if (onceki && onceki !== url) URL.revokeObjectURL(onceki);
      return url;
    });
  };

  const degerlendir = async () => {
    if (!sesBlob) {
      setHata('Önce kayıt al ya da bir ses dosyası yükle.');
      return;
    }
    if (!hedefMetin.trim()) {
      setHata('Önce okunacak bir metin gir.');
      return;
    }

    setHata(null);
    setMesgul(true);
    try {
      const sesVerisi = await base64Yap(sesBlob);
      const yanit = await telaffuzDegerlendir({
        hedefMetin: hedefMetin.trim(),
        sesVerisi,
        sesTuru: sesBlob.type || 'audio/webm',
        aksan: dil,
      });

      setRapor(yanit.rapor);
      await telaffuzYaz({
        id: yeniKimlik(),
        olusturuldu: Date.now(),
        hedefMetin: hedefMetin.trim(),
        aksan: dil,
        rapor: yanit.rapor,
        model: yanit.model,
      });
      void logActivity({ app: 'konusma', skill: 'speaking', kind: 'recording' });
      onKaydedildi();
    } catch (err: any) {
      /* BULUT DÜŞTÜ — HİÇBİR ŞEY GÖSTERMEMEK YERİNE YEREL ÇÖZÜMLEME.
         Kullanıcı okudu; karşılığında boş bir hata mesajı almak en
         kötüsü. Whisper tarayıcıda zaten var ve hedef cümleyle hizalama
         yapabiliyor (gölgeleme katmanının motoru). Fonem ve tonlama
         ölçülemiyor, ekran bunu açıkça söylüyor. */
      const sebep = err?.message || 'Telaffuz değerlendirilemedi.';
      setMesgul(false);
      setYerelMesgul(true);
      try {
        const analiz = await kaydiCozumle(yeniKimlik(), sesBlob, hedefMetin.trim());
        setYerel({ analiz, sebep });
        void logActivity({ app: 'konusma', skill: 'speaking', kind: 'recording' });
      } catch (yerelHata: any) {
        /* İkisi de olmadıysa ikisini de söyle: yalnızca sonuncuyu
           göstermek "neden olmadı" sorusunu cevapsız bırakır. */
        setHata(
          sebep +
            ' Tarayıcıdaki yedek çözümleme de başarısız oldu: ' +
            (yerelHata?.message || 'bilinmeyen hata')
        );
      } finally {
        setYerelMesgul(false);
      }
      return;
    } finally {
      setMesgul(false);
    }
  };

  const yenidenOku = () => {
    setRapor(null);
    setYerel(null);
    setHata(null);
    setSesBlob(null);
    setSesUrl((onceki) => {
      if (onceki) URL.revokeObjectURL(onceki);
      return null;
    });
  };

  /* ---------------- SONUÇ ---------------- */
  if (rapor || yerel) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900">
            Telaffuz değerlendirmesi
          </h1>
          <button
            type="button"
            onClick={yenidenOku}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-stone-900 px-4
              py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
          >
            <RotateCcw className="h-4 w-4" />
            Tekrar oku
          </button>
        </div>

        {rapor ? (
          <VisualAssessmentResult
            markdown={rapor}
            targetText={hedefMetin}
            audioUrl={sesUrl}
            audioBlob={sesBlob}
          />
        ) : (
          yerel && <YerelTelaffuzSonucu analiz={yerel.analiz} sebep={yerel.sebep} />
        )}
      </div>
    );
  }

  /* ---------------- ALIŞTIRMA ---------------- */
  return (
    <div className="space-y-6">

      {/* HERO — AI Studio sürümündeki manifesto kartı, olduğu gibi. */}
      <section className="rounded-2xl border border-stone-200/90 bg-[#fbfbf9] p-6 shadow-xs sm:p-8">
        <h1 className="font-serif text-2xl font-bold leading-snug tracking-tight text-stone-900 sm:text-3xl">
          Sesinizi kaydedin,{' '}
          <span className="italic text-[#c2410c] sm:not-italic">
            fonetik doğrulukla akıcı konuşun.
          </span>
        </h1>

        <p className="mt-2 max-w-2xl text-xs font-normal leading-relaxed text-stone-600 sm:text-sm">
          Hedef metin ile konuşmanızı fonem, kelime, duraklama ve tonlama düzeyinde
          karşılaştırın. İki dakikaya kadar kesintisiz ses kaydı ve fonetik
          telaffuz değerlendirmesi.
        </p>

        <div className="my-5 border-t border-stone-200/80" />

        <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3 sm:gap-6">
          <div>
            <h4 className="text-sm font-bold text-stone-900">Dinle &amp; Oku</h4>
            <p className="mt-1 leading-relaxed text-stone-500">
              Doğal konuşma ritmini ve ses birleşmelerini (connected speech) dinleyin.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900">Kaydet</h4>
            <p className="mt-1 leading-relaxed text-stone-500">
              Mikrofonunuzla sesinizi kaydedin veya ses dosyası (WAV/MP3) yükleyin.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900">Geliş</h4>
            <p className="mt-1 leading-relaxed text-stone-500">
              Hatalı fonemleri, IPA sembollerini ve{' '}
              <span className="font-semibold text-[#c2410c]">akıcılık</span> puanınızı inceleyin.
            </p>
          </div>
        </div>
      </section>

      {/* RIZA KAPISI — taşınan tasarımda yok, bu uygulamaya ait.
          Ses buradan sunucuya gidiyor ve kullanıcının bunu bilmeden
          mikrofona basmaması gerekiyor. */}
      {!izin ? (
        <div className="max-w-[70ch] rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <p className="flex items-start gap-2 text-sm font-semibold text-amber-900">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            Bu alıştırmada ses kaydın cihazından çıkıyor.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-amber-900">
            Telaffuzu fonem düzeyinde değerlendirebilmek için kaydın Google
            Gemini'ye gönderilmesi gerekiyor — tarayıcıdaki model bunu
            yapamıyor, yalnızca hangi kelimeyi söylediğini duyabiliyor. Kayıt
            değerlendirme için gönderiliyor; ne bu bilgisayarda ne de bizim
            tarafımızda saklanıyor. Saklanan tek şey raporun kendisi.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-amber-900">
            <strong>Betimleme bölümü bundan etkilenmiyor</strong>; orada ses
            hâlâ cihazdan hiç çıkmıyor.
          </p>
          <button
            type="button"
            onClick={() => izniAyarla(true)}
            className="mt-4 flex cursor-pointer items-center gap-2 rounded-xl bg-stone-900
              px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800"
          >
            <Check className="h-4 w-4" />
            Anladım, göndermeyi kabul ediyorum
          </button>
        </div>
      ) : (
        <>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-stone-500">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
            Kaydın değerlendirme için Gemini'ye gönderilir, hiçbir yerde saklanmaz.
            <button
              type="button"
              onClick={() => izniAyarla(false)}
              className="cursor-pointer text-[#c2410c] underline underline-offset-2"
            >
              İzni geri al
            </button>
          </p>

          <ReadingTab
            targetText={hedefMetin}
            onTargetTextChange={setHedefMetin}
            onAudioReady={sesiAl}
            onFileSelected={(dosya, url) => sesiAl(dosya, url)}
            onAnalyze={degerlendir}
            isLoading={mesgul || yerelMesgul}
            hasAudio={!!sesBlob}
            audioUrl={sesUrl}
            selectedLanguage={dil}
            onLanguageChange={setDil}
          />
        </>
      )}

      {(mesgul || yerelMesgul) && (
        <p className="flex items-center gap-2 text-sm text-stone-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          {yerelMesgul
            ? 'Buluta ulaşılamadı; kaydın tarayıcında çözümleniyor…'
            : 'Kaydın dinleniyor ve hedef metinle karşılaştırılıyor…'}
        </p>
      )}

      {hata && (
        <p className="flex max-w-[70ch] items-start gap-2 rounded-xl border border-rose-200
          bg-rose-50 p-3 text-sm leading-relaxed text-rose-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {hata}
        </p>
      )}
    </div>
  );
};
