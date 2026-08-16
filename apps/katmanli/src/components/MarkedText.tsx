import React, { useMemo } from 'react';

interface Props {
  text: string;
  /** Alti cizilecek tekil kelimeler, kucuk harfle. */
  unknown: Set<string>;
  /** Alti cizilecek kalip bicimleri, kucuk harfle ("carried out"). */
  phrases?: Set<string>;
}

const WORD_RE = /[A-Za-z][A-Za-z'-]*/g;

/** Kalibin en fazla kac kelimeden olustugu; oradan geriye dogru aranir. */
const MAX_PHRASE_WORDS = 4;

const WORD_MARK: React.CSSProperties = {
  textDecoration: 'underline',
  textDecorationStyle: 'dotted',
  textDecorationColor: 'var(--marker-ink, #6B5312)',
  textDecorationThickness: '1.5px',
  textUnderlineOffset: '3px',
};

// Kaliplar duz cizgiyle: tek kelimelik zorluktan farkli bir sey olduklari
// bakisla ayirt edilsin, hepsi tek bir cizgi altinda toplansin.
const PHRASE_MARK: React.CSSProperties = {
  textDecoration: 'underline',
  textDecorationStyle: 'solid',
  textDecorationColor: 'var(--marker-ink, #6B5312)',
  textDecorationThickness: '1.5px',
  textUnderlineOffset: '3px',
};

interface Segment {
  text: string;
  mark: 'none' | 'word' | 'phrase';
}

/**
 * Metni oldugu gibi yazar, yalnizca kullanicinin bilmedigi kelimelerin ve
 * kaliplarin altini cizer.
 *
 * Kaliplar tek parca isaretlenir: "carry out" iki ayri kelime gibi degil,
 * tek bir birim olarak cizilir — cunku zorlugu da tek birim olmasindan
 * geliyor. Kalip eslesmesi tekil kelimeden ONCE denenir ve eslesen
 * kelimeler tuketilir, boylece ayni yer iki kez isaretlenmez.
 *
 * Bosluk ve noktalama aynen korunur, dolayisiyla fareyle secim
 * (SelectionToCard) ve kopyalama bozulmaz.
 */
export const MarkedText: React.FC<Props> = ({ text, unknown, phrases }) => {
  const segments = useMemo<Segment[] | null>(() => {
    const hasPhrases = !!phrases && phrases.size > 0;
    if (unknown.size === 0 && !hasPhrases) return null;

    const matches = [...text.matchAll(WORD_RE)];
    if (matches.length === 0) return null;

    const out: Segment[] = [];
    let cursor = 0;
    let i = 0;

    while (i < matches.length) {
      const m = matches[i];
      const start = m.index!;

      // 1) Bu konumdan baslayan en uzun kalip
      let phraseLen = 0;
      if (hasPhrases) {
        const maxLen = Math.min(MAX_PHRASE_WORDS, matches.length - i);
        for (let len = maxLen; len >= 2; len--) {
          const candidate = matches.slice(i, i + len).map((x) => x[0].toLowerCase()).join(' ');
          if (phrases!.has(candidate)) { phraseLen = len; break; }
        }
      }

      if (phraseLen > 0) {
        const last = matches[i + phraseLen - 1];
        const end = last.index! + last[0].length;
        if (start > cursor) out.push({ text: text.slice(cursor, start), mark: 'none' });
        out.push({ text: text.slice(start, end), mark: 'phrase' });
        cursor = end;
        i += phraseLen;
        continue;
      }

      // 2) Tekil kelime
      if (unknown.has(m[0].toLowerCase())) {
        const end = start + m[0].length;
        if (start > cursor) out.push({ text: text.slice(cursor, start), mark: 'none' });
        out.push({ text: text.slice(start, end), mark: 'word' });
        cursor = end;
      }
      i++;
    }

    if (cursor < text.length) out.push({ text: text.slice(cursor), mark: 'none' });
    return out;
  }, [text, unknown, phrases]);

  if (!segments) return <>{text}</>;

  return (
    <>
      {segments.map((seg, i) =>
        seg.mark === 'none' ? (
          seg.text
        ) : (
          <span key={i} style={seg.mark === 'phrase' ? PHRASE_MARK : WORD_MARK}>
            {seg.text}
          </span>
        )
      )}
    </>
  );
};
