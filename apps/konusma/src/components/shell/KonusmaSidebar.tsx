/**
 * ANA MENÜ PANELİ — KONUŞMA
 *
 * Yalnızca üç bölüm var, yani bir kenar çubuğu fazla gelebilirdi. Yine de
 * duruyor: site üç uygulamadan oluşuyor ve ikisinde sol kenarda dikey
 * gezinme var. Üçüncüsünde olmayınca sekme değiştiren kullanıcı, içerik
 * alanının 276px sola kaymasıyla karşılaşıyor — bu, üç ekstra satırdan
 * daha rahatsız edici.
 *
 * GRUP BAŞLIĞI YOK: iki ya da üç satırın üstüne "BÖLÜMLER" yazmak bilgi
 * değil desen olurdu (bkz. ReadingSidebar'ın başındaki aynı not).
 */

import React from 'react';
import { X, Mic, Images, TrendingUp, AudioLines } from 'lucide-react';

export type KonusmaSekmesi = 'alistirma' | 'telaffuz' | 'gecmis' | 'ilerleme';

interface NavItem {
  id: KonusmaSekmesi;
  label: string;
  icon: React.ReactNode;
  hint: string;
}

interface Props {
  aktif: KonusmaSekmesi;
  onSec: (sekme: KonusmaSekmesi) => void;
  /** Geçmiş satırındaki rozet. Sıfırsa gösterilmiyor: sıfır bir bilgi değil. */
  kayitSayisi: number;
  acik: boolean;
  onKapat: () => void;
}

export const KonusmaSidebar: React.FC<Props> = ({
  aktif, onSec, kayitSayisi, acik, onKapat,
}) => {
  const ogeler: NavItem[] = [
    { id: 'alistirma', label: 'Betimleme', icon: <Mic className="h-4 w-4" />, hint: 'Görseli anlat, çözümlet' },
    { id: 'telaffuz', label: 'Telaffuz', icon: <AudioLines className="h-4 w-4" />, hint: 'Metni sesli oku, telaffuzunu ölç' },
    { id: 'gecmis', label: 'Betimlemelerim', icon: <Images className="h-4 w-4" />, hint: 'Geçmiş çözümlemeler' },
    { id: 'ilerleme', label: 'İlerleme', icon: <TrendingUp className="h-4 w-4" />, hint: 'Seviye ve hata eğrisi' },
  ];

  return (
    <>
      {acik && (
        <div
          onClick={onKapat}
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Bölümler"
        data-open={acik ? 'true' : 'false'}
        className="layer-drawer fixed left-0 top-0 z-50 h-full w-[var(--sidebar-w)] shrink-0
          border-r border-hairline bg-paper-2
          lg:sticky lg:top-16 lg:z-20 lg:h-[calc(100dvh-4rem)]"
      >
        <div className="flex h-full flex-col overflow-y-auto px-3 pb-6 pt-4">

          <div className="mb-1 flex items-center justify-between px-3 lg:hidden">
            <span className="text-sm font-semibold text-ink">Bölümler</span>
            <button
              type="button"
              onClick={onKapat}
              aria-label="Kapat"
              className="rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-paper-3 hover:text-ink cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-px">
            {ogeler.map((oge) => {
              const secili = aktif === oge.id;
              const rozet = oge.id === 'gecmis' && kayitSayisi > 0 ? kayitSayisi : null;
              return (
                <button
                  key={oge.id}
                  type="button"
                  onClick={() => { onSec(oge.id); onKapat(); }}
                  aria-current={secili ? 'page' : undefined}
                  title={oge.hint}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left
                    text-[13px] transition-colors duration-150 cursor-pointer
                    ${secili ? 'bg-accent font-medium text-white' : 'text-ink hover:bg-paper-3'}`}
                >
                  <span className="shrink-0">{oge.icon}</span>
                  <span className="min-w-0 flex-1 truncate">{oge.label}</span>
                  {rozet !== null && (
                    <span className={`timecode shrink-0 rounded px-1.5 text-[11px] ${
                      secili ? 'bg-white/20 text-white' : 'bg-paper-3 text-ink-2'
                    }`}>
                      {rozet}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* MAHREMİYET NOTU PANELDE, ekranın içinde değil: "sesim nereye
              gidiyor" sorusu kullanıcının aklına mikrofon düğmesine basmadan
              ÖNCE geliyor.

              İKİ ALIŞTIRMANIN CEVABI AYRI, ve bunu tek bir cümleye
              sıkıştırmak ikisini de yanlış anlatırdı. Önce burada mutlak bir
              "sesin çıkmıyor" cümlesi vardı; telaffuz değerlendirmesi
              eklenince o cümle bir özellik için yalan oldu. Ayırmak, kısa
              tutmak uğruna yanlış söylemekten iyi. */}
          <div className="mt-auto space-y-2 border-t border-hairline px-3 pt-4">
            <p className="text-[11px] leading-relaxed text-ink-3">
              <span className="text-ink-2">Betimlemede</span> sesin bu
              bilgisayardan çıkmıyor: kayıt tarayıcıda metne çevrilip hemen
              bırakılıyor.
            </p>
            <p className="text-[11px] leading-relaxed text-ink-3">
              <span className="text-ink-2">Telaffuzda</span> kayıt
              değerlendirme için gönderiliyor — fonem ölçmenin başka yolu yok.
              Hiçbirinde ses saklanmıyor.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
