import React, { useMemo, useState } from 'react';
import { Gauge, Sparkles, Loader2, BookOpen, Layers } from 'lucide-react';
import { CefrLevel, CEFR_ORDER } from '../../../../shared/vocab/cefr';
import { comprehensionVerdict, DEFAULT_USER_LEVEL, LessonInsight } from '../lib/lessonInsight';
import { classifyMissingWords } from '../lib/cefrCache';

interface Props {
  /**
   * Hazir cozumleme. Panel kendi hesaplamaz: ayni sonucu metindeki alti
   * cizme de kullaniyor, ikisi ayri hesaplasa birbirinden sapabilirdi.
   */
  insight: LessonInsight;
  userLevel?: CefrLevel;
  onChangeUserLevel?: (level: CefrLevel) => void;
  /** Yapay zeka siniflandirmasi bitince cozumlemeyi tazelemek icin. */
  onClassified?: () => void;
}

const TONE_CLASS: Record<'good' | 'ok' | 'hard', string> = {
  good: 'text-[var(--ok)]',
  ok: 'text-[var(--marker-ink)]',
  hard: 'text-[var(--danger)]',
};

/**
 * Dersin zorlugunu KULLANICIYA GORE ozetler.
 * Sayi, CEFR listesi ile kelime destesinin kesisiminden gelir
 * (bkz. lib/lessonInsight).
 */
export const LessonInsightPanel: React.FC<Props> = ({
  insight,
  userLevel,
  onChangeUserLevel,
  onClassified,
}) => {
  const level = userLevel || DEFAULT_USER_LEVEL;
  const [classifying, setClassifying] = useState(false);
  const [aiProgress, setAiProgress] = useState('');

  const verdict = comprehensionVerdict(insight.comprehension);

  // Yerel listede de onbellekte de olmayan maddeler (kelime + kalip)
  const unlisted = useMemo(
    () => [
      ...insight.unknownWords.filter((w) => w.level === null).map((w) => w.word),
      ...insight.unknownPhrases.filter((p) => p.level === null).map((p) => p.phrase),
    ],
    [insight]
  );

  const handleClassify = async () => {
    setClassifying(true);
    setAiProgress('');
    try {
      await classifyMissingWords(
        unlisted,
        (done, total) => setAiProgress(`${done}/${total}`)
      );
      onClassified?.();
    } finally {
      setClassifying(false);
      setAiProgress('');
    }
  };

  if (insight.analysedTokens === 0) return null;

  const gradedTotal = CEFR_ORDER.reduce((s, l) => s + insight.cefr.byLevel[l], 0);

  return (
    <div className="rounded-[10px] border border-[var(--hairline)] bg-[var(--paper-2)] p-4 space-y-3">
      {/* Ust satir: oran ve seviye */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Gauge className="w-4 h-4 shrink-0 text-[var(--ink-2)]" />
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-xl font-medium ${TONE_CLASS[verdict.tone]}`}>
                %{insight.comprehension.toFixed(0)}
              </span>
              <span className="text-xs text-[var(--ink-2)]">{verdict.label}</span>
            </div>
            <p className="text-[11px] text-[var(--ink-3)]">
              Bu metindeki kelimelerin bildiğin oranı
            </p>
          </div>
        </div>

        <label className="flex items-center gap-1.5 text-[11px] text-[var(--ink-3)]">
          <span>Seviyem</span>
          <select
            value={level}
            onChange={(e) => onChangeUserLevel?.(e.target.value as CefrLevel)}
            disabled={!onChangeUserLevel}
            className="px-2 py-1 rounded-[6px] border border-[var(--hairline)] bg-[var(--paper)] text-[var(--ink)] text-[11px] focus:outline-none focus:border-[var(--ink-3)] disabled:opacity-60"
          >
            {CEFR_ORDER.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
      </div>

      {/* Seviye dagilimi seridi */}
      {gradedTotal > 0 && (
        <div className="space-y-1">
          <div className="flex h-1.5 rounded-full overflow-hidden bg-[var(--hairline)]">
            {CEFR_ORDER.map((l, i) => {
              const share = (insight.cefr.byLevel[l] / gradedTotal) * 100;
              if (share <= 0) return null;
              // Kolaydan zora dogru koyulasan tek renk skalasi
              const opacity = 0.25 + (i / (CEFR_ORDER.length - 1)) * 0.75;
              return (
                <span
                  key={l}
                  style={{ width: `${share}%`, backgroundColor: `rgba(23,24,27,${opacity})` }}
                  title={`${l}: ${insight.cefr.byLevel[l]} kelime`}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-[var(--ink-3)]">
            <span>Metnin ağırlıklı seviyesi: <strong className="text-[var(--ink-2)]">{insight.cefr.dominantLevel || '—'}</strong></span>
            <span>{insight.cefr.uniqueWords} farklı kelime</span>
          </div>
        </div>
      )}

      {/* Sayimlar.
          Uc esit kutulu izgaraydi. Bunlar birbirinin alternatifi degil,
          AYNI butunun uc parcasi (metindeki toplam kelime); kutulara
          bolmek onlari ayri olculer gibi gosteriyordu. Tek satirda,
          renk noktalariyla — reading tarafindaki kelime dagarcigi
          gostergesiyle ayni bicim. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
        {([
          ['biliyorsun', insight.knownTokens, 'bg-ok'],
          ['öğreniyorsun', insight.learningTokens, 'bg-marker'],
          ['bilmiyorsun', insight.unknownTokens, 'bg-[var(--hairline-2)]'],
        ] as [string, number, string][]).map(([label, value, dot]) => (
          <span key={label} className="flex items-center gap-1.5 text-[var(--ink-3)]">
            <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${dot}`} />
            <span className="timecode font-medium text-[var(--ink)]">{value}</span>
            {label}
          </span>
        ))}
      </div>

      {/* Kaliplar: kelimeleri kolay olsa da birlikte zor olabilirler */}
      {insight.unknownPhrases.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 shrink-0 text-[var(--ink-3)]" />
            <span className="text-[11px] font-semibold text-[var(--ink-2)]">
              Kalıplar ({insight.unknownPhrases.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {insight.unknownPhrases.slice(0, 16).map((p) => (
              <span
                key={p.phrase}
                title={`${p.surfaces.join(', ')} · metinde ${p.count} kez`}
                className="text-[11px] px-1.5 py-0.5 rounded border border-[var(--ink-3)]/40 bg-[var(--paper-3)] text-[var(--ink-2)]"
              >
                {p.phrase}
                {p.level && <span className="ml-1 opacity-60">{p.level}</span>}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-[var(--ink-3)]">
            Bu kalıpların kelimeleri tek tek kolay olabilir ama birlikte farklı anlama gelirler.
          </p>
        </div>
      )}

      {/* Bilmedigin kelimeler */}
      {insight.unknownWords.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 shrink-0 text-[var(--ink-3)]" />
            <span className="text-[11px] font-semibold text-[var(--ink-2)]">
              Zorlanabileceğin kelimeler
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {insight.unknownWords.slice(0, 24).map((w) => (
              <span
                key={w.word}
                title={w.level ? `${w.level} · metinde ${w.count} kez` : `seviyesi bilinmiyor · metinde ${w.count} kez`}
                className="text-[11px] px-1.5 py-0.5 rounded border border-[var(--marker)] bg-[var(--marker-bg)] text-[var(--marker-ink)]"
              >
                {w.word}
                {w.level && <span className="ml-1 opacity-60">{w.level}</span>}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-[var(--ink-3)]">
            Metinde bu kelimelerin altı çizili. Üzerine gelip seçerek kelime kartına ekleyebilirsin.
          </p>
        </div>
      )}

      {/* Seviyesi hic bilinmeyenler icin yapay zeka */}
      {unlisted.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[var(--hairline)]">
          <span className="text-[10px] text-[var(--ink-3)]">
            {unlisted.length} maddenin seviyesi listede yok
          </span>
          <button
            type="button"
            onClick={handleClassify}
            disabled={classifying}
            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[8px] border border-[var(--hairline)] text-[var(--ink-2)] text-[11px] font-medium hover:border-[var(--hairline-2)] hover:text-[var(--ink)] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {classifying
              ? <><Loader2 className="w-3 h-3 shrink-0 animate-spin" /><span>{aiProgress || 'Soruluyor...'}</span></>
              : <><Sparkles className="w-3 h-3 shrink-0" /><span>Yapay zekâya sor</span></>}
          </button>
        </div>
      )}
    </div>
  );
};
