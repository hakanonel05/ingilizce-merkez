import { useEffect, useMemo, useState } from 'react';
import { CefrLevel } from '../../../../shared/vocab/cefr';
import { getAllCards, VocabCard, VOCAB_CHANGED_EVENT } from '../../../../shared/vocab/vocabStore';
import { buildLessonInsight, LessonInsight, DEFAULT_USER_LEVEL } from './lessonInsight';

/**
 * Ders zorluk cozumlemesini tek yerden saglar.
 *
 * Hem ozet paneli hem de metindeki alti cizme ayni sonucu kullanmali;
 * ayri ayri hesaplasalardi kart eklendigi anda ikisi birbirinden farkli
 * seyler gosterebilirdi. Kart destesi degistiginde (VOCAB_CHANGED_EVENT)
 * kendini tazeler, boylece kelime karti eklenince oran ve alti cizili
 * kelimeler aninda guncellenir.
 */
export function useLessonInsight(
  text: string,
  userLevel: CefrLevel = DEFAULT_USER_LEVEL,
  /** Yapay zeka siniflandirmasindan sonra yeniden hesaplamak icin artirilir. */
  refreshToken = 0
): { insight: LessonInsight; unknownSet: Set<string> } {
  const [cards, setCards] = useState<VocabCard[]>([]);

  useEffect(() => {
    let alive = true;
    const load = () => {
      getAllCards()
        .then((c) => { if (alive) setCards(c); })
        .catch((e) => console.error('Kelime kartlari okunamadi:', e));
    };
    load();
    window.addEventListener(VOCAB_CHANGED_EVENT, load);
    return () => {
      alive = false;
      window.removeEventListener(VOCAB_CHANGED_EVENT, load);
    };
  }, []);

  const insight = useMemo(
    () => buildLessonInsight(text, userLevel, cards),
    [text, userLevel, cards, refreshToken]
  );

  // Alti cizilecek kelimeler; metinde gectigi haliyle (kucuk harf)
  const unknownSet = useMemo(
    () => new Set(insight.unknownWords.map((w) => w.word)),
    [insight]
  );

  return { insight, unknownSet };
}
