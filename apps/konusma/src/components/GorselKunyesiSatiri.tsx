/**
 * FOTOĞRAF KÜNYESİ
 *
 * Openverse'ten gelen kareler Creative Commons lisanslı ve çoğu ATIF
 * İSTİYOR — fotoğrafçının adı ve lisans gösterilmezse lisans ihlal
 * edilmiş olur. Bu satır o yüzden isteğe bağlı değil; fotoğrafın
 * göründüğü her yerde (alıştırma ekranı ve geçmiş) çiziliyor.
 *
 * Görsel yüklenen ya da yapay zekâ ürettiği için künyesi olmayan
 * kayıtlarda hiçbir şey çizilmiyor; bileşen null dönüyor.
 *
 * Küçük ve sessiz duruyor: bilgi değil yükümlülük. Ekranın işi
 * betimleme, künye kenarda kalmalı.
 */

import React from 'react';
import type { GorselKunyesi } from '../types';

export const GorselKunyesiSatiri: React.FC<{ kunye?: GorselKunyesi }> = ({ kunye }) => {
  if (!kunye) return null;

  const ad = <span className="text-ink-2">{kunye.atif}</span>;

  return (
    <p className="px-3 py-2 text-[11px] leading-relaxed text-ink-3">
      Fotoğraf:{' '}
      {kunye.kaynakSayfa ? (
        <a
          href={kunye.kaynakSayfa}
          target="_blank"
          rel="noreferrer noopener"
          className="text-brand-strong underline underline-offset-2"
        >
          {kunye.atif}
        </a>
      ) : (
        ad
      )}
      {' · '}
      {kunye.lisans}
    </p>
  );
};
