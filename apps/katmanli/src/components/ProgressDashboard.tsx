/**
 * SÜREÇ & HEDEFLER
 *
 * UYDURMA VERİ KALDIRILDI. Haftalık grafik `progress.weeklyStudyMinutes`
 * alanını okuyor, o alan 7 kayıt değilse de `[25, 40, 30, 55, 35, 60, 45]`
 * diye sabit bir diziye düşüyordu. Alan depoda HİÇBİR YERDE yazılmıyor
 * (yalnızca types.ts'te tanımlı ve burada okunuyor), yani grafik herkeste
 * her zaman bu uydurma diziyi gösteriyordu — üstüne "Haftalık Toplam:
 * 290 dk" ve "En yüksek performans: Cuma" gibi ondan hesaplanan cümleler
 * de vardı.
 *
 * Yerine gerçek kaynak bağlandı: activityLog'daki günlük toplamlar
 * (`getAllDayStats`). Aynı gün iki cihazda çalışılmışsa satırlar
 * toplanıyor. Hiç kayıt yoksa grafik yerine bunu SÖYLEYEN bir metin
 * çıkıyor; sıfırlarla dolu bir grafik "çalışmadın" değil "bozuk" gibi
 * duruyordu.
 *
 * TASARIM: kartlar gölgesiz, tek kenarlıklı ve her biri tek bir işi
 * anlatıyor. Önceki sürümde her kartın tepesinde büyük harfli, ikonlu,
 * vurgu renginde bir üst başlık vardı; beşi arka arkaya gelince vurgu
 * olmaktan çıkıp desen haline geliyordu.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { UserProgress, VideoLesson } from '../types';
import { BookMarked } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from 'recharts';
import {
  getAllDayStats, dayKey, ACTIVITY_CHANGED_EVENT, DayStatRow, Skill,
} from '../../../../shared/analytics/activityLog';

interface ProgressDashboardProps {
  progress: UserProgress;
  lessons: VideoLesson[];
  onSelectLesson: (lesson: VideoLesson) => void;
}

const GUN_KISA = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const GUN_UZUN = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const AY_KISA = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

/** Kart yüzeyi — gölge yok, 1px çizgi, yumuşak köşe. */
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children, className = '',
}) => (
  <section className={`rounded-2xl border border-hairline bg-paper-2 p-5 sm:p-6 ${className}`}>
    {children}
  </section>
);

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ progress }) => {
  const [stats, setStats] = useState<DayStatRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      getAllDayStats()
        .then((rows) => { if (!cancelled) setStats(rows); })
        // Kayit deposu IndexedDB'de; acilmadiysa ekranin geri kalani
        // calismali, grafik "kayit yok" durumuna dusmeli.
        .catch(() => { if (!cancelled) setStats([]); });
    };
    refresh();
    window.addEventListener(ACTIVITY_CHANGED_EVENT, refresh);
    return () => {
      cancelled = true;
      window.removeEventListener(ACTIVITY_CHANGED_EVENT, refresh);
    };
  }, []);

  const goal = Math.max(1, progress.goalVideoCount);
  const done = progress.completedVideoCount;
  const goalPercentage = Math.min(100, Math.round((done / goal) * 100));

  /**
   * Son yedi gün. Gün başına TÜM becerilerin saniyeleri toplanıp dakikaya
   * çevriliyor; aynı güne ait birden fazla cihaz satırı varsa üst üste
   * ekleniyor (satır anahtarı `gün|cihaz`).
   */
  const chartData = useMemo(() => {
    const minutesByDay = new Map<string, number>();
    for (const row of stats ?? []) {
      // Tur acikca yaziliyor: yalnizca `?? {}` yazildiginda bos nesne
      // degerleri `unknown`a genisletip toplamayi derlenmez kiliyor.
      const bySkill: Partial<Record<Skill, number>> = row.secondsBySkill ?? {};
      const seconds = Object.values(bySkill)
        .reduce<number>((sum, s) => sum + (s ?? 0), 0);
      minutesByDay.set(row.day, (minutesByDay.get(row.day) ?? 0) + seconds / 60);
    }

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = dayKey(d);
      return {
        day: GUN_KISA[d.getDay()],
        fullDay: GUN_UZUN[d.getDay()],
        date: `${d.getDate()} ${AY_KISA[d.getMonth()]}`,
        minutes: Math.round(minutesByDay.get(key) ?? 0),
        isToday: i === 6,
      };
    });
  }, [stats]);

  const totalMinutes = chartData.reduce((acc, c) => acc + c.minutes, 0);
  const avgMinutes = Math.round(totalMinutes / 7);
  const bestDay = [...chartData].sort((a, b) => b.minutes - a.minutes)[0];
  const hasActivity = totalMinutes > 0;

  /** Kilometre taşları: ayrı kartlar değil, tek bir yolun üstündeki noktalar. */
  const milestones = [
    { at: 3,    label: 'İlk görünür ilerleme' },
    { at: 10,   label: 'Altyazısız %70+ anlama' },
    { at: goal, label: 'Akıcılık hedefi' },
  ].filter((m, i, arr) => arr.findIndex((o) => o.at === m.at) === i && m.at <= goal);

  return (
    <div className="space-y-5">

      {/* ---------- HEDEF ---------- */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <span className="eyebrow">Hedef</span>
            <h2 className="mt-1.5 text-[22px] font-semibold tracking-tight text-ink">
              {goal} videoluk tamamlama hedefi
            </h2>
            <p className="mt-2 max-w-[58ch] text-[13px] leading-relaxed text-ink-2">
              Katmanlı çalışmada gelişim üçüncü veya dördüncü videodan sonra
              hissedilir hale gelir. Günde bir katman ilerlersen bir video
              7-10 günde biter.
            </p>
          </div>

          {/* Sayı, kutusuz. Kendi büyüklüğü zaten vurgusu. */}
          <div className="shrink-0 text-right">
            <span className="timecode text-[38px] font-semibold leading-none text-ink">
              {done}
              <span className="text-ink-3">/{goal}</span>
            </span>
            <span className="mt-1 block text-[11px] text-ink-3">%{goalPercentage} tamamlandı</span>
          </div>
        </div>

        {/* Yol ve üstündeki kilometre taşları */}
        <div className="mt-7">
          <div className="relative h-1.5 rounded-full bg-paper-3">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{ width: `${goalPercentage}%` }}
            />
            {milestones.map((m) => (
              <span
                key={m.at}
                title={`${m.at} video — ${m.label}`}
                className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2
                  rounded-full border-2 border-paper-2 ${
                    done >= m.at ? 'bg-emerald-500' : 'bg-hairline-2'
                  }`}
                style={{ left: `${Math.min(100, (m.at / goal) * 100)}%` }}
              />
            ))}
          </div>

          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
            {milestones.map((m) => (
              <li
                key={m.at}
                className={`text-[12px] ${done >= m.at ? 'text-ink' : 'text-ink-3'}`}
              >
                <span className="timecode font-semibold">{m.at}</span>{' '}
                <span>video · {m.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* ---------- SON 7 GÜN ---------- */}
      <Card>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="text-[15px] font-semibold text-ink">Son 7 gün</h3>
          {hasActivity && (
            <p className="text-[12px] text-ink-3">
              toplam{' '}
              <span className="timecode font-semibold text-ink">{totalMinutes} dk</span>
              {' · '}günde ortalama{' '}
              <span className="timecode font-semibold text-ink">{avgMinutes} dk</span>
            </p>
          )}
        </div>

        {hasActivity ? (
          <>
            {/* Renkler CSS degiskenlerinden geliyor: SVG `fill`/`stroke`
                var() kabul ediyor, boylece palet degisince grafik de
                kendiliginden takip ediyor. Once bu degerler soguk gri ve
                indigo hex'leri olarak sabitti; palet isininca grafik tek
                basina soguk kaliyordu. */}
            <div className="mt-5 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--hairline)" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--ink-3)', fontSize: 12 }}
                  />
                  {/* Dakika tam sayi: `allowDecimals` acikken kisa bir
                      gunde eksen "0.5 dk / 1.5 dk" diye bolunuyordu. */}
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{ fill: 'var(--ink-3)', fontSize: 11 }}
                    unit=" dk"
                  />
                  <Tooltip
                    cursor={{ fill: 'var(--paper-3)' }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-ink-800 bg-ink px-2.5 py-2 text-xs text-white">
                          <p className="font-medium">{d.fullDay} ({d.date})</p>
                          <p className="mt-0.5 text-hairline-2">
                            <span className="timecode font-semibold text-white">{d.minutes}</span> dakika
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.isToday ? 'var(--accent)' : 'var(--hairline-2)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gosterge. Onceki surumde iki nokta da `bg-accent` idi, yani
                "Bugun" ile "Gecmis Gunler" ayni renkte gorunuyordu. */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-hairline pt-3 text-[12px] text-ink-3">
              <span className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
                  Bugün
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-hairline-2" />
                  Geçmiş günler
                </span>
              </span>
              {bestDay.minutes > 0 && (
                <span>
                  En uzun gün:{' '}
                  <span className="text-ink">{bestDay.fullDay}</span>{' '}
                  <span className="timecode">({bestDay.minutes} dk)</span>
                </span>
              )}
            </div>
          </>
        ) : (
          <p className="mt-3 max-w-[58ch] text-[13px] leading-relaxed text-ink-2">
            {stats === null
              ? 'Çalışma kayıtları okunuyor…'
              : 'Son yedi günde kayıtlı çalışma yok. Bir katmanda çalışmaya başladığında süre otomatik olarak buraya işlenir.'}
          </p>
        )}
      </Card>

      {/* ---------- ÖRNEK RUTİN ---------- */}
      <Card>
        <h3 className="text-[15px] font-semibold text-ink">Örnek rutin</h3>
        <p className="mt-1 text-[12px] text-ink-3">
          Bir videoyu 7-10 günde bitiren sürdürülebilir bir dağılım.
        </p>

        {/* Dort esit kutu yerine tanim listesi: bunlar birbirinin
            alternatifi degil, ayni haftanin sirali gunleri. */}
        <dl className="mt-4 space-y-2.5">
          {[
            ['Gün 1-2', 'Katman 1 — Metin okuma & anlama'],
            ['Gün 3',   'Katman 2 ve 3 — Aktif dinleme, shadowing'],
            ['Gün 4-5', 'Katman 4 ve 5 — Altyazısız izleme, sadece dinleme'],
            ['Gün 6-7', 'Katman 6 ve 7 — Yazma, sesli anlatım'],
          ].map(([gun, is]) => (
            <div key={gun} className="flex gap-4 text-[13px]">
              <dt className="w-20 shrink-0 font-medium text-ink">{gun}</dt>
              <dd className="min-w-0 text-ink-2">{is}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {/* ---------- KAYDEDİLEN KELİMELER ---------- */}
      <Card>
        <h3 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          <BookMarked className="h-4 w-4 text-ink-3" />
          Kaydedilen kelimeler
          <span className="timecode font-normal text-ink-3">
            {progress.bookmarkedWords.length}
          </span>
        </h3>

        {progress.bookmarkedWords.length === 0 ? (
          <p className="mt-3 max-w-[58ch] text-[13px] leading-relaxed text-ink-2">
            Henüz kaydedilmiş kelime yok. Okuma sırasında bir kelimeye
            dokunup kaydettiğinde burada listelenir.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-hairline">
            {progress.bookmarkedWords.map((item, idx) => (
              <li key={idx} className="py-3 first:pt-0 last:pb-0">
                <span className="text-[14px] font-medium text-ink">{item.word}</span>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{item.enContext}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-ink-3">{item.trContext}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};
