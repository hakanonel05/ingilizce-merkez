/**
 * METOT REHBERİ
 *
 * Bu bir OKUMA METNİ, pano değil. Önceki sürümde yedi katman iki sütunlu
 * bir kart ızgarasındaydı: her biri kendi kenarlıklı kutusunda, tepesinde
 * ikonlu ve büyük harfli bir etiketle ("1. KATMAN: ..."), yedincisi de iki
 * sütuna yayılıp farklı bir zemin rengi alıyordu. Yanına iki renkli
 * uyarı kutusu daha ekleniyordu (menekşe "Neden?", yeşil "Hedef").
 *
 * Sorun şu: kutular kıyaslanacak seçenekleri işaret eder. Bu yedi katman
 * seçenek değil, SIRALI adımlar — biri bitince diğeri başlıyor. Numaralı
 * bir liste bunu kutulardan çok daha doğru anlatıyor ve metin okunacak
 * bir şey olduğu için satır uzunluğu da sınırlandı.
 */

import React from 'react';
import { X } from 'lucide-react';

interface MethodologyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Yedi katman, sırasıyla. Metinler rehberin kendisi. */
const LAYERS: { title: string; body: string }[] = [
  {
    title: 'Çift dilli okuma',
    body: 'Solda İngilizce, sağda Türkçe. Kelime ezberlemek için değil, cümle içindeki anlam ağlarını zihinde oturtmak için okunur.',
  },
  {
    title: 'Aktif dinleme',
    body: 'Video oynarken metni gözle takip et. Bu adım fonetik bilgini ve kelimelerin ses karşılıklarını yerleştirir.',
  },
  {
    title: 'Sesli okuma (gölgeleme)',
    body: 'Videoyu tekrar aç ve konuşmacıyla birlikte sesli oku. Dil bir kas grubudur; sesli okuma o kasları esnetir.',
  },
  {
    title: 'Altyazısız izleme',
    body: 'Altyazıyı tamamen kapat. %100 anlamak zorunda değilsin; başlangıçta %60-70 yakalamak yeterli.',
  },
  {
    title: 'Sadece dinleme',
    body: 'Görüntü, jest ve slayt desteği olmadan yalnızca sesi dinle. Beyni doğrudan sese odaklar.',
  },
  {
    title: 'Özet ve yorum yazma',
    body: 'Aklında kalanı çeviri yapmadan doğrudan İngilizce yaz, sonra kendi yorumunu ekle. Bilgiyi kendi bağlamına çeker.',
  },
  {
    title: 'Sesli anlatım ve konuşma',
    body: 'Yazdığın özeti birkaç kez oku, sonra kendi kendine sesli anlat. Dışarıda kulaklıkla yürürken biriyle konuşuyormuş gibi tekrar edebilirsin.',
  },
];

export const MethodologyGuideModal: React.FC<MethodologyGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Metot rehberi"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-hairline bg-paper-2"
      >
        <div className="flex items-start justify-between gap-4 border-b border-hairline px-6 py-4">
          <div className="min-w-0">
            <h2 className="text-[17px] font-semibold tracking-tight text-ink">
              Katmanlı çalışma yöntemi
            </h2>
            <p className="mt-0.5 text-[12px] text-ink-3">
              Tek içerik, yedi katman
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="shrink-0 rounded-lg p-1.5 text-ink-3 transition-colors
              hover:bg-paper-3 hover:text-ink cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-8 overflow-y-auto px-6 py-6">

          <p className="max-w-[62ch] text-[14px] leading-relaxed text-ink-2">
            Gramer kitabını baştan sona çalışmak yorucu ve verimsizdir.
            Katmanlı çalışma bunun yerine{' '}
            <strong className="font-medium text-ink">tek bir içerik</strong> üzerinden
            okuma, dinleme, yazma ve konuşmayı kapalı devre bir sistemde geliştirir.
            Yeni içeriğe geçmek değil, aynı içeriği tüketmek akıcılığı kuruyor.
          </p>

          {/* YEDİ KATMAN — kutu değil, numaralı liste */}
          <section>
            <h3 className="text-[15px] font-semibold text-ink">Yedi katman</h3>
            <ol className="mt-3 divide-y divide-hairline border-t border-hairline">
              {LAYERS.map((l, i) => (
                <li key={l.title} className="flex gap-4 py-4">
                  <span className="timecode w-5 shrink-0 pt-0.5 text-ink-3">{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-ink">{l.title}</p>
                    <p className="mt-1 max-w-[58ch] text-[13px] leading-relaxed text-ink-2">
                      {l.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* GRAMER YAKLAŞIMI */}
          <section>
            <h3 className="text-[15px] font-semibold text-ink">
              Gramer: genelden özele
            </h3>
            <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-ink-2">
              Gramer kitabını baştan çalışmak özelden genele gitmektir; yirminci
              konuya gelindiğinde dokuzuncu unutulmuş olur. Bunun yerine metni
              okurken ya da yazarken eksiğini fark et ve o an yalnızca ilgili
              kuralı çalış. Önce pratik, sonra eksiğin tespiti.
            </p>
          </section>

          {/* HEDEF */}
          <section>
            <h3 className="text-[15px] font-semibold text-ink">Ritim</h3>
            <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-ink-2">
              Yedi katmanı tek günde yapman gerekmiyor. Her katmanı ayrı bir güne
              yayıp bir videoyu 7-10 günde bitirebilirsin. Gelişim üçüncü veya
              dördüncü videodan sonra hissedilir hale gelir.
            </p>
          </section>
        </div>

        <div className="flex justify-end border-t border-hairline px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-accent px-4 py-2 text-[13px] font-medium text-white
              transition-colors duration-150 hover:bg-accent-700 cursor-pointer"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};
