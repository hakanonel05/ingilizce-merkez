/**
 * BETİMLEMELERİM
 *
 * Liste + ayrıntı, aynı ekranda. Seçilen kayıt listenin yerini alıyor;
 * yan yana iki sütun (liste solda, ayrıntı sağda) denenmedi çünkü
 * çözümlemenin kendisi zaten iki sütunlu (görsel + metin) ve üçüncü bir
 * sütun dar ekranda kırılıyor.
 *
 * Liste satırında küçük görsel var: "hangi betimlemeydi bu" sorusunun
 * cevabını metin okuyarak bulmak, resme bakmaktan yavaş.
 */

import React, { useState } from 'react';
import { ArrowLeft, Trash2, Images } from 'lucide-react';
import { TelaffuzSonucu } from './TelaffuzSonucu';
import { parseAssessmentReport } from '../lib/telaffuzRaporu';
import type { TelaffuzKaydi } from '../lib/telaffuzDeposu';
import { AnalizSonucu } from './AnalizSonucu';
import { GorselKunyesiSatiri } from './GorselKunyesiSatiri';
import type { BetimlemeKaydi } from '../types';

interface Props {
  kayitlar: BetimlemeKaydi[];
  onSil: (id: string) => void;
  onHepsiniSil: () => void;
  /** Boş listede kullanıcıyı alıştırmaya götürür. */
  onAlistirmayaGit: () => void;
  telaffuzlar: TelaffuzKaydi[];
  onTelaffuzSil: (id: string) => void;
  onTumTelaffuzlariSil: () => void;
}

/* İKİ ALIŞTIRMA, İKİ AYRI LİSTE — ama tek ekranda.

   Karışık tek bir liste denenmedi: iki kaydın satırda gösterdiği şey
   farklı (birinde görsel ve CEFR, diğerinde hedef metin ve telaffuz
   puanı) ve ortak bir satır biçimi ikisini de kırpardı. Segment anahtarı
   iki listeyi ayırıyor, sekme açmadan. */
type Tur = 'betimleme' | 'telaffuz';

function tarihBicimle(zaman: number): string {
  return new Date(zaman).toLocaleString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export const Gecmis: React.FC<Props> = ({
  kayitlar, onSil, onHepsiniSil, onAlistirmayaGit,
  telaffuzlar, onTelaffuzSil, onTumTelaffuzlariSil,
}) => {
  const [secili, setSecili] = useState<BetimlemeKaydi | null>(null);
  const [seciliTelaffuz, setSeciliTelaffuz] = useState<TelaffuzKaydi | null>(null);
  /* Açılışta dolu olan listeyi göster: boş bir listeyle karşılamak,
     kullanıcıya "burada hiçbir şey yok" dedirtir. */
  const [tur, setTur] = useState<Tur>(
    kayitlar.length === 0 && telaffuzlar.length > 0 ? 'telaffuz' : 'betimleme'
  );

  if (seciliTelaffuz) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setSeciliTelaffuz(null)}
            className="flex items-center gap-2 rounded-xl border border-hairline px-4 py-2
              text-[13px] font-medium text-ink-2 transition-colors hover:bg-paper-3
              hover:text-ink cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Listeye dön
          </button>
          <span className="timecode text-ink-3">{tarihBicimle(seciliTelaffuz.olusturuldu)}</span>
        </div>
        {/* Ses yok: kayıt saklanmıyor, yalnızca rapor. */}
        <TelaffuzSonucu
          rapor={seciliTelaffuz.rapor}
          hedefMetin={seciliTelaffuz.hedefMetin}
          sesUrl={null}
        />
      </div>
    );
  }

  if (secili) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setSecili(null)}
            className="flex items-center gap-2 rounded-xl border border-hairline px-4 py-2
              text-[13px] font-medium text-ink-2 transition-colors hover:bg-paper-3
              hover:text-ink cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Listeye dön
          </button>
          <span className="timecode text-ink-3">{tarihBicimle(secili.olusturuldu)}</span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-xl border border-hairline bg-paper-2
              lg:sticky lg:top-24">
              <img src={secili.gorselKucuk} alt="Betimlenen görsel" className="block w-full" />
              <GorselKunyesiSatiri kunye={secili.gorselKunyesi} />
            </div>
          </div>
          <div className="lg:col-span-7">
            <AnalizSonucu kayit={secili} />
          </div>
        </div>
      </div>
    );
  }

  if (kayitlar.length === 0 && telaffuzlar.length === 0) {
    return (
      <div className="max-w-[60ch] space-y-3">
        <h1 className="text-[22px] font-semibold tracking-tight text-ink">Geçmiş</h1>
        <p className="text-[14px] leading-relaxed text-ink-2">
          Henüz bir kayıt yok. İlk alıştırmayı yaptığında betimlemelerin ve
          telaffuz değerlendirmelerin burada durmaya başlar.
        </p>
        <button
          type="button"
          onClick={onAlistirmayaGit}
          className="flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-[14px]
            font-medium text-white transition-colors hover:bg-accent-700 cursor-pointer"
        >
          <Images className="h-4 w-4" />
          Bir görsel seç
        </button>
      </div>
    );
  }

  const segment = (id: Tur, etiket: string, adet: number) => (
    <button
      key={id}
      type="button"
      onClick={() => setTur(id)}
      className={`rounded-lg px-3 py-1.5 text-[13px] transition-colors cursor-pointer
        ${tur === id ? 'bg-accent font-medium text-white' : 'text-ink-2 hover:bg-paper-3'}`}
    >
      {etiket}
      <span className={`timecode ml-1.5 ${tur === id ? 'text-white/70' : 'text-ink-3'}`}>
        {adet}
      </span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-ink">Geçmiş</h1>
          <p className="mt-0.5 text-[12px] text-ink-3">
            Ses kaydı hiçbirinde tutulmuyor — yalnızca metinler ve raporlar
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const ne = tur === 'betimleme' ? 'betimlemeler ve çözümlemeleri' : 'telaffuz değerlendirmeleri';
            if (window.confirm(`Bütün ${ne} silinecek. Emin misin?`)) {
              if (tur === 'betimleme') onHepsiniSil();
              else onTumTelaffuzlariSil();
            }
          }}
          className="rounded-xl border border-hairline px-4 py-2 text-[13px] text-ink-2
            transition-colors hover:border-danger-line hover:bg-danger-soft
            hover:text-danger cursor-pointer"
        >
          Hepsini sil
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        {segment('betimleme', 'Betimlemeler', kayitlar.length)}
        {segment('telaffuz', 'Telaffuz', telaffuzlar.length)}
      </div>

      {tur === 'telaffuz' ? (
        telaffuzlar.length === 0 ? (
          <p className="text-[14px] text-ink-2">Henüz telaffuz değerlendirmesi yok.</p>
        ) : (
          <ul className="divide-y divide-hairline border-y border-hairline">
            {telaffuzlar.map((t) => {
              /* Puan HER OKUMADA ayrıştırılıyor, kayda yazılmıyor:
                 ayrıştırıcı düzelirse eski kayıtlar da düzelmiş görünsün
                 (bkz. lib/telaffuzDeposu.ts). */
              const cozum = parseAssessmentReport(t.rapor, t.hedefMetin);
              return (
                <li key={t.id} className="flex items-start gap-4 py-4">
                  <button
                    type="button"
                    onClick={() => setSeciliTelaffuz(t)}
                    className="min-w-0 flex-1 text-left cursor-pointer"
                  >
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <span className="text-[15px] font-semibold text-ink">
                        {cozum.overallScore}
                      </span>
                      <span className="timecode text-ink-3">{tarihBicimle(t.olusturuldu)}</span>
                      {t.baslik && (
                        <span className="timecode rounded bg-paper-3 px-1.5 py-0.5 text-ink-2">
                          {t.baslik}
                        </span>
                      )}
                    </div>
                    <p className="transcript-en mt-1 line-clamp-2 max-w-[70ch] text-[13px] text-ink-2">
                      {t.hedefMetin}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => onTelaffuzSil(t.id)}
                    title="Bu değerlendirmeyi sil"
                    aria-label="Bu değerlendirmeyi sil"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                      text-ink-3 transition-colors hover:bg-danger-soft hover:text-danger
                      cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )
      ) : kayitlar.length === 0 ? (
        <p className="text-[14px] text-ink-2">Henüz betimleme yok.</p>
      ) : (
      <ul className="divide-y divide-hairline border-y border-hairline">
        {kayitlar.map((k) => (
          <li key={k.id} className="flex items-start gap-4 py-4">
            <button
              type="button"
              onClick={() => setSecili(k)}
              className="flex min-w-0 flex-1 items-start gap-4 text-left cursor-pointer"
            >
              <img
                src={k.gorselKucuk}
                alt=""
                className="h-16 w-24 shrink-0 rounded-lg border border-hairline object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span className="text-[15px] font-semibold text-ink">{k.analiz.cefr}</span>
                  <span className="timecode text-ink-3">{tarihBicimle(k.olusturuldu)}</span>
                  {k.analiz.gramerHatalari.length > 0 && (
                    <span className="timecode rounded bg-paper-3 px-1.5 py-0.5 text-ink-2">
                      {k.analiz.gramerHatalari.length} gramer notu
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 max-w-[70ch] text-[13px] leading-relaxed text-ink-2">
                  {k.metin}
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => onSil(k.id)}
              title="Bu betimlemeyi sil"
              aria-label="Bu betimlemeyi sil"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                text-ink-3 transition-colors hover:bg-danger-soft hover:text-danger
                cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
};
