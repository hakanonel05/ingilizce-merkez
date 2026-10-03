import React, { useMemo } from 'react';
import { cardRanges, useCardMatcher } from './cardTerms';

/**
 * Kelime bankasında kartı olan kelimenin işareti: mor zemin + mor yazı.
 * Renk uygulamanın index.css'indeki --cardword / --cardword-bg'den
 * geliyor; tanımlı olmayan bir sayfada da görünsün diye yedekli.
 */
export const CARD_MARK_STYLE: React.CSSProperties = {
  color: 'var(--cardword, #6D28D9)',
  backgroundColor: 'var(--cardword-bg, #F1EAFE)',
  borderRadius: '3px',
  padding: '0 2px',
  margin: '0 -2px',
};

/**
 * Mor işaretli span'in nitelikleri. data-card-front'u CardWordHover okuyor:
 * fare üstüne gelince kartın Türkçe karşılığını ve hoparlörü gösteren
 * pencere tek bir yerde, olay devretmeyle açılıyor — yüzlerce kelimenin her
 * biri kendi dinleyicisini taşımıyor.
 */
export const cardMarkProps = (front: string) => ({
  style: CARD_MARK_STYLE,
  'data-card-front': front,
});

/**
 * Metni olduğu gibi yazar, yalnızca kart kelimelerini mor işaretler.
 * Soru ve şık gibi başka işaret taşımayan kısa metinler için.
 * (Katmanlı'nın transkriptleri zorluk çizgilerini de taşıyan MarkedText'i
 * kullanıyor; kart kuralı ikisinde de aynı: cardTerms.)
 */
export const CardMarkedText: React.FC<{ text: string }> = ({ text }) => {
  const cards = useCardMatcher();
  const ranges = useMemo(() => cardRanges(text, cards), [text, cards]);
  if (ranges.length === 0) return <>{text}</>;

  const out: React.ReactNode[] = [];
  let cursor = 0;
  ranges.forEach((r, i) => {
    if (r.start > cursor) out.push(text.slice(cursor, r.start));
    out.push(
      <span key={i} {...cardMarkProps(r.front)}>
        {text.slice(r.start, r.end)}
      </span>
    );
    cursor = r.end;
  });
  if (cursor < text.length) out.push(text.slice(cursor));
  return <>{out}</>;
};
