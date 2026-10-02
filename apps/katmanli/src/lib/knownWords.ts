/**
 * "Biliyorum" dedigin kelimeler.
 *
 * Anlama orani seviyeye gore TAHMIN ediyor: seviyenin ustundeki her kelime
 * bilinmiyor sayiliyor. Oysa B1 bir okur pek cok B2 kelimeyi zaten biliyor
 * ve bunlar icin kart acmak anlamsiz. Burasi o kelimeleri kart olmadan
 * "bilinir" diye isaretlemenin yolu.
 *
 * Senkron listesinde (shared/vocab/syncClient LOCAL_KEYS) oldugu icin
 * diger cihazlara da gider.
 */

import { stampLocalChange, scheduleAutoSync } from './syncClient';

const STORAGE_KEY = 'layered_learning_known_words_v1';

/** Liste degisince yayinlanir; cozumleme kendini tazeler. */
export const KNOWN_WORDS_CHANGED_EVENT = 'known-words-changed';

const normalize = (word: string) => word.trim().toLowerCase().replace(/\s+/g, ' ');

/** Senkron arka planda yazabildigi icin her seferinde depodan okunur. */
export function getKnownWords(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set();
  }
}

export function markWordKnown(word: string): void {
  const term = normalize(word);
  if (!term) return;
  const known = getKnownWords();
  if (known.has(term)) return;
  known.add(term);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...known]));
    stampLocalChange(STORAGE_KEY);
    scheduleAutoSync();
  } catch (e) {
    console.error('Bilinen kelimeler kaydedilemedi:', e);
  }
  window.dispatchEvent(new Event(KNOWN_WORDS_CHANGED_EVENT));
}
