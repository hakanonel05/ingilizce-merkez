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

interface Props {
  onKaydedildi?: () => void;
}

type Asama = 'metin' | 'calisma' | 'bitti';

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
  const [asama, setAsama] = useState<Asama>('metin');
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

  const hazirla = () => {
    const b = dikteBirimleri(metin);
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

  const bastanBasla = () => {
    durdur();
    setAsama('metin');
    setBirimler([]);
    setDurumlar([]);
    setSira(0);
    setKaydedildi(false);
  };

  /* ---------------------------------------------------------------- */

  if (asama === 'metin') {
    return (
      <div className="space-y-5">
        <div className="space-y-3 rounded-2xl border border-hairline bg-paper-2 p-5">
          <div className="flex items-center gap-2 text-[14px] font-medium text-ink">
            <Headphones className="h-4 w-4 text-ink-3" />
            <span>Dikte</span>
          </div>
          <p className="max-w-[64ch] text-[13px] leading-relaxed text-ink-2">
            İngilizce bir metin yapıştır; cümlelere bölünür, her birini dinleyip
            yazarsın ve kelime kelime denetlenir.
          </p>
          <p className="max-w-[64ch] text-[12px] leading-relaxed text-ink-3">
            Yavaş sürüm metni <span className="font-medium text-ink-2">baştan ve ağır okuyor</span> —
            normal kaydın hızı düşürülmüyor. Hız düşürmek sesi bozar ve yavaşlatmak
            konuşmayı daha anlaşılır değil daha anlaşılmaz yapar.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl border border-hairline bg-paper-2 p-5">
          <label htmlFor="dikte-metin" className="block text-[12px] font-medium text-ink-2">
            Alıştırma metni (İngilizce)
          </label>
          <textarea
            id="dikte-metin"
            value={metin}
            onChange={(e) => setMetin(e.target.value)}
            rows={7}
            placeholder={'I would like to make an appointment with the doctor. Can you come in on Friday at three?'}
            className="w-full resize-y rounded-xl border border-hairline bg-paper px-3 py-2.5
              text-[14px] leading-relaxed text-ink placeholder-ink-3
              focus:border-accent focus:outline-none"
          />
          {hata && (
            <p className="flex items-center gap-1.5 text-[12px] text-[var(--danger)]">
              <AlertCircle className="h-3.5 w-3.5" /> {hata}
            </p>
          )}
          <button
            type="button"
            onClick={hazirla}
            disabled={!metin.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-[13px]
              font-medium text-white transition-colors hover:bg-accent-700
              disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
            Alıştırmayı hazırla
          </button>
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
