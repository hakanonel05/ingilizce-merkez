/**
 * TELAFFUZ ALIŞTIRMASI
 *
 * Akış: metni seç -> sesli oku -> değerlendirme.
 *
 * BU SAYFANIN BETİMLEMEDEN AYRILDIĞI YER: ses sunucuya gidiyor. Betimleme
 * tarafında kayıt tarayıcıda Whisper'a veriliyor ve cihazdan hiç çıkmıyor;
 * burada çıkmak zorunda, çünkü ölçülen şey FONEM ve Whisper bir sesletim
 * modeli değil (bkz. shared/ses/konusmaCozumleme.ts'teki "ölçülemez" notu).
 *
 * BU YÜZDEN RIZA KAPISI VAR ve kapı bir kez açılıyor:
 *   · İlk kullanımda mikrofon ve yükleme KAPALI; ne olduğu yazıyor ve
 *     kullanıcı açıkça kabul ediyor.
 *   · Kabul edildikten sonra her seferinde tekrar sorulmuyor — aynı şeyi
 *     her gün onaylatmak rızayı bilgi olmaktan çıkarıp tıklanacak bir
 *     engele çevirir. Yerine kalıcı ve görünür tek satır duruyor, ve
 *     kararı geri almak tek tık.
 *   · Karar bu tarayıcıda tutuluyor (localStorage), sunucuya yazılmıyor.
 */

import React, { useState } from 'react';
import { Loader2, AlertTriangle, RotateCcw, ShieldAlert, Check, Volume2 } from 'lucide-react';
import { apiFetch } from '../../../../shared/vocab/userKeys';
import { TelaffuzKayitPaneli } from './TelaffuzKayitPaneli';
import { TelaffuzSonucu } from './TelaffuzSonucu';
import { YerelTelaffuzSonucu } from './YerelTelaffuzSonucu';
import { telaffuzDegerlendir } from '../lib/api';
import { telaffuzYaz } from '../lib/telaffuzDeposu';
import { yeniKimlik } from '../lib/betimlemeDeposu';
import { TELAFFUZ_METINLERI, type TelaffuzMetni } from '../data/telaffuzMetinleri';
import { logActivity } from '../../../../shared/analytics/activityLog';
import { kaydiCozumle, type KayitAnalizi } from '../../../../shared/ses/konusmaCozumleme';

const IZIN_ANAHTARI = 'konusma_telaffuz_ses_izni_v1';

const AKSANLAR = [
  'İngilizce (Birleşik Devletler en-US)',
  'İngilizce (Birleşik Krallık en-GB)',
];

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
  const [secili, setSecili] = useState<TelaffuzMetni | null>(TELAFFUZ_METINLERI[0] ?? null);
  const [kendiMetni, setKendiMetni] = useState('');
  const [kendiModu, setKendiModu] = useState(false);
  const [aksan, setAksan] = useState(AKSANLAR[0]);

  const [mesgul, setMesgul] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [rapor, setRapor] = useState<string | null>(null);
  const [sesUrl, setSesUrl] = useState<string | null>(null);
  /* Buluta ulaşılamadığında tarayıcıda üretilen kelime düzeyi çözümleme. */
  const [yerel, setYerel] = useState<{ analiz: KayitAnalizi; sebep: string } | null>(null);
  /* Hedef metni ÖNCE dinlemek alıştırmanın parçası: doğru ritmi duymadan
     okumak, hatayı tekrar etmekten başka bir şey vermiyor. */
  const [ornekCaliyor, setOrnekCaliyor] = useState(false);
  const [yerelMesgul, setYerelMesgul] = useState(false);

  const hedefMetin = (kendiModu ? kendiMetni : secili?.text || '').trim();
  const kelimeSayisi = hedefMetin ? hedefMetin.split(/\s+/).filter(Boolean).length : 0;

  const izniAyarla = (deger: boolean) => {
    setIzin(deger);
    try {
      if (deger) localStorage.setItem(IZIN_ANAHTARI, '1');
      else localStorage.removeItem(IZIN_ANAHTARI);
    } catch {
      /* depo kapalıysa karar yalnızca bu oturum boyunca geçerli olur */
    }
  };

  const degerlendir = async (blob: Blob) => {
    if (!hedefMetin) {
      setHata('Önce okunacak bir metin seç.');
      return;
    }
    setHata(null);
    setMesgul(true);
    try {
      const sesVerisi = await base64Yap(blob);
      const yanit = await telaffuzDegerlendir({
        hedefMetin,
        sesVerisi,
        sesTuru: blob.type || 'audio/webm',
        aksan,
      });

      /* Kaydı oturum boyunca dinlenebilir tutuyoruz — raporu okurken
         "ben bunu nasıl söylemiştim" sorusunun cevabı lazım. Sayfadan
         çıkınca URL serbest bırakılıyor, hiçbir yere yazılmıyor. */
      setSesUrl((onceki) => {
        if (onceki) URL.revokeObjectURL(onceki);
        return URL.createObjectURL(blob);
      });
      setRapor(yanit.rapor);

      await telaffuzYaz({
        id: yeniKimlik(),
        olusturuldu: Date.now(),
        hedefMetin,
        baslik: kendiModu ? undefined : secili?.title,
        aksan,
        rapor: yanit.rapor,
        model: yanit.model,
      });
      void logActivity({ app: 'konusma', skill: 'speaking', kind: 'recording' });
      onKaydedildi();
    } catch (err: any) {
      /* BULUT DÜŞTÜ — HİÇBİR ŞEY GÖSTERMEMEK YERİNE YEREL ÇÖZÜMLEME.
         Kullanıcı okudu, kaydı gitti; karşılığında boş bir hata mesajı
         almak en kötüsü. Whisper tarayıcıda zaten var ve hedef cümleyle
         hizalama yapabiliyor (gölgeleme katmanının motoru). Fonem ve
         tonlama ölçülemiyor, ekran bunu açıkça söylüyor. */
      const sebep = err?.message || 'Telaffuz değerlendirilemedi.';
      setMesgul(false);
      setYerelMesgul(true);
      try {
        const analiz = await kaydiCozumle(yeniKimlik(), blob, hedefMetin);
        setSesUrl((onceki) => {
          if (onceki) URL.revokeObjectURL(onceki);
          return URL.createObjectURL(blob);
        });
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

  const ornegiCal = async () => {
    if (!hedefMetin || ornekCaliyor) return;
    setOrnekCaliyor(true);
    try {
      const yanit = await apiFetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        /* "cumle" profili: tek kelimeden uzun ama hikaye temposundan
           yavaş — okunacak metni model gibi duymak için doğru olan bu. */
        body: JSON.stringify({ text: hedefMetin, profil: 'cumle' }),
      });
      const govde = await yanit.json();
      if (!yanit.ok || !govde?.audio) throw new Error(govde?.error || 'Seslendirilemedi.');
      const ikili = atob(govde.audio);
      const bayt = new Uint8Array(ikili.length);
      for (let i = 0; i < ikili.length; i++) bayt[i] = ikili.charCodeAt(i);
      const url = URL.createObjectURL(new Blob([bayt], { type: govde.mimeType || 'audio/mpeg' }));
      const ses = new Audio(url);
      await new Promise<void>((coz) => {
        ses.onended = () => coz();
        ses.onerror = () => coz();
        void ses.play().catch(() => coz());
      });
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setHata(err?.message || 'Örnek okunuş çalınamadı.');
    } finally {
      setOrnekCaliyor(false);
    }
  };

  const yenidenOku = () => {
    setRapor(null);
    setYerel(null);
    setSesUrl((onceki) => {
      if (onceki) URL.revokeObjectURL(onceki);
      return null;
    });
    setHata(null);
  };

  /* ---------------- SONUÇ ---------------- */
  if (rapor || yerel) {
    return (
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[22px] font-semibold tracking-tight text-ink">
            Telaffuz değerlendirmesi
          </h1>
          <button
            type="button"
            onClick={yenidenOku}
            className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2
              text-[13px] font-medium text-white transition-colors
              hover:bg-accent-700 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Tekrar oku
          </button>
        </div>
        {rapor
          ? <TelaffuzSonucu rapor={rapor} hedefMetin={hedefMetin} sesUrl={sesUrl} />
          : yerel && <YerelTelaffuzSonucu analiz={yerel.analiz} sebep={yerel.sebep} />}
      </div>
    );
  }

  /* ---------------- ALIŞTIRMA ---------------- */
  return (
    <div className="max-w-[1100px] space-y-8">

      <div className="space-y-2">
        <h1 className="text-[26px] font-semibold tracking-tight text-ink">
          Bir metni sesli oku, telaffuzunu ölç
        </h1>
        <p className="max-w-[62ch] text-[14px] leading-relaxed text-ink-2">
          Betimleme ne <em>söylediğine</em> bakıyor; burası nasıl
          söylediğine. Hangi kelimede ses kaydı, nerede gereksiz duraklama,
          hangi hecede vurgu düştü — kelime kelime, IPA okunuşuyla.
        </p>
      </div>

      {/* RIZA KAPISI */}
      {!izin ? (
        <div className="max-w-[62ch] rounded-xl border border-marker bg-marker-bg p-4">
          <p className="flex items-start gap-2 text-[13px] font-medium text-marker-ink">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            Bu alıştırmada ses kaydın cihazından çıkıyor.
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-marker-ink">
            Telaffuzu fonem düzeyinde değerlendirebilmek için kaydın Google
            Gemini'ye gönderilmesi gerekiyor — tarayıcıdaki model bunu
            yapamıyor, yalnızca hangi kelimeyi söylediğini duyabiliyor.
            Kayıt değerlendirme için gönderiliyor; ne bu bilgisayarda ne de
            bizim tarafımızda saklanıyor. Saklanan tek şey raporun kendisi.
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-marker-ink">
            <strong>Betimleme bölümü bundan etkilenmiyor</strong>; orada ses
            hâlâ cihazdan hiç çıkmıyor.
          </p>
          <button
            type="button"
            onClick={() => izniAyarla(true)}
            className="mt-4 flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5
              text-[13px] font-medium text-white transition-colors
              hover:bg-accent-700 cursor-pointer"
          >
            <Check className="h-4 w-4" />
            Anladım, göndermeyi kabul ediyorum
          </button>
        </div>
      ) : (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ink-3">
          <ShieldAlert className="h-3.5 w-3.5 text-marker" />
          Kaydın değerlendirme için Gemini'ye gönderilir, hiçbir yerde saklanmaz.
          <button
            type="button"
            onClick={() => izniAyarla(false)}
            className="text-brand-strong underline underline-offset-2 cursor-pointer"
          >
            İzni geri al
          </button>
        </p>
      )}

      {/* METİN SEÇİMİ — sekmeler tam genişlikte, çünkü seçim iki sütunun
          İKİSİNİ birden değiştiriyor; bir sütunun içine sıkıştırmak onu
          yalnızca o sütuna aitmiş gibi gösterirdi. */}
      <div className="flex flex-wrap items-center gap-2">
        {TELAFFUZ_METINLERI.map((m) => {
          const on = !kendiModu && secili?.id === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => { setKendiModu(false); setSecili(m); }}
              className={`rounded-lg px-3 py-1.5 text-[12px] transition-colors cursor-pointer
                ${on ? 'bg-accent font-medium text-white' : 'border border-hairline text-ink-2 hover:bg-paper-3'}`}
            >
              {m.title}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setKendiModu(true)}
          className={`rounded-lg px-3 py-1.5 text-[12px] transition-colors cursor-pointer
            ${kendiModu ? 'bg-accent font-medium text-white' : 'border border-hairline text-ink-2 hover:bg-paper-3'}`}
        >
          Kendi metnim
        </button>
      </div>

      {/* İKİ SÜTUN: solda okunacak şey, sağda okuma aracı.
          Tek sütunda metin ile mikrofon düğmesi arasına aksan seçici ve
          açıklamalar giriyordu; okurken göz metne dönmek için aşağı
          kaydırmak zorunda kalıyordu. Okunan metin, okurken GÖRÜNÜR
          kalmalı. Dar ekranda alt alta diziliyorlar. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

        {/* SOL: HEDEF METİN */}
        <div className="lg:col-span-7">
          <div className="flex h-full flex-col rounded-xl border border-hairline bg-paper-2 p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <span className="eyebrow">
                {kendiModu ? 'Kendi metnin' : secili?.category}
              </span>
              <span className="flex items-center gap-2">
                {!kendiModu && secili && (
                  <span className="timecode rounded bg-paper-3 px-1.5 py-0.5 text-ink-2">
                    {secili.difficulty}
                  </span>
                )}
                {/* Kelime sayısı: iki dakikalık sınırla birlikte okunduğunda
                    "bu metne yetişir miyim" sorusunun cevabı. */}
                {kelimeSayisi > 0 && (
                  <span className="text-[11px] text-ink-3">{kelimeSayisi} kelime</span>
                )}
              </span>
            </div>

            {kendiModu ? (
              <>
                <textarea
                  value={kendiMetni}
                  onChange={(e) => setKendiMetni(e.target.value)}
                  rows={5}
                  placeholder="Okumak istediğin İngilizce metni buraya yaz."
                  className="transcript-en w-full flex-1 rounded-lg border border-hairline
                    bg-paper p-3 text-ink placeholder:text-ink-3"
                />
                <p className="mt-2 text-[11px] leading-relaxed text-ink-3">
                  Kısa tut: iki dakikada rahat okunacak kadar. Uzun metinde hata
                  listesi okunamaz hâle geliyor.
                </p>
              </>
            ) : secili && (
              <>
                <p className="transcript-en flex-1 text-[17px] leading-relaxed text-ink">
                  {secili.text}
                </p>
                <p className="mt-4 text-[12px] leading-relaxed text-ink-3">
                  Çalıştırdığı: {secili.focus}
                </p>
              </>
            )}

            {/* ÖRNEK OKUNUŞ METNİN ALTINDA, ayrı bir bölümde değil:
                yapılacak iş "şu metni dinle", yani metne ait bir eylem. */}
            {hedefMetin && (
              <button
                type="button"
                onClick={ornegiCal}
                disabled={ornekCaliyor}
                className="mt-4 flex items-center gap-2 self-start border-t border-hairline
                  pt-4 text-[13px] font-medium text-brand-strong transition-colors
                  hover:text-brand disabled:opacity-50 cursor-pointer"
              >
                {ornekCaliyor
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Volume2 className="h-4 w-4" />}
                Orijinal telaffuzu dinle
              </button>
            )}
          </div>
        </div>

        {/* SAĞ: KAYIT */}
        <div className="lg:col-span-5">
          <div className="flex h-full flex-col gap-5 rounded-xl border border-hairline
            bg-paper-2 p-5">
            <span className="eyebrow">Ses kaydı</span>

            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="aksan" className="text-[12px] text-ink-2">Aksan</label>
              <select
                id="aksan"
                value={aksan}
                onChange={(e) => setAksan(e.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-hairline bg-paper px-2 py-1.5
                  text-[12px] text-ink cursor-pointer"
              >
                {AKSANLAR.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <TelaffuzKayitPaneli
              onKayitBitti={degerlendir}
              kilitli={mesgul || yerelMesgul}
              izinVerildi={izin}
            />
          </div>
        </div>
      </div>

      {(mesgul || yerelMesgul) && (
        <p className="flex items-center gap-2 text-[13px] text-ink-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {yerelMesgul
            ? 'Buluta ulaşılamadı; kaydın tarayıcında çözümleniyor…'
            : 'Kaydın dinleniyor ve hedef metinle karşılaştırılıyor…'}
        </p>
      )}

      {hata && (
        <p className="flex items-start gap-2 rounded-xl border border-danger-line
          bg-danger-soft p-3 text-[13px] leading-relaxed text-danger">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {hata}
        </p>
      )}
    </div>
  );
};
