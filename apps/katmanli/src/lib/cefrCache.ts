/**
 * Yerel listede bulunmayan kelimeler icin yapay zeka seviyelendirmesi
 * ve onun onbellegi.
 *
 * shared/vocab/cefrWords.json 9394 kelimeyle metinlerin %86-99'unu
 * karsiliyor. Buraya yalnizca artakalan uzmanlik kelimeleri gelir.
 * Her kelime OMRUNDE BIR KEZ sorulur: sonuc onbellege yazilir ve
 * onbellek senkron listesinde oldugu icin diger cihazlariniza da gider.
 */

import { CefrLevel, levelOf, CEFR_ORDER } from '../../../../shared/vocab/cefr';
import { apiFetch } from './userKeys';
import { stampLocalChange, scheduleAutoSync } from './syncClient';

const CACHE_KEY = 'layered_learning_cefr_cache_v1';

/** Modelin de siniflandiramadigi kelime; tekrar tekrar sormamak icin. */
const UNCLASSIFIABLE = '?';

type CefrCacheData = Record<string, string>;

let memoryCache: CefrCacheData | null = null;

function loadCache(): CefrCacheData {
  if (memoryCache) return memoryCache;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    memoryCache = parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    memoryCache = {};
  }
  return memoryCache!;
}

function saveCache(cache: CefrCacheData): void {
  memoryCache = cache;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    stampLocalChange(CACHE_KEY);
    scheduleAutoSync();
  } catch (e) {
    console.error('CEFR onbellegi kaydedilemedi:', e);
  }
}

/** Onbellekte var mi? Yoksa veya siniflandirilamadiysa null. */
export function cachedLevel(word: string): CefrLevel | null {
  const value = loadCache()[word.trim().toLowerCase()];
  if (!value || value === UNCLASSIFIABLE) return null;
  return CEFR_ORDER.includes(value as CefrLevel) ? (value as CefrLevel) : null;
}

/** Daha once sorulmus mu (sonuc bulunamamis olsa bile)? */
export function isResolved(word: string): boolean {
  return loadCache()[word.trim().toLowerCase()] !== undefined;
}

/**
 * Once yerel liste, sonra onbellek.
 * Yapay zekaya SORMAZ; ag istegi yapmayan senkron sorgudur.
 */
export function levelOfCached(word: string): CefrLevel | null {
  return levelOf(word) ?? cachedLevel(word);
}

/**
 * Verilen kelimelerden yerel listede ve onbellekte OLMAYANLARI yapay
 * zekaya sorar, sonucu onbellege yazar ve bulunanlari dondurur.
 *
 * Hata durumunda sessizce bos doner: seviye gostergesi eksik kalir ama
 * uygulama calismaya devam eder.
 */
export async function classifyMissingWords(
  words: string[],
  onProgress?: (done: number, total: number) => void
): Promise<Record<string, CefrLevel>> {
  const cache = loadCache();

  // Bosluk korunur: "carry out" gibi kaliplarin seviyesi de burada sorulur
  const pending = [...new Set(
    words.map((w) => w.trim().toLowerCase().replace(/\s+/g, ' ')).filter(Boolean)
  )].filter((w) => levelOf(w) === null && cache[w] === undefined);

  if (pending.length === 0) return {};

  const found: Record<string, CefrLevel> = {};
  const CHUNK = 50; // sunucu tek istekte en fazla 60 kabul ediyor
  let processed = 0;

  for (let i = 0; i < pending.length; i += CHUNK) {
    const chunk = pending.slice(i, i + CHUNK);
    try {
      const res = await apiFetch('/api/classify-cefr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words: chunk }),
      });

      if (!res.ok) {
        console.warn(`CEFR siniflandirma ${res.status} dondu; bu grup atlaniyor.`);
        continue; // Basarisiz grubu onbellege YAZMA ki sonra tekrar denensin
      }

      const data = await res.json();
      const levels = (data?.levels || {}) as Record<string, string>;

      for (const word of chunk) {
        const level = levels[word];
        if (level && CEFR_ORDER.includes(level as CefrLevel)) {
          cache[word] = level;
          found[word] = level as CefrLevel;
        } else {
          // Model bu kelimeyi dondurmedi; bir daha sormamak icin isaretle
          cache[word] = UNCLASSIFIABLE;
        }
      }
    } catch (err) {
      console.warn('CEFR siniflandirma istegi basarisiz:', err);
      continue;
    } finally {
      processed += chunk.length;
      onProgress?.(Math.min(processed, pending.length), pending.length);
    }
  }

  if (Object.keys(found).length > 0 || pending.length > 0) saveCache(cache);
  return found;
}

/** Onbellekteki kayit sayisi (ayarlar ekraninda gostermek icin). */
export function cachedWordCount(): number {
  return Object.keys(loadCache()).length;
}

/** Onbellegi temizler; kelimeler bir daha sorulabilir hale gelir. */
export function clearCefrCache(): void {
  memoryCache = {};
  try {
    localStorage.removeItem(CACHE_KEY);
    stampLocalChange(CACHE_KEY);
    scheduleAutoSync();
  } catch (e) {
    console.error('CEFR onbellegi silinemedi:', e);
  }
}
