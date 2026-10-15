/* DİKTE KAYNAĞI — alıştırma metni nereden gelsin
 * ============================================================================
 * Üç yol var, üçü de ayrı bir ihtiyaca karşılık geliyor:
 *
 *   KENDİ METNİN. Çalışmak istediğin belli bir metin varsa.
 *
 *   YAPAY ZEKÂ ÜRETSİN. Her seferinde metin aramak zorunda kalmamak için.
 *     Üretilen metin DİKTEYE uygun olmalı — duyulduğu gibi yazılabilen
 *     kelimeler, kısa cümleler, özel isim ve rakam az (gerekçesi
 *     server.ts'teki /api/dikte-uret notunda).
 *
 *   SES DOSYASI YÜKLE. Elindeki hazır dikte kaydıyla çalışmak için:
 *     normal ve yavaş sürüm ayrı dosyalar.
 *
 * NİYE SİTEDEN ÇEKEN BİR SEÇENEK YOK: hazır dikte kayıtları telifli.
 * EnglishClub'ın izin sayfası "uygulamada yeniden kullanım" için lisans
 * istiyor; öğrencinin kendi kişisel çalışması için kopyalamasına ise
 * açıkça izin veriyor. Yani dosyayı indirip buraya yüklemek kullanıcının
 * hakkı, uygulamanın onun yerine siteden toplaması değil.
 */

import React, { useEffect, useRef, useState } from 'react';
import { FileAudio, Sparkles, PenLine, Loader2, AlertCircle, Upload, X } from 'lucide-react';
import { apiFetch } from '../../../../shared/vocab/userKeys';
import { cozumDurumunuIzle, type CozumDurumu } from '../../../../shared/ses/konusmaCozumleme';

export type KaynakTipi = 'metin' | 'yapayZeka' | 'ses';

export interface YuklenenSes {
  normalUrl: string;
  yavasUrl: string;
  normalAd: string;
  yavasAd: string;
}

interface Props {
  /** Metin hazır olduğunda: TTS akışı başlar. */
  onMetinHazir: (metin: string) => void;
  /** Ses çifti hazır olduğunda: yüklenen ses akışı başlar. */
  onSesHazir: (ses: YuklenenSes, metin: string) => void;
  /** Yüklenen sesten metni çıkarmak için (Whisper). */
  onSesiCozumle: (blob: Blob) => Promise<string>;
}

const SEVIYELER = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;

export const DikteKaynagi: React.FC<Props> = ({ onMetinHazir, onSesHazir, onSesiCozumle }) => {
  const [tip, setTip] = useState<KaynakTipi>('metin');
  const [hata, setHata] = useState('');

  /* --- kendi metnin --- */
  const [metin, setMetin] = useState('');

  /* --- yapay zekâ --- */
  const [konu, setKonu] = useState('');
  const [seviye, setSeviye] = useState<(typeof SEVIYELER)[number]>('B1');
  const [cumle, setCumle] = useState(5);
  const [uretiliyor, setUretiliyor] = useState(false);
  const [uretilen, setUretilen] = useState('');

  /* --- ses yükleme --- */
  const [normal, setNormal] = useState<File | null>(null);
  const [yavas, setYavas] = useState<File | null>(null);
  const [cevap, setCevap] = useState('');
  const [cozumleniyor, setCozumleniyor] = useState(false);
  /* ILK CALISTIRMADA MODEL INIYOR ve bu uzun suruyor (olculdu: 25
     saniyeden fazla). Geri bildirim olmadan dugme sessizce bekliyor
     gibi gorunuyor; kullanici bozuldugunu sanip tekrar basiyor. */
  const [cozumDurumu, setCozumDurumu] = useState<CozumDurumu>('kapali');
  const [cozumYuzde, setCozumYuzde] = useState<number | undefined>(undefined);

  useEffect(() => cozumDurumunuIzle((durum, yuzde) => {
    setCozumDurumu(durum);
    setCozumYuzde(yuzde);
  }), []);
  const normalRef = useRef<HTMLInputElement | null>(null);
  const yavasRef = useRef<HTMLInputElement | null>(null);

  const uret = async () => {
    setHata('');
    setUretiliyor(true);
    try {
      const r = await apiFetch('/api/dikte-uret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ konu: konu.trim(), seviye, cumle }),
      });
      const veri = await r.json();
      if (!r.ok) throw new Error(veri?.error || 'Metin üretilemedi.');
      setUretilen(veri.metin);
    } catch (e: any) {
      setHata(e?.message || 'Metin üretilemedi.');
    } finally {
      setUretiliyor(false);
    }
  };

  const sestenCikar = async () => {
    if (!normal) return;
    setHata('');
    setCozumleniyor(true);
    try {
      /* Metni NORMAL kayıttan çıkarıyoruz: yavaş sürüm aynı cümleleri
         taşıyor ama çok daha uzun ve tarayıcıdaki Whisper'ı gereksiz
         yere meşgul ederdi. */
      setCevap(await onSesiCozumle(normal));
    } catch (e: any) {
      setHata(e?.message || 'Ses çözümlenemedi.');
    } finally {
      setCozumleniyor(false);
    }
  };

  const sesiBaslat = () => {
    if (!normal || !yavas) {
      setHata('Normal ve yavaş kayıtların ikisini de seçin.');
      return;
    }
    if (!cevap.trim()) {
      setHata('Karşılaştırma için metin gerekli: yapıştırın ya da sesten çıkarın.');
      return;
    }
    onSesHazir(
      {
        normalUrl: URL.createObjectURL(normal),
        yavasUrl: URL.createObjectURL(yavas),
        normalAd: normal.name,
        yavasAd: yavas.name,
      },
      cevap.trim()
    );
  };

  const sekme = (id: KaynakTipi, etiket: string, ikon: React.ReactNode) => (
    <button
      key={id}
      type="button"
      onClick={() => { setTip(id); setHata(''); }}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px]
        font-medium transition-colors cursor-pointer ${
          tip === id ? 'bg-ink text-white' : 'border border-hairline text-ink-2 hover:text-ink'
        }`}
    >
      {ikon}
      {etiket}
    </button>
  );

  const dosyaSatiri = (
    etiket: string,
    aciklama: string,
    dosya: File | null,
    ref: React.MutableRefObject<HTMLInputElement | null>,
    ayarla: (f: File | null) => void
  ) => (
    <div className="space-y-1.5">
      <p className="text-[12px] font-medium text-ink-2">{etiket}</p>
      <p className="text-[11px] text-ink-3">{aciklama}</p>
      <input
        ref={ref}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => { ayarla(e.target.files?.[0] || null); e.target.value = ''; }}
      />
      {dosya ? (
        <div className="flex items-center gap-2 rounded-xl border border-hairline bg-paper px-3 py-2">
          <FileAudio className="h-4 w-4 shrink-0 text-ink-3" />
          <span className="min-w-0 flex-1 truncate text-[12px] text-ink">{dosya.name}</span>
          <button
            type="button"
            onClick={() => ayarla(null)}
            aria-label="Kaldır"
            className="shrink-0 rounded p-1 text-ink-3 hover:text-ink cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-hairline
            bg-paper-2 px-3 py-2 text-[12px] font-medium text-ink
            transition-colors hover:border-accent/40 cursor-pointer"
        >
          <Upload className="h-3.5 w-3.5" />
          Dosya seç
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="space-y-3 rounded-2xl border border-hairline bg-paper-2 p-5">
        <div className="flex flex-wrap gap-1.5">
          {sekme('metin', 'Kendi metnim', <PenLine className="h-3.5 w-3.5" />)}
          {sekme('yapayZeka', 'Yapay zekâ üretsin', <Sparkles className="h-3.5 w-3.5" />)}
          {sekme('ses', 'Ses dosyası yükle', <FileAudio className="h-3.5 w-3.5" />)}
        </div>

        {tip === 'metin' && (
          <div className="space-y-3 pt-1">
            <textarea
              id="dikte-metin"
              value={metin}
              onChange={(e) => setMetin(e.target.value)}
              rows={6}
              placeholder="I would like to make an appointment with the doctor. Can you come in on Friday at three?"
              className="w-full resize-y rounded-xl border border-hairline bg-paper px-3 py-2.5
                text-[14px] leading-relaxed text-ink placeholder-ink-3
                focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={() => (metin.trim() ? onMetinHazir(metin) : setHata('Önce bir metin yazın.'))}
              disabled={!metin.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-[13px]
                font-medium text-white transition-colors hover:bg-accent-700
                disabled:opacity-40 cursor-pointer"
            >
              Alıştırmayı hazırla
            </button>
          </div>
        )}

        {tip === 'yapayZeka' && (
          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap items-end gap-3">
              <label className="flex min-w-[180px] flex-1 flex-col gap-1">
                <span className="text-[12px] font-medium text-ink-2">Konu (isteğe bağlı)</span>
                <input
                  type="text"
                  value={konu}
                  onChange={(e) => setKonu(e.target.value)}
                  placeholder="randevu almak, hava durumu…"
                  className="rounded-xl border border-hairline bg-paper px-3 py-2 text-[13px]
                    text-ink placeholder-ink-3 focus:border-accent focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[12px] font-medium text-ink-2">Seviye</span>
                <select
                  value={seviye}
                  onChange={(e) => setSeviye(e.target.value as typeof seviye)}
                  className="rounded-xl border border-hairline bg-paper px-3 py-2 text-[13px]
                    text-ink focus:border-accent focus:outline-none cursor-pointer"
                >
                  {SEVIYELER.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[12px] font-medium text-ink-2">Cümle</span>
                <input
                  type="number"
                  min={2}
                  max={10}
                  value={cumle}
                  onChange={(e) => setCumle(Number(e.target.value))}
                  className="w-20 rounded-xl border border-hairline bg-paper px-3 py-2 text-[13px]
                    text-ink focus:border-accent focus:outline-none"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={uret}
              disabled={uretiliyor}
              className="inline-flex items-center gap-2 rounded-xl border border-hairline
                bg-paper-2 px-3 py-2 text-[13px] font-medium text-ink
                transition-colors hover:border-accent/40 disabled:opacity-40 cursor-pointer"
            >
              {uretiliyor ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {uretiliyor ? 'Üretiliyor…' : 'Metin üret'}
            </button>

            {uretilen && (
              <div className="space-y-2">
                <textarea
                  value={uretilen}
                  onChange={(e) => setUretilen(e.target.value)}
                  rows={5}
                  lang="en"
                  className="w-full resize-y rounded-xl border border-hairline bg-paper px-3 py-2.5
                    text-[14px] leading-relaxed text-ink focus:border-accent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => onMetinHazir(uretilen)}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5
                    text-[13px] font-medium text-white transition-colors
                    hover:bg-accent-700 cursor-pointer"
                >
                  Bu metinle çalış
                </button>
              </div>
            )}
          </div>
        )}

        {tip === 'ses' && (
          <div className="space-y-4 pt-1">
            <p className="max-w-[64ch] text-[12px] leading-relaxed text-ink-3">
              Elindeki hazır dikte kaydını yükle: normal ve yavaş sürüm ayrı
              dosyalar. Kayıtlar tarayıcıdan çıkmıyor, sunucuya gönderilmiyor.
            </p>

            {dosyaSatiri('Normal kayıt', 'Tam hızda okunan sürüm (…-1a.mp3)', normal, normalRef, setNormal)}
            {dosyaSatiri('Yavaş kayıt', 'Ağır okunan sürüm (…-1b.mp3)', yavas, yavasRef, setYavas)}

            <div className="space-y-2">
              <p className="text-[12px] font-medium text-ink-2">Cevap metni</p>
              <p className="text-[11px] text-ink-3">
                Yazdıklarının denetlenebilmesi için gerekiyor. Elinde varsa yapıştır,
                yoksa normal kayıttan çıkarabilirsin — ilk seferde çözümleyici
                modeli indiği için bir dakikayı bulabilir, sonraki seferler hızlı.
              </p>
              <textarea
                value={cevap}
                onChange={(e) => setCevap(e.target.value)}
                rows={4}
                lang="en"
                placeholder="Kaydın metni…"
                className="w-full resize-y rounded-xl border border-hairline bg-paper px-3 py-2.5
                  text-[14px] leading-relaxed text-ink placeholder-ink-3
                  focus:border-accent focus:outline-none"
              />
              <button
                type="button"
                onClick={sestenCikar}
                disabled={!normal || cozumleniyor}
                className="inline-flex items-center gap-2 rounded-xl border border-hairline
                  bg-paper-2 px-3 py-2 text-[12px] font-medium text-ink
                  transition-colors hover:border-accent/40 disabled:opacity-40 cursor-pointer"
              >
                {cozumleniyor ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                {!cozumleniyor
                  ? 'Sesten metni çıkar'
                  : cozumDurumu === 'yukleniyor'
                    ? `Çözümleyici iniyor…${typeof cozumYuzde === 'number' ? ` %${Math.round(cozumYuzde)}` : ''}`
                    : 'Çözümleniyor…'}
              </button>
            </div>

            <button
              type="button"
              onClick={sesiBaslat}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5
                text-[13px] font-medium text-white transition-colors
                hover:bg-accent-700 cursor-pointer"
            >
              Alıştırmayı başlat
            </button>
          </div>
        )}

        {hata && (
          <p className="flex items-center gap-1.5 text-[12px] text-[var(--danger)]">
            <AlertCircle className="h-3.5 w-3.5" /> {hata}
          </p>
        )}
      </div>
    </div>
  );
};
