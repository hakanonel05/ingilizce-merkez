import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Sparkles, Loader2, AlertTriangle, Info } from 'lucide-react';
import {
  kaydiCozumle,
  cozumDurumunuIzle,
  baglantiAgirMi,
  type KayitAnalizi,
  type KelimeSonucu,
  type CozumDurumu,
} from '../../../../shared/ses/konusmaCozumleme';
import { analizAnahtari, analizOku, analizYaz } from '../../../../shared/ses/analizDeposu';

/* KAYIT ANALİZİ — EKRAN
 * ============================================================================
 * Kayıt paneli şimdiye kadar yalnızca "dinle ve kendin karşılaştır" diyordu.
 * Burası ölçülen şeyi gösteriyor: hangi kelimeyi söyledin, hangisini atladın,
 * nerede duraksadın.
 *
 * İKİ TASARIM KARARI:
 *
 * 1. Puanlar büyük, renkli değil. Hiyerarşi punto ile kuruluyor; renk
 *    yalnızca kelime durumlarında iş görüyor (doğru/kaymış/farklı). Her
 *    şeyi renklendirmek, asıl renkli olması gerekeni görünmez yapar.
 *
 * 2. Ölçemediğimiz şey açıkça yazıyor. Whisper bir sesletim modeli değil;
 *    "th" sesini yanlış çıkardığını söyleyemez. Bunu gizleyip "telaffuz
 *    puanı" demek kullanıcıyı yanlış yönlendirirdi.
 */

interface Props {
  lessonId: string;
  sentenceId: number;
  sentenceText: string;
  kayit: { blob: Blob; createdAt: number } | null;
}

const DURUM_METNI: Record<CozumDurumu, string> = {
  kapali: '',
  yukleniyor: 'Model indiriliyor',
  cozuluyor: 'Kaydın çözümleniyor',
  hazir: '',
  hata: '',
};

/** Kelime durumuna göre biçim. Renk burada anlam taşıyor, süs değil. */
function kelimeSinifi(durum: KelimeSonucu['durum']): string {
  switch (durum) {
    case 'dogru':
      return 'text-ink';
    case 'kaymis':
      return 'text-marker-ink bg-marker-bg border-b border-marker';
    case 'farkli':
      return 'text-danger bg-danger-soft border-b border-danger-line';
    case 'eksik':
      return 'text-ink-3 line-through decoration-ink-3';
  }
}

const PuanKutusu: React.FC<{ baslik: string; deger: number; alt: string }> = ({
  baslik,
  deger,
  alt,
}) => (
  <div className="flex-1 min-w-[130px]">
    <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">{baslik}</div>
    <div className="text-3xl font-semibold text-ink tabular-nums leading-tight">
      {deger}
      <span className="text-base font-normal text-ink-3">/100</span>
    </div>
    <div className="text-[11px] text-ink-2">{alt}</div>
  </div>
);

export const KayitAnalizPaneli: React.FC<Props> = ({
  lessonId,
  sentenceId,
  sentenceText,
  kayit,
}) => {
  const [analiz, setAnaliz] = useState<KayitAnalizi | null>(null);
  const [calisiyor, setCalisiyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [durum, setDurum] = useState<{ d: CozumDurumu; yuzde?: number }>({ d: 'kapali' });
  const kosuRef = useRef(0);

  useEffect(() => cozumDurumunuIzle((d, yuzde) => setDurum({ d, yuzde })), []);

  /* Kayıt değişince: önce saklanmış sonuca bak. Aynı kayıt tekrar
     çözümlenmiyor; yeniden kaydedilirse anahtar değiştiği için eski sonuç
     kendiliğinden geçersiz oluyor. */
  useEffect(() => {
    const kosu = ++kosuRef.current;
    setAnaliz(null);
    setHata(null);
    if (!kayit) return;
    void (async () => {
      const kayitli = await analizOku(analizAnahtari(lessonId, sentenceId, kayit.createdAt));
      if (kosu === kosuRef.current && kayitli) setAnaliz(kayitli);
    })();
  }, [lessonId, sentenceId, kayit]);

  const cozumle = useCallback(async () => {
    if (!kayit) return;
    const kosu = ++kosuRef.current;
    setCalisiyor(true);
    setHata(null);
    try {
      const anahtar = analizAnahtari(lessonId, sentenceId, kayit.createdAt);
      const sonuc = await kaydiCozumle(anahtar, kayit.blob, sentenceText);
      if (kosu !== kosuRef.current) return;
      setAnaliz(sonuc);
      void analizYaz(anahtar, sonuc);
    } catch (e: any) {
      if (kosu === kosuRef.current) setHata(e?.message || 'Çözümlenemedi.');
    } finally {
      if (kosu === kosuRef.current) setCalisiyor(false);
    }
  }, [kayit, lessonId, sentenceId, sentenceText]);

  if (!kayit) return null;

  return (
    <div className="pt-3 border-t border-hairline space-y-3">
      {!analiz && !calisiyor && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={cozumle}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-accent hover:bg-accent-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kaydımı çözümle</span>
          </button>
          <p className="text-[11px] text-ink-2">
            Kaydın bilgisayarından çıkmıyor — çözümleme tarayıcıda yapılıyor. İlk kullanımda
            yaklaşık <strong>76 MB</strong> model iniyor; sonrasında çevrimdışı da çalışıyor.
            {baglantiAgirMi() && (
              <span className="text-danger">
                {' '}
                Bağlantın yavaş ya da veri tasarrufu açık görünüyor; indirme uzun sürebilir.
              </span>
            )}
          </p>
        </div>
      )}

      {calisiyor && (
        <div className="flex items-center space-x-2 text-xs text-ink-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>
            {DURUM_METNI[durum.d] || 'Hazırlanıyor'}
            {durum.d === 'yukleniyor' && typeof durum.yuzde === 'number' ? ` %${durum.yuzde}` : ''}…
          </span>
        </div>
      )}

      {hata && (
        <p className="flex items-start space-x-1.5 text-[11px] text-danger">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
          <span>{hata}</span>
        </p>
      )}

      {analiz && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-5">
            <PuanKutusu
              baslik="Kelime doğruluğu"
              deger={analiz.dogrulukPuani}
              alt={`${analiz.kelimeler.filter((k) => k.durum === 'dogru').length}/${
                analiz.kelimeler.length
              } kelime birebir`}
            />
            <PuanKutusu
              baslik="Akıcılık"
              deger={analiz.akicilikPuani}
              alt={`dakikada ${analiz.akicilik.kelimeHizi} kelime · ${
                analiz.akicilik.duraklamaSayisi
              } duraksama`}
            />
          </div>

          {/* Cümle, kelime kelime */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-3 mb-1.5">
              Söylediğin
            </div>
            <p className="text-[15px] leading-8">
              {analiz.kelimeler.map((k, i) => (
                <React.Fragment key={i}>
                  <span
                    className={`px-0.5 ${kelimeSinifi(k.durum)}`}
                    title={
                      k.durum === 'dogru'
                        ? undefined
                        : k.durum === 'eksik'
                          ? 'bu kelime duyulmadı'
                          : `duyulan: ${k.duyulan}`
                    }
                  >
                    {k.hedef}
                  </span>{' '}
                </React.Fragment>
              ))}
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-ink-2">
              <span>
                <span className="inline-block w-2.5 h-2.5 align-middle mr-1 bg-marker-bg border border-marker" />
                telaffuz kaymış
              </span>
              <span>
                <span className="inline-block w-2.5 h-2.5 align-middle mr-1 bg-danger-soft border border-danger-line" />
                başka kelime
              </span>
              <span>
                <span className="align-middle mr-1 line-through text-ink-3">üstü çizili</span>
                duyulmadı
              </span>
            </div>
          </div>

          {analiz.fazladan.length > 0 && (
            <p className="text-[11px] text-ink-2">
              <strong className="text-ink">Fazladan:</strong> {analiz.fazladan.join(', ')}
            </p>
          )}

          <details className="text-[11px] text-ink-2">
            <summary className="cursor-pointer font-semibold text-ink-2 hover:text-brand">
              Bu puanlar nasıl hesaplandı?
            </summary>
            <div className="pt-2 space-y-1.5">
              <p>
                <strong className="text-ink">Kelime doğruluğu:</strong> kaydın yazıya çevrilip hedef
                cümleyle hizalanıyor. Birebir kelime tam, telaffuzu kaymış kelime yarım sayılıyor;
                atlanan kelime sayılmıyor.
              </p>
              <p>
                <strong className="text-ink">Akıcılık:</strong> 100'den başlıyor. Rahat konuşma
                bandı dakikada 110-190 kelime; bandın dışına taşan her 10 kelime 5 puan (en fazla
                30). 0,7 saniyeyi aşan duraksamaların aşan kısmı saniye başına 25 puan (en fazla
                40). Duraksamalar kaydın sesinden ölçülüyor. Ölçülen:{' '}
                {analiz.akicilik.konusmaSuresi} sn konuşma
                {analiz.akicilik.duraklamaSayisi > 0 &&
                  `, en uzun duraksama ${analiz.akicilik.enUzunDuraklama} sn`}
                .
              </p>
              <p className="flex items-start space-x-1.5 pt-1">
                <Info className="w-3.5 h-3.5 shrink-0 mt-px text-ink-3" />
                <span>
                  Bu bir <strong>telaffuz notu değil</strong>. Kullanılan model sesleri değil
                  kelimeleri tanıyor: "th" sesini yanlış çıkardığını söyleyemez. Ama hedeflenen
                  kelime yerine başkasını duyduysa, telaffuzun büyük ihtimalle kaymıştır —
                  yukarıdaki işaretler bunu gösteriyor.
                </span>
              </p>
              <p className="text-ink-3">
                Duyulan metin: <span className="italic">{analiz.duyulanMetin || '—'}</span>
              </p>
            </div>
          </details>

          <button
            type="button"
            onClick={cozumle}
            className="text-[11px] font-semibold text-ink-3 hover:text-brand cursor-pointer"
          >
            Yeniden çözümle
          </button>
        </div>
      )}
    </div>
  );
};
