/* KART DÜZENLEME
 * ============================================================================
 * Yanlış yazılmış bir kartı düzeltmenin tek yolu silip yeniden eklemekti; o da
 * kartın TEKRAR GEÇMİŞİNİ götürüyordu — aylarca çalışılmış bir kelime bir
 * yazım hatası yüzünden sıfırdan başlıyordu.
 *
 * Burada yalnızca İÇERİK alanları değişiyor. FSRS alanlarına (due, stability,
 * difficulty, reps, lapses, state) dokunulmuyor: kelimenin yazımını düzeltmek
 * o kelimeyi ne kadar bildiğini değiştirmez.
 *
 * ÖN YÜZ DEĞİŞİRSE KİMLİK DE DEĞİŞİR. Kart kimliği ön yüzden türüyor
 * (makeCardId) ve kart dizini de ona bakıyor; kimlik eskide kalsaydı
 * metinlerde mor işaret yanlış kelimeyi gösterirdi. Bu yüzden ön yüz
 * değiştiğinde kart yeni kimlikle yazılıp eskisi siliniyor.
 */

import React, { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { VocabCard, makeCardId, deleteCard } from './vocabStore';
import { CEFR_ORDER, type CefrLevel } from './cefr';
import { POS_ORDER, POS_LABELS_TR, type PartOfSpeech } from './pos';

interface Props {
  kart: VocabCard;
  onKaydet: (yeni: VocabCard) => Promise<void> | void;
  onKapat: () => void;
}

const KINDS: { value: VocabCard['kind']; label: string }[] = [
  { value: 'word', label: 'Kelime' },
  { value: 'phrasal_verb', label: 'Phrasal Verb' },
  { value: 'collocation', label: 'Kalıp' },
  { value: 'idiom', label: 'Deyim' },
  { value: 'expression', label: 'Konuşma Kalıbı' },
];

export const KartDuzenleme: React.FC<Props> = ({ kart, onKaydet, onKapat }) => {
  const [on, setOn] = useState(kart.front);
  const [arka, setArka] = useState(kart.back);
  const [ipa, setIpa] = useState(kart.ipa || '');
  const [ornek, setOrnek] = useState(kart.exampleEn || '');
  const [ornekTr, setOrnekTr] = useState(kart.exampleTr || '');
  const [not, setNot] = useState(kart.note || '');
  const [seviye, setSeviye] = useState<CefrLevel>(kart.level as CefrLevel);
  const [tur, setTur] = useState<VocabCard['kind']>(kart.kind);
  const [sozTuru, setSozTuru] = useState<PartOfSpeech | ''>(kart.pos || '');
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');

  const kaydet = async () => {
    const onTemiz = on.trim();
    const arkaTemiz = arka.trim();
    if (!onTemiz || !arkaTemiz) {
      setHata('Ön yüz ve karşılık boş olamaz.');
      return;
    }

    setHata('');
    setKaydediliyor(true);
    try {
      const yeniKimlik = makeCardId(onTemiz);
      const yeni: VocabCard = {
        ...kart,
        id: yeniKimlik,
        front: onTemiz,
        back: arkaTemiz,
        ipa: ipa.trim() || undefined,
        exampleEn: ornek.trim() || undefined,
        exampleTr: ornekTr.trim() || undefined,
        note: not.trim() || undefined,
        level: seviye,
        kind: tur,
        pos: sozTuru || undefined,
      };

      await onKaydet(yeni);

      /* Ön yüz değiştiyse eski kimlikli kayıt ortada kalmamalı; aksi
         halde deste aynı kelimeyi iki kez gösterirdi. */
      if (yeniKimlik !== kart.id) await deleteCard(kart.id);
    } catch (e: any) {
      setHata(e?.message || 'Kart kaydedilemedi.');
    } finally {
      setKaydediliyor(false);
    }
  };

  const alan = (
    etiket: string,
    deger: string,
    ayarla: (v: string) => void,
    secenekler: { lang?: string; cokSatir?: boolean; ipucu?: string } = {}
  ) => (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-ink-2">{etiket}</span>
      {secenekler.cokSatir ? (
        <textarea
          value={deger}
          onChange={(e) => ayarla(e.target.value)}
          rows={2}
          lang={secenekler.lang}
          placeholder={secenekler.ipucu}
          className="resize-y rounded-xl border border-hairline bg-paper px-3 py-2 text-[13px]
            text-ink placeholder-ink-3 focus:border-accent focus:outline-none"
        />
      ) : (
        <input
          type="text"
          value={deger}
          onChange={(e) => ayarla(e.target.value)}
          lang={secenekler.lang}
          placeholder={secenekler.ipucu}
          className="rounded-xl border border-hairline bg-paper px-3 py-2 text-[13px]
            text-ink placeholder-ink-3 focus:border-accent focus:outline-none"
        />
      )}
    </label>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto
        bg-ink/40 p-4 backdrop-blur-sm sm:p-6"
      onClick={onKapat}
      role="dialog"
      aria-modal="true"
      aria-label="Kartı düzenle"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-lg overflow-hidden rounded-2xl border border-hairline bg-paper-2"
      >
        <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-4">
          <h2 className="text-sm font-semibold tracking-tight text-ink">Kartı düzenle</h2>
          <button
            type="button"
            onClick={onKapat}
            aria-label="Kapat"
            className="rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-paper-3 hover:text-ink cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 p-5">
          {alan('İngilizce (ön yüz)', on, setOn, { lang: 'en' })}
          {alan('Türkçe karşılık', arka, setArka, { lang: 'tr' })}
          {alan('IPA', ipa, setIpa, { ipucu: '/ˈmɪsteɪk/' })}
          {alan('Örnek cümle', ornek, setOrnek, { lang: 'en', cokSatir: true })}
          {alan('Örneğin Türkçesi', ornekTr, setOrnekTr, { lang: 'tr', cokSatir: true })}
          {alan('Not', not, setNot, { cokSatir: true })}

          <div className="grid grid-cols-3 gap-2">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-ink-2">Seviye</span>
              <select
                value={seviye}
                onChange={(e) => setSeviye(e.target.value as CefrLevel)}
                className="rounded-xl border border-hairline bg-paper px-2 py-2 text-[13px]
                  text-ink focus:border-accent focus:outline-none cursor-pointer"
              >
                {CEFR_ORDER.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-ink-2">Tür</span>
              <select
                value={tur}
                onChange={(e) => setTur(e.target.value as VocabCard['kind'])}
                className="rounded-xl border border-hairline bg-paper px-2 py-2 text-[13px]
                  text-ink focus:border-accent focus:outline-none cursor-pointer"
              >
                {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-ink-2">Söz türü</span>
              <select
                value={sozTuru}
                onChange={(e) => setSozTuru(e.target.value as PartOfSpeech | '')}
                className="rounded-xl border border-hairline bg-paper px-2 py-2 text-[13px]
                  text-ink focus:border-accent focus:outline-none cursor-pointer"
              >
                <option value="">—</option>
                {POS_ORDER.map((p) => (
                  <option key={p} value={p}>{POS_LABELS_TR[p]}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Tekrar geçmişine dokunulmadığı açıkça söyleniyor: kullanıcı
              düzeltmenin ilerlemesini sıfırlayıp sıfırlamadığını bilmeli. */}
          <p className="text-[11px] leading-relaxed text-ink-3">
            Tekrar geçmişi korunur — düzeltmek, kelimeyi ne kadar bildiğini
            değiştirmez.
          </p>

          {hata && <p className="text-[12px] text-[var(--danger)]">{hata}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-hairline px-5 py-4">
          <button
            type="button"
            onClick={onKapat}
            className="rounded-xl border border-hairline bg-paper-2 px-3 py-2 text-[13px]
              font-medium text-ink transition-colors hover:border-accent/40 cursor-pointer"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={kaydet}
            disabled={kaydediliyor}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-[13px]
              font-medium text-white transition-colors hover:bg-accent-700
              disabled:opacity-40 cursor-pointer"
          >
            {kaydediliyor ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};
