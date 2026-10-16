/* YAPIŞTIRARAK TOPLU EKLEME
 * ============================================================================
 * Quizlet, Anki ve çoğu kelime listesi satır satır "terim<TAB>karşılık"
 * veriyor. Elle tek tek eklemek yüz kelimede saatler sürüyor.
 *
 * ÖNCE ÖNİZLEME, SONRA EKLEME. Ayıraç tahmini her zaman doğru olmayabilir
 * (karşılıkta virgül geçen bir liste yanlış bölünebilir); kullanıcı neyin
 * ekleneceğini eklemeden önce görüyor. Sessizce yüz bozuk kart eklemek,
 * düzeltmesi ekleme işinden uzun sürer.
 *
 * Ayrıştırma mantığı desteler.ts'te (saf ve sınanmış).
 */

import React, { useMemo, useState } from 'react';
import { ClipboardPaste, Check, Loader2, AlertCircle, X } from 'lucide-react';
import { buildCard, addCardsIfMissing, type VocabCard } from './vocabStore';
import { yapistirilaniCozumle } from './desteler';
import type { CardLevel } from './vocabStore';
import { CEFR_ORDER } from './cefr';

interface Props {
  /** Eklenen kartların bağlanacağı yer; genelde aktif ders ya da "elle". */
  lessonId: string;
  lessonTitle: string;
  /** Seçiliyse kartlar bu desteye de giriyor. */
  desteId?: string;
  onBitti: (eklenen: number) => void;
  onKapat: () => void;
}

const ORNEK = 'mistake\thata\ndeadline\tson teslim tarihi\nrational\takılcı';

export const TopluEkleme: React.FC<Props> = ({
  lessonId, lessonTitle, desteId, onBitti, onKapat,
}) => {
  const [metin, setMetin] = useState('');
  const [seviye, setSeviye] = useState<CardLevel>('B1');
  const [ekleniyor, setEkleniyor] = useState(false);
  const [hata, setHata] = useState('');

  const satirlar = useMemo(() => yapistirilaniCozumle(metin), [metin]);

  const ekle = async () => {
    if (satirlar.length === 0) return;
    setHata('');
    setEkleniyor(true);
    try {
      const kartlar: VocabCard[] = satirlar.map((s) => {
        const k = buildCard({
          lessonId,
          lessonTitle,
          front: s.on,
          back: s.arka,
          level: seviye,
        });
        return desteId ? { ...k, desteler: [desteId] } : k;
      });
      /* addCardsIfMissing: zaten olan kartın tekrar geçmişine
         dokunulmuyor, yalnızca kaynak listesine bu yer ekleniyor. */
      const eklenen = await addCardsIfMissing(kartlar);
      onBitti(eklenen);
    } catch (e: any) {
      setHata(e?.message || 'Kartlar eklenemedi.');
    } finally {
      setEkleniyor(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto
        bg-ink/40 p-4 backdrop-blur-sm sm:p-6"
      onClick={onKapat}
      role="dialog"
      aria-modal="true"
      aria-label="Yapıştırarak ekle"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-hairline bg-paper-2"
      >
        <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-4">
          <div className="min-w-0">
            <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-tight text-ink">
              <ClipboardPaste className="h-4 w-4 text-ink-3" /> Yapıştırarak ekle
            </h2>
            <p className="mt-0.5 text-[12px] text-ink-3">
              Her satırda bir kelime: terim ve karşılığı.
            </p>
          </div>
          <button
            type="button"
            onClick={onKapat}
            aria-label="Kapat"
            className="shrink-0 rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-paper-3 hover:text-ink cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 p-5">
          <textarea
            value={metin}
            onChange={(e) => setMetin(e.target.value)}
            rows={8}
            placeholder={ORNEK}
            className="w-full resize-y rounded-xl border border-hairline bg-paper px-3 py-2.5
              font-mono text-[13px] leading-relaxed text-ink placeholder-ink-3
              focus:border-accent focus:outline-none"
          />

          <p className="text-[11px] leading-relaxed text-ink-3">
            Ayıraç kendiliğinden bulunuyor: sekme, noktalı virgül, tire, eşittir
            ya da virgül. Quizlet'ten kopyaladığın liste olduğu gibi yapışır.
          </p>

          <label className="flex items-center gap-2 text-[12px] text-ink-2">
            Seviye
            <select
              value={seviye}
              onChange={(e) => setSeviye(e.target.value as CardLevel)}
              className="rounded-lg border border-hairline bg-paper px-2 py-1 text-[12px]
                text-ink focus:border-accent focus:outline-none cursor-pointer"
            >
              {CEFR_ORDER.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            {/* "Hepsine uygulanır" demiyor: buildCard seviyeyi yerel CEFR
                listesinden DOĞRULUYOR ve gerekirse düzeltiyor (ölçüldü:
                B1 seçilmişken "rational" C1 oldu). Burası bir başlangıç
                değeri, dayatma değil. */}
            <span className="text-ink-3">
              — başlangıç değeri; bilinen kelimelerde kendi seviyesi geçerli olur
            </span>
          </label>

          {/* ÖNİZLEME: ne ekleneceği eklemeden önce görünüyor. */}
          {metin.trim() && (
            satirlar.length === 0 ? (
              <p className="flex items-center gap-1.5 rounded-xl border border-dashed
                border-hairline px-3 py-2.5 text-[12px] text-ink-3">
                <AlertCircle className="h-3.5 w-3.5" />
                Satırlar ayrıştırılamadı. Her satırda terim ve karşılığı, aralarında
                sekme ya da tire olmalı.
              </p>
            ) : (
              <div className="space-y-1.5">
                <p className="text-[12px] font-medium text-ink-2">
                  {satirlar.length} kart okundu
                </p>
                <ul className="max-h-48 divide-y divide-hairline overflow-y-auto rounded-xl
                  border border-hairline bg-paper">
                  {satirlar.map((s, i) => (
                    <li key={i} className="flex items-baseline gap-3 px-3 py-1.5 text-[12px]">
                      <span className="min-w-0 flex-1 truncate font-medium text-ink" lang="en">
                        {s.on}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-ink-2" lang="tr">
                        {s.arka}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}

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
            onClick={ekle}
            disabled={satirlar.length === 0 || ekleniyor}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-[13px]
              font-medium text-white transition-colors hover:bg-accent-700
              disabled:opacity-40 cursor-pointer"
          >
            {ekleniyor ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {satirlar.length > 0 ? `${satirlar.length} kartı ekle` : 'Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
};
