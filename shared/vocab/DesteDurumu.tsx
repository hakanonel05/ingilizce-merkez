/* DESTE DURUMU — ilerleme paneli
 * ============================================================================
 * Üç soru cevaplanıyor: kaç kelime ne durumda, bu hafta ne yaptım, neyi
 * beceremiyorum. Sayma ve sıralama desteIstatistikleri.ts'te (saf ve sınanmış);
 * burası yalnızca çizim.
 *
 * SAYILAR MOTİVASYON ARACI DEĞİL ÖLÇÜ: "olgun" eşiği 21 gün (Anki'nin ölçütü)
 * ve askıdaki kartlar hiçbir sayıma karışmıyor. Şişirilmiş bir "biliyorsun"
 * rakamı çalışmayı bırakmaya yol açar.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import type { VocabCard } from './vocabStore';
import { getAllDayStats, type DayStatRow } from '../analytics/activityLog';
import {
  olgunlukDagilimi, zorKartlar, haftalikOzet, tutmaOrani, OLGUN_GUN,
} from './desteIstatistikleri';

interface Props {
  cards: VocabCard[];
  /** Zor kartlardan birine dokununca düzenleme açılsın. */
  onKartSec?: (kart: VocabCard) => void;
}

const Sayac: React.FC<{ etiket: string; deger: number; ipucu?: string; vurgu?: boolean }> = ({
  etiket, deger, ipucu, vurgu,
}) => (
  <div className="rounded-xl border border-hairline bg-paper px-3 py-2.5" title={ipucu}>
    <p className={`text-[20px] font-semibold leading-none ${vurgu ? 'text-ok' : 'text-ink'}`}>
      {deger}
    </p>
    <p className="mt-1 text-[11px] text-ink-3">{etiket}</p>
  </div>
);

export const DesteDurumu: React.FC<Props> = ({ cards, onKartSec }) => {
  const [satirlar, setSatirlar] = useState<DayStatRow[]>([]);

  useEffect(() => {
    let iptal = false;
    getAllDayStats()
      .then((r) => { if (!iptal) setSatirlar(r); })
      .catch(() => { /* Karne okunamazsa panel sayaçlarla yetinir. */ });
    return () => { iptal = true; };
  }, [cards]);

  const dagilim = useMemo(() => olgunlukDagilimi(cards), [cards]);
  const zorlar = useMemo(() => zorKartlar(cards, 8), [cards]);
  const hafta = useMemo(() => haftalikOzet(satirlar, 7), [satirlar]);
  const oran = useMemo(() => tutmaOrani(hafta), [hafta]);
  const haftaToplam = hafta.reduce((t, g) => t + g.tekrar, 0);

  return (
    <div className="space-y-4">
      {/* ---- Sayaçlar ---- */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Sayac
          etiket="Olgun"
          deger={dagilim.olgun}
          vurgu
          ipucu={`Aralığı ${OLGUN_GUN} gün ve üzeri — kısa süreli hatırlamadan çıkmış sayılıyor.`}
        />
        <Sayac etiket="Taze" deger={dagilim.taze} ipucu="Doğru biliniyor ama henüz oturmamış." />
        <Sayac etiket="Öğreniliyor" deger={dagilim.ogreniliyor} ipucu="Öğrenme ya da yeniden öğrenme adımında." />
        <Sayac etiket="Yeni" deger={dagilim.yeni} ipucu="Henüz hiç çalışılmamış." />
      </div>

      {/* ---- Haftalık grafik ---- */}
      <div className="space-y-2 rounded-2xl border border-hairline bg-paper-2 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
            <TrendingUp className="h-4 w-4 text-ink-3" /> Son yedi gün
          </h3>
          <p className="text-[11px] text-ink-3">
            {haftaToplam} tekrar
            {oran !== null && <> · %{oran} doğru</>}
          </p>
        </div>

        {haftaToplam === 0 ? (
          <p className="py-6 text-center text-[12px] text-ink-3">
            Bu hafta henüz tekrar yok.
          </p>
        ) : (
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hafta} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--hairline)" vertical={false} />
                <XAxis
                  dataKey="etiket"
                  tick={{ fontSize: 10, fill: 'var(--ink-3)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: 'var(--ink-3)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'var(--paper-3)' }}
                  contentStyle={{
                    background: 'var(--paper-2)',
                    border: '1px solid var(--hairline)',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  formatter={(v: number, ad: string) =>
                    [v, ad === 'dogru' ? 'doğru' : 'tekrar']
                  }
                />
                {/* İKİ ÇUBUK ÜST ÜSTE DEĞİL YAN YANA DEĞİL: "doğru"
                    "tekrar"ın bir alt kümesi, üst üste bindirmek toplamı
                    iki kat gösterirdi. Doğrular tekrarın içinde koyu
                    renkle duruyor. */}
                <Bar dataKey="tekrar" fill="var(--hairline-2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="dogru" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ---- Zorlandıkların ---- */}
      <div className="space-y-2 rounded-2xl border border-hairline bg-paper-2 p-4">
        <h3 className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
          <AlertTriangle className="h-4 w-4 text-ink-3" /> Zorlandıkların
        </h3>

        {zorlar.length === 0 ? (
          <p className="py-4 text-center text-[12px] text-ink-3">
            Henüz zorlandığın bir kart yok.
          </p>
        ) : (
          <ul className="divide-y divide-hairline">
            {zorlar.map((z) => (
              <li key={z.kart.id}>
                <button
                  type="button"
                  onClick={() => onKartSec?.(z.kart)}
                  disabled={!onKartSec}
                  className="flex w-full items-center justify-between gap-3 py-2 text-left
                    transition-colors hover:bg-paper-3 disabled:cursor-default cursor-pointer"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-ink" lang="en">
                      {z.kart.front}
                    </span>
                    <span className="block truncate text-[11px] text-ink-3" lang="tr">
                      {z.kart.back}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    {z.lapses > 0 && (
                      <span className="block text-[11px] text-ink-2">{z.lapses} kez unutuldu</span>
                    )}
                    {/* Puan ÇUBUKLA da gösteriliyor: sayı tek başına
                        "68 ne demek" sorusunu bırakıyordu. */}
                    <span className="mt-1 block h-1 w-16 rounded-full bg-paper-3">
                      <span
                        className="block h-full rounded-full bg-ink"
                        style={{ width: `${z.zorlukPuani}%` }}
                      />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
