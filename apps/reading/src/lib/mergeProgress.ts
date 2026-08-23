/**
 * BULUT + YEREL ILERLEMENIN BIRLESTIRILMESI
 *
 * App.tsx'ten ayri duruyor cunku burasi veri kaybinin onlendigi yer;
 * tek basina sinanabilmesi gerekiyor.
 */

import { UserProgress } from '../types';

/** Kelime durumlarinda ilerleme sirasi: geri gitmez. */
const WORD_STATUS_RANK: Record<string, number> = {
  unstudied: 0,
  studied: 1,
  learned: 2,
};

/**
 * Buluttaki ilerlemeyi yereldekiyle BIRLESTIRIR.
 *
 * NEDEN: eskiden bulut satiri yerelin uzerine dogrudan yaziliyordu
 * (`cp.word_status || prev.wordStatus`). Zaman damgasi karsilastirmasi
 * da yoktu. Supabase projesi askidayken calisip sonra tekrar giris
 * yapildiginda bulutta duran ESKI satir, yeni calismanin ustune yaziyor
 * ve 5 saniye sonra ayni eski veri buluta geri gonderiliyordu; yani
 * calisma iki tarafta da siliniyordu.
 *
 * Cozum "hangisi yeni" degil, "hicbiri kaybolmasin": ilerleme verisi
 * tek yonlu artan bir sey oldugu icin alanlar birlesimle/en yuksekle
 * toplanabiliyor. Iki cihazda ayni gun calisilsa bile ikisi de kalir.
 */
export function mergeCloudProgress(local: UserProgress, cloud: any): UserProgress {
  const mergedWordStatus: UserProgress['wordStatus'] = { ...(cloud?.word_status || {}) };
  for (const [term, status] of Object.entries(local.wordStatus || {})) {
    const current = mergedWordStatus[term];
    // Daha ileri durum kazanir: learned > studied > unstudied
    if (!current || (WORD_STATUS_RANK[status] ?? 0) > (WORD_STATUS_RANK[current] ?? 0)) {
      mergedWordStatus[term] = status;
    }
  }

  const mergedScores: UserProgress['scores'] = { ...(cloud?.scores || {}) };
  for (const [id, entry] of Object.entries(local.scores || {})) {
    const current = mergedScores[Number(id)];
    // Ayni parca iki tarafta da cozulduyse yuksek puan kalir
    if (!current || (entry?.score ?? 0) >= (current?.score ?? 0)) {
      mergedScores[Number(id)] = entry;
    }
  }

  const union = (a: number[] = [], b: number[] = []) => [...new Set([...a, ...b])];

  return {
    ...local,
    completedPassages: union(local.completedPassages, cloud?.completed_passages),
    favoritePassages: union(local.favoritePassages, cloud?.favorite_passages),
    wordStatus: mergedWordStatus,
    scores: mergedScores,
    dailyStreak: Math.max(local.dailyStreak || 0, cloud?.daily_streak || 0),
    totalTimeSpent: Math.max(local.totalTimeSpent || 0, cloud?.total_time_spent || 0),
    // Alistirma cevaplarinda anahtar bazinda birlestir; cakisirsa yerel kalir
    workbookState: { ...(cloud?.workbook_state || {}), ...(local.workbookState || {}) },
  };
}
