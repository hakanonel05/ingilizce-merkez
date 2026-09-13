/**
 * TELAFFUZ DEĞERLENDİRME SONUCU
 *
 * AI Studio sürümünde bu ekran 1457 satırdı: ses oynatıcı, dalga formu,
 * kaydırma çubuğu, kelimeye atlama, kelime zamanını elle kaydırma, hata
 * filtresi anahtarları, indirme ve Markdown kopyalama. Buraya taşınan
 * çekirdek; gerisi bilerek dışarıda kaldı ve her birinin sebebi var:
 *
 *   ZAMANA ATLAMA YOK — ölçtüm, modelin verdiği zaman damgaları yanlış:
 *     cümlenin sonundaki bir kelime için "00.0s - 00.4s" yazıyordu.
 *     Tıklayınca yanlış yere giden bir kelime, hiç tıklanamayan bir
 *     kelimeden kötü. (Aynı ders Whisper tarafında da alınmıştı, bkz.
 *     shared/ses/konusmaCozumleme.ts 4. bölüm.)
 *   FİLTRE ANAHTARLARI YOK — beş hata türü için beş açma/kapama, beş
 *     kelimelik bir cümlede gösterecek bir şey bırakmıyor.
 *   DALGA FORMU YOK — söylediği tek şey "ses var".
 *
 * RENKLER KATMANLI'DAKİ KAYIT ANALİZİYLE AYNI DİLDE: kehribar = kaymış,
 * kırmızı = yanlış, üzeri çizili gri = atlanmış. Aynı sitede aynı şeyi
 * iki farklı renkle göstermek, rengi anlamsızlaştırır.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Volume2, Info, Play, Repeat2, Loader2 } from 'lucide-react';
import { parseAssessmentReport, type ParsedSentenceToken } from '../lib/telaffuzRaporu';
import { dogruOkunusuCal, kendiKesitiniCal, karsilastir, sesiDurdur } from '../lib/sesCalma';

interface Props {
  /** Ham Markdown rapor. */
  rapor: string;
  hedefMetin: string;
  /** Kaydı tekrar dinlemek için; oturum boyunca bellekte, saklanmıyor. */
  sesUrl?: string | null;
}

/** Puan bandı — eşikler raporun kendi ölçeğiyle aynı (0-59 / 60-79 / 80-100). */
function puanRengi(puan: number): string {
  if (puan >= 80) return 'text-ok-strong';
  if (puan >= 60) return 'text-marker-ink';
  return 'text-danger';
}

function puanEtiketi(puan: number): string {
  if (puan >= 80) return 'iyi';
  if (puan >= 60) return 'orta';
  return 'düşük';
}

const Metrik: React.FC<{ ad: string; puan: number; aciklama: string }> = ({ ad, puan, aciklama }) => (
  <div>
    <div className="flex items-baseline gap-2">
      <span className={`timecode text-[20px] font-semibold ${puanRengi(puan)}`}>{puan}</span>
      <span className="text-[13px] text-ink">{ad}</span>
    </div>
    {/* Çubuk sayıyı tekrar etmiyor, KIYASLANABİLİR yapıyor: dört metrik
        yan yana dururken hangisinin geride kaldığı okumadan görünüyor. */}
    <div className="mt-1.5 h-1 w-full rounded-full bg-paper-3">
      <div
        className="h-1 rounded-full bg-accent"
        style={{ width: `${Math.max(0, Math.min(100, puan))}%` }}
      />
    </div>
    <p className="mt-1 text-[11px] leading-relaxed text-ink-3">{aciklama}</p>
  </div>
);

function kelimeSinifi(tur: ParsedSentenceToken['type']): string {
  switch (tur) {
    case 'mispronounced':
      return 'text-marker-ink bg-marker-bg border-b border-marker cursor-pointer';
    case 'omission':
      return 'text-ink-3 line-through decoration-ink-3';
    case 'addition':
      return 'text-danger bg-danger-soft border-b border-danger-line';
    default:
      return 'text-ink';
  }
}

/**
 * SES DÜĞMELERİ — bir kelime için "doğrusunu dinle / seninkini dinle /
 * karşılaştır".
 *
 * "Seninkini dinle" YALNIZCA iki şart birden varsa çıkıyor: kayıt hâlâ
 * bellekte (yani alıştırmadan hemen sonra bakıyorsun) VE model o kelime
 * için bir zaman aralığı vermiş. Geçmişten bir rapora bakarken kayıt yok,
 * çünkü saklanmıyor — düğmeyi orada gösterip tıklanınca hiçbir şey
 * olmaması, hiç göstermemekten kötü.
 */
const SesDugmeleri: React.FC<{
  kelime: string;
  sesUrl?: string | null;
  bas?: number;
  son?: number;
}> = ({ kelime, sesUrl, bas, son }) => {
  const [calisan, setCalisan] = useState<'dogru' | 'benim' | 'kiyas' | null>(null);
  const [hata, setHata] = useState(false);

  const kesitVar = !!sesUrl && typeof bas === 'number' && typeof son === 'number';

  const calistir = async (ne: 'dogru' | 'benim' | 'kiyas', is: () => Promise<void>) => {
    setHata(false);
    setCalisan(ne);
    try {
      await is();
    } catch {
      setHata(true);
    } finally {
      setCalisan(null);
    }
  };

  const dugme = (
    ne: 'dogru' | 'benim' | 'kiyas',
    etiket: string,
    ikon: React.ReactNode,
    is: () => Promise<void>,
    dolu = false
  ) => (
    <button
      type="button"
      onClick={() => calistir(ne, is)}
      disabled={calisan !== null}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium
        transition-colors disabled:opacity-50 cursor-pointer
        ${dolu
          ? 'bg-accent text-white hover:bg-accent-700'
          : 'border border-hairline text-ink-2 hover:bg-paper-3 hover:text-ink'}`}
    >
      {calisan === ne ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : ikon}
      {etiket}
    </button>
  );

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap gap-2">
        {dugme('dogru', 'Doğru okunuşu dinle', <Volume2 className="h-3.5 w-3.5" />,
          () => dogruOkunusuCal(kelime), true)}
        {kesitVar && dugme('benim', 'Senin söyleyişin', <Play className="h-3.5 w-3.5" />,
          () => kendiKesitiniCal(sesUrl!, bas!, son!))}
        {kesitVar && dugme('kiyas', 'Karşılaştır', <Repeat2 className="h-3.5 w-3.5" />,
          () => karsilastir(kelime, sesUrl, bas, son))}
      </div>
      {kesitVar && (
        /* Zaman aralığının YAKLAŞIK olduğunu yazmak zorundayız: ölçtüm,
           model bazen cümle sonundaki bir kelime için "00.0s" veriyor.
           Sessizce yanlış yeri çalmak kullanıcıyı kendi telaffuzu
           hakkında yanıltır. */
        <p className="text-[11px] text-ink-3">
          Kesit <span className="timecode">{bas!.toFixed(1)}s–{son!.toFixed(1)}s</span> —
          model verdiği için yaklaşık; yanlış yere denk gelebiliyor.
        </p>
      )}
      {hata && (
        <p className="text-[11px] text-danger">Ses çalınamadı.</p>
      )}
    </div>
  );
};

export const TelaffuzSonucu: React.FC<Props> = ({ rapor, hedefMetin, sesUrl }) => {
  const cozum = useMemo(() => parseAssessmentReport(rapor, hedefMetin), [rapor, hedefMetin]);
  const [secili, setSecili] = useState<ParsedSentenceToken | null>(null);

  /* Ekrandan çıkarken çalan sesi kes: kullanıcı sekme değiştirdiğinde
     arkadan konuşmaya devam eden bir ses rahatsız edici. */
  useEffect(() => () => sesiDurdur(), []);

  /* Yapılandırılmış hâle sokulamamış maddeler — düz metin olarak
     gösterilecekler. `raw` üzerinden eşleştiriliyor: ayrıştırıcı bir
     maddeyi tanıdıysa onu ikinci kez yazmayalım. */
  const duzMetinler = useMemo(() => {
    const taninan = new Set(cozum.parsedSuggestions.map((o) => o.raw));
    return cozum.suggestions.filter((o) => !taninan.has(o));
  }, [cozum]);

  /* HATA ÖZETİ — SIFIRLAR DA GÖSTERİLİYOR, ve bu depodaki genel kuralın
     ("sıfır bir bilgi değil, gösterme") bilinçli istisnası. Burada sıfır
     GERÇEKTEN bilgi: "0 atlanan" senin hiçbir kelimeyi yutmadığını
     söylüyor. Satırı gizlemek, iyi gittiğin yeri de görünmez yapardı. */
  const h = cozum.errors;
  const hataDokumu = [
    { ad: 'hatalı telaffuz', deger: h.mispronounced },
    { ad: 'atlanan kelime', deger: h.omission },
    { ad: 'fazladan kelime', deger: h.addition },
    { ad: 'beklenmeyen duraklama', deger: h.unexpectedPause },
    { ad: 'eksik duraklama', deger: h.missingPause },
    { ad: 'monoton okuma', deger: h.monotone },
  ];

  return (
    <div className="space-y-6">

      {/* GENEL PUAN */}
      <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
        <div>
          <span className="eyebrow block">Telaffuz puanı</span>
          <span className={`mt-1 block text-[52px] font-semibold leading-none tracking-tight ${puanRengi(cozum.overallScore)}`}>
            {cozum.overallScore}
          </span>
          <span className="text-[12px] text-ink-3">100 üzerinden · {puanEtiketi(cozum.overallScore)}</span>
        </div>
        <div className="min-w-[240px] flex-1">
          <p className="text-[12px] text-ink-3">Okuman istenen</p>
          <p className="transcript-en mt-1 max-w-[62ch] text-ink-2">{cozum.targetText || hedefMetin}</p>
        </div>
      </div>

      {/* HATA DÖKÜMÜ */}
      <ul className="flex flex-wrap gap-x-6 gap-y-2 rounded-xl border border-hairline
        bg-paper-2 px-4 py-3">
        {hataDokumu.map((k) => (
          <li key={k.ad} className="flex items-baseline gap-1.5">
            <span className={`timecode text-[15px] font-semibold ${
              k.deger > 0 ? 'text-danger' : 'text-ink-3'
            }`}>
              {k.deger}
            </span>
            <span className={`text-[12px] ${k.deger > 0 ? 'text-ink-2' : 'text-ink-3'}`}>
              {k.ad}
            </span>
          </li>
        ))}
      </ul>

      {sesUrl && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-hairline
          bg-paper-2 px-4 py-3">
          <span className="flex items-center gap-2 text-[12px] text-ink-3">
            <Volume2 className="h-3.5 w-3.5" />
            Kendi kaydın
          </span>
          <audio src={sesUrl} controls className="h-8 min-w-0 flex-1" />
          <span className="text-[11px] text-ink-3">bu sayfadan çıkınca silinir</span>
        </div>
      )}

      {/* İŞARETLENMİŞ CÜMLE */}
      <section className="border-t border-hairline pt-6">
        <h3 className="eyebrow mb-1">Nasıl okudun</h3>
        <p className="mb-3 max-w-[64ch] text-[12px] leading-relaxed text-ink-3">
          Kehribar = telaffuzu kaymış, üzeri çizili = atlanmış, kırmızı =
          metinde olmayan fazladan kelime, <span className="timecode">[--]</span> =
          yersiz duraklama. Kehribar bir kelimeye tıklayınca IPA okunuşu ve
          tüyo çıkar.
        </p>

        <p className="transcript-en max-w-[62ch] leading-[2.1]">
          {cozum.tokens.map((token) => {
            if (token.type === 'pause') {
              return (
                <span key={token.id} className="timecode mx-1 rounded bg-paper-3 px-1 text-ink-3">
                  [--]
                </span>
              );
            }
            const tiklanabilir = token.type === 'mispronounced' && !!token.phoneticDetail;
            return (
              <span
                key={token.id}
                onClick={tiklanabilir ? () => setSecili(secili?.id === token.id ? null : token) : undefined}
                className={`mr-1.5 rounded px-0.5 ${kelimeSinifi(token.type)}`}
              >
                {token.text}
              </span>
            );
          })}
        </p>

        {secili?.phoneticDetail && (
          <div className="mt-4 max-w-[62ch] rounded-xl border border-hairline bg-paper-2 p-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[15px] font-semibold text-ink">{secili.cleanWord}</span>
              <span className="timecode text-[14px] text-brand-strong">
                {secili.phoneticDetail.ipa}
              </span>
              {secili.phoneticDetail.stress && (
                <span className="text-[12px] text-ink-3">vurgu: {secili.phoneticDetail.stress}</span>
              )}
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
              {secili.phoneticDetail.tip}
            </p>
            <SesDugmeleri
              kelime={secili.cleanWord}
              sesUrl={sesUrl}
              bas={secili.timeRange?.start}
              son={secili.timeRange?.end}
            />
          </div>
        )}
      </section>

      {/* METRİKLER */}
      <section className="border-t border-hairline pt-6">
        <h3 className="eyebrow mb-4">Puan dökümü</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Metrik ad="Doğruluk" puan={cozum.metrics.accuracy} aciklama="Seslerin doğru çıkarılması" />
          <Metrik ad="Akıcılık" puan={cozum.metrics.fluency} aciklama="Tempo ve takılmadan okuma" />
          <Metrik ad="Tamamlanma" puan={cozum.metrics.completeness} aciklama="Metnin ne kadarını okudun" />
          <Metrik ad="Tonlama" puan={cozum.metrics.prosody} aciklama="Vurgu ve ezgi" />
        </div>
      </section>

      {/* ÖNERİLER

          İKİ TÜR MADDE VAR ve ikisi de gösteriliyor. Kelime düzeyindeki
          düzeltmeler (kalın kelime + IPA) yapılandırılmış olarak, düz
          metin maddeler ("belirgin bir hata tespit edilmemiştir" gibi)
          olduğu gibi. Önce yalnızca yapılandırılmış olanlar çiziliyordu ve
          düz metin maddeler SESSİZCE kayboluyordu — hata yapılmayan bir
          okumada bölüm tamamen boş kalıyordu. */}
      {(cozum.parsedSuggestions.length > 0 || cozum.suggestions.length > 0) && (
        <section className="border-t border-hairline pt-6">
          <h3 className="eyebrow mb-4">Düzeltme önerileri</h3>
          <ul className="divide-y divide-hairline">
            {cozum.parsedSuggestions.map((o, i) => (
              <li key={i} className="py-3">
                <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className="text-[14px] font-medium text-ink">{o.word}</span>
                  {o.ipa && (
                    <span className="timecode text-[13px] text-brand-strong">{o.ipa}</span>
                  )}
                </p>
                <p className="mt-1 max-w-[68ch] text-[13px] leading-relaxed text-ink-2">{o.tip}</p>
                <SesDugmeleri
                  kelime={o.cleanWord || o.word}
                  sesUrl={sesUrl}
                  bas={o.timeRange?.start}
                  son={o.timeRange?.end}
                />
              </li>
            ))}
          </ul>

          {duzMetinler.length > 0 && (
            <ul className="mt-4 max-w-[68ch] space-y-2 text-[13px] leading-relaxed text-ink-2">
              {duzMetinler.map((o, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden="true" className="text-ink-3">·</span>
                  {/* Markdown işaretleri ekranda ham görünmesin. */}
                  {o.replace(/\*\*/g, '').replace(/^\s*[:\-–]\s*/, '')}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* ÖLÇÜLEMEYEN NE — gizlemek kullanıcıyı yanlış yönlendirirdi.
          Aynı dürüstlük notu katmanlıdaki kayıt analizinde de var. */}
      <p className="flex items-start gap-2 border-t border-hairline pt-4 text-[11px]
        leading-relaxed text-ink-3">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Puanlar bir modelin dinleyip verdiği değerlendirmedir, ölçüm aleti
        çıktısı değil. Aynı kaydı iki kez gönderirsen puanlar birkaç birim
        oynayabilir; bakılacak şey tek bir sayı değil, hangi kelimelerin
        tekrar tekrar işaretlendiği.
      </p>
    </div>
  );
};
