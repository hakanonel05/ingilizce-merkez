/**
 * İLERLEME
 *
 * Üç soru cevaplanıyor ve üçü de kayıtlardan TÜRETİLİYOR; ayrıca bir
 * "ilerleme" tablosu tutulmuyor. Sebebi şu: seviye, hız ve hata konuları
 * zaten her çözümlemenin içinde duruyor; ikinci bir yerde özet tutmak,
 * bir kayıt silindiğinde özetin yalan söylemesi demek olurdu.
 *
 *   1. Seviyem yükseliyor mu?      -> CEFR eğrisi
 *   2. Daha uzun/akıcı konuşuyor muyum?  -> kelime sayısı ve hız
 *   3. Hangi hatayı tekrar tekrar yapıyorum?  -> kural sayımı
 *
 * ÜÇÜNCÜSÜ EN DEĞERLİSİ. Tek bir çözümlemede "artikel hatası" görmek bir
 * şey söylemez; on çözümlemenin sekizinde görmek ne çalışman gerektiğini
 * söyler. Bu sayım tek bir alıştırma ekranında ASLA görünemez.
 *
 * GRAFİK ELDE ÇİZİLİYOR (recharts değil): shared/analytics/Dashboard.tsx
 * de aynı şeyi yapıyor. Otuz satırlık SVG için 100 KB'lık bir kütüphaneyi
 * ilk açılışa bindirmek gerekmiyor, ve renkler CSS değişkenlerinden
 * geldiği için palet değişince grafik de değişiyor.
 */

import React, { useMemo } from 'react';
import { CEFR_SIRASI, cefrPuani, type BetimlemeKaydi } from '../types';

interface Props {
  kayitlar: BetimlemeKaydi[];
}

const Sayi: React.FC<{ deger: React.ReactNode; etiket: string }> = ({ deger, etiket }) => (
  <div>
    <div className="text-[30px] font-semibold leading-none tracking-tight text-ink">{deger}</div>
    <div className="mt-1.5 text-[12px] text-ink-3">{etiket}</div>
  </div>
);

/** CEFR eğrisi. Y ekseni 1-6 (A1-C2); ara değer yok, seviye sürekli değil. */
const SeviyeEgrisi: React.FC<{ noktalar: { x: number; y: number; etiket: string }[] }> = ({ noktalar }) => {
  if (noktalar.length < 2) return null;

  const G = 600;
  const Y = 160;
  const SOL = 28;   // Y ekseni etiketlerine yer
  const PAY = 12;

  const xler = noktalar.map((p) => p.x);
  const enKucukX = Math.min(...xler);
  const enBuyukX = Math.max(...xler);
  const araX = enBuyukX - enKucukX || 1;

  const xe = (x: number) => SOL + ((x - enKucukX) / araX) * (G - SOL - PAY);
  const ye = (y: number) => Y - PAY - ((y - 1) / (CEFR_SIRASI.length - 1)) * (Y - PAY * 2);

  const yol = noktalar
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xe(p.x).toFixed(1)},${ye(p.y).toFixed(1)}`)
    .join(' ');

  return (
    <svg viewBox={`0 0 ${G} ${Y}`} className="h-40 w-full" role="img"
      aria-label="Betimleme seviyesinin zaman içindeki değişimi">
      {CEFR_SIRASI.map((ad, i) => (
        <g key={ad}>
          <line
            x1={SOL} y1={ye(i + 1)} x2={G - PAY} y2={ye(i + 1)}
            style={{ stroke: 'var(--hairline)' }} strokeWidth={1}
          />
          <text
            x={0} y={ye(i + 1) + 3}
            style={{ fill: 'var(--ink-3)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          >
            {ad}
          </text>
        </g>
      ))}
      <path d={yol} fill="none" style={{ stroke: 'var(--accent)' }} strokeWidth={2}
        vectorEffect="non-scaling-stroke" />
      {noktalar.map((p, i) => (
        <circle key={i} cx={xe(p.x)} cy={ye(p.y)} r={3.5} style={{ fill: 'var(--accent)' }}>
          <title>{p.etiket}</title>
        </circle>
      ))}
    </svg>
  );
};

export const Ilerleme: React.FC<Props> = ({ kayitlar }) => {
  /* Kayıtlar yeniden eskiye geliyor; grafik ve ortalamalar için eskiden
     yeniye gerekli. */
  const eskidenYeniye = useMemo(
    () => [...kayitlar].sort((a, b) => a.olusturuldu - b.olusturuldu),
    [kayitlar]
  );

  const ozet = useMemo(() => {
    if (!kayitlar.length) return null;
    const toplamKelime = kayitlar.reduce((t, k) => t + k.kelimeSayisi, 0);
    const toplamHiz = kayitlar.reduce((t, k) => t + k.akicilik.kelimeHizi, 0);
    const enYuksek = kayitlar.reduce(
      (en, k) => (cefrPuani(k.analiz.cefr) > cefrPuani(en) ? k.analiz.cefr : en),
      kayitlar[0].analiz.cefr
    );
    return {
      adet: kayitlar.length,
      ortKelime: Math.round(toplamKelime / kayitlar.length),
      ortHiz: Math.round(toplamHiz / kayitlar.length),
      enYuksek,
      /* Son beşin seviyesi — tek bir iyi gün "seviyem C1" dedirtmesin. */
      sonBes: (() => {
        const son = eskidenYeniye.slice(-5);
        const ort = son.reduce((t, k) => t + cefrPuani(k.analiz.cefr), 0) / son.length;
        return CEFR_SIRASI[Math.max(0, Math.round(ort) - 1)];
      })(),
    };
  }, [kayitlar, eskidenYeniye]);

  /** Kural adına göre sayım — "hangi konuyu çalışmalıyım" sorusunun cevabı. */
  const kuralSayimi = useMemo(() => {
    const sayac = new Map<string, number>();
    for (const k of kayitlar) {
      for (const h of k.analiz.gramerHatalari || []) {
        const ad = (h.kuralTr || '').trim();
        if (!ad) continue;
        sayac.set(ad, (sayac.get(ad) || 0) + 1);
      }
    }
    return [...sayac.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [kayitlar]);

  const kelimeSayimi = useMemo(() => {
    const sayac = new Map<string, { oneri: string; adet: number }>();
    for (const k of kayitlar) {
      for (const s of k.analiz.kelimeSecimi || []) {
        const anahtar = (s.kullanilan || '').trim().toLowerCase();
        if (!anahtar) continue;
        const mevcut = sayac.get(anahtar);
        if (mevcut) mevcut.adet += 1;
        else sayac.set(anahtar, { oneri: s.oneri, adet: 1 });
      }
    }
    return [...sayac.entries()]
      .filter(([, v]) => v.adet > 1)
      .sort((a, b) => b[1].adet - a[1].adet)
      .slice(0, 8);
  }, [kayitlar]);

  if (!ozet) {
    return (
      <div className="max-w-[60ch] space-y-3">
        <h1 className="text-[22px] font-semibold tracking-tight text-ink">İlerleme</h1>
        <p className="text-[14px] leading-relaxed text-ink-2">
          Burası ilk betimlemeden sonra dolmaya başlar. İki betimlemeden sonra
          seviye eğrisi, birkaç betimlemeden sonra da tekrarlayan hata konuların
          görünür olur.
        </p>
      </div>
    );
  }

  const noktalar = eskidenYeniye.map((k) => ({
    x: k.olusturuldu,
    y: cefrPuani(k.analiz.cefr),
    etiket: `${new Date(k.olusturuldu).toLocaleDateString('tr-TR')} — ${k.analiz.cefr}`,
  }));

  return (
    <div className="space-y-10">
      <h1 className="text-[22px] font-semibold tracking-tight text-ink">İlerleme</h1>

      <div className="flex flex-wrap gap-x-12 gap-y-6">
        <Sayi deger={ozet.adet} etiket="betimleme" />
        <Sayi deger={ozet.sonBes} etiket="son beş betimlemenin seviyesi" />
        <Sayi deger={ozet.enYuksek} etiket="ulaştığın en yüksek seviye" />
        <Sayi deger={ozet.ortKelime} etiket="ortalama kelime" />
        <Sayi deger={ozet.ortHiz} etiket="ortalama kelime/dk" />
      </div>

      {noktalar.length >= 2 && (
        <section className="border-t border-hairline pt-6">
          <h2 className="eyebrow mb-1">Seviye eğrisi</h2>
          <p className="mb-4 max-w-[64ch] text-[12px] leading-relaxed text-ink-3">
            Her nokta bir betimleme. Eğrinin inip çıkması normal: seviye
            görselin zorluğuna ve o günkü hâline göre değişiyor. Bakılacak
            şey tek noktalar değil, genel yön.
          </p>
          <SeviyeEgrisi noktalar={noktalar} />
        </section>
      )}

      {kuralSayimi.length > 0 && (
        <section className="border-t border-hairline pt-6">
          <h2 className="eyebrow mb-1">Tekrarlayan gramer konuların</h2>
          <p className="mb-4 max-w-[64ch] text-[12px] leading-relaxed text-ink-3">
            Bütün betimlemelerinde kaç kez düzeltildiği. Listenin başındaki
            konu, çalışman gereken konu.
          </p>
          <ul className="max-w-[520px] space-y-2">
            {kuralSayimi.map(([ad, adet]) => (
              <li key={ad} className="flex items-center gap-3">
                <span className="min-w-0 flex-1 truncate text-[14px] text-ink">{ad}</span>
                {/* Çubuk: sayıyı okumadan da sıralamayı gösteriyor.
                    Genişlik en sık hataya göre oranlı. */}
                <span
                  aria-hidden="true"
                  className="h-1.5 rounded-full bg-accent"
                  style={{ width: `${Math.round((adet / kuralSayimi[0][1]) * 120)}px` }}
                />
                <span className="timecode w-6 shrink-0 text-right text-ink-2">{adet}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {kelimeSayimi.length > 0 && (
        <section className="border-t border-hairline pt-6">
          <h2 className="eyebrow mb-1">Birden fazla kez düzeltilen kelimeler</h2>
          <p className="mb-4 max-w-[64ch] text-[12px] leading-relaxed text-ink-3">
            Aynı kelimeye ikinci kez dokunulduysa alışkanlık hâline gelmiş
            demektir.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {kelimeSayimi.map(([kelime, v]) => (
              <li key={kelime} className="text-[14px]">
                <span className="text-danger line-through decoration-danger/50">{kelime}</span>
                <span className="text-ink-3"> → </span>
                <span className="font-medium text-ok-strong">{v.oneri}</span>
                <span className="timecode ml-1.5 text-ink-3">{v.adet}×</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
