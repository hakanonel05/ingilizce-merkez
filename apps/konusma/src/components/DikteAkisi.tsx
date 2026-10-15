/* DİKTE AKIŞI
 * ============================================================================
 * Metni yapıştır → cümlelere bölünsün → her birimi dinle ve yaz → kelime
 * kelime denetlensin.
 *
 * YAVAŞ SES NEDEN AYRI BİR İSTEK: dikte uygulamalarının çoğu yavaş düğmesinde
 * `playbackRate`i düşürüyor; ses esniyor ve anlaşılmaz hale geliyor.
 * Buradaki yavaş sürüm ayrı bir seslendirme isteği — aynı metin, baştan ve
 * ağır okunuyor (gerekçesi ve ölçümü lib/dikteSesi.ts başında).
 *
 * DURAKLAMA SESİN İÇİNDE DEĞİL: örnek kayıtta duraklamalar dosyaya gömülüydü
 * (116 saniyenin 77'si sessizlik) ve bu, değiştiremediğin sabit bir süre
 * demek. Burada oynatıcı bekliyor, süresi de ayarlanabiliyor.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Play, Pause, Rewind, Check, Loader2, AlertCircle, Headphones,
  ChevronRight, RotateCcw, Save, Gauge,
} from 'lucide-react';
import {
  dikteBirimleri, dikteyiDenetle, duraklamaSuresi,
  type DikteBirimi, type DikteSonucu,
} from '../lib/dikteDenetimi';
import {
  dikteSesiUret, dikteyiCal, dikteyiDurdur, bekle, type DikteHizi,
} from '../lib/dikteSesi';
import { dikteYaz, type DikteBirimKaydi } from '../lib/dikteDeposu';
import { DikteKaynagi, type YuklenenSes } from './DikteKaynagi';
import { sesiMetneCevir } from '../../../../shared/ses/konusmaCozumleme';

interface Props {
  onKaydedildi?: () => void;
}

/* 'sesCalisma' AYRI BIR ASAMA. Yuklenen hazir kayitta birim birim ses
   yok - elde iki dosya var, cumleye bolunemiyorlar. O yuzden akis da
   farkli: once normali dinle, sonra yavasi dinleyip yaz, sonra normali
   tekrar dinleyip kontrol et. Hazir dikte kayitlarinin kendi yontemi
   zaten bu. */
type Asama = 'kaynak' | 'calisma' | 'sesCalisma' | 'bitti';

/** Bir birimin çalışma durumu. */
interface BirimDurumu {
  yazilan: string;
  sonuc: DikteSonucu | null;
  dinleme: number;
  yavasKullandi: boolean;
}

const bosDurum = (): BirimDurumu => ({
  yazilan: '', sonuc: null, dinleme: 0, yavasKullandi: false,
});

export const DikteAkisi: React.FC<Props> = ({ onKaydedildi }) => {
  const [asama, setAsama] = useState<Asama>('kaynak');
  const [yuklenen, setYuklenen] = useState<YuklenenSes | null>(null);
  const [sesCevabi, setSesCevabi] = useState('');
  const [sesYazilan, setSesYazilan] = useState('');
  const [sesSonucu, setSesSonucu] = useState<DikteSonucu | null>(null);
  const [metin, setMetin] = useState('');
  const [birimler, setBirimler] = useState<DikteBirimi[]>([]);
  const [sira, setSira] = useState(0);
  const [durumlar, setDurumlar] = useState<BirimDurumu[]>([]);

  const [hiz, setHiz] = useState<DikteHizi>('normal');
  const [otomatik, setOtomatik] = useState(false);
  const [duraklamaCarpani, setDuraklamaCarpani] = useState(1);

  const [calisiyor, setCalisiyor] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');
  const [kaydedildi, setKaydedildi] = useState(false);

  /* Otomatik akış döngüsünü dışarıdan durdurabilmek için: durum
     güncellemesi asenkron, döngü içindeki `calisiyor` hep eski
     değeri görürdü. */
  const iptalRef = useRef({ durduruldu: false });
  const yazmaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => () => { iptalRef.current.durduruldu = true; dikteyiDurdur(); }, []);

  const simdiki = birimler[sira];
  const durum = durumlar[sira] || bosDurum();

  const toplamSonuc = useMemo(() => {
    const dogru = durumlar.reduce((t, d) => t + (d.sonuc?.dogru || 0), 0);
    const toplam = durumlar.reduce((t, d) => t + (d.sonuc?.toplam || 0), 0);
    return { dogru, toplam, puan: toplam === 0 ? 0 : Math.round((dogru / toplam) * 100) };
  }, [durumlar]);

  const hazirla = (gelen?: string) => {
    const kaynak = gelen ?? metin;
    if (gelen !== undefined) setMetin(gelen);
    const b = dikteBirimleri(kaynak);
    if (b.length === 0) {
      setHata('Önce İngilizce bir metin yapıştırın.');
      return;
    }
    setHata('');
    setBirimler(b);
    setDurumlar(b.map(() => bosDurum()));
    setSira(0);
    setKaydedildi(false);
    setAsama('calisma');
  };

  const durumuDegistir = (yama: Partial<BirimDurumu>) => {
    setDurumlar((onceki) =>
      onceki.map((d, i) => (i === sira ? { ...d, ...yama } : d))
    );
  };

  /** Bir birimi seslendirip çalar. */
  const cal = async (birim: DikteBirimi, h: DikteHizi) => {
    setHata('');
    setYukleniyor(true);
    try {
      const url = await dikteSesiUret(birim.metin, h);
      setYukleniyor(false);
      await dikteyiCal(url);
    } catch (e: any) {
      setYukleniyor(false);
      setHata(e?.message || 'Ses üretilemedi.');
      throw e;
    }
  };

  const tekCal = async (h: DikteHizi) => {
    if (!simdiki) return;
    try {
      await cal(simdiki, h);
      durumuDegistir({
        dinleme: durum.dinleme + 1,
        yavasKullandi: durum.yavasKullandi || h === 'yavas',
      });
      yazmaRef.current?.focus();
    } catch {
      /* Hata zaten gösterildi. */
    }
  };

  /** Otomatik akış: çal → yazmak için bekle → sıradaki birim. */
  const otomatikBaslat = async () => {
    if (!birimler.length) return;
    iptalRef.current = { durduruldu: false };
    setCalisiyor(true);

    for (let i = sira; i < birimler.length; i++) {
      if (iptalRef.current.durduruldu) break;
      setSira(i);
      try {
        await cal(birimler[i], hiz);
      } catch {
        break;
      }
      if (iptalRef.current.durduruldu) break;
      await bekle(duraklamaSuresi(birimler[i].kelimeSayisi, duraklamaCarpani), iptalRef.current);
    }

    setCalisiyor(false);
  };

  const durdur = () => {
    iptalRef.current.durduruldu = true;
    dikteyiDurdur();
    setCalisiyor(false);
  };

  const denetle = () => {
    if (!simdiki) return;
    durumuDegistir({ sonuc: dikteyiDenetle(simdiki.metin, durum.yazilan) });
  };

  const sonraki = () => {
    if (sira + 1 < birimler.length) {
      setSira(sira + 1);
      yazmaRef.current?.focus();
    } else {
      durdur();
      setAsama('bitti');
    }
  };

  const kaydet = async () => {
    try {
      const birimKayitlari: DikteBirimKaydi[] = birimler.map((b, i) => ({
        sira: b.sira,
        hedef: b.metin,
        yazilan: durumlar[i]?.yazilan || '',
        dogru: durumlar[i]?.sonuc?.dogru || 0,
        toplam: durumlar[i]?.sonuc?.toplam || b.kelimeSayisi,
        dinleme: durumlar[i]?.dinleme || 0,
        yavasKullandi: durumlar[i]?.yavasKullandi || false,
      }));
      await dikteYaz({
        id: `dikte-${Date.now()}`,
        olusturuldu: Date.now(),
        baslik: metin.trim().split(/\s+/).slice(0, 6).join(' ') + '…',
        metin: metin.trim(),
        birimler: birimKayitlari,
        dogru: toplamSonuc.dogru,
        toplam: toplamSonuc.toplam,
        puan: toplamSonuc.puan,
      });
      setKaydedildi(true);
      onKaydedildi?.();
    } catch (e: any) {
      setHata(e?.message || 'Kayıt yazılamadı.');
    }
  };

  /* Yuklenen ses oturumu tek parca: birim birim ses yok, tek bir
     kayit ve tek bir cevap var. Depoya da tek birim olarak giriyor. */
  const sesiKaydet = async () => {
    if (!sesSonucu || !yuklenen) return;
    try {
      await dikteYaz({
        id: `dikte-${Date.now()}`,
        olusturuldu: Date.now(),
        baslik: yuklenen.normalAd,
        metin: sesCevabi,
        birimler: [{
          sira: 1,
          hedef: sesCevabi,
          yazilan: sesYazilan,
          dogru: sesSonucu.dogru,
          toplam: sesSonucu.toplam,
          dinleme: 0,
          yavasKullandi: true,
        }],
        dogru: sesSonucu.dogru,
        toplam: sesSonucu.toplam,
        puan: sesSonucu.puan,
      });
      setKaydedildi(true);
      onKaydedildi?.();
    } catch (e: any) {
      setHata(e?.message || 'Kayıt yazılamadı.');
    }
  };

  const bastanBasla = () => {
    durdur();
    if (yuklenen) {
      URL.revokeObjectURL(yuklenen.normalUrl);
      URL.revokeObjectURL(yuklenen.yavasUrl);
    }
    setYuklenen(null);
    setSesCevabi('');
    setSesYazilan('');
    setSesSonucu(null);
    setAsama('kaynak');
    setBirimler([]);
    setDurumlar([]);
    setSira(0);
    setKaydedildi(false);
  };

  /* ---------------------------------------------------------------- */

  if (asama === 'kaynak') {
    return (
      <div className="space-y-5">
        <div className="space-y-3 rounded-2xl border border-hairline bg-paper-2 p-5">
          <div className="flex items-center gap-2 text-[14px] font-medium text-ink">
            <Headphones className="h-4 w-4 text-ink-3" />
            <span>Dikte</span>
          </div>
          <p className="max-w-[64ch] text-[13px] leading-relaxed text-ink-2">
            Dinle ve duyduğunu yaz; yazdıkların kelime kelime denetlensin.
          </p>
          <p className="max-w-[64ch] text-[12px] leading-relaxed text-ink-3">
            Metinden çalışırken yavaş sürüm{' '}
            <span className="font-medium text-ink-2">baştan ve ağır okunuyor</span> —
            normal kaydın hızı düşürülmüyor. Hız düşürmek sesi bozar ve yavaşlatmak
            konuşmayı daha anlaşılır değil daha anlaşılmaz yapar.
          </p>
        </div>

        <DikteKaynagi
          onMetinHazir={(m) => hazirla(m)}
          onSesHazir={(ses, cevapMetni) => {
            setYuklenen(ses);
            setSesCevabi(cevapMetni);
            setSesYazilan('');
            setSesSonucu(null);
            setHata('');
            setAsama('sesCalisma');
          }}
          onSesiCozumle={(blob) => sesiMetneCevir(`dikte-${Date.now()}`, blob)}
        />
      </div>
    );
  }

  /* ---------------- YUKLENEN SES ----------------
     Hazir dikte kayitlarinin kendi yontemi: once normali dinle (yazma),
     sonra yavasi dinleyip yaz, sonra normali tekrar dinleyip kontrol et. */
  if (asama === 'sesCalisma' && yuklenen) {
    const sesCal = async (url: string) => {
      setHata('');
      try {
        await dikteyiCal(url);
      } catch {
        setHata('Ses çalınamadı.');
      }
    };

    return (
      <div className="space-y-5">
        <div className="space-y-3 rounded-2xl border border-hairline bg-paper-2 p-5">
          <div className="flex items-center justify-between gap-3">
            {/* "Yuklenen" demiyor: ayni akis hazir alistirmalarda da
                kullaniliyor ve orada dosya yuklenmis olmuyor. */}
            <span className="text-[12px] font-medium text-ink-2">Alıştırma kaydı</span>
            <button
              type="button"
              onClick={bastanBasla}
              className="text-[12px] text-ink-3 hover:text-ink cursor-pointer"
            >
              Değiştir
            </button>
          </div>
          <p className="truncate text-[11px] text-ink-3">
            {yuklenen.normalAd} · {yuklenen.yavasAd}
          </p>

          <ol className="space-y-2 pt-1">
            <li className="flex flex-wrap items-center gap-2 text-[13px] text-ink-2">
              <span className="text-ink-3">1.</span>
              <button
                type="button"
                onClick={() => sesCal(yuklenen.normalUrl)}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-3 py-2
                  text-[13px] font-medium text-white transition-colors
                  hover:bg-accent-700 cursor-pointer"
              >
                <Play className="h-4 w-4" />
                Normal hızda dinle
              </button>
              <span className="text-[12px] text-ink-3">yazma, sadece dinle</span>
            </li>
            <li className="flex flex-wrap items-center gap-2 text-[13px] text-ink-2">
              <span className="text-ink-3">2.</span>
              <button
                type="button"
                onClick={() => sesCal(yuklenen.yavasUrl)}
                className="inline-flex items-center gap-2 rounded-xl border border-hairline
                  bg-paper-2 px-3 py-2 text-[13px] font-medium text-ink
                  transition-colors hover:border-accent/40 cursor-pointer"
              >
                <Rewind className="h-4 w-4" />
                Yavaş dinle
              </button>
              <span className="text-[12px] text-ink-3">dinlerken yaz</span>
            </li>
            <li className="flex flex-wrap items-center gap-2 text-[13px] text-ink-2">
              <span className="text-ink-3">3.</span>
              <button
                type="button"
                onClick={() => sesCal(yuklenen.normalUrl)}
                className="inline-flex items-center gap-2 rounded-xl border border-hairline
                  bg-paper-2 px-3 py-2 text-[13px] font-medium text-ink
                  transition-colors hover:border-accent/40 cursor-pointer"
              >
                <Play className="h-4 w-4" />
                Tekrar normal
              </button>
              <span className="text-[12px] text-ink-3">kontrol et</span>
            </li>
          </ol>

          <button
            type="button"
            onClick={() => dikteyiDurdur()}
            className="inline-flex items-center gap-1.5 text-[12px] text-ink-3
              hover:text-ink cursor-pointer"
          >
            <Pause className="h-3.5 w-3.5" /> Durdur
          </button>

          {hata && (
            <p className="flex items-center gap-1.5 text-[12px] text-[var(--danger)]">
              <AlertCircle className="h-3.5 w-3.5" /> {hata}
            </p>
          )}
        </div>

        <div className="space-y-3 rounded-2xl border border-hairline bg-paper-2 p-5">
          <label htmlFor="dikte-ses-yazi" className="block text-[12px] font-medium text-ink-2">
            Duyduğunu yaz
          </label>
          <textarea
            id="dikte-ses-yazi"
            value={sesYazilan}
            onChange={(e) => { setSesYazilan(e.target.value); setSesSonucu(null); }}
            rows={6}
            lang="en"
            placeholder="Kaydı dinlerken buraya yaz…"
            className="w-full resize-y rounded-xl border border-hairline bg-paper px-3 py-2.5
              text-[14px] leading-relaxed text-ink placeholder-ink-3
              focus:border-accent focus:outline-none"
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSesSonucu(dikteyiDenetle(sesCevabi, sesYazilan))}
              disabled={!sesYazilan.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5
                text-[13px] font-medium text-white transition-colors
                hover:bg-accent-700 disabled:opacity-40 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              Denetle
            </button>
            {sesSonucu && (
              <button
                type="button"
                onClick={sesiKaydet}
                disabled={kaydedildi}
                className="inline-flex items-center gap-2 rounded-xl border border-hairline
                  bg-paper-2 px-3 py-2.5 text-[13px] font-medium text-ink
                  transition-colors hover:border-accent/40 disabled:opacity-40 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                {kaydedildi ? 'Kaydedildi' : 'Geçmişe kaydet'}
              </button>
            )}
          </div>

          {sesSonucu && (
            <div className="space-y-2 rounded-xl border border-hairline bg-paper p-3">
              <p className="text-[12px] text-ink-3">
                {sesSonucu.dogru} / {sesSonucu.toplam} kelime doğru
                {sesSonucu.tamMi && ' · tam'}
              </p>
              <p className="text-[14px] leading-relaxed" lang="en">
                <SonucSatiri sonuc={sesSonucu} />
              </p>
              {sesSonucu.fazladan.length > 0 && (
                <p className="text-[12px] text-ink-3">
                  Fazladan yazılan: {sesSonucu.fazladan.join(', ')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (asama === 'bitti') {
    return (
      <div className="space-y-5">
        <div className="space-y-3 rounded-2xl border border-hairline bg-paper-2 p-5">
          <span className="text-[11px] font-semibold tracking-[0.12em] text-ink-3">SONUÇ</span>
          <p className="text-[28px] font-semibold leading-none text-ink">
            {toplamSonuc.puan}
            <span className="ml-1 text-[15px] font-normal text-ink-3">/ 100</span>
          </p>
          <p className="text-[13px] text-ink-2">
            {toplamSonuc.dogru} / {toplamSonuc.toplam} kelime doğru · {birimler.length} birim
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={kaydet}
              disabled={kaydedildi}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-[13px]
                font-medium text-white transition-colors hover:bg-accent-700
                disabled:opacity-40 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              {kaydedildi ? 'Kaydedildi' : 'Geçmişe kaydet'}
            </button>
            <button
              type="button"
              onClick={bastanBasla}
              className="inline-flex items-center gap-2 rounded-xl border border-hairline
                bg-paper-2 px-4 py-2.5 text-[13px] font-medium text-ink
                transition-colors hover:border-accent/40 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Yeni metin
            </button>
          </div>
        </div>

        {/* Birim birim döküm */}
        <div className="space-y-3">
          {birimler.map((b, i) => {
            const s = durumlar[i]?.sonuc;
            return (
              <div key={b.sira} className="rounded-2xl border border-hairline bg-paper-2 p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[11px] font-medium text-ink-3">Birim {b.sira}</span>
                  {s && (
                    <span className="text-[11px] text-ink-3">
                      {s.dogru}/{s.toplam} kelime
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed" lang="en">
                  {s ? <SonucSatiri sonuc={s} /> : <span className="text-ink-3">{b.metin}</span>}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------------- ÇALIŞMA ---------------- */
  return (
    <div className="space-y-5">
      {/* Denetim çubuğu */}
      <div className="space-y-3 rounded-2xl border border-hairline bg-paper-2 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[12px] text-ink-3">
            Birim <span className="font-semibold text-ink">{sira + 1}</span> / {birimler.length}
          </span>
          <div className="flex items-center gap-1.5">
            {/* HIZ BIR SECIM, BIR CARPAN DEGIL: iki ayri kayit arasinda
                geciliyor, oynatma hizi degismiyor. */}
            {(['normal', 'yavas'] as DikteHizi[]).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHiz(h)}
                className={`rounded-lg px-2.5 py-1 text-[12px] font-medium transition-colors cursor-pointer ${
                  hiz === h
                    ? 'bg-ink text-white'
                    : 'border border-hairline text-ink-2 hover:text-ink'
                }`}
              >
                {h === 'normal' ? 'Normal' : 'Yavaş'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => tekCal(hiz)}
            disabled={yukleniyor || calisiyor}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-[13px]
              font-medium text-white transition-colors hover:bg-accent-700
              disabled:opacity-40 cursor-pointer"
          >
            {yukleniyor ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Dinle
          </button>
          <button
            type="button"
            onClick={() => tekCal('yavas')}
            disabled={yukleniyor || calisiyor}
            className="inline-flex items-center gap-2 rounded-xl border border-hairline
              bg-paper-2 px-3 py-2.5 text-[13px] font-medium text-ink
              transition-colors hover:border-accent/40 disabled:opacity-40 cursor-pointer"
          >
            <Rewind className="h-4 w-4" />
            Yavaş dinle
          </button>
          <button
            type="button"
            onClick={calisiyor ? durdur : otomatikBaslat}
            className="inline-flex items-center gap-2 rounded-xl border border-hairline
              bg-paper-2 px-3 py-2.5 text-[13px] font-medium text-ink
              transition-colors hover:border-accent/40 cursor-pointer"
          >
            {calisiyor ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {calisiyor ? 'Durdur' : 'Otomatik akış'}
          </button>
        </div>

        {/* Duraklama: sesin icine gomulu degil, burada ayarlaniyor. */}
        <label className="flex flex-wrap items-center gap-2 text-[12px] text-ink-2">
          <Gauge className="h-3.5 w-3.5 text-ink-3" />
          Yazma duraklaması
          <input
            type="range"
            min={0.5}
            max={2.5}
            step={0.25}
            value={duraklamaCarpani}
            onChange={(e) => setDuraklamaCarpani(Number(e.target.value))}
            className="h-1 w-36 cursor-pointer accent-[var(--accent)]"
          />
          <span className="timecode text-ink-3">
            {simdiki ? `${duraklamaSuresi(simdiki.kelimeSayisi, duraklamaCarpani)} sn` : '—'}
          </span>
        </label>

        {hata && (
          <p className="flex items-center gap-1.5 text-[12px] text-[var(--danger)]">
            <AlertCircle className="h-3.5 w-3.5" /> {hata}
          </p>
        )}
      </div>

      {/* Yazma alanı */}
      <div className="space-y-3 rounded-2xl border border-hairline bg-paper-2 p-5">
        <label htmlFor="dikte-yazi" className="block text-[12px] font-medium text-ink-2">
          Duyduğunu yaz
        </label>
        <textarea
          id="dikte-yazi"
          ref={yazmaRef}
          value={durum.yazilan}
          onChange={(e) => durumuDegistir({ yazilan: e.target.value, sonuc: null })}
          onKeyDown={(e) => {
            /* Enter denetler, Shift+Enter satir atlar: dikte tek satirlik
               bir is ve her birimde fareye uzanmak akisi kesiyor. */
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (durum.sonuc) sonraki();
              else denetle();
            }
          }}
          rows={3}
          lang="en"
          placeholder="Dinlediğin cümleyi buraya yaz…"
          className="w-full resize-y rounded-xl border border-hairline bg-paper px-3 py-2.5
            text-[14px] leading-relaxed text-ink placeholder-ink-3
            focus:border-accent focus:outline-none"
        />

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={denetle}
            disabled={!durum.yazilan.trim()}
            className="inline-flex items-center gap-2 rounded-xl border border-hairline
              bg-paper-2 px-3 py-2 text-[13px] font-medium text-ink
              transition-colors hover:border-accent/40 disabled:opacity-40 cursor-pointer"
          >
            <Check className="h-4 w-4" />
            Denetle
          </button>
          <button
            type="button"
            onClick={sonraki}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-[13px]
              font-medium text-white transition-colors hover:bg-accent-700 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
            {sira + 1 < birimler.length ? 'Sıradaki birim' : 'Bitir'}
          </button>
          <span className="text-[11px] text-ink-3">Enter: denetle · yeniden Enter: sıradaki</span>
        </div>

        {durum.sonuc && (
          <div className="space-y-2 rounded-xl border border-hairline bg-paper p-3">
            <p className="text-[12px] text-ink-3">
              {durum.sonuc.dogru} / {durum.sonuc.toplam} kelime doğru
              {durum.sonuc.tamMi && ' · tam'}
            </p>
            <p className="text-[14px] leading-relaxed" lang="en">
              <SonucSatiri sonuc={durum.sonuc} />
            </p>
            {durum.sonuc.fazladan.length > 0 && (
              <p className="text-[12px] text-ink-3">
                Fazladan yazılan: {durum.sonuc.fazladan.join(', ')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* Dogru/yanlis RENKLE DEGIL BICIMLE ayriliyor: depoda metin isaretleri
   bicimle anlatiliyor (bkz. rapor) ve renk korligunde de ayirt edilebilir
   kalmasi gerekiyor. */
const SonucSatiri: React.FC<{ sonuc: DikteSonucu }> = ({ sonuc }) => (
  <>
    {sonuc.kelimeler.map((k, i) => {
      if (k.durum === 'dogru') return <span key={i}>{k.hedef} </span>;
      if (k.durum === 'eksik') {
        return (
          <span key={i} className="rounded bg-paper-3 px-1 text-ink-3" title="Yazılmamış">
            {k.hedef}{' '}
          </span>
        );
      }
      return (
        <span key={i} title={`Sen: ${k.yazilan}`}>
          <span className="text-ink-3 line-through">{k.yazilan}</span>{' '}
          <span className="font-semibold underline decoration-2 underline-offset-2">
            {k.hedef}
          </span>{' '}
        </span>
      );
    })}
  </>
);
