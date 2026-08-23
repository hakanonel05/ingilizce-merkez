/**
 * ÇALIŞMA KARNESİ
 *
 * Her iki uygulamanın verisini tek yerde gösterir (ikisi de aynı origin
 * altında olduğu için depolar paylaşılıyor — bkz. collect.ts).
 *
 * TASARIM KARARLARI
 * - Grafikler elle SVG. Hazır bir grafik kütüphanesi iki uygulamanın da
 *   paketine ~300 KB ekliyordu; buradaki üç grafik (ısı haritası, sütun,
 *   çizgi) birkaç düzine satırla çiziliyor.
 * - Renkler Tailwind'in nötr sınıfları. Katmanlı bunları kendi kağıt/mürekkep
 *   paletine index.css'te zaten eşliyor, reading'de olduğu gibi kalıyor;
 *   böylece tek bileşen iki tasarım dilinde de yabancı durmuyor.
 * - Zaman damgası olan veriyle olmayan veri ASLA karıştırılmıyor. Tarihsiz
 *   toplamlar ayrı bir bölümde ve neden tarihsiz oldukları yazıyor.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  collectSnapshot,
  Snapshot,
  DayStat,
  WordRow,
  LAYER_NAMES,
} from './collect';
import { Skill, SKILL_LABELS_TR, ACTIVITY_CHANGED_EVENT, dayKey } from './activityLog';
import { POS_LABELS_TR, PartOfSpeech } from '../vocab/pos';
import { CEFR_ORDER } from '../vocab/cefr';
import { VOCAB_CHANGED_EVENT } from '../vocab/vocabStore';

type RangeKey = 90 | 180 | 365 | 0;

const RANGES: { key: RangeKey; label: string }[] = [
  { key: 90, label: '3 ay' },
  { key: 180, label: '6 ay' },
  { key: 365, label: '1 yıl' },
  { key: 0, label: 'Tümü' },
];

const SKILL_ORDER: Skill[] = ['reading', 'listening', 'speaking', 'writing', 'vocab', 'grammar', 'exam'];

const MONTH_LABELS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const WEEKDAY_LABELS = ['Pzt', '', 'Çar', '', 'Cum', '', 'Paz'];

/** Dakikayı "2s 15dk" gibi okunur hale getirir. */
function formatMinutes(minutes: number): string {
  const total = Math.round(minutes);
  if (total < 60) return `${total} dk`;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return rest === 0 ? `${hours} sa` : `${hours} sa ${rest} dk`;
}

function formatDay(day: string): string {
  const [y, m, d] = day.split('-').map(Number);
  return `${d} ${MONTH_LABELS[m - 1]} ${y}`;
}

/**
 * Bir günün "yoğunluğu". Süre varsa süre belirleyici; olay günlüğünden
 * önceki günlerde süre bilinmediği için kart/quiz sayıları da hesaba
 * katılıyor, yoksa o dönem tamamen boş görünürdü.
 */
function dayScore(day: DayStat): number {
  return (
    day.minutesTotal +
    day.wordsAdded * 0.5 +
    day.reviews * 0.15 +
    day.quizzes * 3 +
    day.completions * 5 +
    (day.markedActive ? 1 : 0)
  );
}

export const Dashboard: React.FC = () => {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangeKey>(180);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [wordSearch, setWordSearch] = useState('');
  const [wordLimit, setWordLimit] = useState(50);

  const refresh = async () => {
    try {
      setSnapshot(await collectSnapshot());
    } catch (err) {
      console.error('Karne verisi toplanamadı:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    const onChange = () => { void refresh(); };
    window.addEventListener(ACTIVITY_CHANGED_EVENT, onChange);
    window.addEventListener(VOCAB_CHANGED_EVENT, onChange);
    return () => {
      window.removeEventListener(ACTIVITY_CHANGED_EVENT, onChange);
      window.removeEventListener(VOCAB_CHANGED_EVENT, onChange);
    };
  }, []);

  /** Seçili aralığa düşen günler. */
  const visibleDays = useMemo(() => {
    if (!snapshot) return [];
    if (range === 0) return snapshot.days;
    return snapshot.days.slice(-range);
  }, [snapshot, range]);

  /** Aralığa ait toplamlar — üstteki kutucuklar bunu gösterir. */
  const rangeTotals = useMemo(() => {
    const bySkill: Record<Skill, number> = {
      reading: 0, listening: 0, speaking: 0, writing: 0, vocab: 0, grammar: 0, exam: 0,
    };
    let minutes = 0;
    let words = 0;
    let reviews = 0;
    let quizzes = 0;
    let activeDays = 0;

    for (const day of visibleDays) {
      for (const skill of SKILL_ORDER) bySkill[skill] += day.minutesBySkill[skill];
      minutes += day.minutesTotal;
      words += day.wordsAdded;
      reviews += day.reviews;
      quizzes += day.quizzes;
      if (day.active) activeDays++;
    }
    return { bySkill, minutes, words, reviews, quizzes, activeDays };
  }, [visibleDays]);

  const selected = selectedDay && snapshot ? snapshot.byDay.get(selectedDay) : null;
  const selectedWords = useMemo(() => {
    if (!snapshot || !selectedDay) return [];
    return snapshot.words.filter((w) => w.day === selectedDay);
  }, [snapshot, selectedDay]);

  const filteredWords = useMemo(() => {
    if (!snapshot) return [];
    const term = wordSearch.trim().toLowerCase();
    if (!term) return snapshot.words;
    return snapshot.words.filter(
      (w) =>
        w.front.toLowerCase().includes(term) ||
        w.back.toLowerCase().includes(term) ||
        w.lessonTitle.toLowerCase().includes(term)
    );
  }, [snapshot, wordSearch]);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
        <p className="text-xs text-slate-500">Karne hazırlanıyor...</p>
      </div>
    );
  }

  if (!snapshot || snapshot.days.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-2">
        <p className="text-sm font-bold text-slate-900">Henüz ölçülecek bir çalışma yok</p>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Bir ders çalıştığında, kelime kartı eklediğinde veya bir quiz
          çözdüğünde bu sayfa dolmaya başlar. Süre ölçümü bu sürümle
          başladığı için geçmiş çalışmaların süresi görünmez; tarihi bilinen
          veriler (eklenen kelimeler, quiz sonuçları) geriye dönük gelir.
        </p>
      </div>
    );
  }

  const { vocab, totals, undated } = snapshot;

  return (
    <div className="space-y-5">
      {/* ---------------- Başlık ---------------- */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2.5">
            <span className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold rounded-md uppercase tracking-wider">
              Karne
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Çalışma Takvimi</h2>
          </div>

          <div className="flex items-center gap-1">
            {RANGES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRange(r.key)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  range === r.key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          İki uygulamanın verisi birlikte. <strong>Süre ölçümü</strong> bu
          sürümle başladı; ondan önceki günlerde eklenen kelimeler, quiz
          sonuçları ve çalışılan gün işaretleri görünür ama dakika bilgisi
          yoktur.
        </p>
      </div>

      {/* ---------------- Özet kutucukları ---------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <StatTile label="Güncel seri" value={`${totals.currentStreak} gün`} hint={`en uzun ${totals.longestStreak}`} />
        <StatTile label="Çalışılan gün" value={String(rangeTotals.activeDays)} hint="seçili aralıkta" />
        <StatTile label="Ölçülen süre" value={formatMinutes(rangeTotals.minutes)} hint="aralık toplamı" />
        <StatTile label="Kelime kartı" value={String(vocab.total)} hint={`${vocab.due} vadesi gelen`} />
        <StatTile
          label="Tutma oranı"
          value={vocab.retention === null ? '—' : `%${Math.round(vocab.retention * 100)}`}
          hint={`${vocab.totalReps} tekrar`}
        />
        <StatTile label="Quiz / sınav" value={String(rangeTotals.quizzes)} hint="seçili aralıkta" />
      </div>

      {/* ---------------- Takvim ısı haritası ---------------- */}
      <CalendarHeatmap
        days={visibleDays}
        selectedDay={selectedDay}
        onSelectDay={(day) => setSelectedDay(day === selectedDay ? null : day)}
      />

      {/* Seçili günün dökümü */}
      {selected && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{formatDay(selected.day)}</h3>
            <button
              type="button"
              onClick={() => setSelectedDay(null)}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Kapat
            </button>
          </div>

          {!selected.active ? (
            <p className="text-xs text-slate-500">Bu gün kayıtlı bir çalışma yok.</p>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {selected.minutesTotal > 0 && (
                  <Chip label="Süre" value={formatMinutes(selected.minutesTotal)} tone="bg-slate-900 text-white" />
                )}
                {selected.wordsAdded > 0 && <Chip label="Yeni kelime" value={String(selected.wordsAdded)} />}
                {selected.reviews > 0 && <Chip label="Tekrar" value={String(selected.reviews)} />}
                {selected.quizzes > 0 && <Chip label="Quiz" value={String(selected.quizzes)} />}
                {selected.completions > 0 && <Chip label="Tamamlanan" value={String(selected.completions)} />}
                {selected.mistakes > 0 && (
                  <Chip label="Yanlış" value={String(selected.mistakes)} tone="bg-rose-100 text-rose-800" />
                )}
                {selected.minutesTotal === 0 && selected.markedActive && (
                  <Chip label="Çalışıldı" value="süre kaydı yok" tone="bg-amber-100 text-amber-800" />
                )}
              </div>

              {selected.minutesTotal > 0 && (
                <SkillBars minutes={selected.minutesBySkill} total={selected.minutesTotal} />
              )}

              {selectedWords.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold text-slate-700">
                    O gün eklenen kelimeler ({selectedWords.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedWords.map((w) => (
                      <span
                        key={w.front + w.createdAt}
                        title={w.back}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded"
                      >
                        {w.front}
                        <span className="text-slate-400 ml-1">{w.level}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ---------------- Beceri dağılımı ---------------- */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Beceriye göre süre</h3>
        {rangeTotals.minutes === 0 ? (
          <p className="text-xs text-slate-500 leading-relaxed">
            Bu aralıkta ölçülmüş süre yok. Süre ölçümü ekranda geçirdiğin
            zamanı sayar ve bu sürümle başladı; birkaç ders çalıştıktan sonra
            burada okuma / dinleme / konuşma dağılımını göreceksin.
          </p>
        ) : (
          <SkillBars minutes={rangeTotals.bySkill} total={rangeTotals.minutes} />
        )}

        {/* Tamamlanan katmanlar: tarih yok ama beceri kırılımı var */}
        {undated.katmanli.completedLayers > 0 && (
          <div className="pt-3 border-t border-slate-200 space-y-1.5">
            <h4 className="text-[11px] font-bold text-slate-700">
              Tamamlanan katmanlar (tarihsiz — eski kayıtlarda gün bilgisi yok)
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(undated.katmanli.layerCounts)
                .sort((a, b) => Number(a[0]) - Number(b[0]))
                .map(([layer, count]) => (
                  <span
                    key={layer}
                    className="px-2 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded"
                  >
                    {LAYER_NAMES[Number(layer)] || `Katman ${layer}`}: <strong>{count}</strong>
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* ---------------- Kelime bankası ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Kelime bankası</h3>
          <div className="flex flex-wrap gap-1.5">
            <Chip label="Toplam" value={String(vocab.total)} />
            <Chip label="Hiç çalışılmamış" value={String(vocab.fresh)} />
            <Chip label="Oturmuş" value={String(vocab.mature)} tone="bg-emerald-100 text-emerald-800" />
            <Chip label="Vadesi gelen" value={String(vocab.due)} tone="bg-rose-100 text-rose-800" />
            {vocab.suspended > 0 && <Chip label="Askıda" value={String(vocab.suspended)} />}
          </div>

          <Distribution
            title="CEFR seviyesine göre"
            rows={CEFR_ORDER.map((level) => ({ label: level, count: vocab.byLevel[level] || 0 }))}
          />
          <Distribution
            title="Söz türüne göre"
            rows={(Object.entries(vocab.byPos) as [string, number][])
              .map(([pos, count]) => ({
                label: POS_LABELS_TR[pos as PartOfSpeech] || pos,
                count,
              }))
              .sort((a, b) => b.count - a.count)}
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Kelimeler nereden geldi</h3>
          <Distribution
            title="Ders / parça başına"
            rows={vocab.bySource.slice(0, 8).map((s) => ({ label: s.title, count: s.count }))}
          />

          {vocab.hardest.length > 0 && (
            <div className="pt-2 border-t border-slate-200 space-y-1.5">
              <h4 className="text-[11px] font-bold text-slate-700">
                En çok unutulanlar (tekrarda hata sayısı)
              </h4>
              <div className="flex flex-wrap gap-1">
                {vocab.hardest.map((w) => (
                  <span
                    key={w.front}
                    title={w.back}
                    className="px-2 py-0.5 bg-rose-50 text-rose-800 text-[11px] font-semibold rounded border border-rose-100"
                  >
                    {w.front} <span className="opacity-60">×{w.lapses}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- Tekrar yükü ---------------- */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Önümüzdeki 30 günün tekrar yükü</h3>
          <p className="text-[11px] text-slate-500">
            FSRS her kartı ne zaman soracağını biliyor; bu, planlanmış iş yükün.
          </p>
        </div>
        <BarChart
          data={vocab.forecast.map((f) => ({ label: f.day, value: f.count }))}
          formatValue={(v) => `${v} kart`}
        />
      </div>

      {/* ---------------- Başarı seyri ---------------- */}
      {snapshot.scoreTrend.length > 1 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Quiz ve sınav başarısı</h3>
            <p className="text-[11px] text-slate-500">
              Okuma testleri ve deneme sınavlarının doğru yüzdesi, zaman sırasıyla.
            </p>
          </div>
          <LineChart points={snapshot.scoreTrend.map((s) => ({ x: s.ts, y: s.percent, label: `${s.label} — %${s.percent}` }))} />
        </div>
      )}

      {/* ---------------- Eklenen kelimeler ---------------- */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-bold text-slate-900">
            Eklediğin kelimeler ({filteredWords.length})
          </h3>
          <input
            type="text"
            value={wordSearch}
            onChange={(e) => { setWordSearch(e.target.value); setWordLimit(50); }}
            placeholder="Kelime, anlam veya ders ara..."
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-teal-500 w-full sm:w-64"
          />
        </div>

        {filteredWords.length === 0 ? (
          <p className="text-xs text-slate-500">Aramaya uyan kelime yok.</p>
        ) : (
          <>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-[10px] uppercase tracking-wider text-slate-500">
                      <th className="px-3 py-2 font-bold">Kelime</th>
                      <th className="px-3 py-2 font-bold">Anlam</th>
                      <th className="px-3 py-2 font-bold">Seviye</th>
                      <th className="px-3 py-2 font-bold hidden sm:table-cell">Tür</th>
                      <th className="px-3 py-2 font-bold hidden md:table-cell">Kaynak</th>
                      <th className="px-3 py-2 font-bold">Eklendi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredWords.slice(0, wordLimit).map((w) => (
                      <tr key={w.front + w.createdAt} className="text-xs">
                        <td className="px-3 py-2 font-bold text-slate-900 whitespace-nowrap">{w.front}</td>
                        <td className="px-3 py-2 text-slate-600">{w.back}</td>
                        <td className="px-3 py-2">
                          <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded">
                            {w.level}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-500 hidden sm:table-cell">
                          {w.pos ? POS_LABELS_TR[w.pos] : '—'}
                        </td>
                        <td className="px-3 py-2 text-slate-500 hidden md:table-cell max-w-[200px] truncate">
                          {w.lessonTitle}
                        </td>
                        <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{formatDay(w.day)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredWords.length > wordLimit && (
              <button
                type="button"
                onClick={() => setWordLimit((n) => n + 100)}
                className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                Daha fazla göster ({filteredWords.length - wordLimit} kaldı)
              </button>
            )}
          </>
        )}
      </div>

      {/* ---------------- Tarihsiz toplamlar ---------------- */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Tarihsiz toplamlar</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Bu sayılar kaydedilirken tarih tutulmamıştı, o yüzden takvime
            düşemiyorlar. Bundan sonra yapacakların takvimde de görünecek.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          <StatTile label="Ders" value={String(undated.katmanli.lessons)} hint="katmanlı" />
          <StatTile label="Tamamlanan katman" value={String(undated.katmanli.completedLayers)} hint="katmanlı" />
          <StatTile label="Ses kaydı" value={String(undated.katmanli.recordings)} hint="gölgeleme" />
          <StatTile label="Okunan parça" value={String(undated.reading.passagesCompleted)} hint="reading" />
          <StatTile label="Çalışılan kelime" value={String(undated.reading.wordsStudied)} hint="reading" />
          <StatTile label="Öğrenilen kelime" value={String(undated.reading.wordsLearned)} hint="reading" />
          <StatTile label="Okuma süresi" value={formatMinutes(undated.reading.totalMinutes)} hint="reading, kümülatif" />
          <StatTile label="Favori parça" value={String(undated.reading.favorites)} hint="reading" />
        </div>
      </div>
    </div>
  );
};

/* ================= Alt bileşenler ================= */

const StatTile: React.FC<{ label: string; value: string; hint?: string }> = ({ label, value, hint }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-3">
    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</p>
    <p className="text-lg font-bold text-slate-900 leading-tight mt-0.5">{value}</p>
    {hint && <p className="text-[10px] text-slate-400 mt-0.5">{hint}</p>}
  </div>
);

const Chip: React.FC<{ label: string; value: string; tone?: string }> = ({
  label,
  value,
  tone = 'bg-slate-100 text-slate-700',
}) => (
  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${tone}`}>
    {label}: {value}
  </span>
);

/** Beceri başına süre — yatay çubuklar. */
const SkillBars: React.FC<{ minutes: Record<Skill, number>; total: number }> = ({ minutes, total }) => {
  const rows = SKILL_ORDER
    .map((skill) => ({ skill, value: minutes[skill] }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);

  if (rows.length === 0) return null;

  return (
    <div className="space-y-1.5">
      {rows.map(({ skill, value }) => {
        const percent = total > 0 ? (value / total) * 100 : 0;
        return (
          <div key={skill} className="space-y-0.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700">{SKILL_LABELS_TR[skill]}</span>
              <span className="text-slate-500">
                {formatMinutes(value)} · %{Math.round(percent)}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-900 rounded-full" style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Sayı dağılımı — etiket + oransal çubuk. */
const Distribution: React.FC<{ title: string; rows: { label: string; count: number }[] }> = ({ title, rows }) => {
  const max = Math.max(1, ...rows.map((r) => r.count));
  const visible = rows.filter((r) => r.count > 0);
  if (visible.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <h4 className="text-[11px] font-bold text-slate-700">{title}</h4>
      <div className="space-y-1">
        {visible.map((row) => (
          <div key={row.label} className="flex items-center gap-2">
            <span className="text-[11px] text-slate-600 w-24 shrink-0 truncate" title={row.label}>
              {row.label}
            </span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-400 rounded-full" style={{ width: `${(row.count / max) * 100}%` }} />
            </div>
            <span className="text-[11px] font-bold text-slate-700 w-8 text-right shrink-0">{row.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Takvim ısı haritası.
 *
 * Sütun = hafta, satır = haftanın günü (Pazartesi üstte). Hücre rengi o
 * günün yoğunluğuna göre koyulaşır. Bir güne dokunulduğunda üst bileşen
 * o günün dökümünü açar.
 */
const CalendarHeatmap: React.FC<{
  days: DayStat[];
  selectedDay: string | null;
  onSelectDay: (day: string) => void;
}> = ({ days, selectedDay, onSelectDay }) => {
  const { weeks, maxScore, monthMarks } = useMemo(() => {
    if (days.length === 0) return { weeks: [], maxScore: 0, monthMarks: [] as { index: number; label: string }[] };

    const cells: (DayStat | null)[] = [];
    const first = days[0].day;
    const [fy, fm, fd] = first.split('-').map(Number);
    // Pazartesi = 0 olacak şekilde kaydır (getDay: Pazar = 0)
    const offset = (new Date(fy, fm - 1, fd).getDay() + 6) % 7;
    for (let i = 0; i < offset; i++) cells.push(null);
    cells.push(...days);

    const weeks: (DayStat | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    const maxScore = Math.max(1, ...days.map(dayScore));

    // Ay etiketleri: her haftanın ilk gerçek gününe bakıp ay değişimini yakala
    const monthMarks: { index: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, index) => {
      const firstReal = week.find((c) => c !== null);
      if (!firstReal) return;
      const month = Number(firstReal.day.split('-')[1]) - 1;
      if (month !== lastMonth) {
        monthMarks.push({ index, label: MONTH_LABELS[month] });
        lastMonth = month;
      }
    });

    return { weeks, maxScore, monthMarks };
  }, [days]);

  if (weeks.length === 0) return null;

  const CELL = 13;
  const GAP = 3;
  const width = weeks.length * (CELL + GAP);
  const height = 7 * (CELL + GAP);

  /** 0-4 arası yoğunluk basamağı. */
  const level = (day: DayStat): number => {
    if (!day.active) return 0;
    const ratio = dayScore(day) / maxScore;
    if (ratio > 0.6) return 4;
    if (ratio > 0.3) return 3;
    if (ratio > 0.1) return 2;
    return 1;
  };

  const FILLS = ['#EDECE8', '#CFD6D2', '#9DB3AA', '#5E8074', '#2E7D5B'];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-bold text-slate-900">Çalışma takvimi</h3>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <span>az</span>
          {FILLS.map((fill) => (
            <span key={fill} className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: fill }} />
          ))}
          <span>çok</span>
        </div>
      </div>

      {/* Dar ekranda takvim kendi içinde yatay kayar */}
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-1.5" style={{ minWidth: width + 30 }}>
          {/* Gün adları */}
          <div className="flex flex-col gap-[3px] pt-[14px] shrink-0">
            {WEEKDAY_LABELS.map((label, i) => (
              <span
                key={i}
                className="text-[9px] text-slate-400 leading-none"
                style={{ height: CELL, lineHeight: `${CELL}px` }}
              >
                {label}
              </span>
            ))}
          </div>

          <svg width={width} height={height + 14} role="img" aria-label="Çalışma takvimi">
            {monthMarks.map((mark) => (
              <text
                key={`${mark.index}-${mark.label}`}
                x={mark.index * (CELL + GAP)}
                y={9}
                fontSize={9}
                fill="#8B8D93"
              >
                {mark.label}
              </text>
            ))}
            {weeks.map((week, wi) =>
              week.map((day, di) => {
                if (!day) return null;
                const isSelected = day.day === selectedDay;
                return (
                  <rect
                    key={day.day}
                    x={wi * (CELL + GAP)}
                    y={14 + di * (CELL + GAP)}
                    width={CELL}
                    height={CELL}
                    rx={3}
                    fill={FILLS[level(day)]}
                    stroke={isSelected ? '#17181B' : 'transparent'}
                    strokeWidth={isSelected ? 2 : 0}
                    className="cursor-pointer"
                    onClick={() => onSelectDay(day.day)}
                  >
                    <title>
                      {`${formatDay(day.day)}\n` +
                        (day.minutesTotal > 0 ? `${formatMinutes(day.minutesTotal)}\n` : '') +
                        (day.wordsAdded > 0 ? `${day.wordsAdded} yeni kelime\n` : '') +
                        (day.reviews > 0 ? `${day.reviews} tekrar\n` : '') +
                        (day.quizzes > 0 ? `${day.quizzes} quiz` : '')}
                    </title>
                  </rect>
                );
              })
            )}
          </svg>
        </div>
      </div>

      <p className="text-[10px] text-slate-400">
        Bir güne dokun, o gün ne yaptığını göster.
      </p>
    </div>
  );
};

/** Basit sütun grafiği (tekrar yükü gibi kısa diziler için). */
const BarChart: React.FC<{
  data: { label: string; value: number }[];
  formatValue?: (v: number) => string;
}> = ({ data, formatValue }) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return <p className="text-xs text-slate-500">Planlanmış tekrar yok.</p>;
  }

  return (
    <div className="flex items-end gap-[3px] h-24">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col justify-end h-full group relative">
          <div
            className="w-full bg-slate-300 group-hover:bg-slate-900 rounded-sm transition-colors"
            style={{ height: `${Math.max(2, (d.value / max) * 100)}%` }}
            title={`${formatDay(d.label)}: ${formatValue ? formatValue(d.value) : d.value}`}
          />
        </div>
      ))}
    </div>
  );
};

/** Basit çizgi grafiği (yüzdelik seyir). */
const LineChart: React.FC<{ points: { x: number; y: number; label: string }[] }> = ({ points }) => {
  if (points.length < 2) return null;

  const W = 600;
  const H = 120;
  const PAD = 8;
  const xs = points.map((p) => p.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const spanX = maxX - minX || 1;

  const toX = (x: number) => PAD + ((x - minX) / spanX) * (W - PAD * 2);
  const toY = (y: number) => H - PAD - (y / 100) * (H - PAD * 2);

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.x).toFixed(1)},${toY(p.y).toFixed(1)}`).join(' ');
  const average = Math.round(points.reduce((sum, p) => sum + p.y, 0) / points.length);

  return (
    <div className="space-y-1">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-28" preserveAspectRatio="none" role="img">
        {[0, 50, 100].map((tick) => (
          <line key={tick} x1={PAD} y1={toY(tick)} x2={W - PAD} y2={toY(tick)} stroke="#E4E3DE" strokeWidth={1} />
        ))}
        <path d={path} fill="none" stroke="#17181B" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        {points.map((p) => (
          <circle key={`${p.x}-${p.y}`} cx={toX(p.x)} cy={toY(p.y)} r={3} fill="#17181B">
            <title>{p.label}</title>
          </circle>
        ))}
      </svg>
      <p className="text-[11px] text-slate-500">
        Ortalama <strong className="text-slate-800">%{average}</strong> · {points.length} sonuç
      </p>
    </div>
  );
};
