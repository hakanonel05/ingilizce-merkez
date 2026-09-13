/**
 * YEREL ÇÖZÜMLEME SONUCU — Gemini'ye ulaşılamadığında gösterilen.
 *
 * NEDEN VAR: telaffuz değerlendirmesinin bulut yedeği yok (Groq ses almıyor)
 * ve Gemini'nin günlük ücretsiz kotası gerçekten doluyor. Önce bu durumda
 * ekran tamamen boş bir hata mesajına düşüyordu — kullanıcı okumuş, kaydı
 * gitmiş, karşılığında hiçbir şey almamış oluyordu.
 *
 * OYSA ÖLÇÜLEBİLECEK ŞEYLER VAR ve hepsi TARAYICIDA. Katmanlı uygulamadaki
 * gölgeleme paneli bunu zaten yapıyor: Whisper kaydı yazıya çeviriyor,
 * Needleman-Wunsch hizalaması hedef cümleyle karşılaştırıyor, duraksamalar
 * doğrudan dalga biçiminden ölçülüyor (bkz. shared/ses/konusmaCozumleme.ts).
 * Burada o motor yeniden kullanılıyor; yeni bir şey hesaplanmıyor.
 *
 * NE ÖLÇÜLÜR / NE ÖLÇÜLMEZ — ekranda da aynen yazıyor, çünkü bu ekranı
 * tam değerlendirme sanmak kullanıcıyı yanıltır:
 *   ÖLÇÜLÜR   hangi kelimeyi atladın, fazladan ne söyledin, hangi kelime
 *             başka bir kelimeye kaydı, konuşma hızın, duraksamaların
 *   ÖLÇÜLMEZ  fonem düzeyinde hata ("th sesi"), tonlama, IPA tüyosu
 *
 * KAYDEDİLMİYOR. İlerleme ekranındaki telaffuz eğrisi tam değerlendirme
 * puanlarından oluşuyor; buradaki kelime düzeyi ölçümü oraya karışsaydı
 * eğri iki farklı şeyi aynı çizgide gösterirdi.
 */

import React from 'react';
import { CloudOff, Info } from 'lucide-react';
import type { KayitAnalizi, KelimeSonucu } from '../../../../shared/ses/konusmaCozumleme';

/** Renkler katmanlıdaki kayıt analiziyle AYNI: aynı şey, aynı dil. */
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

interface Props {
  analiz: KayitAnalizi;
  /** Sunucudan dönen asıl hata — neden buraya düştüğümüzü söylüyor. */
  sebep: string;
}

export const YerelTelaffuzSonucu: React.FC<Props> = ({ analiz, sebep }) => (
  <div className="space-y-6">

    <div className="flex items-start gap-2 rounded-xl border border-marker bg-marker-bg p-4">
      <CloudOff className="mt-0.5 h-4 w-4 shrink-0 text-marker-ink" />
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-marker-ink">
          Tam değerlendirme yapılamadı — kaydın tarayıcında çözümlendi.
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-marker-ink">{sebep}</p>
        <p className="mt-2 text-[12px] leading-relaxed text-marker-ink">
          Aşağıdakiler <strong>kelime düzeyinde</strong> ölçüldü ve senin
          cihazından çıkmadı. Fonem hataları, tonlama ve IPA önerileri için
          tam değerlendirme gerekiyor.
        </p>
      </div>
    </div>

    <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
      <div>
        <span className="eyebrow block">Kelime doğruluğu</span>
        <span className="mt-1 block text-[52px] font-semibold leading-none tracking-tight text-ink">
          {analiz.dogrulukPuani}
        </span>
        <span className="text-[12px] text-ink-3">100 üzerinden</span>
      </div>
      <div>
        <span className="eyebrow block">Akıcılık</span>
        <span className="mt-1 block text-[52px] font-semibold leading-none tracking-tight text-ink">
          {analiz.akicilikPuani}
        </span>
        <span className="text-[12px] text-ink-3">100 üzerinden</span>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border
      border-hairline bg-paper-2 px-4 py-3 text-[13px] text-ink-2">
      <span>
        <span className="timecode text-[14px] font-semibold text-ink">
          {analiz.akicilik.kelimeHizi}
        </span> kelime/dk
      </span>
      <span>
        <span className="timecode text-[14px] font-semibold text-ink">
          {analiz.akicilik.konusmaSuresi.toFixed(0)}
        </span> saniye
      </span>
      <span>
        <span className="timecode text-[14px] font-semibold text-ink">
          {analiz.akicilik.duraklamaSayisi}
        </span> uzun duraksama
      </span>
      {analiz.akicilik.enUzunDuraklama > 0 && (
        <span>
          en uzunu <span className="timecode text-[14px] font-semibold text-ink">
            {analiz.akicilik.enUzunDuraklama}
          </span> sn
        </span>
      )}
    </div>

    <section className="border-t border-hairline pt-6">
      <h3 className="eyebrow mb-1">Nasıl okudun</h3>
      <p className="mb-3 max-w-[64ch] text-[12px] leading-relaxed text-ink-3">
        Kehribar = başka bir kelimeye yakın duyuldu (telaffuz kaymış olabilir),
        kırmızı = bambaşka bir kelime duyuldu, üzeri çizili = hiç duyulmadı.
      </p>
      <p className="transcript-en max-w-[62ch] leading-[2.1]">
        {analiz.kelimeler.map((k, i) => (
          <span
            key={i}
            title={k.duyulan ? `duyulan: ${k.duyulan}` : 'duyulmadı'}
            className={`mr-1.5 rounded px-0.5 ${kelimeSinifi(k.durum)}`}
          >
            {k.hedef}
          </span>
        ))}
      </p>

      {analiz.fazladan.length > 0 && (
        <p className="mt-4 max-w-[62ch] text-[13px] leading-relaxed text-ink-2">
          Metinde olmayıp söylediklerin:{' '}
          <span className="text-danger">{analiz.fazladan.join(', ')}</span>
        </p>
      )}
    </section>

    <section className="border-t border-hairline pt-6">
      <h3 className="eyebrow mb-2">Çözümleyicinin duyduğu</h3>
      <p className="transcript-en max-w-[62ch] text-ink-2">{analiz.duyulanMetin}</p>
    </section>

    <p className="flex items-start gap-2 border-t border-hairline pt-4 text-[11px]
      leading-relaxed text-ink-3">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      Bu çözümleme kaydedilmedi: İlerleme ekranındaki telaffuz eğrisi tam
      değerlendirme puanlarından oluşuyor, kelime düzeyi ölçümü oraya
      karışırsa eğri iki farklı şeyi aynı çizgide gösterir. Kota açılınca
      aynı metni tekrar okuyabilirsin.
    </p>
  </div>
);
