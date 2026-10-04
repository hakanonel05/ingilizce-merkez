/**
 * KELİMENİN DİĞER ANLAMLARI
 *
 * Kartın `back` alanı kelimenin görüldüğü cümledeki anlamı. Bu bileşen
 * sözlükteki öteki yaygın anlamları söz türüne göre listeliyor (kart
 * ekleme penceresi, kartın arka yüzü, mor kelime penceresi).
 *
 * `back` içinde zaten geçen anlam vurgulu: "bu cümlede kastedilen buydu".
 * `onToggle` verilirse anlamlar düğmeye dönüşüyor ve dokununca karşılığa
 * eklenip çıkarılıyor (kart ekleme penceresi).
 */

import React from 'react';
import { putCard, CardSense, VocabCard } from './vocabStore';
import { apiFetch } from './userKeys';
import { normalizePos, POS_LABELS_TR } from './pos';

/** "somut; elle tutulur, gerçek" → ["somut", "elle tutulur", "gerçek"] */
export function splitMeanings(back: string): string[] {
  return back.split(/[;,]/).map((m) => m.trim()).filter(Boolean);
}

const sameMeaning = (a: string, b: string) =>
  a.trim().toLocaleLowerCase('tr') === b.trim().toLocaleLowerCase('tr');

/** Karşılıkta bu anlam varsa çıkarır, yoksa ekler. */
export function toggleMeaning(back: string, meaning: string): string {
  const parts = splitMeanings(back);
  const next = parts.some((p) => sameMeaning(p, meaning))
    ? parts.filter((p) => !sameMeaning(p, meaning))
    : [...parts, meaning];
  return next.join(', ');
}

/**
 * Anlamları olmayan (bu özellikten önce eklenmiş) bir kartın sözlük
 * anlamlarını sunucudan çekip karta yazar. Kartın karşılığına, seviyesine
 * ve tekrar geçmişine DOKUNMAZ; yalnızca `senses` eklenir. Kart değişince
 * VOCAB_CHANGED_EVENT ile her ekran tazelenir.
 */
export async function fillCardSenses(card: VocabCard): Promise<CardSense[]> {
  const res = await apiFetch('/api/define-word', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word: card.front, context: card.contextEn || card.exampleEn || '' }),
  });
  let data: any = {};
  try { data = await res.json(); } catch { /* aşağıda hata */ }
  if (!res.ok) throw new Error(data.error || 'Anlamlar alınamadı.');
  const senses: CardSense[] = Array.isArray(data.senses) ? data.senses : [];
  if (!senses.length) throw new Error('Sözlükte başka anlam bulunamadı.');
  await putCard({ ...card, senses });
  return senses;
}

const posLabel = (pos: string) => {
  const p = normalizePos(pos);
  return p ? POS_LABELS_TR[p] : pos;
};

interface Props {
  senses?: CardSense[];
  /** Cümledeki anlam; içindeki karşılıklar vurgulanır. */
  back?: string;
  onToggle?: (meaning: string) => void;
  /** Küçük ekranlar (mor kelime penceresi) için sıkı düzen. */
  compact?: boolean;
}

export const CardSenses: React.FC<Props> = ({ senses, back = '', onToggle, compact = false }) => {
  if (!senses?.length) return null;
  const chosen = splitMeanings(back);
  const isChosen = (m: string) => chosen.some((c) => sameMeaning(c, m));

  return (
    <div className={compact ? 'space-y-1' : 'space-y-1.5'}>
      {senses.map((group) => (
        <div key={group.pos} className="flex items-start gap-2">
          <span
            className={`mt-0.5 shrink-0 rounded bg-paper-3 px-1.5 py-px font-semibold text-ink-2 ${
              compact ? 'text-[10px]' : 'text-[11px]'
            }`}
          >
            {posLabel(group.pos)}
          </span>
          <div className={`flex min-w-0 flex-wrap ${onToggle ? 'gap-1' : 'gap-x-1'}`}>
            {group.meanings.map((m, i) =>
              onToggle ? (
                <button
                  key={m}
                  type="button"
                  onClick={() => onToggle(m)}
                  aria-pressed={isChosen(m)}
                  title={isChosen(m) ? 'Karşılıktan çıkar' : 'Karşılığa ekle'}
                  className={`rounded-md border px-1.5 py-0.5 text-[12px] transition-colors cursor-pointer ${
                    isChosen(m)
                      ? 'border-cardword/40 bg-cardword-bg text-cardword font-medium'
                      : 'border-hairline-2 text-ink-2 hover:bg-paper-3 hover:text-ink'
                  }`}
                >
                  {m}
                </button>
              ) : (
                <span
                  key={m}
                  className={`${compact ? 'text-[12px]' : 'text-[13px]'} ${
                    isChosen(m) ? 'font-medium text-ink' : 'text-ink-2'
                  }`}
                >
                  {m}
                  {i < group.meanings.length - 1 ? ';' : ''}
                </span>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
