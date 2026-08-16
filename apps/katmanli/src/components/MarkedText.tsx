import React, { useMemo } from 'react';

interface Props {
  text: string;
  /** Alti cizilecek kelimeler, kucuk harfle. */
  unknown: Set<string>;
}

/**
 * Metni oldugu gibi yazar, yalnizca kullanicinin bilmedigi kelimelerin
 * altini cizer.
 *
 * Kelimeler <span> icine alinir ama metnin akisi bozulmaz: bosluklar ve
 * noktalama aynen korunur, boylece fareyle secim (SelectionToCard) ve
 * kopyalama beklendigi gibi calismaya devam eder.
 *
 * Cizgi noktali ve mürekkep tonunda: hem beyaz zeminde hem de "canli
 * konusuluyor" vurgusunun sari zemininde okunur, ama okumayi bolmez.
 */
export const MarkedText: React.FC<Props> = ({ text, unknown }) => {
  const parts = useMemo(() => {
    if (unknown.size === 0) return null;
    // Yakalama grubu sayesinde kelimeler VE aralarindaki metin korunur
    return text.split(/([A-Za-z][A-Za-z'-]*)/g);
  }, [text, unknown]);

  if (!parts) return <>{text}</>;

  return (
    <>
      {parts.map((part, i) => {
        // Tek indisler yakalanan kelimeler, ciftler aradaki metin
        if (i % 2 === 1 && unknown.has(part.toLowerCase())) {
          return (
            <span
              key={i}
              style={{
                textDecoration: 'underline',
                textDecorationStyle: 'dotted',
                textDecorationColor: 'var(--marker-ink, #6B5312)',
                textDecorationThickness: '1.5px',
                textUnderlineOffset: '3px',
              }}
            >
              {part}
            </span>
          );
        }
        return part;
      })}
    </>
  );
};
