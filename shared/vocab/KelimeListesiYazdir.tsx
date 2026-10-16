/* YAZDIRILABİLİR KELİME LİSTESİ
 * ============================================================================
 * Süzgeçten geçmiş kartları kâğıda döker: ezberlemek, sınava götürmek ya da
 * birine vermek için. Tarayıcının "PDF olarak kaydet"i de aynı yoldan
 * çalışıyor; ayrı bir PDF kütüphanesi yok (gerekçesi ders raporunda).
 *
 * BİÇİM BU BİLEŞENİN İÇİNDE, index.css'te değil. VocabHub üç uygulamada da
 * (katmanlı, reading, konuşma) kullanılıyor; yazdırma kuralları her birinin
 * index.css'ine kopyalansaydı üçü zamanla birbirinden ayrışırdı. Bileşen
 * kendi kurallarını taşıyor.
 *
 * "KARŞILIĞI GİZLE" sınav kâğıdı için: kelimeler yazılı, karşılıkların yeri
 * boş. Önce listeye bakıp hatırlamaya çalışmak, okumaktan daha iyi çalıştırır.
 */

import React, { useState } from 'react';
import { Printer, X } from 'lucide-react';
import type { VocabCard } from './vocabStore';

interface Props {
  cards: VocabCard[];
  baslik: string;
  onKapat: () => void;
}

const YAZDIRMA_BICIMI = `
@media print {
  @page { size: A4; margin: 16mm 14mm; }

  /* Sayfada yalnızca liste kalıyor; display:none yerine visibility
     çünkü listenin ataları (pencere, örtü) gizlenirken listenin
     kendisi görünür kalmalı. */
  body * { visibility: hidden; }
  #kelime-listesi, #kelime-listesi * { visibility: visible; }

  /* Liste NORMAL AKIŞTA olmalı: sabit konumlanmış bir atanın içinde
     kalırsa tarayıcı onu tek sayfaya sığdırmaya çalışır ve gerisini
     kırpar (aynı tuzak ders raporunda da yaşandı). */
  .kelime-ortu, .kelime-pencere, .kelime-kaydirma {
    position: static !important;
    inset: auto !important;
    display: block !important;
    max-height: none !important;
    height: auto !important;
    overflow: visible !important;
    background: none !important;
    backdrop-filter: none !important;
    padding: 0 !important;
    margin: 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
  }

  .kelime-araclar { display: none !important; }
  #kelime-listesi { position: static; width: auto; padding: 0; }

  /* Satır sayfa ortasından bölünmesin, başlık her sayfada tekrar etsin. */
  #kelime-listesi tr { break-inside: avoid; }
  #kelime-listesi thead { display: table-header-group; }
}
`;

export const KelimeListesiYazdir: React.FC<Props> = ({ cards, baslik, onKapat }) => {
  const [karsiligiGizle, setKarsiligiGizle] = useState(false);
  const [ornekGoster, setOrnekGoster] = useState(false);

  const yazdir = () => {
    /* Tarayıcı PDF'in dosya adını SAYFA BAŞLIĞINDAN alıyor; yazdırma
       boyunca değiştirilip sonra geri konuyor. */
    const eski = document.title;
    document.title = `${baslik} — Kelime Listesi`;
    const geriAl = () => { document.title = eski; };
    window.addEventListener('afterprint', geriAl, { once: true });
    window.print();
    setTimeout(geriAl, 60000);
  };

  return (
    <div
      className="kelime-ortu fixed inset-0 z-50 flex items-start justify-center
        overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm sm:p-6"
      onClick={onKapat}
      role="dialog"
      aria-modal="true"
      aria-label="Kelime listesini yazdır"
    >
      <style>{YAZDIRMA_BICIMI}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        className="kelime-pencere my-8 w-full max-w-3xl overflow-hidden rounded-2xl
          border border-hairline bg-paper-2"
      >
        <div className="kelime-araclar flex flex-wrap items-center justify-between gap-3
          border-b border-hairline px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold tracking-tight text-ink">Kelime listesi</h2>
            <p className="mt-0.5 text-[12px] text-ink-3">{cards.length} kart</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 text-[12px] text-ink-2">
              <input
                type="checkbox"
                checked={karsiligiGizle}
                onChange={(e) => setKarsiligiGizle(e.target.checked)}
                className="cursor-pointer"
              />
              Karşılıkları gizle
            </label>
            <label className="flex items-center gap-1.5 text-[12px] text-ink-2">
              <input
                type="checkbox"
                checked={ornekGoster}
                onChange={(e) => setOrnekGoster(e.target.checked)}
                className="cursor-pointer"
              />
              Örnek cümle
            </label>
            <button
              type="button"
              onClick={yazdir}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2
                text-[13px] font-medium text-white transition-colors
                hover:bg-accent-700 cursor-pointer"
            >
              <Printer className="h-4 w-4" /> Yazdır / PDF
            </button>
            <button
              type="button"
              onClick={onKapat}
              aria-label="Kapat"
              className="rounded-lg p-1.5 text-ink-3 transition-colors
                hover:bg-paper-3 hover:text-ink cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="kelime-kaydirma max-h-[70vh] overflow-y-auto p-5">
          <div id="kelime-listesi" className="bg-white p-1 text-[#1C1917]">
            <h1 className="text-[18px] font-semibold">{baslik}</h1>
            <p className="mt-0.5 text-[11px] text-[#78716C]">
              {cards.length} kelime · {new Date().toLocaleDateString('tr-TR')}
            </p>

            <table className="mt-4 w-full border-collapse text-[12px]"
              style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th className="border-b border-[#1C1917] px-2 py-1.5 text-left text-[10px]
                    font-semibold uppercase tracking-wider text-[#78716C]" style={{ width: '32%' }}>
                    Kelime
                  </th>
                  <th className="border-b border-[#1C1917] px-2 py-1.5 text-left text-[10px]
                    font-semibold uppercase tracking-wider text-[#78716C]">
                    Türkçesi
                  </th>
                </tr>
              </thead>
              <tbody>
                {cards.map((c) => (
                  <tr key={c.id}>
                    <td className="border-b border-[#E7E5E4] px-2 py-1.5 align-top" lang="en">
                      <span className="font-semibold">{c.front}</span>
                      {c.ipa && (
                        <span className="ml-1.5 text-[10px] text-[#78716C]">{c.ipa}</span>
                      )}
                      {ornekGoster && c.exampleEn && (
                        <span className="mt-0.5 block text-[10.5px] italic text-[#57534E]">
                          {c.exampleEn}
                        </span>
                      )}
                    </td>
                    <td className="border-b border-[#E7E5E4] px-2 py-1.5 align-top" lang="tr">
                      {/* Karşılık gizliyken satır boş KALMIYOR, çizgi
                          kalıyor: üzerine elle yazılabilsin. */}
                      {karsiligiGizle
                        ? <span className="inline-block w-full border-b border-dotted border-[#D6D3D1]">&nbsp;</span>
                        : c.back}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
